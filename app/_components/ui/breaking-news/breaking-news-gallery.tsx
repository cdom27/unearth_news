"use client";

import { breakingNews } from "@/app/_lib/static/temp/breaking-news";
import { NewsAPIArticle } from "@/app/_lib/types/news-api";
import { useEffect, useState, useRef, useCallback } from "react";
import CircleNotchIcon from "../../icons/circle-notch";
import BreakingNewsCard from "../article-cards/breaking-news-card";
import ArticleBadge from "../article-cards/article-badge";
import Tooltip from "../tooltip/tooltip";

export default function BreakingNewsGallery() {
  const [breakingNewsArticles, setBreakingNewsArticles] = useState<
    NewsAPIArticle[]
  >([]);
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

      if (newArticles.length === 0) {
        setHasMore(false);
        return;
      }

      if (newArticles.length < pageSize) {
        setHasMore(false);
      }

      setTimeout(
        () => {
          setBreakingNewsArticles((prev) => {
            const existingUrls = new Set(prev.map((a) => a.url));
            const filteredNewArticles = newArticles.filter(
              (a) => !existingUrls.has(a.url),
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
          <Tooltip key={article.url} content="Analyze Article">
            <button
              onClick={() =>
                console.log("analyzing article URL: ", article.url || "")
              }
              className="group hover:cursor-pointer rounded-sm flex"
              aria-label={`Analyze: ${article.title}`}
            >
              <BreakingNewsCard
                title={article.title}
                excerpt={article.description}
                sourceName={article.source.name}
                publishedTime={article.publishedAt}
                thumbnailURL={article.urlToImage}
                articleURL={article.url}
                badge={
                  article.publishedAt && (
                    <ArticleBadge
                      variant="time"
                      timeStamp={article.publishedAt}
                    />
                  )
                }
              />
            </button>
          </Tooltip>
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
