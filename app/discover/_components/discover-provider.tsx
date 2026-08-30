"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Params } from "@/app/_lib/types/preview-params";

type DiscoverContextValue = {
  sorting: Params["sorting"];
  resultsVersion: number;
  saveFilters: (sorting: Params["sorting"]) => void;
};

const DiscoverContext = createContext<DiscoverContextValue | null>(null);

type DiscoverProviderProps = {
  children: ReactNode;
  initialSorting: Params["sorting"];
};

export function DiscoverProvider({
  children,
  initialSorting,
}: DiscoverProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sorting, setSorting] = useState(initialSorting);
  const [resultsVersion, setResultsVersion] = useState(0);

  const saveFilters = useCallback((nextSorting: Params["sorting"]) => {
    setSorting(nextSorting);
    setResultsVersion((version) => version + 1);

    const searchParams = new URLSearchParams();
    if (nextSorting !== "newest") {
      searchParams.set("sort", nextSorting);
    }

    const query = searchParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router]);

  const value = useMemo(
    () => ({ sorting, resultsVersion, saveFilters }),
    [resultsVersion, saveFilters, sorting],
  );

  return (
    <DiscoverContext.Provider value={value}>
      {children}
    </DiscoverContext.Provider>
  );
}

export function useDiscover() {
  const context = useContext(DiscoverContext);

  if (!context) {
    throw new Error("useDiscover must be used within DiscoverProvider.");
  }

  return context;
}
