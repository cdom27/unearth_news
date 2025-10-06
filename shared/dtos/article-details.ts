import type { AnalysisDTO } from "./analysis";
import type { ArticleDTO } from "./article";
import { NewsApiArticleDTO } from "./news-api";
import type { SourceDTO } from "./source";

export type ArticleDetailsDTO = {
  source: SourceDTO;
  article: ArticleDTO;
  analysis: AnalysisDTO;
  relatedArticles: NewsApiArticleDTO[];
};
