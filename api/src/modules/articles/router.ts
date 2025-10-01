import { Router } from "express";
import { analyzeArticles, getArticleDetails } from "./controller";

const router = Router();

// /api/v1/articles
router.post("", analyzeArticles);
router.get("/:slug", getArticleDetails);

export default router;
