import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import AnalyzeArticleForm from "../components/forms/analyze-form";
import Link from "../components/ui/link";

const LandingPage = () => {
  return (
    <SiteLayout>
      <PageSection>
        <h1 className="font-instrument text-5xl tracking-[.0125em]">
          Everyone Is Biased &mdash; and That's Okay
        </h1>
        <p className="pt-2 lg:w-2/3">
          But hidden media bias misleads, manipulates, and divides us. So
          everyone should learn how to spot it with a critical lens.
        </p>

        {/* mobile hero graphic */}
        <div className="size-[280px] rounded-full bg-stone-500 mt-8" />

        <div className="pt-8">
          <h3 className="font-medium text-lg">Get Started</h3>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" variant="brand">
              Join Unearth Free
            </Link>
            <Link href="/methodology" variant="outline">
              Learn More
            </Link>
          </div>
        </div>

        <AnalyzeArticleForm className="pt-8" />
      </PageSection>
    </SiteLayout>
  );
};

export default LandingPage;
