import BreakingNewsGallery from "./_components/ui/breaking-news/breaking-news-gallery";

export default function Home() {
  return (
    <>
      <section className="m-4 sm:my-6 sm:mx-12 md:my-10 xl:my-16 2xl:my-22 pb-8 sm:pb-12 md:pb-16 xl:pb-22 2xl:pb-28 lg:mx-18 xl:mx-24 2xl:mx-auto 2xl:max-w-325 flex flex-col gap-12 border-b border-clay-200">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-6xl lg:text-7xl font-serif text-center">
            Clarity in Every Narrative
          </h1>
          <p className="text-lg font-sans text-center max-w-150">
            Explore how stories are built. Unearth examines language, claims,
            and sourcing to give you a deeper understanding of the information
            you read.
          </p>
        </div>

        <div>{/*ANALYSIS FORM*/}</div>
      </section>

      <article className="mx-4 mt-4 sm:mt-6 sm:mx-12 md:mt-10 xl:mt-16 2xl:mt-22 pt-4 sm:pt-6 lg:mx-18 xl:mx-24 2xl:mx-auto 2xl:max-w-325 flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl font-serif text-center sm:text-left">
            Breaking News
          </h2>
          <p className="sr-only">
            Latest breaking news stories from trusted sources.
          </p>
        </div>

        <BreakingNewsGallery />
      </article>
    </>
  );
}
