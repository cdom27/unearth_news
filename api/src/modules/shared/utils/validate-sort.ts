export const validateSort = (
  sortInput: string | undefined,
  allowedSort: string[],
): string | null => {
  if (!sortInput || Array.isArray(sortInput)) {
    return null;
  }

  return allowedSort.includes(sortInput) ? sortInput : null;
};
