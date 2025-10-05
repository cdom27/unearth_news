type Sentiment = "negative" | "neutral" | "positive" | "mixed";

type Bias = "left" | "lean-left" | "center" | "lean-right" | "right";

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
