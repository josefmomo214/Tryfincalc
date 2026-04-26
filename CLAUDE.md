# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is configured.

## Architecture

This is a **Next.js 16 Pages Router** app (not App Router). React 19, TypeScript, Tailwind CSS v4. Site name / brand: **TryFinCalc** (domain: tryfincalc.com).

**Routing & Pages** (`src/pages/`): Each calculator gets its own page file (e.g. `mortgage-calculator.tsx`, `loan-calculator.tsx`). Programmatic SEO pages live at `pages/calculator/[slug].tsx` — they are statically generated from `src/lib/pseo-data.ts` and rendered via `src/components/pseo/PSEOPageTemplate.tsx`. Blog posts live at `pages/blog/[slug].tsx`, sourced from `src/data/articles.ts`.

**i18n / Currency**: Two locales — `usd` (default) and `eur`. The locale identifier IS the currency identifier — calculator pages read `router.locale` and cast it directly: `const currency = (locale?.toUpperCase() as 'USD' | 'EUR')`. The `eur` locale adds `/eur/` prefix to all URLs; locale detection is disabled. Conversion logic is in `src/lib/finance.ts` (`convertCurrency`, `EXCHANGE_RATE`).

**Calculator logic**: Pure functions in `src/lib/finance.ts` — `calculateAmortizedPayment`, `calculatePMI`, `formatCurrency`. All calculator pages import and call these directly.

**SEO**: Every page uses `<SEOHandler>` (`src/components/seo/SEOHandler.tsx`) — pass `title`, `description`, `canonicalUrl`, and optionally `structuredData` (JSON-LD object). The component appends `| TryFinCalc` to titles automatically.

**Theming**: Dark/light mode via `ThemeContext` (`src/lib/context/ThemeContext.tsx`). CSS custom properties are defined in `src/styles/globals.css` under `@theme` (light) and `.dark` (dark). Tailwind v4 uses these tokens directly (e.g. `text-primary`, `bg-surface-container`).

**Layout pattern**: Calculator pages use `CalculatorContainer` / `CalculatorInputArea` / `CalculatorResultsArea` from `src/components/calculator/CalculatorContainer.tsx`. `CalculatorResultsArea` accepts an optional `nextSteps` prop (array of `{ title, description, icon, href }`) to render cross-linking cards. Navigation wraps via `MainLayout` (`src/components/layout/MainLayout.tsx`).

**pSEO data**: `src/lib/pseo-data.ts` exports `pseoData: PSEOParams[]`. Each entry defines a slug, calculator type, amount/rate/term, currency, and optional custom HTML strings for title, H1, intro, body content, and FAQs. Adding a new pSEO page = appending an entry here.

**Blog articles**: `src/data/articles.ts` exports `articles: Article[]`. Each article has a `content` field containing raw HTML, plus optional `structuredData` for JSON-LD. Interactive React widgets (`FixedVsVariableWidget`, `BorrowingCalculatorWidget` in `src/components/blog/`) can be embedded in blog pages.

**Search**: Client-side fuzzy search via Fuse.js, index built in `src/lib/searchIndex.ts`.

**Utilities**: `cn()` in `src/lib/utils.ts` (clsx + tailwind-merge) — use for all conditional className logic.

**Fonts**: Manrope (headings) and Inter (body), loaded via `next/font/google` in `_app.tsx`. Use `font-manrope` Tailwind class for headings.

**Production build**: `output: 'standalone'` is only applied in production (`NODE_ENV=production`); dev builds use the default output mode.
