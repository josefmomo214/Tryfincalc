import Head from "next/head";
import { absoluteUrl } from "@/lib/route-registry";

interface SEOHandlerProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object | object[];
  noindex?: boolean;
}

export function SEOHandler({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://tryfincalc.com/og-image.png",
  structuredData,
  noindex = false
}: SEOHandlerProps) {
  const siteName = "TryFinCalc";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const absoluteOgImage = absoluteUrl(ogImage);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {noindex && <meta name="robots" content="noindex, follow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {canonicalUrl && <meta name="twitter:url" content={canonicalUrl} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}
