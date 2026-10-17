// Run with: node tests/payroll_accounting.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const economySource = fs.readFileSync(path.join(__dirname, "..", "js", "economy.js"), "utf8");
const staffSource = fs.readFileSync(path.join(__dirname, "..", "js", "staff.js"), "utf8");
const S = {level:7,gold:1000000,day:1,finance:{debt:0,payablesPayroll:0,loans:[]},employees:[],dayLog:{gross:0,expense:0,cashIn:0,cashOut:0,labor:0,shopping:0,living:0},ledger:[]};
const window = {};
const context = {window,S,DATA:{living:{}},Math,Number,String,Array,Date,
 ledger(cat,desc,amt,detail,accounting){S.ledger.push({day:S.day,cat,desc,amt,detail,accounting:accounting||null});},
 save(){},gainXP(){},checkAllAchievements(){},msg(){}};
vm.createContext(context);
vm.runInNewContext(economySource,context,{filename:"js/economy.js"});
vm.runInNewContext(staffSource,context,{filename:"js/staff.js"});
assert.equal(window.AgroStaff.hire("farmer").ok,true,"eligible player can hire a worker");
S.gold=100000;window.AgroStaff.payroll();
const paid=S.ledger.find(row=>row.cat==="GAJI");
assert.equal(paid.accounting.classification,"business_expense");
assert.equal(paid.accounting.debitAccount,"Beban Gaji");assert.equal(paid.accounting.creditAccount,"Kas");
assert.equal(paid.accounting.debit,75000);assert.equal(paid.accounting.credit,75000);
S.gold=0;window.AgroStaff.payroll();
const accrual=S.ledger.filter(row=>row.cat==="UTANG_GAJI").at(-1);
assert.equal(accrual.amt,-75000);assert.equal(accrual.accounting.classification,"business_expense");
assert.equal(accrual.accounting.basis,"noncash");assert.equal(accrual.accounting.debitAccount,"Beban Gaji");assert.equal(accrual.accounting.creditAccount,"Utang Gaji");
assert.equal(accrual.accounting.lines.reduce((sum,line)=>sum+line.debit,0),75000);assert.equal(accrual.accounting.lines.reduce((sum,line)=>sum+line.credit,0),75000);
assert.equal(S.finance.payablesPayroll,75000);
S.gold=25000;S.dayLog.cashOut=0;window.AgroStaff.payroll();
const repayment=S.ledger.find(row=>row.cat==="PELUNASAN_UTANG_GAJI");
assert.equal(repayment.accounting.classification,"liability_repayment");assert.equal(repayment.accounting.basis,"cash");
assert.equal(repayment.accounting.debitAccount,"Utang Gaji");assert.equal(repayment.accounting.creditAccount,"Kas");
assert.equal(repayment.accounting.debit,25000);assert.equal(repayment.accounting.credit,25000);
assert.equal(S.gold,0);assert.equal(S.dayLog.cashOut,25000);assert.equal(S.finance.payablesPayroll,125000);
console.log("PASS: paid wages, accrued unpaid wages, and arrears repayment have balanced accounting postings.");