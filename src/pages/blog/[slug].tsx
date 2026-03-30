import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { articles, Article } from "@/data/articles";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BlogPostProps {
  article: Article;
  recentArticles: Article[];
}

export default function BlogPost({ article, recentArticles }: BlogPostProps) {
  if (!article) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center text-on-surface">
          <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
          <p className="mb-8">The financial guide you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog">
            <Button><ArrowLeft className="mr-2 w-4 h-4" /> Back to Guides</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt,
      "image": "https://tryfincalc.com/og-image.png",
      "author": {
        "@type": "Organization",
        "name": "TryFinCalc Editorial",
        "url": "https://tryfincalc.com/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "TryFinCalc",
        "logo": {
          "@type": "ImageObject",
          "url": "https://tryfincalc.com/logo.png"
        }
      },
      "datePublished": "2026-03-30",
      "dateModified": "2026-03-30",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://tryfincalc.com/blog/${article.slug}`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://tryfincalc.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Financial Guides",
          "item": "https://tryfincalc.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `https://tryfincalc.com/blog/${article.slug}`
        }
      ]
    }
  ];

  // Merge any predefined structuredData from the article object
  if (article.structuredData) {
    if (Array.isArray(article.structuredData)) {
      schemas.push(...article.structuredData);
    } else {
      schemas.push(article.structuredData as any);
    }
  }

  return (
    <MainLayout>
      <SEOHandler 
        title={article.title} 
        description={article.excerpt} 
        canonicalUrl={`https://tryfincalc.com/blog/${article.slug}`}
        structuredData={schemas}
      />
      
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 mb-8 font-medium transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Guides
        </Link>
        
        <article className="prose prose-lg prose-primary dark:prose-invert max-w-none prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline">
          <header className="mb-12 border-b border-outline-variant pb-12">
            <div className="flex items-center space-x-2 text-sm text-on-surface-variant mb-4 font-medium uppercase tracking-wider">
              <span>{article.category}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-manrope font-extrabold text-primary leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              {article.excerpt}
            </p>
          </header>
          
          <div 
            className="mt-12 blog-content leading-relaxed text-on-surface"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </article>

        {/* Try your numbers CTA */}
        <div className="mt-16 bg-surface-container-highest rounded-3xl p-8 sm:p-12 border border-outline-variant/10 shadow-sm">
          <h2 className="text-3xl font-manrope font-bold text-primary mb-6">Try your numbers</h2>
          <p className="text-lg text-on-surface-variant mb-4 max-w-2xl">
            Instead of guessing, run the numbers to see how different scenarios affect your financial future.
          </p>
          <p className="text-sm text-on-surface-variant/70 mb-10 max-w-2xl italic">
            Note: Interest rates can vary depending on market conditions. You can follow general trends through sources like the Federal Reserve.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/mortgage-calculator" className="group bg-surface hover:bg-primary hover:text-white p-6 rounded-2xl border border-outline-variant/20 transition-all duration-300">
              <h3 className="font-bold mb-2 group-hover:text-white">Mortgage Calculator</h3>
              <p className="text-sm text-on-surface-variant group-hover:text-white/80">See how home prices and rates affect your payment.</p>
            </Link>
            
            <Link href="/loan-calculator" className="group bg-surface hover:bg-primary hover:text-white p-6 rounded-2xl border border-outline-variant/20 transition-all duration-300">
              <h3 className="font-bold mb-2 group-hover:text-white">Loan Calculator</h3>
              <p className="text-sm text-on-surface-variant group-hover:text-white/80">Compare different borrowing scenarios easily.</p>
            </Link>
            
            <Link href="/rent-vs-buy" className="group bg-surface hover:bg-primary hover:text-white p-6 rounded-2xl border border-outline-variant/20 transition-all duration-300">
              <h3 className="font-bold mb-2 group-hover:text-white">Rent vs Buy</h3>
              <p className="text-sm text-on-surface-variant group-hover:text-white/80">Decide if renting or buying makes more sense for you.</p>
            </Link>
          </div>
        </div>

        {/* Recent Articles Section */}
        <div className="mt-24 border-t border-outline-variant pt-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-manrope font-bold text-primary mb-2">Continue your journey</h2>
              <p className="text-on-surface-variant">More expert guides to help you master your finances.</p>
            </div>
            <Link href="/blog" className="hidden sm:block text-primary font-medium hover:underline underline-offset-4">
              View all guides
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentArticles.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="group block bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">{item.category}</span>
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:underline underline-offset-2">{item.title}</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{item.excerpt}</p>
                <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold flex items-center">
                  Read more <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
               Still haven&apos;t found what you&apos;re looking for?
             </h2>
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: { params: { slug: string }; locale: string }[] = [];
  
  articles.forEach((article) => {
    locales?.forEach((locale) => {
      paths.push({
        params: { slug: article.slug },
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
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      notFound: true,
    };
  }

  // Get 2 other articles for the "Read more" section
  const recentArticles = articles
    .filter((a) => a.slug !== slug)
    .slice(0, 2);

  return {
    props: {
      article,
      recentArticles,
    },
    revalidate: 3600, 
  };
}
