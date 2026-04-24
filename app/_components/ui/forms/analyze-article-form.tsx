"use client";

import { useRef, useState } from "react";
import MagicWandIcon from "../../icons/magic-wand";

export default function AnalyzeArticleForm() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // TODO: implement hook with real api call
  function handleSubmit() {
    try {
      const submittedURL = new URL(url);
      const normalizedURL = submittedURL.href.split("?")[0];

      console.log(normalizedURL);
    } catch {
      setMessage("Please enter a valid URL");
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-3 w-full lg:max-w-150 lg:mx-auto"
    >
      <div
        className="flex items-center gap-6 justify-between rounded-md p-1.5 bg-clay-150 border border-clay-200 focus-within:border-stone-800 transition-colors duration-250"
        onClick={() => inputRef.current?.focus()}
      >
        <label htmlFor="articleURL" className="sr-only">
          Enter an article URL
        </label>

        <div className="flex items-center gap-3 pl-3 flex-1">
          <MagicWandIcon className="size-6" />

          <input
            ref={inputRef}
            id="articleURL"
            name="articleURL"
            type="url"
            defaultValue={url}
            placeholder="Enter article URL"
            onChange={(e) => setUrl(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="hidden sm:block py-2 px-6 rounded-md bg-clay-800 text-clay-50 hover:cursor-pointer hover:bg-brand-500 hover:text-clay-900 transition-colors duration-250"
        >
          Analyze Article
        </button>
      </div>

      <span>{message}</span>

      <button
        type="submit"
        className="sm:hidden w-full py-3 rounded-md bg-clay-800 text-clay-50 hover:cursor-pointer hover:bg-brand-500 hover:text-clay-900 transition-colors duration-250"
      >
        Analyze Article
      </button>
    </form>
  );
}
