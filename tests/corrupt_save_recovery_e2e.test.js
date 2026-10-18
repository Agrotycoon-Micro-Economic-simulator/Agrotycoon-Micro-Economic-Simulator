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
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.addInitScript(({ key }) => localStorage.setItem(key, "{this-is-not-valid-json"), { key: SAVE_KEY });
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    const response = await page.goto(baseUrl, { waitUntil: "load" });
    assert.equal(response.status(), 200);
    await page.locator("#onboard").waitFor({ state: "visible" });
    const raw = await page.evaluate(key => localStorage.getItem(key), SAVE_KEY);
    let recovered;
    try { recovered = JSON.parse(raw); } catch { assert.fail("corrupt save must be replaced by valid default state"); }
    assert.equal(recovered.v, 15, "recovery writes current save schema");
    assert.equal(recovered.day, 1, "corrupt save recovery starts a new game at day 1");
    assert.equal(recovered.gold, 5000000, "recovery uses configured starting cash");
    assert.equal(recovered.storyDone, false, "recovery returns player to onboarding");
    assert.ok(Array.isArray(recovered.trees) && recovered.trees.length === 10, "recovery restores the default orchard");
    assert.ok(pageErrors.length === 0, `corrupt save recovery has no uncaught browser exceptions: ${pageErrors.join("; ")}`);

    await page.reload({ waitUntil: "load" });
    await page.locator("#onboard").waitFor({ state: "visible" });
    const afterReload = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    assert.equal(afterReload.day, 1, "recovered save remains valid after a subsequent reload");
    assert.ok(pageErrors.length === 0, `recovered save reload has no uncaught exceptions: ${pageErrors.join("; ")}`);

    console.log("PASS: corrupt-save browser E2E replaces malformed JSON with a valid fresh save and remains stable after reload.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
