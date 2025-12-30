import SiteLayout from "../components/layouts/site-layout";
import MISSING from "../assets/images/misc/missing.svg";
import Meta from "../components/layouts/meta";
import PageSection from "../components/layouts/page-section";
import Link from "../components/ui/link";

const ErrorPage = () => {
  return (
    <SiteLayout>
      <Meta
        title="Unearth - News Analysis Platform"
        description="Explore Unearth, the AI-powered platform for analyzing news article credibility and detecting misinformation bias."
        canonicalUrl="https://unearth.news"
      />
      <PageSection className="flex flex-col gap-10">
        <h1 className="font-instrument text-5xl tracking-[.0125em] text-center">
          Source not found
        </h1>
        <img
          src={MISSING}
          alt="A guy reaching in an envelope looking for something"
          className="mx-auto"
          fetchPriority="high"
        />
        <p className="pt-2 2xl:w-1/2 mx-auto text-center">
          Like an unverified claim, this URL doesn't check out. Return to the
          homepage to analyze articles and explore media credibility instead.
        </p>

        <div className="flex gap-4 mx-auto">
          <Link href="/" variant="outline">
            Back to Home
          </Link>
          <Link href="/analyze" variant="primary">
            Analyze Articles
          </Link>
        </div>
      </PageSection>
    </SiteLayout>
  );
};

export default ErrorPage;
