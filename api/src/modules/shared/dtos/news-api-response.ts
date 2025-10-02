import { NewsApiArticleDTO } from "@shared/dtos/news-api";

export type NewsApiResponseDTO = {
  status: string;
  totalResults: number;
  articles: NewsApiArticleDTO[];
};
