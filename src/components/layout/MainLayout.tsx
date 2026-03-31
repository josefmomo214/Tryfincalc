import React, { useEffect } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[aria-label="Search TryFinCalc"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-inter bg-surface text-on-surface">
      <Header />
      <main className="flex-grow flex flex-col pb-24 md:pb-0">
        {children}
      </main>
      <Footer />

      {/* High-performance sticky mobile ad */}
      <AdPlaceholder format="mobile-sticky" className="md:hidden" />
    </div>
  );
}
