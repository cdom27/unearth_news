import { z } from "zod";

export const AnalyzeUrlSchema = z.object({
  url: z.url().min(1, "URL is required"),
});

export type AnalyzeUrlData = z.infer<typeof AnalyzeUrlSchema>;
