import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import AnalyzeArticleForm from "../components/forms/analyze-form";
import Link from "../components/ui/link";
import Card from "../components/ui/card";
import Marquee from "../components/ui/marquee";
import { sources } from "../utils/sources";
import { mediaSources } from "../utils/media-sources";
import { phases } from "../utils/phases";

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
          <h4 className="font-medium text-lg">Get Started</h4>
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
              <Card.Body as="p">{s.body}</Card.Body>
              <Card.Footer>
                <Link href={`/methodology#${s.id}`} variant="outline">
                  {s.linkLabel}
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection className="flex flex-col mt-25 gap-8">
        <h4 className="font-medium text-lg text-center">
          Unearth the bias behind the headlines
        </h4>

        <Marquee items={mediaSources} />
      </PageSection>

      <PageSection className="mt-25">
        <h2 className="font-instrument text-4xl tracking-[.0125em]">
          Precision in Practice — How Unearth Works
        </h2>
        <p className="pt-2 lg:w-2/3">
          Unearth turns information into clarity. By combining expert
          frameworks, language analysis, and trusted data, it helps users
          uncover truth in a sea of noise, one claim at a time.
        </p>

        <div className="flex flex-col gap-8 pt-8">
          {phases.map((p) => (
            <Card key={p.id}>
              {/* placeholder for thumbnail */}
              <div className="h-45 rounded-2xl bg-bg-light" />
              <Card.Heading>{p.heading}</Card.Heading>
              <Card.Body as="div" className="pb-8">
                <p className="text-fg-light pb-8">{p.body}</p>
                <ul>
                  {p.steps.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li key={s.text} className="flex gap-2 items-center">
                        <div className="size-8 p-1  bg-bg-light">
                          <Icon className="size-6 fill-fg-dark" />
                        </div>
                        <span>{s.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card.Body>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection className="mt-25">
        <AnalyzeArticleForm />

        <div className="flex flex-col gpa-2 pt-8">
          <h4 className="font-medium text-lg">See Unearth in action</h4>
          <Link href="/login" variant="brand">
            Join Free
          </Link>
        </div>
      </PageSection>
    </SiteLayout>
  );
};

export default LandingPage;
