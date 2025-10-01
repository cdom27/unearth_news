import { Request, Response } from "express";
import { success, failure } from "../shared/utils/build-response";
import analyzeArticle from "./utils/analyze-article";
import parseArticle from "./utils/parse-article";
import type { Analysis } from "./types/analysis";
import { AnalysisRequest } from "./dtos/analysis-request";
import { normalizeUrl } from "./utils/normalize-url";
import { findArticleByUrl, saveAndReturnArticle } from "./service";
import { findSourceByDomain, saveAndReturnSource } from "../sources/service";

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
    }

    // analyze article
    const analysis = await analyzeArticle(article);
    if (!analysis) {
      return failure(res, "Unable to analyze article", 422);
    }

    const parsedAnalysis = JSON.parse(analysis) as Analysis;

    return success(res, parsedAnalysis, "Successfully analyzed url");
  } catch (error) {
    console.log("Error generating:", error);
    return failure(res, "Internal error while generating");
  }
};
