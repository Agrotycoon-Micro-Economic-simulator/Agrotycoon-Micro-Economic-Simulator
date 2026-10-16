/* 
 * Agrotycoon: registri data ekonomi resmi dengan tanggal dan provenance.
 * Hanya data yang bersumber eksplisit yang ditandai VERIFIED. Tidak mengubah angka regional menjadi "harga nasional".
 * Last curated: 2026-10-17. Nilai harga berperiode lama harus diperbarui dari portal sumber sebelum dianggap terkini.
 */
window.REAL_ECONOMIC_DATA = {
 meta: {
  schemaVersion: 1,
  curatedAt: "2026-10-17",
  policy: "Tidak menyamarkan estimasi sebagai data real. Data bertanggal tetap membawa tanggal; rute tol harus cocok dengan gerbang masuk/keluar dan golongan."
 },
 sources: {
  bpjtToll: {publisher:"BPJT Kementerian PU",title:"Data Tarif Jalan Tol / Tarif Tol Trans Jawa",url:"https://bpjt.pu.go.id/wp-content/uploads/Tarif-Tol-TransJawa.pdf",published:"Tarif keputusan per ruas; halaman BPJT 2025-11-14",accessed:"2026-10-17"},
  bpjtPortal: {publisher:"BPJT Kementerian PU",title:"Info Tarif dan Golongan",url:"https://bpjt.pu.go.id/info-tarif-dan-golongan/",accessed:"2026-10-17"},
  bapanasPrice: {publisher:"Badan Pangan Nasional",title:"Harga pangan tingkat konsumen nasional periode Maret 2026",url:"https://data.badanpangan.go.id/nfs_storage/public/publication/documents/1776912136.pdf",period:"2026-03"},
  bpsVeg: {publisher:"BPS",title:"Produksi tanaman sayuran dan buah semusim 2024",url:"https://www.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMw%3D%3D/produksi-tanaman-sayuran-dan-buah---buahan-semusim-menurut-jenis-tanaman--2024.html?year=2024",period:"2024"},
  bpsMaize: {publisher:"BPS",title:"Luas panen, produktivitas dan produksi jagung 2024",url:"https://www.bps.go.id/en/statistics-table/2/MjIwNCMy/harvest-area--productivity--and-production-of-maize-by-province.html",period:"2024"},
  subsidyFertilizer: {publisher:"Kementerian Pertanian",title:"HET pupuk bersubsidi",url:"https://psp.pertanian.go.id/faq/kategori/11",period:"Keputusan Menteri Pertanian 1117/Kpts./SR.310/M/10/2025"},
  feedSpora: {publisher:"Ditjen PKH Kementan",title:"Sistem Informasi Produksi dan Harga Pakan (SPORA)",url:"https://simpakan.ditjenpkh.pertanian.go.id/spora/backend/web/site/data-harga",accessed:"2026-10-17"},
  shallotGuide: {publisher:"Ditjen Hortikultura Kementan",title:"Petunjuk teknis budidaya bawang merah",url:"https://hortikultura.pertanian.go.id/petunjuk-teknis-budidaya-bawang-merah-di-lahan-dan-di-dalam-pot-polybag/",published:"2024-10-28"},
  maizeGuide: {publisher:"BPSIP Bengkulu Kementan",title:"Sistem dan jarak tanam tanaman jagung",url:"https://repository.pertanian.go.id/items/3b7ce8ed-637f-4492-9159-ab1e2952e238",period:"2024"},
  sweetPotatoGuide: {publisher:"BPTP Kalteng Kementan",title:"Teknis Budidaya Ubi Jalar",url:"https://repository.pertanian.go.id/items/fcdaa565-7885-4768-97dd-bc82b21f21b0",period:"2020"}
 },
 tollSegments: [
  {road:"Tangerang–Merak",entry:"Cilegon Barat",exit:"Serang Barat",golI:15500,golII_III:24000,golIV_V:31000,decision:"KEPMEN PUPR 176/KPTS/M/2025",source:"bpjtToll"},
  {road:"Tangerang–Merak",entry:"Cilegon Barat",exit:"Cilegon Timur",golI:7000,golII_III:11000,golIV_V:14000,decision:"KEPMEN PUPR 176/KPTS/M/2025",source:"bpjtToll"},
  {road:"Tangerang–Merak",entry:"Merak",exit:"Cikupa",golI:58000,golII_III:91000,golIV_V:117500,decision:"KEPMEN PUPR 176/KPTS/M/2025",source:"bpjtToll"},
  {road:"Tangerang–Merak",entry:"Merak",exit:"Balaraja Timur",golI:54500,golII_III:85500,golIV_V:110500,decision:"KEPMEN PUPR 176/KPTS/M/2025",source:"bpjtToll"},
  {road:"Jakarta–Tangerang",entry:"SS Tomang",exit:"Cikupa",golI:8500,golII_III:12500,golIV_V:16500,decision:"KEPMEN PUPR 2692/KPTS/M/2024",source:"bpjtToll"},
  {road:"Jakarta–Cikampek",entry:"Jakarta IC",exit:"Pondok Gede Barat/Timur",golI:5500,golII_III:8000,golIV_V:11000,decision:"KEPMEN PUPR 250/KPTS/M/2024",source:"bpjtToll"},
  {road:"Jakarta–Cikampek",entry:"Jakarta IC",exit:"Cikunir",golI:9500,golII_III:14000,golIV_V:19000,decision:"KEPMEN PUPR 250/KPTS/M/2024",source:"bpjtToll"},
  {road:"Kanci–Pejagan",entry:"Kanci",exit:"Pejagan",golI:31500,golII_III:47500,golIV_V:63500,decision:"KEPMEN PUPR 909/KPTS/M/2023",source:"bpjtToll"},
  {road:"Kanci–Pejagan",entry:"Kanci",exit:"Ciledug",golI:17000,golII_III:25500,golIV_V:34000,decision:"KEPMEN PUPR 909/KPTS/M/2023",source:"bpjtToll"},
  {road:"Kanci–Pejagan",entry:"Ciledug",exit:"Pejagan",golI:15000,golII_III:22000,golIV_V:29500,decision:"KEPMEN PUPR 909/KPTS/M/2023",source:"bpjtToll"},
  {road:"Pejagan–Pemalang",entry:"Pejagan",exit:"Brebes Barat",golI:16500,golII_III:24500,golIV_V:32500,decision:"KEPMEN PUPR 1835/KPTS/M/2023",source:"bpjtToll"},
  {road:"Pejagan–Pemalang",entry:"Pejagan",exit:"Brebes Timur",golI:23000,golII_III:35000,golIV_V:46500,decision:"KEPMEN PUPR 1835/KPTS/M/2023",source:"bpjtToll"},
  {road:"Pejagan–Pemalang",entry:"Pejagan",exit:"Tegal Timur",golI:35000,golII_III:53000,golIV_V:70500,decision:"KEPMEN PUPR 1835/KPTS/M/2023",source:"bpjtToll"},
  {road:"Pejagan–Pemalang",entry:"Pejagan",exit:"Pemalang",golI:66000,golII_III:99000,golIV_V:132000,decision:"KEPMEN PUPR 1835/KPTS/M/2023",source:"bpjtToll"}
 ],
 foodPrices: [
  {commodity:"jagung",marketLevel:"peternak",priceRpPerKg:6823,period:"2026-03",status:"OFFICIAL_PERIODIC",source:"bapanasPrice"},
  {commodity:"bawang_merah",marketLevel:"konsumen_nasional",priceRpPerKg:41597,period:"2026-03",status:"OFFICIAL_PERIODIC",source:"bapanasPrice"},
  {commodity:"bawang_putih",marketLevel:"konsumen_nasional",priceRpPerKg:38567,period:"2026-03",status:"OFFICIAL_PERIODIC",source:"bapanasPrice"},
  {commodity:"cabai_merah_keriting",marketLevel:"konsumen_nasional",priceRpPerKg:44541,period:"2026-03",status:"OFFICIAL_PERIODIC",source:"bapanasPrice"},
  {commodity:"cabai_rawit_merah",marketLevel:"konsumen_nasional",priceRpPerKg:77164,period:"2026-03",status:"OFFICIAL_PERIODIC",source:"bapanasPrice"},
  {commodity:"gula_pasir",marketLevel:"konsumen_nasional",priceRpPerKg:18412,period:"2026-03",status:"OFFICIAL_PERIODIC",source:"bapanasPrice"},
  {commodity:"ayam_ras",marketLevel:"konsumen_nasional",priceRpPerKg:41312,period:"2026-03",status:"OFFICIAL_PERIODIC",source:"bapanasPrice"},
  {commodity:"telur_ayam_ras",marketLevel:"konsumen_nasional",priceRpPerKg:31823,period:"2026-03",status:"OFFICIAL_PERIODIC",source:"bapanasPrice"}
 ],
 fertilizerSubsidyHET: [
  {name:"Urea",priceRpPerKg:1800,period:"2025-10-22",eligibility:"petani memenuhi syarat dan komoditas prioritas",source:"subsidyFertilizer"},
  {name:"NPK",priceRpPerKg:1840,period:"2025-10-22",eligibility:"petani memenuhi syarat dan komoditas prioritas",source:"subsidyFertilizer"},
  {name:"NPK Kakao",priceRpPerKg:2640,period:"2025-10-22",eligibility:"petani kakao memenuhi syarat",source:"subsidyFertilizer"},
  {name:"ZA Tebu",priceRpPerKg:1360,period:"2025-10-22",eligibility:"petani tebu memenuhi syarat",source:"subsidyFertilizer"},
  {name:"Organik",priceRpPerKg:640,period:"2025-10-22",eligibility:"petani memenuhi syarat",source:"subsidyFertilizer"}
 ],
 feedPrices: [
  {feed:"BR0 broiler pre-starter",priceRpPerKg:8688,period:"2026-09",status:"OFFICIAL_SPORA_NATIONAL",source:"feedSpora"},
  {feed:"Pakan broiler",priceRpPerKg:8688,period:"2026-09",status:"OFFICIAL_SPORA_NATIONAL",source:"feedSpora"},
  {feed:"Pakan layer",priceRpPerKg:7371,period:"2026-09",status:"OFFICIAL_SPORA_NATIONAL",source:"feedSpora"},
  {feed:"Konsentrat layer",priceRpPerKg:8345,period:"2026-09",status:"OFFICIAL_SPORA_NATIONAL",source:"feedSpora"}
 ],
 cropReferences: [
  {commodity:"jagung",metric:"spacing_reference",value:"Gunakan jarak tanam sesuai panduan budidaya; jangan satu kepadatan untuk semua tanaman.",source:"maizeGuide"},
  {commodity:"ubi_jalar",metric:"yield_reference",value:"Produktivitas sekitar 10 t/ha pada praktik umum; varietas unggul dan teknologi tepat dapat >30 t/ha.",source:"sweetPotatoGuide"},
  {commodity:"bawang_merah",metric:"spacing_and_practice",value:"Jarak tanam dan teknik mengikuti petunjuk teknis varietas/lokasi.",source:"shallotGuide"}
 ],
 knownLimitations: [
  "Tarif tol hanya mencakup segmen yang dicantumkan. Jangan interpolasi tarif untuk segmen yang tidak ada.",
  "Harga pangan merupakan publikasi periode Maret 2026; jangan diperlakukan sebagai harga hari ini.",
  "Harga pupuk bersubsidi hanya berlaku untuk penerima dan komoditas yang memenuhi aturan; harga nonsubsidi harus terpisah.",
  "Biaya kandang, konsumsi pakan per ternak, FCR, dan harga mesin pelet harus berasal dari spesifikasi teknis, survei biaya resmi, dan penawaran vendor yang terdokumentasi; tidak disediakan di sini karena belum terverifikasi."
 ]
};
window.getRealTollFare = function(segment, vehicleClass) {
 const row=window.REAL_ECONOMIC_DATA.tollSegments.find(x=>x.road===segment.road && x.entry===segment.entry && x.exit===segment.exit);
 if(!row)return {ok:false,reason:"Tarif segmen belum ada dalam dataset resmi; jangan mengarang nilai."};
 const fare=vehicleClass===1?row.golI:(vehicleClass===2||vehicleClass===3)?row.golII_III:(vehicleClass===4||vehicleClass===5)?row.golIV_V:null;
 return fare==null?{ok:false,reason:"Kelas kendaraan tidak dikenal."}:{ok:true,fareRp:fare,decision:row.decision,source:window.REAL_ECONOMIC_DATA.sources[row.source]};
};
