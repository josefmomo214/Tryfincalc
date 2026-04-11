import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <SEOHandler 
        title="Privacy Policy: User Data & Security | TryFinCalc" 
        description="Read our privacy policy to understand how we protect your data. See your monthly payment in seconds with peace of mind using our secure 2026 tools."
        canonicalUrl="https://tryfincalc.com/privacy-policy"
        noindex={true}
      />
      
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-manrope font-bold text-primary mb-4">Privacy Policy</h1>
        <p className="text-on-surface-variant mb-8 text-sm">Last updated: April 4, 2026</p>

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
            This Privacy Policy explains how TryFinCalc ("we", "us", or "our"), operated at tryfincalc.com, 
            collects, uses, and protects information when you use our website. We are committed to protecting 
            your privacy and being transparent about our data practices.
          </p>
          <p>
            If you have questions about this policy, contact us at <a href="mailto:hello@tryfincalc.com" className="text-primary hover:underline">hello@tryfincalc.com</a>.
          </p>

          <hr className="my-12 border-outline-variant/30" />

          {/* 1. Information We Collect */}
          <h2 id="information-we-collect" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">1. Information We Collect</h2>
          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Calculator Data</h3>
          <p>
            TryFinCalc's calculators run entirely in your browser. When you enter financial data such as 
            loan amounts, interest rates, income figures, or down payment amounts into our calculators, 
            that data is processed locally on your device and is never transmitted to our servers, stored 
            in any database, or shared with any third party.
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Information You Provide Directly</h3>
          <p>
            If you contact us via our contact page or by email, we collect the information you choose 
            to provide — typically your name, email address, and the content of your message. We use this 
            solely to respond to your inquiry.
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Automatically Collected Information</h3>
          <p>
            When you visit TryFinCalc, we automatically collect certain technical information including 
            your IP address, browser type and version, operating system, referring URL, pages visited, 
            time and date of visit, and time spent on pages. This information is collected through analytics 
            tools and cookies as described below.
          </p>

          {/* 2. Cookies and Tracking Technologies */}
          <h2 id="cookies" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">2. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies on TryFinCalc. A cookie is a small text file 
            stored on your device when you visit a website.
          </p>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Types of Cookies We Use</h3>
          <div className="space-y-4">
            <p><strong>Strictly Necessary Cookies</strong></p>
            <p className="ml-4">
              These cookies are essential for the website to function. They include cookies that remember 
              your theme preference (light or dark mode) and your currency selection (USD or EUR). These 
              cookies cannot be disabled as they are required for the site to work correctly.
            </p>

            <p><strong>Analytics Cookies</strong></p>
            <p className="ml-4">
              We use Google Analytics to understand how visitors interact with our site — which pages 
              are most visited, how long people spend reading articles, and which calculators are used most 
              frequently. Google Analytics uses cookies to collect this information in aggregate, anonymous 
              form. No personally identifiable financial data is included in analytics tracking.
            </p>
            <p className="ml-4">
              You can opt out of Google Analytics tracking by installing the Google Analytics opt-out 
              browser add-on available at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">tools.google.com/dlpage/gaoptout</a>.
            </p>

            <p><strong>Advertising Cookies</strong></p>
            <p className="ml-4">
              We use Google AdSense to display advertisements on TryFinCalc. Google AdSense uses cookies to 
              serve ads based on your prior visits to our site and other sites on the internet. Google's 
              use of advertising cookies enables it and its partners to serve ads based on your visit to 
              TryFinCalc and other sites on the internet.
            </p>
            <p className="ml-4">
              You may opt out of personalised advertising by visiting Google's Ads Settings at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">adssettings.google.com</a>. 
              You can also opt out of third-party vendor use of cookies for personalised advertising by visiting <a href="https://aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">aboutads.info/choices</a> or <a href="https://youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">youronlinechoices.eu</a> (for European users).
            </p>

            <p><strong>Third-Party Cookies</strong></p>
            <p className="ml-4">
              Third-party services we use — including Google Analytics and Google AdSense — may place their 
              own cookies on your device. These cookies are governed by the respective privacy policies of 
              those third parties. We do not control these cookies. Links to relevant third-party privacy 
              policies are provided in Section 6 below.
            </p>
          </div>

          <h3 className="text-lg font-bold text-on-surface mt-8 mb-3 font-manrope">Cookie Consent</h3>
          <p>
            If you are located in the European Union or another jurisdiction that requires cookie 
            consent, a cookie consent banner will appear when you first visit TryFinCalc. You can manage 
            your cookie preferences at any time by clicking "Cookie Settings" in the footer of any page.
          </p>

          {/* 3. How We Use Your Information */}
          <h2 id="how-we-use-data" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Operate and improve TryFinCalc and its calculators</li>
            <li>Understand how visitors use the site so we can create better content and tools</li>
            <li>Display relevant advertising through Google AdSense</li>
            <li>Respond to inquiries submitted through our contact page</li>
            <li>Detect and prevent technical errors or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>
            We do not sell your personal information to third parties. We do not use your financial 
            calculator inputs for any purpose — they never leave your browser.
          </p>

          {/* 4. Your Rights Under GDPR (European Users) */}
          <h2 id="gdpr-rights" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">4. Your Rights Under GDPR (European Users)</h2>
          <p>
            If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, 
            you have the following rights regarding your personal data under the General Data Protection 
            Regulation (GDPR):
          </p>
          <div className="space-y-4">
            <p><strong>Right of Access:</strong> You have the right to request a copy of the personal data we hold about you.</p>
            <p><strong>Right to Rectification:</strong> You have the right to request that we correct any inaccurate personal data we hold about you.</p>
            <p><strong>Right to Erasure:</strong> You have the right to request that we delete your personal data, subject to certain conditions.</p>
            <p><strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data in certain circumstances.</p>
            <p><strong>Right to Data Portability:</strong> You have the right to request that we transfer your data to another organisation or directly to you.</p>
            <p><strong>Right to Object:</strong> You have the right to object to our processing of your personal data for direct marketing or legitimate interest purposes.</p>
            <p><strong>Right to Withdraw Consent:</strong> Where we process your data based on consent (such as advertising cookies), you have the right to withdraw that consent at any time without affecting the lawfulness of prior processing.</p>
          </div>
          <p className="mt-8">
            To exercise any of these rights, contact us at <a href="mailto:hello@tryfincalc.com" className="text-primary hover:underline">hello@tryfincalc.com</a>. We will respond within 30 days. You also have the right to lodge a complaint with your national data protection authority.
          </p>

          {/* 5. Your Rights Under CCPA (California Users) */}
          <h2 id="ccpa-rights" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">5. Your Rights Under CCPA (California Users)</h2>
          <p>
            If you are a California resident, you have the following rights under the California 
            Consumer Privacy Act (CCPA):
          </p>
          <ul>
            <li>The right to know what personal information we collect, use, and share</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to opt out of the sale of your personal information (note: we do not sell personal information)</li>
            <li>The right to non-discrimination for exercising your privacy rights</li>
          </ul>
          <p>
            To exercise these rights, contact us at <a href="mailto:hello@tryfincalc.com" className="text-primary hover:underline">hello@tryfincalc.com</a>.
          </p>

          {/* 6. Third-Party Services and Links */}
          <h2 id="third-party-services" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">6. Third-Party Services and Links</h2>
          <p>
            TryFinCalc links to and references third-party websites and services. This Privacy Policy 
            applies only to TryFinCalc. When you click on an external link, you are subject to that 
            website&apos;s privacy policy. We are not responsible for the privacy practices of third-party sites.
          </p>
          <p>Third-party services used on TryFinCalc and their relevant privacy policies:</p>
          <ul>
            <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">policies.google.com/privacy</a></li>
            <li><strong>Google AdSense:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">policies.google.com/privacy</a></li>
            <li><strong>CookieYes (cookie consent):</strong> <a href="https://cookieyes.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">cookieyes.com/privacy-policy</a></li>
          </ul>
          <p>
            Authoritative external sources linked in our articles — such as the Consumer Financial 
            Protection Bureau (<a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">consumerfinance.gov</a>), 
            the Federal Reserve (<a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">federalreserve.gov</a>), 
            and HUD (<a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">hud.gov</a>) — are independent government websites 
            with their own privacy policies.
          </p>

          {/* 7. Data Retention */}
          <h2 id="data-retention" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">7. Data Retention</h2>
          <p>
            We retain contact form submissions and associated email correspondence for up to 2 years, after which they are deleted. 
            Analytics data is retained in accordance with Google Analytics&apos; data retention settings (default: 14 months).
          </p>
          <p>
            We do not retain any financial data entered into our calculators — because we never receive it in the first place.
          </p>

          {/* 8. Data Security */}
          <h2 id="security" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">8. Data Security</h2>
          <p>
            We implement reasonable technical and organisational measures to protect information 
            against unauthorised access, alteration, disclosure, or destruction. TryFinCalc is 
            served over HTTPS. Our calculators use client-side processing only.
          </p>
          <p>
            No method of transmission over the internet is 100% secure. While we take data protection 
            seriously, we cannot guarantee absolute security.
          </p>

          {/* 9. Children's Privacy */}
          <h2 id="children" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">9. Children's Privacy</h2>
          <p>
            TryFinCalc is not directed at children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you believe a child under 13 has provided 
            us with personal information, please contact us at <a href="mailto:hello@tryfincalc.com" className="text-primary hover:underline">hello@tryfincalc.com</a> and we will delete it promptly.
          </p>

          {/* 10. Changes to This Privacy Policy */}
          <h2 id="changes" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices 
            or for legal, operational, or regulatory reasons. When we make material changes, we 
            will update the &quot;Last updated&quot; date at the top of this page. We encourage you to review 
            this policy periodically.
          </p>
          <p>
            Continued use of TryFinCalc after changes are posted constitutes acceptance of the 
            updated policy.
          </p>

          {/* 11. Contact Us */}
          <h2 id="contact" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">11. Contact Us</h2>
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
          <p className="font-medium text-on-surface">
            TryFinCalc<br />
            Email: <a href="mailto:hello@tryfincalc.com" className="text-primary hover:underline">hello@tryfincalc.com</a><br />
            Website: <a href="https://tryfincalc.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tryfincalc.com</a>
          </p>
          <p>
            For GDPR-related requests, we will respond within 30 days. For general inquiries, we aim to respond within 2 business days.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
