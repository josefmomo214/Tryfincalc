import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as finance from '../src/lib/finance';

test('known monthly payments', () => {
  assert.ok(Math.abs(finance.calculateAmortizedPayment(400000, 6.5, 30) - 2528.27) <= .02);
  assert.ok(Math.abs(finance.calculateAmortizedPayment(10000, 8, 3) - 313.36) <= .02);
  assert.equal(finance.calculateAmortizedPayment(12000, 0, 1), 1000);
});
test('invalid loans cannot return nonfinite or negative payments', () => {
  for (const args of [[-1, 5, 30], [100, -1, 30], [100, 5, 0], [NaN, 5, 30], [100, Infinity, 30]]) {
    assert.equal(finance.calculateAmortizedPayment(...args as [number, number, number]), 0);
  }
});
test('currency formatting suppresses negative zero', () => {
  assert.equal(finance.formatCurrency(-0.000001, 2), '$0.00');
});
test('complete schedules reconcile principal, interest and final balance', () => {
  for (const years of [1, 20, 25, 30]) for (const rate of [0, 6.5, 100]) {
    const rows = finance.generateAmortizationSchedule(120000, rate, years);
    assert.equal(rows.length, years * 12);
    assert.equal(rows.at(-1)?.balance, 0);
    assert.ok(Math.abs(rows.reduce((sum, row) => sum + row.principal, 0) - 120000) < 1e-6);
    rows.forEach((row, index) => {
      assert.equal(row.no, index + 1);
      assert.ok(row.balance >= 0);
      assert.ok(Math.abs(row.payment - row.interest - row.principal) < 1e-7);
    });
  }
});

test('affordability is the inverse of amortization, including zero interest', () => {
  for (const currency of ['USD', 'EUR'] as const) for (const rate of [0, 6.5]) {
    const result = finance.calculateAffordability(7500, 300, 50000, rate, 30, currency);
    assert.ok(Math.abs(finance.calculateAmortizedPayment(result.loanAmount, rate, 30) - result.monthlyPayment) < 1e-7);
    assert.equal(result.maxPrice, result.loanAmount + 50000);
  }
  assert.equal(finance.calculateAffordability(1000, 2000, 100, 5, 30, 'USD').loanAmount, 0);
});
test('refinancing includes fees and both terms', () => {
  const result = finance.calculateRefinancing(12000, 0, 1, 0, 2, 600);
  assert.equal(result.newMonthly, 500);
  assert.equal(result.monthlySavings, 500);
  assert.equal(result.lifetimeSavings, -600);
  assert.equal(result.breakEven, 1.2);
  assert.equal(finance.calculateRefinancing(12000, 0, 2, 0, 1, 600).monthlySavings, -500);
});
test('rent versus buy: zero rate, fractional horizon and paid-off mortgage', () => {
  const oneYear = finance.calculateRentVsBuy(1000, 3, 100000, 20, 0, 1, 3);
  assert.equal(oneYear.totalRent, 12000);
  assert.ok(Math.abs(oneYear.totalBuy - 6000) < 1e-7);
  assert.equal(finance.calculateRentVsBuy(1000, 3, 100000, 20, 0, 1.5, 3).totalRent, 18180);
  const at25 = finance.calculateRentVsBuy(1000, 0, 100000, 20, 5, 25, 0);
  const at30 = finance.calculateRentVsBuy(1000, 0, 100000, 20, 5, 30, 0);
  const ownershipOnlyDifference = 100000 * .02 * 5 - 100000 * (1.02 ** 30 - 1.02 ** 25);
  assert.ok(Math.abs(at30.totalBuy - at25.totalBuy - ownershipOnlyDifference) < 1e-7);
});
test('currency conversion round-trips and term validation', () => {
  assert.ok(Math.abs(finance.convertCurrency(finance.convertCurrency(1234.56, 'USD', 'EUR'), 'EUR', 'USD') - 1234.56) < 1e-8);
  assert.ok(finance.validateLoan(100, 5, 0));
  assert.ok(finance.validateLoan(100, 5, .1));
  assert.equal(finance.validateLoan(100, 0, 1 / 12), '');
  assert.deepEqual(finance.generateAmortizationSchedule(100, 5, 0), []);
  assert.equal(finance.formatCurrency(Infinity), '—');
});
