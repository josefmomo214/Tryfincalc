import React from 'react';
import { formatCurrency, type ScheduleItem } from '@/lib/finance';

interface Props {
  schedule: ScheduleItem[];
  currency: 'USD' | 'EUR';
  showFullSchedule: boolean;
  validationError: string;
  onToggle: () => void;
}

export function AmortizationTable({ schedule, currency, showFullSchedule, validationError, onToggle }: Props) {
  return (
    <>
      {/* Table section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-surface rounded-3xl overflow-hidden border border-outline-variant/20 shadow-xl">
          <div className="px-8 py-6 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
            <h2 className="text-xl font-manrope font-bold text-primary">Detailed Amortization Table</h2>
            <span className="text-xs font-bold text-on-surface-variant uppercase bg-white dark:bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant/20">{schedule.length} Payments</span>
          </div>
          <div id="amortization-table" role="region" aria-label="Monthly amortization payments" tabIndex={0} className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-primary/20">
            {!validationError ? (
              <table className="min-w-full divide-y divide-outline-variant/10">
                <caption className="sr-only">Monthly payments showing principal, interest and remaining balance</caption>
                <thead className="bg-surface sticky top-0 z-10 shadow-sm border-b border-outline-variant/20">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">No.</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Payment</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Principal</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Interest</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Interest</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-container-lowest divide-y divide-outline-variant/10">
                  {(showFullSchedule ? schedule : schedule.slice(0, 12)).map((row) => (
                    <React.Fragment key={row.no}>
                      <tr className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-on-surface-variant">{row.no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-bold">{formatCurrency(row.payment, 2, currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{formatCurrency(row.principal, 2, currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{formatCurrency(row.interest, 2, currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{formatCurrency(row.totalInterest, 2, currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface font-bold">{formatCurrency(row.balance, 2, currency)}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-40 text-center">
                <p className="text-xl font-medium text-on-surface-variant/40 italic">
                  Complete the form to generate your full amortization roadmap
                </p>
              </div>
            )}
          </div>
          <div className="px-8 py-4 bg-surface-container-lowest text-center">
            {!validationError && schedule.length > 12 && <button type="button" aria-expanded={showFullSchedule} aria-controls="amortization-table" onClick={onToggle} className="rounded-xl border border-primary px-6 py-3 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4">
              {showFullSchedule ? 'Show fewer payments' : 'Show full schedule'}
            </button>}
            <p className="mt-3 text-xs text-on-surface-variant">Showing {validationError ? 0 : showFullSchedule ? schedule.length : Math.min(12, schedule.length)} of {schedule.length} monthly payments.</p>
          </div>
        </div>
      </section>
    </>
  );
}
