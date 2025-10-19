const AVAILABLE_BIASES = ["left", "lean-left", "center", "lean-right", "right"];

const RATING_SORT_OPTIONS = [
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
];

const ARTICLE_SORT_OPTIONS = [
  { value: "date_desc", label: "Newest" },
  { value: "date_asc", label: "Oldest" },
];

export { AVAILABLE_BIASES, RATING_SORT_OPTIONS, ARTICLE_SORT_OPTIONS };
