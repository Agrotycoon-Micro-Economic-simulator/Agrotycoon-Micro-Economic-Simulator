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

test('official Bapanas 2025 monthly demand coefficients are mapped by compatible commodity stage', () => {
  const api = context.AgroNationalEconomy;
  const source = api.bapanasMonthlyDemand2025;
  assert.equal(source.source.publisher, 'Badan Pangan Nasional');
  assert.match(source.source.title, /Proyeksi Neraca Pangan Tahun 2025/);
  assert.equal(source.source.table, 'Tabel 2.5 Koefisien Kebutuhan Pangan Bulanan Tahun 2025');
  const expected = {
    padi: [0.0849,0.0769,0.0888,0.0822,0.0849,0.0823,0.0849,0.0849,0.0822,0.0849,0.0822,0.0850],
    jagung: [0.0849,0.0767,0.0849,0.0822,0.0849,0.0822,0.0849,0.0849,0.0822,0.0849,0.0822,0.0849],
    cabai_merah: [0.0849,0.0785,0.0884,0.0822,0.0849,0.0839,0.0849,0.0849,0.0822,0.0849,0.0822,0.0853],
    cabai_rawit: [0.0849,0.0791,0.0897,0.0822,0.0849,0.0834,0.0849,0.0849,0.0822,0.0849,0.0822,0.0854],
    bawang_merah: [0.0849,0.0789,0.0910,0.0822,0.0849,0.0835,0.0849,0.0849,0.0822,0.0849,0.0822,0.0850],
    bawang_putih: [0.0849,0.0796,0.0901,0.0822,0.0849,0.0829,0.0849,0.0849,0.0822,0.0849,0.0822,0.0850],
    kedelai: [0.0849,0.0767,0.0849,0.0822,0.0849,0.0822,0.0849,0.0849,0.0822,0.0849,0.0822,0.0849]
  };
  for (const [id, values] of Object.entries(expected)) {
    assert.deepEqual(Array.from(source.records[id].coefficients), values);
    assert.equal(source.records[id].coefficients.length, 12);
  }
  const unmappedExpected = {
    daging_sapi: [0.0849,0.0811,0.0965,0.0822,0.0849,0.2336,0.0849,0.0849,0.0822,0.0849,0.0822,0.0855],
    daging_ayam: [0.0849,0.0786,0.0910,0.0822,0.0849,0.0827,0.0849,0.0849,0.0822,0.0849,0.0822,0.0857],
    telur_ayam: [0.0849,0.0825,0.0963,0.0822,0.0849,0.0824,0.0849,0.0849,0.0822,0.0849,0.0822,0.0858],
    gula_pasir: [0.0849,0.0786,0.0892,0.0822,0.0849,0.0823,0.0849,0.0849,0.0822,0.0849,0.0822,0.0850],
    minyak_goreng: [0.0849,0.0786,0.0901,0.0822,0.0849,0.0822,0.0849,0.0849,0.0822,0.0849,0.0822,0.0852]
  };
  for (const [id, values] of Object.entries(unmappedExpected)) {
    assert.deepEqual(Array.from(source.unmappedRecords[id].coefficients), values);
    assert.match(source.unmappedRecords[id].mappingStatus, /^research_only_/);
  }
  assert.equal(api.seasonalDemandFactor('daging_sapi', 151), 1);
  assert.equal(source.records.padi.mappingStatus, 'downstream_signal_rice_to_paddy_index_only');
  assert.equal(source.records.jagung.mappingStatus, 'physical_commodity_match');
  assert.equal(api.seasonalDemandCoefficient('jagung', 1), 0.0849);
  assert.equal(api.seasonalDemandCoefficient('jagung', 31), 0.0767);
  assert.equal(api.seasonalDemandCoefficient('jagung', 151), 0.0822);
  assert.equal(Number(api.seasonalDemandFactor('jagung', 31).toFixed(4)), 0.9204);
  assert.equal(Number(api.seasonalDemandFactor('padi', 61).toFixed(4)), 1.0656);
  assert.equal(api.seasonalDemandFactor('lele', 61), 1);
  // Keep the printed HBKN uplift: do not normalize the official annual coefficients to 1.
  assert.equal(Number(source.records.padi.coefficients.reduce((sum, value) => sum + value, 0).toFixed(4)), 1.0041);
  assert.equal(Number(source.records.jagung.coefficients.reduce((sum, value) => sum + value, 0).toFixed(4)), 0.9998);
  const runtime = fs.readFileSync(path.join(__dirname, '..', 'js', 'national_economy.js'), 'utf8');
  assert.match(runtime, /monthlyDemand=\(p\.demand\[id\]\|\|0\)\*seasonalDemandFactor\(id,day\)/);
  assert.match(runtime, /seasonalDemandFactor\(id,day\)\)\/30/);
});

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

