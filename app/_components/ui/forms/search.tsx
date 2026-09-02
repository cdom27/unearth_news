"use client";

import { useRef, useState } from "react";
import Button from "../button/button";
import MagnifyingGlassIcon from "../../icons/magnifying-glass";

export default function Search() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    console.log(`query: ${query}`);
  }

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
            defaultValue={query}
            required
            placeholder="Search story content..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          disabled={query === ""}
          className="hidden sm:block"
        >
          <span>Search Stories</span>
        </Button>
      </div>

      {/*<span className="text-red-500">{message}</span>*/}

      <Button
        type="submit"
        disabled={query === ""}
        className="sm:hidden w-full"
      >
        <span>Search Stories</span>
      </Button>
    </form>
  );
}
