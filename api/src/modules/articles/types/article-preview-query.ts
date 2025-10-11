import type { Bias } from "@shared/types/analysis-fields";

export type SortOptions = "date_desc" | "date_asc";

export type ArticlePreviewQuery = {
  page?: number;
  pageSize?: number;
  sources?: string;
  bias?: Bias;
  sort?: SortOptions;
};
