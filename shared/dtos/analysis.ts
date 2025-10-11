import type { Framing, Sentiment } from "@shared/types/analysis-fields";

export type AnalysisDTO = {
  slug: string;
  summary: string;
  sentiment: Sentiment;
  framing: Framing;
  confidence: number;
};
