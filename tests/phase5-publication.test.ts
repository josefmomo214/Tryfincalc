import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pseoData } from '../src/lib/pseo-data';
import {
  PSEO_PUBLICATION_PERIOD,
  getGeneratedPseoScenarios,
  getIndexablePseoScenarios,
  getPseoPublicationRecord,
  getPseoPublicationState,
  isPseoPublicationEligible,
  validatePseoPublicationInventory,
  validatePseoPublicationRecord,
  type PseoPublicationRecord,
} from '../src/lib/pseo-publication';
import { canonicalScenarioPath } from '../src/lib/route-registry';
import { getStaticPaths as getUsdScenarioPaths } from '../src/pages/calculator/[slug]';
import { getStaticPaths as getEurScenarioPaths } from '../src/pages/eur/calculator/[slug]';

const clone = (record: PseoPublicationRecord): PseoPublicationRecord => structuredClone(record);
const validRecord = () => {
  const scenario = pseoData.find((item) => item.slug === '300k-mortgage-monthly-payment-6-percent');
  assert.ok(scenario);
  return clone(getPseoPublicationRecord(scenario));
};
const codes = (record: PseoPublicationRecord, records = [record], registry = new Set([record.canonicalSlug])) => (
  validatePseoPublicationRecord(record, { records, canonicalRegistry: registry }).map((item) => item.code)
);

test('the typed inventory preserves 13 indexable, 12 noindex and six retired scenarios', () => {
  assert.deepEqual(PSEO_PUBLICATION_PERIOD, { from: '2026-06-17', to: '2026-09-16' });
  assert.equal(getIndexablePseoScenarios(pseoData).length, 13);
  assert.equal(pseoData.filter((item) => getPseoPublicationState(item.slug) === 'noindex').length, 12);
  assert.equal(pseoData.filter((item) => getPseoPublicationState(item.slug) === 'retired').length, 6);
  assert.equal(getGeneratedPseoScenarios(pseoData).length, 25);
  assert.deepEqual(validatePseoPublicationInventory(pseoData), []);

  for (const scenario of getIndexablePseoScenarios(pseoData)) {
    const record = getPseoPublicationRecord(scenario);
    assert.equal(record.canonicalSlug, scenario.slug);
    assert.equal(record.currency, scenario.currency);
    assert.equal(record.humanValidation, true);
    assert.ok(record.initialResult && record.initialResult > 0);
    assert.ok(record.demandEvidence);
    assert.deepEqual(record.demandEvidence.period, PSEO_PUBLICATION_PERIOD);
  }
});

test('the publication guard reports every required blocking category precisely', () => {
  const missingDemand = validRecord();
  delete missingDemand.demandEvidence;
  assert.ok(codes(missingDemand).includes('missing-demand-evidence'));
  assert.equal(isPseoPublicationEligible(missingDemand), false);

  const duplicate = validRecord();
  assert.ok(codes(duplicate, [duplicate, clone(duplicate)]).includes('duplicate-canonical-slug'));

  const invalidParameters = validRecord();
  invalidParameters.defaults.term = 0;
  assert.ok(codes(invalidParameters).includes('invalid-initial-parameters'));

  const impossibleResult = validRecord();
  impossibleResult.initialResult = 0;
  assert.ok(codes(impossibleResult).includes('invalid-initial-result'));

  const missingAnalysis = validRecord();
  missingAnalysis.decisionQuestion = '';
  missingAnalysis.distinctAnalysis = '';
  assert.ok(codes(missingAnalysis).includes('missing-distinct-analysis'));

  const unsourcedClaim = validRecord();
  unsourcedClaim.claims = {
    kind: 'sourced',
    items: [{ claim: 'Rates changed this week', sourceUrl: '', effectiveDate: '' }],
  };
  assert.ok(codes(unsourcedClaim).includes('unsourced-material-claim'));

  const currencyConflict = validRecord();
  currencyConflict.currency = 'EUR';
  currencyConflict.market = 'euro-denominated';
  currencyConflict.jurisdiction = 'jurisdiction-neutral';
  currencyConflict.distinctAnalysis = 'This EUR example incorrectly mentions USD and PMI.';
  assert.ok(codes(currencyConflict).includes('currency-terminology-conflict'));

  const missingLinks = validRecord();
  missingLinks.links = { hub: '', tool: '', guides: [] };
  assert.ok(codes(missingLinks).includes('insufficient-contextual-links'));

  const notApproved = validRecord();
  notApproved.humanValidation = false;
  assert.ok(codes(notApproved).includes('missing-human-validation'));

  const absentFromRegistry = validRecord();
  assert.ok(codes(absentFromRegistry, [absentFromRegistry], new Set()).includes('missing-canonical-registry-entry'));
});

test('non-indexable and unknown scenarios fail closed without blocking incomplete drafts', () => {
  const noindex = pseoData.find((item) => getPseoPublicationState(item.slug) === 'noindex');
  assert.ok(noindex);
  const incomplete = getPseoPublicationRecord(noindex);
  incomplete.decisionQuestion = '';
  incomplete.distinctAnalysis = '';
  assert.equal(isPseoPublicationEligible(incomplete), false);
  assert.deepEqual(validatePseoPublicationRecord(incomplete), []);

  assert.equal(getPseoPublicationState('future-unreviewed-scenario'), 'draft');
});

test('sitemap eligibility and static paths are derived from the publication source of truth', async () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sitemap = require('../next-sitemap.config.js');
  const locations = new Set((await sitemap.additionalPaths()).map((item: { loc: string }) => item.loc));
  const indexable = getIndexablePseoScenarios(pseoData);
  for (const scenario of pseoData) {
    assert.equal(locations.has(canonicalScenarioPath(scenario)), indexable.includes(scenario));
  }

  const usd = await getUsdScenarioPaths({});
  const eur = await getEurScenarioPaths({});
  const slugs = [...usd.paths, ...eur.paths].map((entry) => {
    assert.notEqual(typeof entry, 'string');
    return typeof entry === 'string' ? '' : entry.params.slug;
  });
  assert.deepEqual(new Set(slugs), new Set(getGeneratedPseoScenarios(pseoData).map((item) => item.slug)));
});
