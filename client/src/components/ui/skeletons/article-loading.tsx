import SiteLayout from "../../layouts/site-layout";
import PageSection from "../../layouts/page-section";

const ArticlePageSkeleton = () => {
  return (
    <SiteLayout>
      <div className="lg:flex lg:gap-5">
        <div className="lg:w-3/4 xl:w-4/5 lg:border-r-1 lg:pr-5 border-fg-dark-tertiary">
          <PageSection>
            <div className="flex items-center justify-between pb-10">
              <div className="h-6 w-32 bg-fg-dark-tertiary rounded animate-pulse" />
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-6 bg-fg-dark-tertiary rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="h-16 w-3/4 bg-fg-dark-tertiary rounded animate-pulse mb-8" />

            <div className="flex flex-col pt-8 gap-2">
              <div className="h-6 w-40 bg-fg-dark-tertiary rounded animate-pulse mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-fg-dark-tertiary rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-fg-dark-tertiary rounded animate-pulse" />
              </div>
            </div>
          </PageSection>

          <PageSection className="flex flex-col gap-10 mt-25 2xl:mt-30">
            <div>
              <div className="h-10 w-40 bg-fg-dark-tertiary rounded animate-pulse mb-8" />
              <div className="flex flex-col pt-8 gap-2">
                <div className="h-6 w-40 bg-fg-dark-tertiary rounded animate-pulse mb-2" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-fg-dark-tertiary rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-fg-dark-tertiary rounded animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-10" id="fact-check">
              <div className="h-8 w-32 bg-fg-dark-tertiary rounded animate-pulse" />
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="border-1 border-fg-dark-tertiary p-6 rounded-lg"
                >
                  <div className="h-6 w-3/4 bg-fg-dark-tertiary rounded animate-pulse mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-fg-dark-tertiary rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-fg-dark-tertiary rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-10" id="term-analysis">
              <div className="h-8 w-32 bg-fg-dark-tertiary rounded animate-pulse" />
              <div className="border-1 border-fg-dark-tertiary rounded-lg overflow-hidden">
                <div className="h-64 bg-fg-dark-tertiary rounded animate-pulse" />
              </div>
            </div>

            <div className="h-10 w-48 bg-fg-dark-tertiary rounded animate-pulse 2xl:mt-30" />

            <div className="flex flex-col gap-10" id="transcript">
              <div className="flex flex-col gap-2">
                <div className="h-8 w-32 bg-fg-dark-tertiary rounded animate-pulse mb-4" />
                <div className="h-5 w-64 bg-fg-dark-tertiary rounded animate-pulse" />
              </div>
              <div className="max-h-96 border-t-1 border-b-1 border-fg-dark-tertiary p-2 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-fg-dark-tertiary rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-10" id="related-articles">
              <div className="h-8 w-32 bg-fg-dark-tertiary rounded animate-pulse" />
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="border-1 border-fg-dark-tertiary p-6 rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-60 h-40 bg-fg-dark-tertiary rounded animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-fg-dark-tertiary rounded animate-pulse" />
                        <div className="h-6 w-5/6 bg-fg-dark-tertiary rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 w-full bg-fg-dark-tertiary rounded animate-pulse" />
                      <div className="h-4 w-5/6 bg-fg-dark-tertiary rounded animate-pulse" />
                    </div>
                    <div className="flex items-center pt-8 gap-4">
                      <div className="flex-1 h-4 bg-fg-dark-tertiary rounded animate-pulse" />
                      <div className="h-4 w-24 bg-fg-dark-tertiary rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PageSection>
        </div>

        <nav
          aria-label="Article Navigation Menu"
          className="hidden lg:block 2xl:w-1/4 p-5 rounded-2xl border-1 border-fg-dark-tertiary self-start"
        >
          <div className="h-6 w-32 bg-fg-dark-tertiary rounded animate-pulse mb-4" />
          <ul className="pt-2 flex flex-col gap-3">
            {[...Array(7)].map((_, i) => (
              <li
                key={i}
                className="h-5 bg-fg-dark-tertiary rounded animate-pulse"
              />
            ))}
          </ul>
          <hr className="border-fg-dark-tertiary my-4" />
          <div className="h-6 w-32 bg-fg-dark-tertiary rounded animate-pulse mb-4" />
          <ul className="pt-2 flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <li
                key={i}
                className="h-5 bg-fg-dark-tertiary rounded animate-pulse"
              />
            ))}
          </ul>
        </nav>
      </div>
    </SiteLayout>
  );
};

export default ArticlePageSkeleton;
