export type Bias = "left" | "lean-left" | "center" | "lean-right" | "right";

export type Sentiment = "negative" | "neutral" | "positive" | "mixed";

type Tone = "negative" | "neutral" | "positive";

type Classification = "claim" | "opinion" | "speculation";

type Status =
  | "verified"
  | "contradicted"
  | "unconfirmed"
  | "insufficient evidence";

type Reliability = "high" | "medium" | "low";

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

export type Source = {
  sourceName: string;
  sourceUrl: string;
  reliability: Reliability;
};

export type Framing = {
  narrative: string;
  terms: Term[];
  claims: Claim[];
};
