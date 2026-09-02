"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../button/button";
import MagnifyingGlassIcon from "../../icons/magnifying-glass";
import { useDiscover } from "@/app/discover/_components/discover-provider";

export default function Search() {
  const { search, sorting, filters, saveFilters } = useDiscover();
  const [query, setQuery] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const nextSearch = query.trim();
    if (nextSearch === search) return;
    saveFilters(sorting, filters, nextSearch);
  }

  useEffect(() => {
    const nextSearch = query.trim();
    if (nextSearch === search) return;

    const timeout = window.setTimeout(() => {
      saveFilters(sorting, filters, nextSearch);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [filters, query, saveFilters, search, sorting]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-3 w-full lg:max-w-150"
    >
      <div
        className="flex items-center gap-6 justify-between rounded-md p-1.5 bg-clay-150 border border-clay-200 focus-within:border-clay-800 transition-colors duration-250"
        onClick={() => inputRef.current?.focus()}
      >
        <label htmlFor="query" className="sr-only">
          Search by topic, outlet, claim, or keyword...
        </label>

        <div className="flex items-center gap-3 pl-3 flex-1">
          <MagnifyingGlassIcon className="size-6" />

          <input
            ref={inputRef}
            id="query"
            name="query"
            type="text"
            value={query}
            placeholder="Search story content..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          disabled={!query.trim()}
          className="hidden sm:block"
        >
          <span>Search Stories</span>
        </Button>
      </div>

      {/*<span className="text-red-500">{message}</span>*/}

      <Button
        type="submit"
        disabled={!query.trim()}
        className="sm:hidden w-full"
      >
        <span>Search Stories</span>
      </Button>
    </form>
  );
}
