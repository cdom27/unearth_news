export type ArticlePreviewDTO = {
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  publishedTime: string;
  source: {
    name: string;
    slug: string;
    bias: string;
  };
  slug: string;
};
