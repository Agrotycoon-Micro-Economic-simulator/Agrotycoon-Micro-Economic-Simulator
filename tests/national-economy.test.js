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
  assert.equal(api.provinces.reduce((sum, p) => sum + p.districtCount, 0), 7285);
  assert.equal(api.provinces.reduce((sum, p) => sum + p.villageKelurahanCount, 0), 83762);
  assert.equal(api.nationalAdminTotals.desa, 75252);
  assert.equal(api.nationalAdminTotals.kelurahan, 8496);
  assert.equal(api.nationalAdminTotals.uptSpt, 14);
  assert.equal(api.bpsAdminReference.districts, 7281);
  assert.equal(api.bpsAdminReference.villageKelurahan, 84291);
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

test('government monthly imports are capped per commodity', () => {
  vm.runInContext("S = { name: 'import-cap-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  state.eventChancePerProvinceMonthly = 0;
  state.government.procurementShare = 0;
  state.government.releaseShare = 0;
  for (const province of api.provinces) {
    state.provinces[province.id].reserve.padi = 0;
    api.applyDisaster({ provinceId: province.id, type: 'drought', commodityIds: ['padi'], productionLossFraction: 0.95, logisticsLossFraction: 0, durationDays: 45 });
  }
  for (let day = 1; day <= 30; day++) api.updateDay(day);
  const monthlyDemand = api.provinces.reduce((sum, province) => sum + api.provinceSnapshot(province.id).demand.padi, 0);
  assert.ok(state.government.monthlyImportedByCommodity.padi <= monthlyDemand * 0.10 + 1e-8);
  assert.ok(state.government.monthlyImportedByCommodity.padi > 0);
});

test('official Kepmendagri locality master loads only on demand and resolves actual names/codes', async () => {
  context.fetch = async url => {
    const file = String(url).split('/').pop();
    const content = fs.readFileSync(path.join(__dirname, '..', 'data', 'administrative_regions', file), 'utf8');
    return { ok: true, status: 200, text: async () => content };
  };
  const api = context.AgroNationalEconomy;
  const master = await api.loadAdministrativeMaster();
  assert.deepEqual({ ...master.totals }, { regencies: 416, cities: 98, districts: 7285, desa: 75252, kelurahan: 8496, uptSpt: 14 });
  for (const province of api.provinces) {
    const bucket = master.byProvince[province.adminCode];
    assert.equal(province.regencyCount, bucket.regencies.length, province.id + ' regency count');
    assert.equal(province.cityCount, bucket.cities.length, province.id + ' city count');
    assert.equal(province.districtCount, bucket.districts.length, province.id + ' district count');
    assert.equal(province.desaCount, bucket.desa.length, province.id + ' desa count');
    assert.equal(province.kelurahanCount, bucket.kelurahan.length, province.id + ' kelurahan count');
    assert.equal(province.uptSptCount, bucket.uptSpt.length, province.id + ' UPT/SPT count');
  }
  const desa = await api.getLocalityAggregateAsync('lampung', 'desa', 0);
  const kelurahan = await api.getLocalityAggregateAsync('lampung', 'kelurahan', 0);
  assert.match(desa.id, /^\d{10}$/);
  assert.ok(desa.name && !desa.name.startsWith('Desa simulasi'));
  assert.equal(desa.sourceStatus, 'derived_kemendagri_2025_name_and_code');
  assert.equal(desa.populationStatus, 'equal_share_estimate_pending_official_locality_population');
  assert.match(kelurahan.id, /^\d{10}$/);
  const results = await api.searchLocalities('lampung', 'desa', '', 20);
  assert.equal(results.length, 20);
  assert.ok(results.every(row => row.id && row.name && Number.isInteger(row.index)));
});
