import { useCallback, useState } from "react";
import type { ApiResponse } from "../api/_lib/build-response";
import { BreakingNewsResult } from "../_lib/types/breaking-news";

export default function useNewsAPI() {
  const [isFetching, setIsFetching] = useState(false);
  const [newsResult, setNewsResult] = useState<BreakingNewsResult | null>(null);
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

      const result = (await response.json()) as ApiResponse<BreakingNewsResult>;

      if (result.data && response.ok) {
        setMessage(result.message);
        setNewsResult(result.data);
      }
    } catch {
      setMessage("An unexpected error has occurred.");
      setNewsResult(null);
    } finally {
      setIsFetching(false);
    }
  }, []);

  return { isFetching, newsResult, message, fetchNews };
}
