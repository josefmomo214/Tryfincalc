import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";

export default function TermsOfService() {
  return (
    <MainLayout>
      <SEOHandler 
        title="Terms of Service" 
        description="Read our comprehensive Terms of Service for using TryFinCalc's financial calculators and educational content. Understand your rights and our limitations of liability."
        canonicalUrl="https://tryfincalc.com/terms-of-service"
        noindex={true}
      />
      
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-manrope font-bold text-primary mb-4">Terms of Service</h1>
        <p className="text-on-surface-variant mb-8 text-sm">Last updated: April 4, 2026</p>

        {/* Table of Contents */}
        <div className="bg-surface-container-low p-6 rounded-2xl mb-12 border border-outline-variant/30">
          <p className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Jump to:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-on-surface-variant font-medium">
            <a href="#acceptance-of-terms" className="hover:text-primary transition-colors">Acceptance of Terms</a>
            <span className="text-outline-variant">•</span>
            <a href="#use-of-the-site" className="hover:text-primary transition-colors">Use of the Site</a>
            <span className="text-outline-variant">•</span>
            <a href="#no-financial-advice" className="hover:text-primary transition-colors">No Financial Advice</a>
            <span className="text-outline-variant">•</span>
            <a href="#calculator-accuracy" className="hover:text-primary transition-colors">Calculator Accuracy</a>
            <span className="text-outline-variant">•</span>
            <a href="#intellectual-property" className="hover:text-primary transition-colors">Intellectual Property</a>
            <span className="text-outline-variant">•</span>
            <a href="#user-conduct" className="hover:text-primary transition-colors">User Conduct</a>
            <span className="text-outline-variant">•</span>
            <a href="#third-party-links" className="hover:text-primary transition-colors">Third-Party Links</a>
            <span className="text-outline-variant">•</span>
            <a href="#advertising" className="hover:text-primary transition-colors">Advertising</a>
            <span className="text-outline-variant">•</span>
            <a href="#limitation-of-liability" className="hover:text-primary transition-colors">Limitation of Liability</a>
            <span className="text-outline-variant">•</span>
            <a href="#indemnification" className="hover:text-primary transition-colors">Indemnification</a>
            <span className="text-outline-variant">•</span>
            <a href="#disclaimer-of-warranties" className="hover:text-primary transition-colors">Disclaimer of Warranties</a>
            <span className="text-outline-variant">•</span>
            <a href="#governing-law" className="hover:text-primary transition-colors">Governing Law</a>
            <span className="text-outline-variant">•</span>
            <a href="#changes-to-terms" className="hover:text-primary transition-colors">Changes to Terms</a>
            <span className="text-outline-variant">•</span>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>

        <div className="prose prose-teal max-w-none text-on-surface-variant leading-relaxed">
          <p>
            Please read these Terms of Service carefully before using TryFinCalc at tryfincalc.com. 
            By accessing or using our website, you agree to be bound by these terms. 
            If you do not agree with any part of these terms, please do not use TryFinCalc.
          </p>
          <p>
            If you have questions about these terms, contact us at <a href="mailto:hello@tryfincalc.com" className="text-primary hover:underline">hello@tryfincalc.com</a>.
          </p>

          <hr className="my-12 border-outline-variant/30" />

          {/* 1. Acceptance of Terms */}
          <h2 id="acceptance-of-terms" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">1. Acceptance of Terms</h2>
          <p>
            By accessing tryfincalc.com, using any of our calculators, or reading any content on this 
            website, you confirm that you are at least 18 years old (or the age of majority in your 
            jurisdiction), have read and understood these Terms of Service, and agree to be bound by them.
          </p>
          <p>
            These terms apply to all visitors, users, and anyone else who accesses TryFinCalc. 
            If you are using TryFinCalc on behalf of an organisation, you represent that you have 
            the authority to bind that organisation to these terms.
          </p>

          {/* 2. Use of the Site */}
          <h2 id="use-of-the-site" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">2. Use of the Site</h2>
          <p>
            TryFinCalc grants you a limited, non-exclusive, non-transferable, revocable licence to access 
            and use the website for personal, non-commercial purposes — specifically to use our financial 
            calculators, read our guides and articles, and make informed personal financial decisions.
          </p>

          <p>You may not:</p>
          <ul>
            <li>Copy, reproduce, or redistribute our calculators, tools, or content for commercial purposes without our express written permission</li>
            <li>Use automated tools, bots, or scrapers to access or extract content from TryFinCalc</li>
            <li>Attempt to reverse engineer, decompile, or extract the source code of our calculators</li>
            <li>Use TryFinCalc in any way that violates applicable laws or regulations</li>
            <li>Reproduce substantial portions of our articles or guides without attribution</li>
            <li>Frame or mirror TryFinCalc on another website without our prior written consent</li>
          </ul>
          <p>
            We reserve the right to terminate or restrict your access to TryFinCalc at any time, 
            without notice, if we believe you have violated these terms.
          </p>

          {/* 3. No Financial Advice */}
          <h2 id="no-financial-advice" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">3. No Financial Advice</h2>
          <p className="font-bold">This is the most important section of these terms. Please read it carefully.</p>
          <p>
            TryFinCalc provides financial calculators and educational content for informational purposes 
            only. Nothing on this website constitutes financial advice, investment advice, legal 
            advice, tax advice, or any other professional advice.
          </p>
          <p>Specifically:</p>
          <ul>
            <li>
              The results produced by our calculators are estimates based on the inputs you provide and 
              standard financial formulas. They are intended to help you understand the approximate financial 
              impact of different scenarios — not to provide exact figures for contractual, legal, or investment purposes.
            </li>
            <li>
              The articles and guides on TryFinCalc are educational in nature. They represent general 
              information about financial concepts and are not tailored to your individual financial 
              situation, goals, risk tolerance, or circumstances.
            </li>
          </ul>
          <p>
            Before making any significant financial decision — including but not limited to taking 
            out a mortgage, refinancing a loan, purchasing a home, or making an investment — you should 
            consult with a qualified and licenced financial advisor, mortgage broker, or other appropriate 
            professional in your jurisdiction.
          </p>
          <p>
            TryFinCalc is not a bank, lender, mortgage broker, financial advisor, or regulated 
            financial services firm. We are not authorised or regulated by the Financial Industry 
            Regulatory Authority (FINRA), the Securities and Exchange Commission (SEC), the Financial 
            Conduct Authority (FCA), or any other financial regulatory body.
          </p>

          {/* 4. Calculator Accuracy */}
          <h2 id="calculator-accuracy" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">4. Calculator Accuracy</h2>
          <p>
            We work to ensure our calculators use industry-standard financial formulas and 
            produce accurate results. However, we make no warranty — express or implied — as to 
            the accuracy, completeness, or reliability of any calculator output.
          </p>
          <p>
            Calculator results may differ from actual lender quotes due to factors including but 
            not limited to: lender-specific fees and charges not reflected in our inputs, 
            differences in how lenders compound interest, local taxes and insurance costs that vary 
            by region, and changes in market rates between the time of calculation and the 
            time of application.
          </p>
          <p>Always verify calculator results with your actual lender before making financial commitments.</p>
          <p>
            Interest rate data referenced in our guides and articles reflects general market 
            conditions at the time of writing and may not reflect current rates. Always obtain 
            current rate quotes directly from lenders.
          </p>

          {/* 5. Intellectual Property */}
          <h2 id="intellectual-property" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">5. Intellectual Property</h2>
          <p>
            All content on TryFinCalc — including but not limited to text, articles, guides, calculator 
            interfaces, code, graphics, logos, and the TryFinCalc name and brand — is owned by or 
            licenced to TryFinCalc and is protected by applicable copyright, trademark, and 
            intellectual property laws.
          </p>
          <p>
            You may share links to TryFinCalc articles and pages freely. You may quote brief excerpts 
            (under 50 words) from our content with clear attribution and a link back to the original 
            page. You may not reproduce full articles, guides, or calculator interfaces without our 
            express written permission.
          </p>
          <p>
            If you believe any content on TryFinCalc infringes your intellectual property rights, 
            please contact us at <a href="mailto:hello@tryfincalc.com" className="text-primary hover:underline">hello@tryfincalc.com</a> 
            with details of your claim.
          </p>

          {/* 6. User Conduct */}
          <h2 id="user-conduct" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">6. User Conduct</h2>
          <p>By using TryFinCalc you agree not to:</p>
          <ul>
            <li>Use the site for any unlawful purpose or in violation of any applicable regulations</li>
            <li>Attempt to gain unauthorised access to any part of the website or its underlying systems</li>
            <li>Transmit any viruses, malware, or harmful code through the website</li>
            <li>Engage in any conduct that could damage, disable, or impair the website or its servers</li>
            <li>Use the website to harass, abuse, or harm any person</li>
            <li>Attempt to circumvent any security measures or access controls</li>
          </ul>
          <p>We reserve the right to report any unlawful activity to appropriate law enforcement authorities.</p>

          {/* 7. Third-Party Links and Content */}
          <h2 id="third-party-links" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">7. Third-Party Links and Content</h2>
          <p>
            TryFinCalc contains links to third-party websites including government sources such 
            as the Consumer Financial Protection Bureau (<a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">consumerfinance.gov</a>), 
            the Federal Reserve (<a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">federalreserve.gov</a>), 
            and HUD (<a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">hud.gov</a>), 
            as well as other external resources referenced in our articles.
          </p>
          <p>
            These links are provided for your convenience and informational purposes only. 
            TryFinCalc does not endorse, control, or take responsibility for the content, privacy 
            practices, or accuracy of any third-party website. Visiting third-party links is at 
            your own risk and subject to those websites&apos; own terms and privacy policies.
          </p>

          {/* 8. Advertising */}
          <h2 id="advertising" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">8. Advertising</h2>
          <p>
            TryFinCalc may display advertisements served by Google AdSense and potentially other 
            advertising partners. These advertisements are served by third parties and are not 
            endorsed or verified by TryFinCalc.
          </p>
          <p>
            Advertisements displayed on TryFinCalc are clearly distinguished from editorial content. 
            The presence of an advertisement does not constitute a recommendation or endorsement 
            of the advertised product or service by TryFinCalc.
          </p>
          <p>
            Where TryFinCalc includes affiliate links to financial products or services, this 
            will be clearly disclosed in accordance with applicable advertising standards and 
            FTC guidelines. Clicking affiliate links may result in TryFinCalc receiving 
            compensation. This does not affect the editorial independence of our content or 
            the accuracy of our calculators.
          </p>

          {/* 9. Limitation of Liability */}
          <h2 id="limitation-of-liability" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, TryFinCalc and its operators shall not 
            be liable for any direct, indirect, incidental, special, consequential, or punitive damages 
            arising from:
          </p>
          <ul>
            <li>Your use of or inability to use TryFinCalc</li>
            <li>Any financial decisions made in reliance on calculator results or site content</li>
            <li>Errors or inaccuracies in calculator outputs</li>
            <li>Interruptions or unavailability of the website</li>
            <li>Any third-party content or services accessed through links on TryFinCalc</li>
            <li>Unauthorised access to or alteration of your data</li>
          </ul>
          <p>
            This limitation applies whether the claim is based on warranty, contract, tort (including negligence), 
            or any other legal theory, even if TryFinCalc has been advised of the possibility of such damages.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of incidental or consequential 
            damages. In such jurisdictions, our liability is limited to the maximum extent permitted by law.
          </p>

          {/* 10. Indemnification */}
          <h2 id="indemnification" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">10. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless TryFinCalc and its operators from 
            and against any claims, liabilities, damages, losses, and expenses — including reasonable 
            legal fees — arising out of or in any way connected with your access to or use of 
            TryFinCalc, your violation of these Terms of Service, or your violation of any third party&apos;s rights.
          </p>

          {/* 11. Disclaimer of Warranties */}
          <h2 id="disclaimer-of-warranties" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">11. Disclaimer of Warranties</h2>
          <p>TryFinCalc is provided on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties of any kind, either express or implied.</p>
          <p>
            To the fullest extent permitted by law, TryFinCalc disclaims all warranties including implied warranties 
            of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that 
            the website will be uninterrupted, error-free, or free of viruses or other harmful components. 
            We do not warrant the accuracy, completeness, or usefulness of any information on the website.
          </p>

          {/* 12. Governing Law */}
          <h2 id="governing-law" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">12. Governing Law</h2>
          <p>
            These Terms of Service and any dispute arising from your use of TryFinCalc shall be governed 
            by and construed in accordance with applicable law. For users in the European Union, nothing 
            in these terms limits your rights under mandatory consumer protection laws in your 
            country of residence.
          </p>
          <p>
            If any provision of these terms is found to be unenforceable or invalid, that provision 
            will be limited or eliminated to the minimum extent necessary, and the remaining provisions 
            will continue in full force and effect.
          </p>

          {/* 13. Changes to These Terms */}
          <h2 id="changes-to-terms" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">13. Changes to These Terms</h2>
          <p>
            We reserve the right to update or modify these Terms of Service at any time. When we 
            make material changes, we will update the &quot;Last updated&quot; date at the top of this page.
          </p>
          <p>
            Your continued use of TryFinCalc after changes are posted constitutes your acceptance 
            of the updated terms. We encourage you to review these terms periodically. 
            If you do not agree to the updated terms, please discontinue use of TryFinCalc.
          </p>

          {/* 14. Contact Us */}
          <h2 id="contact" className="text-2xl font-manrope font-bold text-primary mt-12 mb-4 scroll-mt-24">14. Contact Us</h2>
          <p>If you have questions about these Terms of Service or wish to report a violation, please contact us:</p>
          <p className="font-medium text-on-surface">
            TryFinCalc<br />
            Email: <a href="mailto:hello@tryfincalc.com" className="text-primary hover:underline">hello@tryfincalc.com</a><br />
            Website: <a href="https://tryfincalc.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tryfincalc.com</a>
          </p>
          <p>We aim to respond to all inquiries within 2 business days.</p>
        </div>
      </div>
    </MainLayout>
  );
}
