import fs from "fs";
import { VertexAI } from "@google-cloud/vertexai";
import {
  GCP_PROJECT_ID,
  GCP_REGION,
  SYSTEM_PROMPT_PATH,
} from "../../../config/env";

const SYSTEM_PROMPT = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf-8");

const ai = new VertexAI({
  project: GCP_PROJECT_ID,
  location: GCP_REGION,
});

const model = ai.preview.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  systemInstruction: {
    role: "system",
    parts: [{ text: SYSTEM_PROMPT }],
  },
});

export default model;
