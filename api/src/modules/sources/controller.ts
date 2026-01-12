import { Request, Response } from "express";
import { failure, success } from "../shared/utils/build-response";
import {
  buildSourcePreviews,
  findFilteredSourceIds,
  findSourceDetails,
  findUsedSources,
} from "./service";
import { SourcePreviewQuery } from "./types/source-preview-query";
import { resolveToNumber } from "../shared/utils/resolve-number";
import { validateArrayParams } from "../shared/utils/validate-array-params";
import { validateSort } from "../shared/utils/validate-sort";
import { SourceSlugParams } from "./types/source-slug-params";

export const getSourcesHandler = async (req: Request, res: Response) => {
  try {
    // future: params for pagination and filtered query - not needed yet
    const result = await findUsedSources();
    return success(res, result.data, "Successfully found sources");
  } catch (error) {
    console.error("Error while fetching sources:", error);
    return failure(res, "Internal error while fetching sources");
  }
};

export const getSourceDetailsHandler = async (
  req: Request<SourceSlugParams>,
  res: Response,
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return failure(res, "Request params are missing", 422);
    }

    const sourceDetails = await findSourceDetails(slug);

    if (!sourceDetails.data) {
      return failure(res, "No data found", 404);
    }

    return success(
      res,
      sourceDetails.data,
      "Successfully fetched course details",
    );
  } catch (error) {
    console.error("Error while fetching source details:", error);
    return failure(res, "Internal errro while fetching source details");
  }
};

export const getSourcePreviewsHandler = async (
  req: Request<{}, {}, {}, SourcePreviewQuery>,
  res: Response,
) => {
  try {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 50;
    const MAX_PAGE_SIZE = 100;
    const DEFAULT_SORT = "name_asc";

    const { page, pageSize, bias, sort } = req.query;

    const sanitized = {
      page: resolveToNumber(page, DEFAULT_PAGE),
      pageSize: resolveToNumber(pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
      bias: validateArrayParams(bias),
      sort: validateSort(sort, ["name_asc", "name_desc"]) ?? DEFAULT_SORT,
    };

    let sourceIds: string[] | null = null;

    if (sanitized.bias && sanitized.bias.length > 0) {
      const sourceIdResult = await findFilteredSourceIds(
        undefined,
        sanitized.bias,
      );

      sourceIds = sourceIdResult.data || [];

      if (sourceIdResult.data && sourceIds.length === 0) {
        return success(
          res,
          {
            previews: [],
            pagination: {
              currentPage: sanitized.page,
              pageSize: sanitized.pageSize,
              totalCount: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
          "No sources found matching the specified filters",
        );
      }
    }

    // sort and build preview DTO
    const result = await buildSourcePreviews(
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
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        "No sources found matching the specified filters",
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
      "Successfully fetched media-rating previews",
    );
  } catch (error) {
    console.error("Error while fetching media-rating previews:", error);
    return failure(res, "Internal error while fetching media-rating previews");
  }
};
