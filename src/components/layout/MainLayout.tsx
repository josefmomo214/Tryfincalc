import React, { useEffect, useState } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import SearchOverlay from "@/components/navigation/SearchOverlay";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-inter bg-surface text-on-surface">
      <Header onSearchOpen={() => setIsSearchOpen(true)} />
      <main className="flex-grow flex flex-col pb-24 md:pb-0">
        {children}
      </main>
      <Footer />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* High-performance sticky mobile ad */}
      <AdPlaceholder format="mobile-sticky" className="md:hidden" />
    </div>
  );
}
