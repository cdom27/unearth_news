import { useCallback, useState } from "react";
import http from "../utils/http";
import type { AnalyzeUrlData } from "../lib/schemas/analyze-url";
import type { AnalysisResponse } from "../lib/types/analysis-response";
import type { ArticleDetailsDTO } from "@shared/dtos/article-details";

const useArticles = () => {
  const [isArticleLoading, setIsArticleLoading] = useState(false);
  const [article, setArticle] = useState<ArticleDetailsDTO | null>(null);

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

  const getArticleDetails = useCallback(async (slug: string) => {
    setIsArticleLoading(true);

    try {
      const response = await http<ArticleDetailsDTO>(`/articles/${slug}`, {
        method: "GET",
      });

      if (response.data) {
        console.log("data retrieved:", response.data);
        setArticle(response.data);
      }
    } catch (error) {
      console.error("Error fetching article details:", error);
      setArticle(null);
    } finally {
      setIsArticleLoading(false);
    }
  }, []);

  return { analyzeArticle, getArticleDetails, isArticleLoading, article };
};

export default useArticles;
