import { articles, sources } from "@/app/_lib/db/schema";
import type { ParsedArticle } from "./types/article";
import { parseArticle } from "./utils/parse-article";
import { db } from "@/app/_lib/db/client";
import { slugify } from "./utils/slugify";
import { anthropic } from "./utils/ai/anthropic/anthropic";
import { AnalysisResult } from "./types/analysis-result";

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

    const analysisSlug = slugify(article.title);

    // avoid duplicate analysis with precheck
    const analysis = await db.query.analyses.findFirst({
      where: (analyses, { eq }) => eq(analyses.articleId, article.id),
    });

    if (!analysis) {
      // summarize article (currently getting thrown into the void!!!)
      const summary = await anthropic(
        "claude-sonnet-4-6",
        "summarize",
        article.textContent,
      );
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
