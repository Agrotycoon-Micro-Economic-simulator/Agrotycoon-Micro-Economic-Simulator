# Owner Commodity Chain Tier Standard

This commercial chain is separate from the school/major taxonomy in `js/production_tiers.js`.

| Tier | Owner standard | Examples |
|---|---|---|
| 1 | Produsen/bahan dasar | Petani/peternak; bahan awal sabun; kelapa produsen |
| 2 | Tengkulak/distributor pertama/pasar | Distributor awal dan transaksi pasar daging |
| 3 | Warung, Warung Madura, lapak, bahan olahan langsung | Kelapa utuh lapak owner Rp13.000; es kelapa; santan |
| 4 | Produk olahan, manufaktur, dan pemulihan nilai sisa | Rendang, kue/masakan bersantan, minyak kelapa dari santan, bibit kelapa dari buah tak layak jual, sabun mandi jadi, produk samping yang terbukti layak jual |

Mapping owner: daging sapi Tier 1 → distributor/pasar Tier 2 → warung/lapak Tier 3 → rendang Tier 4. Kelapa: santan Tier 3; minyak kelapa dan semua kue/masakan bersantan Tier 4. Sabun jadi Tier 4, tetapi bahan bakunya tetap memiliki rantai hulu.

Harga Tier 1 dan Tier 2 wajar berbeda dari Tier 3/4 karena transaksi, bentuk produk, distribusi, tenaga kerja, yield, susut, dan kemasan berbeda. Tier bukan jaminan harga pasti naik. Harga numerik harus punya sumber, periode, wilayah, satuan, kualitas dan tahap pasar; nilai tidak diketahui tetap null. Jangan bandingkan sapi hidup Rp/kg dengan daging/karkas atau rendang per porsi tanpa konversi yield yang jelas. Harga owner terverifikasi tidak boleh ditimpa data nasional.

## Pembanding internet diperiksa 17 Oktober 2026
- Bapanas melaporkan harga rata-rata daging sapi produsen Rp56.575/kg dan konsumen Rp144.682/kg (23 Agustus 2026): https://pustaka.badanpangan.go.id/publikasi/27ed0fb950b856b06e1273989422e7d3
- Pemantauan Bapanas 3 Maret 2026 menyebut sapi hidup sekitar Rp55.000/kg, daging RPH sekitar Rp105.000/kg dan potongan pasar Rp130.000–140.000/kg bergantung potongan: https://pustaka.badanpangan.go.id/publikasi/d5cfead94f5350c12c322b5b664544c1
- Menu lapak Jakarta dari pihak ketiga (25 Agustus 2026) mencantumkan kelapa muda utuh Rp14.000 dan es kelapa Rp7.500: https://menukuliner.net/menu/319849/es-kelapa-muda-bang-roy
- Listing lapak lain (10 Oktober 2026) mencantumkan kelapa muda dikupas/dibungkus plastik Rp14.000: https://menukuliner.net/menu/370708/kelapa-muda-kelapa-parut-mas-al-lengkong-gudang
- Dashboard Denpasar mencatat kelapa tua siap parut Rp10.000/butir pada 15 Oktober 2026; produk ini berbeda dari kelapa muda lapak owner: https://infopasar.denpasarkota.go.id/?action=viewdetail&domain=&kategori_komoditas=KK001&komoditas=KOM000022&kualitas=KUA000023&language=id&page=209&pasar=PSR000002
- Harga santan kemasan bervariasi menurut volume/produk: https://www.blibli.com/jual/santan-kelapa
- Rendang siap saji dijual dengan berat/kemasan berbeda: https://www.blibli.com/merchant/umkm-rendang-buya/UMR-60167

Pembanding publik bukan harga universal dan tidak menggantikan Rp13.000/butir milik owner. Implementasi awal ini menambah taxonomy dan validasi; belum menghubungkan semua transaksi beli/jual game.


## Tier 4: dua jalur tambahan kelapa dan ekonomi residu

Kelapa dapat mencapai Tier 4 melalui dua jalur yang berbeda dan tidak boleh dipaksa menjadi satu resep:

