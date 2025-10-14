import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";

const LandingPage = () => {
  return (
    <SiteLayout>
      <PageSection>
        <h1 className="font-instrument text-5xl tracking-[.0125em]">
          Everyone is Biased &mdash; and That&apos;s Okay
        </h1>
      </PageSection>
    </SiteLayout>
  );
};

export default LandingPage;
