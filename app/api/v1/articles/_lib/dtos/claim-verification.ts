export type ClaimVerificationDTO = {
  requestID: string;
  resolvedSearchType: string;
  output: {
    content: string;
    grounding: {
      field: string;
      citations: {
        url: string;
        title: string;
      }[];
    }[];
  };
  results: {
    id: string;
    title: string;
    url: string;
    publishedDate: string;
  }[];
  searchTime: number;
  costDollars: {
    total: number;
  };
};
