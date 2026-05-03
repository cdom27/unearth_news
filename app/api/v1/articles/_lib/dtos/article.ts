import { Readability } from "@mozilla/readability";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

export type ParsedArticleDTO = {
  thumbnailURL: string;
  article: ReadabilityArticle;
  keywords: string;
  slug: string;
};
