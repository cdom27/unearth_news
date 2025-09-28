type Sentiment = "negative" | "neutral" | "positive";

interface LeanProbability {
  left: number;
  center: number;
  right: number;
}

interface HighlightedTerm {
  term: string;
  tone: Sentiment;
}

export interface Analysis {
  sentiment: Sentiment;
  lean_probability: LeanProbability;
  highlighted_terms: HighlightedTerm[];
  ai_summary: string;
}
