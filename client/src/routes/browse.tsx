import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useArticles from "../hooks/use-articles";
import useSources from "../hooks/use-sources";
import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import Select from "../components/ui/select";
import FilterMenu from "../components/ui/filter-menu";
import ArticleCard from "../components/ui/article-card/article-card";
import ArticleCardSkeleton from "../components/ui/article-card/article-card-skeleton";
import { ARTICLE_SORT_OPTIONS, AVAILABLE_BIASES } from "../utils/param-options";
import { updateURL } from "../utils/update-url";
import Meta from "../components/layouts/meta";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

const BrowsePage = () => {
  const { getArticlePreviews, previews, previewsLoading } = useArticles();
  const { getUsedSources, sources } = useSources();
  const [searchParams, setSearchParams] = useSearchParams();

  const [ready, setReady] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedBiases, setSelectedBiases] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("date_desc");
  const [selectedPage, setSelectedPage] = useState<number>(1);

  // first fetch available sources then build filter and sort options on load
  useEffect(() => {
    const sources =
      searchParams.get("sources")?.split(",").filter(Boolean) || [];
    const biases = searchParams.get("bias")?.split(",").filter(Boolean) || [];
    const sort = searchParams.get("sort") || "date_desc";
    const page = parseInt(searchParams.get("page") || "1") || 1;

    setSelectedSources(sources);
    setSelectedBiases(biases);
    setSelectedSort(sort);
    setSelectedPage(page);
    getUsedSources();
    setReady(true);
  }, [searchParams, getUsedSources]);

  // update url + fetch articles when ready
  useEffect(() => {
    if (ready) {
      const params = updateURL(
        selectedSort,
        "date_desc",
        selectedSources,
        selectedBiases,
        selectedPage,
      );
      setSearchParams(params);

      getArticlePreviews({
        sources: selectedSources,
        bias: selectedBiases,
        sort: selectedSort,
        page: selectedPage.toString(),
      });
    }
  }, [
    selectedSort,
    selectedSources,
    selectedBiases,
    selectedPage,
    ready,
    setSearchParams,
    getArticlePreviews,
  ]);

  return (
    <SiteLayout>
      <Meta
        title="Analyzed Articles - News Bias & Credibility Reports | Unearth"
        description="Browse AI-analyzed news articles with bias detection, misinformation alerts, and credibility scores. See how mainstream media outlets rate across factual accuracy."
        canonicalUrl="https://unearth.news/browse"
      />
      <PageSection>
        <h1 className="font-instrument text-5xl tracking-[.0125em]">
          Browse Stories
        </h1>
        <p className="pt-2 lg:w-2/3">
          Discover articles that reveal how narratives differ between media
          outlets. Learn how framing, language, and emphasis shape public
          perception.
        </p>

        <div className="flex gap-3 py-5 sm:justify-end border-b-1 border-fg-dark-tertiary">
          <Select
            name="sort-select"
            options={ARTICLE_SORT_OPTIONS}
            handleChange={setSelectedSort}
            value={selectedSort}
          />

          <FilterMenu
            sourceOptions={sources}
            biasOptions={AVAILABLE_BIASES}
            selectedSources={selectedSources}
            selectedBiases={selectedBiases}
            onApply={(sources, biases) => {
              setSelectedSources(sources);
              setSelectedBiases(biases);
            }}
            onClear={() => {
              setSelectedSources([]);
              setSelectedBiases([]);
              setSelectedSort("date_desc");
            }}
          />
        </div>
      </PageSection>

      <PageSection className="pt-10 gap-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {previewsLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        ) : (
          previews.map((p) => <ArticleCard p={p} key={p.slug} />)
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

export default BrowsePage;
