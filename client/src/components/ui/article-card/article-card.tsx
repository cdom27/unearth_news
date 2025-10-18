import { Link } from "react-router";
import type { ArticlePreviewDTO } from "@shared/dtos/article-preview";
import { biasClasses } from "../../../utils/bias-classes";

interface ArticleCardProps {
  p: ArticlePreviewDTO;
}

const ArticleCard = ({ p }: ArticleCardProps) => {
  const pubTime = new Date(p.publishedTime);
  const truncatedExcerpt = p.excerpt.substring(0, 200) + "...";

  return (
    <div className="flex flex-col gap-5 px-5 py-7 rounded-2xl border-1 border-fg-dark-tertiary">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-fg-dark-tertiary underline underline-offset-4 decoration-dotted hover:text-fg-dark active:text-fg-dark">
          <Link to={`/media-ratings/${p.source.slug}`}>{p.source.name}</Link>
        </h2>
        <span
          className={`font-medium py-1 px-2 rounded-sm capitalize text-fg-light ${
            biasClasses[p.source.bias] ?? "bg-stone-600"
          }`}
        >
          {p.source.bias.replace("-", " ")}
        </span>
      </div>

      <h2 className="text-xl">{p.title}</h2>

      <p className="text-fg-dark-tertiary text-lg">{truncatedExcerpt}</p>

      <div className="flex justify-between mt-auto">
        <span className="font-medium text-fg-dark-tertiary">
          {pubTime.toLocaleDateString()}
        </span>

        <Link
          to={`/article/${p.slug}`}
          className="font-medium underline underline-offset-4 decoration-dotted hover:text-fg-dark-secondary active:text-fg-dark-secondary"
        >
          Read Story
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
