import PageSection from "../components/layouts/page-section";
import SiteLayout from "../components/layouts/site-layout";
import GREETING from "../assets/images/misc/greeting.svg";

const GreetingPage = () => {
  return (
    <SiteLayout>
      <PageSection className="flex flex-col gap-10">
        <h1 className="font-instrument text-5xl tracking-[.0125em] text-center">
          Almost there!
        </h1>
        <img
          src={GREETING}
          alt="A computer screen being painted. Bolts and tools fixing it."
          className="mx-auto"
        />
        <p className="pt-2 2xl:w-1/2 mx-auto text-center">
          Unearth is actively being developed. But while we refine things on the
          platform, we'd like to provide a free and open experience for you all.
          No need to sign up, no restrictions.
        </p>
      </PageSection>
    </SiteLayout>
  );
};

export default GreetingPage;
