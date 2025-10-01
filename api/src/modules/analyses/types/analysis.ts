import { GeminiResponse } from "../../articles/dtos/gemini-response";

export type Analysis = GeminiResponse & {
  id: string;
  articleId: string;
  slug: string;
  createdAt: string;
};
