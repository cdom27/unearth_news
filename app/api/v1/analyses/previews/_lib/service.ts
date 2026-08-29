import { mapRowToPreview } from "../_utils/map-previews";
import { queryAnalysesPreviews } from "./queries";
import { sanitizePreviewsQuery } from "../_utils/sanitize-query";
import type { PreviewsResult } from "@/app/_lib/types/analyses-previews";

export async function getAnalysesPreviews(
  searchParams: URLSearchParams,
): Promise<PreviewsResult> {
  const params = sanitizePreviewsQuery(searchParams);
  const { rows, totalResults } = await queryAnalysesPreviews(params);
  const previews = rows.map(mapRowToPreview);

  return { previews, totalResults };
}
