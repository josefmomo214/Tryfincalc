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
test('currency conversion round-trips and term validation', () => {
  assert.ok(Math.abs(finance.convertCurrency(finance.convertCurrency(1234.56, 'USD', 'EUR'), 'EUR', 'USD') - 1234.56) < 1e-8);
  assert.ok(finance.validateLoan(100, 5, 0));
  assert.ok(finance.validateLoan(100, 5, .1));
  assert.equal(finance.validateLoan(100, 0, 1 / 12), '');
  assert.deepEqual(finance.generateAmortizationSchedule(100, 5, 0), []);
  assert.equal(finance.formatCurrency(Infinity), '-');
});

test('reference cases round only final displayed values', () => {
  for (const [principal, rate, payment, interest] of [[80000,6,479.64,92670.55124479125],[400000,6.5,2528.27,510177.95],[315000,6.8,2053.56,424283.16]]) {
    const result = finance.calculateLoan(principal, rate, 30);
    assert.equal(result.monthly.toFixed(2), payment.toFixed(2));
    if (principal !== 80000) assert.equal(result.totalInterest.toFixed(2), interest.toFixed(2));
  }
  assert.equal(finance.calculateLoan(100,0,1).totalInterest,0);
  assert.equal(finance.calculateLoan(1,0,1).monthly.toFixed(2),'0.08');
  assert.ok(Number.isFinite(finance.calculateLoan(1e12,100,100).totalPaid));
  assert.throws(() => finance.calculateLoan(100,5,0), RangeError);
});
test('affordability uses explicit US illustrative 28/36 gross-income budgets in either currency', () => {
  const usd = finance.calculateAffordability(10000,1000,50000,0,30,'USD');
  assert.equal(usd.monthlyPayment,2600);
  assert.deepEqual(finance.calculateAffordability(10000,1000,50000,0,30,'EUR'), usd);
  assert.throws(() => finance.calculateAffordability(-1,0,0,0,30,'USD'),RangeError);
});
test('refinance cannot imply immediate break-even when payments increase', () => {
  assert.equal(finance.calculateRefinancing(12000,0,2,0,1,600).breakEven,null);
  assert.throws(() => finance.calculateRefinancing(12000,0,2,0,1,-1),RangeError);
});
