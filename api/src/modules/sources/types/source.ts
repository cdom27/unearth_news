import type { Bias } from "@shared/types/analysis-fields";

export type Source = {
  id: string;
  name: string;
  url: string;
  slug: string;
  bias: Bias;
  factualReporting: string;
  country: string;
  mediaType: string;
  credibility: string;
  createdAt: string;
};
