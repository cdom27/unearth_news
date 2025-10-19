const ArticleCardSkeleton = () => {
  return (
    <div
      className="flex flex-col gap-5 px-5 py-7 h-100 rounded-2xl border-1 border-fg-dark-tertiary"
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <div className="h-6 w-36 rounded bg-stone-400 animate-pulse" />
        <div className="h-8 w-18 rounded bg-stone-400 animate-pulse" />
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-8 w-3/4 rounded bg-stone-400 animate-pulse" />
        <div className="h-8 w-full rounded bg-stone-400 animate-pulse" />
        <div className="h-8 w-1/2 rounded bg-stone-400 animate-pulse" />
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-6 w-full rounded bg-stone-400 animate-pulse" />
        <div className="h-6 w-full rounded bg-stone-400 animate-pulse" />
        <div className="h-6 w-5/6 rounded bg-stone-400 animate-pulse" />
      </div>

      <div className="flex justify-between mt-auto">
        <div className="h-5 w-24 rounded bg-stone-400 animate-pulse" />
        <div className="h-5 w-20 rounded bg-stone-400 animate-pulse" />
      </div>
    </div>
  );
};

export default ArticleCardSkeleton;