1. **Minyak kelapa 100% dari santan:** kelapa tua → santan (Tier 3) → santan dipanaskan beberapa jam sampai minyak terpisah (Tier 4). Catat bahan kelapa, air bila digunakan, energi/panas, tenaga kerja, alat, waktu proses, yield minyak, ampas/blondo, susut, kemasan, dan biaya angkut. Jangan mengklaim 100% rendemen; istilah 100% berarti minyak berasal dari kelapa tanpa campuran minyak lain. Rendemen aktual harus diukur.
2. **Pembibitan kelapa dari buah yang tidak layak jual sebagai konsumsi:** buah yang tidak layak dijual sebagai kelapa muda belum tentu tidak layak berkecambah. Seleksi kesehatan/viabilitas terlebih dahulu; jangan gunakan buah busuk/berpenyakit sebagai bibit. Semai dalam pot, catat jumlah ditanam, berkecambah, hidup, gagal, lama pembibitan, media, air, pot, tenaga kerja, ruang, dan harga bibit yang benar-benar laku. Owner menyebut kapasitas lahan 37 pohon, 30 terisi (7 slot kosong) dan pot bibit berjarak sekitar 0,5 m; ini adalah batasan desain yang diberikan owner, bukan validasi agronomi atau jaminan kapasitas geometris.

## Prinsip umum: pemulihan nilai residu

Terapkan ke semua komoditas dengan alur: (a) identifikasi sisa/produk afkir; (b) klasifikasikan alasan afkir dan keamanan; (c) cari penggunaan alternatif yang aman dan punya pembeli; (d) daftar semua input tambahan Tier 1, yield, waktu, tenaga kerja, energi, kemasan, transportasi, dan kapasitas; (e) bandingkan pendapatan bersih alternatif dengan biaya pembuangan atau nilai jual alternatif lain; (f) bila tidak aman/tidak ada permintaan, catat sebagai limbah tanpa nilai, bukan memaksakan pendapatan. Input sisa tidak otomatis gratis: gunakan biaya historis/biaya pengumpulan atau opportunity cost bila ada penggunaan lain. Setiap produk samping harus punya unit, sumber harga, periode, wilayah, bukti permintaan, dan status keamanan.

### Template adopsi untuk setiap komoditas
- Tier 1: produsen dan seluruh bahan dasar yang terpisah.
- Tier 2: distributor/pasar; harga dan ongkos angkut tahap ini.
- Tier 3: lapak/ritel/food-service; resep/kemasan langsung dan harga jual.
- Tier 4: semua hasil olahan utama **serta** pemanfaatan residu yang aman (pakan, kompos, bibit, minyak, bahan manufaktur, atau penggunaan lain hanya jika sesuai komoditas dan ada bukti kelayakan).
- Untuk tiap node: input IDs/tiers, formula kuantitas, yield, biaya proses, susut, transport, kapasitas, harga sumber, dan provenance. Harga/biaya/yield yang belum diketahui tetap null; jangan isi dengan perkiraan yang disamarkan sebagai data.


## Owner instruction — coconut/es-kelapa is the immutable Tier 1–4 reference blueprint (2026-10-22)

The owner explicitly reconfirmed that the personal coconut and es-kelapa prices must not be changed. Preserve the existing values exactly: whole coconut direct-to-customer Rp13,000/butir; es kelapa Rp5,000/gelas; one coconut yields four glasses; no milk; harvest labor Rp500/butir; observed producer-to-collector coconut price Rp3,400/butir. These are distinct observations/scenarios and must not overwrite one another or be replaced by national averages. The detailed consumables recipe and limitations remain governed by `docs/ES_KELAPA_OWNER_BENCHMARK.md`.

Use the approved coconut chain as the **modeling and evidence-structure blueprint** for every other commodity's Tier 1–4 chain: distinguish producer/input stage, intermediary/distribution, retail/food-service, and processing/by-product paths where applicable; capture quantities, yields, loss, labor, energy, capex, operating costs, price stage, revenue, and margin; compare buying inputs against own-production/processing when evidence permits. This does **not** mean copying coconut's rupiah prices, recipe, yields, or four-glass conversion to unrelated commodities. Each commodity must use its own source-backed quantities and prices, with unknowns left unknown. The coconut values are locked owner data; other commodity values require independent provenance and validation. No runtime parameter is approved by this instruction alone.
