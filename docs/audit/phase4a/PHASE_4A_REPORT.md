# Phase 4A report — six priority pSEO scenarios

Date: 2026-09-26
Branch: `fix/adsense-third-application`
Implementation checkpoint: `8012220` (`wip: checkpoint Phase 4A pSEO implementation`)

## Scope and evidence

Phase 4A improves only the six existing scenario URLs selected from the historical Search Console export covering 17 June–16 September 2026. Those figures are historical, not current demand, and an absent query or URL must not be interpreted as zero demand.

No new indexable permutation, consolidation, mass `noindex`, redirect rule, article change, market claim, lender criterion, author identity, or publication date was added. The new copy stays with adjustable mathematical assumptions, so no new market or regulatory claim required a jurisdiction-specific external source.

## Per-page before → after

| Existing URL | Before | After, assumptions and distinct user value |
| --- | --- | --- |
| `/calculator/300k-mortgage-monthly-payment-6-percent` | Generic scenario copy and a static comparison, without an editable scenario calculator or a clear explanation of declining-balance interest. | Answers **$1,798.65/month** near the top for a **$300,000 principal**, **6% nominal annual rate**, **30-year term**, principal and interest only. The editable calculator opens with the same values and result. A finance-derived first-payment explanation shows **$1,500.00 interest** and **$298.65 principal**, then contrasts 15 and 30 years. Tax, insurance, fees, maintenance and other ownership costs are explicitly excluded unless entered. |
| `/calculator/how-much-house-can-i-afford-80k-salary` | Generic affordability guidance did not expose the assumptions responsible for the answer or let the reader test them in place. | Answers **$261,479** under selected examples: **$80,000/year** gross income, **$0 monthly debt**, **$25,000 down payment**, **$225/month property tax**, **$100/month insurance**, **6.8% annual rate**, **30 years**, and illustrative **28%/36%** planning ratios. The editable calculator and comparison show sensitivity to debt (**$220,575**), down payment (**$286,479**), rate (**$239,159**), tax (**$246,140**) and insurance (**$249,975**). The page states that these are user-selected planning examples, not lender rules or an approval prediction. |
| `/calculator/50k-loan-monthly-payment-8-percent` | A generic loan page did not answer the payment-versus-total-cost decision with an editable initial state. | Answers **$779.31/month** for a **$50,000 principal**, **8% nominal annual note rate**, **7 years**. A finance-derived 5/7/10-year comparison presents both payment and total paid: **$1,013.82 / $60,829.18**, **$779.31 / $65,462.10**, and **$606.64 / $72,796.56**. Fees are excluded, so the selected note rate is expressly not presented as APR. |
| `/calculator/30k-loan-monthly-payment-9-percent` | The content overlapped the generic loan pattern and did not frame a separate decision. | Frames the distinct decision as term versus total interest for a **$30,000 principal** at a **9% nominal annual note rate**. The editable 5-year answer is **$622.75/month**. The finance-derived 3/5/7-year comparison shows payments of **$953.99 / $622.75 / $482.67** and total interest of **$4,343.71 / $7,365.04 / $10,544.48**. It explains that fees can change APR and does not claim unlike products are universally comparable. |
| `/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur` | Euro output existed, but the page lacked an editable matching calculator and a jurisdiction-neutral term decision. | Answers **€1,001.25/month** for a **€200,000 property price and principal**, **3.5% annual rate**, **25 years**, principal and interest only. The finance-derived 15/20/25/30-year payments are **€1,429.77 / €1,159.92 / €1,001.25 / €898.09**. Ownership, transaction, maintenance, tax, insurance and loan-specific costs remain adjustable or excluded rather than being generalized across European jurisdictions. |
| `/eur/calculator/300k-mortgage-monthly-payment-3-5-percent-eur` | The page did not independently answer how a deposit changes the financed amount and payment. | Answers **€1,501.87/month** for a **€300,000 property price**, **€300,000 principal**, **3.5% annual rate**, **25 years**, principal and interest only. A finance-derived 0%/10%/20% deposit comparison changes principal to **€300,000 / €270,000 / €240,000** and payment to **€1,501.87 / €1,351.68 / €1,201.50**. Terminology is jurisdiction-neutral and all scenario links stay in the EUR family. |

All displayed results, tables and comparisons are generated through the shared functions in `src/lib/finance.ts`; server-rendered results equal the calculators' initial hydrated state.

## Protected scenario

