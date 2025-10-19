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

const RatingsPage = () => {
  const { getSourcePreviews, previews, previewsLoading } = useSources();
  const [searchParams, setSearchParams] = useSearchParams();

  const [ready, setReady] = useState(false);
  const [selectedBiases, setSelectedBiases] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("name_asc");

  // first build filter and sort options on load
  useEffect(() => {
    const biases = searchParams.get("bias")?.split(",").filter(Boolean) || [];
    const sort = searchParams.get("sort") || "name_asc";

    setSelectedBiases(biases);
    setSelectedSort(sort);
    setReady(true);
  }, [searchParams]);

  // update url + fetch sources when ready
  useEffect(() => {
    if (ready) {
      const params = updateURL(selectedSort, "name_asc", [], selectedBiases);
      setSearchParams(params);

      getSourcePreviews({
        bias: selectedBiases,
        sort: selectedSort,
      });
    }
  }, [getSourcePreviews, selectedBiases, selectedSort, ready, setSearchParams]);

  return (
    <SiteLayout>
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
            onApply={(sources, biases) => {
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
    </SiteLayout>
  );
};

export default RatingsPage;
