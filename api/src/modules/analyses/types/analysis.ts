import { GeminiResponse } from "../../shared/lib/dtos/gemini-response";

export type Analysis = GeminiResponse & {
  id: string;
  articleId: string;
  slug: string;
  createdAt: string;
};
