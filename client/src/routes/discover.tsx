import { useSearchParams } from "react-router";
import SiteLayout from "../components/layouts/site-layout";
import useArticles from "../hooks/use-articles";
import { useEffect, useState, useCallback } from "react";
import PageSection from "../components/layouts/page-section";
import Select from "../components/ui/select";
import FilterMenu from "../components/ui/filter-menu";

// hard-coded arrays in lieu of hooks to get available options. for testing only.
const AVAILABLE_SOURCES = [
  "nbc-news",
  "associated-press",
  "daily-caller",
  "cnbc",
];
const AVAILABLE_BIASES = ["left", "lean-left", "center", "lean-right", "right"];
const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest" },
  { value: "date_asc", label: "Oldest" },
];

const DiscoverPage = () => {
  const { getArticlePreviews } = useArticles();
  const [searchParams, setSearchParams] = useSearchParams();

  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedBiases, setSelectedBiases] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("date_desc");

  useEffect(() => {
    const sources =
      searchParams.get("sources")?.split(",").filter(Boolean) || [];
    const biases = searchParams.get("bias")?.split(",").filter(Boolean) || [];
    const sort = searchParams.get("sort") || "date_desc";

    setSelectedSources(sources);
    setSelectedBiases(biases);
    setSelectedSort(sort);
    setReady(true);
  }, []);

  const updateURL = useCallback(
    (sources: string[], biases: string[], sort: string) => {
      const params = new URLSearchParams();

      if (sources.length > 0) {
        params.set("sources", sources.join(","));
      }
      if (biases.length > 0) {
        params.set("bias", biases.join(","));
      }
      if (sort !== "date_desc") {
        params.set("sort", sort);
      }

      setSearchParams(params);
    },
    [setSearchParams]
  );

  useEffect(() => {
    if (ready) {
      getArticlePreviews({
        sources: selectedSources,
        bias: selectedBiases,
        sort: selectedSort,
      });
    }
  }, [selectedSources, selectedBiases, selectedSort, getArticlePreviews]);

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    updateURL(selectedSources, selectedBiases, sort);
  };

  return (
    <SiteLayout>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 transition-opacity duration-500 ease-in-out bg-fg-dark ${
          open ? "opacity-20 z-0" : "opacity-0 -z-10"
        }`}
      />

      <PageSection>
        <h2 className="font-instrument text-5xl tracking-[.0125em]">
          Browse Stories
        </h2>
        <p className="pt-2">
          Discover articles that reveal how narratives differ between media
          outlets. Learn how framing, language, and emphasis shape public
          perception.
        </p>

        <div className="flex gap-3 py-5 border-b-1 border-fg-dark-tertiary">
          <Select
            name="sort-select"
            options={SORT_OPTIONS}
            handleChange={handleSortChange}
          />

          <FilterMenu
            setOpen={setOpen}
            open={open}
            sourceOptions={AVAILABLE_SOURCES}
            biasOptions={AVAILABLE_BIASES}
            selectedSources={selectedSources}
            selectedBiases={selectedBiases}
            onApply={(sources, biases) => {
              setSelectedSources(sources);
              setSelectedBiases(biases);
              updateURL(sources, biases, selectedSort);
            }}
            onClear={() => {
              setSelectedSources([]);
              setSelectedBiases([]);
              setSelectedSort("date_desc");
              updateURL([], [], "date_desc");
            }}
          />
        </div>
      </PageSection>
    </SiteLayout>
  );
};

export default DiscoverPage;
