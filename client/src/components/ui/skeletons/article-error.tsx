import PageSection from "../../layouts/page-section";
import SiteLayout from "../../layouts/site-layout";
import Link from "../link";

const ArticleError = () => {
  return (
    <SiteLayout>
      <div className="lg:flex lg:gap-5">
        <div className="lg:w-3/4 xl:w-4/5 lg:border-r-1 lg:pr-5 border-fg-dark-tertiary">
          <PageSection className="flex flex-col items-center justify-center min-h-96 text-center">
            <h1 className="font-instrument text-6xl tracking-[.0125em] mb-4">
              404
            </h1>
            <h2 className="text-2xl font-medium mb-4">Article Not Found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              We couldn't find the article you're looking for. It may have been
              removed or the link might be incorrect.
            </p>
            <div className="flex gap-4">
              <Link href="/" variant="outline">
                Back to Home
              </Link>
              <Link href="/analyze" variant="primary">
                Search Articles
              </Link>
            </div>
          </PageSection>
        </div>
      </div>
    </SiteLayout>
  );
};

export default ArticleError;
