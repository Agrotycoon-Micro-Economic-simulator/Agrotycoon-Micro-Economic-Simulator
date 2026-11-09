const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ console, Math, Number, Object, Array, Set, String, Error, JSON });
context.window = context;
for (const file of ['js/commodities.js', 'js/commodity_storage.js', 'js/region_capacity.js', 'js/state.js', 'js/real_economic_data.js', 'js/national_economy.js']) {
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
  const controlJakartaQuote = api.quote('dki-jakarta', 'padi', 6000);

  vm.runInContext("S = { name: 'lampung-isolation-test' }", context);
  const state = api.ensure();
  state.eventChancePerProvinceMonthly = 0;
  state.government.procurementShare = 0;
  const beforeLampung = api.quote('lampung', 'padi', 6000);
  api.applyDisaster({ provinceId: 'lampung', type: 'banjir', commodityIds: ['padi'], productionLossFraction: 0.95, logisticsLossFraction: 0.15, durationDays: 30 });
  for (let day = 1; day <= 15; day++) api.updateDay(day);
  const afterLampung = api.quote('lampung', 'padi', 6000);
  const afterJakarta = api.quote('dki-jakarta', 'padi', 6000);
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
  assert.equal(desa.populationStatus, 'derived_hierarchical_equal_share_pending_official_locality_population');
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
  assert.equal(lampung.dailyPhysicalDemand.jagung, state.provinces.lampung.dailyPhysicalDemand.jagung);
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


test('non-DKI locality demand index follows hierarchical population share and conserves province demand', async () => {
  const api = context.AgroNationalEconomy;
  const master = await api.loadAdministrativeMaster();
  const province = api.provinces.find(p => p.id === 'lampung');
  const state = api.ensure();
  const bucket = master.byProvince[province.adminCode];
  const regencyIndex = 0;
  const regency = await api.getLocalityAggregateAsync('lampung', 'regency', regencyIndex);
  assert.ok(regency);
  const expected = state.provinces.lampung.demand.jagung * (regency.population / state.provinces.lampung.population);
  assert.equal(regency.monthlyDemandIndex.jagung, expected);
  const childRows = bucket.districts.filter(row => row.regency_id === bucket.regencies[0].id);
  let childDemand = 0;
  for (let i = 0; i < childRows.length; i++) {
    const row = await api.getLocalityAggregateAsync('lampung', 'district', bucket.districts.findIndex(x => x.id === childRows[i].id));
    childDemand += row.monthlyDemandIndex.jagung;
  }
  assert.equal(childDemand, regency.monthlyDemandIndex.jagung);
  assert.equal(regency.populationStatus, 'derived_hierarchical_equal_share_pending_official_locality_population');
});

test('verified economic datasets are runtime-bound and pending datasets are isolated', () => {
  const api = context.AgroNationalEconomy;
  const registry = api.runtimeDataRegistry();
  assert.equal(registry.allRuntimeBound, true);
  assert.ok(registry.verifiedCount >= 6);
  const provincialMaize = registry.verified.find(entry => entry.id === 'bps_maize_provincial_production_2025_partial');
  assert.equal(provincialMaize.records, 2);
  assert.equal(provincialMaize.depth, 'province');
  const provincialSource = context.REAL_ECONOMIC_DATA.maizeProvincialProduction2025Partial;
  assert.equal(provincialSource.coverage.verifiedProvinceCount, 2);
  assert.equal(provincialSource.records.lampung.productionTon, 1260000);
  assert.equal(provincialSource.records['nusa-tenggara-barat'].productionTon, 1180000);
  assert.equal(provincialSource.moisturePct, 14);
  assert.equal(provincialSource.runtimeUse, 'reference_only_no_daily_supply_or_npc_inventory_injection');
  const paddy = context.REAL_ECONOMIC_DATA.paddyProvincialProduction2025;
  assert.equal(paddy.coverage.verifiedProvinceCount, 38);
  assert.equal(Object.keys(paddy.records).length, 38);
  assert.equal(paddy.nationalTotalTonGkg, 60207101);
  assert.equal(paddy.provincialRowSumTonGkg, 60207098);
  assert.equal(paddy.provincialToNationalDifferenceTonGkg, -3);
  assert.equal(paddy.records.lampung.productionTonGkg, 3252627);
  assert.equal(paddy.records['nusa-tenggara-barat'].riceEquivalentTon, 973144);
  const horticulture = context.REAL_ECONOMIC_DATA.horticultureNationalProduction2025;
  assert.equal(horticulture.coverage.verifiedCommodityCount, 18);
  assert.equal(Object.keys(horticulture.records).length, 18);
  assert.equal(horticulture.records.bawang_merah.productionQuintal, 21861568.44);
  assert.equal(horticulture.records.bawang_merah.productionKg, 2186156844);
  assert.equal(horticulture.records.cabai_merah.productionQuintal, 17150291.81);
  assert.equal(horticulture.records.jamur_tiram.productionKg, 39121699);
  assert.equal(horticulture.provincialCoverage.verifiedProvinceCount, 3);
  assert.equal(horticulture.provincialRecords.lampung.bawang_merah, 12897.80);
  assert.equal(horticulture.provincialRecords['sumatera-utara'].cabai_merah, 2148738.55);
  assert.equal(horticulture.provincialRecords.jambi.bawang_putih, 0);
  assert.equal(horticulture.provincialSources.lampung.publisher, 'BPS Provinsi Lampung');
  const horticultureRegistry = registry.verified.find(entry => entry.id === 'bps_horticulture_production_2025_national_partial');
  assert.equal(horticultureRegistry.records, 18);
  const allCommodityCoverage = api.commodityPhysicalCoverageSnapshot('lampung');
  assert.equal(allCommodityCoverage.commodityCount, 60);
  assert.equal(allCommodityCoverage.coverage[0].commodities.length, 60);
  assert.ok(allCommodityCoverage.coverage[0].commodities.every(row => row.marketModelStatus === 'active_catalog_and_market_index'));
  assert.ok(allCommodityCoverage.coverage[0].commodities.every(row => row.storageProfileStatus === 'storage_profile_available'));
  assert.equal(allCommodityCoverage.coverage[0].commodities.find(row => row.commodityId === 'padi').supplyStatus,
    'official_provincial_annual_supply_complete');
  assert.equal(allCommodityCoverage.coverage[0].commodities.find(row => row.commodityId === 'jagung').supplyStatus,
    'official_provincial_annual_supply_partial');
  assert.equal(allCommodityCoverage.coverage[0].commodities.find(row => row.commodityId === 'bawang_merah').supplyStatus,
    'official_provincial_annual_supply_partial');
  assert.equal(allCommodityCoverage.coverage[0].commodities.find(row => row.commodityId === 'bawang_merah').supplyAnnualTon, 1289.78);
  assert.equal(allCommodityCoverage.coverage[0].commodities.find(row => row.commodityId === 'bawang_merah').dailySupplyStatus,
    'provincial_annual_reference_only_monthly_harvest_curve_pending');
  const initializedState = api.ensure();
  assert.equal(initializedState.provinces.lampung.marketSupplyReference2025.padi.productionKgGkg, 3252627000);
  assert.equal(initializedState.provinces['nusa-tenggara-barat'].marketSupplyReference2025.padi.riceEquivalentKg, 973144000);
  assert.equal(initializedState.provinces.lampung.dailyPhysicalSupply.padi, null);
  assert.equal(initializedState.provinces.lampung.dailyPhysicalSupplyStatus.padi,
    'annual_reference_only_monthly_harvest_curve_pending');
  assert.ok(registry.verified.every(entry => entry.runtimeBound === true && entry.records > 0));
  assert.ok(registry.pending.some(entry => entry.status === 'official_source_metadata_only_numeric_extraction_pending'));
  assert.ok(api.bapanasNationalConsumption2025.length > 0);
  assert.ok(Object.keys(api.bpsKabkotaPopulation2025).length === 6);
});

test('verified datasets are consumed by runtime calculations, not only registered', async () => {
  vm.runInContext("S = { name: 'runtime-dataset-usage-audit' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  await api.loadAdministrativeMaster();
  state.eventChancePerProvinceMonthly = 0;
  api.updateDay(1);
  const registry = api.runtimeDataRegistry();
  const monthlyEntry = registry.verified.find(entry => entry.id === 'bapanas_monthly_demand_2025');
  assert.equal(monthlyEntry.records, Object.keys(api.bapanasMonthlyDemand2025.records).length);
  assert.ok(monthlyEntry.records > 0);
  assert.equal(api.seasonalDemandFactor('padi', 1), api.bapanasMonthlyDemand2025.records.padi.coefficients[0] * 12);
  assert.ok(state.provinces.lampung.dailyDemand.padi > 0);
  const report = api.runtimeDataUsageAudit();
  assert.equal(report.runtimeAvailable, true);
  assert.equal(report.audit.bapanasNationalConsumption.runtimeBound, true);
  assert.equal(report.audit.bapanasNationalConsumption.runtimeStateSignals, true);
  assert.equal(report.audit.bapanasMonthlyDemand.sourceRecords, monthlyEntry.records);
  assert.equal(report.audit.bapanasMonthlyDemand.seasonalMappedRecords, monthlyEntry.records);
  assert.equal(report.audit.bapanasMonthlyDemand.runtimeApplied, true);
  assert.equal(report.audit.bapanasProvincialConsumption.runtimeApplied, true);
  assert.equal(report.audit.bapanasKabkotaConsumption.runtimeApplied, true);
  assert.equal(report.audit.bpsDkiKabkotaPopulation.runtimeApplied, true);
  assert.equal(report.audit.physicalDemandAnchors.runtimeApplied, true);
  assert.equal(report.audit.administrativeMaster.runtimeApplied, true);
  assert.equal(report.audit.maizeProvincialProduction2025Partial.runtimeApplied, true);
  assert.equal(report.audit.maizeProvincialProduction2025Partial.sourceRecords, 2);
  assert.equal(report.audit.paddyProvincialProduction2025.sourceRecords, 38);
  assert.equal(report.audit.paddyProvincialProduction2025.runtimeApplied, true);
  assert.equal(report.audit.horticultureNationalProduction2025.sourceRecords, 18);
  assert.equal(report.audit.horticultureNationalProduction2025.provincialRows, 3);
  assert.equal(report.audit.horticultureNationalProduction2025.runtimeApplied, true);
  assert.equal(report.audit.all60CommodityCoverage.sourceRecords, 60);
  assert.equal(report.audit.all60CommodityCoverage.runtimeApplied, true);
  assert.equal(report.audit.allVerifiedDatasetsRuntimeBound, true);
  assert.equal(report.audit.allVerifiedDatasetsRuntimeBound, true);
});

test('official maize total-use projection is stored as physical demand without corrupting index-unit market stocks', () => {
  vm.runInContext("S = { name: 'maize-total-market-demand-runtime' }", context);
  const api = context.AgroNationalEconomy;
  const real = context.REAL_ECONOMIC_DATA;
  const maize = real.maizeNationalDemand;
  const state = api.ensure();
  const lampung = state.provinces.lampung;
  const demandIndexBefore = lampung.demand.jagung;
  const productionIndexBefore = lampung.production.jagung;
  const inventoryIndexBefore = lampung.inventory.jagung;
  const annualDemandKg = maize.nationalBalanceProjection2025.totalNeedTon * 1000 *
    api.population / maize.populationDenominator.value;
  assert.equal(lampung.totalMarketDemand2025.jagung.unit, 'kg');
  assert.ok(Math.abs(lampung.totalMarketDemand2025.jagung.annualTotalKg -
    annualDemandKg * (lampung.population / api.population)) < 1e-5);
  assert.equal(lampung.totalMarketDemand2025.jagung.scope,
    'all_channel_total_need_including_feed_and_other_uses');
  assert.equal(lampung.totalMarketDemand2025.jagung.unitCompatibilityStatus,
    'physical_demand_reference_only_supply_stock_conversion_pending');
  assert.equal(lampung.totalMarketDemand2025.jagung.marketQuantityStatus,
    'not_converted_to_legacy_market_index');
  assert.equal(lampung.demand.jagung, demandIndexBefore);
  assert.equal(lampung.production.jagung, productionIndexBefore);
  assert.equal(lampung.inventory.jagung, inventoryIndexBefore);
  assert.equal(state.national.marketDemandReference2025.jagung.sourcePrecisionDifferenceTon, 163);
  assert.equal(state.national.marketDemandReference2025.jagung.roundedSummaryTotalNeedTon, 14720000);
  assert.equal(state.national.marketSupplyReference2025.jagung.officialNationalProductionTon,
    real.maizeProduction2025.productionAt14MoistureTon);
  assert.equal(state.national.marketSupplyReference2025.jagung.regionalAllocationStatus,
    'partial_official_provincial_references_loaded_not_daily_supply_allocated');
  assert.equal(state.national.marketSupplyReference2025.jagung.provincialReferenceTotalTon, 2440000);
  assert.equal(state.national.marketSupplyReference2025.jagung.provincialReferenceCoverage.verifiedProvinceCount, 2);
  assert.equal(state.national.marketSupplyReference2025.jagung.balanceComparisonStatus,
    'not_compared_with_projected_demand_due_to_source_scope_and_methodology');
  api.updateDay(1);
  assert.ok(lampung.dailyDemand.jagung > 0);
  assert.ok(lampung.dailyPhysicalDemand.jagung > 0);
  assert.equal(lampung.dailyPhysicalDemand.kelapa, undefined);
  assert.equal(lampung.dailyPhysicalDemand.jagung,
    lampung.totalMarketDemand2025.jagung.annualTotalKg *
    context.AgroNationalEconomy.seasonalDemandCoefficient('jagung', 1) / 30);
  assert.equal(state.national.physicalDemandUnit, 'kg/day');
  assert.ok(state.national.dailyPhysicalDemandKg >= lampung.dailyPhysicalDemand.jagung);
  assert.equal(state.national.physicalDemandLedgerStatus,
    'household_and_verified_total_use_reference_only_not_yet_order_book_settled');
  const audit = api.runtimeDataUsageAudit();
  assert.equal(audit.audit.maizeTotalMarketDemand.runtimeApplied, true);
  assert.equal(audit.audit.maizeProductionReference.runtimeApplied, true);
  assert.equal(audit.audit.maizeProvincialProduction2025Partial.runtimeApplied, true);
  assert.equal(audit.audit.maizeProvincialProduction2025Partial.sourceRecords, 2);
  assert.equal(audit.audit.allVerifiedDatasetsRuntimeBound, true);
});


test('legacy national economy saves preserve index quantities when maize physical demand reference is applied', () => {
  vm.runInContext("S = { name: 'maize-demand-save-migration' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  const lampung = state.provinces.lampung;
  const oldMonthlyDemandIndex = lampung.population / 1000;
  lampung.demand.jagung = oldMonthlyDemandIndex;
  lampung.production.jagung = oldMonthlyDemandIndex / 30 * 1.18;
  lampung.inventory.jagung = oldMonthlyDemandIndex * 0.5;
  lampung.reserve.jagung = oldMonthlyDemandIndex * 0.25;
  lampung.unmetDemand.jagung = oldMonthlyDemandIndex * 0.05;
  delete state.maizeTotalDemandRuntimeVersion;
  const before = {
    demand: lampung.demand.jagung,
    production: lampung.production.jagung,
    inventory: lampung.inventory.jagung,
    reserve: lampung.reserve.jagung,
    unmetDemand: lampung.unmetDemand.jagung
  };
  api.ensure();
  assert.equal(lampung.demand.jagung, before.demand);
  assert.equal(lampung.production.jagung, before.production);
  assert.equal(lampung.inventory.jagung, before.inventory);
  assert.equal(lampung.reserve.jagung, before.reserve);
  assert.equal(lampung.unmetDemand.jagung, before.unmetDemand);
  assert.equal(lampung.totalMarketDemand2025.jagung.unit, 'kg');
  assert.equal(lampung.totalMarketDemand2025.jagung.marketQuantityStatus,
    'not_converted_to_legacy_market_index');
  assert.equal(state.maizeTotalDemandRuntimeVersion, 2);
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

test('BPS 2024 plantation production is bound as partial provincial annual supply without fabricated daily stock', () => {
  vm.runInContext("S = { name: 'bps-plantation-production-2024-test' }", context);
  const api = context.AgroNationalEconomy;
  const state = api.ensure();
  const source = context.REAL_ECONOMIC_DATA.plantationProduction2024Partial;
  assert.equal(source.source.publisher, 'Badan Pusat Statistik');
  assert.equal(source.referenceYear, 2024);
  assert.equal(source.sourceUnit, 'thousand_tonne/year');
  assert.equal(source.coverage.verifiedProvinceCount, 38);
  assert.equal(source.coverage.totalProvinceCount, 38);
  assert.equal(Object.keys(source.records).length, 38);
  assert.deepEqual(Object.keys(source.commodityMap).sort(), ['kakao','kelapa','kelapa_sawit','karet','kopi','tebu','teh'].sort());
  assert.equal(source.records.aceh.kelapa_sawit, 1092.71);
  assert.equal(source.records['sumatera-utara'].kelapa, 103.64);
  assert.equal(source.records['sumatera-selatan'].tebu, 124.37);
  assert.equal(source.records.riau.kakao, 0.84);
  assert.equal(JSON.stringify(source.provincialToNationalDifferencesThousandTon), JSON.stringify({
    kelapa_sawit: 0.02, kelapa: -0.01, karet: 0.04, kopi: 0.02, kakao: -0.01, teh: 0.01, tebu: 0.01
  }));
  assert.equal(state.national.marketSupplyReference2024.plantation.coverage.observationCount, 266);
  const aceh = state.provinces.aceh;
  assert.equal(aceh.marketSupplyReference2024.plantation.kelapa_sawit.productionKg, 1092710000);
  assert.equal(aceh.marketSupplyReference2024.plantation.kelapa_sawit.productionThousandTon, 1092.71);
  assert.equal(aceh.marketSupplyReference2024.plantation.kelapa_sawit.referenceYear, 2024);
  for (const id of Object.keys(source.commodityMap)) {
    const row = aceh.commodityPhysicalCoverage[id];
    assert.equal(row.supplyStatus, 'official_provincial_annual_supply_partial', id);
    assert.equal(row.dailySupplyStatus, 'provincial_annual_reference_only_monthly_harvest_curve_pending', id);
    assert.equal(aceh.dailyPhysicalSupply[id], null, id);
  }
  const lampung = state.provinces.lampung;
  assert.equal(lampung.commodityPhysicalCoverage.kelapa_sawit.supplyStatus, 'official_provincial_annual_supply_partial');
  assert.equal(lampung.commodityPhysicalCoverage.kelapa_sawit.dailySupplyStatus, 'provincial_annual_reference_only_monthly_harvest_curve_pending');
  assert.equal(lampung.marketSupplyReference2024.plantation.kelapa_sawit.productionKg, 375240000);
  assert.equal(lampung.dailyPhysicalSupply.kelapa_sawit, null);
  for (const provinceId of Object.keys(source.records)) {
    for (const id of Object.keys(source.commodityMap)) {
      const observation = state.provinces[provinceId].marketSupplyReference2024.plantation[id];
      assert.equal(observation.productionKg, source.records[provinceId][id] * 1000000, provinceId + '/' + id);
      assert.equal(state.provinces[provinceId].dailyPhysicalSupply[id], null, provinceId + '/' + id);
    }
  }
  const registry = api.runtimeDataRegistry();
  const entry = registry.verified.find(row => row.id === 'bps_plantation_production_2024_partial');
  assert.ok(entry);
  assert.equal(entry.records, 266);
  assert.equal(entry.depth, 'province');
  assert.equal(entry.runtimeBound, true);
  const usage = api.runtimeDataUsageAudit();
  assert.equal(usage.audit.plantationProduction2024Partial.sourceRecords, 266);
  assert.equal(usage.audit.plantationProduction2024Partial.provinceRows, 38);
  assert.equal(usage.audit.plantationProduction2024Partial.commodityRows, 7);
  assert.equal(usage.audit.plantationProduction2024Partial.runtimeApplied, true);
});

test('only national disaster and war activate the emergency market-band authorization', () => {
  vm.runInContext("S = { name: 'national-emergency-test' }", context);
  const api = context.AgroNationalEconomy;
  api.ensure();
  const local = api.applyDisaster({ provinceId: 'lampung', type: 'banjir', productionLossFraction: 0.4, logisticsLossFraction: 0.2, durationDays: 10 });
  assert.equal(local.classification, 'SIMULATION');
  assert.equal(api.marketEmergencySnapshot(), null);
  const padiCeiling = vm.runInContext("COMMODITIES.find(item => item.id === 'padi').marketCeiling", context);
  assert.equal(api.quote('lampung', 'padi', 100000), padiCeiling);
  assert.throws(() => api.applyNationalEmergency({ type: 'earthquake', durationDays: 3 }), /Only national_disaster or war/);

  const emergency = api.applyNationalEmergency({ type: 'national_disaster', durationDays: 3, commodityIds: ['padi'], eventId: 'national-flood-1' });
  assert.equal(emergency.scope, 'national');
  assert.equal(emergency.marketBandOverrideAuthorized, true);
  assert.equal(emergency.expiresAtDay, 3);
  const snapshot = api.marketEmergencySnapshot();
  assert.equal(snapshot.active, true);
  assert.equal(snapshot.type, 'national_disaster');
  assert.deepEqual(Array.from(snapshot.commodityIds), ['padi']);
  assert.equal(api.provinceSnapshot('aceh').activeEffects.padi.productionLoss, 0.25);
  assert.equal(api.provinceSnapshot('aceh').activeEffects.jagung, undefined);
  assert.ok(api.quote('lampung', 'padi', 100000) > padiCeiling);
  assert.throws(() => api.applyNationalEmergency({ type: 'war', durationDays: 2 }), /already active/);

  api.updateDay(1);
  assert.equal(api.marketEmergencySnapshot().active, true);
  api.updateDay(4);
  assert.equal(api.marketEmergencySnapshot(), null);
  assert.equal(api.quote('lampung', 'padi', 100000), padiCeiling);
  const war = api.applyNationalEmergency({ type: 'war', durationDays: 2, eventId: 'war-1' });
  assert.equal(war.type, 'war');
  assert.equal(api.marketEmergencySnapshot().active, true);
  assert.equal(api.endNationalEmergency('wrong-id').ok, false);
  assert.equal(api.endNationalEmergency('war-1').ok, true);
  assert.equal(api.marketEmergencySnapshot(), null);
});

test('BPS 2024 livestock population is bound for all provinces without fabricating meat supply', () => {
  vm.runInContext("S = { name: 'livestock-population-test' }", context);
  const api = context.AgroNationalEconomy;
  api.ensure();
  const source = context.REAL_ECONOMIC_DATA.livestockPopulation2024;
  assert.equal(source.coverage.verifiedProvinceCount, 38);
  assert.equal(source.coverage.verifiedSpeciesCount, 7);
  assert.equal(source.coverage.observationCount, 266);
  const speciesIds = Object.keys(source.species);
  const totals = Object.fromEntries(speciesIds.map(id => [id, 0]));
  for (const [provinceId, values] of Object.entries(source.records)) {
    assert.equal(values.length, 7, provinceId);
    const snapshot = api.provinceSnapshot(provinceId);
    for (let i = 0; i < speciesIds.length; i++) {
      totals[speciesIds[i]] += values[i];
      assert.equal(snapshot.livestockPopulationReference2024[speciesIds[i]], values[i], provinceId + '/' + speciesIds[i]);
    }
    assert.equal(snapshot.dailyPhysicalSupply.sapi_potong, null);
    assert.equal(snapshot.commodityPhysicalCoverage.sapi_potong.livestockPopulationStatus, 'official_2024_standing_animal_stock_not_meat_output');
  }
  assert.equal(JSON.stringify(totals), JSON.stringify(source.nationalTotals));
  assert.deepEqual(Object.keys(source.catalogMapping).sort(), ['domba', 'kambing', 'sapi_perah', 'sapi_potong']);
  assert.equal(api.provinceSnapshot('lampung').livestockPopulationReference2024.sapi_potong, 878393);
  const registry = api.runtimeDataRegistry();
  const entry = registry.verified.find(row => row.id === 'bps_livestock_population_2024');
  assert.ok(entry);
  assert.equal(entry.records, 266);
  assert.equal(entry.depth, 'province');
  const usage = api.runtimeDataUsageAudit();
  assert.equal(usage.audit.livestockPopulation2024.sourceRecords, 266);
  assert.equal(usage.audit.livestockPopulation2024.runtimeApplied, true);
});

test('BPS 2025 poultry population preserves provisional and unavailable cells without inventing output', () => {
  vm.runInContext("S = { name: 'poultry-population-test' }", context);
  const api = context.AgroNationalEconomy;
  api.ensure();
  const source = vm.runInContext("REAL_ECONOMIC_DATA.poultryPopulation2025", context);
  assert.equal(source.coverage.verifiedProvinceCount, 38);
  assert.equal(source.coverage.verifiedSpeciesCount, 4);
  assert.equal(source.coverage.observationCount, 152);
  assert.equal(source.coverage.availableObservationCount, 150);
  assert.equal(source.coverage.unavailableObservationCount, 2);
  const speciesIds = Object.keys(source.species);
  const totals = Object.fromEntries(speciesIds.map(id => [id, 0]));
  let available = 0, unavailable = 0;
  for (const [provinceId, values] of Object.entries(source.records)) {
    assert.equal(values.length, 4, provinceId);
    const snapshot = api.provinceSnapshot(provinceId);
    for (let i = 0; i < speciesIds.length; i++) {
      const value = values[i];
      assert.equal(snapshot.poultryPopulationReference2025[speciesIds[i]], value, provinceId + '/' + speciesIds[i]);
      if (value === null) unavailable++;
      else { totals[speciesIds[i]] += value; available++; }
    }
    assert.equal(snapshot.dailyPhysicalSupply.ayam_pedaging, null);
  }
  for (const id of speciesIds) assert.equal(totals[id], source.nationalTotals[id], id);
  assert.equal(available, 150);
  assert.equal(unavailable, 2);
  const dki = api.provinceSnapshot('dki-jakarta');
  assert.equal(dki.poultryPopulationReference2025.ayam_ras_petelur, null);
  assert.equal(dki.poultryPopulationReference2025.ayam_ras_pedaging, null);
  assert.equal(dki.commodityPhysicalCoverage.ayam_petelur.poultryPopulationStatus, 'official_poultry_population_cell_unavailable');
  const lampung = api.provinceSnapshot('lampung');
  assert.equal(lampung.poultryPopulationReference2025.ayam_ras_pedaging, 94814874);
  assert.equal(lampung.commodityPhysicalCoverage.ayam_pedaging.poultryPopulationHead, 94814874);
  assert.equal(lampung.commodityPhysicalCoverage.bebek.poultryPopulationHead, 1123408);
  assert.equal(Object.keys(source.catalogMapping).length, 3);
  const entry = api.runtimeDataRegistry().verified.find(row => row.id === 'bps_poultry_population_2025');
  assert.ok(entry);
  assert.equal(entry.records, 152);
  assert.equal(entry.depth, 'province');
  const usage = api.runtimeDataUsageAudit();
  assert.equal(usage.audit.poultryPopulation2025.sourceRecords, 152);
  assert.equal(usage.audit.poultryPopulation2025.availableRecords, 150);
  assert.equal(usage.audit.poultryPopulation2025.unavailableRecords, 2);
  assert.equal(usage.audit.poultryPopulation2025.runtimeApplied, true);
});

test('KKP 2024 aquaculture national production is bound without false provincial allocation', () => {
  vm.runInContext("S = { name: 'aquaculture-national-reference-test' }", context);
  const api = context.AgroNationalEconomy;
  api.ensure();
  const source = vm.runInContext("REAL_ECONOMIC_DATA.aquacultureNationalProduction2024", context);
  assert.equal(Object.keys(source.recordsTon).length, 11);
  const national = api.snapshot().national.marketSupplyReference2024.aquaculture;
  assert.equal(national.referenceYear, 2024);
  for (const [id, tonnes] of Object.entries(source.recordsTon)) {
    assert.equal(national.recordsTon[id], tonnes);
    assert.equal(national.recordsKg[id], tonnes * 1000);
  }
  assert.equal(national.recordsTon.gurami, 161402);
  assert.equal(national.recordsTon.patin, 383209);
  assert.equal(national.recordsTon.lele, 1158418);
  assert.equal(national.recordsTon.nila, 1563327);
  assert.equal(national.recordsTon.udang, 958463);
  assert.equal(Object.keys(source.catalogMapping).length, 4);
  assert.equal(source.catalogMapping.gurami, 'gurami');
  assert.equal(source.catalogMapping.patin, 'patin');
  assert.equal(source.catalogMapping.lele, 'lele');
  assert.equal(source.catalogMapping.nila, 'nila');
  assert.equal(source.catalogMapping.udang, undefined);
  const lampung = api.provinceSnapshot('lampung');
  for (const id of ['gurami', 'patin', 'lele', 'nila']) {
    assert.equal(lampung.commodityPhysicalCoverage[id].aquacultureNationalProductionStatus, 'official_2024_national_aquaculture_output_reference_not_provincial_supply');
    assert.equal(lampung.dailyPhysicalSupply[id], null);
    assert.equal(lampung.commodityPhysicalCoverage[id].supplyStatus, 'official_provincial_supply_data_pending');
  }
  const entry = api.runtimeDataRegistry().verified.find(row => row.id === 'kkp_aquaculture_national_production_2024');
  assert.ok(entry);
  assert.equal(entry.records, 11);
  assert.equal(entry.depth, 'country');
  const usage = api.runtimeDataUsageAudit();
  assert.equal(usage.audit.aquacultureNationalProduction2024.sourceRecords, 11);
  assert.equal(usage.audit.aquacultureNationalProduction2024.mappedCatalogCommodities, 4);
  assert.equal(usage.audit.aquacultureNationalProduction2024.runtimeApplied, true);
});

test('BPS 2024 aquaculture species production is bound to all provinces without forcing KKP reconciliation', () => {
  vm.runInContext("S = { name: 'aquaculture-provincial-reference-test' }", context);
  const api = context.AgroNationalEconomy;
  api.ensure();
  const source = vm.runInContext("REAL_ECONOMIC_DATA.aquacultureProvincialProduction2024Bps", context);
  assert.equal(source.coverage.verifiedProvinceCount, 38);
  assert.equal(source.coverage.verifiedSpeciesCount, 11);
  assert.equal(source.coverage.observationCount, 418);
  const speciesIds = Object.keys(source.species);
  const sums = Object.fromEntries(speciesIds.map(id => [id, 0]));
  for (const [provinceId, values] of Object.entries(source.records)) {
    assert.equal(values.length, 11, provinceId);
    const snapshot = api.provinceSnapshot(provinceId);
    for (let i = 0; i < speciesIds.length; i++) {
      sums[speciesIds[i]] += values[i];
      assert.equal(snapshot.aquacultureProductionReference2024Bps[speciesIds[i]], values[i], provinceId + '/' + speciesIds[i]);
    }
  }
  for (const id of speciesIds) {
    assert.equal(sums[id], source.provincialRowSumsTon[id], id);
    assert.equal(sums[id] - source.nationalTotalsTon[id], source.provincialToNationalDifferencesTon[id], id);
  }
  const national = api.snapshot().national.marketSupplyReference2024.aquacultureBps;
  assert.equal(national.nationalTotalsTon.patin, 381969);
  assert.equal(national.provincialRowSumsTon.patin, 381973);
  assert.equal(national.kkpNationalComparisonTon.gurami, -161402);
  assert.equal(national.kkpNationalComparisonTon.patin, -1240);
  const lampung = api.provinceSnapshot('lampung');
  assert.equal(lampung.aquacultureProductionReference2024Bps.patin, 22359);
  assert.equal(lampung.aquacultureProductionReference2024Bps.lele, 41269);
  assert.equal(lampung.aquacultureProductionReference2024Bps.nila, 24782);
  assert.equal(lampung.commodityPhysicalCoverage.patin.aquacultureBpsProvincialProductionTon, 22359);
  assert.equal(lampung.commodityPhysicalCoverage.lele.supplyStatus, 'official_provincial_annual_aquaculture_output_reference');
  assert.equal(lampung.commodityPhysicalCoverage.lele.dailySupplyStatus, 'provincial_annual_reference_only_monthly_harvest_curve_pending');
  assert.equal(lampung.commodityPhysicalCoverage.gurami.aquacultureBpsProvincialProductionTon, 0);
  assert.equal(lampung.commodityPhysicalCoverage.gurami.aquacultureNationalProductionTon, 161402);
  for (const id of ['gurami', 'patin', 'lele', 'nila']) assert.equal(lampung.dailyPhysicalSupply[id], null);
  const entry = api.runtimeDataRegistry().verified.find(row => row.id === 'bps_aquaculture_production_2024_provincial');
  assert.ok(entry);
  assert.equal(entry.records, 418);
  assert.equal(entry.depth, 'province');
  const usage = api.runtimeDataUsageAudit();
  assert.equal(usage.audit.aquacultureProvincialProduction2024Bps.sourceRecords, 418);
  assert.equal(usage.audit.aquacultureProvincialProduction2024Bps.runtimeApplied, true);
});
