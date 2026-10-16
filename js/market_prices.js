/* Official-source snapshot for the interprovincial market board.
 * Source: Ministry of Agriculture SIMPONI Ternak, data-harga-harian.
 * Snapshot shown on source page: 2026-10-14. Not a live API feed.
 * Prices are producer-level live cattle Rp/kg liveweight as reported by source.
 * Never extrapolate missing provinces or substitute proxy prices.
 */
window.MARKET_PRICE_DATA = {
  snapshotDate: "2026-10-14",
  freshness: "official_snapshot_not_live_api",
  sourceName: "SIMPONI Ternak — Kementerian Pertanian / Badan Pangan Nasional",
  sourceUrl: "https://simponiternak.pertanian.go.id/data-harga-harian",
  commodity: "Sapi hidup",
  marketLevel: "Produsen",
  unit: "Rp/kg berat hidup",
  rows: [
    { province:"Aceh", price:62813, changePct:4.78 },
    { province:"Kalimantan Selatan", price:62500, changePct:4.25 },
    { province:"Sumatera Selatan", price:61100, changePct:1.92 },
    { province:"Banten", price:61025, changePct:1.79 },
    { province:"Sumatera Barat", price:60375, changePct:0.71 },
    { province:"Jawa Barat", price:60327, changePct:0.63 },
    { province:"Sulawesi Selatan", price:58944, changePct:-1.68 },
    { province:"Jawa Tengah", price:58816, changePct:-1.89 },
    { province:"Riau", price:58667, changePct:-2.14 },
    { province:"DI Yogyakarta", price:58467, changePct:-2.47 },
    { province:"Jawa Timur", price:57665, changePct:-3.81 },
    { province:"Jambi", price:57167, changePct:-4.64 },
    { province:"Lampung", price:57029, changePct:-4.87 },
    { province:"Sumatera Utara", price:56955, changePct:-5.00 },
    { province:"Nusa Tenggara Barat", price:54200, changePct:-9.59 },
    { province:"Bali", price:53714, changePct:-10.40 },
    { province:"Nusa Tenggara Timur", price:53000, changePct:-11.59 }
  ],
  missingDataPolicy: "Missing province/commodity prices stay missing; no estimates or proxy substitution."
};
