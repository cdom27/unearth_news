export default function MediaRatings() {
  return (
    <>
      <section className="m-4 sm:my-6 sm:mx-12 md:my-10 xl:my-16 2xl:my-22 pb-8 sm:pb-12 md:pb-16 xl:pb-22 2xl:pb-28 lg:mx-18 xl:mx-24 2xl:mx-auto 2xl:max-w-325 flex flex-col border-b border-clay-200">
        <div className="flex flex-col gap-6">
          <h1 className="text-6xl lg:text-7xl font-serif">Media Ratings</h1>
          <p className="text-lg font-sans max-w-150">
            Browse all rated sources. Each one carries two ratings: one from
            verified, trustworthy third-party sources, and one collected
            first-hand through our own fact-checking.
          </p>
        </div>
      </section>
    </>
  );
}
