"use client";

import useArticle from "@/app/_hooks/use-article";
import MagicWandIcon from "../../icons/magic-wand";
import Tooltip from "../tooltip/tooltip";
import ArticleCardBase, { ArticleCardBaseProps } from "./article-card-base";
import { useRouter } from "next/navigation";
import CircleNotchIcon from "../../icons/circle-notch";
import XIcon from "../../icons/x";

export default function BreakingNewsCard(props: ArticleCardBaseProps) {
  const { analyzeArticle, isAnalyzing, message } = useArticle();
  const router = useRouter();

  async function handleSubmit() {
    try {
      const slug = await analyzeArticle(props.articleURL);

      if (slug) {
        router.push(`/article/${slug}`);
      }
    } catch {
      console.log("Unable to process source");
      console.log(message);
    }
  }

  return (
    <Tooltip
      content={
        isAnalyzing ? "Analyzing" : message ? message : "Analyze Article"
      }
      icon={
        isAnalyzing ? (
          <CircleNotchIcon className="size-6 animate-spin" />
        ) : message ? (
          <XIcon className="size-4" />
        ) : (
          <MagicWandIcon className="size-6" />
        )
      }
      variant={message === "Unable to process source" ? "secondary" : "default"}
    >
      <button
        onClick={() => handleSubmit()}
        className="group hover:cursor-pointer rounded-sm flex"
        aria-label={`Analyze: ${props.title} by ${props.sourceName}`}
        disabled={message != "" ? true : false}
      >
        <ArticleCardBase {...props} />
      </button>
    </Tooltip>
  );
}
