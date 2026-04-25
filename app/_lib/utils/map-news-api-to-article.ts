import { NewsAPIArticle } from "@/app/_lib/types/news-api";
import { Article } from "@/app/_lib/types/article";

export default function mapNewsApiToArticle(
  apiArticle: NewsAPIArticle,
): Article | null {
  // avoid showing the user an article with critical data missing
  if (!apiArticle.title || !apiArticle.url) {
    return null;
  }

  return {
    title: apiArticle.title,
    articleURL: apiArticle.url,
    sourceName: apiArticle.source?.name || "Unnamed Source",
    thumbnailURL: apiArticle.urlToImage || undefined,
    publishedTime: apiArticle.publishedAt || undefined,
    excerpt: apiArticle.description || undefined,
  };
}
