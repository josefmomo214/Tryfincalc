# Phase 1 — baseline and inventory

Audit date: 2026-09-20. Baseline commit: 3701579. Working tree was clean. Branch created: fix/adsense-third-application. No product behavior changed in this phase.

## Architecture and artifacts

- Next.js 16.2.7 (locked), React 19.2.4, TypeScript, Tailwind 4, npm/package-lock.json. Pages Router under src/pages. No App Router.
- Articles: src/data/articles.ts → src/pages/blog/[slug].tsx (getStaticProps, 3600-second ISR). Scenarios: src/lib/pseo-data.ts → src/pages/calculator/[slug].tsx → PSEOPageTemplate (SSG, fallback false). Ordinary pages automatically prerender with client hydration. /api/hello is an API route. No client-only route, but many results are client-effect-only.
- Currency is incorrectly used as locale: next.config.ts i18n usd/eur, Header navigation and router.locale in calculators. Each dynamic slug is generated for both locales; default locale is also accessible with /usd.
- Sitemap: next-sitemap.config.js postbuild, writes public/sitemap.xml from hard-coded ordinary routes and both content arrays. Build date used for every lastmod. robots.txt is maintained separately.
- Shared calculations: src/lib/finance.ts; additional inline calculations and hand-entered tables in widgets/content. All detected numeric/rate lines: baseline/financial-literals.csv. Exact scenario records: baseline/scenario-records.json; article metadata: baseline/article-records.json.
- SEO/schema: SEOHandler, src/lib/schema.ts, _document.tsx, page-level schemas and article structuredData. See per-route JSON/CSV for actual server output.
- Existing tests: node:test + tsx, tests/finance.test.ts and tests/render.test.tsx. Existing scripts/verify-production.py has assertions but incomplete inventory; audit_seo.js is a source scanner with a machine-specific path.
- Deployment: standalone production output in next.config.ts. No tracked deployment pipeline/provider configuration found. README's Vercel text is scaffold guidance, not proof of deployment. Live response identifies hcdn. Deployment credentials/settings not inspected.
- Added scripts/audit-crawl.py: source, locale, redirect and sitemap seeds; follows same-origin HTML anchors; records non-followed HTTP status, metadata, hreflang, canonical, H1, JSON-LD types, image URLs and distinct inbound source-page counts. Rendering classification comes from source. Assets/API are not HTML pages. See baseline/live/routes.csv and baseline/local/routes.csv plus crawl.json and summary.json. Asset and route failures are evidence, not a passing gate.

## Baseline commands

- npm ci: passed on single network-enabled retry. Sandbox network failure and interrupted overlapping retries are environment/setup failures, recorded in install*.log. Lockfile unchanged. npm reported dependency audit findings; no automatic upgrades made.
- npm run lint: FAILED, 2 errors / 57 warnings; CommonJS require imports in audit_seo.js; warnings also include effect-derived calculator result state. Full pre-existing output: baseline/lint.log.
- npx tsc --noEmit: passed (no dedicated typecheck package script exists).
- npm test: passed 11/11, zero skipped/failed.
- npm run build: sandbox run failed fetching Google Fonts. Network-enabled build passed including postbuild. Workspace-root warning from parent lockfile. Build logs retained. Generated sitemap date-only mutation restored to baseline.
- Production and local crawl: see JSON/CSV artifacts. Local server/network require sandbox escalation. No browser-only checklist used.

## Production findings mapped to source

| Finding | Evidence / source |
|---|---|
| 79 sitemap URLs, blanket lastmod | Live sitemap.xml; next-sitemap.config.js new Date() |
| noindex trust pages in sitemap | /contact, /privacy-policy, /terms-of-service; page SEOHandler props vs STATIC_PAGES |
| 3 missing social/schema images | /og-image.jpg, /og-image.png, /logo.png all 404; SEOHandler, blog/[slug], _document |
| ordinary locale duplicates | /about, /usd/about, /eur/about all 200; next.config.ts i18n |
| euro canonical/hreflang conflict | SEOHandler and PSEOPageTemplate canonical/alternate logic |
| 7 initial archive article anchors | /blog live HTML; src/pages/blog/index.tsx slice/Load More |
| default placeholder/zero results | loan, monthly-payment, total-interest, refinance, affordability, rent-vs-buy state flags/effects; MortgageCalculatorWidget zero result state |
| hidden PMI / inclusion mismatch | index.tsx promise; MortgageCalculatorWidget silently calls calculatePMI with 0.5%, no user input |
| nominal rate labelled APR | loan-calculator.tsx label; finance.ts only nominal monthly conversion |
| incomplete rent/buy verdict | finance.ts calculateRentVsBuy fixed costs/appreciation/25-year term, no opportunity cost; rent-vs-buy.tsx |
| author mismatch | blog/[slug].tsx Organization TryFinCalc Editorial vs articles defaultAuthor Youssef Aaouam |
| ownership/funding/validation contradictions | about.tsx, index.tsx, terms-of-service.tsx |
| Privacy active advertising claim | privacy-policy.tsx; ad scripts also present in _document.tsx |
| Terms missing email/with space | terms-of-service.tsx around accuracy disclaimer; inspect rendered text |
| certainty/user-count claims | mortgage-calculator.tsx, PSEOPageTemplate.tsx, about.tsx, index.tsx |
| inconsistent amounts/tables | articles.ts, pseo-data.ts, calculator example arrays; full financial-literals.csv |
| euro US/regional blending | six EUR pseoData records and PSEOPageTemplate |
| top 400k URL redirects | Live HTTP 308 → /mortgage-calculator; explicit next.config.ts redirect |

## Search Console

No CSV/XLSX or newer Search Console export found in the repository. Supplied June 17–September 16 evidence remains authoritative: 35 clicks / 14,670 impressions, scenarios 32 clicks; 400k exact-rate 18 clicks / 4,438 impressions. Latest versus prior 30 days: 22/6,394 vs 4/4,046. No evidence-driven URL decision changed. These are user-supplied metrics, not independently retrieved private-account data. Phase 4 dispositions remain as instructed; no new pages are authorized by word count or template availability.

## Gate and risks

Baseline artifacts and source mappings exist. Phase 1 inventory gate is satisfied. Production differs from the current checkout: baseline commit already contains previous validation, semantic markup and consent fixes. Crawl counts must not be interpreted as unique canonical inventory because explicit locale/legacy/asset seeds are included. No deployment performed. Site remains NOT READY for reapplication; repairs, all later phases, deployment and Google recrawl verification remain outstanding.
