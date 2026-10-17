# Owner Commodity Chain Tier Standard

This commercial chain is separate from the school/major taxonomy in `js/production_tiers.js`.

| Tier | Owner standard | Examples |
|---|---|---|
| 1 | Produsen/bahan dasar | Petani/peternak; bahan awal sabun; kelapa produsen |
| 2 | Tengkulak/distributor pertama/pasar | Distributor awal dan transaksi pasar daging |
| 3 | Warung, Warung Madura, lapak, bahan olahan langsung | Kelapa utuh lapak owner Rp13.000; es kelapa; santan |
| 4 | Produk olahan, masakan, manufaktur | Rendang, kue/masakan bersantan, minyak kelapa, sabun mandi jadi |

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
