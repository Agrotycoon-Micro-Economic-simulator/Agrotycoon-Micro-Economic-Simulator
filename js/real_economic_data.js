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
  sweetPotatoGuide:{publisher:"BPTP Kalteng Kementan",title:"Teknis Budidaya Ubi Jalar",url:"https://repository.pertanian.go.id/items/fcdaa565-7885-4768-97dd-bc82b21f21b0",period:"2020"},
  coconutOutlook:{publisher:"Pusat Data dan Sistem Informasi Pertanian, Kementerian Pertanian",title:"Outlook Komoditas Perkebunan Kelapa Tahun 2025, Lampiran 27",url:"https://satudata.pertanian.go.id/assets/docs/publikasi/OUTLOOK_KELAPA_2025_sign.pdf",period:"2002-2024",note:"Harga kelapa belum dikupas nasional; sumber dasar BPS/Susenas, diolah Pusdatin Kementan."}
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
 coconutPrices:[
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:750,unit:"Rp/butir",period:"2002",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:1103,unit:"Rp/butir",period:"2002",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:813,unit:"Rp/butir",period:"2003",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:1006,unit:"Rp/butir",period:"2003",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:901,unit:"Rp/butir",period:"2004",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:1119,unit:"Rp/butir",period:"2004",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:907,unit:"Rp/butir",period:"2005",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:1063,unit:"Rp/butir",period:"2005",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:1080,unit:"Rp/butir",period:"2006",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:1239,unit:"Rp/butir",period:"2006",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:1188,unit:"Rp/butir",period:"2007",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:1385,unit:"Rp/butir",period:"2007",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:1613,unit:"Rp/butir",period:"2008",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:2246,unit:"Rp/butir",period:"2008",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:1601,unit:"Rp/butir",period:"2009",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:2323,unit:"Rp/butir",period:"2009",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:1635,unit:"Rp/butir",period:"2010",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:2487,unit:"Rp/butir",period:"2010",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:1784,unit:"Rp/butir",period:"2011",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:3052,unit:"Rp/butir",period:"2011",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:1848,unit:"Rp/butir",period:"2012",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:3062,unit:"Rp/butir",period:"2012",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:1946,unit:"Rp/butir",period:"2013",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:3241,unit:"Rp/butir",period:"2013",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:2131,unit:"Rp/butir",period:"2014",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:3515,unit:"Rp/butir",period:"2014",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:2338,unit:"Rp/butir",period:"2015",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:3650,unit:"Rp/butir",period:"2015",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:2709,unit:"Rp/butir",period:"2016",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:4195,unit:"Rp/butir",period:"2016",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:2835,unit:"Rp/butir",period:"2017",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:4530,unit:"Rp/butir",period:"2017",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:2733,unit:"Rp/butir",period:"2018",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:4414,unit:"Rp/butir",period:"2018",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:2690,unit:"Rp/butir",period:"2019",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:4456,unit:"Rp/butir",period:"2019",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:3003,unit:"Rp/butir",period:"2020",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:4815,unit:"Rp/butir",period:"2020",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:3248,unit:"Rp/butir",period:"2021",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:5139,unit:"Rp/butir",period:"2021",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:3283,unit:"Rp/butir",period:"2022",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:5268,unit:"Rp/butir",period:"2022",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:3291,unit:"Rp/butir",period:"2023",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:5308,unit:"Rp/butir",period:"2023",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"producer",value:3422,unit:"Rp/butir",period:"2024",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
  {commodity:"kelapa_belum_dikupas",marketStage:"consumer",value:6061,unit:"Rp/butir",period:"2024",frequency:"annual",geographyLevel:"national",geographyName:"Indonesia",source:"coconutOutlook",qualityStatus:"verified"},
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

 riceNationalFoodDemand:{
  geography:"Indonesia",referenceYear:2024,
  sources:{
   perCapitaConsumption:{publisher:"Badan Pusat Statistik (BPS)",title:"Rata-Rata Konsumsi per Kapita Seminggu Beberapa Macam Bahan Makanan Penting, 2015-2024",url:"https://www.bps.go.id/id/statistics-table/1/MjMxNiMx/rata-rata-konsumsi-per-kapita-seminggu-beberapa-macam-bahan-makanan-penting--2015-2024.html",releaseOrUpdate:"2026-07-17",table:"Beras lokal/ketan, 2024 column",unit:"kg/person/week",value:1.521,qualityStatus:"official_statistic",note:"Survey household consumption category; not total rice availability or total national food requirement."},
   production:{publisher:"Badan Pusat Statistik (BPS)",title:"Luas Panen dan Produksi Padi di Indonesia 2024 (Angka Tetap)",url:"https://www.bps.go.id/id/pressrelease/2025/02/03/2414/pada-2024--luas-panen-padi-mencapai-sekitar-10-05-juta-hektare-dengan-produksi-padi-sebanyak-53-14-juta-ton-gabah-kering-giling--gkg--.html",releaseDate:"2025-02-03",table:"National final 2024 estimates, abstract",qualityStatus:"official_statistic",values:{harvestedAreaHa:10050000,paddyProductionGkgTon:53140000,riceProductionForFoodTon:30620000},note:"Harvested area is annual harvested area, not unique physical land area; GKG paddy production and rice production for food consumption are different product forms."}
  },
  observed:{weeklyPerCapitaKg:1.521,unit:"kg/person/week",itemDefinition:"beras lokal/ketan",period:"2024",source:"perCapitaConsumption"},
  derived:{annualPerCapitaKg:79.092,formula:"1.521 kg/person/week * 52 weeks/year",unit:"kg/person/year",status:"derived_from_official_statistic",caveat:"Annualized weekly household consumption; not a comprehensive national rice requirement estimate."},
  nationalAnnualConsumptionEstimateTon:null,populationDenominator:null,
  production:{harvestedAreaHa:10050000,paddyProductionGkgTon:53140000,riceProductionForFoodTon:30620000,period:"2024",source:"production"},
  status:"partial_official_data_population_and_full_demand_definition_required"
 },
 caveats:["Tarif tol hanya mencakup segmen terdaftar; jangan mengarang tarif ruas yang belum tercantum.","Harga pangan Maret 2026 adalah data periode historis, bukan harga hari ini.","Harga pupuk subsidi hanya untuk penerima dan komoditas yang memenuhi syarat.","Biaya kandang, FCR, konsumsi pakan per ternak, dan mesin pelet belum boleh diisi sebagai data real tanpa sumber spesifik yang tervalidasi."]
};
window.getRealTollFare=function(segment,vehicleClass){
 const r=window.REAL_ECONOMIC_DATA.tollSegments.find(x=>x.road===segment.road&&x.entry===segment.entry&&x.exit===segment.exit);
 if(!r)return {ok:false,reason:"Segmen tidak tersedia dalam dataset resmi; tidak ada tarif estimasi pengganti."};
 const fare=vehicleClass===1?r.golI:(vehicleClass===2||vehicleClass===3)?r.golII_III:(vehicleClass===4||vehicleClass===5)?r.golIV_V:null;
 return fare==null?{ok:false,reason:"Golongan tidak dikenal."}:{ok:true,fareRp:fare,decision:r.decision,source:window.REAL_ECONOMIC_DATA.sources.bpjt};
};
