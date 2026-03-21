import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <SEOHandler 
        title="Privacy Policy" 
        description="Learn how we protect your data and respect your privacy at TryFinCalc."
        canonicalUrl="https://tryfincalc.com/privacy-policy"
      />
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-manrope font-bold text-primary mb-8">Privacy Policy</h1>
        <div className="prose prose-teal max-w-none text-on-surface-variant">
          <p>Last updated: March 21, 2026</p>
          <p>Your privacy is important to us. It is TryFinCalc's policy to respect your privacy regarding any information we may collect from you across our website, tryfincalc.com.</p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. Information we collect</h2>
          <p>TryFinCalc is a client-side calculator. We do not store your financial data on our servers. All calculations are performed in your browser.</p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. Cookies</h2>
          <p>We use cookies to remember your theme preference (light/dark mode) and for basic analytics to improve our service.</p>
        </div>
      </div>
    </MainLayout>
  );
}
