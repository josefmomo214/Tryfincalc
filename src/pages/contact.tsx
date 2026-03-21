import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Shield, Headphones } from "lucide-react";

export default function ContactAbout() {
  return (
    <MainLayout>
      <SEOHandler 
        title="Contact Us" 
        description="Have questions or feedback? Get in touch with the TryFinCalc team for assistance."
        canonicalUrl="https://tryfincalc.com/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row gap-16">
        {/* About / Info Side */}
        <div className="lg:w-1/2">
          <div className="mb-12">
            <h1 className="text-display-lg font-manrope font-bold text-primary tracking-tight mb-6">
              Empowering better financial decisions.
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              At TryFinCalc, we believe that transparency is the foundation of trust. We build clean, accurate, uncompromising computational tools to help you cut through the marketing jargon and see the real numbers behind your loans.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 bg-surface-container-highest p-3 rounded-xl inline-flex h-12 w-12 items-center justify-center text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-manrope font-bold text-primary mb-2">Privacy First</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  All calculations run directly in your browser. We never store, transmit, or sell the financial data you input into our tools.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 bg-surface-container-highest p-3 rounded-xl inline-flex h-12 w-12 items-center justify-center text-primary">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-manrope font-bold text-primary mb-2">We Listen</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Notice an edge case in our amortization math? Having trouble with a specific device? We actively update our tools based on user feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="lg:w-1/2 bg-surface-container-lowest shadow-ambient rounded-3xl p-8 sm:p-12 border border-outline-variant/10">
          <h2 className="text-2xl font-manrope font-bold text-primary mb-2">Get in touch</h2>
          <p className="text-on-surface-variant mb-8 text-sm">
            Fill out the form below and our support team will get back to you within 24-48 hours.
          </p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">First Name</label>
                <Input type="text" placeholder="Jane" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">Last Name</label>
                <Input type="text" placeholder="Doe" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Email Address</label>
              <Input type="email" placeholder="jane@example.com" required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Message</label>
              <textarea 
                className="flex w-full rounded-md border border-outline-variant/50 bg-transparent px-3 py-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px] resize-y"
                placeholder="How can we help you?"
                required
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full">
              Send Message <Mail className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant/20">
            <p className="text-xs text-outline leading-relaxed">
              <strong>Disclaimer:</strong> The tools provided on this website are for educational and illustrative purposes only. They do not constitute financial or legal advice. Please consult with a qualified financial advisor before making major financial decisions.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
