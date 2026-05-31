import { NewsAPIResponseDTO } from "@/app/_lib/types/news-api";

type NewsFetchResultDTO =
  | {
      success: true;
      data: NewsAPIResponseDTO;
    }
  | { success: false; error: string };

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

    // If we need more results and there are more available, fetch additional pages
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
          // Continue with what we have
          break;
        }
      }

      result.articles.push(...additionalArticles);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Unexpected error while fetching breaking news: ", error);

    return {
      success: false,
      error: "Unexpected error while fetching breaking news",
    };
  }
}
