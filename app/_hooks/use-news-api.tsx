import { useCallback, useState } from "react";
import type { NewsAPIResponseDTO } from "../_lib/types/news-api";
import type { ApiResponse } from "../api/_lib/build-response";

export default function useNewsAPI() {
  const [isFetching, setIsFetching] = useState(false);
  const [newsResult, setNewsResult] = useState<NewsAPIResponseDTO | null>(null);
  const [message, setMessage] = useState("");

  const fetchNews = useCallback(async () => {
    setIsFetching(true);

    try {
      const response = await fetch("/api/v1/breaking-news", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = (await response.json()) as ApiResponse<NewsAPIResponseDTO>;

      if (result.data && response.ok) {
        setMessage(result.message);
        setNewsResult(result.data);
      }
    } catch {
      setMessage("An unexpected error has occured.");
      setNewsResult(null);
    } finally {
      setIsFetching(false);
    }
  }, []);

  return { isFetching, newsResult, message, fetchNews };
}
