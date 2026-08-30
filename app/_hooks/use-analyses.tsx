import { useCallback, useRef, useState } from "react";
import type { Preview, PreviewsResult } from "../_lib/types/analyses-previews";
import type { ApiResponse } from "../api/_lib/build-response";
import type { Params } from "../_lib/types/preview-params";

const DEFAULT_PAGE_SIZE = 9;

export default function useAnalyses(
  pageSize = DEFAULT_PAGE_SIZE,
  sorting: Params["sorting"] = "newest",
) {
  const [isFetching, setIsFetching] = useState(false);
  const [previewsResult, setPreviewsResult] = useState<PreviewsResult>({
    previews: [],
    totalResults: 0,
  });
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState("");
  const nextPage = useRef(1);
  const isRequestInFlight = useRef(false);
  const loadedSlugs = useRef(new Set<string>());

  const fetchAnalysisPreviews = useCallback(async () => {
    if (isRequestInFlight.current || !hasMore) return;

    isRequestInFlight.current = true;
    setIsFetching(true);

    try {
      const params = new URLSearchParams({
        page: String(nextPage.current),
        pageSize: String(pageSize),
        sort: sorting,
      });
      const response = await fetch(`/api/v1/analyses/previews?${params}`);

      const result = (await response.json()) as ApiResponse<PreviewsResult>;

      if (result.data && response.ok) {
        const data = result.data;
        setMessage(result.message);
        nextPage.current += 1;

        const addedPreviews = data.previews.filter(
          (preview: Preview) => !loadedSlugs.current.has(preview.analysis.slug),
        );
        addedPreviews.forEach((preview) =>
          loadedSlugs.current.add(preview.analysis.slug),
        );

        setPreviewsResult((previous) => ({
          previews: [...previous.previews, ...addedPreviews],
          totalResults: data.totalResults,
        }));
        setHasMore(
          data.previews.length > 0 &&
            loadedSlugs.current.size < data.totalResults,
        );
      } else {
        setMessage(result.message || "Unable to fetch analyses.");
      }
    } catch {
      setMessage("An unexpected error has occurred.");
    } finally {
      isRequestInFlight.current = false;
      setIsFetching(false);
    }
  }, [hasMore, pageSize, sorting]);

  return {
    fetchAnalysisPreviews,
    isFetching,
    previewsResult,
    hasMore,
    message,
  };
}
