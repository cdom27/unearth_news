import { articles, sources } from "@/app/_lib/db/schema";
import type { ParsedArticle } from "./types/article";
import { parseArticle } from "./utils/parse-article";
import { db } from "@/app/_lib/db/client";

export async function analyzeArticle(url: string) {
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
        return { success: false, error: "Unable to parse article" };
      }
    }

    // avoid duplicate analysis with precheck
    // let analysis = await db.query.analyses.findFirst({
    //   where: (analyses, { eq }) => eq(analyses.articleId, article.id),
    // });

    // if (!analysis) {
    //   // send parsed data to an llm
    //   // parse response
    //   // save analysis
    //   // return analysis slug
    // }

    return { slug: "some-analysis-slug" };
  } catch (error) {
    console.error("unexpected error: ", error);
    return null;
  }
}
