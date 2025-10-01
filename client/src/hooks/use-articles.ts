import { useCallback, useState } from "react";
import http from "../utils/http";
import type { AnalyzeUrlData } from "../lib/schemas/analyze-url";
import type { AnalysisResponse } from "../lib/types/analysis-response";

const useArticles = () => {
  const [isArticleLoading, setIsArticleLoading] = useState(false);
  const analyzeArticle = useCallback(async (data: AnalyzeUrlData) => {
    setIsArticleLoading(true);
    try {
      const response = await http<AnalysisResponse>("/articles", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.data) {
        const analysis: AnalysisResponse = response.data;
        console.log("data retrieved:", analysis);

        return analysis.slug;
      }

      return null;
    } catch (error) {
      console.error("error:", error);
      return null;
    } finally {
      setIsArticleLoading(false);
    }
  }, []);

  return { analyzeArticle, isArticleLoading };
};

export default useArticles;
