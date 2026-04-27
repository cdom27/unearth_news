import { useCallback, useState } from "react";
import { ApiResponse } from "../api/_lib/build-response";

export default function useArticle() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeArticle = useCallback(async (url: string) => {
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/v1/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = (await response.json()) as ApiResponse<{ slug: string }>;

      if (result.data && response.ok) {
        return result.data.slug;
      }

      return null;
    } catch {
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analyzeArticle, isAnalyzing };
}
