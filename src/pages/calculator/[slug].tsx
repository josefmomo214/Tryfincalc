import { GetStaticPaths, GetStaticProps } from "next";
import { pseoData, PSEOParams } from "@/lib/pseo-data";
import { PSEOPageTemplate } from "@/components/pseo/PSEOPageTemplate";

export default function PSEOPage({ params }: { params: PSEOParams }) {
  return <PSEOPageTemplate params={params} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: pseoData
      .filter((item) => item.currency === 'USD')
      .map((item) => ({ params: { slug: item.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const pSEOParams = pseoData.find((item) => item.slug === slug);

  if (!pSEOParams) {
    return {
      notFound: true,
    };
  }

  if (pSEOParams.currency === 'EUR') {
    return {
      redirect: {
        destination: `/eur/calculator/${pSEOParams.slug}`,
        permanent: true,
      },
    };
  }

  return {
    props: {
      params: pSEOParams,
    },
  };
};
