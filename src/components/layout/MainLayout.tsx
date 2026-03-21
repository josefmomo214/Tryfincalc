import React from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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
