# TryFinCalc correction and verification report

## Result and repository baseline

Implemented the requested correction set directly on the existing `main` branch. No branch, commit, pull request, push, merge or deployment was created. The working tree was clean before changes; no unrelated user changes were present.

Framework: Next.js **16.2.7**, Pages Router, React 19, TypeScript, Tailwind CSS v4. Package manager: **npm**, identified from `package-lock.json`. Repository instructions and relevant installed Next.js guides were inspected before implementation. No dependencies were added.

## Implementation map

The eight routes are `src/pages/{mortgage-calculator,loan-calculator,monthly-payment-calculator,total-interest-calculator,refinancing-calculator,affordability-calculator,rent-vs-buy,amortization-schedule}.tsx`. Mortgage calculations use `MortgageCalculatorWidget`; the others own their input state. Shared tool layout/CTAs are in `CalculatorContainer`, educational headings/copy/FAQs in `CalculatorSEOSection`, fields in `Input`, and metadata in `SEOHandler`. `MainLayout` owns Header, Footer and search. Financial functions are in `src/lib/finance.ts`. Blog data and pSEO data are in `src/data/articles.ts` and `src/lib/pseo-data.ts`.

Redirects use `next.config.ts`. `next-sitemap.config.js` generates `public/sitemap.xml`; robots and ads authorization are in `public/robots.txt` and `public/ads.txt`. Global structured data, consent defaults, CookieYes and AdSense are in `_document.tsx`; GA4 loads from `_app.tsx` after hydration.

## Corrections

### Broken links and redirects

- Replaced both obsolete blog paths throughout source, including shared pSEO related links.
- Added permanent Next.js redirects to `/blog/28-36-rule-explained` and `/blog/compare-loan-offers`.
- Also repaired existing links to the mistyped `250k-personal-loan-repayment-8-percent` and nonexistent `compound-interest-explained` destinations, using the matching existing $25k scenario and total-interest guide.
- No new pSEO pages or sitemap URLs were created.

### Heading hierarchy

- Changed the shared educational H1 to H2, retaining each principal tool H1.
- Corrected skipped calculator heading levels and used H2 for the separate amortization table section.

### Amortization

- A pure schedule generator computes every monthly row from current amount, rate and term.
- Initially renders 12 payments; the accessible toggle switches between `Show full schedule` and `Show fewer payments` with `aria-expanded` and `aria-controls`.
- Added a named, keyboard-focusable scroll region, table caption and scoped column headers.
- Removed omitted-year/request-only copy and replaced questionable fixed examples with the user's actual first/final payment figures.
- The final payment clears the remaining balance; currency formatting suppresses negative zero.
- Updated homepage descriptions to match available outputs. No CSV, printing or yearly-summary feature was added.

### Financial CTAs

- Replaced live-offer, prequalification and official-rate promises with destination-specific educational or calculator actions.
- Fixed tool-opening buttons that previously led to Contact; corrected guide links and rent/buy affordability labels.
- Preserved explanatory prose about comparing lenders/rates where it makes no offer or affiliation claim.

### Calculator logic

- Preserved input units and the existing currency/rule assumptions. Fixed-rate payment math now guards invalid terms and nonfinite/negative inputs and uses a numerically stable formula.
- Empty numeric fields stay empty and produce accessible validation feedback. Invalid calculations are hidden; a down payment above the price produces an associated error and no negative principal.
- Fixed first-mount currency conversion and retained cents during currency switches. Mortgage currency changes now convert monetary scenario values consistently.
- Extracted the existing affordability, refinancing and rent/buy calculations for focused tests.
- Refinancing preserves negative savings and no longer reports zero-month break-even when there are no monthly savings.
- Rent/buy stops accruing mortgage interest after payoff and handles monthly/fractional-year horizons correctly. Existing model assumptions and exclusions are now visible.
- These principal tools recalculate on input changes; there are no dedicated submit buttons to repair.

### Navigation and interaction

