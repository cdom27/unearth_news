type NewsApiSourceDTO = {
  id: string;
  name: string;
};

export type NewsApiArticleDTO = {
  source: NewsApiSourceDTO;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToimage: string;
  publishedAt: string;
  content: string;
};
