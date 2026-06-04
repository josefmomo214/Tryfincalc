import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { Accordion } from "@/components/ui/Accordion";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema";

type FAQItemData = {
  question: string;
  answer: string;
  answerNode: React.ReactNode;
};

type FAQCategory = {
  title: string;
  items: FAQItemData[];
};

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-primary underline underline-offset-2 hover:opacity-75 transition-opacity">
      {children}
    </Link>
  );
}

const mortgageFaqs: FAQItemData[] = [
  {
    question: "How is a monthly mortgage payment calculated?",
    answer:
      "Your monthly payment is calculated using the amortization formula, which spreads principal and interest evenly over the loan term. The formula is M = P[r(1+r)^n]/[(1+r)^n−1], where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of payments. For example, a $300,000 loan at 6% for 30 years produces a monthly payment of $1,799. Use our mortgage calculator to model your own numbers in seconds.",
    answerNode: (
      <>
        Your monthly payment uses the amortization formula: M = P[r(1+r)^n]/[(1+r)^n−1], where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of payments. This spreads principal and interest evenly across every payment. For example, a $300,000 loan at 6% for 30 years gives a monthly payment of $1,799.{" "}
        <A href="/mortgage-calculator">Use our mortgage calculator</A> to model your own numbers instantly.
      </>
    ),
  },
  {
    question: "What does PITI mean?",
    answer:
      "PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a full monthly mortgage payment. Principal reduces your loan balance. Interest is the cost of borrowing. Property taxes are collected monthly and held in escrow. Homeowner's insurance protects the property. PITI is typically 15–30% higher than the P&I payment alone because taxes and insurance can add hundreds of dollars per month. Always budget for PITI — not just P&I — when evaluating a home purchase.",
    answerNode: (
      <>
        PITI stands for Principal, Interest, Taxes, and Insurance — all four components of a real monthly payment. Principal reduces your balance. Interest is the borrowing cost. Taxes and insurance are collected monthly into escrow. PITI is typically 15–30% higher than P&I alone, often adding several hundred dollars per month.{" "}
        <A href="/mortgage-calculator">Our mortgage calculator</A> includes all four components so you see the true monthly cost.
      </>
    ),
  },
  {
    question: "What is the 28% rule for mortgages?",
    answer:
      "The 28% rule states that your total housing payment (PITI) should not exceed 28% of your gross monthly income. On an $80,000 annual salary — $6,667/month gross — the maximum housing budget is about $1,867/month. Lenders also apply the 36% back-end rule, which limits all debt payments (housing plus car loans, student loans, and credit cards) to 36% of gross income. Exceeding either threshold signals risk to lenders and may affect your approval or rate.",
    answerNode: (
      <>
        Your total housing payment (PITI) should stay at or below 28% of gross monthly income. On an $80,000 salary ($6,667/month), that is a maximum of $1,867/month. Lenders also check the 36% back-end rule — all debts combined should not exceed 36% of gross income.{" "}
        <A href="/affordability-calculator">Use our affordability calculator</A> to find your personalised limit based on income and existing debts.
      </>
    ),
  },
  {
    question: "How much does a 1% rate difference cost on a $400,000 mortgage?",
    answer:
      "On a $400,000 30-year mortgage, a 1% rate increase from 6% to 7% raises your monthly payment from $2,398 to $2,661 — a difference of $263 per month. Over the full 30-year term, that adds up to $94,680 in additional interest. Even a 0.25% difference represents tens of thousands of dollars over the life of the loan. Shopping multiple lenders and improving your credit score before applying are two of the highest-return actions a buyer can take.",
    answerNode: (
      <>
        Moving from 6% to 7% on a $400,000 30-year mortgage raises your payment from $2,398 to $2,661 — $263/month more. Over 30 years, that is $94,680 in extra interest. Even 0.25% of rate difference compounds into thousands.{" "}
        <A href="/total-interest-calculator">Use our total interest calculator</A> to compare rates on your specific loan amount.
      </>
    ),
  },
  {
    question: "What is PMI and when can I stop paying it?",
    answer:
      "Private Mortgage Insurance (PMI) protects the lender — not you — if you default. It is required on conventional loans when your down payment is under 20% of the purchase price. PMI typically costs 0.5–1.5% of the loan amount per year, adding $100–$250 per month on a $300,000 loan. Under the Homeowners Protection Act, lenders must automatically cancel PMI when your loan-to-value ratio reaches 78%. You can also request cancellation once you reach 80% LTV through payments or appreciation.",
    answerNode: (
      <>
        PMI protects the lender and is required on conventional loans with under 20% down. It typically costs 0.5–1.5% of the loan annually — $100–$250/month on a $300,000 loan. Under federal law, lenders must cancel PMI automatically at 78% LTV; you can also request cancellation at 80%.{" "}
        <A href="/mortgage-calculator">Our mortgage calculator</A> shows your estimated PMI cost alongside the full payment breakdown.
      </>
    ),
  },
  {
    question: "What is the difference between a 15-year and 30-year mortgage?",
    answer:
      "On a $300,000 loan at 6% interest, a 30-year mortgage costs $1,799/month and a 15-year costs $2,532/month — $733 more per month. However, the 15-year term saves approximately $191,880 in total interest. The 30-year provides more monthly cash flow flexibility; the 15-year builds equity faster and delivers substantial long-term savings. Many homeowners choose the 30-year loan for the lower required payment and optionally make extra principal payments when cash flow allows.",
    answerNode: (
      <>
        On a $300,000 loan at 6%: 30-year = $1,799/month, 15-year = $2,532/month ($733 more). But the 15-year saves roughly $191,880 in total interest over the loan lifetime.{" "}
        <A href="/amortization-schedule">View a full amortization schedule</A> to see the exact interest breakdown year by year for both options.
      </>
    ),
  },
];

