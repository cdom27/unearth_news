import { Router } from "express";
import {
  analyzeArticles,
  getArticleDetails,
  getArticlePreviews,
} from "./controller";

const router = Router();

// /api/v1/articles
router.post("", analyzeArticles);
router.get("", getArticlePreviews);
router.get("/:slug", getArticleDetails);

export default router;
