import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { articles } from '../src/data/articles';
import { pseoData } from '../src/lib/pseo-data';

const sourceFiles = [
  'src/lib/pseo-data.ts',
  'src/data/articles.ts',
  'src/pages/index.tsx',
] as const;

const volatileClaimPatterns = [
  /\b(?:current(?:ly)?|today(?:'s)?|2026)\b[^.!?\n]{0,100}\b(?:mortgage |interest |market |national |European )?(?:rate|rates|benchmark|benchmarks|average|averages)\b/gi,
  /\b(?:mortgage |interest |market |national |European )?(?:rate|rates|benchmark|benchmarks|average|averages)\b[^.!?\n]{0,100}\b(?:current(?:ly)?|today(?:'s)?|2026)\b/gi,
  /\b(?:typical|average)\s+(?:mortgage |interest |market |fixed |variable |annual |APR |closing |purchase |insurance |tax |PMI |PITI )?(?:rate|rates|cost|costs|fee|fees|requirement|requirements|limit|limits)\b/gi,
  /\b(?:rate|rates|cost|costs|fee|fees|premium|premiums|price|prices)\b[^.!?\n]{0,80}\b(?:typical(?:ly)?|average|usually)\b/gi,
  /\b(?:typical(?:ly)?|average|usually)\b[^.!?\n]{0,80}\b(?:rate|rates|cost|costs|fee|fees|premium|premiums|price|prices)\b/gi,
  /\bmortgage rates?\s+(?:hover(?:s|ing)?\s+)?(?:above|below|between|at|around|near)\s+\d/gi,
] as const;

const universalQualificationPatterns = [
  /\b(?:most|virtually every)\s+(?:[a-z-]+\s+){0,2}lenders?\b/gi,
  /\blenders?\s+(?:typically|generally|usually|consistently|always|require|requires|expect|expects|follow|follows|enforce|enforces|want|wants)\b[^.!?\n]{0,160}\b(?:qualif\w*|credit|score|income|DTI|debt|down payment|equity|reserve|approval|limit|PMI|escrow)\b/gi,
  /\b(?:qualif\w*|credit|score|income|DTI|debt|down payment|equity|reserve|approval|limit|PMI|escrow)\b[^.!?\n]{0,160}\blenders?\s+(?:typically|generally|usually|consistently|always|require|requires|expect|expects|follow|follows|enforce|enforces|want|wants)\b/gi,
  /\b(?:standard|gold-standard|industry-standard)\s+(?:28%|28\/36|33%|35%|DTI)\b/gi,
  /\b(?:need|needs|require|requires|required)\b[^.!?\n]{0,80}\bto qualify\b/gi,
  /\blenders?\s+(?:use|uses|apply|applies|cap|caps|check|checks|scrutinize|scrutinizes)\b[^.!?\n]{0,160}\b(?:qualif\w*|credit|score|income|DTI|debt|down payment|equity|reserve|approval|limit|PMI|escrow|28%|36%)\b/gi,
  /\b(?:DTI|debt-to-income|28\/36|28%|33%|35%)\b[^.!?\n]{0,160}\b(?:lenders? actually use|lenders? apply|qualification standard|underwriting standard)\b/gi,
  /\b(?:credit score|score)\b[^.!?\n]{0,120}\b(?:minimum|required|needed|guarantees?|secure(?:s)? (?:the )?(?:best|lowest) rate)\b/gi,
  /\b(?:minimum|required|needed)\b[^.!?\n]{0,120}\b(?:credit score|score)\b/gi,
  /\bPMI\b[^.!?\n]{0,140}\b(?:required|automatically|cancels?|continues until|less than 20%|under 20%)\b/gi,
  /\b(?:less than 20%|under 20%)\b[^.!?\n]{0,140}\bPMI\b/gi,
  /\b(?:housing|total debt|monthly debt|mortgage payment)\b[^.!?\n]{0,120}\bshould not exceed\s+(?:28|36)%/gi,
  /\b(?:safe benchmark|verified commitment|what sellers actually care about)\b/gi,
  /\b(?:pre-approval|rate lock)\b[^.!?\n]{0,120}\bguarantees?\b/gi,
  /\bmultiple (?:mortgage )?(?:applications|credit inquiries|inquiries)\b[^.!?\n]{0,140}\b(?:single|one) (?:credit )?inquiry\b/gi,
  /\bVA loans?\b[^.!?\n]{0,180}\b(?:never require PMI|no down payment required|zero down|eligible after)\b/gi,
  /\bVA funding fee\b[^.!?\n]{0,140}\b\d+(?:\.\d+)?%\b/gi,
] as const;

const unsupportedMarketClaimPatterns = [
  /\b(?:national|market)\s+(?:average|median)\b/gi,
  /\b(?:most common|typical|average)\b[^.!?\n]{0,100}\b(?:closing )?fees?\b/gi,
  /\b(?:consistently lower interest rates|mortgage rates change daily|\d+(?:\.\d+)?% rate environment)\b/gi,
  /\b(?:average|typical)\s+(?:U\.S\.\s+)?(?:auto loan|mortgage balance|home price|rent|salary|income)\b/gi,
  /\b(?:index fund|market|investment)\b[^.!?\n]{0,100}\baverag(?:e|ing)\s+\d/gi,
  /\btypical impact of (?:PMI|mortgage insurance)\b/gi,
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

test('homepage avoids volatile rates and universal qualification language', () => {
  const homepage = readFileSync('src/pages/index.tsx', 'utf8');
  for (const pattern of [
    /Income needed to qualify/i,
    /The standard is 28%/i,
    /today(?:'s)? rates/i,
    /you(?:&apos;|')ve lost money/i,
  ]) {
    assert.doesNotMatch(homepage, pattern);
  }
});

test('content has no unsupported or undated rate-market claims', () => {
  assert.deepEqual(findMatches(volatileClaimPatterns, (line) => {
    const isExplicitNonClaim = /\b(?:example|illustrative|selected calculator assumption|editable scenario input|mathematical scenarios?)\b/i.test(line)
      && /\b(?:not (?:a claim|claims|an available offer|a market average|a current market quote)|does not (?:claim|represent|describe)|not claims about|without (?:making claims|claiming))\b/i.test(line);
    const isBorrowerInput = /\b(?:your|the) current (?:loan |mortgage )?(?:balance|interest rate|rate|adjusted rate)\b/i.test(line)
      && !/\b(?:market|average|benchmark|2026|today)\b/i.test(line);
    const isLoanDocumentInput = /(?:\bcurrent mortgage statement \(for balance and rate\)|\bcurrent loan statement and a fresh rate quote|\bown specific loan amount and current rate\b)/i.test(line);
    const isInventoryDefinition = /current rate of sales/i.test(line);
    return isExplicitNonClaim || isBorrowerInput || isLoanDocumentInput || isInventoryDefinition;
  }), []);
});

test('content does not present lender qualification assumptions as universal rules', () => {
  assert.deepEqual(findMatches(
    universalQualificationPatterns,
    (line) => {
      const isHeading = /<h[1-6][^>]*>[^<]*<\/h[1-6]>/i.test(line);
      const isScopedExample = /\b(?:example|illustrative|selected|scenario|model|page)\b/i.test(line)
        && /\b(?:actual|vary|varies|not|rather than|removes?)\b/i.test(line);
      const explicitlyVariesByProvider = /\b(?:criteria|requirements|rules|terms)\b[^.!?\n]{0,100}\bvar(?:y|ies)\b[^.!?\n]{0,100}\b(?:lender|loan program|provider|jurisdiction)\b/i.test(line)
        && /\b(?:actual|check|compare|rather than|written)\b/i.test(line);
      const isExplicitNegation = /\b(?:not a guarantee|does not guarantee)\b/i.test(line);
      return isHeading || isScopedExample || explicitlyVariesByProvider || isExplicitNegation;
    },
  ), []);
});

test('content does not present unsupported market statistics or product comparisons', () => {
  assert.deepEqual(findMatches(unsupportedMarketClaimPatterns, (line) => {
    return /\b(?:not a market average|does not (?:claim|represent)|selected|illustrative|example)\b/i.test(line);
  }), []);
});

test('euro scenarios do not import US-only PMI or PITI terminology', () => {
  const euroRecords = pseoData.filter((record) => record.currency === 'EUR');
  const euroArticles = articles.filter((article) => /(?:^|-)euro(?:-|$)/i.test(article.slug));
  for (const record of [...euroRecords, ...euroArticles]) {
    assert.doesNotMatch(
      JSON.stringify(record),
      /\b(?:PMI|PITI|Private Mortgage Insurance|FHA|Fannie Mae|Freddie Mac|credit score)\b/i,
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
