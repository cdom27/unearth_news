import type { Bias } from "../types/analysis-fields";

export type SourceDTO = {
  name: string;
  url: string;
  slug: string;
  bias: Bias;
  factualReporting: string;
  country: string;
  mediaType: string;
  credibility: string;
};
