import {
  articles,
  sources,
  analyses,
  rejectedSubmissions,
} from "@/app/_lib/db/schema";
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
import { Claim } from "./types/claim";
import { inspectMediaSubmission } from "./utils/inspect-media-submission";

export async function analyzeArticle(url: string): Promise<AnalysisResultDTO> {
  try {
    const hostname = new URL(url).hostname;

    let article = await db.query.articles.findFirst({
      where: (articles, { eq }) => eq(articles.url, url),
    });

    let parsedData;

    // ensure an article record exists prior to attempting analysis
    if (!article) {
      const inspection = await inspectMediaSubmission(url);

      if (inspection.rejected) {
        await db.insert(rejectedSubmissions).values({
          submittedUrl: url,
          normalizedUrl: url,
          finalUrl: inspection.finalUrl,
          rejectionReason: inspection.reason,
          detectionSignals: inspection.signals,
        });

        return {
          success: false,
          error:
            inspection.reason === "known_video_platform"
              ? "Video submissions are not supported"
              : "Unable to fetch submitted page",
          status: 422,
        };
      }

      parsedData = (await parseArticle(inspection.html)) as ParsedArticleDTO;

      if (!parsedData || !parsedData.article) {
        await db.insert(rejectedSubmissions).values({
          submittedUrl: url,
          normalizedUrl: url,
          finalUrl: inspection.finalUrl,
          rejectionReason: "parse_failed",
          detectionSignals: [
            {
              type: "readability_parse",
              value: "no_article_content",
            },
          ],
        });

        return {
          success: false,
          error: "Unable to parse article",
          status: 422,
        };
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
            slug: slugify(parsedData.article.siteName || hostname),
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
        content: claim,
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

      const claimVerificationMeta = [];

      for (const claim of claims) {
        const searchResult = await search(claim.content);

        claim.verification = searchResult.data;
        claimVerificationMeta.push(searchResult.meta);
      }

      const meta = analysis.meta as MetaDTO;

      const updatedAnalysis = await db
        .update(analyses)
        .set({
          claims: claims,
          meta: {
            ...meta,
            claimVerification: {
              model: "deep-lite",
              requests: claimVerificationMeta,
            },
          },
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
      const claims = analysis.claims as Claim[];

      const verdictScores = {
        true: 1,
        mixed: 0.5,
        false: 0,
      } as const;

      const scores = claims
        .map((claim) => claim.verification?.output?.content?.verdict)
        .filter(
          (verdict): verdict is keyof typeof verdictScores =>
            verdict === "true" || verdict === "mixed" || verdict === "false",
        );

      const factualScore =
        scores.length > 0
          ? Number(
              (
                scores.reduce(
                  (sum, verdict) => sum + verdictScores[verdict],
                  0,
                ) / scores.length
              ).toFixed(2),
            )
          : -1;

      const updatedAnalysis = await db
        .update(analyses)
        .set({
          factualScore,
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
