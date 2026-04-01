import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document";

interface MyDocumentProps extends DocumentInitialProps {
  nonce?: string;
}

export default function MyDocument(props: MyDocumentProps) {
  const { nonce } = props;
  
  return (
    <Html lang="en">
      <Head nonce={nonce}>
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
