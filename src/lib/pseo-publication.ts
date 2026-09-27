import { calculateAffordability, calculateLoan } from './finance';
import { canonicalScenarioSlugRegistry } from './route-registry';

export type PseoPublicationState = 'draft' | 'reviewed' | 'indexable' | 'noindex' | 'retired';
export type PseoEditorialStatus = 'indexable' | 'noindex' | 'redirect';

export type PseoEditorialDecision =
  | { status: 'indexable' | 'noindex'; destination?: never }
  | { status: 'redirect'; destination: string };

export interface PseoScenarioInput {
  slug: string;
  type: 'mortgage' | 'loan' | 'affordability';
  amount: number;
  rate: number;
  term: number;
  currency: 'USD' | 'EUR';
  salary?: number;
  customTitle?: string;
  customDescription?: string;
  customH1?: string;
  customIntro?: string;
  customContent?: string;
  scenarioQuestion?: string;
  affordabilityInputs?: {
    monthlyIncome: number;
    monthlyDebts: number;
    downPayment: number;
    monthlyPropertyTax: number;
    monthlyInsurance: number;
  };
}

export const INCOME_NEEDED_PATH = '/income-needed-for-a-house';
export const PSEO_PUBLICATION_PERIOD = { from: '2026-06-17', to: '2026-09-16' } as const;

export interface PseoDemandEvidence {
  source: 'Google Search Console export';
  period: typeof PSEO_PUBLICATION_PERIOD;
  observed: true;
  clicks?: number;
  impressions?: number;
}

export type PseoClaimsDeclaration =
  | { kind: 'mathematical-only'; note: string }
  | { kind: 'sourced'; items: Array<{ claim: string; sourceUrl: string; effectiveDate: string }> };

export interface PseoPublicationRecord {
  canonicalSlug: string;
  state: PseoPublicationState;
  intent: string;
  market: 'US-dollar' | 'euro-denominated';
  jurisdiction: 'US-general' | 'jurisdiction-neutral';
  currency: 'USD' | 'EUR';
  primaryValue: { kind: 'principal' | 'annual-income'; amount: number };
  defaults: {
    principal?: number;
    annualIncome?: number;
    rate: number;
    term: number;
    downPayment?: number;
  };
  assumptionsVersion: string;
  decisionQuestion: string;
  distinctAnalysis: string;
  inclusions: string[];
  exclusions: string[];
  claims: PseoClaimsDeclaration;
  author: string;
  reviewer?: string;
  links: { hub: string; tool: string; guides: string[] };
  demandEvidence?: PseoDemandEvidence;
  metadata: { title: string; description: string; h1: string };
  humanValidation: boolean;
  initialResult: number | null;
  destination?: string;
}

export type PseoPublicationDiagnosticCode =
  | 'missing-demand-evidence'
  | 'duplicate-canonical-slug'
  | 'missing-canonical-registry-entry'
  | 'currency-market-jurisdiction-conflict'
  | 'invalid-initial-parameters'
  | 'invalid-initial-result'
  | 'missing-distinct-analysis'
  | 'missing-disclosures'
  | 'unsourced-material-claim'
  | 'currency-terminology-conflict'
  | 'insufficient-contextual-links'
  | 'missing-metadata-or-author'
  | 'missing-human-validation';

export interface PseoPublicationDiagnostic {
  slug: string;
  code: PseoPublicationDiagnosticCode;
  field: string;
  message: string;
}

interface PseoWorkflowEntry {
  state: PseoPublicationState;
  humanValidation: boolean;
  demandEvidence?: PseoDemandEvidence;
  destination?: string;
  decisionQuestion?: string;
}

function historicalDemand(metrics?: Pick<PseoDemandEvidence, 'clicks' | 'impressions'>): PseoDemandEvidence {
  return {
    source: 'Google Search Console export',
    period: PSEO_PUBLICATION_PERIOD,
    observed: true,
    ...metrics,
  };
}

