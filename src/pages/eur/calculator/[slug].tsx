import type { GetStaticPaths, GetStaticProps } from 'next';
import { PSEOPageTemplate } from '@/components/pseo/PSEOPageTemplate';
import { pseoData, type PSEOParams } from '@/lib/pseo-data';
import { getGeneratedPseoScenarios } from '@/lib/pseo-publication';

export default function EuroScenarioPage({ params }: { params: PSEOParams }) {
  return <PSEOPageTemplate params={params} />;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getGeneratedPseoScenarios(pseoData)
    .filter((item) => item.currency === 'EUR')
    .map((item) => ({ params: { slug: item.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const scenario = pseoData.find((item) => item.slug === slug);

  if (!scenario) return { notFound: true };

  if (scenario.currency !== 'EUR') {
    return {
      redirect: {
        destination: `/calculator/${scenario.slug}`,
        permanent: true,
      },
    };
  }

  return { props: { params: scenario } };
};
