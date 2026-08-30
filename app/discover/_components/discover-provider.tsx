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
  filters: NonNullable<Params["filters"]>;
  resultsVersion: number;
  saveFilters: (
    sorting: Params["sorting"],
    filters: NonNullable<Params["filters"]>,
  ) => void;
};

const DiscoverContext = createContext<DiscoverContextValue | null>(null);

type DiscoverProviderProps = {
  children: ReactNode;
  initialSorting: Params["sorting"];
  initialFilters: NonNullable<Params["filters"]>;
};

export function DiscoverProvider({
  children,
  initialSorting,
  initialFilters,
}: DiscoverProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sorting, setSorting] = useState(initialSorting);
  const [filters, setFilters] = useState(initialFilters);
  const [resultsVersion, setResultsVersion] = useState(0);

  const saveFilters = useCallback((
    nextSorting: Params["sorting"],
    nextFilters: NonNullable<Params["filters"]>,
  ) => {
    setSorting(nextSorting);
    setFilters(nextFilters);
    setResultsVersion((version) => version + 1);

    const searchParams = new URLSearchParams();
    if (nextSorting !== "newest") {
      searchParams.set("sort", nextSorting);
    }

    const scalarFilters = [
      "minFactualScore",
      "maxFactualScore",
      "minBiasScore",
      "maxBiasScore",
      "minPublishedAt",
      "maxPublishedAt",
    ] as const;
    scalarFilters.forEach((filter) => {
      const value = nextFilters[filter];
      if (value !== undefined && value !== "") {
        searchParams.set(filter, String(value));
      }
    });

    const arrayFilters = ["sources", "sentiments", "credibilities"] as const;
    arrayFilters.forEach((filter) => {
      const values = nextFilters[filter];
      if (values?.length) searchParams.set(filter, values.join(","));
    });

    const query = searchParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router]);

  const value = useMemo(
    () => ({ sorting, filters, resultsVersion, saveFilters }),
    [filters, resultsVersion, saveFilters, sorting],
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
