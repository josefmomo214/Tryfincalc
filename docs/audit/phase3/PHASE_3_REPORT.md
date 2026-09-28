# Phase 3 report — 2026-09-21

## Starting point

- Branch: `fix/adsense-third-application`
- HEAD: `539aba3`
- Phase 3 resumed from the existing uncommitted working tree. Phase 2 was not restarted or rewritten.
- No commit, push, merge, deployment, or remote configuration change was performed.

The pre-change Phase 3 crawl is preserved under `docs/audit/phase3/baseline/`. The final local production crawl is under `docs/audit/phase3/final/`.

## Completed work

### Proven 400k / 6.5% route

- Removed the repository redirect from `/calculator/400k-mortgage-monthly-payment-6-5-percent` to `/mortgage-calculator`.
- Added a substantive USD scenario backed by the shared amortization code: $400,000 principal, 6.5% example annual rate, 30-year term, $2,528.27 monthly principal and interest, $510,177.95 total interest, and $910,177.95 total paid.
- Added a prefilled editable mortgage calculator, assumptions and exclusions, rate/term sensitivity, FAQs, and internal links from the mortgage tool and 400k article.
- The restored URL returns local HTTP 200, has a self-canonical, one H1, FAQ/Breadcrumb structured data, and 14 distinct internal source pages in the final crawl.

### Canonical USD/EUR routing and traffic protection

- Removed Next.js i18n routing because `usd` and `eur` represented display currency rather than language and generated duplicate ordinary pages.
- Ordinary content now has one unprefixed canonical URL. Legacy `/usd/*` and non-scenario `/eur/*` requests return 308 to that URL while recording the selected display currency in a cookie.
- EUR scenarios have a dedicated `/eur/calculator/[slug]` route. USD scenarios remain under `/calculator/[slug]`.
- Each static generator now prerenders only the scenarios owned by its currency. This fixes the Next.js 16 build failure caused by returning redirects from `getStaticProps` for explicitly prerendered cross-currency paths.
- All 31 previously reachable cross-currency scenario permutations now have exact permanent redirects to their canonical route instead of returning 404.
- Similar-scenario links stay within the current currency. Representative EUR pages now have five internal source pages in the crawl instead of zero.
- Removed incorrect currency `hreflang` alternates; USD/EUR are not language translations.

### Sitemap and `lastmod`

- Centralized canonical static, article, and scenario paths in `src/lib/route-registry.ts` and made `next-sitemap` consume those sources explicitly.
- Sitemap contains 79 canonical, indexable URLs. Contact, privacy, terms, search, redirect sources, and duplicate currency paths are excluded.
- Disabled build-time blanket `lastmod` values. Only the substantively updated 400k/6.5% page declares the evidenced `2026-09-21` date.
- Final crawl: zero non-200 sitemap URLs and zero sitemap URLs with `noindex`.

### Blog discovery

- Removed client-only pagination from the blog archive. Every published article link is present in server-rendered HTML.
- Blog article static paths are generated once, without currency variants.

### Social assets and structured data

- Added `public/og-image.png` at 1200 × 630 and its editable SVG source.
- Open Graph and Twitter image URLs are absolute and point to the new PNG. Twitter tags use `name=`, not `property=`.
- Organization and Article publisher logos use the existing reachable `logo-high-res.png`.
- Article structured data matches the visible author, Youssef Aaouam, and no longer invents publication or modification dates.
- Added `WebApplication` structured data to the monthly-payment and total-interest calculators, completing the calculator coverage identified by the baseline.

## Verification evidence

| Check | Result |
| --- | --- |
| `git diff --check` | Exit 0 |
| `npm test` | 47 passed, 0 failed |
| `npx tsc --noEmit` | Exit 0 |
| `npm run lint` | Exit 0; 30 pre-existing warnings, 0 errors |
| `npm run build` | Exit 0; 85 static/SSG pages generated; `next-sitemap` completed |
| Production browser currency flow | EUR after redirect and reload; USD after switch and reload |
| Production browser console | 0 errors; 0 hydration messages |
| EUR scenario navigation | `/eur/calculator/200k-…-eur` linked to and reached `/eur/calculator/150k-…-eur` |
| Final local crawl | 262 probes: 87 HTTP 200, 173 HTTP 308, 2 HTTP 404 |
| Sitemap | 79 URLs; 0 non-200; 0 `noindex` |
| Link and asset audit | 0 broken anchor destinations; 0 referenced missing assets; 0 placeholder routes |

The two remaining crawl 404s are deliberate legacy probes for `/logo.png` and `/og-image.jpg`. Neither path is referenced by current HTML or metadata. `/logo-high-res.png` and `/og-image.png` both return 200.

Targeted local HTTP results:

- `/calculator/400k-mortgage-monthly-payment-6-5-percent` → 200.
- `/usd/mortgage-calculator` → 308 `/mortgage-calculator`, with USD preference cookie.
- `/eur/mortgage-calculator` → 308 `/mortgage-calculator`, with EUR preference cookie.
- `/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur` → 200.
- `/calculator/200k-mortgage-monthly-payment-3-5-percent-eur` → 308 to the EUR canonical.
- `/eur/calculator/300k-mortgage-monthly-payment-6-percent` → 308 to the USD canonical.
- `/blog`, `/og-image.png`, `/logo-high-res.png`, and `/sitemap.xml` → 200.

### Browser follow-up — 2026-09-22

- In a clean Chrome profile against the rebuilt production server, `/eur/mortgage-calculator` returned a 308 to `/mortgage-calculator`, set `tryfincalc_currency=EUR`, and displayed euro field labels and results both before and after reload.
- Switching to USD updated the cookie, field labels and calculated results to dollars; those values remained in USD after the next reload.
- Clicking the visible `€150,000 Mortgage` related-scenario link from the `€200,000` EUR scenario reached the corresponding `/eur/calculator/…-eur` route.
- CookieYes previously raised a console exception on localhost because the registered production-domain script was injected on `127.0.0.1`. Its loader is now host-gated to `tryfincalc.com` and `www.tryfincalc.com`; a red/green regression test covers both public and local hosts.
- The final full browser journey reported no console errors and no hydration messages.

## Hosting-only observations

Read-only checks against the currently deployed site identify Hostinger/hcdn from response headers:

- `http://tryfincalc.com` and `http://www.tryfincalc.com` receive a Hostinger `301` HTTPS upgrade before Next.js. This redirect is imposed by hosting and is not controlled by this repository.
- `https://www.tryfincalc.com` currently returns 200 rather than redirecting to `https://tryfincalc.com`. Repository canonicals point to the apex, but the host-level `www` redirect must be configured in Hostinger/DNS/CDN settings if a single-host redirect is required.
- The deployed 400k behavior remains unchanged until this uncommitted work is reviewed and deployed; no deployment was performed in Phase 3.

## Non-blocking warnings and remaining external work

- ESLint reports 30 existing warnings but no errors. The stale `scratch/` audit utilities are excluded from the application lint target; application and test files remain linted.
- Next.js warns about a second lockfile at `/Users/josef214/package-lock.json`, outside this repository, and therefore infers a broader workspace root.
- Browserslist reports that its local `caniuse-lite` data is six months old.
- Google Search Console recrawl/indexing, structured-data validation against the deployed URLs, Hostinger host redirects, and final deployed verification remain external follow-up work.
