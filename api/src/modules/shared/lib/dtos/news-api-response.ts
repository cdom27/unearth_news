type NewsApiSource = {
  id: string;
  name: string;
};

export type NewsApiArticle = {
  source: NewsApiSource;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToimage: string;
  publishedAt: string;
  content: string;
};

export type NewsApiResponse = {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
};
