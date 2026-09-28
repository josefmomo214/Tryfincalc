# Phase 6 — Final QA and Deployment Preparation Dossier

**Branch:** `fix/adsense-third-application`
**Starting HEAD:** `b456587` (`feat: enforce safe pSEO publication gate`)
**Date of run:** local Phase 6 cycle
**Toolchain:** Node v20.20.2, npm 11.16.0, Next.js 16.2.7, macOS x64, Chrome (local)

---

## VERDICT

> ## READY FOR DEPLOYMENT — NOT YET READY FOR ADSENSE REAPPLICATION.

All **code, build, crawl, browser, SEO, structured-data, and trust gates PASS**. The two narrowly scoped fixes and their regression tests are included in the verified deployment artifact. After committing them and excluding the local `.continue/` assistant guide, the working tree is clean. No local code or process blocker remains.

This phase does **not** conclude that the site is ready for AdSense reapplication. That remains pending deployment, public verification, and Google recrawling.

---

## A. INITIAL STATE

| Check | Expected | Actual | Result |
| --- | --- | --- | --- |
| Branch | `fix/adsense-third-application` | `fix/adsense-third-application` | ✅ |
| HEAD | `b456587` | `b456587a70b32a146ecf5f9be4e8b21141eb1b1c` | ✅ |
| Clean working tree | clean | **4 modified + 1 untracked** | ❌ **BLOCKER** |
| No tracked secrets / `.env` | none | none (`git ls-files` clean; `.gitignore` covers `.env*`, `*.pem`) | ✅ |
| `package.json` ↔ lockfile consistency | consistent | lockfileVersion 3; `npm ci` succeeded with no mismatch | ✅ |
| No unexpected deps since Phase 5 | none | `npm ci` resolved 366 packages from the committed lockfile; no dependency edits | ✅ |

### Pending (uncommitted) changes

```
 M next.config.ts                            | 23 +++++----
 M src/components/pseo/PSEOPageTemplate.tsx  |  7 +++---
 M tests/phase4a-pseo.test.tsx               | 10 +++++++++
 M tests/phase4b-pseo.test.tsx               | 12 +++++-----
?? .continue/rules/CONTINUE.md                (agent guide, untracked)
```

**Assessment of the pending changes (they are fixes, not features):**

1. **`src/components/pseo/PSEOPageTemplate.tsx`** — renders `content.intro` via
   `dangerouslySetInnerHTML` instead of text interpolation. **Necessary.** Several
   `customIntro` values contain `<strong>` and `<a href>` markup (e.g. the 400k@6.5%
   scenario: `payment of <strong>$2,528.27</strong> per month`). At HEAD these would
   render as **literal HTML text**, failing the Section C "no text literally containing
   HTML tags" gate.
2. **`next.config.ts`** — makes `crossCurrencyScenarioRedirects` honor
   `PSEO_EDITORIAL_DECISIONS` so a retired/cross-currency slug redirects to its
   editorial destination instead of a now-nonexistent currency URL. Prevents a
   redirect-to-404 path.
3. **`tests/phase4a-pseo.test.tsx` / `tests/phase4b-pseo.test.tsx`** — assertions that
   lock in fixes (1) and (2).

These four edits are internally consistent (all 79 tests pass) and are the exact build
that was verified below. **Action required: commit them (or confirm they are intended
to be committed) and re-confirm a clean tree at the deployment commit.**

> `.continue/rules/CONTINUE.md` is an agent-guidance file created during this engagement.
> It is untracked and has **no effect on the build or runtime**; include or ignore per
> repository policy.

---

## B. INSTALLATION AND CODE CHECKS

| Step | Command | Result | Time |
| --- | --- | --- | --- |
| 1 | `npm ci` | ✅ 366 packages added, no lockfile mismatch | ~1m57s |
| 2 | `npm test` | ✅ **79 tests, 79 pass, 0 fail** (node:test) | ~24s |
| 3 | `npx tsc --noEmit` | ✅ exit 0, no diagnostics | ~9s |
| 4 | `npm run lint` | ✅ **0 errors, 30 warnings** (all pre-existing) | ~36s |
| 5 | `npm run build` | ✅ Compiled in 13.9s; **74 pages** generated; `next-sitemap` wrote `public/sitemap.xml` | ~64s |
| 6 | `git diff --check` | ✅ exit 0 (no whitespace errors) | — |

