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
        {/* Google tag (gtag.js) */}
        <Script
          id="gtag-loader"
          src="https://www.googletagmanager.com/gtag/js?id=G-Y84YC0NQTR"
          strategy="afterInteractive"
          integrity="sha384-yJkU5G6Bvwy14KtEHtjKQSO5cA2XqMvPnNd45qzw1JrSc2MmXxDDYRq3vz0UFKjs"
          crossOrigin="anonymous"
          nonce={nonce}
        />
        <Script id="gtag-init" strategy="afterInteractive" nonce={nonce}>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y84YC0NQTR');
          `}
        </Script>
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
