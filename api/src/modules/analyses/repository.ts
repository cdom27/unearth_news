import pool from "../../db/client";
import type { Analysis } from "./types/analysis";
import type { GeminiResponseDTO } from "../shared/dtos/gemini-response";
import type { AnalysisDetails } from "./types/analysis-details";

export const AnalysisRepository = {
  // Find an existing analysis for an article
  async findByText(column: string, value: string): Promise<Analysis | null> {
    const result = await pool.query(
      `SELECT * FROM analyses WHERE ${column} = $1 LIMIT 1`,
      [value]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      articleId: row.article_id,
      slug: row.slug,
      summary: row.summary,
      bias: row.bias,
      sentiment: row.sentiment,
      framing: row.framing,
      meta: row.meta,
      createdAt: row.created_at,
    };
  },

  // Insert analysis record and return it, elase fallback to select query
  async save(
    articleId: string,
    slug: string,
    aiResponse: GeminiResponseDTO
  ): Promise<Analysis | null> {
    const insertResult = await pool.query(
      "INSERT INTO analyses (article_id, slug, summary, sentiment, framing, meta) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (article_id) DO NOTHING RETURNING *",
      [
        articleId,
        slug,
        aiResponse.summary,
        aiResponse.sentiment,
        aiResponse.framing,
        aiResponse.meta,
      ]
    );

    if (insertResult.rows.length > 0) {
      const row = insertResult.rows[0];
      return {
        id: row.id,
        articleId: row.article_id,
        slug: row.slug,
        summary: row.summary,
        bias: row.bias,
        sentiment: row.sentiment,
        framing: row.framing,
        meta: row.meta,
        createdAt: row.created_at,
      };
    }

    // insert failed due to constraints, find existing record
    return await AnalysisRepository.findByText("article_id", articleId);
  },

  // Find full analysis details by slug (joined analysis, article, and source ids)
  async findAnalysisDetails(slug: string): Promise<AnalysisDetails | null> {
    const query = `
      SELECT
        an.slug,
        an.summary,
        an.sentiment,
        an.framing,
        an.meta,
        ar.url as article_url,
        ar.title as article_title,
        ar.language as article_language,
        ar.byline as article_byline,
        ar.excerpt as article_excerpt,
        ar.text_content as article_text_content,
        ar.thumbnail_url as article_thumbnail_url,
        ar.published_time as article_published_time,
        ar.keywords as article_keywords,
        s.name as source_name,
        s.url as source_url,
        s.slug as source_slug,
        s.bias as source_bias,
        s.factual_reporting as source_factual_reporting,
        s.country as source_country,
        s.media_type as source_media_type,
        s.credibility as source_credibility
      FROM analyses an
      JOIN articles ar ON an.article_id = ar.id
      JOIN sources s ON ar.source_id = s.id
      WHERE an.slug = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [slug]);
    const row = result.rows[0];
    if (!row) return null;

    return {
      article: {
        url: row.article_url,
        title: row.article_title,
        language: row.article_language,
        byline: row.article_byline,
        excerpt: row.article_excerpt,
        textContent: row.article_text_content,
        thumbnailUrl: row.article_thumbnai_url,
        publishedTime: row.article_published_time,
        keywords: row.article_keywords,
      },
      source: {
        name: row.source_name,
        url: row.source_url,
        slug: row.source_slug,
        bias: row.source_bias,
        factualReporting: row.source_factual_reporting,
        country: row.source_country,
        mediaType: row.source_media_type,
        credibility: row.source_credibility,
      },
      analysis: {
        slug: row.slug,
        summary: row.summary,
        sentiment: row.sentiment,
        framing: row.framing,
        confidence: row.meta.confidence,
      },
    };
  },
};
