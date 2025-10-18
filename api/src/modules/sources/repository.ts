import { SourceRatingPreviewDTO } from "@shared/dtos/source";
import pool from "../../db/client";
import type { Source } from "./types/source";

export const SourceRepository = {
  // Find an existing source record by a text value
  async findByText(column: string, value: string): Promise<Source | null> {
    const result = await pool.query(
      `SELECT * FROM sources WHERE ${column} = $1 LIMIT 1`,
      [value],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      url: row.url,
      slug: row.slug,
      bias: row.bias,
      factualReporting: row.factual_reporting,
      country: row.country,
      mediaType: row.media_type,
      credibility: row.credibility,
      createdAt: row.created_at,
    };
  },

  // Find multiple existing records
  async findMultipleByText(
    column: string,
    values: string[] | null,
    offset: number,
    limit: number,
    sort?: string,
  ): Promise<{ previews: SourceRatingPreviewDTO[]; count: number }> {
    const sortClause = sort === "name_asc" ? "name ASC" : "name DESC";
    let whereClause = "";
    let params = [];
    let paramIndex = 1;

    if (values && values.length > 0) {
      const placeholders = values.map(() => `$${paramIndex++}`).join(",");
      whereClause = `WHERE ${column} IN (${placeholders})`;
      params.push(...values);
    }

    params.push(limit, offset);

    const query = `
      SELECT
        name,
        slug,
        media_type,
        bias,
        factual_reporting,
        credibility,
        COUNT(*) OVER() AS total_count
      FROM sources
      ${whereClause}
      ORDER BY ${sortClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;

    const result = await pool.query(query, params);
    const rows = result.rows;
    const totalCount = rows[0]?.total_count ? Number(rows[0].total_count) : 0;

    return {
      previews: rows.map((row) => ({
        name: row.name,
        slug: row.slug,
        mediaType: row.media_type,
        bias: row.bias,
        factualReporting: row.factual_reporting,
        credibility: row.credibility,
      })),
      count: totalCount,
    };
  },

  // Find all unique sources that have been references by an article
  async findUsed(): Promise<{ name: string; slug: string }[]> {
    const result = await pool.query(
      "SELECT DISTINCT s.* FROM sources AS s JOIN articles AS a ON s.id = a.source_id",
    );

    const rows = result.rows;
    if (!rows) return [];

    return rows.map((row) => ({
      name: row.name,
      slug: row.slug,
    }));
  },

  // Insert a newly created source and return it, else fallback to select query
  async save(name: string, url: string): Promise<Source | null> {
    const insertResult = await pool.query(
      "INSERT INTO sources (name, url) VALUES ($1, $2) ON CONFLICT (url, name) DO NOTHING RETURNING *",
      [name, url],
    );

    if (insertResult.rows.length > 0) {
      const row = insertResult.rows[0];
      return {
        id: row.id,
        name: row.name,
        url: row.url,
        slug: row.slug,
        bias: row.bias,
        factualReporting: row.factual_reporting,
        country: row.country,
        mediaType: row.media_type,
        credibility: row.credibility,
        createdAt: row.created_at,
      };
    }

    // insert failed due to constraints, find existing record by url
    return await SourceRepository.findByText("url", url);
  },

  // Filter sources by bias and slug
  async filter(
    conditions: string[],
    params: string[],
    size?: "id" | "preview",
  ): Promise<string[]> {
    const where = `WHERE ${conditions.join(" AND ")}`;
    const query = `SELECT id FROM sources ${where}`;
    const result = await pool.query(query, params);

    return result.rows.map((row) => row.id);
  },
};
