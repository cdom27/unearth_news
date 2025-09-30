import fetch from "node-fetch";
import { NEWS_API_KEY } from "../../../config/env";
import { NewsApiResponse } from "../dtos/news-api-response";

const fetchNewsApiArticles = async (query: string) => {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=10&page=1&apiKey=${NEWS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`News API request failed with status: ${response.status}`);
  }

  const data = (await response.json()) as NewsApiResponse;
  return data;
};

export default fetchNewsApiArticles;
