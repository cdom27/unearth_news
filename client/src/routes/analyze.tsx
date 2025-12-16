import AnalyzeArticleForm from "../components/forms/analyze-form";
import PageSection from "../components/layouts/page-section";
import SiteLayout from "../components/layouts/site-layout";

const AnalyzePage = () => {
  return (
    <SiteLayout>
      <PageSection className="flex flex-col gap-10">
        <h1 className="font-instrument text-5xl tracking-[.0125em] text-center">
          See the Whole Picture
        </h1>

        <div className="pt-8 flex flex-col gap-4 xl:w-2/3 xl:mx-auto">
          <p>
            The Unearth rating system adds context alongside transparency to
            every news story. Readers, regardless of background, can easily
            identify media bias, check source credibility, and view ownership
            data for news outlets around the world and in theird communities.
          </p>
          <AnalyzeArticleForm />
        </div>
      </PageSection>
    </SiteLayout>
  );
};

export default AnalyzePage;