function indexable(
  metrics?: Pick<PseoDemandEvidence, 'clicks' | 'impressions'>,
  decisionQuestion?: string,
): PseoWorkflowEntry {
  return {
    state: 'indexable',
    humanValidation: true,
    demandEvidence: historicalDemand(metrics),
    ...(decisionQuestion ? { decisionQuestion } : {}),
  };
}

const noindex = { state: 'noindex', humanValidation: false } as const satisfies PseoWorkflowEntry;
const retired = { state: 'retired', humanValidation: false, destination: INCOME_NEEDED_PATH } as const satisfies PseoWorkflowEntry;

/** Single manual disposition list; scenario facts and copy remain in pseo-data. */
export const PSEO_PUBLICATION_WORKFLOW = {
  '300k-mortgage-monthly-payment-6-percent': indexable({ clicks: 9, impressions: 2911 }),
  '400k-mortgage-monthly-payment-6-5-percent': indexable(
    undefined,
    'How do the selected rate and repayment term change payment and total interest on this $400,000 principal?',
  ),
  '350k-mortgage-monthly-payment-6-5-percent': indexable(),
  '700k-mortgage-monthly-payment-7-percent': indexable(),
  '250k-mortgage-monthly-payment-3-5-percent': noindex,
  '400k-mortgage-monthly-payment-4-percent': noindex,
  '10k-personal-loan-repayment-10-percent': noindex,
  '25k-personal-loan-repayment-8-percent': noindex,
  '5k-loan-monthly-payment-12-percent': noindex,
  '15k-loan-monthly-payment-10-percent': noindex,
  '20k-loan-monthly-payment-10-percent': indexable(),
  '30k-loan-monthly-payment-9-percent': indexable({ clicks: 1, impressions: 55 }),
  '50k-loan-monthly-payment-8-percent': indexable({ clicks: 1, impressions: 84 }),
  'how-much-house-can-i-afford-100k-salary': noindex,
  'how-much-house-can-i-afford-50k-salary': noindex,
  'how-much-house-can-i-afford-60k-salary': noindex,
  'how-much-house-can-i-afford-70k-salary': indexable(),
  'how-much-house-can-i-afford-80k-salary': indexable({ impressions: 528 }),
  'how-much-house-can-i-afford-90k-salary': indexable(),
  'income-required-for-200k-house': retired,
  'income-required-for-300k-house': retired,
  'income-required-for-400k-house': retired,
  'income-required-for-500k-house': retired,
  'income-required-for-600k-house': retired,
  'income-required-for-700k-house': retired,
  '150k-mortgage-monthly-payment-3-5-percent-eur': noindex,
  '200k-mortgage-monthly-payment-3-5-percent-eur': indexable({ clicks: 1, impressions: 65 }),
  '250k-mortgage-monthly-payment-3-5-percent-eur': indexable(),
  '300k-mortgage-monthly-payment-3-5-percent-eur': indexable({ clicks: 2, impressions: 96 }),
  '350k-mortgage-monthly-payment-3-5-percent-eur': noindex,
  '400k-mortgage-monthly-payment-3-5-percent-eur': noindex,
} as const satisfies Readonly<Record<string, PseoWorkflowEntry>>;

function workflowFor(slug: string): PseoWorkflowEntry {
  return PSEO_PUBLICATION_WORKFLOW[slug as keyof typeof PSEO_PUBLICATION_WORKFLOW]
    ?? { state: 'draft', humanValidation: false };
}

export function getPseoPublicationState(slug: string): PseoPublicationState {
  return workflowFor(slug).state;
}

export const PSEO_EDITORIAL_DECISIONS: Readonly<Record<string, PseoEditorialDecision>> = Object.fromEntries(
  Object.entries(PSEO_PUBLICATION_WORKFLOW).map(([slug, workflow]) => [
    slug,
    workflow.state === 'retired'
      ? { status: 'redirect', destination: workflow.destination ?? INCOME_NEEDED_PATH }
      : { status: workflow.state === 'indexable' ? 'indexable' : 'noindex' },
  ]),
);

export function getPseoEditorialDecision(slug: string): PseoEditorialDecision {
  return PSEO_EDITORIAL_DECISIONS[slug] ?? { status: 'noindex' };
}

