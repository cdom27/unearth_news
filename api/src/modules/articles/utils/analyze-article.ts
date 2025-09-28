import model from "../../shared/utils/vertex-client";

const analyzeArticle = async (parsedArticle: {
  title: string | null | undefined;
  byline: string | null | undefined;
  content: string | null | undefined;
  length: number | null | undefined;
  excerpt: string | null | undefined;
}) => {
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
