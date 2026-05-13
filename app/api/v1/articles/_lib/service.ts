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

      const updatedAnalysis = await db
        .update(analyses)
        .set({
          claims: parsedExtractionData.claims,
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
      // continue with claim verification
      // goal: verify claims from the last step and provide status?
    }

    if (currentStatus === "claims_verified") {
      // finalize analysis by calculating factual score given
      // the claim verification data
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
