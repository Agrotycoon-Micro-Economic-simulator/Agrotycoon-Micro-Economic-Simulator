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
      // Representative older save: core state exists, newer migration-managed fields are absent.
      const legacy = {
        v: 12, name: "Save Lama", avatar: 1, day: 12, phase: "pagi", gold: 4200000,
        xp: 0, level: 2, stock: { biasa: 0, super: 0 }, harvestDay: -99, quarterUsed: 0, cuaca: "panas",
        trees: Array.from({ length: 10 }, (_, slot) => ({ slot, type: "biasa", plantedDay: 0, mature: true, lastHarvest: -30 })),
        warung: { open: false, ice: 0, sugar: 0, cups: 0, operatedToday: false, fridge: false, fridgeCap: 0 },
        path: null, storyDone: true, reports: [], ledger: [], realMoney: 0, lastAdDay: 0,
        stats: { es: 0, whole: 0, tengkulak: 0, rotten: 0, missedDays: 0, lostSales: 0 }
      };
      localStorage.setItem(key, JSON.stringify(legacy));
    }, { key: SAVE_KEY });

    const home = await page.goto(baseUrl, { waitUntil: "load" });
    assert.equal(home.status(), 200);
    await page.locator("#game").waitFor({ state: "visible" });
    assert.match(await page.locator("#d-text").innerText(), /Save Lama/, "legacy player identity is restored");
    assert.match(await page.locator("#s-gold").innerText(), /4\.200\.000/, "legacy cash is preserved");
    assert.match(await page.locator("#s-day").innerText(), /12/, "legacy game day is preserved");

    let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    assert.ok(saved.dayLog && saved.dayLog.sales, "missing daily log is initialized");
    assert.ok(saved.purchases && Number.isFinite(saved.purchases.seedlingMonth), "purchase counters are initialized");
    assert.ok(saved.livingStock && Number.isFinite(saved.livingStock.rice), "household inventory defaults are initialized");
    assert.ok(saved.livingUseDays && Object.values(saved.livingUseDays).every(Number.isFinite), "household consumption counters are initialized");
    assert.ok(saved.finance && Number.isFinite(saved.finance.payablesPayroll), "finance/payroll state is initialized");
    assert.ok(Array.isArray(saved.employees), "employee list is initialized");
    assert.equal(saved.warung.autoMode, false, "legacy save receives safe manual-mode default");
    assert.equal(saved.warung.successfulSales, 0, "legacy save receives sales progression default");

    await page.goto(new URL("assets.html", baseUrl).href, { waitUntil: "load" });
    assert.match(await page.locator("#day").innerText(), /12/, "assets page can read migrated legacy save");
    await page.goto(new URL("kredit.html", baseUrl).href, { waitUntil: "load" });
    assert.ok(await page.locator("#credit-summary").innerText().length > 0, "credit page can render migrated legacy save");
    await page.goto(new URL("akuntansi.html", baseUrl).href, { waitUntil: "load" });
    assert.match(await page.locator("#acc").innerText(), /Belum ada data sesi ini|Laporan Akuntansi|Neraca Posisi Keuangan/,
      "accounting page handles legacy save without an uncaught exception");
    assert.ok(pageErrors.length === 0, `no uncaught exceptions while loading legacy save across pages: ${pageErrors.join("; ")}`);

    console.log("PASS: legacy-save browser E2E preserves core player state, initializes migration-managed fields, and loads game/assets/credit/accounting pages.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
