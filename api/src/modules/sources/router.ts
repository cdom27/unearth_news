import { Router } from "express";
import { getSourcePreviewsHandler, getSourcesHandler } from "./controller";

const router = Router();

// /api/v1/sources
router.get("/", getSourcesHandler);
router.get("/ratings", getSourcePreviewsHandler);

export default router;
