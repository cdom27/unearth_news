import type { Bias, Framing, Sentiment } from "@shared/types/analysis-fields";

type Meta = {
  model: string;
  confidence: number;
};

export type GeminiResponseDTO = {
  summary: string;
  sentiment: Sentiment;
  bias: Bias;
  framing: Framing;
  meta: Meta;
};
