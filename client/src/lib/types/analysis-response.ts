export type AnalysisResponse = {
  slug: string;
  relatedArticles: {
    source: {
      id: string;
      name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToimage: string;
    publishedAt: string;
    content: string;
  }[];
};
