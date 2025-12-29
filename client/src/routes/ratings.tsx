import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useSources from "../hooks/use-sources";
import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import Select from "../components/ui/select";
import FilterMenu from "../components/ui/filter-menu";
import SourceTable from "../components/ui/source-table/source-table";
import SourceTableSkeleton from "../components/ui/source-table/source-table-skeleton";
import { AVAILABLE_BIASES, RATING_SORT_OPTIONS } from "../utils/param-options";
import { updateURL } from "../utils/update-url";
import Meta from "../components/layouts/meta";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

const RatingsPage = () => {
  const { getSourcePreviews, previews, previewsLoading } = useSources();
  const [searchParams, setSearchParams] = useSearchParams();

  const [ready, setReady] = useState(false);
  const [selectedBiases, setSelectedBiases] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("name_asc");
  const [selectedPage, setSelectedPage] = useState<number>(1);

  // first build filter and sort options on load
  useEffect(() => {
    const biases = searchParams.get("bias")?.split(",").filter(Boolean) || [];
    const sort = searchParams.get("sort") || "name_asc";
    const page = parseInt(searchParams.get("page") || "1") || 1;

    setSelectedBiases(biases);
    setSelectedSort(sort);
    setSelectedPage(page);
    setReady(true);
  }, [searchParams]);

  // update url + fetch sources when ready
  useEffect(() => {
    if (ready) {
      const params = updateURL(
        selectedSort,
        "name_asc",
        [],
        selectedBiases,
        selectedPage,
      );
      setSearchParams(params);

      getSourcePreviews({
        bias: selectedBiases,
        sort: selectedSort,
        page: selectedPage.toString(),
      });
    }
  }, [
    getSourcePreviews,
    selectedBiases,
    selectedSort,
    selectedPage,
    ready,
    setSearchParams,
  ]);

  return (
    <SiteLayout>
      <Meta
        title="Media Outlet Ratings & Credibility Scores | Unearth"
        description="Compare news source credibility, factual accuracy ratings, and bias scores across major media outlets. Find trustworthy journalism with data-backed ratings."
        canonicalUrl="https://unearth.news/media-ratings"
      />
      <PageSection>
        <h1 className="font-instrument text-5xl tracking-[.0125em]">
          Media Bias Ratings
        </h1>
        <p className="pt-2 lg:w-2/3">
          See how news sources measure up. Our database brings transparency to
          bias and reliability, helping you understand where information truly
          comes from.
        </p>

        <div className="flex gap-3 py-5 sm:justify-end border-b-1 border-fg-dark-tertiary">
          <Select
            name="sort-select"
            options={RATING_SORT_OPTIONS}
            handleChange={setSelectedSort}
            value={selectedSort}
          />

          <FilterMenu
            biasOptions={AVAILABLE_BIASES}
            selectedBiases={selectedBiases}
            onApply={(biases) => {
              setSelectedBiases(biases);
            }}
            onClear={() => {
              setSelectedBiases([]);
              setSelectedSort("name_asc");
            }}
          />
        </div>
      </PageSection>

      <PageSection className="pt-10">
        {previewsLoading ? (
          <SourceTableSkeleton />
        ) : (
          <SourceTable ps={previews} />
        )}
      </PageSection>

      <div className="flex items-center gap-2 mx-auto pt-10">
        <button
          onClick={() => setSelectedPage(selectedPage - 1)}
          disabled={selectedPage === 1}
          className="group border-1 border-fg-dark-tertiary text-fg-light p-2 rounded-full hover:border-fg-dark cursor-pointer disabled:cursor-not-allowed disabled:border-fg-dark-tertiary"
        >
          <CaretLeftIcon className="size-6 fill-fg-dark-tertiary group-hover:fill-fg-dark group-disabled:fill-fg-dark-tertiary" />
        </button>

        <div className="bg-bg-dark text-fg-light p-2 size-10 rounded-full text-2xl items-center justify-center flex">
          <span>{selectedPage || 1}</span>
        </div>

        <button
          onClick={() => setSelectedPage(selectedPage + 1)}
          disabled={previews.length < 21}
          className="group border-1 border-fg-dark-tertiary text-fg-light p-2 rounded-full hover:border-fg-dark cursor-pointer disabled:cursor-not-allowed disabled:border-fg-dark-tertiary"
        >
          <CaretRightIcon className="size-6 fill-fg-dark-tertiary group-hover:fill-fg-dark group-disabled:fill-fg-dark-tertiary" />
        </button>
      </div>
    </SiteLayout>
  );
};

export default RatingsPage;
