import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import AnalyzeArticleForm from "../components/forms/analyze-form";
import Link from "../components/ui/link";
import Card from "../components/ui/card";
import Marquee from "../components/ui/marquee";
import { sources } from "../utils/sources";
import { mediaSources } from "../utils/media-sources";
import { phases } from "../utils/phases";
import HERO from "../assets/images/hero.svg";
import Meta from "../components/layouts/meta";

const LandingPage = () => {
  return (
    <SiteLayout>
      <Meta
        title="Unearth - News Analysis & Bias Detection Platform"
        description="Analyze news articles for misinformation, bias, and credibility. Unearth uses AI and third-party media ratings to help you find trustworthy news sources."
        canonicalUrl="https://unearth.news/"
      />
      <PageSection>
        <div className="lg:flex lg:items-center lg:gap-20 2xl:gap-0">
          <div>
            <h1 className="font-instrument text-5xl tracking-[.0125em]">
              Clarity In Every Narrative
            </h1>
            <p className="pt-2 2xl:w-1/2">
              Explore how stories are built. Unearth examines language, claims,
              and sourcing to give you a deeper understanding of the information
              you read.
            </p>

            <img
              src={HERO}
              alt="Boy using a magnifying glass on a globe"
              className="mt-8 sm:mx-auto lg:hidden"
              fetchPriority="high"
            />

            <div className="flex flex-col pt-8 gap-2 sm:pb-4 lg:pb-0">
              <h2 className="font-medium text-lg">Get Started</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/login"
                  variant="brand"
                  className="sm:w-full lg:w-fit"
                >
                  Join Unearth Free
                </Link>
                <Link
                  href="/methodology"
                  variant="outline"
                  className="sm:w-full lg:w-fit"
                >
                  Read Our Methodology
                </Link>
              </div>
            </div>

            <AnalyzeArticleForm className="pt-8" />
          </div>
          <img
            src={HERO}
            alt="Boy using a magnifying glass on a globe"
            className="hidden w-1/3 lg:flex"
          />
        </div>
      </PageSection>

      <PageSection className="mt-25 2xl:mt-60">
        <h2 className="font-instrument text-4xl tracking-[.0125em]">
          Restoring Trust in Journalism
        </h2>
        <p className="pt-2 lg:w-2/3 2xl:w-2/5">
          We are committed to fighting misinformation by providing transparent,
          fact-based news analysis. Our mission is to rebuild public confidence
          in media by showing people the truth behind every story, verified by
          non and multi-partisan sources.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pt-8">
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

      <PageSection className="flex flex-col mt-25 2xl:mt-60 gap-8">
        <h2 className="font-medium text-lg text-center">
          Unearth the bias behind the headlines
        </h2>

        <Marquee items={mediaSources} />
      </PageSection>

      <PageSection className="mt-25 2xl:mt-60">
        <h2 className="font-instrument text-4xl tracking-[.0125em]">
          Precision in Practice — How Unearth Works
        </h2>
        <p className="pt-2 lg:w-2/3 2xl:w-2/5">
          Unearth turns information into clarity. By combining expert
          frameworks, language analysis, and trusted data, it helps users
          uncover truth in a sea of noise, one claim at a time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pt-8">
          {phases.map((p) => (
            <Card key={p.id}>
              <Card.Thumbnail src={p.thumbnailSrc} alt={p.thumbnailAlt} />
              <Card.Heading>{p.heading}</Card.Heading>
              <Card.Body as="div" className="flex flex-col h-full">
                <p className="text-fg-light">{p.body}</p>
                <ul className="flex flex-col gap-1 pt-10 mt-auto">
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

      <PageSection className="mt-25 2xl:mt-60 flex flex-col gap-2 sm:mx-auto">
        <h2 className="font-medium text-lg text-center">
          What will you research today?
        </h2>

        <Link
          href="/login"
          variant="brand"
          className="sm:self-start sm:mx-auto"
        >
          Join Unearth Free
        </Link>
      </PageSection>
    </SiteLayout>
  );
};

export default LandingPage;
