import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
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

        <div className="pt-8">
          <h3 className="font-medium text-lg">Get Started</h3>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" variant="brand">
              Join unearth free
            </Link>
            <Link href="/methodology" variant="outline">
              Learn more
            </Link>
          </div>
        </div>
      </PageSection>

      <PageSection className="mt-100">
        <h2 id="trust">Restoring trust</h2>
      </PageSection>
    </SiteLayout>
  );
};

export default LandingPage;
