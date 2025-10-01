export type Analysis = {
  slug: string;
  summary: string;
  sentiment: "negative" | "neutral" | "positive" | "mixed";
  framing: {
    narrative: string;
    terms: {
      term: string;
      tone: "negative" | "neutral" | "positive";
      analysis: string;
    }[];
    claims: {
      claim: string;
      classification: "claim" | "opinion" | "speculation";
      verification: {
        status:
          | "verified"
          | "contradicted"
          | "unconfirmed"
          | "insufficient evidence";
        sources: {
          sourceName: string;
          sourceUrl: string;
          reliability: "high" | "medium" | "low";
        }[];
        justification: string;
      };
    }[];
    facts: {
      fact: string;
      sourceQuote: string;
      sourceName: string;
      sourceUrl: string;
      confidence: number;
      confidenceJustification: string;
    }[];
  };
  confidence: number;
};
