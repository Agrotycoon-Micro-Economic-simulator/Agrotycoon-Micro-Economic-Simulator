/* Market-chain reference. Every value is explicitly labeled by evidence and market stage.
 * Owner-verified field prices are immutable. National household consumer observations are
 * comparison data only; they must not overwrite owner transaction prices or represent
 * collector-to-processor prices unless the source explicitly measures that transaction.
 * Null means no validated observation for that stage; never fill it with a proxy.
 */
window.MARKET_CHAIN_DATA={
 snapshotNote:"Stage prices are not comparable unless period, geography, quality, unit and buyer/seller transaction match. National consumer prices describe final-consumer transactions, not automatically business input purchases.",
 rows:[
  {id:"kelapa",name:"Kelapa muda (buah)",unit:"Rp/buah",
   producer:{value:3400,type:"owner_verified_field_price",period:null,source:"owner-provided field transaction",note:"Harga lapangan petani ke tengkulak: Rp3.400/butir. Nilai owner-verified; jangan ditimpa atau disesuaikan memakai harga nasional."},
   middleman:{value:5000,type:"game_parameter",period:null,source:"js/data.js",note:"Parameter harga beli dari tengkulak yang sudah ada di konfigurasi game. Bukan observasi nasional dan bukan pengganti harga lapangan Rp3.400."},
   processorPurchase:{value:null,type:"missing",period:null,source:null,note:"Harga jual tengkulak ke usaha es kelapa atau santan belum diverifikasi; jangan isi dengan harga konsumen rumah tangga."},
   wholesale:{value:null,type:"missing",period:null,source:null,note:"Belum ada observasi grosir tervalidasi untuk tahap ini."},
   direct:{value:13000,type:"owner_verified_field_price",period:null,source:"owner-provided field business benchmark",note:"Harga jual langsung kelapa utuh ke pelanggan: Rp13.000/butir. Nilai owner-verified; bukan harga tengkulak."},
   retailConsumer:{value:null,type:"missing",period:null,source:null,note:"Harga konsumen akhir untuk transaksi rumah tangga harus disimpan terpisah dari harga pembelian usaha pengolah."},
   factory:{value:null,type:"missing",period:null,source:null,note:"Harga pabrik kelapa belum dikumpulkan."}},
  {id:"cabai_merah",name:"Cabai merah (kg)",unit:"Rp/kg",producer:{value:27810,type:"official_reference",period:"BPS SEP 2024",source:"https://www.bps.go.id/id/publication/2025/04/22/67c2e8e76bac46931c0a0f80/agricultural-producer-price-statistics-of-food-crops--horticulture--and-smallholder-estate-crops-subsectors-2024.html",note:"Harga produsen dari referensi survei BPS 2024; cakupan dan definisi harus dicocokkan sebelum kalibrasi."},middleman:{value:25000,type:"game_parameter",period:null,source:"js/commodities.js",note:"Parameter balancing game; periode/wilayah tidak setara dengan harga produsen BPS."},wholesale:{value:null,type:"missing",period:null,source:null,note:"Belum ada seri grosir yang tervalidasi."},direct:{value:35000,type:"game_parameter",period:null,source:"js/commodities.js",note:"Parameter balancing game, bukan harga eceran resmi."},factory:{value:null,type:"missing",period:null,source:null,note:"Harga pabrik/pengolahan belum dikumpulkan."}},
  {id:"jagung",name:"Jagung pipilan kering (kg)",unit:"Rp/kg",producer:{value:5992,type:"official_reference",period:"Bapanas 2025-11",source:"https://data.badanpangan.go.id/datasetpublications/5jb/rata-rata-harga-pangan-bulanan-produsen-provinsi",note:"Referensi produsen periode historis yang tercatat dalam katalog; perlu observasi per provinsi."},middleman:{value:5400,type:"game_parameter",period:null,source:"js/commodities.js",note:"Parameter balancing game, bukan seri tengkulak tervalidasi."},wholesale:{value:null,type:"missing",period:null,source:null,note:"Belum ada observasi grosir tervalidasi."},direct:{value:8000,type:"game_parameter",period:null,source:"js/commodities.js",note:"Parameter balancing game, bukan harga eceran resmi."},factory:{value:null,type:"missing",period:null,source:null,note:"Harga pabrik pakan/pengolahan belum dikumpulkan."}}
 ],
 missingDataPolicy:"Unknown stage values remain null. Owner-verified field prices are immutable. National final-consumer observations cannot be substituted for collector-to-processor prices. Game-only prices must not be represented as historical observations."
};