const loanFaqs: FAQItemData[] = [
  {
    question: "How do I calculate total interest on a loan?",
    answer:
      "Total interest equals (monthly payment × number of payments) minus the original principal. For a $10,000 loan at 10% interest over 3 years, the monthly payment is $323, totalling $11,616 across 36 payments. Subtract the $10,000 principal and you paid $1,616 in interest. This formula works for any installment loan. Knowing total interest helps you compare offers accurately — a longer term with lower payments often costs significantly more in total than a shorter, higher-payment option.",
    answerNode: (
      <>
        Total interest = (monthly payment × number of payments) − original principal. On a $10,000 loan at 10% for 3 years: $323 × 36 = $11,616, minus $10,000 = <strong>$1,616 in interest</strong>. A longer term with lower payments usually costs more in total.{" "}
        <A href="/total-interest-calculator">Use our total interest calculator</A> to see the lifetime cost of any loan before you sign.
      </>
    ),
  },
  {
    question: "What is the difference between interest rate and APR?",
    answer:
      "The interest rate is the annual cost of borrowing the principal only. APR (Annual Percentage Rate) includes the interest rate plus fees — origination charges, discount points, mortgage insurance, and other costs — expressed as a single annual percentage. Because APR reflects the true cost of the loan, it is always the better number to compare when evaluating offers. Two loans with identical interest rates can have very different APRs depending on their fee structures, making the lower-rate loan more expensive in reality.",
    answerNode: (
      <>
        Interest rate covers the borrowing cost only. APR adds fees — origination charges, discount points, insurance — into a single annual figure. Always compare APR across offers, not just rate. Two loans at 6.5% can have APRs of 6.8% and 7.2% depending on fees.{" "}
        <A href="/loan-calculator">Our loan calculator</A> helps you model total cost so you can identify the genuinely better deal.
      </>
    ),
  },
  {
    question: "How does loan term affect total cost?",
    answer:
      "A shorter loan term means higher monthly payments but significantly less total interest paid. On a $25,000 personal loan at 8% interest, a 3-year term costs $3,188 in total interest (payment: $783/month). Extending to 5 years lowers the monthly payment to $507 but costs $5,420 in total interest — $2,232 more for the same loan amount. Choosing the shortest term you can comfortably afford almost always produces the best financial outcome over time.",
    answerNode: (
      <>
        On a $25,000 loan at 8%: 3 years = $3,188 total interest ($783/month); 5 years = $5,420 total interest ($507/month). You pay $2,232 more for the same loan just by extending the term two years.{" "}
        <A href="/loan-calculator">Try our loan calculator</A> to compare terms side-by-side on your specific balance.
      </>
    ),
  },
  {
    question: "What monthly payment can I afford on a personal loan?",
    answer:
      "A common guideline is to keep total non-mortgage debt payments — including any new personal loan — at or below 15% of your monthly take-home pay. If you bring home $4,000/month, your total non-mortgage loan payments should not exceed $600. This preserves room for housing costs, savings, and emergencies. Personal finance experts typically recommend keeping debt payments as low as possible; the 15% ceiling is a maximum, not a target. Paying off existing debt before taking a new loan gives you more room.",
    answerNode: (
      <>
        A practical guideline: keep total non-mortgage debt payments at or below 15% of monthly take-home pay. On $4,000/month take-home, that is $600 maximum across all loans. Lower is always better.{" "}
        <A href="/monthly-payment-calculator">Our monthly payment calculator</A> shows what any loan amount and rate costs per month so you can test affordability before applying.
      </>
    ),
  },
  {
    question: "How do I compare two loan offers fairly?",
    answer:
      "Always compare APR, not just the stated interest rate. APR incorporates origination fees, discount points, and other costs into a single annual figure, making different loan structures directly comparable. Also check for prepayment penalties (fees for paying off early), whether the rate is fixed or variable, and whether fees are rolled into the loan balance. A loan with a 6% rate and a 3% origination fee can cost more in total than a 6.5% loan with no origination fee, especially on shorter time horizons.",
    answerNode: (
      <>
        Compare APR, not just rate — APR folds in origination fees and other costs. Also check for prepayment penalties and whether the rate is fixed or variable. A lower rate with high fees can easily cost more than a slightly higher rate with no fees.{" "}
        <A href="/loan-calculator">Use our loan calculator</A> to model total cost on each offer you are comparing.
      </>
    ),
  },
];

