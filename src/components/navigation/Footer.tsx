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

        <div className="mt-12 pt-8 border-t border-outline-variant/30 flex flex-col items-center gap-4">
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
            Follow TryFinCalc
          </span>
          <div className="flex gap-4 items-center">
            <a
              href="https://www.facebook.com/profile.php?id=61588922634968"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TryFinCalc on Facebook"
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center justify-center w-9 h-9"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/try-fin-calc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TryFinCalc on LinkedIn"
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center justify-center w-9 h-9"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://www.pinterest.com/TryFinCalc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TryFinCalc on Pinterest"
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center justify-center w-9 h-9"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center text-sm text-on-surface-variant">
          <p>&copy; {new Date().getFullYear()} TryFinCalc. All rights reserved.</p>
          <p className="mt-4 md:mt-0 text-xs text-outline">For illustrative purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
