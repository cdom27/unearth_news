import { Framing } from "./framing";

export type Analysis = {
  sentiment: "mixed" | "positive" | "negative";
  framing: Framing;
  biasScore: number;
};
