import model from "../../shared/utils/vertex-client";
import { Article } from "../types/article";

const analyzeArticle = async (parsedArticle: Article) => {
  const userPrompt = `
Article Metadata:
- Title: ${parsedArticle.title}
- Byline: ${parsedArticle.byline || "N/A"}
- URL: ${parsedArticle.url}
- Published Time: ${parsedArticle.publishedTime}

Excerpt: 
${parsedArticle.excerpt}

Full Text Content:
"""
${parsedArticle.textContent}
"""
`;

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