test('Lampung supply shock changes its quote without cross-province price spillover', () => {
  const api = context.AgroNationalEconomy;
  vm.runInContext("S = { name: 'lampung-isolation-test' }", context);
  const control = api.ensure();
  control.eventChancePerProvinceMonthly = 0;
  control.government.procurementShare = 0;
  for (let day = 1; day <= 15; day++) api.updateDay(day);
  const controlJakartaQuote = api.quote('dki-jakarta', 'padi', 10000);

  vm.runInContext("S = { name: 'lampung-isolation-test' }", context);
  const state = api.ensure();
  state.eventChancePerProvinceMonthly = 0;
  state.government.procurementShare = 0;
  const beforeLampung = api.quote('lampung', 'padi', 10000);
  api.applyDisaster({ provinceId: 'lampung', type: 'banjir', commodityIds: ['padi'], productionLossFraction: 0.95, logisticsLossFraction: 0.15, durationDays: 30 });
  for (let day = 1; day <= 15; day++) api.updateDay(day);
  const afterLampung = api.quote('lampung', 'padi', 10000);
  const afterJakarta = api.quote('dki-jakarta', 'padi', 10000);
  assert.ok(afterLampung > beforeLampung);
  assert.equal(afterJakarta, controlJakartaQuote);
  assert.ok(state.government.monthlyReleased > 0);
  assert.ok(state.activeAgents.every(agent => agent.lastDecisionDay === 15 && agent.lastAction));
  assert.ok(Object.values(state.national.agentActionCounts).some(count => count > 0));
  assert.equal(Object.values(state.national.agentActionCounts).reduce((sum, count) => sum + count, 0), state.activeAgents.length);
});

test('government reserve policy is bounded and the province price quote is finite', () => {
  vm.runInContext("S = { name: 'government-reserve-policy-test' }", context);
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
  assert.ok(state.government.monthlyImportedByCommodity.padi <= monthlyDemand * api.seasonalDemandFactor('padi', 1) * 0.10 + 1e-8);
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
  assert.equal(desa.householdConsumption2025.status, 'not_available_at_this_administrative_depth');
  const jakartaSouth = await api.searchLocalities('dki-jakarta', 'city', '3174', 10);
  assert.equal(jakartaSouth.length, 1);
  const jakartaSouthSnapshot = await api.getLocalityAggregateAsync('dki-jakarta', 'city', jakartaSouth[0].index);
  assert.equal(jakartaSouthSnapshot.id, '3174');
  assert.equal(jakartaSouthSnapshot.population, context.AgroNationalEconomy.bpsKabkotaSimulationPopulation2025['3174']);
  assert.equal(jakartaSouthSnapshot.sourcePopulation, 2219220);
  assert.equal(jakartaSouthSnapshot.populationStatus, 'official_bps_2025_weights_scaled_to_game_population');
  assert.match(jakartaSouthSnapshot.populationSource, /BPS DKI Jakarta/);
  assert.equal(jakartaSouthSnapshot.householdConsumption2025.recordCount, 26);
  assert.equal(jakartaSouthSnapshot.householdConsumption2025.population, context.AgroNationalEconomy.bpsKabkotaSimulationPopulation2025['3174']);
  assert.equal(jakartaSouthSnapshot.householdConsumption2025.sourcePopulation, 2219220);
  assert.equal(jakartaSouthSnapshot.householdConsumption2025.populationStatus, 'official_bps_2025_weights_scaled_to_game_population');
  assert.equal(jakartaSouthSnapshot.householdConsumption2025.physicalDemand.jagung.annualTotal, 1.7 * context.AgroNationalEconomy.bpsKabkotaSimulationPopulation2025['3174']);
  assert.equal(jakartaSouthSnapshot.householdConsumption2025.rows.ikan.annualPerCapita, 25.2);
  assert.equal(jakartaSouthSnapshot.demandLayers.household.status, 'partial_verified_observations');
  assert.match(jakartaSouthSnapshot.localMarketQuoteStatus, /not_order_book_clearing/);
  const results = await api.searchLocalities('lampung', 'desa', '', 20);
  assert.equal(results.length, 20);
  assert.ok(results.every(row => row.id && row.name && Number.isInteger(row.index)));
});
test('official 2025 physical demand anchors remain separate from the synthetic demand index', () => {
  const api = context.AgroNationalEconomy;
  vm.runInContext("S = { name: 'physical-demand-anchor-test' }", context);
  const state = api.ensure();
  const national = api.physicalDemandSnapshot();
  assert.equal(national.population, 200000000);
  assert.equal(national.anchors.jagung.annualPerCapita, 1.5);
  assert.equal(national.anchors.jagung.annualTotal, 300000000);
  assert.equal(national.anchors.jagung.monthlyTotal, 25000000);
  assert.equal(national.anchors.ubi_kayu.annualPerCapita, 10.9);
  assert.equal(national.anchors.kedelai.annualPerCapita, 8.8);
  assert.equal(national.anchors.kelapa.status, 'official_consumption_anchor_conversion_pending');
  assert.equal(state.provinces.lampung.physicalDemand.jagung.monthlyTotal, national.anchors.jagung.monthlyTotal * state.provinces.lampung.population / 200000000);
  assert.equal(api.physicalDemandAnchors2025.jagung.source, 'Bapanas konsumsi nasional update 2025');
  assert.equal(api.physicalDemandAnchors2025.kelapa.unit, 'kg');
});


