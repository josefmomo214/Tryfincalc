import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Calendar, Clock, Tag, ChevronRight } from "lucide-react";
import { BlogThumbnail } from "./BlogThumbnail";
import Link from "next/link";

interface BlogSection {
  title?: string;
  content: React.ReactNode;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogTemplateProps {
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  intro: React.ReactNode;
  sections: BlogSection[];
  faqs: FAQItem[];
  ctaText: string;
  ctaHref: string;
  slug: string; // Added slug
  relatedPSEO?: { title: string; href: string }[];
}

export function BlogTemplate({
  title,
  description,
  category,
  date,
  readTime,
  intro,
  sections,
  faqs,
  ctaText,
  ctaHref,
  slug, // Added slug
  relatedPSEO = []
}: BlogTemplateProps) {
  return (
    <MainLayout>
      <SEOHandler 
        title={title} 
        description={description} 
        canonicalUrl={`https://tryfincalc.com/blog/${slug}`}
      />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Breadcrumb 
          items={[
            { label: "Blog", href: "/blog" },
            { label: title, href: "#" }
          ]} 
          className="mb-8"
        />
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-6 uppercase tracking-wider">
            <Tag className="w-4 h-4" />
            {category}
          </div>
        
          {/* Featured Thumbnail */}
          <div className="mb-12 rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-sm">
            <BlogThumbnail category={category} isFeatured={true} className="min-h-[300px] md:min-h-[400px]" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-extrabold text-primary leading-tight mb-8">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-on-surface-variant text-sm border-b border-outline-variant/20 pb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readTime}
            </div>
          </div>
        </header>

        {/* Intro Section */}
        <div className="prose prose-lg prose-teal max-w-none text-on-surface-variant mb-12">
          {intro}
        </div>

        {/* AdSense Placement 1: After Intro */}
        <div className="mt-16 mb-12">
          <h2 className="text-xl font-bold text-primary mb-4">Recommended options</h2>
          <AdPlaceholder label="Strategic Insight" />
        </div>

        {/* Main Content Sections */}
        {sections.map((section, index) => (
          <div key={index} className="mb-12">
            {section.title && (
              <h2 className="text-3xl font-manrope font-bold text-primary mb-6">
                {section.title}
              </h2>
            )}
            <div className="prose prose-lg prose-teal max-w-none text-on-surface-variant">
              {section.content}
            </div>
            {/* AdSense Placement 2: Mid-Article */}
            {index === Math.floor(sections.length / 2) - 1 && (
              <div className="mt-16 mb-12">
                <h2 className="text-xl font-bold text-primary mb-4">Explore your options</h2>
                <AdPlaceholder label="Market Comparison" />
              </div>
            )}
          </div>
        ))}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="bg-surface-container-low rounded-3xl p-8 md:p-12 my-16 border border-outline-variant/10">
            <h2 className="text-3xl font-manrope font-bold text-primary mb-8">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xl font-bold text-on-surface">{faq.question}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AdSense Placement 3: Before Conclusion */}
        <div className="mt-16 mb-12">
          <h2 className="text-xl font-bold text-primary mb-4">Next steps based on this guide</h2>
          <AdPlaceholder label="Plan Your Next Step" />
        </div>

        {/* Related Calculations discovery */}
        {relatedPSEO.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
              <ChevronRight className="w-5 h-5" /> Related Calculations
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
               {relatedPSEO.map((link, idx) => (
                 <Link 
                   key={idx} 
                   href={link.href}
                   className="group p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-primary transition-all flex justify-between items-center"
                 >
                   <span className="font-semibold text-primary">{link.title}</span>
                   <ChevronRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                 </Link>
               ))}
            </div>
          </section>
        )}

        {/* Conclusion & CTA */}
        <footer className="bg-primary text-white rounded-3xl p-8 md:p-12 text-center mt-12">
          <h2 className="text-3xl font-manrope font-bold mb-4 italic">Ready to see the numbers?</h2>
          <p className="text-primary-fixed-dim text-lg mb-8 max-w-2xl mx-auto">
            Don't leave your financial future to guesswork. Use our accurate calculators to find the best path forward.
          </p>
          <Link 
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-primary-fixed text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-all transform hover:scale-105"
          >
            {ctaText} <ChevronRight className="w-5 h-5" />
          </Link>
        </footer>
      </article>
    </MainLayout>
  );
}
