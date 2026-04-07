import React from "react";
import Link from "next/link";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Logo } from "@/components/navigation/Logo";

export function Footer() {
  return (
    <footer className="bg-surface-container pt-16 pb-8 border-t border-outline-variant/20 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <AdPlaceholder className="mb-12" label="Advertisement" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed max-w-xs">
              Premium financial calculators for the modern professional. Fast, accurate, and completely free.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-on-surface uppercase mb-4">Calculators</h3>
            <ul className="space-y-3">
              <li><Link href="/loan-calculator" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Loan Calculator</Link></li>
              <li><Link href="/mortgage-calculator" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Mortgage Calculator</Link></li>
              <li><Link href="/monthly-payment-calculator" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Monthly Payment</Link></li>
              <li><Link href="/total-interest-calculator" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Total Interest</Link></li>
              <li><Link href="/refinancing-calculator" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Refinancing</Link></li>
              <li><Link href="/amortization-schedule" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Amortization Schedule</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-on-surface uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/rent-vs-buy" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Rent vs Buy</Link></li>
              <li><Link href="/affordability-calculator" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Affordability</Link></li>
              <li><Link href="/blog" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Financial Guides</Link></li>
              <li><Link href="/faq" className="text-sm text-on-surface-variant hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-on-surface uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-on-surface-variant hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link></li>
              <li>
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).revisitCkyConsent) {
                      (window as any).revisitCkyConsent();
                    }
                  }}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4 decoration-dotted"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center text-sm text-on-surface-variant">
          <p>&copy; {new Date().getFullYear()} TryFinCalc. All rights reserved.</p>
          <p className="mt-4 md:mt-0 text-xs text-outline">For illustrative purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
