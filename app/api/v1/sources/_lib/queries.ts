import { db } from "@/app/_lib/db/client";
import { sources } from "@/app/_lib/db/schema";
import { asc, count, sql } from "drizzle-orm";
import type { SourcesQuery } from "./sanitize-query";

function buildWhereClause(search?: string) {
  if (!search) return undefined;

  return sql`(
    setweight(to_tsvector('english', coalesce(${sources.name}, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(${sources.url}, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(${sources.country}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${sources.mediaType}, '')), 'B')
  ) @@ websearch_to_tsquery('english', ${search})`;
}

export async function querySources({
  page,
  pageSize,
  search,
}: SourcesQuery) {
  const offset = (page - 1) * pageSize;
  const whereClause = buildWhereClause(search);

  const [rows, totalResultsQuery] = await Promise.all([
    db
      .select({
        id: sources.id,
        name: sources.name,
        url: sources.url,
        slug: sources.slug,
        bias: sources.bias,
        factualReporting: sources.factualReporting,
        credibility: sources.credibility,
        country: sources.country,
        mediaType: sources.mediaType,
      })
      .from(sources)
      .where(whereClause)
      .orderBy(asc(sources.name), asc(sources.slug))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: count() }).from(sources).where(whereClause),
  ]);

  return {
    rows,
    totalResults: totalResultsQuery[0]?.count ?? 0,
  };
}
