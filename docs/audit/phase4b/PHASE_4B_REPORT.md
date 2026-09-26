# Phase 4B report — remaining pSEO inventory

Date: 2026-09-26
Branch: `fix/adsense-third-application`
Starting HEAD: `f46571c`

## Outcome

Phase 4B leaves no undifferentiated scenario in this inventory indexable. Six remaining scenarios now provide distinct, finance-derived decisions; twelve unproven scenarios remain reachable at HTTP 200 with `noindex, follow`; six overlapping `income-required` routes permanently redirect to one new canonical calculator at `/income-needed-for-a-house`.

The editorial decision is centralized in the typed `src/lib/pseo-publication.ts` source and is consumed by rendered robots metadata, sitemap generation, redirects, related-scenario discovery, and rendered contextual links. No article was consolidated. Article edits are limited to replacing four internal legacy-route anchors with the new canonical destination.

## Final URL disposition

### Six retained and improved scenarios

| URL | Final disposition |
| --- | --- |
| `/calculator/350k-mortgage-monthly-payment-6-5-percent` | HTTP 200, indexable, self-canonical, in sitemap |
| `/calculator/700k-mortgage-monthly-payment-7-percent` | HTTP 200, indexable, self-canonical, in sitemap |
| `/calculator/20k-loan-monthly-payment-10-percent` | HTTP 200, indexable, self-canonical, in sitemap |
| `/calculator/how-much-house-can-i-afford-70k-salary` | HTTP 200, indexable, self-canonical, in sitemap |
| `/calculator/how-much-house-can-i-afford-90k-salary` | HTTP 200, indexable, self-canonical, in sitemap |
| `/eur/calculator/250k-mortgage-monthly-payment-3-5-percent-eur` | HTTP 200, indexable, self-canonical, in sitemap |

### Twelve scenarios held for later review

Each route below remains HTTP 200 and self-canonical, emits `noindex, follow`, is absent from the sitemap, and is absent from hubs and rendered scenario-discovery links. None is blocked by `robots.txt`.

| URL | Final disposition |
| --- | --- |
| `/calculator/250k-mortgage-monthly-payment-3-5-percent` | `noindex, follow` |
| `/calculator/400k-mortgage-monthly-payment-4-percent` | `noindex, follow` |
| `/calculator/10k-personal-loan-repayment-10-percent` | `noindex, follow` |
| `/calculator/25k-personal-loan-repayment-8-percent` | `noindex, follow` |
| `/calculator/5k-loan-monthly-payment-12-percent` | `noindex, follow` |
| `/calculator/15k-loan-monthly-payment-10-percent` | `noindex, follow` |
| `/calculator/how-much-house-can-i-afford-50k-salary` | `noindex, follow` |
| `/calculator/how-much-house-can-i-afford-60k-salary` | `noindex, follow` |
| `/calculator/how-much-house-can-i-afford-100k-salary` | `noindex, follow` |
| `/eur/calculator/150k-mortgage-monthly-payment-3-5-percent-eur` | `noindex, follow` |
| `/eur/calculator/350k-mortgage-monthly-payment-3-5-percent-eur` | `noindex, follow` |
| `/eur/calculator/400k-mortgage-monthly-payment-3-5-percent-eur` | `noindex, follow` |

### Consolidated income-required routes

| Old URL | Final disposition |
| --- | --- |
| `/calculator/income-required-for-200k-house` | permanent HTTP 308 → `/income-needed-for-a-house` |
| `/calculator/income-required-for-300k-house` | permanent HTTP 308 → `/income-needed-for-a-house` |
| `/calculator/income-required-for-400k-house` | permanent HTTP 308 → `/income-needed-for-a-house` |
| `/calculator/income-required-for-500k-house` | permanent HTTP 308 → `/income-needed-for-a-house` |
| `/calculator/income-required-for-600k-house` | permanent HTTP 308 → `/income-needed-for-a-house` |
| `/calculator/income-required-for-700k-house` | permanent HTTP 308 → `/income-needed-for-a-house` |

All six redirect sources are absent from the sitemap and internal anchors. Their existing slugs remain redirect sources; they were neither renamed nor deleted.

### New canonical page

`/income-needed-for-a-house` is HTTP 200, indexable, self-canonical, present in the sitemap, and has one H1 plus WebApplication, breadcrumb, and FAQ structured data. Its server-rendered initial state uses a $400,000 target price, $110,000 selected income, $500 monthly debt, $80,000 down payment, 6.5% nominal annual rate, 30-year term, $400 monthly property tax, and $150 monthly insurance. The resulting illustrative annual income is **$110,255** before hydration.

