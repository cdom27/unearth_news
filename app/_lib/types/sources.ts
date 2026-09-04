export type Source = {
  id: string;
  name: string;
  url: string;
  slug: string;
  bias: string | null;
  factualReporting: string | null;
  credibility: string | null;
  country: string | null;
  mediaType: string | null;
};

export type SourcesResult = {
  sources: Source[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
