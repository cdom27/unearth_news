export type GeminiResponse = {
  summary: string; // unbiased summary of the topic
  sentiment: "negative" | "neutral" | "positive" | "mixed"; // overall sentiment towards the topic
  framing: {
    narrative: string; // overarching framing narrative detected
    terms: {
      term: string; // term or phrase used by the author
      tone: "negative" | "neutral" | "positive";
      analysis: string; // why is this word significant?
    }[];
    claims: {
      claim: string; // claim made by the author
      classification: "claim" | "opinion" | "speculation";
      verification: {
        // is this claim true? any sources verifying or debunking claim?
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
        justification: string; // why this status?
      };
    }[];
    facts: {
      fact: string;
      sourceQuote: string;
      sourceName: string;
      sourceUrl: string;
      confidence: number; // 0-1 confidence
      confidenceJustification: string;
    }[];
  };
  meta: {
    model: string;
    confidence: number; // 0-1 overall confidence in analysis
  };
};