const affordabilityFaqs: FAQItemData[] = [
  {
    question: "How much house can I afford on a $70,000 salary?",
    answer:
      "Using the 28% front-end DTI rule, a $70,000 salary ($5,833/month gross) supports a maximum PITI of about $1,633/month. At a 6.8% interest rate for 30 years, that translates to a loan of approximately $193,000. With a 10% down payment, the maximum home price is around $214,000. Actual affordability depends on local property taxes, insurance, HOA fees, existing debt, and the lender's requirements. A larger down payment and lower existing debt can increase this budget significantly.",
    answerNode: (
      <>
        At $70k salary, the 28% rule supports ~$1,633/month in total housing costs. At 6.8% for 30 years, that supports roughly a $193k loan — about a $214k home with 10% down. Taxes, insurance, and existing debts all reduce this.{" "}
        <A href="/calculator/how-much-house-can-i-afford-70k-salary">See our detailed $70k salary affordability guide</A> for a full scenario breakdown.
      </>
    ),
  },
  {
    question: "What credit score do I need for a mortgage?",
    answer:
      "Conventional mortgages typically require a minimum credit score of 620. FHA loans accept scores as low as 580 with a 3.5% down payment, or 500 with 10% down. VA and USDA loans have no official minimum but most lenders require at least 620. Scores above 740 unlock the best available interest rates. Moving from 680 to 740 can reduce your mortgage rate by 0.25–0.5%, potentially saving tens of thousands of dollars over a 30-year loan lifetime.",
    answerNode: (
      <>
        Conventional loans require 620+. FHA accepts 580+ with 3.5% down. VA and USDA have no official minimum but lenders typically require 620. Scores above 740 unlock the best rates — each 20-point improvement below 740 can add meaningful interest cost.{" "}
        <A href="/affordability-calculator">Use our affordability calculator</A> to see how your credit-driven rate affects your total buying budget.
      </>
    ),
  },
  {
    question: "What is the minimum down payment for a house?",
    answer:
      "Down payment requirements vary by loan type. Conventional loans allow as little as 3–5% down. FHA loans require 3.5% with a 580+ credit score or 10% with a 500–579 score. VA loans (for veterans and active-duty service members) and USDA loans (for eligible rural properties) allow 0% down. Any conventional loan with under 20% down requires PMI until you reach 20% equity. A larger down payment reduces your monthly payment, eliminates PMI sooner, and typically earns a better interest rate.",
    answerNode: (
      <>
        Conventional: 3–5%. FHA: 3.5% (580+ score). VA and USDA: 0% for eligible buyers. Under 20% down on a conventional loan means PMI until you reach 20% equity.{" "}
        <A href="/mortgage-calculator">Run your mortgage numbers</A> with different down payment amounts to see how each option affects your monthly payment and total cost.
      </>
    ),
  },
  {
    question: "Should I rent or buy right now?",
    answer:
      "The decision depends on your break-even horizon — how long before owning becomes cheaper than renting after accounting for transaction costs. Closing costs and agent fees typically represent 8–10% of the home's value, so buyers need several years to recoup them through equity gains. If you plan to stay fewer than 3–5 years, renting usually wins. Beyond 5 years, buying typically builds more wealth through equity and appreciation. Your local price-to-rent ratio and whether rent or ownership costs more monthly are the key inputs.",
    answerNode: (
      <>
        If you plan to stay fewer than 3–5 years, renting usually wins after transaction costs. Beyond 5 years, buying typically builds more wealth. Your local price-to-rent ratio and monthly cost comparison are the key variables.{" "}
        <A href="/rent-vs-buy">Use our rent vs. buy calculator</A> to find your personal break-even point.
      </>
    ),
  },
  {
    question: "What is DTI ratio and why does it matter?",
    answer:
      "DTI (Debt-to-Income) ratio is your total monthly debt payments divided by gross monthly income. Front-end DTI covers housing costs only — lenders target below 28%. Back-end DTI covers all debts including car loans, student loans, and credit cards — target below 36%. Most conventional lenders will not approve a mortgage with a back-end DTI above 43%. FHA loans can sometimes allow up to 50% with compensating factors such as large reserves or a high credit score. Paying down existing debt before applying is one of the most effective ways to improve your approval odds.",
    answerNode: (
      <>
        Front-end DTI = housing costs ÷ gross income (target: below 28%). Back-end DTI = all debts ÷ gross income (target: below 36%). Most lenders reject applications above 43% back-end DTI.{" "}
        <A href="/affordability-calculator">Our affordability calculator</A> computes both DTI ratios automatically from your income and debt inputs.
      </>
    ),
  },
];

