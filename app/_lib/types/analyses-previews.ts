import type { BaseCard } from "./card";

export type Preview = BaseCard & {
  analysis: {
    slug: string;
    biasScore?: number;
    factualScore?: number;
    sentiment?: "negative" | "mixed" | "positive";
  }
}

export type PreviewsResult = {
  previews: Preview[];
  totalResults: number;
}
