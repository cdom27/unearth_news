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
  urlToImage: string;
  publishedAt: string;
  content: string;
};
