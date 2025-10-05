type Sentiment = "negative" | "neutral" | "positive" | "mixed";

type Tone = "negative" | "neutral" | "positive";

type Classification = "claim" | "opinion" | "speculation";

type Status =
  | "verified"
  | "contradicted"
  | "unconfirmed"
  | "insufficient evidence";

type Reliability = "high" | "medium" | "low";

type Source = {
  sourceName: string;
  sourceUrl: string;
  reliability: Reliability;
};

type Verification = {
  status: Status;
  sources: Source[];
  justification: string;
};

type Claim = {
  claim: string;
  classification: Classification;
  verification: Verification;
};

type Term = {
  term: string;
  tone: Tone;
  analysis: string;
};

type Framing = {
  narrative: string;
  terms: Term[];
  claims: Claim[];
};

export type AnalysisDTO = {
  slug: string;
  summary: string;
  sentiment: Sentiment;
  framing: Framing;
  confidence: number;
};