const refinancingFaqs: FAQItemData[] = [
  {
    question: "When does refinancing a mortgage make sense?",
    answer:
      "Refinancing makes sense when your break-even point falls before you plan to move. The break-even calculation is: closing costs ÷ monthly savings = break-even months. If closing costs are $6,000 and you save $200/month, you break even in 30 months. If you sell or move before 30 months, the refinance was a net loss. Strong candidates are homeowners who can lower their rate by at least 0.5–1%, have improved their credit score significantly, or want to remove PMI or a co-borrower from the loan.",
    answerNode: (
      <>
        Refinancing wins when you stay in the home past the break-even point: closing costs ÷ monthly savings = break-even months. At $6,000 costs and $200/month savings, that is 30 months. Move sooner, you lose money.{" "}
        <A href="/refinancing-calculator">Use our refinancing calculator</A> to compute your break-even point with your actual numbers.
      </>
    ),
  },
  {
    question: "How much does it cost to refinance?",
    answer:
      "Refinancing closing costs typically run 2–5% of the loan amount. On a $300,000 mortgage, expect $6,000–$15,000 in total costs, including lender origination fees (0.5–1%), a new appraisal ($300–$700), title insurance, and prepaid interest. Some lenders offer no-closing-cost refinances that roll fees into the interest rate or loan balance — this can be worthwhile if you plan to sell within a few years. Always calculate the break-even point before committing, regardless of how the fees are structured.",
    answerNode: (
      <>
        Expect 2–5% of the loan amount in closing costs — $6,000–$15,000 on a $300k mortgage. No-closing-cost options roll fees into the rate or balance, which can work if you plan to move soon.{" "}
        <A href="/refinancing-calculator">Our refinancing calculator</A> factors in all closing costs to show your true break-even timeline.
      </>
    ),
  },
  {
    question: "How do I calculate refinancing break-even?",
    answer:
      "Break-even months = total closing costs ÷ monthly payment savings. Example: $8,000 in closing costs divided by $250/month in savings equals 32 months. If you stay in the home beyond 32 months after closing, you profit from the refinance. If you sell, refinance again, or move before 32 months, you take a net loss. The break-even analysis does not account for the time-value of money or opportunity cost, but it is the standard practical starting point for evaluating any refinance.",
    answerNode: (
      <>
        Break-even months = closing costs ÷ monthly savings. At $8,000 in costs and $250/month savings: 32 months. Stay beyond that and refinancing wins; leave before it and you take a net loss.{" "}
        <A href="/refinancing-calculator">Calculate your personal break-even instantly</A> with our refinancing calculator.
      </>
    ),
  },
  {
    question: "Can I refinance to a shorter loan term?",
    answer:
      "Yes — refinancing from a 30-year to a 15-year mortgage is a common strategy for homeowners who want to build equity faster and reduce total interest. On a $300,000 remaining balance at 6%, switching to a 15-year term saves roughly $190,000 in interest over the remaining loan life, at the cost of higher monthly payments. This strategy works best when your income has grown significantly since the original loan, or when you are already years into a 30-year mortgage and want to accelerate payoff without restarting the clock.",
    answerNode: (
      <>
        Yes. On a $300k remaining balance at 6%, switching from 30 to 15 years saves roughly $190,000 in interest, though monthly payments rise substantially.{" "}
        <A href="/amortization-schedule">Compare amortization schedules</A> side-by-side to see the exact interest savings on your current balance.
      </>
    ),
  },
];

