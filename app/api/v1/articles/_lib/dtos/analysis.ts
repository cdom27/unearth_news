import { FramingDTO } from "./framing";

export type AnalysisDTO = {
  sentiment: "mixed" | "positive" | "negative";
  framing: FramingDTO;
  biasScore: number;
};
