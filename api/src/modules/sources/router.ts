import { Router } from "express";
import { getSourcesHandler } from "./controller";

const router = Router();

// /api/v1/sources
router.get("", getSourcesHandler);

export default router;
