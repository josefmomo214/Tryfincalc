import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document";
import Script from "next/script";

interface MyDocumentProps extends DocumentInitialProps {
  nonce?: string;
}

export default function MyDocument(props: MyDocumentProps) {
  const { nonce } = props;
  
  return (
    <Html lang="en">
      <Head nonce={nonce}>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TryFinCalc",
              "url": "https://tryfincalc.com",
              "logo": "https://tryfincalc.com/logo.png",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=61588922634968",
                "https://www.linkedin.com/company/try-fin-calc/",
                "https://www.pinterest.com/TryFinCalc/"
              ]
            })
          }}
        />
        {/* Defaults must precede both the CMP and Google scripts. CookieYes owns updates. */}
        <script id="consent-defaults" nonce={nonce} dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied', analytics_storage: 'denied',
            ad_user_data: 'denied', ad_personalization: 'denied',
            functionality_storage: 'denied', personalization_storage: 'denied',
            security_storage: 'granted', wait_for_update: 500
          });
          window.gtag = gtag;
        ` }} />
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/29532702d975c18a1902941805a6ae6d/script.js"
          strategy="beforeInteractive"
          nonce={nonce}
        />
        {/* Google AdSense */}
        <Script
          id="adsbygoogle-loader"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3710437974251848"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
          nonce={nonce}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript nonce={nonce} />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  // Retrieve the nonce injected by middleware.ts
  const nonce = ctx.req?.headers?.['x-nonce'] as string | undefined;
  
  return {
    ...initialProps,
    nonce,
  };
};
