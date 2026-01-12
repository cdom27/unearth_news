import { Router } from "express";
import {
  getSourceDetailsHandler,
  getSourcePreviewsHandler,
  getSourcesHandler,
} from "./controller";

const router = Router();

// /api/v1/sources
router.get("/", getSourcesHandler);
router.get("/ratings", getSourcePreviewsHandler);
router.get("/:slug", getSourceDetailsHandler);

export default router;
