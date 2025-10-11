import { useSearchParams } from "react-router";
import SiteLayout from "../components/layouts/site-layout";
import useArticles from "../hooks/use-articles";
import { useEffect, useState, useCallback } from "react";

const AVAILABLE_SOURCES = [
  "nbc-news",
  "associated-press",
  "daily-caller",
  "cnbc",
];
const AVAILABLE_BIASES = ["left", "lean-left", "center", "lean-right", "right"];
const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
];

const DiscoverPage = () => {
  const { getArticlePreviews } = useArticles();
  const [searchParams, setSearchParams] = useSearchParams();

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
    getArticlePreviews({
      sources: selectedSources,
      bias: selectedBiases,
      sort: selectedSort,
    });
  }, [selectedSources, selectedBiases, selectedSort, getArticlePreviews]);

  const handleSourceChange = (source: string, checked: boolean) => {
    const newSources = checked
      ? [...selectedSources, source]
      : selectedSources.filter((s) => s !== source);

    setSelectedSources(newSources);
    updateURL(newSources, selectedBiases, selectedSort);
  };

  const handleBiasChange = (bias: string, checked: boolean) => {
    const newBiases = checked
      ? [...selectedBiases, bias]
      : selectedBiases.filter((b) => b !== bias);

    setSelectedBiases(newBiases);
    updateURL(selectedSources, newBiases, selectedSort);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    updateURL(selectedSources, selectedBiases, sort);
  };

  return (
    <SiteLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Discover Articles</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters & Sorting</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Sources</h3>
              <div className="space-y-2">
                {AVAILABLE_SOURCES.map((source) => (
                  <label key={source} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source)}
                      onChange={(e) =>
                        handleSourceChange(source, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">
                      {source.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Political Bias</h3>
              <div className="space-y-2">
                {AVAILABLE_BIASES.map((bias) => (
                  <label key={bias} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedBiases.includes(bias)}
                      onChange={(e) => handleBiasChange(bias, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">
                      {bias.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Sort By</h3>
              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={selectedSort === option.value}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={() => {
                setSelectedSources([]);
                setSelectedBiases([]);
                setSelectedSort("date_desc");
                updateURL([], [], "date_desc");
              }}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default DiscoverPage;
