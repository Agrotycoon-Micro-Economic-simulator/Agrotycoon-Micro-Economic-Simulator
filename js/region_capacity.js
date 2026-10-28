/* Regional capacity and NPC population constraints.
 * Population is a configurable simulation scenario, NOT a claim about Indonesia's
 * current population structure. Land allocations remain provisional until each
 * sector is calibrated against dated, unit-compatible official data.
 */
(function (root) {
  "use strict";
  const OFFICIAL_BENCHMARKS = Object.freeze({
    riceHarvestedAreaHa: { value: 10050000, year: 2024, metric: "annual harvested area, not unique physical land area", source: "https://www.bps.go.id/id/pressrelease/2025/02/03/2414/pada-2024--luas-panen-padi-mencapai-sekitar-10-05-juta-hektare-dengan-produksi-padi-sebanyak-53-14-juta-ton-gabah-kering-giling--gkg--.html" },
    oilPalmAreaHa: { value: 16830000, year: 2024, metric: "provisional planted area", source: "https://satudata.pertanian.go.id/assets/docs/publikasi/Buku_Analisis_Kinerja_Perdagangan_Kelapa_Sawit_2025_-_tte_sign.pdf" }
  });
  const DEFAULTS = Object.freeze({
    population: 5000000,
    minimumNonBusinessShare: 0.98,
    totalBusinessOwnerCap: 100000,
    miningOperatorCap: 100,
    activeConsumerShare: 0.92,
    region: "Indonesia — skenario permainan",
    calibrationStatus: "provisional_game_scenario",
    officialBenchmarks: OFFICIAL_BENCHMARKS,
    landUseHa: {
      rice: null, horticulture: null, plantation: null, livestock: null,
      aquaculture: null, mining: null, industry: null, markets: null,
      shops: null, factories: null
    },
    sectorProducerCaps: {
      agriculture: 45000, livestock: 18000, fishery: 9000,
      processing: 12000, retail: 12000, logistics: 2500,
      mining: 100, other: 1400
    }
  });
  const clamp = (n, min, max) => Math.max(min, Math.min(max, Number.isFinite(Number(n)) ? Number(n) : min));
  function normalize(input) {
    const c = Object.assign({}, DEFAULTS, input || {});
    c.population = Math.max(1, Math.floor(Number(c.population) || DEFAULTS.population));
    c.minimumNonBusinessShare = clamp(c.minimumNonBusinessShare, 0, 1);
    c.totalBusinessOwnerCap = Math.max(0, Math.floor(Number(c.totalBusinessOwnerCap) || 0));
    c.miningOperatorCap = Math.max(0, Math.floor(Number(c.miningOperatorCap) || 0));
    c.activeConsumerShare = clamp(c.activeConsumerShare, 0, 1);
    c.sectorProducerCaps = Object.assign({}, DEFAULTS.sectorProducerCaps, c.sectorProducerCaps || {});
    Object.keys(c.sectorProducerCaps).forEach(k => {
      c.sectorProducerCaps[k] = Math.max(0, Math.floor(Number(c.sectorProducerCaps[k]) || 0));
    });
    c.landUseHa = Object.assign({}, DEFAULTS.landUseHa, c.landUseHa || {});
    return c;
  }
  function allocate(input) {
    const c = normalize(input);
    const maxOwnersByPopulation = Math.floor(c.population * (1 - c.minimumNonBusinessShare));
    const businessOwnerCap = Math.min(c.totalBusinessOwnerCap, maxOwnersByPopulation);
    const nonBusinessPopulation = c.population - businessOwnerCap;
    const activeConsumers = Math.floor(nonBusinessPopulation * c.activeConsumerShare);
    const workersAndOtherNonOwners = nonBusinessPopulation - activeConsumers;
    const sectorCaps = Object.assign({}, c.sectorProducerCaps);
    sectorCaps.mining = Math.min(Math.max(0, Number(sectorCaps.mining) || 0), c.miningOperatorCap);
    const totalSectorSlots = Object.values(sectorCaps).reduce((sum, n) => sum + n, 0);
    return {
      region: c.region, population: c.population,
      businessOwnerCap, nonBusinessPopulation, activeConsumers,
      workersAndOtherNonOwners, minimumNonBusinessShare: c.minimumNonBusinessShare,
      sectorProducerCaps: sectorCaps, totalSectorSlots,
      landUseHa: c.landUseHa, calibrationStatus: c.calibrationStatus,
      note: "Kategori pekerjaan/status harus dimodelkan sebagai peran yang dapat tumpang tindih; total slot sektor bukan tambahan populasi unik."
    };
  }
  function producerCap(sector, input) {
    const a = allocate(input);
    const key = String(sector || "other");
    return Math.min(a.businessOwnerCap, Math.max(0, Number(a.sectorProducerCaps[key]) || 0));
  }
  function snapshot(input) {
    const a = allocate(input);
    return {
      population: a.population,
      businessOwnerCap: a.businessOwnerCap,
      nonBusinessPopulation: a.nonBusinessPopulation,
      activeConsumers: a.activeConsumers,
      workersAndOtherNonOwners: a.workersAndOtherNonOwners,
      miningOperatorCap: a.sectorProducerCaps.mining,
      sectorProducerCaps: Object.assign({}, a.sectorProducerCaps),
      landUseHa: Object.assign({}, a.landUseHa),
      calibrationStatus: a.calibrationStatus
    };
  }
  root.REGION_CAPACITY = {
    version: "0.1.1", defaults: DEFAULTS, officialBenchmarks: OFFICIAL_BENCHMARKS, normalize, allocate, producerCap, snapshot
  };
})(typeof window !== "undefined" ? window : globalThis);
