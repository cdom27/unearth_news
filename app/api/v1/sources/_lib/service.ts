import type { SourcesResult } from "@/app/_lib/types/sources";
import { querySources } from "./queries";
import { sanitizeSourcesQuery } from "./sanitize-query";

export async function getSources(
  searchParams: URLSearchParams,
): Promise<SourcesResult> {
  const params = sanitizeSourcesQuery(searchParams);
  const { rows, totalResults } = await querySources(params);

  return {
    sources: rows,
    totalResults,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(totalResults / params.pageSize),
  };
}
