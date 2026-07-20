import type { BreakingNews } from "@/app/_lib/types/breaking-news";
import type {
  NewsFetchResultDTO,
  NewsAPIResponseDTO,
} from "@/app/api/v1/breaking-news/_lib/dtos/news-api";

export async function fetchBreakingNews(
  pageSize: number = 100,
): Promise<NewsFetchResultDTO> {
  try {
    const sources =
      "associated-press,reuters,politico,the-hill,the-washington-post,the-wall-street-journal,cnn,fox-news,bbc-news,breitbart-news,axios,nbc-news,cbc-news,the-guardian-uk,abc-news,al-jazeera-english,the-hindu,the-globe-and-mail,msnbc";

    // Fetch first page
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?sources=${sources}&pageSize=${Math.min(pageSize, 100)}&apiKey=${process.env.NEWS_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = (await response.json()) as NewsAPIResponseDTO;

    if (!response.ok || !result.articles) {
      return {
        success: false,
        error: "Unexpected error while fetching breaking news",
      };
    }

    if (pageSize > 100 && result.totalResults > 100) {
      const totalPages = Math.ceil(result.totalResults / 100);
      const pagesToFetch = Math.min(Math.ceil(pageSize / 100), totalPages);

      const additionalArticles: typeof result.articles = [];

      for (let page = 2; page <= pagesToFetch; page++) {
        try {
          const additionalResponse = await fetch(
            `https://newsapi.org/v2/top-headlines?sources=${sources}&pageSize=100&page=${page}&apiKey=${process.env.NEWS_API_KEY}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const additionalResult =
            (await additionalResponse.json()) as NewsAPIResponseDTO;

          if (additionalResult.articles) {
            additionalArticles.push(...additionalResult.articles);
          }
        } catch (error) {
          console.error(`Error fetching page ${page} of breaking news:`, error);
          break;
        }
      }

      result.articles.push(...additionalArticles);
    }

    const structuredArticles: BreakingNews[] = result.articles
      .filter((a) => a.title && a.url)
      .map((article) => ({
        source: {
          name: article.source.name ?? "Unnamed Source",
          bias: null,
        },
        article: {
          title: article.title!,
          thumbnailUrl: article.urlToImage ?? null,
          publishedAt: article.publishedAt ?? null,
          excerpt: article.description ?? null,
          byline: article.author ?? null,
          url: article.url!,
        },
      }));

    return {
      success: true,
      data: {
        articles: structuredArticles,
        totalResults: result.totalResults,
      },
    };
  } catch (error) {
    console.error("Unexpected error while fetching breaking news: ", error);

    return {
      success: false,
      error: "Unexpected error while fetching breaking news",
    };
  }
}
