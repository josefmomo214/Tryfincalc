import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { articles } from '../src/data/articles';
import { pseoData } from '../src/lib/pseo-data';

const sourceFiles = [
  'src/lib/pseo-data.ts',
  'src/data/articles.ts',
] as const;

const volatileClaimPatterns = [
  /\b(?:current(?:ly)?|today(?:'s)?|2026)\b[^.!?\n]{0,100}\b(?:mortgage |interest |market |national |European )?(?:rate|rates|benchmark|benchmarks|average|averages)\b/gi,
  /\b(?:mortgage |interest |market |national |European )?(?:rate|rates|benchmark|benchmarks|average|averages)\b[^.!?\n]{0,100}\b(?:current(?:ly)?|today(?:'s)?|2026)\b/gi,
  /\b(?:typical|average)\s+(?:mortgage |interest |market |fixed |variable |annual |APR |closing |purchase |insurance |tax |PMI |PITI )?(?:rate|rates|cost|costs|fee|fees|requirement|requirements|limit|limits)\b/gi,
  /\bmortgage rates?\s+(?:hover(?:s|ing)?\s+)?(?:above|below|between|at|around|near)\s+\d/gi,
] as const;

const universalQualificationPatterns = [
  /\b(?:most|virtually every)\s+(?:[a-z-]+\s+){0,2}lenders?\b/gi,
  /\blenders?\s+(?:typically|generally|usually|consistently|always|require|requires|expect|expects|follow|follows|enforce|enforces|want|wants)\b[^.!?\n]{0,160}\b(?:qualif\w*|credit|score|income|DTI|debt|down payment|equity|reserve|approval|limit|PMI|escrow)\b/gi,
  /\b(?:qualif\w*|credit|score|income|DTI|debt|down payment|equity|reserve|approval|limit|PMI|escrow)\b[^.!?\n]{0,160}\blenders?\s+(?:typically|generally|usually|consistently|always|require|requires|expect|expects|follow|follows|enforce|enforces|want|wants)\b/gi,
  /\b(?:standard|gold-standard|industry-standard)\s+(?:28%|28\/36|33%|35%|DTI)\b/gi,
  /\b(?:need|needs|require|requires|required)\b[^.!?\n]{0,80}\bto qualify\b/gi,
] as const;

function findMatches(
  patterns: readonly RegExp[],
  allowLine: (line: string) => boolean = () => false,
) {
  const matches: string[] = [];
  for (const file of sourceFiles) {
    const source = readFileSync(file, 'utf8');
    const lines = source.split('\n');
    lines.forEach((line, index) => {
      if (allowLine(line)) return;
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          matches.push(`${file}:${index + 1}: ${line.trim()}`);
          break;
        }
      }
    });
  }
  return matches;
}

test('content has no unsupported or undated rate-market claims', () => {
  assert.deepEqual(findMatches(volatileClaimPatterns, (line) => {
    const isExplicitNonClaim = /\b(?:example|illustrative|selected calculator assumption)\b/i.test(line)
      && /\b(?:not (?:a claim|an available offer|a market average)|does not represent)\b/i.test(line);
    const isBorrowerInput = /\b(?:your|the) current (?:loan |mortgage )?(?:balance|interest rate|rate|adjusted rate)\b/i.test(line)
      && !/\b(?:market|average|benchmark|2026|today)\b/i.test(line);
    const isLoanDocumentInput = /\b(?:current mortgage statement \(for balance and rate\)|current loan statement and a fresh rate quote|own specific loan amount and current rate)\b/i.test(line);
    const isInventoryDefinition = /current rate of sales/i.test(line);
    return isExplicitNonClaim || isBorrowerInput || isLoanDocumentInput || isInventoryDefinition;
  }), []);
});

test('content does not present lender qualification assumptions as universal rules', () => {
  assert.deepEqual(findMatches(universalQualificationPatterns), []);
});

test('euro scenarios do not import US-only PMI or PITI terminology', () => {
  const euroRecords = pseoData.filter((record) => record.currency === 'EUR');
  const euroArticles = articles.filter((article) => /(?:^|-)euro(?:-|$)/i.test(article.slug));
  for (const record of [...euroRecords, ...euroArticles]) {
    assert.doesNotMatch(
      JSON.stringify(record),
      /\b(?:PMI|PITI|Private Mortgage Insurance)\b/i,
      `US-only mortgage terminology leaked into ${record.slug}`,
    );
  }
});

test('content records do not contain unresolved template tokens', () => {
  for (const record of [...pseoData, ...articles]) {
    assert.doesNotMatch(
      JSON.stringify(record),
      /\$\{[A-Za-z_][^}]*\}|\{\{[^}]+\}\}/,
      `template token leaked into ${record.slug}`,
    );
  }
});
