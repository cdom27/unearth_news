export const validateArrayParams = (arr: string | undefined): string[] => {
  const arrParam = typeof arr === "string" ? arr : undefined;

  return arrParam ? arrParam.split(",").filter((s) => s.trim()) : [];
};
