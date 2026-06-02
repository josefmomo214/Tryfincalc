import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <SEOHandler
        title="Privacy Policy | TryFinCalc"
        description="TryFinCalc privacy policy: how we handle your data, cookies, Google AdSense advertising, and your rights under GDPR and CCPA."
        canonicalUrl="https://tryfincalc.com/privacy-policy"
        noindex={true}
      />

      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-manrope font-bold text-primary mb-4">Privacy Policy</h1>
        <p className="text-on-surface-variant mb-8 text-sm">Last updated: June 2, 2026</p>

        {/* Table of Contents */}
        <div className="bg-surface-container-low p-6 rounded-2xl mb-12 border border-outline-variant/30">
          <p className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Jump to:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-on-surface-variant font-medium">
            <a href="#information-we-collect" className="hover:text-primary transition-colors">Information We Collect</a>
            <span className="text-outline-variant">•</span>
            <a href="#cookies" className="hover:text-primary transition-colors">Cookies</a>
            <span className="text-outline-variant">•</span>
            <a href="#how-we-use-data" className="hover:text-primary transition-colors">How We Use Data</a>
            <span className="text-outline-variant">•</span>
            <a href="#gdpr-rights" className="hover:text-primary transition-colors">GDPR Rights</a>
            <span className="text-outline-variant">•</span>
            <a href="#ccpa-rights" className="hover:text-primary transition-colors">CCPA Rights</a>
            <span className="text-outline-variant">•</span>
            <a href="#third-party-services" className="hover:text-primary transition-colors">Third-Party Services</a>
            <span className="text-outline-variant">•</span>
            <a href="#data-retention" className="hover:text-primary transition-colors">Data Retention</a>
            <span className="text-outline-variant">•</span>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
            <span className="text-outline-variant">•</span>
            <a href="#children" className="hover:text-primary transition-colors">Children</a>
            <span className="text-outline-variant">•</span>
            <a href="#changes" className="hover:text-primary transition-colors">Changes</a>
            <span className="text-outline-variant">•</span>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>

        <div className="prose prose-teal max-w-none text-on-surface-variant leading-relaxed">
          <p>
            TryFinCalc (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates tryfincalc.com — a free financial calculator
            platform. This Privacy Policy explains what information we collect when you use our site,
            how we use it, and what rights you have. We have written it in plain English so you can
            actually understand it.
          </p>
          <p>
            Questions? Email us at <a href="mailto:[contact@tryfincalc.com]" className="text-primary hover:underline">[contact@tryfincalc.com]</a>.
          </p>

          <hr className="my-12 border-outline-variant/30" />

          {/* 1. Information We Collect */}
          <h2 id="information-we-collect" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">1. Information We Collect</h2>
          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Calculator Inputs — We Collect Nothing</h3>
          <p>
            Every calculator on TryFinCalc runs entirely inside your browser. When you type in a loan
            amount, interest rate, salary, or any other financial figure, that data is processed
            locally on your device. It is never sent to our servers, never stored in a database, and
            never shared with anyone. Once you close or refresh the page, it is gone.
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Information You Send Us Directly</h3>
          <p>
            If you email us or use a contact form, we receive your name, email address, and the
            content of your message. We use that information only to reply to you.
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Automatically Collected Technical Data</h3>
          <p>
            When you visit TryFinCalc, analytics tools automatically collect general technical
            information: your approximate IP address, browser type and version, operating system,
            the page that referred you here, which pages you visit, and how long you spend on them.
            This data is aggregated and used to improve the site — it does not identify you personally.
          </p>

          {/* 2. Cookies and Tracking Technologies */}
          <h2 id="cookies" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">2. Cookies and Tracking Technologies</h2>
          <p>
            A cookie is a small text file saved on your device by your browser. TryFinCalc uses
            three categories of cookies:
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Strictly Necessary Cookies</h3>
          <p>
            These cookies make the site work. They remember your display preferences such as
            light or dark mode and your currency choice (USD or EUR). Without them the site
            cannot function correctly, so they are always active.
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Analytics Cookies (Google Analytics)</h3>
          <p>
            We use Google Analytics to understand how visitors use TryFinCalc — which calculators
            are most popular, how people navigate the site, and which articles are most helpful.
            Google Analytics collects this data in aggregate, anonymised form using cookies. It
            does not receive any financial figures you enter into our calculators.
          </p>
          <p>
            You can opt out of Google Analytics tracking across all websites by installing the
            free browser add-on at{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
              tools.google.com/dlpage/gaoptout
            </a>.
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Advertising Cookies (Google AdSense)</h3>
          <p>
            TryFinCalc displays advertisements provided by <strong>Google AdSense</strong>.
            Google uses cookies to serve ads on our site. These cookies allow Google and its
            advertising partners to show you ads based on your visits to TryFinCalc and other
            websites you have previously visited.
          </p>
          <p>
            Google&apos;s use of advertising cookies is governed by its own privacy policy. By using
            TryFinCalc you acknowledge that Google may use these cookies to personalise the ads
            you see. You can review and adjust how Google uses your data for advertising at any
            time:
          </p>
          <div className="space-y-2 ml-4">
            <p>
              <strong>Google Ads Settings:</strong>{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                adssettings.google.com
              </a>{" "}
              — opt out of personalised ads from Google.
            </p>
            <p>
              <strong>US opt-out (NAI):</strong>{" "}
              <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                optout.aboutads.info
              </a>{" "}
              — opt out of interest-based advertising from participating companies.
            </p>
            <p>
              <strong>EU opt-out:</strong>{" "}
              <a href="https://youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                youronlinechoices.eu
              </a>{" "}
              — manage advertising cookie preferences for European users.
            </p>
          </div>
          <p className="mt-4">
            Opting out of personalised ads does not remove ads from the site — it means the ads
            shown will be less relevant to your interests.
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Cookie Consent (EU / EEA Visitors)</h3>
          <p>
            If you are visiting from the European Union, European Economic Area, or another
            jurisdiction that requires prior cookie consent, a consent banner will appear on your
            first visit. Non-essential cookies (analytics and advertising) will only be set after
            you provide consent. You can change your preferences at any time by clicking
            &quot;Cookie Settings&quot; in the footer.
          </p>

          {/* 3. How We Use Your Information */}
          <h2 id="how-we-use-data" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Run and improve TryFinCalc and its calculators</li>
            <li>Understand how visitors use the site so we can build better tools and content</li>
            <li>Display advertisements through Google AdSense to keep the site free</li>
            <li>Reply to messages you send us</li>
            <li>Detect and fix technical errors</li>
            <li>Meet our legal obligations</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal information. We do not share your data
            with any third party except Google (for analytics and advertising as described above).
            We never receive the financial figures you enter into our calculators — they never
            leave your device.
          </p>

          {/* 4. Your Rights Under GDPR (European Users) */}
          <h2 id="gdpr-rights" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">4. Your Rights Under GDPR (European Users)</h2>
          <p>
            If you are in the European Economic Area (EEA), the United Kingdom, or Switzerland,
            the General Data Protection Regulation (GDPR) gives you the following rights over
            your personal data:
          </p>
          <div className="space-y-4">
            <p><strong>Right of Access:</strong> You can ask us for a copy of the personal data we hold about you.</p>
            <p><strong>Right to Rectification:</strong> You can ask us to correct any inaccurate data we hold about you.</p>
            <p><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You can ask us to delete your personal data. Because our calculators collect no data, this right mainly applies to any email correspondence you have sent us.</p>
            <p><strong>Right to Restrict Processing:</strong> You can ask us to pause how we process your data in certain circumstances.</p>
            <p><strong>Right to Data Portability:</strong> You can ask us to provide your data in a portable, machine-readable format.</p>
            <p><strong>Right to Object:</strong> You can object to our processing of your data for direct marketing or where we rely on legitimate interest as our legal basis.</p>
            <p><strong>Right to Withdraw Consent:</strong> Where processing is based on your consent (such as advertising cookies), you can withdraw that consent at any time. This does not affect the lawfulness of processing before withdrawal.</p>
          </div>
          <p className="mt-8">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:[contact@tryfincalc.com]" className="text-primary hover:underline">[contact@tryfincalc.com]</a>.
            We will respond within 30 days. You also have the right to lodge a complaint with your
            national data protection supervisory authority — for example, the ICO in the UK or the
            relevant DPA in your EU member state.
          </p>

          {/* 5. Your Rights Under CCPA (California Users) */}
          <h2 id="ccpa-rights" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">5. Your Rights Under CCPA (California Users)</h2>
          <p>
            If you are a California resident, the California Consumer Privacy Act (CCPA) gives
            you the following rights:
          </p>
          <ul>
            <li>The right to know what personal information we collect, use, and disclose</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to opt out of the sale of your personal information — note that we do not sell personal information</li>
            <li>The right not to be discriminated against for exercising your privacy rights</li>
          </ul>
          <p>
            To exercise these rights, email{" "}
            <a href="mailto:[contact@tryfincalc.com]" className="text-primary hover:underline">[contact@tryfincalc.com]</a>.
          </p>

          {/* 6. Third-Party Services and Advertising Disclosure */}
          <h2 id="third-party-services" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">6. Third-Party Services and Advertising Disclosure</h2>
          <p>
            TryFinCalc is a free service supported by advertising. We work with the following
            third-party services, each of which has its own privacy policy:
          </p>
          <ul>
            <li>
              <strong>Google AdSense</strong> — displays ads on our site. Google and its partners
              use cookies and similar technologies to serve ads based on your browsing history
              across TryFinCalc and other websites. Google is an independent controller of this
              data.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong>Google Analytics</strong> — measures site traffic using anonymised,
              aggregated data.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">
                Google Privacy Policy
              </a>
            </li>
          </ul>
          <p>
            When you click an external link on TryFinCalc — such as to the Consumer Financial
            Protection Bureau (<a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">consumerfinance.gov</a>),
            the Federal Reserve (<a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">federalreserve.gov</a>),
            or IRS (<a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">irs.gov</a>) — you leave
            TryFinCalc and that site&apos;s own privacy policy applies. We are not responsible for
            third-party privacy practices.
          </p>

          {/* 7. Data Retention */}
          <h2 id="data-retention" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">7. Data Retention</h2>
          <p>
            We keep email correspondence for up to 2 years and then delete it. Analytics data
            is retained according to Google Analytics&apos; standard retention settings (14 months by
            default).
          </p>
          <p>
            We retain no financial data from our calculators — because we never receive any.
          </p>

          {/* 8. Data Security */}
          <h2 id="security" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">8. Data Security</h2>
          <p>
            TryFinCalc is served entirely over HTTPS. Our calculators process data client-side
            only, so sensitive financial figures never travel over the network. We apply reasonable
            technical safeguards to any data we do hold (such as email enquiries).
          </p>
          <p>
            No internet service can guarantee 100% security. If you have a security concern,
            contact us at{" "}
            <a href="mailto:[contact@tryfincalc.com]" className="text-primary hover:underline">[contact@tryfincalc.com]</a>.
          </p>

          {/* 9. Children's Privacy */}
          <h2 id="children" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">9. Children&apos;s Privacy</h2>
          <p>
            TryFinCalc is not directed at children under 13. We do not knowingly collect
            personal information from anyone under 13. If you believe a child has sent us
            personal information, email{" "}
            <a href="mailto:[contact@tryfincalc.com]" className="text-primary hover:underline">[contact@tryfincalc.com]</a>{" "}
            and we will delete it promptly.
          </p>

          {/* 10. Changes to This Privacy Policy */}
          <h2 id="changes" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this policy from time to time — for example, if we add a new
            third-party service or if the law changes. When we make material changes, we will
            update the &quot;Last updated&quot; date at the top of this page. We encourage you to check
            back periodically. Continuing to use TryFinCalc after a change is posted means
            you accept the updated policy.
          </p>

          {/* 11. Contact Us */}
          <h2 id="contact" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, want to exercise your data
            rights, or have a privacy concern, please contact us:
          </p>
          <p className="font-medium text-on-surface">
            TryFinCalc<br />
            Email: <a href="mailto:[contact@tryfincalc.com]" className="text-primary hover:underline">[contact@tryfincalc.com]</a><br />
            Website: <a href="https://tryfincalc.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tryfincalc.com</a>
          </p>
          <p>
            For GDPR requests we will respond within 30 days. For general questions we aim to
            reply within 2 business days.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
