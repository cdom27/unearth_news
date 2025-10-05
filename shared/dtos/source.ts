type Bias = "left" | "lean-left" | "center" | "lean-right" | "right";

export type SourceDTO = {
  name: string;
  url: string;
  slug: string;
  bias: Bias;
};
