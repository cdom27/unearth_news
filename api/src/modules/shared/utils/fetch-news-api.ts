import fetch from "node-fetch";
import { NEWS_API_KEY } from "../../../config/env";
import type { NewsApiResponseDTO } from "../dtos/news-api-response";

const fetchNewsApiArticles = async (query: string) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=10&page=1&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(
        `News API request failed with status: ${response.status}`
      );
    }

    const data = (await response.json()) as NewsApiResponseDTO;
    return data;
  } catch (error) {
    console.warn("Failed to fetch articles from News API:", error);
    // Return empty response structure to maintain consistency
    return {
      status: "error",
      totalResults: 0,
      articles: [],
    } as NewsApiResponseDTO;
  }
};

export const fetchArticleThumbnail = async (
  title: string,
  keywords: string
) => {
  try {
    // q by title
    const titleResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        title
      )}&sortBy=publishedAt&pageSize=1&page=1&apiKey=${NEWS_API_KEY}`
    );

    if (titleResponse.ok) {
      const titleData = (await titleResponse.json()) as NewsApiResponseDTO;

      // check for results
      if (
        titleData.articles &&
        titleData.articles.length > 0 &&
        titleData.articles[0]?.urlToImage
      ) {
        return titleData.articles[0].urlToImage;
      }
    }

    // q by keyword if title yeilded zero results
    const keywordsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        keywords
      )}&sortBy=publishedAt&pageSize=1&page=1&apiKey=${NEWS_API_KEY}`
    );

    if (keywordsResponse.ok) {
      const keywordsData =
        (await keywordsResponse.json()) as NewsApiResponseDTO;

      // check for results
      if (
        keywordsData.articles &&
        keywordsData.articles.length > 0 &&
        keywordsData.articles[0]?.urlToImage
      ) {
        return keywordsData.articles[0].urlToImage;
      }
    }

    // zero results
    return "";
  } catch (error) {
    console.error("Error fetching article thumbnail:", error);
    return "";
  }
};

export default fetchNewsApiArticles;
