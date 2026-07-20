import type { BaseCard } from "./card";

export type AnalysisCard = BaseCard & {
  source: {
    bias: "Left" | "Lean Left" | "Center" | "Lean Right" | "Right";
  };
  summary: string;
  sentiment: string;
  biasScore: number;
  factualScore: number;
  slug: string;
};
