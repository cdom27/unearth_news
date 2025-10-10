export type SortOptions = "date_desc" | "date_asc";
export type Bias = "left" | "lean-left" | "center" | "lean-right" | "right";

export type ArticlePreviewQuery = {
  page?: number;
  pageSize?: number;
  sources?: string;
  bias?: string;
  sort?: SortOptions;
};
