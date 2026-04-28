import { useCallback, useState } from "react";
import { ApiResponse } from "../api/_lib/build-response";
import { normalizeURL } from "../_lib/normalize-url";

export default function useArticle() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState("");

  const analyzeArticle = useCallback(async (url: string) => {
    setIsAnalyzing(true);

    // avoid duplicate analyses and api calls if source in known to be unprocessable
    const normalizedURL = normalizeURL(url);
    if (!normalizedURL) {
      setIsAnalyzing(false);
      setMessage("Unable to process source");
      return null;
    }

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
      setMessage("Unable to process source");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analyzeArticle, isAnalyzing, message };
}
