import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/navigation/Logo";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

export function Header() {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currency = locale?.toUpperCase() || 'USD';

  const handleCurrencyChange = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Mortgages", href: "/mortgage-calculator" },
    { name: "Rent vs Buy", href: "/rent-vs-buy" },
    { name: "Amortization", href: "/amortization-schedule" },
    { name: "Guides", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-on-surface-variant font-medium hover:text-primary transition-colors hover:bg-surface-container-low px-3 py-2 rounded-md"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/10">
              <button
                onClick={() => handleCurrencyChange('eur')}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  currency === 'EUR' ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-primary"
                )}
              >
                EUR €
              </button>
              <button
                onClick={() => handleCurrencyChange('usd')}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  currency === 'USD' ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-primary"
                )}
              >
                USD $
              </button>
            </div>
            <Link href="/contact" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Contact us
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-4 pb-6 pt-2 bg-surface-container-lowest border-b border-outline-variant/20 shadow-ambient">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-on-surface hover:bg-surface-container-low hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/10 mt-4 mb-4 mx-3">
            <button
              onClick={() => handleCurrencyChange('eur')}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                currency === 'EUR' ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-primary"
              )}
            >
              EUR €
            </button>
            <button
              onClick={() => handleCurrencyChange('usd')}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                currency === 'USD' ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-primary"
              )}
            >
              USD $
            </button>
          </div>
          <Link
            href="/contact"
            className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-surface-container-low"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact us
          </Link>
        </div>
      </div>
    </header>
  );
}
