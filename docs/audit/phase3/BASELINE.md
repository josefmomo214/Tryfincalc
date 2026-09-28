# Phase 3 baseline — 2026-09-21

Starting point: `fix/adsense-third-application` at `539aba3` with a clean working tree.

The reproducible crawl in `docs/audit/phase3/baseline/` records:

- 260 responses: 248 HTTP 200, 9 HTTP 308, and 3 HTTP 404.
- 79 sitemap URLs.
- `/contact`, `/privacy-policy`, and `/terms-of-service` are `noindex` but included in the sitemap.
- `/logo.png` and `/og-image.jpg` are referenced and return 404. The additional `/og-image.png` reference also lacks a public asset.
- `/calculator/400k-mortgage-monthly-payment-6-5-percent` returns HTTP 308 to `/mortgage-calculator`.
- `/usd/mortgage-calculator` and `/eur/mortgage-calculator` both return HTTP 200 in addition to the unprefixed route.
- The blog archive server-renders the featured article and six grid articles; later articles require the client-only Load More action.
- EUR scenario pages emit conflicting `en` and `x-default` hreflang links even though the unprefixed target is noncanonical.
- Every sitemap entry receives the build date from `next-sitemap.config.js`.
- Article schema names `TryFinCalc Editorial` while the visible byline names Youssef Aaouam.
- Twitter card metadata uses `property=` instead of `name=`.
- Six calculators already expose WebApplication schema; monthly-payment and total-interest do not.

The crawl command was:

```sh
python3 scripts/audit-crawl.py http://127.0.0.1:3102 docs/audit/phase3/baseline
```

The redirect and duplicate checks used no-follow HTTP HEAD requests against the same local production server.
