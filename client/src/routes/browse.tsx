import { Link, useSearchParams } from "react-router";
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

const biasClasses: Record<string, string> = {
  left: "bg-bias-left",
  "lean-left": "bg-bias-lean-left",
  center: "bg-stone-600",
  "lean-right": "bg-bias-lean-right",
  right: "bg-bias-right",
};

const BrowsePage = () => {
  const { getArticlePreviews, previews, previewsLoading } = useArticles();
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
        <p className="pt-2 lg:w-2/3">
          Discover articles that reveal how narratives differ between media
          outlets. Learn how framing, language, and emphasis shape public
          perception.
        </p>

        <div className="flex gap-3 py-5 sm:justify-end border-b-1 border-fg-dark-tertiary">
          <Select
            name="sort-select"
            options={SORT_OPTIONS}
            handleChange={handleSortChange}
            defaultValue={selectedSort}
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

      <PageSection className="pt-10 gap-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {previewsLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
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
            ))}
          </>
        ) : (
          <>
            {previews.map((p) => {
              const pubTime = new Date(p.publishedTime);
              const truncatedExcerpt = p.excerpt.substring(0, 200) + "...";

              return (
                <div
                  key={p.slug}
                  className="flex flex-col gap-5 px-5 py-7 rounded-2xl border-1 border-fg-dark-tertiary"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-fg-dark-tertiary underline underline-offset-4 decoration-dotted hover:text-fg-dark active:text-fg-dark">
                      <Link to={`/sources/${p.source.slug}`}>
                        {p.source.name}
                      </Link>
                    </h3>
                    <span
                      className={`font-medium py-1 px-2 rounded-sm capitalize text-fg-light ${
                        biasClasses[p.source.bias] ?? "bg-stone-600"
                      }`}
                    >
                      {p.source.bias.replace("-", " ")}
                    </span>
                  </div>

                  <h2 className="text-xl">{p.title}</h2>

                  <p className="text-fg-dark-tertiary text-lg">
                    {truncatedExcerpt}
                  </p>

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
            })}
          </>
        )}
      </PageSection>
    </SiteLayout>
  );
};

export default BrowsePage;
