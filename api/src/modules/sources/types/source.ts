type Bias = "left" | "lean-left" | "center" | "lean-right" | "right";

export type Source = {
  id: string;
  name: string;
  url: string;
  slug: string;
  bias: Bias;
  createdAt: string;
};
