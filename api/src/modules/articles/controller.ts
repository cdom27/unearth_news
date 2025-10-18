import { Request, Response } from "express";
import { failure, success } from "../shared/utils/build-response";
import { findFilteredSourceIds } from "../sources/service";
import {
  findArticlePreviews,
  analyzeArticle,
  findArticleDetails,
} from "./service";
import { resolveToNumber } from "../shared/utils/resolve-number";
import { validateSort } from "../shared/utils/validate-sort";
import { validateArrayParams } from "../shared/utils/validate-array-params";
import type { AnalysisRequest } from "./dtos/analysis-request";
import type { ArticleSlugParams } from "./types/article-slug-params";
import type { ArticlePreviewQuery } from "./types/article-preview-query";

export const analyzeArticleHandler = async (
  req: Request<{}, {}, AnalysisRequest>,
  res: Response,
) => {
  try {
    const { url } = req.body;

    if (!url) {
      return failure(res, "Request body is missing", 400);
    }

    const result = await analyzeArticle(url);

    if (!result.success) {
      return failure(res, result.error, 422);
    }

    return success(res, result.data, "Successfully analyzed article");
  } catch (error) {
    console.error("Error while attempting analysis:", error);
    return failure(res, "Internal error while attempting analysis");
  }
};

export const getArticleDetailsHandler = async (
  req: Request<ArticleSlugParams>,
  res: Response,
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return failure(res, "Request params are missing", 422);
    }

    const articleDetails = await findArticleDetails(slug);

    if (!articleDetails.data) {
      return failure(res, "No data found", 404);
    }

    return success(
      res,
      articleDetails.data,
      "Sucessfully fetched article details",
    );
  } catch (error) {
    console.error("Error while fetching article details:", error);
    return failure(res, "Internal error while fetching article details");
  }
};

export const getArticlePreviewsHandler = async (
  req: Request<{}, {}, {}, ArticlePreviewQuery>,
  res: Response,
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
      sort: validateSort(sort, ["date_asc", "date_desc"]) ?? DEFAULT_SORT,
    };

    let sourceIds: string[] | null = null;

    if (
      (sanitized.bias && sanitized.bias.length > 0) ||
      (sanitized.sources && sanitized.sources.length > 0)
    ) {
      const sourceIdResult = await findFilteredSourceIds(
        sanitized.sources,
        sanitized.bias,
      );

      sourceIds = sourceIdResult.data || [];

      // if filters were applied but no sources match (conflicting filters)
      // return empty result
      if (sourceIdResult.data && sourceIdResult.data.length === 0) {
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
          "No articles found matching the specified filters",
        );
      }
    }

    // get sorted article previews
    const result = await findArticlePreviews(
      sourceIds,
      sanitized.sort,
      sanitized.page,
      sanitized.pageSize,
    );

    if (!result.data) {
      return success(
        res,
        {
          previews: [],
          pagination: {
            currentPage: sanitized.page,
            pageSize: sanitized.pageSize,
            count: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        "No articles found",
      );
    }

    const { previews, count } = result.data;
    const totalPages = Math.ceil(count / sanitized.pageSize);

    return success(
      res,
      {
        previews,
        pagination: {
          currentPage: sanitized.page,
          pageSize: sanitized.pageSize,
          count,
          totalPages,
          hasNextPage: sanitized.page < totalPages,
          hasPrevPage: sanitized.page > 1,
        },
      },
      "Successfully fetched article previews",
    );
  } catch (error) {
    console.error("Error while fetching article previews:", error);
    return failure(res, "Internal error while fetching article previews");
  }
};
