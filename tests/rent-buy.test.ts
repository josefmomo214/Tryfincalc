import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareRentBuy, type RentBuyInputs } from '../src/lib/finance';
const inputs: RentBuyInputs = {rent:1000,rentGrowth:0,homePrice:100000,downPercent:20,rate:0,term:30,years:1,purchaseCostPercent:0,saleCostPercent:0,appreciation:0,maintenancePercent:0,propertyTaxPercent:0,annualInsurance:0,investmentReturn:0};
test('zero-cost ownership returns all equity and costs no net money',()=>{
 const r=compareRentBuy(inputs); assert.equal(r.totalRent,12000); assert.ok(Math.abs(r.totalBuy)<1e-6);
 assert.ok(Math.abs(r.saleEquity-(20000+80000/30))<1e-6);
});
test('costs, growth and opportunity return change outcomes in expected direction',()=>{
 const base=compareRentBuy(inputs);
 assert.ok(compareRentBuy({...inputs,purchaseCostPercent:3}).totalBuy>base.totalBuy);
 assert.ok(compareRentBuy({...inputs,saleCostPercent:5}).totalBuy>base.totalBuy);
 assert.ok(compareRentBuy({...inputs,investmentReturn:5}).totalBuy>base.totalBuy);
 assert.ok(compareRentBuy({...inputs,appreciation:3}).totalBuy<base.totalBuy);
 assert.equal(compareRentBuy({...inputs,years:2,rentGrowth:10}).totalRent,25200);
 assert.equal(compareRentBuy({...inputs,propertyTaxPercent:1,maintenancePercent:1,annualInsurance:1000}).totalBuy.toFixed(2),'3000.00');
});
test('paid-off mortgage and fractional horizons reconcile',()=>{
 assert.ok(Math.abs(compareRentBuy({...inputs,term:1,years:2}).totalBuy)<1e-6);
 assert.equal(compareRentBuy({...inputs,years:1.5}).totalRent,18000);
});
test('invalid model inputs reject rather than silently produce estimates',()=>{
 for(const patch of [{downPercent:101},{investmentReturn:NaN},{years:0},{rate:-1},{saleCostPercent:101},{term:0},{appreciation:-101}]) assert.throws(()=>compareRentBuy({...inputs,...patch}),RangeError);
});
