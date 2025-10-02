import { Request, Response } from "express";
import {
  findAnalysisByArticleId,
  findAnalysisBySlug,
  saveAndReturnAnalysis,
} from "../analyses/service";
import { failure, success } from "../shared/utils/build-response";
import fetchNewsApiArticles from "../shared/utils/fetch-news-api";
import slugify from "../shared/utils/slugify";
import {
  findSourceByDomain,
  findSourceById,
  saveAndReturnSource,
} from "../sources/service";
import {
  findArticleById,
  findArticleByUrl,
  saveAndReturnArticle,
} from "./service";
import analyzeArticle from "./utils/analyze-article";
import { normalizeUrl } from "./utils/normalize-url";
import parseArticle from "./utils/parse-article";
import type { AnalysisRequest } from "./dtos/analysis-request";
import type { ArticleSlugParams } from "./types/article-slug-params";
import type { ArticleDetailsDTO } from "@shared/dtos/article-details";
import type { AnalyzeMetaDTO } from "@shared/dtos/analyze-meta";

export const analyzeArticles = async (
  req: Request<{}, {}, AnalysisRequest>,
  res: Response
) => {
  try {
    const { url } = req.body;

    if (!url) {
      return failure(res, "Request body is missing", 400);
    }

    const normalizedUrl = normalizeUrl(url);

    // attempt article lookup
    let article = await findArticleByUrl(normalizedUrl);
    let slug = "";
    let keywords;

    if (!article) {
      const parsedArticle = await parseArticle(normalizedUrl);
      if (!parsedArticle) {
        return failure(res, "Unable to parse article", 422);
      }
      keywords = parsedArticle.keywords;

      // attempt source lookup
      let source = await findSourceByDomain(parsedArticle.sourceName);

      if (!source) {
        const hostname = new URL(parsedArticle.url).hostname;
        source = await saveAndReturnSource(parsedArticle.sourceName, hostname);
      }

      article = await saveAndReturnArticle(source.id, parsedArticle);
      slug = slugify(article.title);
    }

    // attempt analysis lookup
    let analysis = await findAnalysisByArticleId(article.id);

    if (!analysis) {
      const analysisResponse = await analyzeArticle(article);

      if (!analysisResponse) {
        return failure(res, "Unable to analyze article", 422);
      }

      analysis = await saveAndReturnAnalysis(
        article.id,
        slug,
        analysisResponse
      );
    }

    // fetch related articles
    const newsApiResponse = await fetchNewsApiArticles(
      keywords || article.title
    );

    const payload: AnalyzeMetaDTO = {
      slug: analysis.slug,
      relatedArticles: newsApiResponse.articles,
    };

    return success(res, payload, "Successfully analyzed article");
  } catch (error) {
    console.log("Error processing analysis:", error);
    return failure(res, "Internal error while processing analysis");
  }
};

export const getArticleDetails = async (
  req: Request<ArticleSlugParams>,
  res: Response
) => {
  // validate slug
  // get analysis
  // get article
  // get source
  // build payload
  try {
    const { slug } = req.params;

    if (!slug) {
      return failure(res, "Request params are missing", 400);
    }

    // attempt lookups
    const analysis = await findAnalysisBySlug(slug);

    if (analysis) {
      const article = await findArticleById(analysis.articleId);

      if (article) {
        const source = await findSourceById(article.sourceId);

        if (source) {
          const payload: ArticleDetailsDTO = {
            article: {
              url: article.url,
              title: article.title,
              language: article.language,
              byline: article.byline,
              excerpt: article.excerpt,
              textContent: article.textContent,
              publishedTime: article.publishedTime,
            },
            source: {
              name: source.name,
              domain: source.domain,
            },
            analysis: {
              slug: analysis.slug,
              summary: analysis.summary,
              sentiment: analysis.sentiment,
              framing: analysis.framing,
              confidence: analysis.meta.confidence,
            },
          };

          return success(res, payload, "Successfully fetched article details");
        }
      }
    }

    return failure(res, "Article details not found", 404);
  } catch (error) {
    console.error("Error whil fetching article details:", error);
    return failure(res, "Internal error while fetching article details");
  }
};
