import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import AnalyzeArticleForm from "../components/forms/analyze-form";
import Link from "../components/ui/link";
import Card from "../components/ui/card";
import { sources } from "../utils/sources";

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

      <PageSection className="mt-25">
        <h2 className="font-instrument text-4xl tracking-[.0125em]">
          Restoring Trust in Journalism
        </h2>
        <p className="pt-2 lg:w-2/3">
          We are committed to fighting misinformation by providing transparent,
          fact-based news analysis. Our mission is to rebuild public confidence
          in media by showing people the truth behind every story, verified by
          non and multi-partisan sources.
        </p>

        <div className="flex flex-col gap-8 pt-8">
          {sources.map((s) => (
            <Card key={s.id}>
              <Card.Thumbnail src={s.thumbnailSrc} alt={s.heading} />
              <Card.Heading>{s.heading}</Card.Heading>
              <Card.Body>
                <p>{s.body}</p>
              </Card.Body>
              <Card.Footer>
                <Link href={`/methodology#${s.id}`} variant="outline">
                  {s.linkLabel}
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </PageSection>
    </SiteLayout>
  );
};

export default LandingPage;
