# Phase 5 report — secure pSEO publication system

Date: 2026-09-27
Branch: `fix/adsense-third-application`
Starting HEAD: `faab845`

## Outcome

Phase 5 replaces the former implicit “unknown means indexable” behavior with a fail-closed publication workflow. The current inventory remains exactly **13 indexable**, **12 noindex** and **6 retired** scenarios. No page content, calculation, slug, canonical, Phase 4 indexation decision, redirect destination or sitemap eligibility decision changed.

`src/lib/pseo-publication.ts` is the one manual workflow source. Scenario facts and editorial copy remain in `src/lib/pseo-data.ts`; the publication record links those facts to workflow state rather than duplicating them. Any unknown slug resolves to `draft`, projects to `noindex` for robots/discovery purposes, and is absent from generated paths and the sitemap.

## Final typed model

The model supports `draft`, `reviewed`, `indexable`, `noindex` and `retired`. A materialized record contains:

- canonical slug, intent, USD/euro market, jurisdiction and currency;
- principal or annual income plus default rate, term and down payment when relevant;
- assumption version, decision question, distinct analysis, inclusions and exclusions;
- either an explicit mathematical-only declaration or dated primary sources for material temporal/regulatory claims;
- the visible site author (`Youssef Aaouam`) and no invented reviewer;
- hub, tool and guide links;
- historical Search Console evidence with the fixed observation period **2026-06-17 through 2026-09-16**;
- workflow state, explicit human validation, metadata and a shared-finance initial result.

The six Phase 4A records with documented counts retain those exact historical clicks/impressions. Records whose prior reports did not preserve row-level counts carry no invented numeric metric; they retain only the documented historical export source, observation period and explicit observation flag.

## Publication guard

Only a record whose state is `indexable` and whose complete validation returns no diagnostic is eligible for publication. The guard reports the blocking slug, code, field and message for:

1. missing historical demand evidence or observation period;
2. duplicate canonical slug or missing canonical-registry entry;
3. currency/market/jurisdiction mismatch;
4. invalid principal/income, rate, term or down-payment defaults;
5. missing, nonfinite or zero shared-finance initial result;
6. missing decision question or distinct analysis;
7. missing versioned assumptions, inclusions or exclusions;
8. temporal/regulatory claims without an HTTPS primary source and effective date;
9. EUR publication text containing USD or US-only terminology;
10. missing hub, tool or guide link;
11. missing title, description, H1 or real author;
12. absent explicit human validation.

Pure mathematical scenarios explicitly declare that they contain no material temporal or regulatory claim, so the guard does not manufacture citations. Incomplete `draft`, `reviewed` and `noindex` records do not fail the build; they simply cannot be promoted.

The guard runs when `pseoData` is loaded during the build. Sitemap selection uses the validated indexable selector. Static USD/EUR paths use the generated-route selector, so they include the 13 indexable and 12 accessible noindex routes while excluding the 6 retired pages. Existing robots metadata, hubs and related-scenario filtering continue to consume the same editorial projection. Retired records retain the Phase 4B redirect projection used by `next.config.ts`.

## Inventory

### Indexable (13)

- `/calculator/300k-mortgage-monthly-payment-6-percent`
- `/calculator/400k-mortgage-monthly-payment-6-5-percent`
- `/calculator/350k-mortgage-monthly-payment-6-5-percent`
- `/calculator/700k-mortgage-monthly-payment-7-percent`
- `/calculator/20k-loan-monthly-payment-10-percent`
- `/calculator/30k-loan-monthly-payment-9-percent`
- `/calculator/50k-loan-monthly-payment-8-percent`
- `/calculator/how-much-house-can-i-afford-70k-salary`
- `/calculator/how-much-house-can-i-afford-80k-salary`
- `/calculator/how-much-house-can-i-afford-90k-salary`
- `/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur`
- `/eur/calculator/250k-mortgage-monthly-payment-3-5-percent-eur`
- `/eur/calculator/300k-mortgage-monthly-payment-3-5-percent-eur`

### Noindex, follow (12)

- `/calculator/250k-mortgage-monthly-payment-3-5-percent`
- `/calculator/400k-mortgage-monthly-payment-4-percent`
- `/calculator/10k-personal-loan-repayment-10-percent`
- `/calculator/25k-personal-loan-repayment-8-percent`
- `/calculator/5k-loan-monthly-payment-12-percent`
- `/calculator/15k-loan-monthly-payment-10-percent`
- `/calculator/how-much-house-can-i-afford-50k-salary`
- `/calculator/how-much-house-can-i-afford-60k-salary`
- `/calculator/how-much-house-can-i-afford-100k-salary`
- `/eur/calculator/150k-mortgage-monthly-payment-3-5-percent-eur`
- `/eur/calculator/350k-mortgage-monthly-payment-3-5-percent-eur`
- `/eur/calculator/400k-mortgage-monthly-payment-3-5-percent-eur`

