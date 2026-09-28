# Third application repair plan — 2026-09-20

Scope follows the supplied six-phase specification. Work stops for a report after Phase 2; later phases must not be silently implemented. No approval claim or fabricated reviewer.

1. Inventory: clean working branch; locked npm install; lint, tsc, node tests, production build; source financial-literal inventory and scenario records; production and local HTTP crawl. Save all evidence under baseline. Map production findings to source. No product edits until this gate is recorded.
2. Calculation contract: extend src/lib/finance.ts, preserve percentage-point/year units and full-precision calculations with display-only rounding. Add exact cent regression cases and adversarial validation. Use shared functions in tool defaults and examples. Test cash-flow and equity accounting for rent/buy, fee recovery and full-term costs for refinance, and explicit US illustrative affordability assumptions.
3. Initial rendering: remove effect-derived result state in calculator pages and MortgageCalculatorWidget. Derive validated results during render. Add a keyboard-accessible Calculate submit action that focuses the result or invalid input. Test HTML before hydration for all eight tools.
4. Scope: remove hidden PMI and inclusion promises; nominal annual interest labels; explicit exclusions. Rent/buy compares discounted cash outflows less sale equity, with separate costs, growth and return inputs, annual crossing and sensitivity. Affordability uses explicit illustrative housing/debt budgets independent of display currency. Refinance distinguishes cash-flow fee recovery from lifetime savings.
5. Trust: shared supplied ownership/funding/accuracy language; conditional ad disclosures; methodology and editorial/corrections pages; generated test examples, no claimed independent reviewer. Review legal edits as an unresolved release item.
6. Phase 2 verification: tests, lint, typecheck, build, local crawl and unsupported-copy scan. Record changed files, behavior, remaining risks, and exact gate status. Stop before canonicalization/content consolidation.

Later authorized phases remain ordered: canonical registry/locale redirects/discovery/schema; evidence-led URL consolidation; typed scenario lifecycle and fail-closed publication gates; final full QA and deployed/recrawled readiness check. No new scenario permutations.