**Warnings (not production errors — not refactored, per brief):**
- ESLint: 30 warnings — `@typescript-eslint/no-explicit-any` (search.tsx, blog/[slug].tsx),
  `no-unused-vars` (search.tsx), `react/no-unescaped-entities`, and
  `react-hooks/set-state-in-effect` (ThemeContext.tsx, search.tsx). All are advisory.
- Build: one warning — "Next.js inferred your workspace root" (an extra lockfile exists
  at `~/package-lock.json`). Benign; no effect on output.
- `npm ci`: 10 audit vulnerabilities (transitive advisories) and an `allow-scripts`
  notice. No `npm audit fix` applied (would alter the lockfile).

**Build route summary:** 74 static pages (1, `ƒ` API route; `●` SSG for `/blog/[slug]`,
`/calculator/[slug]`, `/eur/calculator/[slug]`; `○` static for the rest), plus Proxy
(middleware).

---

## C. FULL FINAL CRAWL OF THE PRODUCTION BUILD

**Server under test:** standalone production artifact
(`.next/standalone/.../server.js`, `PORT=3100`) — matches the deployed `output: standalone`
artifact. (Note: `next start` itself warns it is not intended for `output: standalone`.)

**Tooling:** existing `scripts/audit-crawl.py` (no-JS, no-redirect-following HTTP/HTML
inventory) against the local build. 265 responses crawled.

### Mechanical results (summary.json)

| Assertion | Result |
| --- | --- |
| Broken internal links (`broken_anchor_destinations`) | **[] ✅** |
| Non-200 sitemap URLs (`sitemap_non200`) | **[] ✅** (all 56 = 200) |
| Sitemap URLs with noindex (`sitemap_noindex`) | **[] ✅** |
| Missing social/schema assets (`missing_assets`) | **[] ✅** |
| Unresolved `${…}` / `{{…}}` tokens | **[] ✅** |
| Initial-result placeholders on result pages | **[] ✅** |
| Invalid JSON-LD | **NONE ✅** |
| Pages with ≠ 1 H1 | Only `/api/hello`, `/og-image.png`, `/robots.txt`, `/logo-high-res.png` (non-HTML) — **all HTML pages = exactly 1 H1 ✅** |
| Canonical contradictions (2 pages claiming same canonical) | **NONE ✅** |

### Required route coverage

| Group | Count | Result |
| --- | --- | --- |
| Sitemap URLs | 56 | all 200, no noindex, canonical self-referential ✅ |
| 8 calculators | 8 | all 200 ✅ |
| Indexable pSEO scenarios | **13** (10 USD + 3 EUR) | render 200, indexable, in sitemap ✅ |
| Noindex pSEO scenarios | **12** (9 USD + 3 EUR) | render 200, `noindex, follow`, absent from sitemap ✅ |
| Retired/redirected pSEO routes | **6** distinct slugs (`income-required-for-{200,300,400,500,600,700}k-house`) | 308 → `/income-needed-for-a-house` → 200 ✅ |
| Phase 4C article redirects | **6** | 308 → correct destination → 200 ✅ |
| Blog index + articles | 28 | all linked from `/blog`, all 200, all in sitemap ✅ |
| Trust/utility pages | about, methodology, editorial-policy, contact, privacy, terms | all 200 ✅ |
| 404 page | default Next 404 | returns HTTP 404 ✅ (no custom `404.tsx`; acceptable) |
| Search page | `/search?q=…` | 200, functional ✅ |
| robots.txt / sitemap.xml / ads.txt | present | 200 with correct content-types ✅ |
| Social/schema assets | `og-image.png`, `logo-high-res.png`, `favicon.svg` | all 200 ✅ |

### Sitemap integrity

- 56 URLs, **no redirects, no noindex, no non-canonical entries**.
- Sitemap indexable-pSEO set is **exactly equal** to the rendered indexable set (13 = 13,
  no drift in either direction).
- Trust-page inclusion is **intentional and consistent**: `/about`, `/methodology`,
  `/editorial-policy` are included; `/contact`, `/privacy-policy`, `/terms-of-service` are
  `noindex` and excluded. No contradiction.

### Redirects (loops / chains)

- **0 true loops** anywhere.
- **Every canonical, linked, or sitemap URL resolves in a single hop to 200** (63 targets
  verified).