### Retired (6)

The six `/calculator/income-required-for-{200k,300k,400k,500k,600k,700k}-house` sources remain permanent direct redirects to `/income-needed-for-a-house`. They are no longer prerendered as scenario pages. The canonical income-needed page remains outside the permutation model and its Phase 4B protections pass.

## Blocked-case tests

`tests/phase5-publication.test.ts` constructs invalid indexable records and confirms the exact refusal codes for missing demand, a duplicate slug, invalid parameters, a zero result, missing analysis, an undated/unsourced temporal claim, an EUR/USD conflict, insufficient contextual links, missing human approval and absence from the canonical registry. It also proves that an incomplete noindex record does not block the build, an unknown future slug becomes `draft`, all 13 current indexable records pass, and sitemap/static paths match the same source of truth.

Existing Phase 4A/4B and redirect tests remain green. The older Phase 3 static-path assertion was updated only to consume the new generated-route selector; its previous expectation incorrectly included the six retired redirect sources as prerendered pages.

## Verification results

- Focused Phase 3/4A/4B/5 regression after stabilization: **34/34 passed**.
- `npm test`: **78 tests, 78 passed, 0 failed, 0 skipped**.
- `npx tsc --noEmit`: initial run found one type-only issue (`redirect.destination` remained optional); after making the editorial decision a discriminated union, the rerun **passed with no diagnostics**.
- `npm run lint`: **pass**, exit 0, **0 errors and 30 pre-existing warnings**. The existing Browserslist-age notice remains.
- `npm run build`: the sandboxed attempt reached compilation but could not fetch four Google Fonts. The identical network-enabled run **passed** with Next.js **16.2.7**, generated **74/74 static pages**, and completed `next-sitemap`. The existing multiple-lockfile/workspace-root warning remains.
- Inventory validation: **31 records; 13 indexable, 12 noindex, 6 retired, 0 draft, 0 reviewed; 0 diagnostics**. The `tsx` CLI could not create its sandbox IPC socket, so the successful check used the same `node --import tsx` loader as the test suite.
- Targeted production crawl: **13/13 indexable HTTP 200**, **12/12 noindex HTTP 200**, **6/6 retired permanent HTTP 308**; correct self-canonicals/robots/sitemap disposition; one H1 on generated scenarios; nonzero SSR results on all indexable scenarios; no unresolved tokens; no visible USD/PMI/PITI/HOA terminology on indexable EUR pages; **47 unique internal destinations checked, 0 broken links**.
- Generated sitemap: **56 URLs**, unchanged from the Phase 4C disposition.
- Browser verification was intentionally not repeated because Phase 5 changes no visible component or interactive behavior. SSR production routes were checked by the targeted crawl.
- `git diff --check`: recorded after this report in the final repository check.

The first standalone crawl returned 404 for `/sitemap.xml` because Next standalone output does not copy `public/` or `.next/static` automatically. After copying those generated assets into the temporary standalone tree, the application crawl ran. A subsequent checker-only false positive matched the non-visible form attribute `id="hoa"`; restricting that temporary assertion to visible text produced the final passing result. Neither issue required a repository code change.

## Files modified

- `next-sitemap.config.js`
- `src/lib/pseo-data.ts`
- `src/lib/pseo-publication.ts`
- `src/lib/route-registry.ts`
- `src/pages/calculator/[slug].tsx`
- `src/pages/eur/calculator/[slug].tsx`
- `tests/phase3-seo.test.tsx`
- `tests/phase5-publication.test.ts` (new)
- `docs/audit/phase5/PHASE_5_REPORT.md` (this report)

## Remaining limits

- Historical Search Console evidence is explicitly bounded to 2026-06-17 through 2026-09-16 and is not presented as current demand. Row-level counts absent from the completed Phase 4 reports were not reconstructed or invented.
- The build guard validates source data and the generated publication selectors. Rendered hub/related-link exclusion remains additionally protected by the Phase 4B regression tests.
- Hosting-provider redirects and production search-engine recrawl behavior cannot be validated from the local repository.
- The 30 pre-existing lint warnings, Browserslist-age notice and Next workspace-root warning remain outside Phase 5.

Phase 5 stops here. No commit, push, merge, deployment, new page, new permutation or Phase 6 work was performed.
