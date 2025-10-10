import pool from "../../db/client";
import { Article } from "./types/article";
import { ParsedArticle } from "./types/parsed-article";
import type { ArticlePreviewDTO } from "@shared/dtos/article-preview";

// Find an existing article record by url
export const findArticleByUrl = async (
  url: string
): Promise<Article | null> => {
  try {
    const result = await pool.query(
      "SELECT * FROM articles WHERE url = $1 LIMIT 1",
      [url]
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
  } catch (error) {
    console.error(`Error occurred while finding article:`, error);
    throw new Error(`Error occurred while finding artcile`);
  }
};

// Find an existing article record by id
export const findArticleById = async (id: string): Promise<Article | null> => {
  try {
    const result = await pool.query(
      "SELECT * FROM articles WHERE id = $1 LIMIT 1",
      [id]
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
  } catch (error) {
    console.error(`Error occurred while finding article:`, error);
    throw new Error(`Error occurred while finding artcile`);
  }
};

// Insert article record and return it, else fallback to select query
export const saveAndReturnArticle = async (
  sourceId: string,
  parsedArticle: ParsedArticle,
  thumbnailUrl: string
): Promise<Article> => {
  const insertResult = await pool.query(
    "INSERT INTO articles (source_id, url, title, language, byline, excerpt, html_content, text_content, keywords, thumbnail_url, published_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (url) DO NOTHING RETURNING *",
    [
      sourceId,
      parsedArticle.url,
      parsedArticle.title,
      parsedArticle.language,
      parsedArticle.byline,
      parsedArticle.excerpt,
      parsedArticle.htmlContent,
      parsedArticle.textContent,
      parsedArticle.keywords,
      thumbnailUrl,
      parsedArticle.publishedTime,
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
  const selectResult = await findArticleByUrl(parsedArticle.url);
  if (!selectResult) {
    throw new Error(
      `Article not found after conflict insert: ${parsedArticle.url}`
    );
  }

  return selectResult;
};

// Find articles and build article preview DTO using joins
export const findArticlePreviews = async (
  sourceIds: string[] | null,
  sort: string,
  page: number,
  pageSize: number
): Promise<{ articles: ArticlePreviewDTO[]; totalCount: number }> => {
  const sortClause =
    sort === "date_asc"
      ? "ORDER BY published_time ASC"
      : "ORDER BY published_time DESC";

  const offset = (page - 1) * pageSize;

  let whereClause = "";
  let queryParams: string[] = [];
  let paramIndex = 1;

  if (sourceIds && sourceIds.length > 0) {
    const placeholders = sourceIds.map(() => `$${paramIndex++}`).join(",");
    whereClause = `WHERE a.source_id IN (${placeholders})`;
    queryParams.push(...sourceIds); // Add sourceIds to queryParams
  }

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
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const countQuery = `SELECT COUNT(*) as total FROM articles a ${whereClause}`;

  const [articlesResult, countResult] = await Promise.all([
    pool.query(query, [...queryParams, pageSize, offset]),
    pool.query(countQuery, queryParams),
  ]);

  const articles: ArticlePreviewDTO[] = articlesResult.rows.map((row) => ({
    title: row.title,
    excerpt: row.excerpt,
    thumbnailUrl: row.thumbnail_url,
    publishedTime: row.published_time,
    source: {
      name: row.source_name,
      slug: row.source_slug,
      bias: row.source_bias,
    },
    slug: row.analysis_slug || "",
  }));

  return {
    articles,
    totalCount: parseInt(countResult.rows[0].total),
  };
};
