export type SourcesQuery = {
  page: number;
  pageSize: number;
  search?: string;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 200;

function resolvePositiveInteger(
  value: string | null,
  fallback: number,
  maximum?: number,
) {
  const parsed = value ? Number(value) : NaN;
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return maximum ? Math.min(parsed, maximum) : parsed;
}

export function sanitizeSourcesQuery(
  searchParams: URLSearchParams,
): SourcesQuery {
  return {
    page: resolvePositiveInteger(searchParams.get("page"), DEFAULT_PAGE),
    pageSize: resolvePositiveInteger(
      searchParams.get("pageSize"),
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    ),
    search:
      searchParams.get("q")?.trim().slice(0, MAX_SEARCH_LENGTH) || undefined,
  };
}
