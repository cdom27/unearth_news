interface MetaProps {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl: string;
}

const Meta = ({ title, description, ogImage, canonicalUrl }: MetaProps) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
    </>
  );
};

export default Meta;
