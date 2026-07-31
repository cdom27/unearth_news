export type CardSource = {
  name: string;
  bias?: "Left" | "Lean Left" | "Center" | "Lean Right" | "Right" | null;
};

export type CardArticle = {
  title: string;
  thumbnailUrl?: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
  url: string;
};

export type BaseCard = {
  source: CardSource;
  article: CardArticle;
};