The editable form exposes all eight inputs with associated labels and accessible error state. Its $200,000–$700,000 table has three explicitly labeled mathematical scenarios and is generated through `calculateIncomeRequired`, which in turn uses the shared amortization calculation. The page states its inclusions, exclusions, selected 28%/36% planning ratios, and lack of any approval guarantee.

## Six retained pages: before → after

| URL | Before | After and distinct value |
| --- | --- | --- |
| `/calculator/350k-mortgage-monthly-payment-6-5-percent` | Generic scenario content without an editable matching initial state or a focused term/rate decision. | Answers **$2,212.24/month** for a $350,000 principal, 6.5% selected nominal annual rate and 30 years. The prefilled calculator matches SSR. Shared calculations compare 15/30-year terms and 5.5%/6.5%/7.5% rates, separating payment from total scheduled interest and listing excluded ownership and transaction costs. |
| `/calculator/700k-mortgage-monthly-payment-7-percent` | Generic large-mortgage content without a distinct monthly-cash-flow versus cumulative-interest decision. | Answers **$4,657.12/month** for a $700,000 principal at a selected 7% annual rate over 30 years. A finance-derived 15/20/30-year comparison frames monthly capacity against cumulative interest without claiming one term is universally preferable. |
| `/calculator/20k-loan-monthly-payment-10-percent` | Generic loan copy without a matching editable calculator or a clearly separated fee/APR boundary. | Answers **$424.94/month** for a $20,000 principal, selected 10% nominal annual note rate and five years. The generated 3/5/7-year comparison explains payment versus total scheduled interest, and states that excluded fees can make a real APR differ from the note rate. |
| `/calculator/how-much-house-can-i-afford-70k-salary` | A generic salary permutation that did not show when monthly debt becomes binding. | Answers **$226,056** under the displayed salary, down payment, rate, term, tax, insurance and selected 28%/36% planning ratios. The generated $0/$400/$800/$1,200 monthly-debt sensitivity shows when the total-debt example overtakes the housing example. It does not predict lender approval. |
| `/calculator/how-much-house-can-i-afford-90k-salary` | A generic salary permutation without a distinct down-payment-versus-rate decision. | Answers **$295,368** under explicit inputs. Generated comparisons separate $0/$30,000/$60,000 down-payment effects from selected 5.8%/6.8%/7.8% rate effects, with costs and underwriting exclusions stated. |
| `/eur/calculator/250k-mortgage-monthly-payment-3-5-percent-eur` | A generic euro scenario without a matching editable initial result or a jurisdiction-neutral term/principal decision. | Answers **€1,251.56/month** for a €250,000 property price and principal, selected 3.5% annual rate and 25 years. Generated term and 0%/10%/20% deposit comparisons separate repayment horizon from amount borrowed, avoid US-only vocabulary, and make no paneuropean lending claim. |

All new Phase 4B results and comparison tables on these six pages and the consolidated page are generated from shared functions in `src/lib/finance.ts` through the existing content-calculation helpers; no financial formula was duplicated.

## Phase 4A protections

The following seven validated pages remain indexable, self-canonical, in the sitemap, and retain their protected initial results:

- `/calculator/400k-mortgage-monthly-payment-6-5-percent` — **$2,528.27**
- `/calculator/300k-mortgage-monthly-payment-6-percent` — **$1,798.65**
- `/calculator/how-much-house-can-i-afford-80k-salary` — **$261,479**
- `/calculator/30k-loan-monthly-payment-9-percent` — **$622.75**
- `/calculator/50k-loan-monthly-payment-8-percent` — **$779.31**
- `/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur` — **€1,001.25**
- `/eur/calculator/300k-mortgage-monthly-payment-3-5-percent-eur` — **€1,501.87**

Their source records were not rewritten. The shared rendering layer only removes discovery links to Phase 4B-excluded scenarios. During the final production crawl, two legacy USD comparison phrases still rendered on the noindex EUR 350k and 400k pages; those two phrases alone were removed, and the all-EUR regression was rerun successfully.

## Sitemap and routing invariants

- Sitemap before Phase 4B: **79 URLs**.
- Sitemap after Phase 4B: **62 URLs**.
- Net change: **−17** = one new canonical page, minus twelve noindex scenarios, minus six redirect sources.
- No other sitemap URL or eligibility decision changed.
- No unrelated slug, redirect, canonical, or indexability rule changed.
- The six retained and seven Phase 4A URLs keep their existing self-canonicals and indexability.
- The twelve held routes keep their slugs and self-canonicals but deliberately change only to `noindex, follow` and sitemap exclusion.
- The six income-required slugs change only to the requested permanent redirects.

## Verification results

### Automated suite

