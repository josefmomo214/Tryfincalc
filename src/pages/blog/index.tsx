import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogThumbnail } from "@/components/blog/BlogThumbnail";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import SearchBar from "@/components/navigation/SearchBar";
import { articles } from "@/data/articles";

export default function BlogIndex() {
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);
  
  const [visibleCount, setVisibleCount] = useState(6);
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const visibleArticles = remainingArticles.slice(0, visibleCount);
  const hasMore = visibleCount < remainingArticles.length;

  return (
    <MainLayout>
      <SEOHandler 
        title="Mortgage Guides & Financial Market Insights 2026 | TryFinCalc"
        description="Read expert articles on mortgages, personal finance, and loan strategies. Master your budget and see your monthly payment in seconds with our guides."
        canonicalUrl="https://tryfincalc.com/blog"
      />

      {/* Blog Hero */}
      <section className="bg-surface pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-end">
          <div className="md:w-2/3">
            <h1 className="text-display-lg font-manrope font-bold text-primary tracking-tight mb-6">
              Insights for the modern <br className="hidden md:block"/>financial journey.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl">
              Cutting through the noise. Clear, actionable, and mathematically sound advice for your next big financial move.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar isLarge={true} />
            </div>
          </div>
          <div className="md:w-1/3 flex flex-wrap gap-2 text-sm">
            <span className="px-4 py-2 rounded-full border border-primary text-primary font-medium hover:bg-primary-fixed transition-colors cursor-pointer">All</span>
            <span className="px-4 py-2 rounded-full border border-outline-variant/50 text-on-surface-variant hover:border-primary transition-colors cursor-pointer">Mortgages</span>
            <span className="px-4 py-2 rounded-full border border-outline-variant/50 text-on-surface-variant hover:border-primary transition-colors cursor-pointer">Personal Finance</span>
            <span className="px-4 py-2 rounded-full border border-outline-variant/50 text-on-surface-variant hover:border-primary transition-colors cursor-pointer">Home Buying</span>
          </div>
        </div>
      </section>

      <AdPlaceholder format="horizontal" />

      {/* Featured Article */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {featuredArticle && (
            <Link href={`/blog/${featuredArticle.slug}`} className="block group">
              <div className="bg-surface-container-low rounded-3xl overflow-hidden flex flex-col lg:flex-row h-full border border-outline-variant/10 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                <div className="lg:w-1/2 bg-surface-container-highest p-12 flex flex-col justify-center">
                  <span className="text-sm font-semibold tracking-wider text-primary uppercase mb-4 block">Featured Report</span>
                  <h2 className="text-3xl md:text-4xl font-manrope font-bold text-primary mb-4 group-hover:underline underline-offset-4 decoration-primary-fixed">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-lg text-on-surface-variant mb-8 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:text-primary-container transition-colors">
                    Read Full Report <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
                <div className="lg:w-1/2 min-h-[300px] relative overflow-hidden">
                  <BlogThumbnail category={featuredArticle.category} isFeatured={true} className="h-full" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleArticles.map((article, idx) => (
              <Link key={idx} href={`/blog/${article.slug}`} className="group h-full flex flex-col">
                <Card className="h-full flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-2 group-focus-visible:ring-2 ring-primary border border-outline-variant/10 overflow-hidden">
                  <BlogThumbnail category={article.category} className="aspect-[16/9]" />
                  <div>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-semibold tracking-wider text-primary uppercase">{article.category}</span>
                        <span className="text-xs text-on-surface-variant">{article.readTime}</span>
                      </div>
                      <CardTitle className="text-2xl leading-tight group-hover:underline underline-offset-2 decoration-primary-fixed/50">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardContent>
                  </div>
                  <CardFooter>
                    <span className="text-sm font-medium text-primary flex items-center group-hover:text-primary-container">
                      Read Article <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-16 text-center">
              <Button variant="outline" size="lg" onClick={handleLoadMore}>
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      <AdPlaceholder format="horizontal" className="my-12" />
    </MainLayout>
  );
}
