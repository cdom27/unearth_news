// Resolve a query value to a postive number, fallback to defaults if invalid
export const resolveToNumber = (
  input: number | undefined,
  fallback: number,
  max?: number
) => {
  const MIN_NUMBER = 1;
  let resolvedNum = Number(input ?? fallback);

  if (!Number.isFinite(resolvedNum) || resolvedNum < MIN_NUMBER) {
    resolvedNum = fallback;
  }

  if (max) {
    resolvedNum = resolvedNum > max ? max : resolvedNum;
  }

  return resolvedNum;
};
