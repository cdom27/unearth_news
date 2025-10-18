import { SourceRepository } from "./repository";
import type { Result } from "../shared/types/service-result";
import type {
  SourceFilterDTO,
  SourceRatingPreviewDTO,
} from "@shared/dtos/source";

// Find all unique sources that have been references by an article
export const findUsedSources = async (): Promise<Result<SourceFilterDTO[]>> => {
  const sources = await SourceRepository.findUsed();
  return { success: true, data: sources };
};

// Find sources by their bias and slug
export const findFilteredSourceIds = async (
  slugs?: string[],
  bias?: string[],
): Promise<Result<string[]>> => {
  let conditions: string[] = [];
  let params: any[] = [];
  let paramIndex = 1;

  if (bias && bias.length > 0) {
    const placeholders = bias.map(() => `$${paramIndex++}`).join(",");
    conditions.push(`bias IN (${placeholders})`);
    params.push(...bias);
  }

  if (slugs && slugs.length > 0) {
    const placeholders = slugs.map(() => `$${paramIndex++}`).join(",");
    conditions.push(`slug IN (${placeholders})`);
    params.push(...slugs);
  }

  // return empty if no filters
  if (conditions.length === 0) {
    return { success: true, data: [] };
  }

  const sourceIds = await SourceRepository.filter(conditions, params);

  return { success: true, data: sourceIds };
};

// Find source media-rating previews
export const buildSourcePreviews = async (
  sourceIds: string[] | null,
  sort: string,
  page: number,
  pageSize: number,
): Promise<Result<{ previews: SourceRatingPreviewDTO[]; count: number }>> => {
  try {
    const offset = (page - 1) * pageSize;
    const result = await SourceRepository.findMultipleByText(
      "id",
      sourceIds,
      offset,
      pageSize,
      sort,
    );
    return { success: true, data: result };
  } catch (error) {
    console.error("Unexpected error: ");
    return { success: false, error: "Internal error" };
  }
};
