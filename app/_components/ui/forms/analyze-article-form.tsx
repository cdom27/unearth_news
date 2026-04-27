"use client";

import { useRef, useState } from "react";
import MagicWandIcon from "../../icons/magic-wand";
import Button from "../button/button";
import { normalizeURL } from "@/app/_lib/normalize-url";
import useArticle from "@/app/_hooks/use-article";
import { useRouter } from "next/navigation";

export default function AnalyzeArticleForm() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { analyzeArticle } = useArticle();

  async function handleSubmit() {
    try {
      const normalizedURL = normalizeURL(url);

      //TODO:
      // - create a 'blacklist' of domains that are unable to be parsed
      // - send the normalized url to the backend for processing
      const slug = await analyzeArticle(normalizedURL);

      if (slug) {
        router.push(`/article/${slug}`);
      } else {
        // inform user something went wrong
      }
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
            required
            placeholder="Enter article URL"
            onChange={(e) => setUrl(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        <Button type="submit" disabled={url === ""} className="hidden sm:block">
          Analyze Article
        </Button>
      </div>

      <span>{message}</span>

      <Button type="submit" disabled={url === ""} className="sm:hidden w-full">
        Analyze Article
      </Button>
    </form>
  );
}