`/calculator/400k-mortgage-monthly-payment-6-5-percent` retains its slug, data, intent, indexability, **$400,000 / 6.5% / 30-year** inputs and **$2,528.27** initial result. Phase 4A did not rewrite or redirect it. The only post-checkpoint change affecting its rendering makes the existing generic “Updated as of” label use an explicit `en-US` locale; this removes a reproduced server/browser hydration mismatch without changing the scenario's financial content.

## Files changed in Phase 4A

- `src/components/calculator/MortgageCalculatorWidget.tsx`
- `src/components/pseo/PSEOPageTemplate.tsx`
- `src/components/pseo/PSEOScenarioCalculator.tsx` (new)
- `src/lib/content-calculations.ts`
- `src/lib/pseo-data.ts`
- `src/pages/affordability-calculator.tsx`
- `src/pages/loan-calculator.tsx`
- `src/pages/mortgage-calculator.tsx`
- `tests/phase4a-pseo.test.tsx` (new)
- `docs/audit/phase4a/PHASE_4A_REPORT.md` (this report)

No route file, redirect configuration, route registry, sitemap configuration, article, or Phase 2 calculation/trust-copy repair was changed.

## Verification results

### Automated checks

- `npm test`: **pass**, 56 tests, 56 passed, 0 failed, 0 skipped.
- `npx tsc --noEmit`: **pass**, no diagnostics.
- `npm run lint`: **pass**, exit 0 with 0 errors and 30 existing warnings. The Phase 4A template has one existing `no-explicit-any` warning at line 293; it was not expanded in scope.
- `npm run build`: **pass** after allowing the network access required by `next/font`; Next.js 16.2.7 compiled, generated **85/85** static pages, and `next-sitemap` completed. The first sandboxed attempt could not fetch four Google Fonts and made no code change. The build still reports the existing multiple-lockfile workspace-root warning.
- Hydration-locale regression: a new test first reproduced the protected page mismatch, then the focused suite passed **9/9** after using an explicit date locale.
- Post-fix focused checks: TypeScript passed; focused ESLint passed with 0 errors and the one existing warning; `git diff --check` passed.

### Production-mode browser check

The existing Phase 4A Chrome/CDP check ran against the standalone production server at `127.0.0.1:3105` and exited 0. Each of the six target URLs plus the protected 400k URL had:

- HTTP **200** in raw SSR and the browser;
- its exact self-canonical and no `noindex`;
- exactly one H1;
- the expected nonzero result in SSR and after hydration;
- the expected prefilled inputs;
- no unresolved template token, console error, runtime exception or hydration error;
- the correct currency.

Observed initial results were **$1,798.65**, **$261,479**, **$779.31**, **$622.75**, **€1,001.25**, **€1,501.87**, and protected **$2,528.27**, respectively.

The interaction checks also passed: labels were programmatically associated; an invalid mortgage value produced a linked alert and `aria-invalid="true"`; keyboard submission focused the invalid field; Tab moved to the next field; corrected mortgage, affordability and loan values recalculated; a €30,000 deposit recalculated the EUR page to **€1,351.68**; and the rendered related-scenario link opened the €200,000 EUR scenario with **€1,001.25** and `homePrice=200000`. The EUR main content contained no USD symbol/label or US-only PMI/PITI/HOA/Homeowners terminology, and all rendered scenario links remained under `/eur/calculator/`.

The earlier production crawl of the same Phase 4A implementation found no broken internal anchors or unresolved tokens and exactly matched the Phase 3 response inventory. The only subsequent source change was the locale argument on the displayed update date, which changes no link or route.

## Routing, canonical and sitemap invariants

- Existing scenario inventory remains **31** records: **25 USD** and **6 EUR**.
- Generated sitemap remains **79 URLs**.
- The route/canonical/indexability tests pass, and the seven production pages are self-canonical and indexable.
- No slug, redirect, canonical rule, indexation status, sitemap eligibility decision, or sitemap URL inventory changed in Phase 4A.
- The protected 400k record remains the sole pSEO record with the existing `substantiveModified` value (`2026-09-21`); Phase 4A did not alter sitemap `lastmod` policy.

## Remaining limitations

- These pages are mathematical planning scenarios, not quotes, lender approvals, product comparisons or jurisdiction-specific advice. User-entered costs and actual loan fees can materially change outcomes.
- The Search Console signals are limited to the stated historical export window and should be reassessed with later data before broader inventory decisions.
- Local production checks cannot validate redirects imposed only by a hosting provider. No repository redirect change was made or required in Phase 4A.
- Broader scenario inventory review, selective consolidation/`noindex`, and overlapping article work remain explicitly outside Phase 4A.

Phase 4A stops here. No new commit, push, merge, deployment, AdSense reapplication, or later phase was performed during completion of this report.
