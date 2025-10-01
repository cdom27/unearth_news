import { Analysis } from "../../analyses/types/analysis";
import { Source } from "../../sources/types/source";
import { Article } from "../types/article";

type SourcePublic = Pick<Source, "name" | "domain">;

type ArticlePublic = Pick<
  Article,
  | "url"
  | "title"
  | "language"
  | "byline"
  | "excerpt"
  | "textContent"
  | "publishedTime"
>;

type AnalysisPublic = Pick<
  Analysis,
  "slug" | "summary" | "sentiment" | "framing"
>;

type ExtendedAnalysisPublic = AnalysisPublic & {
  confidence: number;
};

export type ArticleDetails = {
  article: ArticlePublic;
  source: SourcePublic;
  analysis: ExtendedAnalysisPublic;
};