const categories: FAQCategory[] = [
  { title: "Mortgage Calculators", items: mortgageFaqs },
  { title: "Loan & Interest Calculators", items: loanFaqs },
  { title: "Affordability & Buying", items: affordabilityFaqs },
  { title: "Refinancing", items: refinancingFaqs },
];

const allFaqItems = [
  ...mortgageFaqs,
  ...loanFaqs,
  ...affordabilityFaqs,
  ...refinancingFaqs,
];

export default function FAQPage() {
  const schemas = [
    generateBreadcrumbSchema([{ name: "FAQ", item: "https://tryfincalc.com/faq" }]),
    generateFAQSchema(allFaqItems.map(({ question, answer }) => ({ question, answer }))),
  ];

  return (
    <MainLayout>
      <SEOHandler
        title="Financial Calculator FAQs — Mortgage, Loan & Affordability Questions Answered"
        description="Answers to the most common mortgage, loan, affordability, and refinancing questions. Includes real examples, formulas, and links to free calculators."
        canonicalUrl="https://tryfincalc.com/faq"
        structuredData={schemas}
      />

      <section className="md:w-3/4 max-w-4xl pt-20 pb-12 px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <h1 className="text-display-lg font-manrope font-bold text-primary tracking-tight mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed mb-0">
          Real answers to the most common mortgage, loan, affordability, and refinancing questions — with numbers, examples, and links to free calculators.
        </p>
      </section>

      <AdPlaceholder format="horizontal" />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map((category) => (
          <div key={category.title} className="mb-16">
            <h2 className="text-2xl font-manrope font-bold text-primary mb-6 pb-2 border-b border-outline-variant/20">
              {category.title}
            </h2>
            <Accordion
              items={category.items.map((item) => ({
                question: item.question,
                answer: item.answerNode,
              }))}
            />
          </div>
        ))}
      </section>
    </MainLayout>
  );
}
