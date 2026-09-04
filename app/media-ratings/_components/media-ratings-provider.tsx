"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type MediaRatingsContextValue = {
  search: string;
  page: number;
  saveSearch: (search: string) => void;
  setPage: (page: number) => void;
};

const MediaRatingsContext =
  createContext<MediaRatingsContextValue | null>(null);

export function MediaRatingsProvider({
  children,
  initialSearch,
  initialPage,
}: {
  children: ReactNode;
  initialSearch: string;
  initialPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);
  const [page, setCurrentPage] = useState(initialPage);

  const updateUrl = useCallback(
    (nextSearch: string, nextPage: number) => {
      const params = new URLSearchParams();
      if (nextSearch) params.set("q", nextSearch);
      if (nextPage > 1) params.set("page", String(nextPage));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const saveSearch = useCallback(
    (nextSearch: string) => {
      setSearch(nextSearch);
      setCurrentPage(1);
      updateUrl(nextSearch, 1);
    },
    [updateUrl],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      if (nextPage < 1) return;
      setCurrentPage(nextPage);
      updateUrl(search, nextPage);
    },
    [search, updateUrl],
  );

  const value = useMemo(
    () => ({ search, page, saveSearch, setPage }),
    [page, saveSearch, search, setPage],
  );

  return (
    <MediaRatingsContext.Provider value={value}>
      {children}
    </MediaRatingsContext.Provider>
  );
}

export function useMediaRatings() {
  const context = useContext(MediaRatingsContext);
  if (!context) {
    throw new Error(
      "useMediaRatings must be used within MediaRatingsProvider.",
    );
  }
  return context;
}
