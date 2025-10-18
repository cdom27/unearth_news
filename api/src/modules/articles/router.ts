import { Router } from "express";
import {
  analyzeArticleHandler,
  getArticleDetailsHandler,
  getArticlePreviewsHandler,
} from "./controller";

const router = Router();

// /api/v1/articles
router.post("/", analyzeArticleHandler);
router.get("/", getArticlePreviewsHandler);
router.get("/:slug", getArticleDetailsHandler);

export default router;