test('official Bapanas household-consumption sources are registered at province and kabupaten/kota depth', () => {
  const api = context.AgroNationalEconomy;
  assert.equal(api.sources.provincialHouseholdConsumption.period, '2025');
  assert.equal(api.sources.provincialHouseholdConsumption.unit, 'kg/kap/tahun');
  assert.equal(api.sources.provincialHouseholdConsumption.depth, 'province');
  assert.match(api.sources.provincialHouseholdConsumption.url, /data\.badanpangan\.go\.id\/datasetpublications\/x1y\/konsumsi-provinsi/);
  assert.equal(api.sources.regencyCityHouseholdConsumption.depth, 'regency_city');
  assert.equal(api.sources.regencyCityHouseholdConsumption.unit, 'kg/kap/tahun');
  assert.match(api.sources.regencyCityHouseholdConsumption.url, /data\.badanpangan\.go\.id\/datasetpublications\/4wx\/rata-rata-konsumsi-kab-kota/);
  assert.equal(api.sources.nonHouseholdConsumption.status, 'official_source_metadata_only_numeric_extraction_pending');
});

test('every Bapanas national 2025 leaf consumption record is represented in the runtime model and has a game mapping mode', () => {
  const api = context.AgroNationalEconomy;
  const rows = api.bapanasNationalConsumption2025;
  const model = api.bapanasConsumptionModel2025;
  assert.equal(rows.length, 28);
  for (const [key, group, sourceCommodity, value] of rows) {
    assert.ok(model.rows[key], key + ' missing runtime model');
    assert.equal(model.rows[key].year, 2025);
    assert.equal(model.rows[key].unit, 'kg/kap/tahun');
    assert.equal(model.rows[key].sourceCommodity, sourceCommodity);
    assert.equal(model.rows[key].annualPerCapita, value);
    assert.notEqual(model.rows[key].mappingStatus, 'unmapped', key + ' must affect a game demand signal');
  }
  assert.equal(model.rows.jagung.mappingStatus, 'physical');
  assert.equal(model.rows.beras.mappingStatus, 'downstream_signal');
  assert.equal(model.rows.kelapa.mappingStatus, 'unit_conversion_pending');
});

