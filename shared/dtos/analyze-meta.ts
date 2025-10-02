import { NewsApiArticleDTO } from "./news-api";

export type AnalyzeMetaDTO = {
  slug: string;
  relatedArticles: NewsApiArticleDTO[];
};
