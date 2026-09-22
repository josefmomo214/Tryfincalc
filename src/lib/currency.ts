import { useRouter } from 'next/router';
import { useSyncExternalStore } from 'react';
import { CURRENCY_COOKIE } from '@/lib/currency-constants';

export type DisplayCurrency = 'USD' | 'EUR';

let selectedCurrency: DisplayCurrency | undefined;
const listeners = new Set<() => void>();

function readCurrencyCookie(): DisplayCurrency | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=(USD|EUR)(?:;|$)`));
  return match?.[1] as DisplayCurrency | undefined;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): DisplayCurrency {
  return selectedCurrency ?? readCurrencyCookie() ?? 'USD';
}

export function setDisplayCurrency(currency: DisplayCurrency) {
  selectedCurrency = currency;
  if (typeof document !== 'undefined') {
    document.cookie = `${CURRENCY_COOKIE}=${currency}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }
  listeners.forEach((listener) => listener());
}

export function useDisplayCurrency() {
  const router = useRouter();
  const routeCurrency: DisplayCurrency | undefined = router.asPath.startsWith('/eur/') ? 'EUR' : undefined;
  const storedCurrency = useSyncExternalStore(subscribe, getSnapshot, () => routeCurrency ?? 'USD');

  return {
    currency: routeCurrency ?? storedCurrency,
    setCurrency: setDisplayCurrency,
  };
}
