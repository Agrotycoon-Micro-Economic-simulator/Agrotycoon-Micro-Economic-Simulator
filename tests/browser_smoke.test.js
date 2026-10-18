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
    const page = await browser.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(`${new URL(page.url()).pathname}: ${error.message}`));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    const response = await page.goto(baseUrl, { waitUntil: "load" });
    assert.equal(response.status(), 200, "game homepage serves successfully");
    assert.equal(await page.title(), "Agrotycoon - Simulasi Ekonomi Desa");
    assert.equal(await page.locator("#onboard").isVisible(), true, "new player sees onboarding");

    await page.locator("#menuToggle").click();
    assert.equal(await page.locator("#sideMenu").evaluate(el => el.classList.contains("open")), true,
      "hamburger opens navigation");
    assert.equal(await page.locator("#menuToggle").getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#sideMenu").evaluate(el => el.classList.contains("open")), false,
      "Escape closes navigation");

    let validationAlert = "";
    page.once("dialog", async dialog => {
      validationAlert = dialog.message();
      await dialog.accept();
    });
    await page.getByRole("button", { name: "Mulai Perjalanan" }).click();
    assert.match(validationAlert, /Isi nama Anda dulu/, "onboarding validates an empty player name");

    await page.locator("#inp-name").fill("Pemain E2E");
    await page.getByRole("button", { name: "Mulai Perjalanan" }).click();
    assert.equal(await page.locator("#ob-story").isVisible(), true, "valid name starts story");

    let clicks = 0;
    while (await page.locator("#onboard").count() > 0 && clicks < 30) {
      await page.getByRole("button", { name: /Lanjut/ }).click();
      clicks++;
    }
    assert.ok(clicks > 0 && clicks < 30, "story finishes within expected bounded slide count");
    assert.equal(await page.locator("#game").isVisible(), true, "game becomes visible after onboarding");
    assert.match(await page.locator("#s-gold").innerText(), /5\.000\.000/, "fresh save starts with configured cash");
    assert.ok(pageErrors.length === 0, `no uncaught browser exceptions: ${pageErrors.join("; ")}`);

    await page.reload({ waitUntil: "load" });
    assert.equal(await page.locator("#onboard").count(), 0, "completed onboarding is persisted");
    assert.equal(await page.locator("#game").isVisible(), true, "saved game loads after reload");
    assert.match(await page.locator("#d-text").innerText(), /Pemain E2E/, "saved player name is restored");
    assert.ok(pageErrors.length === 0, `no uncaught browser exceptions after reload: ${pageErrors.join("; ")}`);

    const menuLinks = await page.locator("#sideMenu a").evaluateAll(links => links.map(link => link.getAttribute("href")));
    for (const href of menuLinks) {
      const route = new URL(href, baseUrl);
      const pageResponse = await page.goto(route.href, { waitUntil: "load" });
      assert.equal(pageResponse.status(), 200, `menu page ${href} serves successfully`);
      assert.ok(pageErrors.length === 0, `no uncaught browser exceptions after opening ${href}: ${pageErrors.join("; ")}`);
    }

    console.log(`PASS: browser smoke test covers onboarding/save-load plus all ${menuLinks.length} pages linked in the hamburger menu.`);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
