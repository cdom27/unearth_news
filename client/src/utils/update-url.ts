export const updateURL = (
  sortValue: string,
  sortDefault: string,
  sources: string[],
  biases: string[],
) => {
  const params = new URLSearchParams();

  if (sources.length > 0) {
    params.set("sources", sources.join(","));
  }

  if (biases.length > 0) {
    params.set("bias", biases.join(","));
  }

  if (sortValue !== sortDefault) {
    params.set("sort", sortValue);
  }

  return params;
};
