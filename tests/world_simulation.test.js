// Run with: node tests/world_simulation.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "..", "js", "world_simulation.js"), "utf8");

function simulate(name, days) {
  const S = { name, day: 1 };
  const window = {};
  vm.runInNewContext(source, { window, S, Math, Object, Number, String, Array });
  const sim = window.AgroWorldSim;
  assert.ok(sim, "engine exports AgroWorldSim");
  assert.ok(sim.ensure(), "engine initializes using top-level lexical S");
  const events = [];
  for (let day = 1; day <= days; day++) events.push(...sim.updateDay(day));
  const state = S.worldSim;
  assert.equal(state.dayProcessed, days, "engine processes every requested day");
  assert.ok(state.events.length <= 100, "event history is bounded");
  for (const region of Object.values(state.regions)) {
    for (const quantity of Object.values(region.inventory)) {
      assert.ok(Number.isFinite(quantity) && quantity >= 0, "inventory stays finite and nonnegative");
    }
  }
  for (const indices of Object.values(state.priceIndex)) {
    for (const price of Object.values(indices)) {
      assert.ok(Number.isFinite(price) && price >= sim.experimental.priceClamp[0] && price <= sim.experimental.priceClamp[1],
        "price indices remain finite and bounded");
    }
  }
  return { state, events };
}

const a = simulate("test-player", 365);
const b = simulate("test-player", 365);
assert.equal(JSON.stringify(a.state.events), JSON.stringify(b.state.events), "event sequence is reproducible for the same seed");
assert.equal(JSON.stringify(a.state.priceIndex), JSON.stringify(b.state.priceIndex), "price indices are reproducible for the same seed");
assert.ok(a.events.every(e => e.classification === "SIMULASI"), "generated bulletins are marked as simulation");
console.log("PASS: world simulation engine, 365-day stock/price bounds, and deterministic replay.");
