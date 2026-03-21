import React from "react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { ChevronRight, HelpCircle, Lightbulb, Info, ArrowRight } from "lucide-react";
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface ExampleItem {
  label: string;
  value: string;
}

interface SEOSectionProps {
  title: string;
  intro: React.ReactNode;
  howItWorks: React.ReactNode;
  examples: {
    title: string;
    items: ExampleItem[];
    description: string;
  }[];
  tips: string[];
  faqs: FAQItem[];
  relatedCalculators: { label: string; href: string }[];
  ctaText: string;
  ctaHref: string;
  relatedBlogs?: { title: string; href: string }[];
}

export function CalculatorSEOSection({
  title,
  intro,
  howItWorks,
  examples,
  tips,
  faqs,
  relatedCalculators,
  ctaText,
  ctaHref,
  relatedBlogs = []
}: SEOSectionProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
      {/* Intro Section */}
      <section>
        <h1 className="text-4xl md:text-5xl font-manrope font-extrabold text-primary mb-8 tracking-tight">
          {title}
        </h1>
        <div className="prose prose-lg prose-teal max-w-none text-on-surface-variant leading-relaxed">
          {intro}
        </div>
      </section>

      {/* AdSense Placement 1: After Intro */}
      <AdPlaceholder className="my-12" label="Market Insights" />

      {/* How it Works Section */}
      <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-6 text-primary">
          <Info className="w-6 h-6" />
          <h2 className="text-2xl md:text-3xl font-manrope font-bold m-0">How it works</h2>
        </div>
        <div className="prose prose-lg prose-teal max-w-none text-on-surface-variant">
          {howItWorks}
        </div>
      </section>

      {/* Examples Section */}
      <section>
        <h2 className="text-3xl font-manrope font-bold text-primary mb-10">Practical Examples</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {examples.map((example, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-6">{example.title}</h3>
              <div className="space-y-4 mb-6">
                {example.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-outline-variant/10 pb-2">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="font-bold text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-on-surface-variant text-sm italic">{example.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AdSense Placement 2: After Examples */}
      <AdPlaceholder className="my-12" label="Financial Guide" />

      {/* Tips Section */}
      <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
        <div className="flex items-center gap-3 mb-8 text-primary">
          <Lightbulb className="w-6 h-6" />
          <h2 className="text-2xl md:text-3xl font-manrope font-bold m-0">Expert Financial Tips</h2>
        </div>
        <ul className="grid sm:grid-cols-2 gap-6 list-none p-0 m-0">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex gap-3 text-on-surface-variant">
              <div className="mt-1 flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ChevronRight className="w-3 h-3" />
              </div>
              <span className="text-lg leading-snug">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="flex items-center gap-3 mb-10 text-primary">
          <HelpCircle className="w-6 h-6" />
          <h2 className="text-3xl font-manrope font-bold m-0">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-10">
          {faqs.map((faq, idx) => (
            <div key={idx} className="group">
              <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">{faq.question}</h3>
              <p className="text-on-surface-variant leading-relaxed text-lg">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AdSense Placement 3: After FAQ */}
      <AdPlaceholder className="my-12" label="Featured Offers" />

      {/* Related Calculators & CTA */}
      <section className="bg-surface-container-high rounded-3xl p-8 md:p-16 border border-outline-variant/10 text-center">
        <h2 className="text-3xl font-manrope font-bold text-primary mb-6">{ctaText}</h2>
        <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
          Explore our other financial tools to get a complete picture of your journey.
        </p>
        {/* Related Guides discovery */}
        {relatedBlogs.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center justify-center gap-2">
              <Lightbulb className="w-5 h-5 text-secondary" /> Expert Guides for this Tool
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
               {relatedBlogs.map((blog, idx) => (
                 <Link 
                   key={idx} 
                   href={blog.href}
                   className="px-6 py-3 rounded-xl bg-primary/5 border border-primary/20 text-primary font-bold hover:bg-primary/10 transition-all flex items-center gap-2"
                 >
                   {blog.title} <ArrowRight className="w-4 h-4" />
                 </Link>
               ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {relatedCalculators.map((calc, idx) => (
            <Link 
              key={idx} 
              href={calc.href}
              className="px-6 py-3 rounded-xl bg-white border border-outline-variant/50 text-primary font-semibold hover:border-primary transition-all flex items-center gap-2"
            >
              {calc.label} <ArrowRight className="w-4 h-4" />
            </Link>
          ))}
        </div>
        <Link 
          href={ctaHref}
          className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform"
        >
          Check Official Rates <ChevronRight className="w-6 h-6" />
        </Link>
      </section>
    </div>
  );
}
