import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";

export default function Contact() {
  return (
    <MainLayout>
      <SEOHandler 
        title="Contact TryFinCalc: Get Expert Financial Advice | TryFinCalc"
        description="Reach out to our team for questions, feedback, or calculator requests. We help you understand your finances and see your monthly payment in seconds."
        canonicalUrl="https://tryfincalc.com/contact"
        noindex={true}
      />

      {/* Main container with min 80px top padding as requested */}
      <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-20 px-4">
        <div className="max-w-[600px] w-full mx-auto flex flex-col items-center">
          
          {/* SECTION 1: Page heading */}
          <div className="text-center mb-12">
            <h1 className="font-manrope font-medium leading-tight text-on-surface text-[32px] sm:text-[42px] mb-2">
              Contact <span className="text-primary font-bold">TryFinCalc</span>
            </h1>
            <p className="text-base text-on-surface-variant">
              We&apos;re here to help
            </p>
          </div>

          {/* SECTION 2: Centered card */}
          <div className="w-full bg-surface-container-lowest border-[0.5px] border-outline-variant shadow-ambient rounded-[16px] max-w-[520px] px-6 py-8 sm:px-10 sm:py-12 mx-auto">
            <div className="flex flex-col items-center">
              
              <p className="text-[15px] leading-[1.7] text-on-surface-variant text-center">
                Have a question about our calculators? Found a calculation error? We&apos;d love to hear from you — whether it&apos;s a bug report, a suggestion, or just feedback on what we could do better.
              </p>

              {/* Thin horizontal divider line */}
              <hr className="w-full border-0 border-t-[0.5px] border-outline-variant my-6" />

              <div className="text-center mb-2">
                <span className="text-[11px] tracking-[0.1em] uppercase text-on-surface-variant font-medium">
                  EMAIL US AT
                </span>
              </div>

              {/* Email Address Link */}
              <a 
                href="mailto:hello@tryfincalc.com" 
                className="text-[18px] sm:text-[22px] font-medium text-primary no-underline border-b-[1.5px] border-primary pb-0.5 hover:opacity-80 transition-all text-center inline-block"
              >
                hello@tryfincalc.com
              </a>

              {/* Thin horizontal divider line */}
              <hr className="w-full border-0 border-t-[0.5px] border-outline-variant my-6" />

              {/* Disclaimer Note */}
              <p className="text-[13px] text-on-surface-variant italic text-center leading-[1.6]">
                Please note: Our calculators are for educational purposes only and do not constitute financial advice. For important financial decisions, please consult a qualified financial advisor.
              </p>

            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