test('Bapanas consumption data changes runtime demand signals rather than remaining inert source metadata', () => {
  const api = context.AgroNationalEconomy;
  vm.runInContext("S = { name: 'bapanas-runtime-demand-test' }", context);
  const state = api.ensure();
  const baseline = state.provinces.lampung.demand.jagung;
  assert.notEqual(state.provinces.lampung.consumptionPressure.jagung, state.provinces.lampung.baseConsumptionPressure.jagung);
  assert.equal(state.provinces.lampung.regionalPhysicalDemand.jagung.annualPerCapita, 1.0);
  for (let day = 1; day <= 2; day++) api.updateDay(day);
  assert.notEqual(state.provinces.lampung.inventory.jagung, baseline * 0.5);
  assert.ok(Number.isFinite(api.quote('lampung', 'jagung', 5992)));
  assert.ok(state.provinces.lampung.physicalDemand.jagung.monthlyTotal > 0);
});


test('verified Bapanas Lampung 2025 leaf observations change physical demand and regional NPC behavior', () => {
  vm.runInContext("S = { name: 'bapanas-lampung-regional-demand-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  const lampung = state.provinces.lampung;
  const nationalPressure = lampung.baseConsumptionPressure.jagung;
  assert.equal(lampung.regionalConsumption2025.recordCount, 11);
  assert.equal(lampung.regionalConsumption2025.status, 'partial_verified_observations');
  assert.equal(state.regionalConsumptionCoverage.status, 'partial_province_coverage');
  assert.equal(lampung.regionalPhysicalDemand.jagung.annualPerCapita, 1.0);
  assert.equal(lampung.regionalPhysicalDemand.jagung.annualTotal, lampung.population);
  assert.ok(Math.abs(lampung.consumptionPressure.jagung - nationalPressure * (1.0 / 1.5)) < 1e-10);
  assert.ok(Math.abs(lampung.consumptionPressure.ubi_kayu - lampung.baseConsumptionPressure.ubi_kayu * (12.4 / 10.9)) < 1e-10);
  assert.ok(Math.abs(lampung.consumptionPressure.padi - lampung.baseConsumptionPressure.padi * (84.3 / 87.3)) < 1e-10);
  const livestockRatio = (4.2 + 8.0 + 7.6 + 1.7) / (5.1 + 10.5 + 7.7 + 2.3);
  const livestockItem = vm.runInContext("COMMODITIES.find(item => item.category === 'peternakan')", context);
  assert.ok(livestockItem);
  assert.ok(Math.abs(lampung.consumptionPressure[livestockItem.id] - lampung.baseConsumptionPressure[livestockItem.id] * livestockRatio) < 1e-8);
  const before = lampung.inventory.jagung;
  api.updateDay(1);
  assert.notEqual(lampung.inventory.jagung, before);
  assert.ok(Number.isFinite(api.quote('lampung', 'jagung', 5992)));
  assert.equal(state.provinces['dki-jakarta'].regionalConsumption2025, undefined);
});

test('regional Bapanas ingestion rejects duplicate, invalid-year, and province-code-mismatched observations', () => {
  vm.runInContext("S = { name: 'bapanas-regional-validation-test' }", context);
  const api = context.AgroNationalEconomy;
  api.ensure();
  const valid = { provinceId: 'lampung', provinceCode: '18', key: 'jagung', sourceCommodity: 'Jagung', group: 'Padi-Padian', annualPerCapita: 1.0, year: 2025, unit: 'kg/kap/tahun' };
  assert.throws(() => api.applyProvincialConsumptionRecords([valid, valid]), /Duplicate Bapanas/);
  assert.throws(() => api.applyProvincialConsumptionRecords([Object.assign({}, valid, { year: 2024 })]), /Invalid Bapanas/);
  assert.throws(() => api.applyProvincialConsumptionRecords([Object.assign({}, valid, { provinceCode: '19' })]), /mismatched Bapanas/);
});


test('existing national economy saves migrate regional consumption layers without discarding the national baseline', () => {
  vm.runInContext("S = { name: 'regional-consumption-save-migration-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  state.regionalConsumptionSeedVersion = undefined;
  for (const province of Object.values(state.provinces)) {
    province.consumptionPressure = Object.assign({}, province.baseConsumptionPressure);
    delete province.baseConsumptionPressure;
    delete province.regionalPhysicalDemand;
    delete province.regionalConsumption2025;
  }
  const migrated = api.ensure();
  assert.equal(migrated.regionalConsumptionSeedVersion, 1);
  assert.equal(migrated.provinces.lampung.regionalPhysicalDemand.jagung.annualPerCapita, 1.0);
  assert.equal(migrated.provinces.lampung.physicalDemand.jagung.annualPerCapita, 1.5);
  assert.equal(migrated.provinces['dki-jakarta'].regionalConsumption2025, undefined);
});



test('official BPS 2025 population weights cover all six DKI kabupaten/kota and reconcile to the province total', () => {
  vm.runInContext("S = { name: 'bps-dki-population-2025-test' }", context);
  const api = context.AgroNationalEconomy;
  const population = api.bpsKabkotaPopulation2025;
  assert.equal(population['3101'].population, 29090);
  assert.equal(population['3171'].population, 1038400);
  assert.equal(population['3172'].population, 1819010);
  assert.equal(population['3173'].population, 2487200);
  assert.equal(population['3174'].population, 2219220);
  assert.equal(population['3175'].population, 3085060);
  assert.equal(Object.values(population).reduce((sum, row) => sum + row.population, 0), 10677980);
  const gamePopulation = api.bpsKabkotaSimulationPopulation2025;
  assert.equal(Object.values(gamePopulation).reduce((sum, value) => sum + value, 0), api.provinceSnapshot('dki-jakarta').population);
  const snapshot = api.localityConsumptionSnapshot('3174');
  assert.equal(snapshot.population, gamePopulation['3174']);
  assert.equal(snapshot.sourcePopulation, 2219220);
  assert.equal(snapshot.populationStatus, 'official_bps_2025_weights_scaled_to_game_population');
  assert.equal(snapshot.physicalDemand.jagung.annualTotal, 1.7 * gamePopulation['3174']);
});

test('verified Bapanas 2025 Kepulauan Seribu locality observations drive a locality-specific demand quote', () => {
  vm.runInContext("S = { name: 'bapanas-kepulauan-seribu-locality-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  const local = api.localityConsumptionSnapshot('3101');
  assert.ok(local);
  assert.equal(local.localityName, 'Administrasi Kepulauan Seribu');
  assert.equal(local.recordCount, 26);
  assert.deepEqual(Object.keys(local.rows).sort(), ['beras', 'buah', 'daging_ruminansia', 'daging_unggas', 'gula_merah', 'gula_pasir', 'ikan', 'jagung', 'kacang_hijau', 'kacang_lain', 'kacang_tanah', 'kedelai', 'kelapa', 'kemiri', 'kentang', 'minyak_kelapa', 'minyak_lainnya', 'minyak_sawit', 'sagu', 'sayur', 'singkong', 'susu', 'telur', 'terigu', 'ubi_jalar', 'umbi_lainnya'].sort());
  assert.equal(local.rows.terigu.annualPerCapita, 13.1);
  assert.equal(local.rows.daging_unggas.annualPerCapita, 9);
  assert.equal(local.rows.ikan.annualPerCapita, 45.4);
  assert.equal(local.rows.minyak_sawit.annualPerCapita, 14.3);
  assert.equal(local.rows.sayur.annualPerCapita, 47.1);
  assert.equal(local.rows.buah.annualPerCapita, 35.9);
  assert.equal(local.rows.umbi_lainnya.annualPerCapita, 0);
  assert.equal(local.rows.beras.annualPerCapita, 88.6);
  assert.equal(local.rows.jagung.annualPerCapita, 0.2);
  assert.equal(local.physicalDemand.jagung.annualPerCapita, 0.2);
  assert.equal(local.population, api.bpsKabkotaSimulationPopulation2025['3101']);
  assert.equal(local.sourcePopulation, 29090);
  assert.equal(local.populationStatus, 'official_bps_2025_weights_scaled_to_game_population');
  assert.equal(local.physicalDemand.jagung.annualTotal, 0.2 * api.bpsKabkotaSimulationPopulation2025['3101']);
  const quote = api.quoteLocality('3101', 'jagung', 5992);
  assert.ok(Number.isFinite(quote));
  assert.ok(quote < api.quote('dki-jakarta', 'jagung', 5992));
  assert.equal(state.kabkotaConsumptionCoverage.status, 'partial_verified_observations');
  assert.equal(state.kabkotaConsumptionSeedVersion, 4);
  assert.ok(api.quoteLocality('3101', 'lele', 26000) > 0);
});


test('three additional DKI Jakarta localities load 26 verified leaf records and produce differentiated local quotes', () => {
  vm.runInContext("S = { name: 'bapanas-jakarta-locality-expansion-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  for (const code of ['3171', '3172', '3173', '3174', '3175']) {
    const local = api.localityConsumptionSnapshot(code);
    assert.ok(local, code + ' locality snapshot');
    assert.equal(local.recordCount, 26);
    assert.equal(local.coverageStatus, 'partial_verified_observations');
    assert.equal(Object.keys(local.rows).length, 26);
  }
  assert.equal(api.localityConsumptionSnapshot('3171').rows.ikan.annualPerCapita, 17.1);
  assert.equal(api.localityConsumptionSnapshot('3173').rows.sayur.annualPerCapita, 49.6);
  assert.equal(api.localityConsumptionSnapshot('3172').rows.ikan.annualPerCapita, 27.5);
  assert.equal(api.localityConsumptionSnapshot('3174').rows.ikan.annualPerCapita, 25.2);
  assert.equal(api.localityConsumptionSnapshot('3172').rows.ikan.annualPerCapita, 27.5);
  assert.equal(api.localityConsumptionSnapshot('3172').rows.terigu.annualPerCapita, 20.3);
  assert.equal(api.localityConsumptionSnapshot('3175').rows.ikan.annualPerCapita, 24.7);
  assert.equal(api.localityConsumptionSnapshot('3175').rows.minyak_kelapa.annualPerCapita, 0);
  assert.equal(api.localityConsumptionSnapshot('3175').rows.ikan.annualPerCapita, 24.7);
  assert.equal(state.kabkotaConsumptionCoverage.localityCount, 6);
  assert.equal(state.kabkotaConsumptionCoverage.recordCount, 156);
  assert.ok(api.quoteLocality('3174', 'lele', 26000) < api.quoteLocality('3101', 'lele', 26000));
});

test('kabupaten/kota Bapanas ingestion rejects invalid codes, units and duplicate commodity observations', () => {
  vm.runInContext("S = { name: 'bapanas-kabkota-validation-test' }", context);
  const api = context.AgroNationalEconomy;
  api.ensure();
  const valid = { localityCode: '3174', provinceId: 'dki-jakarta', provinceCode: '31', localityName: 'Kota Administrasi Jakarta Selatan', key: 'jagung', sourceCommodity: 'Jagung', group: 'Padi-Padian', annualPerCapita: 1.7, year: 2025, unit: 'kg/kap/tahun' };
  assert.throws(() => api.applyKabupatenKotaConsumptionRecords([valid, valid]), /Duplicate Bapanas locality/);
  assert.throws(() => api.applyKabupatenKotaConsumptionRecords([Object.assign({}, valid, { localityCode: '31A4' })]), /Invalid Bapanas kabupaten\/kota/);
  assert.throws(() => api.applyKabupatenKotaConsumptionRecords([Object.assign({}, valid, { unit: 'kg/kap/bulan' })]), /Invalid Bapanas kabupaten\/kota/);
  assert.throws(() => api.applyKabupatenKotaConsumptionRecords([Object.assign({}, valid, { provinceCode: '32' })]), /mismatched province code/);
});


test('complete DKI locality consumption and BPS weights feed province daily demand and inventory', () => {
  vm.runInContext("S = { name: 'bapanas-dki-runtime-demand-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  const province = state.provinces['dki-jakarta'];
  assert.equal(province.localityConsumption2025.status, 'complete_population_weighted_daily_demand_applied');
  assert.equal(province.localityConsumption2025.localityCount, 6);
  assert.equal(province.localityConsumption2025.expectedLocalityCount, 6);
  assert.equal(province.localityConsumption2025.leafKeyCount, 26);
  assert.equal(province.localityConsumption2025.recordCount, 156);
  assert.notEqual(province.consumptionPressure.jagung, province.baseConsumptionPressure.jagung);
  assert.equal(province.regionalPhysicalDemand.jagung.status, 'official_locality_leafs_weighted_by_bps_population');
  assert.equal(province.regionalPhysicalDemand.jagung.annualTotal, province.regionalPhysicalDemand.jagung.annualPerCapita * province.population);
  const before = province.inventory.jagung;
  api.updateDay(1);
  assert.notEqual(province.inventory.jagung, before);
  assert.equal(state.dayProcessed, 1);
});


test('daily regional production and demand are exposed as executed runtime signals for NPC order proposals', () => {
  vm.runInContext("S = { name: 'npc-daily-regional-flow-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  state.eventChancePerProvinceMonthly = 0;
  api.updateDay(1);
  const lampung = api.provinceSnapshot('lampung');
  assert.ok(lampung.dailyProduction.jagung > 0);
  assert.ok(lampung.dailyDemand.jagung > 0);
  assert.equal(lampung.dailyProduction.jagung, state.provinces.lampung.dailyProduction.jagung);
  assert.equal(lampung.dailyDemand.jagung, state.provinces.lampung.dailyDemand.jagung);
  assert.equal(lampung.unmetDemand.jagung, state.provinces.lampung.unmetDemand.jagung);
});


test('executed NPC order-book fills consume regional marketable stock and satisfy only the matched unmet demand', () => {
  vm.runInContext("S = { name: 'regional-order-book-settlement-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  const lampung = state.provinces.lampung;
  lampung.inventory.jagung = 50;
  lampung.unmetDemand.jagung = 20;
  const result = api.applyOrderBookFills([{
    fillId: 'fill-test-1', commodityId: 'jagung', regionId: 'lampung',
    sellerId: 'npc-producer-pool-lampung', buyerId: 'npc-buyer-pool-lampung',
    quantity: 10, price: 6200, executedAt: 1
  }]);
  assert.equal(result.ok, true);
  assert.equal(result.applied, 1);
  assert.equal(lampung.inventory.jagung, 40);
  assert.equal(lampung.unmetDemand.jagung, 10);
  assert.equal(lampung.tradeIndex.jagung.quantity, 10);
  assert.equal(lampung.tradeIndex.jagung.notional, 62000);
  const rejected = api.applyOrderBookFills([{
    fillId: 'fill-test-2', commodityId: 'jagung', regionId: 'lampung',
    sellerId: 'npc-producer-pool-lampung', buyerId: 'npc-buyer-pool-lampung',
    quantity: 100, price: 6200, executedAt: 1
  }]);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, 'regional_market_stock_shortfall:jagung');
  assert.equal(lampung.inventory.jagung, 40);
  assert.equal(lampung.unmetDemand.jagung, 10);
});


test('non-DKI locality demand uses hierarchical population allocation instead of province-wide equal split', async () => {
  const api = context.AgroNationalEconomy;
  const master = await api.loadAdministrativeMaster();
  const province = api.provinces.find(p => p.id === 'lampung');
  const state = api.ensure();
  const bucket = master.byProvince[province.adminCode];
  const firstRegency = bucket.regencies[0];
  const firstDistrict = bucket.districts.find(row => row.regency_id === firstRegency.id);
  const firstVillage = master.villages.find(row => row.district_id === firstDistrict.id);
  const regencyIndex = bucket.regencies.findIndex(row => row.id === firstRegency.id);
  const districtIndex = bucket.districts.findIndex(row => row.id === firstDistrict.id);
  const villageIndex = master.villages.findIndex(row => row.id === firstVillage.id);
  const regency = await api.getLocalityAggregateAsync('lampung', 'regency', regencyIndex);
  const district = await api.getLocalityAggregateAsync('lampung', 'district', districtIndex);
  const village = await api.getLocalityAggregateAsync('lampung', 'desa', bucket.desa.findIndex(row => row.district_id === firstDistrict.id));
  assert.equal(regency.populationStatus, 'derived_hierarchical_equal_share_pending_official_locality_population');
  assert.equal(district.populationStatus, 'derived_hierarchical_equal_share_pending_official_locality_population');
  assert.equal(village.populationStatus, 'derived_hierarchical_equal_share_pending_official_locality_population');
  assert.ok(regency.population > 0);
  assert.ok(district.population > 0);
  assert.ok(village.population > 0);
  assert.ok(district.population < regency.population);
  assert.ok(village.population <= district.population);
  assert.equal(village.population, Math.floor(district.population / master.villages.filter(row => row.district_id === firstDistrict.id).length) +
    (master.villages.filter(row => row.district_id === firstDistrict.id).findIndex(row => row.id === firstVillage.id) < district.population % master.villages.filter(row => row.district_id === firstDistrict.id).length ? 1 : 0));
  assert.equal(state.provinces.lampung.population, province.population);
});