- Phase 4B TDD regression: initial RED covered missing editorial state, redirects, consolidated page, calculators, discovery and sitemap behavior; final focused result **9/9 passed**.
- `npm test`: final post-fix result **65 tests, 65 passed, 0 failed, 0 skipped**.
- `npx tsc --noEmit`: **pass**, no diagnostics.
- `npm run lint`: **pass**, exit 0, **0 errors and 30 existing warnings**. No warning was introduced by the Phase 4B files.
- `npm run build`: **pass** with Next.js **16.2.7**; compilation succeeded, **86/86** static pages were generated, and `next-sitemap` completed. The existing multiple-lockfile/workspace-root warning remains.
- `git diff --check`: **pass** after the report was written.

The first final crawl exposed one audit-script parsing defect (`loanTerm` is a `<select>`, not an `<input>`), which was corrected only in the temporary checker. Its next pass reproduced the two legacy USD phrases on noindex EUR pages described above. After that minimal repository correction, the full relevant test/build/crawl/browser checks were repeated on the final state.

### Targeted standalone production crawl

The final crawl against `127.0.0.1:3106` exited 0:

- **14/14 indexable pages** checked (six Phase 4B, seven Phase 4A, one new canonical): HTTP 200, self-canonical, one H1, nonzero SSR result, sitemap inclusion, and expected prefilled fields where applicable.
- **12/12 noindex pages**: HTTP 200, exact `noindex, follow`, self-canonical, absent from sitemap and discovery links.
- **6/6 legacy income routes**: permanent HTTP 308 to `/income-needed-for-a-house`, absent from sitemap.
- **6/6 EUR scenarios**: zero USD/PMI/PITI vocabulary findings in main content and zero cross-currency scenario links.
- **30 source pages / 46 unique internal destinations** checked: **0 broken links** and **0 links to noindex or redirected scenarios**.
- **0 unresolved template tokens** and **0 robots.txt blocks** affecting the noindex pages.

### Production browser verification

Because the in-app browser runtime was unavailable in this session, the approved browser procedure used local Chrome through CDP against the same standalone build. The final check exited 0.

The browser verified the six retained pages, `/income-needed-for-a-house`, the protected 400k page, four representative noindex templates, and one legacy redirect. All tested pages retained the expected hydrated result, initial fields, associated labels, canonical/indexability state and H1, with **0 application console errors, hydration errors, runtime exceptions, or network-loading failures**.

Interaction checks passed for:

- mortgage recalculation, linked error message, `aria-invalid`, keyboard submit, and focus on the invalid field;
- loan recalculation and accessible invalid state;
- salary-affordability recalculation after changing monthly debt;
- EUR deposit edit to €25,000, producing **€1,126.40** and a synchronized **10%** deposit;
- the EUR related link, which opened the retained €200,000 EUR scenario with **€1,001.25**;
- income-needed recalculation and the accessible “down payment must not exceed home price” error;
- browser navigation from the legacy 400k income route to the new canonical page.

Visual captures were inspected at `/private/tmp/phase4b-income-needed.png` and `/private/tmp/phase4b-eur250.png`.

## Files changed

- `next-sitemap.config.js`
- `next.config.ts`
- `public/sitemap.xml`
- `src/components/calculator/IncomeNeededCalculator.tsx` (new)
- `src/components/pseo/PSEOPageTemplate.tsx`
- `src/components/pseo/PSEOScenarioCalculator.tsx`
- `src/data/articles.ts` (legacy internal hrefs only)
- `src/lib/finance.ts`
- `src/lib/pseo-data.ts`
- `src/lib/pseo-publication.ts` (new)
- `src/lib/route-registry.ts`
- `src/pages/affordability-calculator.tsx`
- `src/pages/income-needed-for-a-house.tsx` (new)
- `src/pages/index.tsx`
- `src/pages/loan-calculator.tsx`
- `src/pages/mortgage-calculator.tsx`
- `tests/phase4b-pseo.test.tsx` (new)
- `docs/audit/phase4b/PHASE_4B_REPORT.md` (this report)

## Remaining limitations

- The twelve held pages intentionally remain accessible while search engines recrawl their `noindex, follow` metadata. Their later consolidation or re-publication requires new evidence and is outside Phase 4B.
- All affordability and income-needed outputs remain adjustable mathematical planning examples, not lender approval, comfort, market, or jurisdictional claims.
- The six permanent redirects were verified in the repository build and local standalone server. Redirect behavior imposed independently by a hosting provider cannot be validated from the repository.
- The 30 lint warnings and the Next.js multiple-lockfile root warning predate and remain outside this phase.
- Blog consolidation remains reserved for Phase 4C; only required internal redirect destinations were updated.

Phase 4B stops here. No commit, push, merge, deployment, AdSense action, new indexable permutation, or Phase 4C work was performed.
