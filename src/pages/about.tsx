import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { SEOHandler } from '@/components/seo/SEOHandler';
import { OWNERSHIP, FUNDING, ACCURACY } from '@/lib/trust';
export default function About() {
  return <MainLayout><SEOHandler title="About TryFinCalc and Youssef Aaouam" description="Who builds TryFinCalc, how the calculators are tested, and how the independent site may be funded." canonicalUrl="https://tryfincalc.com/about"/>
    <article className="max-w-3xl mx-auto px-6 py-16 space-y-8 text-on-surface">
      <h1 className="text-4xl font-bold text-primary">About TryFinCalc</h1><p>{OWNERSHIP}</p>
      <h2 className="text-2xl font-bold">Calculation accuracy and limits</h2><p>{ACCURACY}</p>
      <p>The tools use illustrative fixed-rate inputs. A displayed currency does not select a country&apos;s lending or tax rules. Start with the <Link href="/methodology" className="underline">methodology and exclusions</Link>, then replace the defaults with your own assumptions.</p>
      <h2 className="text-2xl font-bold">Funding and independence</h2><p>{FUNDING}</p>
      <h2 className="text-2xl font-bold">Authorship and corrections</h2><p>Youssef Aaouam is the named author and maintainer. No external professional review or financial qualification is claimed. The <Link href="/editorial-policy" className="underline">editorial policy</Link> explains source selection, conflicts and corrections.</p>
      <p>Report an error with the page URL, inputs and expected result to <a href="mailto:hello@tryfincalc.com" className="underline">hello@tryfincalc.com</a>. Do not send account details or other sensitive financial information.</p>
      <h2 className="text-2xl font-bold">Privacy</h2><p>Calculations run in your browser after the initial example is rendered. Calculator inputs are not submitted by the calculation forms. Analytics and consent services are described in the <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
      <p><Link href="/mortgage-calculator" className="underline">Mortgage calculator</Link> · <Link href="/loan-calculator" className="underline">Loan calculator</Link> · <Link href="/contact" className="underline">Contact</Link></p>
    </article></MainLayout>;
}
