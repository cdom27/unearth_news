import { Request, Response } from "express";
import {
  findAnalysisByArticleId,
  findAnalysisBySlug,
  saveAndReturnAnalysis,
} from "../analyses/service";
import { failure, success } from "../shared/utils/build-response";
import fetchNewsApiArticles, {
  fetchArticleThumbnail,
} from "../shared/utils/fetch-news-api";
import slugify from "../shared/utils/slugify";
import {
  findSourceByUrl,
  findSourceById,
  saveAndReturnSource,
  findFilteredSourceIds,
} from "../sources/service";
import {
  findArticleById,
  findArticleByUrl,
  findArticlePreviews,
  saveAndReturnArticle,
} from "./service";
import analyzeArticle from "./utils/analyze-article";
import { normalizeUrl } from "./utils/normalize-url";
import parseArticle from "./utils/parse-article";
import type { AnalysisRequest } from "./dtos/analysis-request";
import type { ArticleSlugParams } from "./types/article-slug-params";
import type { ArticleDetailsDTO } from "@shared/dtos/article-details";
import type { AnalyzeMetaDTO } from "@shared/dtos/analyze-meta";
import type { ArticlePreviewQuery } from "./types/article-preview-query";
import { resolveToNumber } from "../shared/utils/resolve-number";
import { validateSort } from "./utils/validate-sort";
import { validateArrayParams } from "../shared/utils/validate-array-params";

export const analyzeArticles = async (
  req: Request<{}, {}, AnalysisRequest>,
  res: Response
) => {
  try {
    const { url } = req.body;

    if (!url) {
      return failure(res, "Request body is missing", 400);
    }

    const normalizedUrl = normalizeUrl(url);

    // attempt article lookup
    let article = await findArticleByUrl(url);
    let slug = "";

    if (!article) {
      const parsedArticle = await parseArticle(normalizedUrl);
      if (!parsedArticle) {
        return failure(res, "Unable to parse article", 422);
      }

      const thumbnailUrl = await fetchArticleThumbnail(
        parsedArticle.title,
        parsedArticle.keywords
      );

      // attempt source lookup
      const hostname = new URL(parsedArticle.url).hostname;
      let source = await findSourceByUrl(hostname);

      if (!source) {
        source = await saveAndReturnSource(parsedArticle.sourceName, hostname);
      }

      article = await saveAndReturnArticle(
        source.id,
        parsedArticle,
        thumbnailUrl
      );
      slug = slugify(article.title);
    }

    // attempt analysis lookup
    let analysis = await findAnalysisByArticleId(article.id);

    if (!analysis) {
      const analysisResponse = await analyzeArticle(article);

      if (!analysisResponse) {
        return failure(res, "Unable to analyze article", 422);
      }

      analysis = await saveAndReturnAnalysis(
        article.id,
        slug,
        analysisResponse
      );
    }

    const payload: AnalyzeMetaDTO = {
      slug: analysis.slug,
    };

    return success(res, payload, "Successfully analyzed article");
  } catch (error) {
    console.log("Error processing analysis:", error);
    return failure(res, "Internal error while processing analysis");
  }
};

export const getArticleDetails = async (
  req: Request<ArticleSlugParams>,
  res: Response
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return failure(res, "Request params are missing", 400);
    }

    // attempt lookups
    const analysis = await findAnalysisBySlug(slug);

    if (analysis) {
      const article = await findArticleById(analysis.articleId);

      if (article) {
        const source = await findSourceById(article.sourceId);

        if (source) {
          // fetch related articles
          const newsApiResponse = await fetchNewsApiArticles(
            article.keywords || article.title
          );

          const payload: ArticleDetailsDTO = {
            article: {
              url: article.url,
              title: article.title,
              language: article.language,
              byline: article.byline,
              excerpt: article.excerpt,
              textContent: article.textContent,
              thumbnailUrl: article.thumbnailUrl,
              publishedTime: article.publishedTime,
            },
            source: {
              name: source.name,
              url: source.url,
              slug: source.slug,
              bias: source.bias,
              factualReporting: source.factualReporting,
              country: source.country,
              mediaType: source.mediaType,
              credibility: source.credibility,
            },
            analysis: {
              slug: analysis.slug,
              summary: analysis.summary,
              sentiment: analysis.sentiment,
              framing: analysis.framing,
              confidence: analysis.meta.confidence,
            },
            relatedArticles: [...newsApiResponse.articles],
          };

          return success(res, payload, "Successfully fetched article details");
        }
      }
    }

    return failure(res, "Article details not found", 404);
  } catch (error) {
    console.error("Error while fetching article details:", error);
    return failure(res, "Internal error while fetching article details");
  }
};

export const getArticlePreviews = async (
  req: Request<{}, {}, {}, ArticlePreviewQuery>,
  res: Response
) => {
  try {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 20;
    const MAX_PAGE_SIZE = 100;
    const DEFAULT_SORT = "date_desc";

    const { page, pageSize, sources, bias, sort } = req.query;

    const sanitized = {
      page: resolveToNumber(page, DEFAULT_PAGE),
      pageSize: resolveToNumber(pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
      sources: validateArrayParams(sources),
      bias: validateArrayParams(bias),
      sort: validateSort(sort) ?? DEFAULT_SORT,
    };

    let sourceIds: string[] | null = null;

    if (
      (sanitized.bias && sanitized.bias.length > 0) ||
      (sanitized.sources && sanitized.sources.length > 0)
    ) {
      sourceIds = await findFilteredSourceIds(
        sanitized.sources,
        sanitized.bias
      );

      // if filters were applied but no sources match (conflicting filters)
      // return empty result
      if (sourceIds.length === 0) {
        return success(
          res,
          {
            articles: [],
            pagination: {
              currentPage: sanitized.page,
              pageSize: sanitized.pageSize,
              totalCount: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
          "No articles found matching the specified filters"
        );
      }
    }

    // get sorted article previews
    const { articles, totalCount } = await findArticlePreviews(
      sourceIds,
      sanitized.sort,
      sanitized.page,
      sanitized.pageSize
    );

    const totalPages = Math.ceil(totalCount / sanitized.pageSize);

    return success(
      res,
      {
        articles,
        pagination: {
          currentPage: sanitized.page,
          pageSize: sanitized.pageSize,
          totalCount,
          totalPages,
          hasNextPage: sanitized.page < totalPages,
          hasPrevPage: sanitized.page > 1,
        },
      },
      "Successfully fetched article previews"
    );
  } catch (error) {
    console.error("Error while fetching article previews:", error);
    return failure(res, "Internal error while fetching article previews");
  }
};
