import { articles, sources, analyses } from "@/app/_lib/db/schema";
import type { ParsedArticle } from "./types/article";
import { parseArticle } from "./utils/parse-article";
import { db } from "@/app/_lib/db/client";
import { slugify } from "./utils/slugify";
import { anthropic } from "./utils/ai/anthropic/anthropic";
import type { AnalysisResult } from "./types/analysis-result";

export async function analyzeArticle(url: string): Promise<AnalysisResult> {
  try {
    const hostname = new URL(url).hostname;

    let article = await db.query.articles.findFirst({
      where: (articles, { eq }) => eq(articles.url, url),
    });

    let parsedData;

    // ensure an article record exists prior to attempting analysis
    if (!article) {
      parsedData = (await parseArticle(url)) as ParsedArticle;

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
    let analysisId = analysis?.id;
    let analysisSlug = analysis?.slug ?? "";

    if (currentStatus === "completed") {
      return { success: true, slug: analysisSlug };
    }

    if (!analysis) {
      analysisSlug = slugify(article.title);

      // summarize article (currently getting thrown into the void!!!)
      const summaryResponse = await anthropic(
        "claude-sonnet-4-6",
        "summarize",
        article.textContent,
      );

      let parsedSummary = null;
      try {
        // Attempt to parse the JSON response from Claude
        parsedSummary = JSON.parse(summaryResponse.text);
      } catch (err) {
        console.error("Failed to parse AI summary response as JSON:", err);
      }

      const newAnalysis = await db
        .insert(analyses)
        .values({
          articleId: article.id,
          slug: analysisSlug,
          summary: parsedSummary,
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

      console.log("Completed summary for analysis: ", analysisId);
    }

    if (currentStatus === "summarized") {
      // continue with rhetorical analysis of the article
      // goal: populate sentiment, framing, and bias_score columns
    }

    if (currentStatus === "analyzed") {
      // continue with falsifiable claim extraction
      // goal: populate claims column with falsifiable claims
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
