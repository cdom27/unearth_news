import InfoIcon from "../_components/icons/info";
import AnalysesGallery from "../_components/ui/analyses/analyses-gallery";
import Filters from "../_components/ui/filters/filters";
import Search from "../_components/ui/forms/search";
import type { Params } from "../_lib/types/preview-params";
import { DiscoverProvider } from "./_components/discover-provider";

const VALID_SORTS: Params["sorting"][] = ["newest", "oldest", "factualScore"];

function resolveSorting(
  value: string | string[] | undefined,
): Params["sorting"] {
  return typeof value === "string" &&
    VALID_SORTS.includes(value as Params["sorting"])
    ? (value as Params["sorting"])
    : "newest";
}

function resolveNumber(
  value: string | string[] | undefined,
): number | undefined {
  if (typeof value !== "string") return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 1
    ? number
    : undefined;
}

function resolveValues(
  value: string | string[] | undefined,
): string[] | undefined {
  if (typeof value !== "string") return undefined;
  const values = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return values.length ? values : undefined;
}

function resolveDate(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime())
    ? value
    : undefined;
}

export default async function Discover({
  searchParams,
}: PageProps<"/discover">) {
  const params = await searchParams;
  const { sort } = params;
  const initialSorting = resolveSorting(sort);
  const initialFilters = {
    minFactualScore: resolveNumber(params.minFactualScore),
    maxFactualScore: resolveNumber(params.maxFactualScore),
    minBiasScore: resolveNumber(params.minBiasScore),
    maxBiasScore: resolveNumber(params.maxBiasScore),
    minPublishedAt: resolveDate(params.minPublishedAt),
    maxPublishedAt: resolveDate(params.maxPublishedAt),
    sources: resolveValues(params.sources),
    sentiments: resolveValues(params.sentiments),
    credibilities: resolveValues(params.credibilities),
  };

  return (
    <DiscoverProvider
      key={`${initialSorting}-${JSON.stringify(initialFilters)}`}
      initialSorting={initialSorting}
      initialFilters={initialFilters}
    >
      <section className="m-4 sm:my-6 sm:mx-12 md:my-10 xl:my-16 2xl:my-22 pb-8 sm:pb-12 md:pb-16 xl:pb-22 2xl:pb-28 lg:mx-18 xl:mx-24 2xl:mx-auto 2xl:max-w-325 flex flex-col border-b border-clay-200">
        <div className="flex flex-col gap-6 pb-12">
          <h1 className="text-6xl lg:text-7xl font-serif">Discover</h1>
          <p className="text-lg font-sans max-w-150">
            Browse claims, sources, and fact-checked stories.
          </p>
        </div>

        <div
          className="pb-3 text-clay-400 flex items-center gap-1.5 self-start"
          title={`Search currently supports full-text search of titles and article content.\n\nSemantic search is actively being worked on, but not fully implemented.`}
        >
          <p className="italic">How search works</p>
          <InfoIcon className="size-4" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          <Search />
          <Filters />
        </div>
      </section>

      <article className="mx-4 mt-4 sm:mt-6 sm:mx-12 md:mt-10 xl:mt-16 2xl:mt-22 pt-4 sm:pt-6 lg:mx-18 xl:mx-24 2xl:mx-auto 2xl:max-w-325 flex flex-col gap-12">
        <AnalysesGallery />
      </article>
    </DiscoverProvider>
  );
}
