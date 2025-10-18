import type { Bias } from "@shared/types/analysis-fields";

type SortOptions = "name_desc" | "name_asc";

export type SourcePreviewQuery = {
  page?: number;
  pageSize?: number;
  bias?: Bias;
  sort?: SortOptions;
};
