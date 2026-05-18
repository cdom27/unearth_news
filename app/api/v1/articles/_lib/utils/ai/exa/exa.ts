import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY);

export async function search(query: string) {
  const result = await exa.search(query, {
    numResults: 10,
    outputSchema: {
      type: "text",
    },
    systemPrompt:
      "You are a rigorous, non-partisan fact-checker. Analyze the following claim with strict neutrality — do not favor any political party, ideology, or agenda.",
    type: "deep-lite",
    contents: {
      highlights: true,
    },
  });

  return result;
}
