import { useParams } from "react-router";
import SiteLayout from "../components/layouts/site-layout";
import useArticles from "../hooks/use-articles";
import { useEffect } from "react";

const ArticlePage = () => {
  const { slug } = useParams();
  const { getArticleDetails, article } = useArticles();

  if (!slug) {
    return <>err</>;
  }

  useEffect(() => {
    getArticleDetails(slug);
  }, []);

  return (
    <SiteLayout>
      <h1 className="text-4xl">Article Page</h1>
      <p>{slug}</p>
    </SiteLayout>
  );
};

export default ArticlePage;
