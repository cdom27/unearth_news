import { Request, Response } from "express";
import { success, failure } from "../shared/utils/build-response";
import analyzeArticle from "./utils/analyze-article";
import parseArticle from "./utils/parse-article";
import { AnalysisRequest } from "./dtos/analysis-request";
import { normalizeUrl } from "./utils/normalize-url";
import { findArticleByUrl, saveAndReturnArticle } from "./service";
import { findSourceByDomain, saveAndReturnSource } from "../sources/service";
import {
  findAnalysisByArticleId,
  saveAndReturnAnalysis,
} from "../analyses/service";
import { GeminiResponse } from "./dtos/gemini-response";
import slugify from "./utils/slugify-title";

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

    if (!article) {
      const parsedArticle = await parseArticle(normalizedUrl);
      if (!parsedArticle) {
        return failure(res, "Unable to parse article", 422);
      }

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

      const geminiResponse = JSON.parse(analysisResponse) as GeminiResponse;

      analysis = await saveAndReturnAnalysis(article.id, slug, geminiResponse);
    }

    return success(res, { analysis }, "Successfully analyzed article");
  } catch (error) {
    console.log("Error processing analysis:", error);
    return failure(res, "Internal error while processing analysis");
  }
};
