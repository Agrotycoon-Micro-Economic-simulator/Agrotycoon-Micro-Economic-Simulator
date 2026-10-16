/* Official-source economic data registry. Periods and scope are explicit; never treat stale periodic prices as today's prices. */
window.REAL_ECONOMIC_DATA={
 meta:{schemaVersion:1,curatedAt:"2026-10-17"},
 sources:{
  bpjt:{publisher:"BPJT Kementerian PU",title:"Data Tarif Jalan Tol",url:"https://bpjt.pu.go.id/wp-content/uploads/Tarif-Tol-TransJawa.pdf",accessed:"2026-10-17"},
  bapanas:{publisher:"Badan Pangan Nasional",title:"Harga pangan tingkat konsumen nasional periode Maret 2026",url:"https://data.badanpangan.go.id/nfs_storage/public/publication/documents/1776912136.pdf",period:"2026-03"},
  fertilizer:{publisher:"Kementerian Pertanian",title:"HET pupuk bersubsidi",url:"https://psp.pertanian.go.id/faq/kategori/11",period:"2025-10-22"},
  spora:{publisher:"Ditjen PKH Kementan",title:"Sistem Informasi Produksi dan Harga Pakan",url:"https://simpakan.ditjenpkh.pertanian.go.id/spora/backend/web/site/data-harga",accessed:"2026-10-17"},
  bps:{publisher:"BPS",title:"Produksi sayuran 2024",url:"https://www.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMw%3D%3D/produksi-tanaman-sayuran-dan-buah---buahan-semusim-menurut-jenis-tanaman--2024.html?year=2024",period:"2024"},
  maizeGuide:{publisher:"BPSIP Bengkulu Kementan",title:"Sistem dan jarak tanam jagung",url:"https://repository.pertanian.go.id/items/3b7ce8ed-637f-4492-9159-ab1e2952e238",period:"2024"},
  sweetPotatoGuide:{publisher:"BPTP Kalteng Kementan",title:"Teknis Budidaya Ubi Jalar",url:"https://repository.pertanian.go.id/items/fcdaa565-7885-4768-97dd-bc82b21f21b0",period:"2020"}
 },
 tollSegments:[
  {road:"Tangerang–Merak",entry:"Cilegon Barat",exit:"Serang Barat",golI:15500,golII_III:24000,golIV_V:31000,decision:"KEPMEN PUPR 176/KPTS/M/2025"},
  {road:"Tangerang–Merak",entry:"Cilegon Barat",exit:"Cilegon Timur",golI:7000,golII_III:11000,golIV_V:14000,decision:"KEPMEN PUPR 176/KPTS/M/2025"},
  {road:"Tangerang–Merak",entry:"Merak",exit:"Cikupa",golI:58000,golII_III:91000,golIV_V:117500,decision:"KEPMEN PUPR 176/KPTS/M/2025"},
  {road:"Tangerang–Merak",entry:"Merak",exit:"Balaraja Timur",golI:54500,golII_III:85500,golIV_V:110500,decision:"KEPMEN PUPR 176/KPTS/M/2025"},
  {road:"Jakarta–Tangerang",entry:"SS Tomang",exit:"Cikupa",golI:8500,golII_III:12500,golIV_V:16500,decision:"KEPMEN PUPR 2692/KPTS/M/2024"},
  {road:"Jakarta–Cikampek",entry:"Jakarta IC",exit:"Pondok Gede Barat/Timur",golI:5500,golII_III:8000,golIV_V:11000,decision:"KEPMEN PUPR 250/KPTS/M/2024"},
  {road:"Jakarta–Cikampek",entry:"Jakarta IC",exit:"Cikunir",golI:9500,golII_III:14000,golIV_V:19000,decision:"KEPMEN PUPR 250/KPTS/M/2024"},
  {road:"Kanci–Pejagan",entry:"Kanci",exit:"Pejagan",golI:31500,golII_III:47500,golIV_V:63500,decision:"KEPMEN PUPR 909/KPTS/M/2023"},
  {road:"Kanci–Pejagan",entry:"Kanci",exit:"Ciledug",golI:17000,golII_III:25500,golIV_V:34000,decision:"KEPMEN PUPR 909/KPTS/M/2023"},
  {road:"Kanci–Pejagan",entry:"Ciledug",exit:"Pejagan",golI:15000,golII_III:22000,golIV_V:29500,decision:"KEPMEN PUPR 909/KPTS/M/2023"},
  {road:"Pejagan–Pemalang",entry:"Pejagan",exit:"Brebes Barat",golI:16500,golII_III:24500,golIV_V:32500,decision:"KEPMEN PUPR 1835/KPTS/M/2023"},
  {road:"Pejagan–Pemalang",entry:"Pejagan",exit:"Brebes Timur",golI:23000,golII_III:35000,golIV_V:46500,decision:"KEPMEN PUPR 1835/KPTS/M/2023"},
  {road:"Pejagan–Pemalang",entry:"Pejagan",exit:"Tegal Timur",golI:35000,golII_III:53000,golIV_V:70500,decision:"KEPMEN PUPR 1835/KPTS/M/2023"},
  {road:"Pejagan–Pemalang",entry:"Pejagan",exit:"Pemalang",golI:66000,golII_III:99000,golIV_V:132000,decision:"KEPMEN PUPR 1835/KPTS/M/2023"}
 ],
 foodPrices:[
  {commodity:"jagung",level:"peternak",rpKg:6823,period:"2026-03",source:"bapanas"},
  {commodity:"bawang_merah",level:"konsumen nasional",rpKg:41597,period:"2026-03",source:"bapanas"},
  {commodity:"bawang_putih",level:"konsumen nasional",rpKg:38567,period:"2026-03",source:"bapanas"},
  {commodity:"cabai_merah_keriting",level:"konsumen nasional",rpKg:44541,period:"2026-03",source:"bapanas"},
  {commodity:"cabai_rawit_merah",level:"konsumen nasional",rpKg:77164,period:"2026-03",source:"bapanas"},
  {commodity:"gula_pasir",level:"konsumen nasional",rpKg:18412,period:"2026-03",source:"bapanas"},
  {commodity:"ayam_ras",level:"konsumen nasional",rpKg:41312,period:"2026-03",source:"bapanas"},
  {commodity:"telur_ayam_ras",level:"konsumen nasional",rpKg:31823,period:"2026-03",source:"bapanas"}
 ],
 fertilizerSubsidyHET:[
  {name:"Urea",rpKg:1800,period:"2025-10-22",eligibleOnly:true,source:"fertilizer"},
  {name:"NPK",rpKg:1840,period:"2025-10-22",eligibleOnly:true,source:"fertilizer"},
  {name:"NPK Kakao",rpKg:2640,period:"2025-10-22",eligibleOnly:true,source:"fertilizer"},
  {name:"ZA Tebu",rpKg:1360,period:"2025-10-22",eligibleOnly:true,source:"fertilizer"},
  {name:"Organik",rpKg:640,period:"2025-10-22",eligibleOnly:true,source:"fertilizer"}
 ],
 feedPrices:[
  {feed:"Pakan broiler",rpKg:8688,period:"2026-09",source:"spora"},
  {feed:"Pakan layer",rpKg:7371,period:"2026-09",source:"spora"},
  {feed:"Konsentrat layer",rpKg:8345,period:"2026-09",source:"spora"}
 ],
 caveats:["Tarif tol hanya mencakup segmen terdaftar; jangan mengarang tarif ruas yang belum tercantum.","Harga pangan Maret 2026 adalah data periode historis, bukan harga hari ini.","Harga pupuk subsidi hanya untuk penerima dan komoditas yang memenuhi syarat.","Biaya kandang, FCR, konsumsi pakan per ternak, dan mesin pelet belum boleh diisi sebagai data real tanpa sumber spesifik yang tervalidasi."]
};
window.getRealTollFare=function(segment,vehicleClass){
 const r=window.REAL_ECONOMIC_DATA.tollSegments.find(x=>x.road===segment.road&&x.entry===segment.entry&&x.exit===segment.exit);
 if(!r)return {ok:false,reason:"Segmen tidak tersedia dalam dataset resmi; tidak ada tarif estimasi pengganti."};
 const fare=vehicleClass===1?r.golI:(vehicleClass===2||vehicleClass===3)?r.golII_III:(vehicleClass===4||vehicleClass===5)?r.golIV_V:null;
 return fare==null?{ok:false,reason:"Golongan tidak dikenal."}:{ok:true,fareRp:fare,decision:r.decision,source:window.REAL_ECONOMIC_DATA.sources.bpjt};
};
