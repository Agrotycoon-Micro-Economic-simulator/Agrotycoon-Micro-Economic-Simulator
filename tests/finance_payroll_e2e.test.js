const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const SAVE_KEY = "agrotycoon_save_v15";
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

async function main() {
  const server = http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname); }
    catch { res.writeHead(400).end("Bad request"); return; }
    if (pathname === "/") pathname = "/index.html";
    const file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, "index.html")) {
      res.writeHead(403).end("Forbidden"); return;
    }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(err.code === "ENOENT" ? 404 : 500).end("Not found"); return; }
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" }).end(data);
    });
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", e => pageErrors.push(`${new URL(page.url()).pathname}: ${e.message}`));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    await page.addInitScript(({ key }) => {
      if (localStorage.getItem(key) !== null) return;
      const trees = Array.from({ length: 10 }, (_, slot) => ({ slot, type: "biasa", plantedDay: 0, mature: true, lastHarvest: -30 }));
      const state = {
        v: 15, name: "E2E Kredit Payroll", avatar: 0, day: 1, phase: "pagi", gold: 30000000,
        xp: 0, level: 7, stock: { biasa: 0, super: 0 }, harvestDay: -99, trees, quarterUsed: 0, cuaca: "panas",
        warung: { open: false, ice: 0, sugar: 0, cups: 0, operatedToday: false, fridge: false, fridgeCap: 0, autoMode: false, successfulSales: 0 },
        purchases: { seedlingMonth: 0, externalCoconutMonth: 0 }, tutorialSeen: {}, soundEnabled: false, path: null,
        dayLog: { gross: 0, expense: 0, cashIn: 0, cashOut: 0, shopping: 0, labor: 0, living: 0, bills: 0, capex: 0,
          lossIcePortions: 0, lossIceValue: 0, materials: { kelapa: 0, ice: 0, sugar: 0, cup: 0 },
          sales: { es: 0, esRev: 0, whole: 0, wholeRev: 0, tengkulak: 0, tengkulakRev: 0, pasar: 0, pasarRev: 0 },
          lost: 0, dailyExpenses: [], weather: "panas", buyerCount: 0 },
        reports: [], ledger: [], realMoney: 0, lastAdDay: 0, storyDone: true,
        stats: { es: 0, whole: 0, tengkulak: 0, rotten: 0, missedDays: 0, lostSales: 0 },
        livingStock: { rice: 2, lauk: 0, oil: 0, mie: 0, tempe: 0, sayur: 0, egg: 0 },
        livingUseDays: { rice: 0, egg: 0, oil: 0, mie: 0, tempe: 0, sayur: 0, lauk: 0 },
        unlockedAchievements: [], employees: [], finance: { debt: 0, payablesPayroll: 0 }
      };
      localStorage.setItem(key, JSON.stringify(state));
    }, { key: SAVE_KEY });

    await page.goto(new URL("assets.html", baseUrl).href, { waitUntil: "load" });
    await page.getByRole("button", { name: /Rekrut Pekerja tani/ }).click();
    let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    assert.equal(saved.employees.filter(e => e.active).length, 1, "employee hire persists through the UI");
    assert.match(await page.locator("#staff").innerText(), /1/);

    await page.goto(baseUrl, { waitUntil: "load" });
    await page.getByRole("button", { name: /Lanjut ke Siang/ }).click();
    await page.getByRole("button", { name: /Lanjut ke Sore/ }).click();
    await page.getByRole("button", { name: /Tidur \(Ganti Hari\)/ }).click();
    await page.waitForFunction(key => {
      try { return JSON.parse(localStorage.getItem(key)).day === 2; } catch { return false; }
    }, SAVE_KEY, { timeout: 15000 });
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    assert.ok(saved.ledger.some(row => row.cat === "GAJI" && /Upah harian/.test(row.desc)), "day transition pays wages and records the payroll expense");
    assert.ok(saved.gold < 30000000, "day transition deducts mandatory expenses and paid wages");
    assert.equal(saved.finance.payablesPayroll, 0, "sufficient cash means no unpaid wage liability");

    await page.goto(new URL("kredit.html", baseUrl).href, { waitUntil: "load" });
    await page.getByRole("button", { name: /Ajukan & cairkan/ }).click();
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    const loan = saved.finance.loans.find(item => item.status === "active");
    assert.ok(loan && loan.principal > 0, "loan application creates an active loan");
    assert.ok(saved.ledger.some(row => row.cat === "PINJAMAN" && row.amt > 0), "loan disbursement posts financing inflow");
    assert.ok(await page.locator("#credit-list").getByText(/active/).count() > 0, "active loan appears in the credit history UI");

    const initialDue = loan.principal + loan.interestDue;
    page.once("dialog", async dialog => {
      assert.equal(dialog.type(), "prompt");
      await dialog.accept(String(initialDue + 1));
    });
    page.once("dialog", async dialog => {
      assert.equal(dialog.type(), "alert", "invalid overpayment is rejected with a user-facing message");
      await dialog.accept();
    });
    await page.getByRole("button", { name: /Bayar pinjaman/ }).click();
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    let repaid = saved.finance.loans.find(item => item.id === loan.id);
    assert.equal(repaid.status, "active", "invalid overpayment leaves loan active");
    assert.equal(repaid.principal + repaid.interestDue, initialDue, "invalid overpayment does not alter the outstanding balance");
    assert.equal(saved.ledger.filter(row => row.cat === "CICILAN" && row.detail && row.detail.loanId === loan.id).length, 0,
      "invalid overpayment does not create a repayment ledger entry");

    const partialPayment = Math.min(1000000, Math.floor(initialDue / 2));
    page.once("dialog", async dialog => {
      assert.equal(dialog.type(), "prompt");
      await dialog.accept(String(partialPayment));
    });
    await page.getByRole("button", { name: /Bayar pinjaman/ }).click();
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    repaid = saved.finance.loans.find(item => item.id === loan.id);
    assert.equal(repaid.status, "active", "partial repayment keeps the loan active");
    assert.equal(repaid.principal + repaid.interestDue, initialDue - partialPayment,
      "partial repayment reduces total outstanding obligation by the payment amount");
    assert.ok(saved.ledger.some(row => row.cat === "CICILAN" && row.detail && row.detail.loanId === loan.id && row.amt === -partialPayment),
      "partial repayment posts its own financing ledger entry");

    const finalDue = repaid.principal + repaid.interestDue;
    page.once("dialog", async dialog => {
      assert.equal(dialog.type(), "prompt");
      await dialog.accept(String(finalDue));
    });
    await page.getByRole("button", { name: /Bayar pinjaman/ }).click();
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    repaid = saved.finance.loans.find(item => item.id === loan.id);
    assert.equal(repaid.status, "paid", "full repayment after partial payment marks the loan paid");
    assert.equal(repaid.principal + repaid.interestDue, 0, "full repayment clears remaining principal and accrued interest");
    assert.equal(saved.ledger.filter(row => row.cat === "CICILAN" && row.detail && row.detail.loanId === loan.id).length, 2,
      "partial and final repayment each persist a financing ledger entry");
    assert.ok(pageErrors.length === 0, `no uncaught browser exceptions: ${pageErrors.join("; ")}`);

    console.log("PASS: browser E2E covers employee hiring, daily payroll, loan disbursement, invalid overpayment rejection, partial and full repayment, and financing ledger persistence.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
