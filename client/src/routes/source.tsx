import { useEffect } from "react";
import { useParams } from "react-router";
import Meta from "../components/layouts/meta";
import SiteLayout from "../components/layouts/site-layout";
import ErrorPage from "./error";
import useSources from "../hooks/use-sources";

const SourcePage = () => {
  const { slug } = useParams();
  const { getSourceDetails, source, isSourceLoading } = useSources();

  useEffect(() => {
    getSourceDetails(slug || "");
  }, [getSourceDetails, slug]);

  if (!slug) {
    return <ErrorPage />;
  }

  if (isSourceLoading) {
    return <div>LOADING</div>;
  }

  if (!source) {
    return <ErrorPage />;
  }

  return (
    <SiteLayout>
      <Meta title="" description="" canonicalUrl="" />
      <h1>{source.name}</h1>
      <p>Cred: {source.credibility}</p>
    </SiteLayout>
  );
};
export default SourcePage;
