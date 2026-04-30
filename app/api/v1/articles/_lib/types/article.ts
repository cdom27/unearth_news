import { Readability } from "@mozilla/readability";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

export type ParsedArticle = {
  thumbnailURL: string;
  article: ReadabilityArticle;
  keywords: string;
  slug: string;
};
