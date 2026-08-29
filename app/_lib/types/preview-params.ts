export type Params = {
  pagination: {
    page: number;
    pageSize: number;
  };
  filters?: {
    // analysis table
    minFactualScore?: number;
    minBiasScore?: number;
    sentiments?: string[];
    // article table
    minPublishedAt?: string;
    maxPublishedAt?: string;
    // source table
    sources?: string[]; // slugs
    biases?: string[];
    countries?: string[];
    mediaTypes?: string[];
    credibilities?: string[];
  };
  sorting: "newest" | "oldest" | "factualScore";
};
