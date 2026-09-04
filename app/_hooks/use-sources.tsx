"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiResponse } from "../api/_lib/build-response";
import type { SourcesResult } from "../_lib/types/sources";

const PAGE_SIZE = 25;

export default function useSources(search: string, page: number) {
  const [isFetching, setIsFetching] = useState(false);
  const [sourcesResult, setSourcesResult] = useState<SourcesResult>({
    sources: [],
    totalResults: 0,
    page,
    pageSize: PAGE_SIZE,
    totalPages: 0,
  });
  const [message, setMessage] = useState("");

  const fetchSources = useCallback(async () => {
    setIsFetching(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (search) params.set("q", search);

      const response = await fetch(`/api/v1/sources?${params}`);
      const result = (await response.json()) as ApiResponse<SourcesResult>;

      if (response.ok && result.data) {
        setSourcesResult(result.data);
        setMessage(result.message);
      } else {
        setMessage(result.message || "Unable to fetch sources.");
      }
    } catch {
      setMessage("An unexpected error has occurred.");
    } finally {
      setIsFetching(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchSources();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [fetchSources]);

  return { fetchSources, isFetching, sourcesResult, message };
}
