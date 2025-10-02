import pool from "../../db/client";
import { GeminiResponseDTO } from "../shared/dtos/gemini-response";
import { Analysis } from "./types/analysis";

export const findAnalysisByArticleId = async (
  articleId: string
): Promise<Analysis | null> => {
  try {
    const result = await pool.query(
      "SELECT * FROM analyses WHERE article_id = $1 LIMIT 1",
      [articleId]
    );
    const row = result.rows[0];

    if (!row) return null;

    return {
      id: row.id,
      articleId: row.article_id,
      slug: row.slug,
      summary: row.summary,
      sentiment: row.sentiment,
      framing: row.framing,
      meta: row.meta,
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error(`Error occurred while finding analysis:`, error);
    throw new Error(`Error occurred while finding analysis`);
  }
};

export const findAnalysisBySlug = async (
  slug: string
): Promise<Analysis | null> => {
  try {
    const result = await pool.query(
      "SELECT * FROM analyses WHERE slug = $1 LIMIT 1",
      [slug]
    );
    const row = result.rows[0];

    if (!row) return null;

    return {
      id: row.id,
      articleId: row.article_id,
      slug: row.slug,
      summary: row.summary,
      sentiment: row.sentiment,
      framing: row.framing,
      meta: row.meta,
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error(`Error occurred while finding analysis:`, error);
    throw new Error(`Error occurred while finding analysis`);
  }
};

export const saveAndReturnAnalysis = async (
  articleId: string,
  slug: string,
  geminiResponse: GeminiResponseDTO
): Promise<Analysis> => {
  const insertResult = await pool.query(
    "INSERT INTO analyses (article_id, slug, summary, sentiment, framing, meta) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (article_id) DO NOTHING RETURNING *",
    [
      articleId,
      slug,
      geminiResponse.summary,
      geminiResponse.sentiment,
      geminiResponse.framing,
      geminiResponse.meta,
    ]
  );

  if (insertResult.rows.length > 0) {
    const row = insertResult.rows[0];
    return {
      id: row.id,
      articleId: row.article_id,
      slug: row.slug,
      summary: row.summary,
      sentiment: row.sentiment,
      framing: row.framing,
      meta: row.meta,
      createdAt: row.created_at,
    };
  }

  // insert failed due to constraints, find existing record
  const selectResult = await findAnalysisByArticleId(articleId);
  if (!selectResult) {
    throw new Error(`Analysis not found after conflic insert: ${articleId}`);
  }

  return selectResult;
};
