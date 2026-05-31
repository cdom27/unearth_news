import { articles, sources, analyses } from "@/app/_lib/db/schema";
import type { ParsedArticleDTO } from "./dtos/article";
import { parseArticle } from "./utils/parse-article";
import { db } from "@/app/_lib/db/client";
import { slugify } from "./utils/slugify";
import { anthropic } from "./utils/ai/anthropic/anthropic";
import type { AnalysisResultDTO } from "./dtos/analysis-result";
import type { SummaryDTO } from "./dtos/summary";
import type { AnalysisDTO } from "./dtos/analysis";
import { eq } from "drizzle-orm";
import type { MetaDTO } from "./dtos/meta";
import type { ClaimExtractionDTO } from "./dtos/claim-extraction";
import { search } from "./utils/ai/exa/exa";
import { ClaimVerificationDTO } from "./dtos/claim-verification";
import { Claim } from "./types/claim";

export async function analyzeArticle(url: string): Promise<AnalysisResultDTO> {
  try {
    const hostname = new URL(url).hostname;

    let article = await db.query.articles.findFirst({
      where: (articles, { eq }) => eq(articles.url, url),
    });

    let parsedData;

    // ensure an article record exists prior to attempting analysis
    if (!article) {
      parsedData = (await parseArticle(url)) as ParsedArticleDTO;

      if (!parsedData || !parsedData.article) {
        // future: save fail data in db
        return { success: false, error: "Unable to parse article" };
      }

      // must have a source prior to saving the article in the db
      let source = await db.query.sources.findFirst({
        where: (sources, { eq }) => eq(sources.url, hostname),
      });

      if (!source) {
        const newSource = await db
          .insert(sources)
          .values({
            name: parsedData.article.siteName || "",
            url: hostname,
          })
          .returning();

        source = newSource[0];
      }

      // save article
      const newArticle = await db
        .insert(articles)
        .values({
          sourceId: source.id,
          url: url,
          title: parsedData.article.title || "",
          language: parsedData.article.lang || "",
          byline: parsedData.article.byline || "",
          excerpt: parsedData.article.excerpt || "",
          textContent: parsedData.article.textContent || "",
          publishedTime: parsedData.article.publishedTime
            ? new Date(parsedData.article.publishedTime)
            : new Date(),
          createdAt: new Date(),
          keywords: parsedData.keywords || null,
          thumbnailUrl: parsedData.thumbnailURL || null,
        })
        .returning();

      article = newArticle[0];

      if (!article) {
        return {
          success: false,
          error: "Unexpected error while processing article",
        };
      }
    }

    // avoid duplicate analysis with precheck
    let analysis = await db.query.analyses.findFirst({
      where: (analyses, { eq }) => eq(analyses.articleId, article.id),
    });

    let currentStatus = analysis?.status;
    let analysisId = analysis?.id ?? "";
    let analysisSlug = analysis?.slug ?? "";

    if (currentStatus === "completed") {
      return { success: true, slug: analysisSlug };
    }

    if (!analysis) {
      analysisSlug = slugify(article.title);

      const summaryResponse = await anthropic(
        "claude-haiku-4-5",
        "summarize",
        article.textContent,
      );

      if (!summaryResponse.data) {
        console.error("No summary data returned for: ", article.id);
        return { success: false, error: "Unexpected error" };
      }
      const parsedSummaryData = summaryResponse.data as SummaryDTO;

      const newAnalysis = await db
        .insert(analyses)
        .values({
          articleId: article.id,
          slug: analysisSlug,
          summary: parsedSummaryData,
          status: "summarized",
          meta: {
            summary: summaryResponse.meta,
            analysis: null,
            claimExtraction: null,
            claimVerification: null,
          },
        })
        .returning();

      analysisId = newAnalysis[0].id;
      currentStatus = "summarized";

      analysis = newAnalysis[0];

      console.log("Completed summary for: ", analysisId);
    }

    if (currentStatus === "summarized") {
      const analysisResponse = await anthropic(
        "claude-sonnet-4-6",
        "analyze",
        article.textContent,
      );

      if (!analysisResponse.data) {
        console.error("No analysis data returned for: ", analysis.id);
        return { success: false, error: "Unexpected error" };
      }
      const parsedAnalysisData = analysisResponse.data as AnalysisDTO;

      const updatedAnalysis = await db
        .update(analyses)
        .set({
          sentiment: parsedAnalysisData.sentiment,
          framing: parsedAnalysisData.framing,
          biasScore: parsedAnalysisData.biasScore,
          status: "analyzed",
          meta: {
            ...(analysis.meta as MetaDTO),
            analysis: analysisResponse.meta,
          },
          updatedAt: new Date(),
        })
        .where(eq(analyses.id, analysisId))
        .returning();

      currentStatus = "analyzed";

      analysis = updatedAnalysis[0];

      console.log("Completed analysis for: ", analysisId);
    }

    if (currentStatus === "analyzed") {
      const extractionResponse = await anthropic(
        "claude-sonnet-4-6",
        "extract",
        article.textContent,
      );

      if (!extractionResponse.data) {
        console.error("No analysis data returned for: ", analysis.id);
        return { success: false, error: "Unexpected error" };
      }
      const parsedExtractionData =
        extractionResponse.data as ClaimExtractionDTO;

      const parsedClaimArr = parsedExtractionData.claims.map((claim) => ({
        content: `${claim}`,
        verification: null,
      }));

      const updatedAnalysis = await db
        .update(analyses)
        .set({
          claims: parsedClaimArr,
          status: "claims_extracted",
          updatedAt: new Date(),
        })
        .where(eq(analyses.id, analysisId))
        .returning();

      currentStatus = "claims_extracted";

      analysis = updatedAnalysis[0];

      console.log("Completed claim extraction for: ", analysisId);
    }

    if (currentStatus === "claims_extracted") {
      const claims = analysis.claims as Claim[];

      for (const claim of claims) {
        const searchResult = await search(claim.content);
        claim.verification = searchResult as unknown as ClaimVerificationDTO;
      }

      const updatedAnalysis = await db
        .update(analyses)
        .set({
          claims: claims,
          status: "claims_verified",
          updatedAt: new Date(),
        })
        .where(eq(analyses.id, analysisId))
        .returning();

      analysis = updatedAnalysis[0];
      currentStatus = "claims_verified";

      console.log("Completed claim verification for: ", analysisId);
    }

    if (currentStatus === "claims_verified") {
      // ok I know this deserves jail time but im just testing
      const source = await db.query.sources.findFirst({
        where: (sources, { eq }) => eq(sources.url, hostname),
      });

      let baseScore = -1;
      const reporting = source?.factualReporting;

      if (!reporting || reporting === "" || reporting === "N/A") {
        baseScore = -1;
      } else if (reporting === "Very Low") {
        baseScore = 0.1;
      } else if (reporting === "Low") {
        baseScore = 0.36;
      } else if (reporting === "Mixed") {
        baseScore = 0.63;
      } else if (reporting === "Mostly Factual") {
        baseScore = 0.9;
      } else if (reporting === "High") {
        baseScore = 0.95;
      } else if (reporting === "Very High") {
        baseScore = 1.0;
      }

      let factualScore = baseScore;
      if (baseScore !== -1) {
        const variance = Math.random() * 0.04 - 0.02;
        factualScore = Number(
          Math.max(0, Math.min(1, baseScore + variance)).toFixed(2),
        );
      }

      const updatedAnalysis = await db
        .update(analyses)
        .set({
          factualScore: factualScore,
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(analyses.id, analysisId))
        .returning();

      analysis = updatedAnalysis[0];
      currentStatus = "completed";

      console.log("Completed analysis: ", analysisId);
    }

    return { success: true, slug: analysisSlug };
  } catch (error) {
    console.error("Unexpected error when processing the URL:", url, error);

    return {
      success: false,
      error: "Unexpected error while processing article",
    };
  }
}
