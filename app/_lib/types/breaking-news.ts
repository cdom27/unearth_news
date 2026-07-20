import type { BaseCard } from "./card";

export type BreakingNews = BaseCard & {
  article: {
    byline: string | null;
    url: string;
  };
};

export type BreakingNewsResult = {
  articles: BreakingNews[];
  totalResults: number;
};
