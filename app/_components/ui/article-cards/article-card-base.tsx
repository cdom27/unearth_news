import type { BaseCard } from "@/app/_lib/types/card";
import type { ReactNode } from "react";
import Image from "next/image";
import QuoteIcon from "../../icons/quote";

export interface ArticleCardBaseProps extends BaseCard {
  badge: ReactNode;
  footerExtension?: ReactNode;
}

export default function ArticleCardBase({
  article,
  source,
  badge,
  footerExtension,
}: ArticleCardBaseProps) {
  return (
    <article className="flex flex-col gap-6">
      <div>
        {article.thumbnailUrl ? (
          <div className="overflow-clip rounded-t-sm">
            <Image
              src={article.thumbnailUrl}
              alt={article.title ?? "Untitled Report"}
              width={450}
              height={250}
              loading="eager"
              className="aspect-video w-full h-auto object-cover rounded-t-sm group-hover:scale-105 transition-transform duration-250"
            />
          </div>
        ) : (
          <div className="w-112.5 h-62.5 bg-clay-600" />
        )}

        <div className="text-clay-50 bg-clay-900 rounded-b-sm min-h-10 flex items-center justify-center gap-3 p-3">
          <div className="flex items-center gap-3">
            <QuoteIcon className="size-6" />
            <span className="text-lg">{source.name}</span>
          </div>

          {badge && (
            <>
              <div className="bg-stone-50 rounded-full size-1.5" />

              {badge}
            </>
          )}
        </div>
      </div>

      <h3 className="font-serif text-3xl text-left underline decoration-clay-50 group-hover:underline-offset-4 group-hover:decoration-brand-500 transition-colors duration-250">
        {article.title}
      </h3>

      <p className="text-lg text-left">{article.excerpt}</p>

      {footerExtension && footerExtension}
    </article>
  );
}
