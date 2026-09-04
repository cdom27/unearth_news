"use client";

import useAnalyses from "@/app/_hooks/use-analyses";
import type { Params } from "@/app/_lib/types/preview-params";
import { useDiscover } from "@/app/discover/_components/discover-provider";
import { useCallback, useEffect, useRef } from "react";
import CircleNotchIcon from "../../icons/circle-notch";
import AnalysisPreviewCard from "../article-cards/analysis-preview-card";
import { ArticleCardBaseSkeleton } from "../article-cards/article-card-base";

type AnalysesGalleryResultsProps = {
  sorting: Params["sorting"];
  filters: NonNullable<Params["filters"]>;
  search: string;
};

export default function AnalysesGallery() {
  const { search, sorting, filters, resultsVersion } = useDiscover();

  return (
    <AnalysesGalleryResults
      key={`${sorting}-${JSON.stringify(filters)}-${resultsVersion}`}
      sorting={sorting}
      filters={filters}
      search={search}
    />
  );
}

function AnalysesGalleryResults({
  sorting,
  filters,
  search,
}: AnalysesGalleryResultsProps) {
  const { isFetching, previewsResult, hasMore, fetchAnalysisPreviews } =
    useAnalyses(9, sorting, filters, search);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchAnalysisPreviews();
  }, [fetchAnalysisPreviews]);

  const lastAnalysisRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasMore || isFetching) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchAnalysisPreviews();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [fetchAnalysisPreviews, hasMore, isFetching],
  );

  return (
    <article className="flex flex-col gap-4" aria-busy={isFetching}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {isFetching && previewsResult.previews.length === 0
          ? Array.from({ length: 9 }, (_, index) => (
              <ArticleCardBaseSkeleton key={`analysis-skeleton-${index}`} />
            ))
          : previewsResult.previews.map((ap) => (
              <AnalysisPreviewCard key={ap.analysis.slug} preview={ap} />
            ))}
      </div>

      <div className="grid grid-cols-1 col-span-3 gap-1.5">
        {hasMore && <CircleNotchIcon className="size-6 animate-spin mx-auto" />}
        <div ref={lastAnalysisRef}>
          <p className="text-center" role="status" aria-live="polite">
            {isFetching
              ? "Fetching articles"
              : `Showing ${previewsResult.previews.length} of
  ${previewsResult?.totalResults || 0} analyses`}
          </p>
        </div>
      </div>
    </article>
  );
}
