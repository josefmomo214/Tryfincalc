import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loanTable, loanValue } from '../src/lib/content-calculations';
import { articles } from '../src/data/articles';
import { pseoData } from '../src/lib/pseo-data';
test('shared content outputs match reference cases',()=>{
 assert.equal(loanValue(80000,6,30,'monthly'),'$479.64');
 assert.equal(loanValue(400000,6.5,30,'totalInterest'),'$510,177.95');
 assert.equal(loanValue(315000,6.8,30,'totalInterest'),'$424,283.16');
 assert.match(loanTable(400000,[6.5],[30]), /\$2,528\.27/);
 assert.match(loanTable(315000,[6.8],[30]), /\$2,053\.56/);
});
test('corrected article examples use generated cents and do not leak template tokens',()=>{
 const mortgage=articles.find(a=>a.slug==='mortgage-payment-guide')!.content;
 assert.match(mortgage,/\$2,053\.56/);assert.match(mortgage,/\$424,283\.16/);
 const four=articles.find(a=>a.slug==='400k-mortgage-monthly-payment')!;
 assert.match(four.content,/\$510,177\.95/);
 assert.match(JSON.stringify(four.structuredData),/\$2,528\.27/);
 for(const record of [...articles,...pseoData]) assert.doesNotMatch(JSON.stringify(record),/\$\{(?:loanValue|loanTable|formatCurrency)/);
});
