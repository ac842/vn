import React from 'react';

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface SEOProps {
  title: string;
  description?: string;
  lang?: string;
  meta?: MetaTag[];
  image?: string; // 新增的屬性
  url?: string; // 新增的屬性
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = '',
  lang = 'en',
  meta = [],
  image,
  url,
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": title,
    "url": url || window.location.href, // 使用當前 URL
  };

  return (
    <>
      <html lang={lang} />
      <title>{title} | My Website</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {meta.map((m, i) => (
        m.name ? (
          <meta key={i} name={m.name} content={m.content} />
        ) : (
          <meta key={i} property={m.property} content={m.content} />
        )
      ))}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </>
  );
};

export default SEO;