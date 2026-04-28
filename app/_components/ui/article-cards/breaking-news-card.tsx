"use client";

import useArticle from "@/app/_hooks/use-article";
import MagicWandIcon from "../../icons/magic-wand";
import Tooltip from "../tooltip/tooltip";
import ArticleCardBase, { ArticleCardBaseProps } from "./article-card-base";
import { useRouter } from "next/navigation";
import CircleNotchIcon from "../../icons/circle-notch";

export default function BreakingNewsCard(props: ArticleCardBaseProps) {
  const { analyzeArticle, isAnalyzing } = useArticle();
  const router = useRouter();

  async function handleSubmit() {
    try {
      const slug = await analyzeArticle(props.articleURL);

      if (slug) {
        router.push(`/article/${slug}`);
      } else {
        console.log("Unexpected Error while processing URL");
      }
    } catch {
      console.log("Please enter a valid URL");
    }
  }

  return (
    <Tooltip
      content={isAnalyzing ? "Analyzing" : "Analyze Article"}
      icon={
        isAnalyzing ? (
          <CircleNotchIcon className="size-6 animate-spin" />
        ) : (
          <MagicWandIcon className="size-6" />
        )
      }
    >
      <button
        onClick={() => handleSubmit()}
        className="group hover:cursor-pointer rounded-sm flex"
        aria-label={`Analyze: ${props.title} by ${props.sourceName}`}
      >
        <ArticleCardBase {...props} />
      </button>
    </Tooltip>
  );
}
