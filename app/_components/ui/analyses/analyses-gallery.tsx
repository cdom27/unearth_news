"use client";

import useAnalyses from "@/app/_hooks/use-analyses";
import { useCallback, useEffect, useRef } from "react";
import CircleNotchIcon from "../../icons/circle-notch";

export default function AnalysesGallery() {
  const { isFetching, previewsResult, hasMore, fetchAnalysisPreviews } =
    useAnalyses(9);

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
    <article className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {previewsResult.previews.map((ap) => (
          <a
            key={ap.analysis.slug}
            href={`/article/${ap.analysis.slug}`}
            className="text-7xl text-purple-600 block"
          >
            {ap.article.title}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 col-span-3 gap-1.5">
        {hasMore && <CircleNotchIcon className="size-6 animate-spin mx-auto" />}
        <div ref={lastAnalysisRef}>
          <p className="text-center">
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
