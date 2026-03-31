import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { searchIndex } from "@/lib/searchIndex";
import Fuse from "fuse.js";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Search, ArrowRight, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const fuse = new Fuse(searchIndex, {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'description', weight: 0.3 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
});

const categoryOrder = [
  'Calculators',
  'Mortgage Guides',
  'Home Buying',
  'Loan Guides',
  'Refinancing',
  'European Guides',
  'Guides'
];

const categoryColors: Record<string, string> = {
  'Calculators': '#0D4B3F',
  'Mortgage Guides': '#185FA5',
  'Home Buying': '#3B6D11',
  'Loan Guides': '#854F0B',
  'Refinancing': '#993556',
  'European Guides': '#534AB7',
  'Guides': '#5F5E5A',
};

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (q && typeof q === "string") {
      setQuery(q);
      const searchResults = fuse.search(q);
      setResults(searchResults.map(r => r.item));
    }
  }, [q]);

  // Group results by category
  const groupedResults = categoryOrder.reduce((acc, cat) => {
    const catResults = results.filter(r => r.category === cat);
    if (catResults.length > 0) {
      acc.push({ category: cat, items: catResults });
    }
    return acc;
  }, [] as { category: string, items: any[] }[]);

  // Add any categories not in the predefined order
  results.forEach(r => {
    if (!categoryOrder.includes(r.category) && !groupedResults.find(g => g.category === r.category)) {
      const catResults = results.filter(res => res.category === r.category);
      groupedResults.push({ category: r.category, items: catResults });
    }
  });

  const popularSearches = ["mortgage calculator", "affordability", "rent vs buy", "refinancing"];

  return (
    <MainLayout>
      <SEOHandler 
        title={`Search results for "${query}"`}
        description="Search results for articles and calculators on TryFinCalc."
        noindex={true}
      />

      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Search size={24} />
            </div>
            <div>
              <h1 className="text-display-sm font-manrope font-bold text-primary">
                {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
              </h1>
              <p className="text-on-surface-variant">
                Find exactly what you need to master your financial journey.
              </p>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="space-y-12">
              {groupedResults.map((group) => (
                <div key={group.category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                       <span 
                        className="w-1.5 h-6 rounded-full" 
                        style={{ backgroundColor: categoryColors[group.category] || '#5F5E5A' }}
                      />
                      {group.category}
                    </h2>
                    <span className="text-xs font-bold text-on-surface-variant/40 bg-surface-container px-2 py-0.5 rounded-md">
                      {group.items.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {group.items.map((item) => (
                      <Link key={item.url} href={item.url} className="group">
                        <Card className="hover:border-primary/30 transition-all duration-300 hover:shadow-md active:scale-[0.99]">
                          <CardHeader className="p-5">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                                  {item.title}
                                  <CornerDownRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </CardTitle>
                                <CardDescription className="text-base line-clamp-2 mt-2">
                                  {item.description}
                                </CardDescription>
                              </div>
                              <ArrowRight className="text-primary/20 group-hover:text-primary transition-colors ml-4 shrink-0" size={20} />
                            </div>
                            <div className="mt-4 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/40">
                              {item.url}
                            </div>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant/30">
                <Search size={32} />
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">No matches found for "{query}"</h2>
              <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
                We couldn't find any articles or calculators matching your search. Try another keyword or check one of our popular topics.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
                    className="px-6 py-2.5 rounded-full border border-outline-variant text-sm font-medium hover:border-primary hover:text-primary transition-all active:scale-95"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
