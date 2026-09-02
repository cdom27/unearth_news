import { db } from "@/app/_lib/db/client";
import { analyses, articles, sources } from "@/app/_lib/db/schema";
import type {
  PreviewFilterMetadata,
  SourceFilterOption,
} from "@/app/_lib/types/preview-filter-metadata";
import { asc, count, desc, eq, ilike, inArray, isNotNull, max, min } from "drizzle-orm";

async function getSources(query?: string): Promise<SourceFilterOption[]> {
  const where = query
    ? ilike(sources.name, `%${query.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`)
    : undefined;

  const rows = await db
    .select({
      name: sources.name,
      slug: sources.slug,
      count: count(),
    })
    .from(analyses)
    .innerJoin(articles, eq(analyses.articleId, articles.id))
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(where)
    .groupBy(sources.name, sources.slug)
    .orderBy(desc(count()), asc(sources.name))
    .limit(10);

  return rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    value: row.slug,
    count: row.count,
  }));
}

async function getSourcesBySlug(slugs: string[]): Promise<SourceFilterOption[]> {
  if (!slugs.length) return [];

  const rows = await db
    .select({ name: sources.name, slug: sources.slug, count: count() })
    .from(analyses)
    .innerJoin(articles, eq(analyses.articleId, articles.id))
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(inArray(sources.slug, slugs))
    .groupBy(sources.name, sources.slug)
    .orderBy(asc(sources.name));

  return rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    value: row.slug,
    count: row.count,
  }));
}

export async function getPreviewFilterMetadata(
  sourceQuery?: string,
  selectedSourceSlugs: string[] = [],
): Promise<PreviewFilterMetadata> {
  const [
    sourcesResult,
    selectedSourcesResult,
    sentimentsResult,
    credibilitiesResult,
    rangesResult,
  ] = await Promise.all([
    getSources(sourceQuery?.trim() || undefined),
    getSourcesBySlug(selectedSourceSlugs),
    db
      .select({ value: analyses.sentiment, count: count() })
      .from(analyses)
      .innerJoin(articles, eq(analyses.articleId, articles.id))
      .innerJoin(sources, eq(articles.sourceId, sources.id))
      .where(isNotNull(analyses.sentiment))
      .groupBy(analyses.sentiment)
      .orderBy(asc(analyses.sentiment)),
    db
      .select({ value: sources.credibility, count: count() })
      .from(analyses)
      .innerJoin(articles, eq(analyses.articleId, articles.id))
      .innerJoin(sources, eq(articles.sourceId, sources.id))
      .where(isNotNull(sources.credibility))
      .groupBy(sources.credibility)
      .orderBy(asc(sources.credibility)),
    db
      .select({
        minBiasScore: min(analyses.biasScore),
        maxBiasScore: max(analyses.biasScore),
        minFactualScore: min(analyses.factualScore),
        maxFactualScore: max(analyses.factualScore),
        minPublishedAt: min(articles.publishedTime),
        maxPublishedAt: max(articles.publishedTime),
      })
      .from(analyses)
      .innerJoin(articles, eq(analyses.articleId, articles.id))
      .innerJoin(sources, eq(articles.sourceId, sources.id)),
  ]);

  const ranges = rangesResult[0];

  return {
    sources: Array.from(
      new Map(
        [...selectedSourcesResult, ...sourcesResult].map((source) => [source.slug, source]),
      ).values(),
    ),
    sentiments: sentimentsResult
      .filter((row): row is { value: string; count: number } => row.value !== null)
      .map((row) => ({ value: row.value, count: row.count })),
    credibilities: credibilitiesResult
      .filter((row): row is { value: string; count: number } => row.value !== null)
      .map((row) => ({ value: row.value, count: row.count })),
    biasScore: {
      min: ranges?.minBiasScore ?? null,
      max: ranges?.maxBiasScore ?? null,
    },
    factualScore: {
      min: ranges?.minFactualScore ?? null,
      max: ranges?.maxFactualScore ?? null,
    },
    publishedAt: {
      min: ranges?.minPublishedAt?.toISOString() ?? null,
      max: ranges?.maxPublishedAt?.toISOString() ?? null,
    },
  };
}