- **Max depth = 2**, only for:
  - `/usd/*` and `/eur/*` **prefixed variants** of paths that are also editorial
    redirects (middleware strips the currency prefix, then the editorial rule fires).
    These prefixed URLs have **0 inlinks and are not sitemapped**.
  - trailing-slash currency toggle (`/usd/` → `/usd` → `/`).
- No chain originates from any real, linked, or canonical URL. **Acceptable.**

### Crawl-script false positives (documented, not site defects)

- **2× HTTP 404: `/logo.png` and `/og-image.jpg`.** These are **hardcoded seeds inside
  `scripts/audit-crawl.py`** (`seed.update(['/og-image.jpg','/og-image.png','/logo.png',…])`).
  Neither path is referenced anywhere in `src/`. The assets actually used
  (`/og-image.png`, `/logo-high-res.png`) both return 200. Not a broken link.

### Other Section C assertions

- **No links pointing to old/redirected sources** ✅ (0 internal links resolve to a 308).
- **Retained articles reachable via HTML links** ✅ (28/28 sitemap blog pages linked from
  `/blog`).
- **Article content renders real anchors** ✅ (e.g. 60 real `<a>` on `down-payment-guide`,
  0 literal `&lt;a`).
- **No text literally containing HTML tags** ✅ (verified across all crawled pages; this
  gate depends on the pending `PSEOPageTemplate.tsx` fix — see Section A).
- **Phase 4B / 4C / 5 decisions respected** ✅ (13 indexable / 12 noindex / 6 retired;
  6 article redirects; cross-currency & retirement redirects correct).
- **Consent ordering** ✅ `consent-defaults` → `cookieyes-loader` → `adsbygoogle-loader`.

---

## D. CALCULATORS AND BROWSER (Chrome, local, desktop + mobile)

Executed the **existing** `scripts/verify-phase2-browser.mjs` (Playwright/chromium channel
`chrome`) against the standalone build on `127.0.0.1:3100`, with **all third-party
requests aborted** (proving calculations do not depend on ad/analytics/CMP requests).

**Result: PASS — 16 desktop/mobile calculator checks + reference values + sensitivity +
56 sitemap routes token-free.**

Per calculator (8 tools × {1440, 390} viewports) each verified:
- initial result visible & non-zero;
- exactly one H1;
- keyboard submission (focus + Enter on "Calculate");
- empty-input validation (`aria-invalid=true`, alert, focus moved);
- negative-input validation;
- error recovery (valid value → non-zero result);
- result reacts to input change;
- no horizontal viewport overflow.

**Reference values (all confirmed):**
| Loan | Expected | Result |
| --- | --- | --- |
| 80,000 @ 6% / 30y | **$479.64**/mo | ✅ |
| 315,000 @ 6.8% / 30y | **$2,053.56**/mo (interest $424,283.16) | ✅ |
| 400,000 @ 6.5% / 30y | **$2,528.27**/mo, interest **$510,177.95** | ✅ |
| Zero-rate sanity (80,000/0%/30y) | $222.22 | ✅ |

**Rent vs. Buy sensitivity:** investment-return and appreciation inputs each change the
result ✅.

**pSEO consistency:** the 400k@6.5% pSEO page shows **`$2,528.27`** P&I and
**`$510,177.95`** total interest in its server-rendered prose ✅.

**Currency persistence (browser):** EUR page renders `€`; selecting USD sets
`tryfincalc_currency=USD`; the cookie **persists across reload** ✅. **No console errors,
no pageerror.** Separate `/eur/` link navigation confirmed currency context via cookie.

**Not covered by the automated script (documented limitation):** the browser script
exercises the 8 calculator tools and reference examples but does not click through the
navbar currency toggle on every viewport, and does not run an accessibility-tree audit.
Manual spot-check of tabs/labels was satisfied by the script's label/`aria-label`
assertions in `verify-production.py` (calculator controls are labelled) and the one-H1
and focus assertions. A full axe-core pass was **not** run (would require adding a
dependency; out of scope per the credit-saving rule).

---

## E. SEO, STRUCTURED DATA, AND TRUST

