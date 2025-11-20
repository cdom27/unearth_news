import { useEffect } from "react";
import { useParams } from "react-router";
import useArticles from "../hooks/use-articles";
import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import DetailCard from "../components/ui/detail-card";
import TermTable from "../components/ui/term-table/term-table";
import Card from "../components/ui/card";

const ArticlePage = () => {
  const { slug } = useParams();
  const { getArticleDetails, article, isArticleLoading } = useArticles();

  useEffect(() => {
    getArticleDetails(slug || "");
  }, [getArticleDetails, slug]);

  // if (isArticleLoading) {
  //   return <>loading...</>;
  // }

  if (!slug || !article) {
    return <>err</>;
  }

  const a = article.article;
  const an = article.analysis;
  const ra = article.relatedArticles;
  const s = article.source;

  return (
    <SiteLayout>
      <PageSection>
        {/*Add metadata on top with social-share links and action buttons*/}
        <h1 className="font-instrument text-5xl tracking-[.0125em]">
          {a.title}
        </h1>

        <div className="flex flex-col pt-8 gap-2">
          <h4 className="font-medium text-lg">Summary by Unearth</h4>
          <p>{an.summary}</p>
        </div>
      </PageSection>

      <PageSection className="flex flex-col gap-10 mt-25 2xl:mt-60">
        <div>
          <h2 className="font-instrument text-4xl tracking-[.0125em]">
            Unearth Report
          </h2>

          <div className="flex flex-col pt-8 gap-2">
            <h4 className="font-medium text-lg">Overall Narrative</h4>
            <p>{an.framing.narrative}</p>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <h3 className="font-instrument text-3xl tracking-[.0125em]">
            Fact Check
          </h3>

          {an.framing.claims.map((c, index) => (
            <DetailCard c={c} key={index} />
          ))}
        </div>

        <div className="flex flex-col gap-10">
          <h3 className="font-instrument text-3xl tracking-[.0125em]">
            Term Analysis
          </h3>

          <TermTable ts={an.framing.terms} />
        </div>

        <h2 className="font-instrument text-4xl tracking-[.0125em]">
          Media Report
        </h2>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="font-instrument text-3xl tracking-[.0125em]">
              Transcript
            </h3>

            <p>
              Read full article on{" "}
              <a
                href={a.url}
                className="underline underline-offset-4 decoration-dotted font-medium"
              >
                {s.name}
              </a>
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto border-t-1 border-b-1 border-fg-dark-tertiary p-2">
            <p className="whitespace-pre-line text-gray-800">{a.textContent}</p>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <h3 className="font-instrument text-3xl tracking-[.0125em]">
            Related Articles
          </h3>

          {ra.map((a) => {
            const pub = new Date(`${a.publishedAt}`);
            return (
              <Card>
                <Card.Heading>{a.title}</Card.Heading>
                <Card.Body>
                  <p>{a.description}</p>
                </Card.Body>
                <Card.Footer>
                  <span>{pub.getUTCDay()}</span>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      </PageSection>
    </SiteLayout>
  );
};

export default ArticlePage;
