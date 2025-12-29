import { useEffect } from "react";
import { useParams } from "react-router";
import useArticles from "../hooks/use-articles";
import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import DetailCard from "../components/ui/detail-card";
import TermTable from "../components/ui/term-table/term-table";
import Card from "../components/ui/card";
import Meta from "../components/layouts/meta";
import { LinkIcon } from "@phosphor-icons/react/dist/ssr";
import {
  EnvelopeIcon,
  LinkedinLogoIcon,
  RedditLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

const ArticlePage = () => {
  const { slug } = useParams();
  const { getArticleDetails, article, isArticleLoading } = useArticles();

  useEffect(() => {
    getArticleDetails(slug || "");
  }, [getArticleDetails, slug]);

  if (isArticleLoading) {
    return (
      <SiteLayout>
        <div className="lg:flex lg:gap-5"></div>
        <div className="lg:w-3/4 xl:w-4/5 lg:border-r-1 lg:pr-5 border-fg-dark-tertiary"></div>
      </SiteLayout>
    );
  }

  if (!slug || !article) {
    return (
      <SiteLayout>
        <div className="lg:flex lg:gap-5"></div>
        <div className="lg:w-3/4 xl:w-4/5 lg:border-r-1 lg:pr-5 border-fg-dark-tertiary"></div>
      </SiteLayout>
    );
  }

  const a = article.article;
  const an = article.analysis;
  const ra = article.relatedArticles;
  const s = article.source;

  const date = new Date(a.publishedTime);

  return (
    <SiteLayout>
      <Meta
        title={`${a.title} - Bias & Credibility Analysis | Unearth`}
        description={`${s.name}: ${an.summary}`}
        canonicalUrl={`https://unearth.news/article/${an.slug}`}
      />

      <div className="lg:flex lg:gap-5">
        <div className="lg:w-3/4 xl:w-4/5 lg:border-r-1 lg:pr-5 border-fg-dark-tertiary">
          <PageSection>
            <div className="flex items-center justify-between pb-10">
              <span>
                {s.name},{" "}
                {`${date.getUTCDay()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://unearth.news/article/${slug}`,
                    )
                  }
                  role="button"
                  title="Copy article link"
                  className="cursor-pointer"
                >
                  <LinkIcon className="size-6 fill-fg-dark" />
                </button>

                <a
                  href={`https://www.reddit.com/submit?title=${a.title}&url=https://unearth.news/article/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RedditLogoIcon className="size-6 fill-fg-dark" />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=https://unearth.news/article/${slug}&text=${a.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <XLogoIcon className="size-6 fill-fg-dark" />
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=https://unearth.news/article/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedinLogoIcon className="size-6 fill-fg-dark" />
                </a>

                <a
                  href={`mailto:?subject=${a.title}&body=Check this out https://unearth.news/article/${slug}`}
                  rel="noopener noreferrer"
                >
                  <EnvelopeIcon className="size-6 fill-fg-dark" />
                </a>
              </div>
            </div>

            <h1 className="font-instrument text-5xl tracking-[.0125em]">
              {a.title}
            </h1>

            <div className="flex flex-col pt-8 gap-2">
              <h4 className="font-medium text-lg">Summary by Unearth</h4>
              <p>{an.summary}</p>
            </div>
          </PageSection>

          <PageSection className="flex flex-col gap-10 mt-25 2xl:mt-30">
            <div>
              <h2 className="font-instrument text-4xl tracking-[.0125em]">
                Unearth Report
              </h2>

              <div className="flex flex-col pt-8 gap-2">
                <h4 className="font-medium text-lg">Overall Narrative</h4>
                <p>{an.framing.narrative}</p>
              </div>
            </div>

            <div className="flex flex-col gap-10" id="fact-check">
              <h3 className="font-instrument text-3xl tracking-[.0125em]">
                Fact Check
              </h3>

              {an.framing.claims.map((c, index) => (
                <DetailCard c={c} key={index} />
              ))}
            </div>

            <div className="flex flex-col gap-10" id="term-analysis">
              <h3 className="font-instrument text-3xl tracking-[.0125em]">
                Term Analysis
              </h3>

              <TermTable ts={an.framing.terms} />
            </div>

            <h2 className="font-instrument text-4xl tracking-[.0125em] 2xl:mt-30">
              Media Report
            </h2>

            <div className="flex flex-col gap-10" id="transcript">
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
                <p className="whitespace-pre-line text-gray-800">
                  {a.textContent}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-10" id="related-articles">
              <h3 className="font-instrument text-3xl tracking-[.0125em]">
                Related Articles
              </h3>

              <div className="flex flex-col gap-4">
                {ra.map((a) => {
                  const pub = new Date(`${a.publishedAt}`);
                  return (
                    <Card key={a.title} className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={a.urlToImage}
                          alt={a.content}
                          className="w-60"
                        />
                        <Card.Heading>{a.title}</Card.Heading>
                      </div>

                      <Card.Body>
                        <p>{a.description}</p>
                      </Card.Body>
                      <Card.Footer className="flex items-center pt-8">
                        <a
                          href={a.url}
                          className="mr-auto underline underline-offset-4 decoration-dotted"
                        >
                          {a.author}, {a.source.name}
                        </a>
                        <span>
                          {pub.getUTCMonth()}/{pub.getUTCDay()}/
                          {pub.getUTCFullYear()}
                        </span>
                      </Card.Footer>
                    </Card>
                  );
                })}

                {ra.length === 0 && (
                  <p>No related articles found at the moment!</p>
                )}
              </div>
            </div>
          </PageSection>
        </div>

        <nav
          aria-label="Article Navigation Menu"
          className="hidden lg:block 2xl:w-1/4 p-5 rounded-2xl border-1 border-fg-dark-tertiary self-start"
        >
          <h2 className="font-medium text-lg">Coverage Details</h2>
          <ul className="pt-2 flex flex-col gap-2 list-disc pl-8">
            <li>
              Sentiment: {an.sentiment[0].toUpperCase()}
              {an.sentiment.slice(1)}
            </li>
            <li>Source Credibility: {s.credibility}</li>
            <li>
              Source Bias: {s.bias[0].toUpperCase()}
              {s.bias.slice(1)}
            </li>
            <li>Factual Reporting: {s.factualReporting}</li>
            <li>Claims: {an.framing.claims.length}</li>
            <li>Key Terms: {an.framing.terms.length}</li>
            <li>Confidence: {an.confidence * 100}%</li>
          </ul>

          <hr className="border-fg-dark-tertiary my-4" />

          <h2 className="font-medium text-lg">Page Content</h2>
          <ul className="pt-2 flex flex-col gap-2">
            <li>
              <h3>Unearth Report</h3>
              <ul className="pt-2 flex flex-col gap-2 list-disc pl-8">
                <li>
                  <a
                    href="#fact-check"
                    className="underline underline-offset-4 decoration-dotted"
                  >
                    Fact Check
                  </a>
                </li>
                <li>
                  <a
                    href="#term-analysis"
                    className="underline underline-offset-4 decoration-dotted"
                  >
                    Term Analysis
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <h3>Media Coverage</h3>
              <ul className="pt-2 flex flex-col gap-2 list-disc pl-8">
                <li>
                  <a
                    href="#transcript"
                    className="underline underline-offset-4 decoration-dotted"
                  >
                    Transcript
                  </a>
                </li>
                <li>
                  <a
                    href="#related-articles"
                    className="underline underline-offset-4 decoration-dotted"
                  >
                    Related Articles
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </SiteLayout>
  );
};

export default ArticlePage;
