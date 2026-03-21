import { GetStaticPaths, GetStaticProps } from "next";
import { pseoData, PSEOParams } from "@/lib/pseo-data";
import { PSEOPageTemplate } from "@/components/pseo/PSEOPageTemplate";

export default function PSEOPage({ params }: { params: PSEOParams }) {
  return <PSEOPageTemplate params={params} />;
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: any[] = [];
  
  pseoData.forEach((item) => {
    locales?.forEach((locale) => {
      paths.push({
        params: { slug: item.slug },
        locale,
      });
    });
  });

  return {
    paths,
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

  return {
    props: {
      params: pSEOParams,
    },
  };
};
