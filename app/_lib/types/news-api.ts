export type NewsAPIResponse = {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
};

export type NewsAPIArticle = {
  source: {
    id: string | null;
    name: string | null;
  };
  author: string | null;
  title: string | null;
  description: string | null;
  url: string | null;
  urlToImage: string | null;
  publishedAt: string | null;
  content: string | null;
};
