export type FilterOption = {
  value: string;
  count: number;
};

export type SourceFilterOption = FilterOption & {
  name: string;
  slug: string;
};

export type ScoreRange = {
  min: number | null;
  max: number | null;
};

export type DateRange = {
  min: string | null;
  max: string | null;
};

export type PreviewFilterMetadata = {
  sources: SourceFilterOption[];
  sentiments: FilterOption[];
  credibilities: FilterOption[];
  biasScore: ScoreRange;
  factualScore: ScoreRange;
  publishedAt: DateRange;
};
