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
   bapanasConsumption2024:{publisher:"Badan Pangan Nasional",title:"Rata-rata Konsumsi per Jenis Pangan Penduduk Indonesia Nasional Update Tahun 2024",url:"https://data.badanpangan.go.id/datasetpublications/o5x/konsumsi_nasional",releaseDate:"2025-01-31",table:"row 224; Beras; 2024",unit:"kg/person/year",value:92.1,qualityStatus:"official_statistic",note:"National average per-capita rice consumption; distinct from BPS weekly beras lokal/ketan series."},
   nationalFoodBalance2025:{publisher:"Kementerian Pertanian, Pusat Data dan Sistem Informasi Pertanian; Bapanas/BPS source data",title:"Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025",url:"https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf",releaseDate:"2025-07",updateDate:"2025-06-02",table:"Tables 4.5–4.6, printed pages 20–21 (PDF pages 24–25)",unit:"tonne/year",qualityStatus:"official_projection",note:"2025 projection, not final actuals; demand includes household Susenas and non-household Bapok 2017."},
   populationProjection:{publisher:"Badan Pusat Statistik",title:"Statistik Indonesia 2025 / Proyeksi Penduduk Indonesia 2020–2050 Hasil SP2020",url:"https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf",releaseDate:"2025-07",table:"Table 4.6 and methodology notes; population projection credited to BPS Proyeksi Penduduk Indonesia 2020–2050 based on SP2020",unit:"persons",value:284438800,qualityStatus:"official_projection"},
   production:{publisher:"Badan Pusat Statistik (BPS)",title:"Luas Panen dan Produksi Padi di Indonesia 2024 (Angka Tetap)",url:"https://www.bps.go.id/id/pressrelease/2025/02/03/2414/pada-2024--luas-panen-padi-mencapai-sekitar-10-05-juta-hektare-dengan-produksi-padi-sebanyak-53-14-juta-ton-gabah-kering-giling--gkg--.html",releaseDate:"2025-02-03",table:"National final 2024 estimates, abstract",qualityStatus:"official_statistic",values:{harvestedAreaHa:10050000,paddyProductionGkgTon:53140000,riceProductionForFoodTon:30620000},note:"Harvested area is annual harvested area, not unique physical land area; GKG paddy production and rice production for food consumption are different product forms."}
  },
  observed:{weeklyPerCapitaKg:1.521,unit:"kg/person/week",itemDefinition:"beras lokal/ketan",period:"2024",source:"perCapitaConsumption"},
  derived:{annualPerCapitaKg:79.092,formula:"1.521 kg/person/week * 52 weeks/year",unit:"kg/person/year",status:"derived_from_official_statistic",caveat:"Annualized weekly household consumption; not a comprehensive national rice requirement estimate."},
  perCapitaAnnualBapanas:{value:92.1,unit:"kg/person/year",commodity:"beras",period:2024,source:"bapanasConsumption2024",qualityStatus:"official_statistic"},
  populationDenominator:{value:284438800,unit:"persons",year:2025,source:"bpsPopulationProjection2020_2050_midyear",qualityStatus:"official_projection"},
  nationalAnnualConsumptionEstimateTon:null,
  nationalDemandProjection:{year:2025,totalNeedTon:30975843,householdNeedTon:22527000,nonHouseholdNeedTon:8448844,unit:"tonne/year",status:"official_projection",note:"Published total differs by 1 tonne from the sum of displayed components; preserve source total and flag discrepancy."},
  nationalBalanceProjection2025:{beginningStockTon:8402277,paddyProductionGkgTon:54453100,riceProductionTon:31376296,importsTon:514804,totalAvailabilityTon:40293371,householdNeedTon:22527000,nonHouseholdNeedTon:8448844,totalNeedTon:30975843,projectedBalanceTon:9317528,unit:"tonne",status:"official_projection",source:"nationalFoodBalance2025"},
  production:{harvestedAreaHa:10050000,paddyProductionGkgTon:53140000,riceProductionForFoodTon:30620000,period:"2024",source:"production"},
  status:"official_2025_balance_projection_plus_2024_observations"
 },

 maizeNationalDemand:{
  geography:"Indonesia",
  sources:{
   bapanasDirectConsumption2024:{publisher:"Badan Pangan Nasional",title:"Rata-rata Konsumsi per Jenis Pangan Penduduk Indonesia Nasional Update Tahun 2024",url:"https://data.badanpangan.go.id/datasetpublications/o5x/konsumsi_nasional",releaseDate:"2025-01-31",table:"row 225; Jagung; 2024",unit:"kg/person/year",value:1.5,qualityStatus:"official_statistic_provisional",note:"Bapanas marks the 2024 value as provisional. Direct per-capita food-consumption metric; it is not total maize use and excludes the distinct feed, seed and industrial-use balance."},
   nationalDemand2025:{publisher:"Kementerian Pertanian, Pusat Data dan Sistem Informasi Pertanian",title:"Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025",url:"https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf",releaseDate:"2025-07",updateDate:"2025-06-02",table:"Figures 5.3–5.4, printed pages 34–35",unit:"tonne/year",qualityStatus:"official_projection_rounded",note:"The publication describes total 2025 maize need as approximately 14.72 million tonnes; component figures are rounded estimates."},
   nationalBalance2025:{publisher:"Kementerian Pertanian, Pusat Data dan Sistem Informasi Pertanian; projection source Bapanas",title:"Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025",url:"https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf",updateDate:"2025-06-02",table:"Table 5.6, printed page 33 / PDF page 37",unit:"tonne",qualityStatus:"official_projection",note:"Bapanas food-balance projection updated 2 June 2025. Production Jan–Jul uses BPS KSA; Aug–Dec uses Kementan crop potential. Net production deducts 4.62% losses/spillage from 14%-moisture dry shelled maize. Projection only, not final realized balance."},
   feedIndustryDemand2025:{publisher:"Direktorat Pakan, Direktorat Jenderal Peternakan dan Kesehatan Hewan, Kementerian Pertanian",title:"Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024",publicationYear:2025,referenceDataYear:2024,volume:"Vol. 6 Tahun 2025",url:"https://ditjenpkh.pertanian.go.id/storage/master/file/8EG4sdWw_2025_Buku_Jagung_%281%29.pdf",table:"Table 26, Proyeksi Kebutuhan Jagung Industri Pakan Tahun 2025 Antar Wilayah",unit:"tonne/year",value:8844096,qualityStatus:"official_projection",sourceArithmeticAudit:{publishedMonthlyAverageTon:727010,impliedMonthlyAverageTon:737008,monthlyAverageDifferenceTon:-9998,quarterlyTotalsTon:[2295098,2148839,2200079,2200080],quarterlyTotalsSumTon:8844096,annualTotalTon:8844096,status:"source_arithmetic_discrepancy_preserved",note:"Table 26 quarterly totals sum to the published annual total. Annual total / 12 = 737,008 t/month, but prose reports 727.01 thousand t/month; preserve both and flag the 9,998 t/month discrepancy."},note:"2025 feed-industry requirement projection reported through SiJagung; the same bulletin's separate ~8.25 Mt figure is based on a different industry purchase/absorption projection series. Keep the method/vintage difference explicit; neither figure is total all-channel feed use, and do not add either to national total need."}
  },
  directFoodConsumption2024:{value:1.5,unit:"kg/person/year",status:"official_statistic_provisional",source:"bapanasDirectConsumption2024",note:"Direct food consumption only; not the full national maize requirement."},
  nationalDemandProjection2025:{totalNeedTon:14720000,feedNeedTon:13603000,otherUsesNeedTon:1117000,feedSharePct:92.41,otherSharePct:7.59,unit:"tonne/year",status:"official_projection_rounded",note:"Rounded figures from Kementan Pusdatin: approximately 14.72 million tonnes total, 13.603 million tonnes feed use (industry and independent farmers), and 1.117 million tonnes for household consumption, seed and non-feed industry. Components sum to the rounded total; this is a projection, not realized final data."},
  feedIndustryDemandProjection2025:{value:8844096,unit:"tonne/year",status:"official_projection",source:"feedIndustryDemand2025",note:"Separate narrower projection for feed-industry need; do not confuse with or add to all-channel feed demand."},
  alternativeFeedIndustryProjection2025:{value:8250000,unit:"tonne/year",status:"official_projection_rounded",source:"nationalDemand2025",note:"Figure 5.4 in the same bulletin cites approximately 8.25 million tonnes for feed-industry demand. This differs from the 8,844,096-tonne projection in Buku Jagung 2025; treat as a source-vintage/scope reconciliation issue, not as interchangeable or additive data."},
  feedIndustryProjectionReconciliationStatus:"unresolved_source_scope_or_vintage_difference",
  directHouseholdConsumptionTonnage:null,
  nationalBalanceProjection2025:{beginningStockTon:3579102,productionJpkAt14MoistureTon:16194055,lossOrSpillageTon:748165,netProductionTon:15445889,importsTon:906040,exportsTon:76959,totalAvailabilityTon:19854073,totalNeedTon:14720163,projectedEndingBalanceTon:5133909,arithmeticAudit:{netProductionFromGrossMinusLossTon:15445890,publishedNetProductionTon:15445889,netProductionDifferenceTon:-1,availabilityFromPublishedComponentsTon:19854072,publishedAvailabilityTon:19854073,availabilityDifferenceTon:1,balanceFromPublishedAvailabilityTon:5133910,publishedBalanceTon:5133909,balanceDifferenceTon:-1,status:"source_arithmetic_discrepancies_preserved",note:"Table 5.6 source totals differ by 1 tonne in gross-minus-loss, availability component sum and availability-minus-need arithmetic. Preserve the published figures; do not silently correct."},lossRatePct:4.62,unit:"tonne",status:"official_projection",source:"nationalBalance2025",productionComparison:{finalBpsProductionAt14MoistureTon:16160000,projectedProductionTon:16194055,finalMinusProjectionTon:-34055,status:"derived_comparison",note:"Final BPS 2025 production is 34,055 tonnes below the earlier Bapanas projection input; other balance components remain projections and are not recalculated from final production."},note:"Official Bapanas/Kementan projection; preserve exact Table 5.6 figures. The rounded 14.72 Mt demand summary and exact 14,720,163 t balance-table need are related but not identical display precision."},
  nationalBalanceEstimate2025:null,
  status:"official_provisional_direct_food_consumption_2024_plus_rounded_national_demand_projection_2025"
 },

 maizeProduction2024:{
  geography:"Indonesia",
  source:{publisher:"Badan Pusat Statistik (BPS)",title:"Luas Panen dan Produksi Jagung di Indonesia 2024",url:"https://www.bps.go.id/id/publication/2025/08/15/2bb49a0af17ec89ac16971de/luas-panen-dan-produksi-jagung-di-indonesia-2024.html",releaseDate:"2025-08-15",catalogue:"5203036",publicationNumber:"05100.25006",method:"KSA jagung combined with 2024 Ubinan survey and SKJG2020 conversion survey",qualityStatus:"official_statistic"},
  referenceYear:2024,
  harvestedAreaHa:2550000,
  harvestedAreaUnit:"hectare",
  productionAt28MoistureTon:20480000,
  productionAt14MoistureTon:15140000,
  unit:"tonne/year",
  status:"official_statistic_distinct_moisture_bases",
  derivedAudit:{simpleMoistureOnlyEstimateAt14MoistureTon:17146047,formula:"20.48 million tonnes * (1 - 0.28) / (1 - 0.14)",status:"derived_audit_only",note:"Simple moisture mass-balance conversion does not reproduce BPS's separately published 15.14 million tonne estimate. BPS says its production estimates combine KSA, the 2024 Ubinan survey and SKJG2020; do not replace the official 14%-moisture figure with this arithmetic or infer that the two published values are interchangeable."},
  note:"Both moisture-basis values are reported by the same BPS 2024 publication. Keep each with its own moisture definition. Do not compare either directly with national demand without aligning moisture basis, losses, product scope and reference period."
 },

 maizeProduction2025:{
  geography:"Indonesia",
  source:{publisher:"Badan Pusat Statistik (BPS)",title:"Luas Panen dan Produksi Jagung di Indonesia 2025 (Angka Tetap)",url:"https://www.bps.go.id/id/pressrelease/2026/02/02/2538/luas-panen-dan-produksi-jagung.html",releaseDate:"2026-02-02",method:"BPS KSA Jagung; official fixed figures",qualityStatus:"official_statistic_final"},
  referenceYear:2025,
  harvestedAreaHa:2710000,
  harvestedAreaUnit:"hectare",
  productionAt14MoistureTon:16160000,
  moisturePct:14,
  unit:"tonne/year",
  status:"official_statistic_final",
  note:"Final 2025 dry shelled maize production at 14% moisture. Do not derive a national surplus/deficit against the 2025 rounded demand projection until stocks, imports, exports, post-harvest losses, product scope and balance methodology are reconciled."
 },
 maizeNationalBalanceEstimate2025:null,
 utpBroilerBenchmark2024:{
  geography:"Indonesia",
  unitType:"UTP",
  commodity:"Ayam ras pedaging",
  referencePeriod:"2023-06-01/2024-05-31",
  denominator:"per 5,000 final-stock heads",
  source:{publisher:"Badan Pusat Statistik",title:"Peternakan Dalam Angka 2025",url:"https://www.bps.go.id/id/publication/2026/01/09/50771bc6f5761886458558ba/livestock-in-figures-2025.html",releaseDate:"2026-01-09",table:"Table 8.3.10, printed p.122; cites BPS SEP 2024",qualityStatus:"official_catalog_confirmed_table_text_from_mirror"},
  reported:{productionValueThousandRp:152008.05,productionCostThousandRp:126445.06,publishedIncomeThousandRp:25563.00,feedCostThousandRp:81754.62,feedCostSharePct:64.66},
  derived:{productionMinusCostThousandRp:25562.99,publishedIncomeMinusDerivedThousandRp:0.01,status:"derived_arithmetic"},
  reconciliation:{earlierSepTable2_10Transcription:{productionValueThousandRp:152008.05,productionCostThousandRp:126445.08,publishedIncomeThousandRp:28639.72,status:"conflicts_with_later_bps_publication"},laterBpsTableArithmeticStatus:"income reconciles within Rp0.01 thousand rounding",originalSepTableTextStatus:"verified_in_official_pdf_text",originalSepTableImageStatus:"not_yet_visually_verified"},
  status:"research_reference_only",
  note:"The official BPS SEP 2024 livestock PDF text was opened directly and its Table 2.10 text extraction confirms production 152,008.05, cost 126,445.08 and published income 28,639.72 thousand Rp per 5,000 heads; production minus cost is 25,562.97, so the source itself has an unresolved arithmetic mismatch. Screenshot rendering of the original table page timed out, so visual image verification remains open. A later BPS publication reports production 152,008.05, cost 126,445.06 and income 25,563.00, which reconciles within Rp0.01 thousand. Preserve both source records and do not silently choose one until the discrepancy is clarified. Not a Tier recipe or UPB/UTL estimate."
 },

 utlOilPalmBenchmark2024:{
  geography:"Indonesia",
  unitType:"UTL",
  commodity:"Kelapa sawit",
  referencePeriod:"2024",
  denominator:"per 100 trees harvested by Other Agricultural Holdings (UTL)",
  source:{publisher:"Badan Pusat Statistik",title:"Hasil Survei Ekonomi Pertanian (SEP) 2024 — Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan",catalogue:"5101026",publicationNumber:"05100.25001",table:"Table 4.2, printed p.32",officialPublisherPageUrl:"https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan-hortikultura-dan-perkebunan.html",mirrorUrl:"https://id.scribd.com/document/1007237393/hasil-survei-ekonomi-pertanian-sep-2024-nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan-hortikultura-dan-perkebun",qualityStatus:"official_pdf_text_and_table_image_verified"},
  reported:{productionValueThousandRp:25143.89,productionCostThousandRp:13218.16,publishedIncomeThousandRp:12046.95,producerPriceThousandRpPerKg:2.07,costThousandRpPerKg:1.29,productivityKgPer100Trees:12443.49},
  costComponentsThousandRp:{seeds:188.79,fertilizer:3026.97,pesticides:556.84,wagesAndAgriculturalServices:4598.78,fuelAndLubricants:175.62,electricityAndWater:55.98,rentAndEstimatedRent:3927.80,otherExpenditures:681.70},
  derivedAudit:{costComponentSumThousandRp:13212.48,costComponentSumMinusPublishedCostThousandRp:-5.68,productionMinusPublishedCostThousandRp:11925.73,publishedIncomeMinusProductionMinusCostThousandRp:121.22,status:"source_component_and_income_gap_unresolved"},
  sourceNotes:{incomeDefinition:"BPS SEP 2024 technical notes define income as production value minus production cost.",roundingNote:"Source says decimals may differ due to rounding.",imputationNote:"Source says cost/subsidy imputation has not yet been estimated for some expenditure variables.",originalTableImageStatus:"visually_verified_official_pdf_image",doNotInfer:"Do not silently reconcile the cost-component sum or published income; keep all source values and deltas separate."},
  status:"research_reference_only",
  note:"BPS SEP 2024 Table 4.2, UTL oil-palm average per 100 trees. The official BPS PDF table image (printed p.32) was visually inspected and agrees with the reported values. BPS technical notes define income as production value minus production cost, so the Rp121.22k published-income difference cannot be reconciled from the displayed totals alone; cost-component sum remains Rp5.68k below published cost. Not a Tier 1–4 recipe, and not interchangeable with UPB or UTP values."
 },
 livestockBenchmarksUtp2024:{
  geography:"Indonesia",
  unitType:"UTP",
  referencePeriod:"2023-06-01/2024-05-31",
  source:{publisher:"Badan Pusat Statistik",title:"Peternakan Dalam Angka 2025",url:"https://www.bps.go.id/id/publication/2026/01/09/50771bc6f5761886458558ba/livestock-in-figures-2025.html",releaseDate:"2026-01-09",method:"2024 Agricultural Economic Survey (SEP), individual agricultural holdings (UTP)",qualityStatus:"official_catalog_confirmed_secondary_table_transcription_not_primary_pdf_verified",mirrorUrl:"https://id.scribd.com/document/1009902102/Peternakan-Dalam-Angka-2025-Menurut-Bps"},
  records:{
   beefCattlePerHead:{
    commodity:"Sapi potong",
    table:"Table 8.3.1, printed p.114",
    denominator:"per head",
    reported:{productionValueThousandRp:3290.37,productionCostThousandRp:716.12,publishedIncomeThousandRp:2574.26,feedCostThousandRp:342.25,feedCostSharePct:47.79},
    costComponentsThousandRp:{feed:342.25,health:35.80,wages:70.87,fuelAndLubricants:107.92,electricityAndWater:14.20,land:85.69,livestockServices:14.85,other:44.55},
    derived:{productionMinusCostThousandRp:2574.25,publishedIncomeMinusDerivedThousandRp:0.01,costComponentSumThousandRp:716.13,costComponentSumMinusPublishedCostThousandRp:0.01}
   },
   dairyCattlePerHead:{
    commodity:"Sapi perah",
    table:"Table 8.3.2, printed p.115",
    denominator:"per head",
    reported:{productionValueThousandRp:10141.12,productionCostThousandRp:5094.66,publishedIncomeThousandRp:5046.46,feedCostThousandRp:4074.74,feedCostSharePct:79.98},
    costComponentsThousandRp:{feed:4074.74,health:69.13,wages:415.47,fuelAndLubricants:189.12,electricityAndWater:40.18,land:131.96,livestockServices:14.63,other:159.42},
    derived:{productionMinusCostThousandRp:5046.46,publishedIncomeMinusDerivedThousandRp:0,costComponentSumThousandRp:5094.65,costComponentSumMinusPublishedCostThousandRp:-0.01}
   },
   meatBuffaloPerHead:{
    commodity:"Kerbau potong",
    table:"Table 8.3.3, printed p.116",
    denominator:"per head",
    reported:{productionValueThousandRp:3697.39,productionCostThousandRp:533.97,publishedIncomeThousandRp:3163.42,feedCostThousandRp:143.84,feedCostSharePct:26.94},
    costComponentsThousandRp:{feed:143.84,health:49.91,wages:117.14,fuelAndLubricants:6.05,electricityAndWater:6.07,land:59.32,livestockServices:3.78,other:41.21},
    derived:{productionMinusCostThousandRp:3163.42,publishedIncomeMinusDerivedThousandRp:0,costComponentSumThousandRp:427.32,costComponentSumMinusPublishedCostThousandRp:-106.65}
   },
   meatGoatPerHead:{
    commodity:"Kambing potong",
    table:"Table 8.3.5",
    denominator:"per head",
    reported:{productionValueThousandRp:660.93,productionCostThousandRp:155.39,publishedIncomeThousandRp:505.54,feedCostThousandRp:57.85,feedCostSharePct:37.23},
    costComponentsThousandRp:{feed:57.85,health:5.08,wages:17.31,fuelAndLubricants:33.16,electricityAndWater:3.58,land:25.73,livestockServices:0.96,other:11.71},
    derived:{productionMinusCostThousandRp:505.54,publishedIncomeMinusDerivedThousandRp:0,costComponentSumThousandRp:155.38,costComponentSumMinusPublishedCostThousandRp:-0.01}
   },
   nativeChickenPerHead:{
    commodity:"Ayam kampung biasa",
    table:"Table 8.3.7",
    denominator:"per head",
    reported:{productionValueThousandRp:34.15,productionCostThousandRp:15.61,publishedIncomeThousandRp:18.53,feedCostThousandRp:10.94,feedCostSharePct:70.05},
    costComponentsThousandRp:{feed:10.94,health:0.27,wages:0.41,fuelAndLubricants:0.28,electricityAndWater:0.40,land:2.59,livestockServices:0.02,other:0.71},
    derived:{productionMinusCostThousandRp:18.54,publishedIncomeMinusDerivedThousandRp:-0.01,costComponentSumThousandRp:15.62,costComponentSumMinusPublishedCostThousandRp:0.01}
   layingDuckPer1000Heads:{
    commodity:"Itik petelur",
    table:"Table 8.3.8, printed p.121",
    denominator:"per 1,000 heads",
    reported:{productionValueThousandRp:140316.23,productionCostThousandRp:75420.46,publishedIncomeThousandRp:64895.77,feedCostThousandRp:60009.13,feedCostSharePct:79.57},
    costComponentsThousandRp:{feed:60009.13,health:1536.82,wages:4875.14,fuelAndLubricants:2228.91,electricityAndWater:1322.29,land:2861.82,livestockServices:741.36,other:1844.99},
    derived:{productionMinusCostThousandRp:64895.77,publishedIncomeMinusDerivedThousandRp:0,costComponentSumThousandRp:75420.46,costComponentSumMinusPublishedCostThousandRp:0}
   },
   },
  },
  status:"research_reference_only",
  visualVerificationStatus:"official_pdf_table_images_not_yet_verified",
  note:"Aggregate values and table labels were transcribed from an accessible text mirror of BPS Peternakan Dalam Angka 2025; the official BPS publication metadata is confirmed, but the original table images/PDF were not visually verified in this pass. Component arithmetic is explicitly audited: beef cattle has Rp0.01 thousand rounding gaps in both cost-component sum and income; dairy has a Rp0.01 thousand cost-component gap; buffalo has an unresolved Rp106.65 thousand gap between listed components and reported total cost. Preserve source and derived fields separately. These are national UTP research references, not local farm quotes, not UTL/UPB values, and not Tier 1–4 recipes. Do not promote until primary PDF/table verification and unresolved cost-component gaps are reviewed."
 },

 caveats:["Tarif tol hanya mencakup segmen terdaftar; jangan mengarang tarif ruas yang belum tercantum.","Harga pangan Maret 2026 adalah data periode historis, bukan harga hari ini.","Harga pupuk subsidi hanya untuk penerima dan komoditas yang memenuhi syarat.","Biaya kandang, FCR, konsumsi pakan per ternak, dan mesin pelet belum boleh diisi sebagai data real tanpa sumber spesifik yang tervalidasi."]
};
window.getRealTollFare=function(segment,vehicleClass){
 const r=window.REAL_ECONOMIC_DATA.tollSegments.find(x=>x.road===segment.road&&x.entry===segment.entry&&x.exit===segment.exit);
 if(!r)return {ok:false,reason:"Segmen tidak tersedia dalam dataset resmi; tidak ada tarif estimasi pengganti."};
 const fare=vehicleClass===1?r.golI:(vehicleClass===2||vehicleClass===3)?r.golII_III:(vehicleClass===4||vehicleClass===5)?r.golIV_V:null;
 return fare==null?{ok:false,reason:"Golongan tidak dikenal."}:{ok:true,fareRp:fare,decision:r.decision,source:window.REAL_ECONOMIC_DATA.sources.bpjt};
};
