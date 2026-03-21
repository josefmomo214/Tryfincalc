import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { PSEOParams, getPSEOContent } from "@/lib/pseo-data";
import { calculateAmortizedPayment, formatCurrency } from "@/lib/finance";
import { ArrowRight, ChevronRight, Calculator, Info, Lightbulb, PieChart, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import { useRouter } from "next/router";

interface PSEOPageTemplateProps {
  params: PSEOParams;
}

export function PSEOPageTemplate({ params }: PSEOPageTemplateProps) {
  const router = useRouter();
  const locale = router.locale || 'eur';
  const currency = (locale.toUpperCase() as 'USD' | 'EUR');
  
  const content = getPSEOContent(params, currency);
  
  // Base Calculation
  let monthlyPayment = 0;
  let totalInterest = 0;
  let totalCost = 0;

  if (params.type !== 'affordability') {
    monthlyPayment = calculateAmortizedPayment(params.amount, params.rate, params.term);
    totalCost = monthlyPayment * (params.term * 12);
    totalInterest = totalCost - params.amount;
  } else {
    // Affordability Calculation (approximate)
    const monthlyGross = (params.salary || 0) / 12;
    monthlyPayment = monthlyGross * 0.28; // Standard 28% housing rule
    const monthlyRate = (params.rate / 100) / 12;
    const n = params.term * 12;
    const estimatedLoan = monthlyPayment * (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n));
    totalCost = estimatedLoan;
  }

  // Comparison Scenarios (Dynamic table Data)
  const scenarios = params.type !== 'affordability' ? [
    { label: "Rate Drop", rate: params.rate - 1, impact: 'Saves money' },
    { label: "Slight Dip", rate: params.rate - 0.5, impact: 'Lower monthly' },
    { label: "Base Case", rate: params.rate, impact: 'Your quote' },
    { label: "Slight Rise", rate: params.rate + 0.5, impact: 'Higher cost' },
    { label: "Rate Hike", rate: params.rate + 1, impact: 'Significant increase' },
  ].map(s => ({
    ...s,
    payment: calculateAmortizedPayment(params.amount, s.rate, params.term),
  })) : [];

  return (
    <MainLayout>
      <SEOHandler title={content.title} description={content.description} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Navigation / Breadcrumb */}
        <header className="mb-16">
          <Link href="/" className="text-primary font-semibold hover:underline flex items-center gap-1 mb-8 text-sm uppercase tracking-wider">
             <ChevronRight className="w-4 h-4 rotate-180" /> Back to Tools
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-manrope font-extrabold text-primary leading-[1.1] mb-8 tracking-tight">
              {content.h1}
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant leading-relaxed font-medium opacity-90">
              {content.intro}
            </p>
          </div>
        </header>

        {/* Highlight Section: Direct Answer */}
        <section className="bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10 mb-20 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="space-y-4">
                 <span className="text-xs font-bold text-primary uppercase tracking-widest">Calculated Result</span>
                 <h2 className="text-5xl md:text-6xl font-manrope font-black text-primary" suppressHydrationWarning>
                   {formatCurrency(monthlyPayment, 0, currency)}
                 </h2>
                 <p className="text-xl text-on-surface-variant max-w-md">
                   {params.type === 'affordability' 
                     ? `Maximum recommended monthly housing budget for an income of ${formatCurrency(params.salary || 0, 0, currency)}.`
                     : `${params.type.charAt(0).toUpperCase() + params.type.slice(1)} principal and interest monthly repayment.`}
                 </p>
              </div>
              <div className="w-full md:w-auto flex flex-col gap-4">
                 <Link href={`/${params.type}-calculator`} className="w-full">
                    <Button size="xl" className="w-full shadow-lg">Adjust Parameters <ArrowRight className="ml-2 w-5 h-5" /></Button>
                 </Link>
                 <p className="text-center text-sm text-on-surface-variant/60 italic">Updated as of {new Date().toLocaleDateString()}</p>
              </div>
           </div>
        </section>

        {/* AdSense Placement 1 */}
        {/* <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
        <AdPlaceholder className="mb-20" format="horizontal" />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Detailed Explanation */}
          <div className="space-y-12">
            <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 border border-outline-variant/10">
              <h3 className="text-3xl font-manrope font-bold text-primary mb-6 flex items-center gap-3">
                <Info className="w-8 h-8 text-secondary" /> How it breaks down
              </h3>
              <div className="prose prose-lg prose-teal max-w-none text-on-surface-variant leading-relaxed">
                <p>
                  To find the monthly payment for a <strong>{formatCurrency(params.amount || totalCost, 0, currency)}</strong> commitment, we apply a mathematical formula known as amortization.
                </p>
                <p>
                  For a <strong>{params.term}-year fixed-rate</strong> product at {params.rate}%, your payment is biased towards interest early in the life of the loan. As time passes, more of your {formatCurrency(monthlyPayment, 0, currency)} monthly payment goes toward the principal.
                </p>
                {params.type === 'mortgage' && (
                  <div className="mt-8 p-6 bg-secondary/5 rounded-2xl border border-secondary/10 flex items-start gap-4">
                    <TrendingDown className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <p className="text-sm italic m-0">
                      Pro Tip: Did you know that increasing your payment by just 10% each month could shave years off your mortgage and save you thousands in total interest?
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Expert Tips Section */}
            <section>
              <h3 className="text-3xl font-manrope font-bold text-primary mb-8 flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-secondary" /> Key Considerations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {content.tips.map((tip, idx) => (
                  <div key={idx} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex gap-4 items-start">
                     <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {idx + 1}
                     </span>
                     <p className="text-sm font-medium leading-normal text-on-surface-variant m-0">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Comparison Table / Scenarios */}
          {scenarios.length > 0 && (
            <div className="space-y-12">
              <section className="bg-surface-container-high rounded-[2rem] p-8 md:p-12 border border-outline-variant/10 shadow-sm">
                <h3 className="text-3xl font-manrope font-bold text-primary mb-8 flex items-center gap-3">
                  <PieChart className="w-8 h-8 text-secondary" /> Rate Sensitivity Analysis
                </h3>
                <p className="text-on-surface-variant mb-10 text-lg">
                  Interest rates can fluctuate. Below is how your monthly payment on a <strong>{formatCurrency(params.amount, 0, currency)}</strong> loan would change based on minor market shifts:
                </p>
                <div className="overflow-hidden rounded-2xl border border-outline-variant/30">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-highest">
                      <tr>
                        <th className="px-6 py-4 text-sm font-bold text-primary uppercase tracking-wider">Interest Rate</th>
                        <th className="px-6 py-4 text-sm font-bold text-primary uppercase tracking-wider text-right">Monthly Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {scenarios.map((s, idx) => (
                        <tr key={idx} className={s.rate === params.rate ? "bg-primary/5" : ""}>
                          <td className="px-6 py-5 flex items-center gap-3">
                             <span className="font-bold text-primary">{s.rate}%</span>
                             {s.rate === params.rate && <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded uppercase">Current</span>}
                          </td>
                          <td className="px-6 py-5 text-right font-black text-primary" suppressHydrationWarning>
                            {formatCurrency(s.payment, 0, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* AdSense Placement 2 */}
              <AdPlaceholder label="Today's Lowest Rates" />
            </div>
          )}
        </div>

        {/* Dynamic FAQ */}
        <section className="mt-32 pt-20 border-t border-outline-variant/10">
          <h2 className="text-4xl md:text-5xl font-manrope font-extrabold text-primary mb-16 text-center tabular-nums">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-16">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className="relative pl-12">
                 <div className="absolute left-0 top-0 text-7xl font-black text-primary/5 leading-none -mt-4">?</div>
                 <h3 className="text-2xl font-bold text-primary mb-4 relative z-10">{faq.question}</h3>
                 <p className="text-lg text-on-surface-variant leading-relaxed opacity-90">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AdSense Placement 3 */}
        {/* <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
        <AdPlaceholder className="my-20" />

        {/* Improved CTA Section */}
        <section className="mt-32 bg-primary text-white rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/30 opacity-50 transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-manrope font-black mb-8">Ready to lock in your rate?</h2>
            <p className="text-xl md:text-2xl text-primary-fixed-dim/80 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of smart borrowers who used our calculators to plan their future with 100% mathematical certainty.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href={`/${params.type}-calculator`}>
                 <Button size="xl" className="bg-white text-primary hover:bg-primary-fixed-dim rounded-2xl px-12 h-16 text-xl shadow-2xl">
                    Free Calculation <ArrowRight className="ml-2" />
                 </Button>
               </Link>
               <Link href="/blog">
                 <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 rounded-2xl px-12 h-16 text-xl">
                    Read More Guides
                 </Button>
               </Link>
            </div>
          </div>
        </section>

        {/* Discovery & Internal Linking Section */}
        <footer className="mt-32 pt-20 border-t border-outline-variant/10">
           <div className="grid md:grid-cols-2 gap-16 mb-20">
              {/* Similar Pages */}
              <div>
                 <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5" /> Explore other loan amounts
                 </h3>
                 <div className="space-y-4">
                    {content.similarPages.map((page: any, idx: number) => (
                      <Link 
                        key={idx} 
                        href={page.href}
                        className="group flex justify-between items-center p-5 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-primary transition-all"
                      >
                        <span className="font-semibold text-primary">{page.title}</span>
                        <ChevronRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                 </div>
              </div>

              {/* Related Blog Article */}
              <div>
                 <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <Info className="w-5 h-5" /> Expert Guidance
                 </h3>
                 <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                    <p className="text-sm text-on-surface-variant mb-4 font-medium italic">
                       Want to dive deeper into the math and strategy behind your {params.type}?
                    </p>
                    <Link 
                      href={content.relatedBlog.href}
                      className="inline-flex items-center gap-2 text-primary font-bold hover:underline py-2"
                    >
                      Read our guide: {content.relatedBlog.title} <ArrowRight className="w-4 h-4" />
                    </Link>
                 </div>
              </div>
           </div>

           <div className="text-center">
              <h4 className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-8">Full Interactive Calculators</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {['mortgage', 'loan', 'affordability', 'refinancing', 'rent-vs-buy'].map((type) => (
                  <Link 
                    key={type} 
                    href={`/${type}-calculator`}
                    className="px-6 py-3 rounded-full bg-surface-container-high hover:bg-primary-fixed transition-colors text-primary font-semibold text-xs border border-outline-variant/30"
                  >
                    {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Link>
                ))}
              </div>
           </div>
        </footer>
      </div>
    </MainLayout>
  );
}
