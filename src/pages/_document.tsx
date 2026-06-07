import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet" />
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y84YC0NQTR" integrity="sha384-yJkU5G6Bvwy14KtEHtjKQSO5cA2XqMvPnNd45qzw1JrSc2MmXxDDYRq3vz0UFKjs" crossOrigin="anonymous"></script>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y84YC0NQTR');
            `,
          }}
        />
        <script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/29532702d975c18a1902941805a6ae6d/script.js"
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
