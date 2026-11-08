const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ console, Math, Number, Object, Array, Set, String, Error, JSON });
context.window = context;
for (const file of ['js/commodities.js', 'js/region_capacity.js', 'js/state.js', 'js/national_economy.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
}
vm.runInContext("S = { name: 'national-economy-test' }", context);

test('country contains 38 provinces and exactly 200 million statistical residents', () => {
  const api = context.AgroNationalEconomy;
  assert.equal(api.provinces.length, 38);
  assert.equal(api.population, 200000000);
  const total = api.provinces.reduce((sum, p) => sum + p.population, 0);
  assert.equal(total, 200000000);
  assert.equal(api.provinces.reduce((sum, p) => sum + p.districtCount, 0), 7281);
  assert.equal(api.provinces.reduce((sum, p) => sum + p.villageKelurahanCount, 0), 84291);
  assert.equal(api.nationalAdminTotals.regencies + api.nationalAdminTotals.cities, 514);
});

test('200m residents remain aggregates and active representative agents stay between 1,000 and 5,000', () => {
  const state = context.AgroNationalEconomy.ensure();
  assert.equal(state.population, 200000000);
  assert.ok(state.activeAgents.length >= 1000);
  assert.ok(state.activeAgents.length <= 5000);
  assert.ok(state.activeAgents.length < state.population);
  assert.ok(state.activeAgents.every(agent => agent.active && agent.provinceId && agent.role && agent.behavior));
});

test('every commodity has locality-level demand aggregates without materializing residents', () => {
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  const ids = context.MARKET_ENGINE ? context.MARKET_ENGINE.catalog.map(x => x.id) : vm.runInContext('COMMODITIES.map(x => x.id)', context);
  const lampung = api.provinceSnapshot('lampung');
  assert.ok(lampung);
  for (const id of ids) assert.ok(Object.prototype.hasOwnProperty.call(lampung.demand, id));
  const country = api.getLocalityAggregate('', 'country', 0);
  const province = api.getLocalityAggregate('lampung', 'province', 0);
  assert.equal(country.population, 200000000);
  assert.equal(province.population, lampung.population);
  const desa = api.getLocalityAggregate('lampung', 'desa', 0);
  const kelurahan = api.getLocalityAggregate('lampung', 'kelurahan', 0);
  const district = api.getLocalityAggregate('lampung', 'district', 0);
  const city = api.getLocalityAggregate('lampung', 'city', 0);
  const regency = api.getLocalityAggregate('lampung', 'regency', 0);
  for (const locality of [desa, kelurahan, district, city, regency]) {
    assert.ok(locality && locality.population > 0);
    assert.equal(locality.sourceStatus, 'derived_equal_split_not_official_locality_observation');
  }
});

test('Lampung supply shock raises its local quote without directly repricing Jakarta', () => {
  const api = context.AgroNationalEconomy;
  api.ensure();
  const state = api.ensure();
  state.eventChancePerProvinceMonthly = 0;
  state.government.procurementShare = 0;
  const beforeLampung = api.quote('lampung', 'padi', 10000);
  const beforeJakarta = api.quote('dki-jakarta', 'padi', 10000);
  api.applyDisaster({ provinceId: 'lampung', type: 'banjir', commodityIds: ['padi'], productionLossFraction: 0.95, logisticsLossFraction: 0.15, durationDays: 30 });
  for (let day = 1; day <= 15; day++) api.updateDay(day);
  const afterLampung = api.quote('lampung', 'padi', 10000);
  const afterJakarta = api.quote('dki-jakarta', 'padi', 10000);
  assert.ok(afterLampung > beforeLampung);
  assert.equal(afterJakarta, beforeJakarta);
  assert.ok(state.government.monthlyReleased > 0);
});

test('government reserve policy is bounded and the province price quote is finite', () => {
  const state = context.AgroNationalEconomy.ensure();
  assert.equal(state.government.procurementShare, 0.05);
  assert.ok(state.government.importShareCap <= 0.10);
  assert.ok(Number.isFinite(context.AgroNationalEconomy.quote('lampung', 'jagung', 5992)));
});
