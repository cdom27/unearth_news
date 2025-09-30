import dotenv from "dotenv";

dotenv.config();

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const dbUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URL
    : process.env.DB_URL;

if (!dbUrl) {
  throw new Error("Database url is not defined");
}

// check if local env and validate credentials
const isLocal = !process.env.CI && process.env.NODE_ENV !== "production";

if (isLocal && !credentialsPath) {
  throw new Error("Path to GCP credentials must be defined in a local env");
}

const systemPromptPath = process.env.SYS_PROMPT_PATH;

if (!systemPromptPath) {
  throw new Error("System prompt is missing");
}

export const DB_URL = dbUrl;

export const GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
export const GCP_REGION = process.env.GCP_REGION;
export const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;

export const SYSTEM_PROMPT_PATH = systemPromptPath;
export const PORT = process.env.PORT || 3000;
export const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

export const NEWS_API_KEY = process.env.NEWS_API_KEY;
