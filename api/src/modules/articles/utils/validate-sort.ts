import { SortOptions } from "../types/article-preview-query";

export const validateSort = (
  sortInput: string | string[] | undefined
): SortOptions | null => {
  if (!sortInput || Array.isArray(sortInput)) {
    return null;
  }

  const allowedSort: Array<SortOptions> = ["date_desc", "date_asc"];

  return allowedSort.includes(sortInput as SortOptions)
    ? (sortInput as SortOptions)
    : null;
};
