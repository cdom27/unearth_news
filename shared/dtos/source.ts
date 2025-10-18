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

export type SourceFilterDTO = {
  name: string;
  slug: string;
};

export type SourceRatingPreviewDTO = {
  name: string;
  slug: string;
  mediaType: string;
  bias: Bias;
  factualReporting: string;
  credibility: string;
};
