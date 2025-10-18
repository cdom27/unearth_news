import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import useSources from "../hooks/use-sources";
import Select from "../components/ui/select";
import FilterMenu from "../components/ui/filter-menu";

const AVAILABLE_BIASES = ["left", "lean-left", "center", "lean-right", "right"];
const SORT_OPTIONS = [
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
];

const biasClasses: Record<string, string> = {
  left: "bg-bias-left",
  "lean-left": "bg-bias-lean-left",
  center: "bg-stone-600",
  "lean-right": "bg-bias-lean-right",
  right: "bg-bias-right",
};

const RatingsPage = () => {
  const { getSourcePreviews, previews, previewsLoading } = useSources();
  const [searchParams, setSearchParams] = useSearchParams();

  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedBiases, setSelectedBiases] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("name_asc");

  useEffect(() => {
    const biases = searchParams.get("bias")?.split(",").filter(Boolean) || [];
    const sort = searchParams.get("sort") || "name_asc";

    setSelectedBiases(biases);
    setSelectedSort(sort);
    setReady(true);
  }, [searchParams]);

  const updateURL = useCallback(
    (biases: string[], sort: string) => {
      const params = new URLSearchParams();

      if (biases.length > 0) {
        params.set("bias", biases.join(","));
      }
      if (sort !== "name_asc") {
        params.set("sort", sort);
      }

      setSearchParams(params);
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (ready) {
      getSourcePreviews({
        bias: selectedBiases,
        sort: selectedSort,
      });
    }
  }, [getSourcePreviews, selectedBiases, selectedSort, ready]);

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    updateURL(selectedBiases, sort);
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
            options={SORT_OPTIONS}
            handleChange={handleSortChange}
            value={selectedSort}
          />

          <FilterMenu
            setOpen={setOpen}
            open={open}
            biasOptions={AVAILABLE_BIASES}
            selectedBiases={selectedBiases}
            onApply={(biases) => {
              setSelectedBiases(biases);
              updateURL(biases, selectedSort);
            }}
            onClear={() => {
              setSelectedBiases([]);
              setSelectedSort("name_asc");
              updateURL([], "name_asc");
            }}
          />
        </div>
      </PageSection>

      <PageSection className="pt-10">
        {previewsLoading ? (
          <p>loading source ratings</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b-1 border-fg-dark-tertiary">
                  <th className="text-left py-3 px-4 font-semibold text-fg-dark">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-fg-dark">
                    Media Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-fg-dark">
                    Bias
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-fg-dark">
                    Factual Reporting
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-fg-dark">
                    Credibility
                  </th>
                </tr>
              </thead>
              <tbody>
                {previews.map((p) => (
                  <tr
                    key={p.slug}
                    className="border-b-1 border-fg-dark-tertiary"
                  >
                    <td className="py-3 px-4">
                      <Link
                        to={`/media-ratings/${p.slug}`}
                        className="text-fg-dark-secondary hover:text-fg-dark underline decoration-dotted underline-offset-4"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-fg-dark-tertiary">
                      {p.mediaType}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-white text-sm ${
                          biasClasses[p.bias] || "bg-stone-600"
                        }`}
                      >
                        {p.bias}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-fg-dark-tertiary">
                      {p.factualReporting}
                    </td>
                    <td className="py-3 px-4 text-fg-dark-tertiary">
                      {p.credibility}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageSection>
    </SiteLayout>
  );
};

export default RatingsPage;
