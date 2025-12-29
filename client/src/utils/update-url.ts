export const updateURL = (
  sortValue: string,
  sortDefault: string,
  sources: string[],
  biases: string[],
  page: number,
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

  if (page !== 1) {
    params.set("page", page.toString());
  }

  return params;
};
