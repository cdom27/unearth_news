type Tone = "negative" | "neutral" | "positive";

type Term = {
  term: string;
  tone: Tone;
  analysis: string;
};

type RhetoricalDevice = {
  device: string;
  example: string;
  explanation: string;
};

type Sourcing = {
  balance: "one-sided" | "mostly-one-sided" | "balanced";
  notes: string;
};

export type FramingDTO = {
  narrative: string;
  terms: Term[];
  devices: RhetoricalDevice[];
  sourcing: Sourcing;
};
