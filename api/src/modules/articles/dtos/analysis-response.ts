import { NewsApiArticle } from "../../shared/lib/dtos/news-api-response";

export type AnalysisResponse = {
  slug: string;
  relatedArticles: NewsApiArticle[];
};
