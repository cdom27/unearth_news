import { GeminiResponseDTO } from "../../shared/dtos/gemini-response";

export type Analysis = GeminiResponseDTO & {
  id: string;
  articleId: string;
  slug: string;
  createdAt: string;
};
