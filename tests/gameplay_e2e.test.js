const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};
const SAVE_KEY = "agrotycoon_save_v15";

async function main() {
  const server = http.createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    } catch {
      res.writeHead(400).end("Bad request");
      return;
    }
    if (pathname === "/") pathname = "/index.html";
    const file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, "index.html")) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(err.code === "ENOENT" ? 404 : 500).end("Not found");
        return;
      }
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(`${new URL(page.url()).pathname}: ${error.message}`));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    await page.addInitScript(({ key }) => {
      const trees = Array.from({ length: 10 }, (_, slot) => ({
        slot, type: "biasa", plantedDay: 0, mature: true, lastHarvest: -30
      }));
      const state = {
        v: 15, name: "E2E Agrotycoon", avatar: 0, day: 1, phase: "pagi",
        gold: 5000000, xp: 0, level: 1, stock: { biasa: 0, super: 0 },
        harvestDay: -99, trees, quarterUsed: 0, cuaca: "panas",
        warung: { open: false, ice: 0, sugar: 0, cups: 0, operatedToday: false, fridge: false, fridgeCap: 0, autoMode: false, successfulSales: 0 },
        purchases: { seedlingMonth: 0, externalCoconutMonth: 0 }, tutorialSeen: {},
        soundEnabled: false, path: null,
        dayLog: { gross: 0, expense: 0, cashIn: 0, cashOut: 0, shopping: 0, labor: 0, living: 0, bills: 0, capex: 0, lossIcePortions: 0, lossIceValue: 0,
          materials: { kelapa: 0, ice: 0, sugar: 0, cup: 0 },
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

    const home = await page.goto(baseUrl, { waitUntil: "load" });
    assert.equal(home.status(), 200);
    await page.locator("#game").waitFor({ state: "visible" });
    assert.match(await page.locator("#s-gold").innerText(), /5\.000\.000/);

    await page.getByRole("button", { name: /Panen/ }).click();
    const stockAfterHarvest = await page.locator("#s-stock").innerText();
    assert.match(stockAfterHarvest, /muda/, "harvest puts fresh coconuts into stock");
    let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    assert.ok(saved.ledger.some(row => row.cat === "TENAGA" && row.amt < 0), "harvest posts labor cost");
    assert.ok(saved.stock.biasa + saved.stock.super > 0, "harvested quantity is persisted");

    await page.getByRole("button", { name: /Lanjut ke Siang/ }).click();
    await page.getByRole("button", { name: /Jual ke Tengkulak/ }).click();
    await page.getByRole("button", { name: /Jual Semua/ }).click();
    assert.match(await page.locator("#s-stock").innerText(), /Gudang kosong/, "sale clears the sold stock");
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    const sale = saved.ledger.find(row => row.cat === "PENJUALAN" && /Jual tengkulak/.test(row.desc));
    assert.ok(sale && sale.amt > 0, "sale posts positive revenue to the ledger");
    assert.equal(saved.stock.biasa + saved.stock.super, 0, "no sold coconuts remain in stock");
    assert.equal(saved.dayLog.sales.tengkulak, saved.stats.tengkulak, "sale quantity is reflected in daily log and stats");

    await page.getByRole("button", { name: /Lanjut ke Sore/ }).click();
    await page.getByRole("button", { name: /Tidur \(Ganti Hari\)/ }).click();
    await page.waitForFunction(key => {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      try { return JSON.parse(raw).day === 2; } catch { return false; }
    }, SAVE_KEY, { timeout: 15000 });
    saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    assert.equal(saved.phase, "pagi", "day transition returns the game to morning");
    assert.ok(saved.reports.some(report => report.day === 1), "day transition records a daily report");
    assert.ok(saved.ledger.some(row => row.cat === "TENAGA"), "harvest expense remains in ledger after day transition");
    assert.ok(saved.ledger.some(row => row.cat === "PENJUALAN" && /Jual tengkulak/.test(row.desc)), "sale remains in ledger after day transition");
    assert.ok(pageErrors.length === 0, `no uncaught game-page exceptions: ${pageErrors.join("; ")}`);

    const accounting = await page.goto(new URL("akuntansi.html", baseUrl).href, { waitUntil: "load" });
    assert.equal(accounting.status(), 200);
    await page.locator("#acc").waitFor({ state: "visible" });
    const accountingText = await page.locator("#acc").innerText();
    assert.match(accountingText, /Penjualan/, "accounting report includes sales account");
    assert.match(accountingText, /Beban Tenaga Kerja/, "accounting journal includes harvest labor account");
    assert.match(accountingText, /Jual tengkulak/, "accounting journal includes the sale description");
    assert.match(accountingText, /Upah kuli panen/, "accounting journal includes harvest labor description");
    assert.ok(pageErrors.length === 0, `no uncaught exceptions on accounting page: ${pageErrors.join("; ")}`);

    console.log("PASS: browser E2E verifies harvest → tengkulak sale → day transition → persisted ledger/report → accounting UI.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
