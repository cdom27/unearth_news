import { Request, Response } from "express";
import { success, failure } from "../shared/utils/build-response";
import analyzeArticle from "./utils/analyze-article";
import parseArticle from "./utils/parse-article";
import type { Analysis } from "./types/analysis";
import { AnalysisRequest } from "./dtos/analysis-request";
import { normalizeUrl } from "./utils/normalize-url";

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

    const parsedArticle = await parseArticle(normalizedUrl);
    if (!parsedArticle) {
      return failure(res, "Unable to parse article", 422);
    }

    const analysis = await analyzeArticle(parsedArticle);
    if (!analysis) {
      return failure(res, "Unable to analyze article", 422);
    }

    const parsedAnalysis: Analysis = JSON.parse(analysis);

    return success(res, parsedAnalysis, "Successfully analyzed url");
  } catch (error) {
    console.log("Error generating:", error);
    return failure(res, "Internal error while generating");
  }
};