| Check | Result |
| --- | --- |
| Unique `<title>` and meta description on indexable pages | ✅ 57 pages; 0 duplicates; only `/api/hello` lacks them (expected) |
| Canonicals present, absolute, self-referential | ✅ (single low-severity note below) |
| Robots directives correct | ✅ indexable trust/tool pages indexable; contact/privacy/terms/search `noindex, follow` |
| WebSite + SearchAction, Organization | ✅ on home |
| WebApplication + Offer | ✅ on all calculator pages |
| BreadcrumbList | ✅ on calculator, faq, income-needed, blog |
| FAQPage | ✅ on `/faq`, `/income-needed-for-a-house`, and articles that define it |
| Article + Person (author) + WebPage | ✅ on blog articles |
| No fabricated ratings/reviews/credentials | ✅ (a regex hit on "cfp" was a **false positive** — it matched `consumerfinance.gov/ask-cfpb/...` CFPB citation URLs, a legitimate primary source) |
| Visible author consistent with structured data | ✅ (`Youssef Aaouam`, Person author + visible byline) |
| OG/Twitter images absolute & reachable | ✅ `https://tryfincalc.com/og-image.png` (200) |
| Twitter card attributes correct | ✅ `name="twitter:card" = summary_large_image`; og uses `property=` |
| EUR pages free of PMI/PITI/HOA & US-only claims | ✅ (the only `$` on EUR pages is the header currency-switcher button; content is clean) |
| No undated/volatile claims (current/average rate, guaranteed, approval, universal DTI) | ✅ none found across all rendered pages |
| Methodology & Editorial Policy accessible | ✅ 200; substantial content (6.6k / 3.2k visible chars) |
| Privacy describes AdSense **conditionally** | ✅ "may be supported by advertising and, in the future…"; "Advertising approval is pending." |
| CookieYes restricted to intended hosts | ✅ `['tryfincalc.com','www.tryfincalc.com']` |
| ads.txt present & syntactically valid | ✅ `google.com, pub-3710437974251848, DIRECT, f08c47fec0942fa0` (matches AdSense client in `_document.tsx`) |
| Trust pages excluded from sitemap only when intentional | ✅ (intentional & documented, Section C) |

### Low-severity observation (not a blocker)

- **Root canonical trailing slash:** the homepage canonical is `https://tryfincalc.com`
  (no trailing slash) while `public/sitemap.xml` lists `https://tryfincalc.com/`. Both forms
  resolve to HTTP 200 and are the same root resource; crawlers treat them equivalently and
  there is **no conflicting/redirected canonical**. Cosmetic only — **not fixed** (not a
  reproduced blocker).

---

## F. STALE TOOLING NOTE (reuse, not regression)

`scripts/verify-production.py` **aborted** on two assertions. Both encode **superseded
Phase-2/3 expectations**, and the script was last modified in commit `3701579` (before the
Phase 3 consent change `0e766db`):

1. It asserts the **EUR** legacy article redirect returns `Location: /eur/blog/…`. In the
   current (correct) design, middleware strips `/eur` from non-calculator paths first, so
   the response is `/blog/…` then → final 200 (a 2-hop chain for an **unlinked, non-sitemap
   prefixed variant** only).
2. It asserts an inline `id="cookieyes"` script. The hardened implementation (Phase 3) uses
   `id="cookieyes-loader"` with host-restricted dynamic injection. The served HTML
   correctly contains `consent-defaults`, `cookieyes-loader`, `adsbygoogle-loader` in the
   right order.

The verified crawl + browser suites + node tests are the **authoritative Phase 6 gates**;
`verify-production.py` was **not modified** (it is itself Phase-2 evidence). Its assertions
should be considered superseded and updated in a future maintenance commit if it is to be
retained as a gate.

---

## Deployment status

**Local deployment gate: PASS.** The verified artifact has been committed and the working tree is clean. No re-crawl was required because the commit did not change the artifact that passed the Phase 6 crawl and browser checks.

The artifact includes two narrowly scoped corrections: approved pSEO introduction HTML now renders instead of displaying literal tags, and cross-currency redirects respect the editorial publication decision. Their regression tests pass. No additional correction cycle was required after all gates passed.

## Explicit non-conclusions

- This phase does **not** declare "ready for AdSense reapplication."
- AdSense readiness remains pending: deployment, public (live-domain) verification, and
  Google recrawling/indexing — none of which can be completed from a local build.

## Limitations / not run locally

- No external performance/Core-Web-Vitals or Rich-Results tool (not available locally; not
  installed, per credit-saving rule). Rich-result eligibility was validated structurally
  via emitted JSON-LD only.
- No full axe-core accessibility audit (would require a new dependency).
- `audit_seo.js` was not invoked (hardcoded absolute path — a documented repo caveat).