- Replaced nested link/button combinations with a shared styled `ButtonLink`, including homepage, About, blog widgets and existing pSEO pages.
- Added mobile-menu expanded state, Escape closing and focus restoration; kept compact navigation at widths too narrow for the full header.
- Added search-dialog semantics, a focus trap, return focus, keyboard-focusable results, and missing search labels/combobox associations.
- Kept the existing functional six-at-a-time blog expansion; removed pointer affordances from noninteractive category labels.
- Theme content is server-visible; disabled storage no longer prevents theme initialization. Existing calculator white panels receive dark theme surfaces.
- Cookie Settings still invokes the existing CookieYes reopening function, with visible feedback if that function is unavailable.

### SEO and copy

- Kept canonical URLs and titles; made mismatched calculator/article descriptions specific to their output or educational purpose.
- Corrected `net net monthly household income`.
- FAQ JSON-LD is generated from the exact visible shared FAQ data, replacing mismatched page-local FAQ blocks.
- Regenerated the existing 79-URL sitemap; redirect sources, search/noindex, API and asset routes are excluded. Robots retains the correct sitemap reference.

### Analytics, AdSense and consent

- Preserved **G-Y84YC0NQTR** and **pub-3710437974251848**, with the existing authorized ads.txt entry.
- Moved GA4's after-interactive scripts to `_app.tsx`, removed an unsuitable fixed integrity hash on Google's changing script, and retained a single loader/configuration definition.
- Added denied advertising/analytics defaults before CookieYes/Google scripts. Removed AdSense's async attribute after production HTML showed React hoisting it ahead of the defaults; it remains a single deferred before-interactive loader.
- Kept CookieYes and its existing site ID. CookieYes owns consent updates; its GCM/dashboard configuration remains an external verification item, consistent with [CookieYes integration documentation](https://www.cookieyes.com/documentation/implementing-google-consent-mode-using-cookieyes/).
- No calculator interaction analytics were present, and no financial values or PII tracking was added.

## Tests and evidence

- `npm test`: **11 tests pass**. Tests use existing `tsx`, Node's built-in test runner and React server rendering; no testing framework was installed.
- `npx tsc --noEmit`: **pass**.
- `npm run build`: **pass**, including sitemap generation. The restricted run initially could not fetch the existing Google Fonts; the permitted network-enabled build succeeded.
- `npm run lint`: see final recorded outcome below; unrelated scratch errors are retained, not suppressed.
- `git diff --check`: **pass**.
- `npm run start -- --hostname 127.0.0.1 --port 3100`: local production server used for read-only HTTP verification; no deployment.
- `python3 scripts/verify-production.py http://127.0.0.1:3100`: final outcome recorded below.
- A source-link audit against actual page routes, article slugs and pSEO slugs found no unresolved literal internal destinations after fixes.

| Known-value case | Result | Status |
| --- | --- | --- |
| Mortgage: 400,000 principal, 6.5%, 30 years, no extra costs | 2,528.2720939718547 → **$2,528.27/month** | Pass, within $0.02 |
| Personal loan: 10,000, 8%, 36 months | 313.3636546143085 → **$313.36/month** | Pass, within $0.02 |
| Zero interest: 12,000, 12 months | **$1,000.00/month** | Pass, exact |
| Mortgage: 300,000 price, 350,000 down | Associated validation message, hidden invalid results, no negative principal/NaN/Infinity | Pass, component rendering |

Other tests cover rate/term validation, empty fields, zero-interest schedules, currency conversion, affordability inversion, refinancing fees/term changes, rent/buy past mortgage payoff, row numbering, principal reconciliation, and final zero balance. Table render tests exercise preview and expanded states for 240, 300 and 360 payments.

There is no existing browser integration/E2E suite or callable browser automation runtime in this session. Server-render/component tests verify markup and state-dependent output, not real clicks, hydration, visual layout or screen-reader behavior.

## Remaining issues and manual verification

- `scratch/audit_links.js` retains two pre-existing CommonJS `require()` ESLint errors and an obsolete absolute developer path. It is unrelated to runtime corrections and was not edited or ignored. Existing lint warnings are also reported, not suppressed.
- Next.js warns about a parent-directory lockfile influencing workspace-root detection. It also warns that standalone deployments should use their generated server instead of `next start`; the repository's existing configuration/scripts were preserved. Local HTTP verification used the existing start script.
- Existing metadata references `/og-image.jpg` and the Organization logo `/logo.png`, neither of which exists in `public`. These unrelated branding/SEO assets were left unchanged rather than inventing replacement artwork or silently changing existing image configuration.
- The fixed illustrative currency rate and existing financial-model assumptions remain; no live exchange rates or lender offers were added.
- **GA4:** confirm Realtime/DebugView delivery, consent behavior, page views and absence of duplicate runtime initialization in the private property.
- **Google Search Console:** inspect representative canonicals/indexability, submit/check sitemap and redirects, and validate structured-data eligibility. No dashboard results are claimed.
- **AdSense:** confirm publisher account/site status, ads.txt processing and policy/approval status. Source correctness does not establish approval.
- **CMP:** verify CookieYes Support GCM/TCF configuration, accept/reject/custom choices, withdrawal/reopening, blocked-script behavior, and actual EEA consent updates/cookies. Certification and dashboard settings were not verified.
- **Browsers/devices:** test hydrated calculator changes and currency toggles, schedule expansion by keyboard, blog Load More, search focus/Escape, mobile menu, dark-mode persistence, table scrolling, and contrast at desktop/mobile widths in additional browsers and physical devices.

## Exact files changed

- `next.config.ts`
- `package.json`
- `public/sitemap.xml`
- `src/components/blog/BorrowingCalculatorWidget.tsx`
- `src/components/blog/FixedVsVariableWidget.tsx`
- `src/components/calculator/CalculatorContainer.tsx`
- `src/components/calculator/CalculatorSEOSection.tsx`
- `src/components/calculator/MortgageCalculatorWidget.tsx`
- `src/components/calculator/ResultCard.tsx`
- `src/components/navigation/Footer.tsx`
- `src/components/navigation/Header.tsx`
- `src/components/navigation/SearchBar.tsx`
- `src/components/navigation/SearchOverlay.tsx`
- `src/components/pseo/PSEOPageTemplate.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/data/articles.ts`
- `src/lib/context/ThemeContext.tsx`
- `src/lib/finance.ts`
- `src/lib/pseo-data.ts`
- `src/pages/_app.tsx`
- `src/pages/_document.tsx`
- `src/pages/about.tsx`
- `src/pages/affordability-calculator.tsx`
- `src/pages/amortization-schedule.tsx`
- `src/pages/blog/[slug].tsx`
- `src/pages/blog/index.tsx`
- `src/pages/contact.tsx`
- `src/pages/index.tsx`
- `src/pages/loan-calculator.tsx`
- `src/pages/monthly-payment-calculator.tsx`
- `src/pages/mortgage-calculator.tsx`
- `src/pages/refinancing-calculator.tsx`
- `src/pages/rent-vs-buy.tsx`
- `src/pages/total-interest-calculator.tsx`
- `scripts/verify-production.py`
- `src/components/calculator/AmortizationTable.tsx`
- `tests/finance.test.ts`
- `tests/render.test.tsx`
- `VERIFICATION_REPORT.md` (this report)

## Git and suggested commit

All changes remain unstaged and uncommitted on `main`. The initial working tree was clean. The tracked diff contains 35 modified files; four new implementation/verification files and this report are untracked. The sitemap diff updates generated modification dates without publishing new URLs.

Suggested commit: `fix: validate calculators and repair amortization, navigation, SEO and consent loading`


## Resumed-session final verification — 2026-09-18

The existing uncommitted work was preserved. No additional application-code correction was needed during this final verification pass. The production build regenerated the sitemap; this report records the new verification results. No commit, push, merge, PR or deployment was performed.

### Exact command results

| Command | Exit / result |
| --- | --- |
| `npm test` | **0** — 11 passed, 0 failed |
| `npx tsc --noEmit` | **0** — no diagnostics |
| `npm run build` | **0** — production build and next-sitemap completed; 181 static pages generated |
| `npm run lint` | **1** — 2 pre-existing errors in unchanged `scratch/audit_links.js` lines 1–2; 57 warnings |
| `git diff --quiet -- scratch/audit_links.js` | **0** — confirms the scratch script has no task changes |
| `git diff --check` | **0** — no whitespace errors |
| `npm run start -- --hostname 127.0.0.1 --port 3100` | Server ready; stopped cleanly with Ctrl-C after verification (expected shutdown exit 130) |
| `python3 scripts/verify-production.py http://127.0.0.1:3100` | **0** — all HTTP/source assertions passed |

HTTP audit output:

```text
PASS: both permanent redirects, USD and EUR, with reachable destinations
PASS: 16 calculator responses, one H1 each, labels, unique metadata, canonicals, JSON-LD, scripts and initial 12-row schedule
PASS: 79 unique sitemap URLs, 118 internal destinations, core pages, robots, ads.txt and obsolete-copy checks
Browser interaction, layout, external CMP responses and private dashboards are not tested by this script.
```

Both old blog paths returned **308** to the specified replacement paths, including `/eur` variants; all redirect destinations returned **200**. All 16 calculator responses had exactly one H1 and associated input labels, including the corrected mortgage term. The 79 sitemap URLs and 118 checked internal destinations returned successfully.

The final production HTML places **consent defaults before the AdSense loader**. The loader now uses Next.js deferred loading without the hoisted async attribute. AdSense, CookieYes and consent defaults appear once each; the loaded application bundles contain exactly one GA4 loader and initialization definition. The GA4 and AdSense IDs remain unchanged. This verifies emitted HTML/bundles, not live Google network activity or private CMP configuration.

Canonical tags, unique principal-page metadata, parseable JSON-LD, robots, ads.txt, obsolete-link/typo removal and CTA checks passed. The initial production amortization table has 12 rows. Component tests confirm that expanded state renders all 240/300/360 calculated payments, numbered correctly, and final balances are zero; the actual browser button click still requires manual confirmation.

Fresh calculation outputs:

- Mortgage: `2528.2720939718547` → **$2,528.27**.
- Personal loan: `313.3636546143085` → **$313.36**.
- Zero-interest loan: `1000` → **$1,000.00**, exact.

### File classification and artifact disposition

- **Intended tracked task changes:** all 35 modified files in the exact `git diff --stat` below; no unrelated modified files were found.
- **Intended new source:** `src/components/calculator/AmortizationTable.tsx` — keep and include with the correction.
- **Reusable untracked verification files:** `tests/finance.test.ts`, `tests/render.test.tsx`, `scripts/verify-production.py` — keep and include with the correction.
- **Untracked report:** `VERIFICATION_REPORT.md` — keep for review; including it in the eventual commit is optional.
- **Pre-existing/unrelated:** `scratch/audit_links.js` is unchanged. Its errors are not introduced by this task. No pre-existing unrelated uncommitted changes were found on resumption.
- **Ignored local artifacts:** `.next/`, `node_modules/`, `next-env.d.ts`, `tsconfig.tsbuildinfo` — leave ignored and do not commit.
- **Temporary logs outside the repository:** `/tmp/tryfin-final-tests.log`, `/tmp/tryfin-final-types.log`, `/tmp/tryfin-final-lint.log`, `/tmp/tryfin-final-build.log`, `/tmp/tryfin-final-production.log`, plus earlier `/tmp/tryfin-*` working files. Keep while reviewing; they can be removed afterward. They are not repository changes. No files were automatically deleted during this resumed verification.

### Remaining limitations and review readiness

No task-specific test, build, type-check, HTTP or diff-check failures remain. Full-repository ESLint remains nonzero solely because of the two documented scratch-file errors; warnings are not suppressed. The existing workspace-root/standalone-start warnings and missing legacy SEO image assets described above remain unchanged.

Browser click/keyboard/layout checks and GA4, Search Console, AdSense and CookieYes dashboard checks remain manual. No dashboard, approval or certification status is claimed.

**The local changes are ready for your review before committing and pushing, with the documented pre-existing lint errors and manual-verification limitations.**

### `git status --short`

```text
 M next.config.ts
 M package.json
 M public/sitemap.xml
 M src/components/blog/BorrowingCalculatorWidget.tsx
 M src/components/blog/FixedVsVariableWidget.tsx
 M src/components/calculator/CalculatorContainer.tsx
 M src/components/calculator/CalculatorSEOSection.tsx
 M src/components/calculator/MortgageCalculatorWidget.tsx
 M src/components/calculator/ResultCard.tsx
 M src/components/navigation/Footer.tsx
 M src/components/navigation/Header.tsx
 M src/components/navigation/SearchBar.tsx
 M src/components/navigation/SearchOverlay.tsx
 M src/components/pseo/PSEOPageTemplate.tsx
 M src/components/ui/Button.tsx
 M src/components/ui/Input.tsx
 M src/data/articles.ts
 M src/lib/context/ThemeContext.tsx
 M src/lib/finance.ts
 M src/lib/pseo-data.ts
 M src/pages/_app.tsx
 M src/pages/_document.tsx
 M src/pages/about.tsx
 M src/pages/affordability-calculator.tsx
 M src/pages/amortization-schedule.tsx
 M src/pages/blog/[slug].tsx
 M src/pages/blog/index.tsx
 M src/pages/contact.tsx
 M src/pages/index.tsx
 M src/pages/loan-calculator.tsx
 M src/pages/monthly-payment-calculator.tsx
 M src/pages/mortgage-calculator.tsx
 M src/pages/refinancing-calculator.tsx
 M src/pages/rent-vs-buy.tsx
 M src/pages/total-interest-calculator.tsx
?? VERIFICATION_REPORT.md
?? scripts/
?? src/components/calculator/AmortizationTable.tsx
?? tests/
```

### `git diff --stat`

```text
 next.config.ts                                     |   2 +
 package.json                                       |   3 +-
 public/sitemap.xml                                 | 158 ++++++++---------
 src/components/blog/BorrowingCalculatorWidget.tsx  |   8 +-
 src/components/blog/FixedVsVariableWidget.tsx      |  10 +-
 src/components/calculator/CalculatorContainer.tsx  |   6 +-
 src/components/calculator/CalculatorSEOSection.tsx |  18 +-
 .../calculator/MortgageCalculatorWidget.tsx        |  89 ++++++----
 src/components/calculator/ResultCard.tsx           |   2 +-
 src/components/navigation/Footer.tsx               |   7 +-
 src/components/navigation/Header.tsx               |  32 +++-
 src/components/navigation/SearchBar.tsx            |  13 +-
 src/components/navigation/SearchOverlay.tsx        |  37 +++-
 src/components/pseo/PSEOPageTemplate.tsx           |  18 +-
 src/components/ui/Button.tsx                       |  32 ++--
 src/components/ui/Input.tsx                        |  14 +-
 src/data/articles.ts                               |  64 +++----
 src/lib/context/ThemeContext.tsx                   |  13 +-
 src/lib/finance.ts                                 |  80 ++++++++-
 src/lib/pseo-data.ts                               |   8 +-
 src/pages/_app.tsx                                 |  10 +-
 src/pages/_document.tsx                            |  30 ++--
 src/pages/about.tsx                                |  22 +--
 src/pages/affordability-calculator.tsx             | 131 +++++---------
 src/pages/amortization-schedule.tsx                | 190 +++++----------------
 src/pages/blog/[slug].tsx                          |   6 +-
 src/pages/blog/index.tsx                           |  10 +-
 src/pages/contact.tsx                              |   2 +-
 src/pages/index.tsx                                |  18 +-
 src/pages/loan-calculator.tsx                      |  94 ++++------
 src/pages/monthly-payment-calculator.tsx           |  50 +++---
 src/pages/mortgage-calculator.tsx                  |  51 ++----
 src/pages/refinancing-calculator.tsx               | 130 ++++++--------
 src/pages/rent-vs-buy.tsx                          | 158 ++++++-----------
 src/pages/total-interest-calculator.tsx            |  48 +++---
 35 files changed, 720 insertions(+), 844 deletions(-)
```

`git diff --stat` excludes the five untracked files listed above. All changes remain unstaged on `main`.

Recommended commit message: `fix: validate calculators and repair amortization, navigation, SEO and consent loading`
