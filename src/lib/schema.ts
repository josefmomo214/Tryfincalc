export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TryFinCalc",
    "url": "https://tryfincalc.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tryfincalc.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateWebApplicationSchema({
  name,
  path,
  description,
  currency = 'USD',
}: {
  name: string;
  path: string;
  description: string;
  currency?: 'USD' | 'EUR';
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `https://tryfincalc.com${path}`,
    description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: currency,
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item,
    })),
  };
}
