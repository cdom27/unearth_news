import model from "../../shared/utils/vertex-client";
import { ParsedArticle } from "../types/parsed-article";

const analyzeArticle = async (parsedArticle: ParsedArticle) => {
  const userPrompt = `I have this article: ${JSON.stringify(parsedArticle)}`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  if (result.response.candidates) {
    return result.response.candidates[0].content.parts[0].text;
  }

  return null;
};

export default analyzeArticle;
