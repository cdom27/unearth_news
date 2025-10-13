import pool from "../../db/client";
import type { ArticlePreviewDTO } from "@shared/dtos/article-preview";
import type { Article } from "./types/article";
import type { ParsedArticle } from "./types/parsed-article";

export const ArticleRepository = {
  // Find an existing article record by url
  async findByText(column: string, value: string): Promise<Article | null> {
    const result = await pool.query(
      `SELECT * FROM articles WHERE ${column} = $1 LIMIT 1`,
      [value]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      sourceId: row.source_id,
      url: row.url,
      title: row.title,
      language: row.language,
      byline: row.byline,
      excerpt: row.excerpt,
      htmlContent: row.html_content,
      textContent: row.text_content,
      keywords: row.keywords,
      thumbnailUrl: row.thumbnail_url,
      publishedTime: row.published_time,
      createdAt: row.created_at,
    };
  },

  // Insert article record and return it, else fallback to select query
  async save(
    sourceId: string,
    article: ParsedArticle,
    thumbnailUrl: string
  ): Promise<Article | null> {
    const insertResult = await pool.query(
      "INSERT INTO articles (source_id, url, title, language, byline, excerpt, html_content, text_content, keywords, thumbnail_url, published_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (url) DO NOTHING RETURNING *",
      [
        sourceId,
        article.url,
        article.title,
        article.language,
        article.byline,
        article.excerpt,
        article.htmlContent,
        article.textContent,
        article.keywords,
        thumbnailUrl,
        article.publishedTime,
      ]
    );

    if (insertResult.rows.length > 0) {
      const row = insertResult.rows[0];
      return {
        id: row.id,
        sourceId: row.source_id,
        url: row.url,
        title: row.title,
        language: row.language,
        byline: row.byline,
        excerpt: row.excerpt,
        htmlContent: row.html_content,
        textContent: row.text_content,
        keywords: row.keywords,
        thumbnailUrl: row.thumbnail_url,
        publishedTime: row.published_time,
        createdAt: row.created_at,
      };
    }

    // insert failed due to constraints, find existing record by url
    return await ArticleRepository.findByText("url", article.url);
  },

  // Find data for article previews (joined article, analysis, and source ids)
  async findPreviewBySourceId(
    limit: number,
    offset: number,
    sourceIds: string[] | null,
    sort?: string
  ): Promise<ArticlePreviewDTO[]> {
    const sortClause =
      sort === "date_asc"
        ? "ORDER BY a.published_time ASC"
        : "ORDER BY a.published_time DESC";

    const params: any[] = [];
    let paramIndex = 1;
    let whereClause = "";

    if (sourceIds && sourceIds.length > 0) {
      const placeholders = sourceIds.map(() => `$${paramIndex++}`).join(",");
      whereClause = `WHERE a.source_id IN (${placeholders})`;
      params.push(...sourceIds);
    }

    params.push(limit, offset);

    const query = `
      SELECT 
        a.title,
        a.excerpt,
        a.thumbnail_url,
        a.published_time,
        s.name as source_name,
        s.slug as source_slug,
        s.bias as source_bias,
        an.slug as analysis_slug
      FROM articles a
      JOIN sources s ON a.source_id = s.id
      LEFT JOIN analyses an ON a.id = an.article_id
      ${whereClause}
      ${sortClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;

    const result = await pool.query(query, params);
    return result.rows;
  },
};
