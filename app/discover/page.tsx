import AnalysesGallery from "../_components/ui/analyses/analyses-gallery";
import Search from "../_components/ui/forms/search";

export default function Discover() {
  return (
    <>
      <section className="m-4 sm:my-6 sm:mx-12 md:my-10 xl:my-16 2xl:my-22 pb-8 sm:pb-12 md:pb-16 xl:pb-22 2xl:pb-28 lg:mx-18 xl:mx-24 2xl:mx-auto 2xl:max-w-325 flex flex-col gap-12 border-b border-clay-200">
        <div className="flex flex-col gap-6">
          <h1 className="text-6xl lg:text-7xl font-serif">
            Discover
          </h1>
          <p className="text-lg font-sans max-w-150">
            Totam est consequatur reprehenderit. Deserunt quas harum itaque
            deleniti expedita aliquam excepturi.
          </p>
        </div>

        <Search/>
      </section>

      <article className="mx-4 mt-4 sm:mt-6 sm:mx-12 md:mt-10 xl:mt-16 2xl:mt-22 pt-4 sm:pt-6 lg:mx-18 xl:mx-24 2xl:mx-auto 2xl:max-w-325 flex flex-col gap-12">
        <AnalysesGallery/>
      </article>
    </>
  );
}
