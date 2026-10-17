// Run with: node tests/finance.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "finance.js"), "utf8");
function setup(now) {
  const S = {
    level: 5, gold: 30000000, day: 1,
    finance: { debt: 0, payablesPayroll: 0, loans: [] },
    dayLog: { gross: 0, expense: 0, cashIn: 0, cashOut: 0 },
    ledgerRows: []
  };
  const window = {};
  const context = {
    window, S, Math, Number, String, Array, Date: now === undefined ? Date : { now: () => now },
    ledger(cat, desc, amt, detail) { S.ledgerRows.push({ day: S.day, cat, desc, amt, detail }); },
    save() {}
  };
  vm.runInNewContext(source, context);
  return { S, finance: window.AgroFinance };
}

{
  const { S, finance } = setup();
  const beforeCash = S.gold;
  const result = finance.apply(5000000, 30);
  assert.equal(result.ok, true, "eligible borrower can originate a loan");
  const loan = result.loan;
  assert.equal(S.gold, beforeCash + 5000000, "disbursement increases cash");
  assert.equal(S.dayLog.cashIn, 5000000, "disbursement is cash inflow");
  assert.equal(loan.interestDue, 0, "no interest at origination");
  assert.equal(finance.totalDebt(), 5000000, "principal is a liability");
  assert.equal(S.dayLog.gross, 0, "loan proceeds are not operating revenue");

  S.day = 2;
  finance.accrueDay();
  assert.equal(loan.interestDue, 2500, "one day accrual is 1.5%/30 on remaining principal");
  assert.equal(S.dayLog.expense, 2500, "interest accrual enters daily expense");
  assert.equal(S.ledgerRows.filter(x => x.cat === "BEBAN_BUNGA").length, 1, "interest is recorded in ledger");
  assert.equal(S.ledgerRows.find(x => x.cat === "BEBAN_BUNGA").detail.nonCash, true, "accrual is explicitly non-cash");
  finance.accrueDay();
  assert.equal(loan.interestDue, 2500, "calling accrual twice for same day does not double count");

  const cashBeforePartial = S.gold;
  const partial = finance.repay(loan.id, 100000);
  assert.equal(partial.ok, true, "partial repayment succeeds");
  assert.equal(S.gold, cashBeforePartial - 100000, "repayment decreases cash");
  assert.equal(S.dayLog.cashOut, 100000, "repayment is cash outflow");
  assert.equal(loan.interestDue, 0, "repayment pays accrued interest first");
  assert.equal(loan.principal, 4902500, "remaining repayment reduces principal after interest");
  assert.equal(S.dayLog.expense, 2500, "repayment does not book the interest expense a second time");
  assert.equal(S.dayLog.gross, 0, "repayment is not an operating expense/revenue entry");

  S.day = 3;
  finance.accrueDay();
  const totalDue = loan.principal + loan.interestDue;
  const cashBeforeFull = S.gold;
  const full = finance.repay(loan.id, totalDue);
  assert.equal(full.ok, true, "full repayment succeeds");
  assert.equal(S.gold, cashBeforeFull - totalDue, "full repayment reduces cash by amount due");
  assert.equal(loan.principal, 0);
  assert.equal(loan.interestDue, 0);
  assert.equal(loan.status, "paid", "fully repaid loan closes");
  assert.equal(finance.totalDebt(), 0, "closed loan no longer counts as liability");
  assert.equal(S.ledgerRows.filter(x => x.cat === "CICILAN").length, 2, "both repayments recorded");
  assert.equal(finance.repay(loan.id, 1).ok, false, "paid loan cannot be repaid again");
}

{
  const { S, finance } = setup();
  S.finance.debt = 1250000;
  S.finance.payablesPayroll = 375000;
  assert.equal(finance.totalDebt(), 1625000, "summary includes legacy debt and payroll payable");
  const result = finance.apply(2000000, 30);
  assert.equal(result.ok, true);
  assert.equal(finance.totalDebt(), 3625000, "new loan is added without dropping legacy liabilities");
  S.day = result.loan.dueDay;
  finance.accrueDay();
  assert.equal(result.loan.status, "overdue", "loan becomes overdue on/after due day");
  assert.equal(
    finance.totalDebt(),
    result.loan.principal + result.loan.interestDue + 1625000,
    "overdue principal and interest remain liabilities alongside legacy obligations"
  );
}

{
  const { S, finance } = setup();
  S.level = 1;
  assert.equal(finance.apply(1000000, 30).ok, false, "ineligible level cannot borrow");
  S.level = 5;
  assert.equal(finance.apply(1000000, 30).ok, true, "eligible borrower can borrow");
  const loan = S.finance.loans[0];
  assert.equal(finance.repay(loan.id, loan.principal + 1).ok, false, "repayment above total due is rejected");
  assert.equal(finance.repay(loan.id, 0).ok, false, "zero repayment amount is rejected");
  assert.equal(finance.repay(loan.id, -1).ok, false, "negative repayment amount is rejected");
}
{
  const { S, finance } = setup(12345);
  const first = finance.apply(1000000, 30);
  const second = finance.apply(1000000, 30);
  assert.equal(first.ok, true, "first same-timestamp loan succeeds");
  assert.equal(second.ok, true, "second same-timestamp loan succeeds");
  assert.notEqual(first.loan.id, second.loan.id, "loan IDs remain unique when Date.now is identical");
  assert.equal(new Set(S.finance.loans.map(loan => loan.id)).size, 2, "loan records have unique identifiers");
  assert.equal(finance.totalDebt(), 2000000, "both distinct loans are represented in liabilities");
}

{
  const { S, finance } = setup();
  const result = finance.apply(1000000, 30);
  assert.equal(result.ok, true, "eligible loan can be originated for the rounding fixture");
  const loan = result.loan;
  loan.principal = 1001;
  loan.originalPrincipal = 1001; // Simulate a small remaining principal to exercise sub-rupiah daily interest.
  for (let day = 2; day <= 31; day++) {
    S.day = day;
    finance.accrueDay();
  }
  assert.equal(loan.interestDue, 15, "daily rounding carries fractions so 30 days approximate 1.5% monthly interest");
  assert.ok(Math.abs(loan.interestRemainder) < 0.5, "fractional rounding remainder stays bounded");
  assert.equal(S.ledgerRows.filter(x => x.cat === "BEBAN_BUNGA").reduce((sum, row) => sum + Math.abs(row.amt), 0), 15,
    "ledger interest equals the loan's accrued whole-rupiah interest");
  assert.equal(loan.status, "overdue", "loan becomes overdue on its due day");
  finance.accrueDay();
  assert.equal(loan.interestDue, 15, "repeated accrual on the same day does not double count");
}

console.log("PASS: finance origination, daily accrual, idempotence, partial/full repayment, legacy liabilities, overdue and validation.");
