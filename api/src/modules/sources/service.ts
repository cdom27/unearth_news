import { SourceRepository } from "./repository";
import type { Result } from "../shared/types/service-result";

// Find sources by their bias and slug
export const findFilteredSourceIds = async (
  slugs?: string[],
  bias?: string[]
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
