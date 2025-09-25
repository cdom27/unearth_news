import { Router } from "express";
import { analyze } from "./controller";

const router = Router();

// /api/v1/analyses
router.post("", analyze);

export default router;
