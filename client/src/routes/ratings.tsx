import { useEffect, useState } from "react";
import SiteLayout from "../components/layouts/site-layout";
import PageSection from "../components/layouts/page-section";
import useSources from "../hooks/use-sources";

const RatingsPage = () => {
  const { getSourcePreviews, previews, previewsLoading } = useSources();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      getSourcePreviews();
    }
  }, [getSourcePreviews, ready]);

  return (
    <SiteLayout>
      <PageSection>
        <h1 className="font-instrument text-5xl tracking-[.0125em]">
          Media Bias Ratings
        </h1>
        <p className="pt-2 lg:w-2/3">
          See how news sources measure up. Our database brings transparency to
          bias and reliability, helping you understand where information truly
          comes from.
        </p>

        <div className="flex gap-3 py-5 sm:justify-end border-b-1 border-fg-dark-tertiary">
          <button onClick={() => setReady(!ready)} className="cursor-pointer">
            {ready ? "is ready" : "not ready"}
          </button>
        </div>
      </PageSection>

      <PageSection className="pt-10 gap-5 grid grid-cols-1">
        {previewsLoading ? (
          <p>loading source ratings</p>
        ) : (
          <div>
            {previews.map((p) => (
              <h2 key={p.slug}>{p.name}</h2>
            ))}
          </div>
        )}
      </PageSection>
    </SiteLayout>
  );
};

export default RatingsPage;
