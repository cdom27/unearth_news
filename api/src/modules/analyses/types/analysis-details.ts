import { AnalysisDTO } from "@shared/dtos/analysis";
import { ArticleDTO } from "@shared/dtos/article";
import { SourceDTO } from "@shared/dtos/source";

export type AnalysisDetails = {
  source: SourceDTO;
  article: ArticleDTO;
  analysis: AnalysisDTO;
};
