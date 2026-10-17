// Run with: node tests/market_chain_contract.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const window = {};
const source = fs.readFileSync(path.join(__dirname, "..", "js", "market_chain.js"), "utf8");
vm.runInNewContext(source, { window });
const rows = window.MARKET_CHAIN_DATA.rows;
const coconut = rows.find(row => row.id === "kelapa");

assert.ok(coconut, "coconut market chain exists");
assert.equal(coconut.producer.value, 3400, "owner field price farmer-to-collector remains Rp3,400");
assert.equal(coconut.producer.type, "owner_verified_field_price", "field price is not mislabeled as a national observation");
assert.equal(coconut.middleman.value, 5000, "existing game sourcing parameter is preserved");
assert.equal(coconut.middleman.type, "game_parameter", "game parameter is not misrepresented as sourced data");
assert.equal(coconut.processorPurchase.value, null, "collector-to-es-kelapa/santan input price remains unknown until verified");
assert.equal(coconut.direct.value, 13000, "owner direct-to-customer whole-coconut price remains Rp13,000");
assert.equal(coconut.direct.type, "owner_verified_field_price");
assert.equal(coconut.retailConsumer.value, null, "household final-consumer price is a separate market stage");
assert.match(window.MARKET_CHAIN_DATA.snapshotNote, /buyer\/seller transaction/);
assert.match(window.MARKET_CHAIN_DATA.missingDataPolicy, /cannot be substituted for collector-to-processor prices/);
console.log("PASS: owner field prices are immutable; processor purchase and household consumer stages remain separate.");
