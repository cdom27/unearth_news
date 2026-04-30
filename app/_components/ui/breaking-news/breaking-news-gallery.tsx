"use client";

import { breakingNews } from "@/app/_lib/static/temp/breaking-news";
import { useEffect, useState, useRef, useCallback } from "react";
import CircleNotchIcon from "../../icons/circle-notch";
import BreakingNewsCard from "../article-cards/breaking-news-card";
import ArticleBadge from "../article-cards/article-badge";
import mapNewsApiToArticle from "@/app/_lib/utils/map-news-api-to-article";
import type { Article } from "@/app/_lib/types/article";

export default function BreakingNewsGallery() {
  const [breakingNewsArticles, setBreakingNewsArticles] = useState<Article[]>(
    [],
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 9;

  const observer = useRef<IntersectionObserver | null>(null);

  // temp static-data fetching with debounce within 200ms - 1000ms
  useEffect(() => {
    async function getArticles(pageNumber: number) {
      const newArticles = breakingNews.slice(
        pageNumber * pageSize,
        (pageNumber + 1) * pageSize,
      );

      const validArticles = newArticles
        .map(mapNewsApiToArticle)
        .filter((article): article is Article => article !== null);

      if (validArticles.length === 0) {
        setHasMore(false);
        return;
      }

      if (validArticles.length < pageSize) {
        setHasMore(false);
      }

      setTimeout(
        () => {
          setBreakingNewsArticles((prev) => {
            const existingUrls = new Set(prev.map((a) => a.articleURL));
            const filteredNewArticles = validArticles.filter(
              (a) => !existingUrls.has(a.articleURL),
            );
            return [...prev, ...filteredNewArticles];
          });
        },
        Math.floor(Math.random() * (1000 - 200 + 1)) + 200,
      );
    }

    if (hasMore) {
      getArticles(page);
    }
  }, [page, hasMore]);

  const lastArticleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasMore) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore],
  );

  return (
    <article className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {breakingNewsArticles.map((article) => (
          <BreakingNewsCard
            key={article.title.concat(", ", article.sourceName)}
            title={article.title}
            excerpt={article.excerpt}
            sourceName={article.sourceName}
            publishedTime={article.publishedTime}
            thumbnailURL={article.thumbnailURL}
            articleURL={article.articleURL}
            badge={
              <ArticleBadge variant="time" timeStamp={article.publishedTime} />
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 col-span-3 gap-1.5">
        {hasMore && <CircleNotchIcon className="size-6 animate-spin mx-auto" />}
        <p ref={lastArticleRef} className="text-center">
          Showing {breakingNewsArticles.length} of {breakingNews.length}{" "}
          articles
        </p>
      </div>
    </article>
  );
}
