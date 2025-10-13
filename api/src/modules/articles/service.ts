import { ArticleRepository } from "./repository";
import { AnalysisRepository } from "../analyses/repository";
import { SourceRepository } from "../sources/repository";
import { analyzeUserArticle } from "./utils/analyze-article";
import { normalizeUrl } from "./utils/normalize-url";
import parseArticle from "./utils/parse-article";
import fetchNewsApiArticles, {
  fetchArticleThumbnail,
} from "../shared/utils/fetch-news-api";
import slugify from "../shared/utils/slugify";
import type { ArticlePreviewDTO } from "@shared/dtos/article-preview";
import type { AnalyzeMetaDTO } from "@shared/dtos/analyze-meta";
import type { Result } from "../shared/types/service-result";
import type { ArticleDetailsDTO } from "@shared/dtos/article-details";

// Find articles and build article preview DTO using joins
export const findArticlePreviews = async (
  sourceIds: string[] | null,
  sort: string,
  page: number,
  pageSize: number
): Promise<Result<ArticlePreviewDTO[]>> => {
  try {
    const offset = (page - 1) * pageSize;
    const result = await ArticleRepository.findPreviewBySourceId(
      pageSize,
      offset,
      sourceIds,
      sort
    );

    return { success: true, data: result };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Internal error" };
  }
};

// Normalize variables + check for existing records before sending to model
export const analyzeArticle = async (
  url: string
): Promise<Result<AnalyzeMetaDTO>> => {
  try {
    const normalizedUrl = normalizeUrl(url);

    // article lookup
    let article = await ArticleRepository.findByText("url", normalizedUrl);
    let slug = "";

    if (!article) {
      const parsedArticle = await parseArticle(normalizedUrl);
      if (!parsedArticle) {
        return { success: false, error: "Unable to parse article" };
      }

      const thumbnailUrl = await fetchArticleThumbnail(
        parsedArticle.title,
        parsedArticle.keywords
      );

      // source lookup
      const hostname = new URL(parsedArticle.url).hostname;
      let source = await SourceRepository.findByText("url", hostname);

      if (!source) {
        const saved = await SourceRepository.save(
          parsedArticle.sourceName,
          hostname
        );

        if (!saved) {
          return {
            success: false,
            error: "Error after insert conflict: Source not found",
          };
        }

        source = saved;
      }

      article = await ArticleRepository.save(
        source.id,
        parsedArticle,
        thumbnailUrl
      );

      if (!article) {
        return {
          success: false,
          error: "Error after insert conflict: Source not found",
        };
      }

      slug = slugify(article.title);
    }

    // analysis lookup
    let analysis = await AnalysisRepository.findByText(
      "article_id",
      article.id
    );

    if (!analysis) {
      const analysisResponse = await analyzeUserArticle(article);

      if (!analysisResponse) {
        return { success: false, error: "Unable to analyze article" };
      }

      analysis = await AnalysisRepository.save(
        article.id,
        slug,
        analysisResponse
      );

      if (!analysis) {
        return {
          success: false,
          error: "Error after insert conflict: Analysis not found",
        };
      }
    }

    return { success: true, data: { slug: analysis.slug } };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Internal error" };
  }
};

// Find article and analysis details by slug
export const findArticleDetails = async (
  slug: string
): Promise<Result<ArticleDetailsDTO>> => {
  const analysisDetails = await AnalysisRepository.findAnalysisDetails(slug);

  if (!analysisDetails) {
    return { success: false, error: "Unable to find article or analysis" };
  }

  // fetch related articles
  const newsApiResponse = await fetchNewsApiArticles(
    analysisDetails.article.keywords || analysisDetails.article.title
  );

  const details = {
    ...analysisDetails,
    relatedArticles: [...newsApiResponse.articles],
  };

  return { success: true, data: details };
};
