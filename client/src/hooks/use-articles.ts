import { useCallback, useState } from "react";
import http from "../utils/http";
import type { AnalyzeUrlData } from "../lib/schemas/analyze-url";
import type { ArticleDetailsDTO } from "@shared/dtos/article-details";
import type { ArticlePreviewDTO } from "@shared/dtos/article-preview";
import type { AnalyzeMetaDTO } from "@shared/dtos/analyze-meta";
import type { PaginationInfo } from "@shared/types/pagination-info";

const useArticles = () => {
  const [isArticleLoading, setIsArticleLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previews, setPreviews] = useState<ArticlePreviewDTO[]>([]);
  const [previewsLoading, setPreviewsLoading] = useState(false);
  const [article, setArticle] = useState<ArticleDetailsDTO | null>(null);

  // Queue a user-submitted article for analysis
  const analyzeArticle = useCallback(async (data: AnalyzeUrlData) => {
    setIsAnalyzing(true);

    try {
      const response = await http<AnalyzeMetaDTO>("/articles", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.data) {
        const analysis: AnalyzeMetaDTO = response.data;

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

  // Fetch full data of an article including analysis and source
  const getArticleDetails = useCallback(async (slug: string) => {
    setArticle(null);
    setIsArticleLoading(true);

    try {
      const response = await http<ArticleDetailsDTO>(`/articles/${slug}`, {
        method: "GET",
      });

      if (response.data) {
        setArticle(response.data);
      }
    } catch (error) {
      console.error("Error fetching article details:", error);
      setArticle(null);
    } finally {
      setIsArticleLoading(false);
    }
  }, []);

  // Fetch article preview data for discovery pages
  const getArticlePreviews = useCallback(
    async (params?: {
      page?: string;
      pageSize?: string;
      sources?: string[];
      bias?: string[];
      sort?: string;
    }) => {
      try {
        setPreviewsLoading(true);
        const queryParams = new URLSearchParams();

        const page = params?.page || "1";
        const pageSize = params?.pageSize || "21";
        const sort = params?.sort || "date_desc";

        queryParams.append("page", page);
        queryParams.append("pageSize", pageSize);
        queryParams.append("sort", sort);

        if (params?.sources && params.sources.length > 0) {
          queryParams.append("sources", params.sources.join(","));
        }

        if (params?.bias && params.bias.length > 0) {
          queryParams.append("bias", params.bias.join(","));
        }

        const queryString = queryParams.toString();
        const url = `/articles?${queryString}`;

        const response = await http<{
          paginationInfo: PaginationInfo;
          previews: ArticlePreviewDTO[];
        }>(url, {
          method: "GET",
        });

        if (response.data) {
          setPreviews(response.data.previews || []);
        } else {
          setPreviews([]);
        }
      } catch (error) {
        console.error("Error fetching article previews:", error);
        setPreviews([]);
      } finally {
        setPreviewsLoading(false);
      }
    },
    [],
  );

  return {
    analyzeArticle,
    getArticleDetails,
    getArticlePreviews,
    isArticleLoading,
    isAnalyzing,
    article,
    previews,
    previewsLoading,
  };
};

export default useArticles;
