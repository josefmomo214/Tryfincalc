import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";

export default function TermsOfService() {
  return (
    <MainLayout>
      <SEOHandler 
        title="Terms of Service" 
        description="Read the terms of service for using TryFinCalc's financial calculators and guides. Our tools are free and require no sign-up. Understand our user agreement."
        canonicalUrl="https://tryfincalc.com/terms-of-service"
        noindex={true}
      />
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-manrope font-bold text-primary mb-8">Terms of Service</h1>
        <div className="prose prose-teal max-w-none text-on-surface-variant">
          <p>Last updated: March 21, 2026</p>
          <p>By accessing tryfincalc.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations.</p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. Use License</h2>
          <p>Permission is granted to temporarily use the calculators for personal, non-commercial transitory viewing only.</p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. Disclaimer</h2>
          <p>The calculators on TryFinCalc are provided on an 'as is' basis. TryFinCalc makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
        </div>
      </div>
    </MainLayout>
  );
}
