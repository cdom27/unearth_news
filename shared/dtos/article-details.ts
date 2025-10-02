import type { AnalysisDTO } from "./analysis";
import type { ArticleDTO } from "./article";
import type { SourceDTO } from "./source";

export type ArticleDetailsDTO = {
  source: SourceDTO;
  article: ArticleDTO;
  analysis: AnalysisDTO;
};
