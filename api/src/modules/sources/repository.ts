import pool from "../../db/client";
import type { Source } from "./types/source";

export const SourceRepository = {
  // Find an existing source record by url
  async findByText(column: string, value: string): Promise<Source | null> {
    const result = await pool.query(
      `SELECT * FROM sources WHERE ${column} = $1 LIMIT 1`,
      [value]
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

  // Insert a newly created source and return it, else fallback to select query
  async save(name: string, url: string): Promise<Source | null> {
    const insertResult = await pool.query(
      "INSERT INTO sources (name, url) VALUES ($1, $2) ON CONFLICT (url, name) DO NOTHING RETURNING *",
      [name, url]
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
  async filter(conditions: string[], params: string[]): Promise<string[]> {
    const where = `WHERE ${conditions.join(" AND ")}`;
    const query = `SELECT id FROM sources ${where}`;
    const result = await pool.query(query, params);

    return result.rows.map((row) => row.id);
  },
};
