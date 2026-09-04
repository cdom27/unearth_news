"use client";

import useSources from "@/app/_hooks/use-sources";
import Search from "@/app/_components/ui/forms/search";
import ArticleBadge from "@/app/_components/ui/article-cards/article-badge";
import { useMediaRatings } from "./media-ratings-provider";
import SourcesTableSkeleton from "./sources-table-skeleton";

function displayValue(value: string | null) {
  return value || "—";
}

const BIAS_LABELS: Record<string, string> = {
  left: "Left",
  "lean-left": "Lean Left",
  center: "Center",
  "lean-right": "Lean Right",
  right: "Right",
};

function normalizeBias(value: string) {
  return BIAS_LABELS[value] ?? value;
}

function sourceHref(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function SourcesTable() {
  const { search, page, saveSearch, setPage } = useMediaRatings();
  const { isFetching, sourcesResult } = useSources(search, page);
  const { sources, totalResults, totalPages } = sourcesResult;

  return (
    <div className="flex flex-col gap-8">
      <Search
        value={search}
        onSearch={saveSearch}
        inputLabel="Search sources by name, URL, country, or media type"
        placeholder="Search sources..."
        buttonLabel="Search Sources"
      />

      <div className="overflow-x-auto border border-clay-200 rounded-md">
        <table className="w-full min-w-212.5 border-collapse text-left">
          <caption className="sr-only">Media source ratings</caption>
          <thead className="bg-clay-150 text-sm">
            <tr>
              {[
                "Source",
                "Bias",
                "Factual reporting",
                "Credibility",
                "Country",
                "Media type",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-4 py-4 font-semibold"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          {isFetching && sources.length === 0 ? (
            <SourcesTableSkeleton />
          ) : (
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-t border-clay-200">
                  <th scope="row" className="px-4 py-4 font-semibold">
                    <div className="flex flex-col gap-1">
                      <span>{source.name}</span>
                      <a
                        href={`${sourceHref(source.url)}?ref=unearth.news`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-clay-500 hover:underline"
                      >
                        {source.url}
                      </a>
                    </div>
                  </th>
                  <td className="px-4 py-4">
                    {source.bias ? (
                      <div className="flex">
                        <ArticleBadge
                          variant="bias"
                          bias={normalizeBias(source.bias)}
                        />
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {displayValue(source.factualReporting)}
                  </td>
                  <td className="px-4 py-4">
                    {displayValue(source.credibility)}
                  </td>
                  <td className="px-4 py-4">{displayValue(source.country)}</td>
                  <td className="px-4 py-4">{displayValue(source.mediaType)}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {!isFetching && sources.length === 0 && (
          <p className="p-8 text-center text-clay-500">
            {search ? "No sources match your search." : "No sources found."}
          </p>
        )}
        {isFetching && (
          <p className="p-8 text-center text-clay-500">Fetching sources...</p>
        )}
      </div>

      <div className="flex flex-col gap-4 items-center sm:flex-row sm:justify-between">
        <p className="text-sm text-clay-500">
          Showing {sources.length ? (page - 1) * sourcesResult.pageSize + 1 : 0}
          –{(page - 1) * sourcesResult.pageSize + sources.length} of{" "}
          {totalResults} sources
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage(page - 1)}
              className="rounded-md border border-clay-200 px-4 py-2 hover:bg-clay-150 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2 py-2 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage(page + 1)}
              className="rounded-md border border-clay-200 px-4 py-2 hover:bg-clay-150 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