export function getPseoEditorialStatus(slug: string): PseoEditorialStatus {
  return getPseoEditorialDecision(slug).status;
}

function disclosuresFor(type: PseoScenarioInput['type']) {
  if (type === 'affordability') {
    return {
      inclusions: ['gross income', 'entered monthly debts', 'entered down payment', 'selected rate and term', 'entered tax and insurance'],
      exclusions: ['lender underwriting', 'approval decisions', 'closing costs', 'maintenance', 'unentered ownership costs'],
    };
  }
  return {
    inclusions: ['stated principal', 'selected nominal annual interest rate', 'selected repayment term'],
    exclusions: ['fees', 'taxes', 'insurance', 'maintenance', 'transaction costs', 'approval or eligibility decisions'],
  };
}

function linksFor(type: PseoScenarioInput['type']) {
  if (type === 'loan') {
    return { hub: '/loan-calculator', tool: '/monthly-payment-calculator', guides: ['/blog/total-interest-explained'] };
  }
  if (type === 'affordability') {
    return { hub: '/affordability-calculator', tool: '/income-needed-for-a-house', guides: ['/blog/28-36-rule-explained'] };
  }
  return { hub: '/mortgage-calculator', tool: '/amortization-schedule', guides: ['/blog/mortgage-payment-guide'] };
}

function calculateInitialResult(scenario: PseoScenarioInput): number | null {
  try {
    if (scenario.type !== 'affordability') {
      return calculateLoan(scenario.amount, scenario.rate, scenario.term).monthly;
    }
    const inputs = scenario.affordabilityInputs;
    const monthlyIncome = inputs?.monthlyIncome ?? (scenario.salary ?? 0) / 12;
    return calculateAffordability(
      monthlyIncome,
      inputs?.monthlyDebts ?? 0,
      inputs?.downPayment ?? 0,
      scenario.rate,
      scenario.term,
      scenario.currency,
      (inputs?.monthlyPropertyTax ?? 0) + (inputs?.monthlyInsurance ?? 0),
    ).maxPrice;
  } catch {
    return null;
  }
}

export function getPseoPublicationRecord(scenario: PseoScenarioInput): PseoPublicationRecord {
  const workflow = workflowFor(scenario.slug);
  const affordability = scenario.type === 'affordability';
  const annualIncome = scenario.salary ?? (scenario.affordabilityInputs?.monthlyIncome ?? 0) * 12;
  return {
    canonicalSlug: scenario.slug,
    state: workflow.state,
    intent: affordability
      ? 'estimate a home-price planning range from adjustable income assumptions'
      : `compare payment and total cost for a stated ${scenario.type} principal`,
    market: scenario.currency === 'EUR' ? 'euro-denominated' : 'US-dollar',
    jurisdiction: scenario.currency === 'EUR' ? 'jurisdiction-neutral' : 'US-general',
    currency: scenario.currency,
    primaryValue: affordability
      ? { kind: 'annual-income', amount: annualIncome }
      : { kind: 'principal', amount: scenario.amount },
    defaults: {
      ...(affordability ? { annualIncome } : { principal: scenario.amount }),
      rate: scenario.rate,
      term: scenario.term,
      ...(scenario.type === 'mortgage' || affordability
        ? { downPayment: scenario.affordabilityInputs?.downPayment ?? 0 }
        : {}),
    },
    assumptionsVersion: 'phase-4-validated-v1',
    decisionQuestion: workflow.decisionQuestion ?? scenario.scenarioQuestion ?? '',
    distinctAnalysis: scenario.customContent ?? '',
    ...disclosuresFor(scenario.type),
    claims: {
      kind: 'mathematical-only',
      note: 'No material temporal or regulatory claim is used; displayed rates, ratios and costs are adjustable planning assumptions.',
    },
    author: 'Youssef Aaouam',
    links: linksFor(scenario.type),
    demandEvidence: workflow.demandEvidence,
    metadata: {
      title: scenario.customTitle ?? '',
      description: scenario.customDescription ?? '',
      h1: scenario.customH1 ?? '',
    },
    humanValidation: workflow.humanValidation,
    initialResult: calculateInitialResult(scenario),
    destination: workflow.destination,
  };
}

