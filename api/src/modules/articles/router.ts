import { Router } from "express";
import { analyzeArticles } from "./controller";

const router = Router();

// /api/v1/articles
router.post("", analyzeArticles);

export default router;
