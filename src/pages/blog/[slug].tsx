import React from "react";
import { useRouter } from "next/router";
import { BlogTemplate } from "@/components/blog/BlogTemplate";
import { articles } from "@/data/articles";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    if (router.isReady) {
      // Fallback if slug not found
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
          <p className="mb-8">The financial guide you're looking for doesn't exist or has been moved.</p>
          <Link href="/blog">
            <Button><ArrowLeft className="mr-2 w-4 h-4" /> Back to Guides</Button>
          </Link>
        </div>
      );
    }
    return null; // Loading state
  }

  // Use full content if available, otherwise fallback to a generic placeholder version
  const content = article.fullContent || {
    intro: article.excerpt,
    sections: [
      { title: "Quick Overview", content: "This guide is currently being expanded with more technical details. Stay tuned for the full breakdown!" }
    ],
    faqs: []
  };

  return (
    <BlogTemplate
      title={article.title}
      description={article.excerpt}
      category={article.category}
      date="March 21, 2026"
      readTime={article.readTime}
      slug={article.slug}
      intro={<p>{content.intro}</p>}
      sections={content.sections.map(s => ({
        title: s.title,
        content: <p className="text-on-surface-variant leading-relaxed">{s.content}</p>
      }))}
      faqs={content.faqs}
      ctaText={article.ctaText || "Try our Calculator"}
      ctaHref={article.ctaHref || "/"}
    />
  );
}