function diagnostic(
  record: PseoPublicationRecord,
  code: PseoPublicationDiagnosticCode,
  field: string,
  message: string,
): PseoPublicationDiagnostic {
  return { slug: record.canonicalSlug, code, field, message };
}

function hasValidDefaults(record: PseoPublicationRecord) {
  const values = [record.primaryValue.amount, record.defaults.rate, record.defaults.term];
  if (!values.every(Number.isFinite) || record.primaryValue.amount <= 0 || record.defaults.rate < 0 || record.defaults.term <= 0) return false;
  if (record.defaults.principal !== undefined && (!Number.isFinite(record.defaults.principal) || record.defaults.principal <= 0)) return false;
  if (record.defaults.annualIncome !== undefined && (!Number.isFinite(record.defaults.annualIncome) || record.defaults.annualIncome <= 0)) return false;
  return record.defaults.downPayment === undefined
    || (Number.isFinite(record.defaults.downPayment) && record.defaults.downPayment >= 0);
}

export function isPseoPublicationEligible(record: PseoPublicationRecord) {
  return record.state === 'indexable' && validatePseoPublicationRecord(record).length === 0;
}

export function validatePseoPublicationRecord(
  record: PseoPublicationRecord,
  context: { records?: PseoPublicationRecord[]; canonicalRegistry?: Set<string> } = {},
): PseoPublicationDiagnostic[] {
  if (record.state !== 'indexable') return [];
  const records = context.records ?? [record];
  const registry = context.canonicalRegistry ?? new Set([record.canonicalSlug]);
  const diagnostics: PseoPublicationDiagnostic[] = [];
  const evidence = record.demandEvidence;

  if (!evidence || evidence.source !== 'Google Search Console export' || evidence.observed !== true
    || evidence.period.from !== PSEO_PUBLICATION_PERIOD.from || evidence.period.to !== PSEO_PUBLICATION_PERIOD.to) {
    diagnostics.push(diagnostic(record, 'missing-demand-evidence', 'demandEvidence', 'Historical Search Console evidence and its observation period are required.'));
  }
  if (records.filter((item) => item.canonicalSlug === record.canonicalSlug).length !== 1) {
    diagnostics.push(diagnostic(record, 'duplicate-canonical-slug', 'canonicalSlug', `Canonical slug "${record.canonicalSlug}" must be unique.`));
  }
  if (!registry.has(record.canonicalSlug)) {
    diagnostics.push(diagnostic(record, 'missing-canonical-registry-entry', 'canonicalSlug', 'The indexable slug is absent from the canonical scenario registry.'));
  }
  const coherentLocale = record.currency === 'EUR'
    ? record.market === 'euro-denominated' && record.jurisdiction === 'jurisdiction-neutral'
    : record.market === 'US-dollar' && record.jurisdiction === 'US-general';
  if (!coherentLocale) {
    diagnostics.push(diagnostic(record, 'currency-market-jurisdiction-conflict', 'currency', 'Currency, market and jurisdiction must describe the same scenario family.'));
  }
  if (!hasValidDefaults(record)) {
    diagnostics.push(diagnostic(record, 'invalid-initial-parameters', 'defaults', 'Principal or income, rate, term and down payment defaults must be finite and valid.'));
  }
  if (!Number.isFinite(record.initialResult) || (record.initialResult ?? 0) <= 0) {
    diagnostics.push(diagnostic(record, 'invalid-initial-result', 'initialResult', 'The shared finance calculation must produce a finite nonzero initial result.'));
  }
  if (record.decisionQuestion.trim().length < 10 || record.distinctAnalysis.replace(/<[^>]+>/g, ' ').trim().length < 80) {
    diagnostics.push(diagnostic(record, 'missing-distinct-analysis', 'decisionQuestion', 'A specific decision question and substantive distinct analysis are required.'));
  }
  if (record.assumptionsVersion.trim() === '' || record.inclusions.length === 0 || record.exclusions.length === 0) {
    diagnostics.push(diagnostic(record, 'missing-disclosures', 'inclusions', 'Versioned assumptions, inclusions and exclusions are required.'));
  }
  if (record.claims.kind === 'sourced' && (
    record.claims.items.length === 0
    || record.claims.items.some((item) => item.claim.trim() === '' || !/^https:\/\//.test(item.sourceUrl) || !/^\d{4}-\d{2}-\d{2}$/.test(item.effectiveDate))
  )) {
    diagnostics.push(diagnostic(record, 'unsourced-material-claim', 'claims', 'Every material temporal or regulatory claim needs a primary HTTPS source and effective date.'));
  }
  const publicationText = [record.decisionQuestion, record.distinctAnalysis, ...Object.values(record.metadata)].join(' ');
  if (record.currency === 'EUR' && /(\$|\bUSD\b|\bPMI\b|\bPITI\b|homeowners insurance|\bHOA\b)/i.test(publicationText)) {
    diagnostics.push(diagnostic(record, 'currency-terminology-conflict', 'currency', 'EUR publication fields contain USD or US-only terminology.'));
  }
  const declaredLinks = [record.links.hub, record.links.tool, ...record.links.guides];
  if (record.links.guides.length === 0 || declaredLinks.some((link) => !link.startsWith('/'))) {
    diagnostics.push(diagnostic(record, 'insufficient-contextual-links', 'links', 'A hub, tool and at least one internal guide link are required.'));
  }
  if (record.author.trim() === '' || Object.values(record.metadata).some((value) => value.trim() === '')) {
    diagnostics.push(diagnostic(record, 'missing-metadata-or-author', 'metadata', 'Title, description, H1 and the real site author are required.'));
  }
  if (!record.humanValidation) {
    diagnostics.push(diagnostic(record, 'missing-human-validation', 'humanValidation', 'Human approval for indexation must be explicitly enabled.'));
  }
  return diagnostics;
}

export function getIndexablePseoScenarios<T extends PseoScenarioInput>(scenarios: readonly T[]): T[] {
  const records = scenarios.map(getPseoPublicationRecord);
  const canonicalRegistry = canonicalScenarioSlugRegistry(scenarios);
  const eligibleSlugs = new Set(
    records
      .filter((record) => validatePseoPublicationRecord(record, { records, canonicalRegistry }).length === 0)
      .filter((record) => record.state === 'indexable')
      .map((record) => record.canonicalSlug),
  );
  return scenarios.filter((scenario) => eligibleSlugs.has(scenario.slug));
}

export function getGeneratedPseoScenarios<T extends PseoScenarioInput>(scenarios: readonly T[]): T[] {
  return scenarios.filter((scenario) => {
    const state = getPseoPublicationState(scenario.slug);
    return state === 'indexable' || state === 'noindex';
  });
}

export function validatePseoPublicationInventory(scenarios: readonly PseoScenarioInput[]): PseoPublicationDiagnostic[] {
  const records = scenarios.map(getPseoPublicationRecord);
  const canonicalRegistry = canonicalScenarioSlugRegistry(scenarios);
  const diagnostics = records.flatMap((record) => validatePseoPublicationRecord(record, { records, canonicalRegistry }));
  for (const [slug, workflow] of Object.entries(PSEO_PUBLICATION_WORKFLOW)) {
    if (workflow.state === 'indexable' && !canonicalRegistry.has(slug)) {
      diagnostics.push({
        slug,
        code: 'missing-canonical-registry-entry',
        field: 'canonicalSlug',
        message: 'An indexable publication record has no matching canonical scenario.',
      });
    }
  }
  return diagnostics;
}

export function assertPseoPublicationInventory(scenarios: readonly PseoScenarioInput[]) {
  const diagnostics = validatePseoPublicationInventory(scenarios);
  if (diagnostics.length > 0) {
    throw new Error(`pSEO publication guard failed:\n${diagnostics.map((item) => `- ${item.slug} [${item.code}] ${item.message}`).join('\n')}`);
  }
}
