type Tone = "negative" | "neutral" | "positive";

export type Term = {
  term: string;
  tone: Tone;
  analysis: string;
};

export type RhetoricalDevice = {
  device: string;
  example: string;
  explanation: string;
};

export type Sourcing = {
  balance: "one-sided" | "mostly-one-sided" | "balanced";
  notes: string;
};

export type Framing = {
  narrative: string;
  terms: Term[];
  devices: RhetoricalDevice[];
  sourcing: Sourcing;
};
