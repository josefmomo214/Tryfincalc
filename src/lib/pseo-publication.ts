export type PseoEditorialStatus = 'indexable' | 'noindex' | 'redirect';

export interface PseoEditorialDecision {
  status: PseoEditorialStatus;
  destination?: string;
}

export const INCOME_NEEDED_PATH = '/income-needed-for-a-house';

export const PSEO_EDITORIAL_DECISIONS = {
  '250k-mortgage-monthly-payment-3-5-percent': { status: 'noindex' },
  '400k-mortgage-monthly-payment-4-percent': { status: 'noindex' },
  '10k-personal-loan-repayment-10-percent': { status: 'noindex' },
  '25k-personal-loan-repayment-8-percent': { status: 'noindex' },
  '5k-loan-monthly-payment-12-percent': { status: 'noindex' },
  '15k-loan-monthly-payment-10-percent': { status: 'noindex' },
  'how-much-house-can-i-afford-50k-salary': { status: 'noindex' },
  'how-much-house-can-i-afford-60k-salary': { status: 'noindex' },
  'how-much-house-can-i-afford-100k-salary': { status: 'noindex' },
  '150k-mortgage-monthly-payment-3-5-percent-eur': { status: 'noindex' },
  '350k-mortgage-monthly-payment-3-5-percent-eur': { status: 'noindex' },
  '400k-mortgage-monthly-payment-3-5-percent-eur': { status: 'noindex' },
  'income-required-for-200k-house': { status: 'redirect', destination: INCOME_NEEDED_PATH },
  'income-required-for-300k-house': { status: 'redirect', destination: INCOME_NEEDED_PATH },
  'income-required-for-400k-house': { status: 'redirect', destination: INCOME_NEEDED_PATH },
  'income-required-for-500k-house': { status: 'redirect', destination: INCOME_NEEDED_PATH },
  'income-required-for-600k-house': { status: 'redirect', destination: INCOME_NEEDED_PATH },
  'income-required-for-700k-house': { status: 'redirect', destination: INCOME_NEEDED_PATH },
} as const satisfies Readonly<Record<string, PseoEditorialDecision>>;

export function getPseoEditorialDecision(slug: string): PseoEditorialDecision {
  return PSEO_EDITORIAL_DECISIONS[slug as keyof typeof PSEO_EDITORIAL_DECISIONS]
    ?? { status: 'indexable' };
}

export function getPseoEditorialStatus(slug: string): PseoEditorialStatus {
  return getPseoEditorialDecision(slug).status;
}
