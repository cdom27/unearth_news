import type { Analysis } from "../types/analysis";
import type { Article } from "../types/article";
import type { Source } from "../types/source";

export type ArticleDetails = {
  article: Article;
  source: Source;
  analysis: Analysis;
};
