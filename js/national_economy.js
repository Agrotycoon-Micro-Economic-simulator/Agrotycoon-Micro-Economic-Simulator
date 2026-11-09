/* National economy simulator — aggregate population, locality statistics, regional markets and government reserves.
 * 200m residents are statistical cohorts, not 200m JavaScript objects.
 * The active-agent layer is a capped representative sample (1,000–5,000 records).
 * Administrative counts/population weights are sourced or explicitly marked derived/experimental.
 */
(function(root){
 "use strict";
 const VERSION="1.0.0", COUNTRY_NAME="Republik Arunika", POPULATION=200000000;
 const SOURCES={
  population:{publisher:"BPS",title:"Provincial population projection 2025, Indonesia 2020–2050 projection",period:"2025",url:"https://web-api.bps.go.id/download.php?f=kafwBbrbUSQhQfL2omlPOXhWYTRFNXQ1dk13ZjVtZ05WYWxWM0k4ZTdOOWQxQUM1OXJheGp3eVo3cmRMTlpXTlVzdXlSU2dFQlk5MU10UGJyQ1ZjWngzSnplM3lDUXlJYVJ5TXRrY25wNEZrdjd0R0Exd2l2UWdPM2dOcE1MUWxyUmlSS3BPLzQ5MjNJWHZoTTdraG5mdFppYkRsby9mWHpqU0ZsOW12STYzOGx3aVdOUTZzbWdYbzc4UnI0dEorODJPalJIUDkwWjl0Z3Fhdi91Sk0zbmp3NTg1U1lPYWtGNDlxUjBWQWlaaU9zbTFGQTFZYjZ2VDdIclovKzZQY28xOWgyUWZPZkllYXZzZDA%3D",status:"official_reference_scaled_to_game_population"},
  villages:{publisher:"BPS",title:"Jumlah Desa/Kelurahan Menurut Provinsi 2025",period:"2025",url:"https://www.bps.go.id/id/statistics-table/3/YkVWWFUyNTJTVTloVGpCeFdFVTNaMk5wUzFaUFFUMDkjMw%3D%3D/jumlah-desa-1-menurut-provinsi--2017.html",status:"official_count"},
  districts:{publisher:"BPS",title:"Jumlah Kecamatan Menurut Provinsi 2024",period:"2024",url:"https://www.bps.go.id/id/statistics-table/3/S3pkSVdHdG1iVU50TXlzdlNYY3pZVzFVV1haVlFUMDkjMw%3D%3D/jumlah-kecamatan-menurut-provinsi--2024.html?year=2024",status:"official_count"},
  regencyCity:{publisher:"BPS citing Kemendagri",title:"Statistik Indonesia 2025, Tabel 2.1.1–2.1.2; Podes 2024",period:"2024",url:"https://web-api.bps.go.id/download.php?f=0SoXq+pSNru0AQv7CytFYi9WbTFUVmZSMXBnVHdIQ2hOeStpV3dYcTMzbU5JRmhWYnBzbjBqeFpxcncvMThTQm9qTHRPTzNnTUNpa3Z0ekZnNGs5a3NqR05KdGpzK1RCcGRaYmY4R25jcUJHWVB4Znlma3JqYzVTUzd6cXFFZVBsS3RENk5xbFhJT1NNTFZPeVh1TjltMlZzdGpVcWxZZUQ1OWhHSnhZRmQxOWxXTXpMQ0Eyc2NTd0JST2J3NWRqZGRDcElCbkxvdEJ5dlVlUERqV3hiRm95NFhJVFZGNzYxYWNpbUdTamV6YXZldktWd1lRTlJPdytMUTNhK1lrSE5rc2Q0dFZXSlpheHNITUw%3D",status:"BPS_national_regency_city_reference_only_separate_from_Kemendagri_master"},
  localityMix:{publisher:"BPS",title:"Podes 2024 executive summary",period:"2024",url:"https://web-api.bps.go.id/download.php?f=UdAIFH4pKAoyxUUTZRp4zW1ySFEvSERXWGJoT3FpTEdvMnRUaXdJMm5lSjU3YU15QkRmWGN5RlNTQ2dLZDhUejd3MTlsYzZkNlJ5Z1dWNEF4azEzeFlDcGVjbzlvZ3Y4eUlQTHltcSt2SE9Xc3ZXdTlMR0ZCaVFaOExKV1VFWlNSemJWOXFzaCtySFN5VVNJRmhUcHpDTHVBYzgrUDBCOWJpVk1qWDdacTY5OHJlRFk3ekh2RjhhejBTc3dMWmVZY0w0MjIwRmhnbWdrYVZjbDAyTGY4RGcwRDJmMW03Mm8xMUVJc3RvcEtTajViaHhZdkRIWkpFdjlPU3Z0cktFL1c0UDI2V1EwQzExNlpVQWx3YmRKUHdCcSt0Tmo5Z1VmZGdqUUh3PT0%3D",status:"national_mix_reference_2024"},
  adminMaster:{publisher:"Third-party normalized open dataset derived from Kemendagri",title:"Kepmendagri No. 300.2.2-2138 Tahun 2025 administrative code master",period:"2025",url:"https://github.com/prodhokter/dataset-wilayah-indonesia",upstream:"https://github.com/cahyadsn/wilayah",status:"MIT_licensed_derived_admin_codes_and_names"},
  provincialHouseholdConsumption:{publisher:"Badan Pangan Nasional",title:"Rata-rata Konsumsi per Jenis Pangan Penduduk Indonesia Provinsi Update Tahun 2025",period:"2025",unit:"kg/kap/tahun",depth:"province",url:"https://data.badanpangan.go.id/datasetpublications/x1y/konsumsi-provinsi",status:"official_source_numeric_dataset_verified_page",definition:"average quantity of main foods actually consumed per capita in a province; household/food-consumption series; do not treat as total national requirement"},
  regencyCityHouseholdConsumption:{publisher:"Badan Pangan Nasional",title:"Rata-rata Konsumsi per Jenis Pangan Penduduk Indonesia Kabupaten Kota Tahun 2025",period:"2025",unit:"kg/kap/tahun",depth:"regency_city",url:"https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota",status:"official_source_numeric_dataset_verified_page",definition:"average quantity of main foods actually consumed per capita at kabupaten/kota depth; use for locality calibration before equal-share derivation"},
  nonHouseholdConsumption:{publisher:"BPS",title:"Konsumsi Bahan Pokok Non Rumah Tangga 2025",period:"2025",url:"https://www.bps.go.id/id/publication/2026/06/12/162a342d33ebfe0f41a75487/konsumsi-bahan-pokok-nonrumah-tangga-2025.html",status:"official_source_metadata_only_numeric_extraction_pending"}
 };
 // [id,name,pop2025_thousands,master_districts,master_village_units,desa,kelurahan,upt_spt,regencies,cities,bps_districts_2024,bps_village_units_2025,kemendagri_province_code]
 const PROVINCES=[
 ["aceh","Aceh",5626.0,290,6500,6500,0,0,18,5,290,6513,"11"],
 ["sumatera-utara","Sumatera Utara",15785.8,455,6110,5417,693,0,25,8,455,6113,"12"],
 ["sumatera-barat","Sumatera Barat",5914.3,179,1265,1035,230,0,12,7,179,1287,"13"],
 ["riau","Riau",6811.2,172,1862,1591,271,0,10,2,172,1870,"14"],
 ["jambi","Jambi",3768.5,144,1585,1414,171,0,9,2,144,1586,"15"],
 ["sumatera-selatan","Sumatera Selatan",8928.5,241,3259,2856,403,0,13,4,241,3285,"16"],
 ["bengkulu","Bengkulu",2138.0,129,1513,1341,172,0,9,1,129,1513,"17"],
 ["lampung","Lampung",9522.9,229,2651,2446,205,0,13,2,229,2654,"18"],
 ["kepulauan-bangka-belitung","Kepulauan Bangka Belitung",1550.8,47,393,309,84,0,6,1,47,393,"19"],
 ["kepulauan-riau","Kepulauan Riau",2213.5,80,419,275,144,0,5,2,80,430,"21"],
 ["dki-jakarta","DKI Jakarta",10678.0,44,267,0,267,0,1,5,44,267,"31"],
 ["jawa-barat","Jawa Barat",50759.0,627,5957,5311,646,0,18,9,627,5957,"32"],
 ["jawa-tengah","Jawa Tengah",38233.9,576,8563,7810,753,0,29,6,576,8563,"33"],
 ["di-yogyakarta","DI Yogyakarta",3781.5,78,438,392,46,0,4,1,78,438,"34"],
 ["jawa-timur","Jawa Timur",42089.3,666,8494,7721,773,0,29,9,666,8494,"35"],
 ["banten","Banten",12537.4,155,1552,1238,314,0,4,4,155,1552,"36"],
 ["bali","Bali",4461.3,57,716,636,80,0,8,1,57,718,"51"],
 ["nusa-tenggara-barat","Nusa Tenggara Barat",5731.1,117,1166,1021,145,0,8,2,117,1180,"52"],
 ["nusa-tenggara-timur","Nusa Tenggara Timur",5742.6,315,3442,3137,305,0,21,1,315,3538,"53"],
 ["kalimantan-barat","Kalimantan Barat",5766.0,174,2145,2046,99,0,12,2,174,2157,"61"],
 ["kalimantan-tengah","Kalimantan Tengah",2845.0,136,1571,1432,139,0,13,1,136,1577,"62"],
 ["kalimantan-selatan","Kalimantan Selatan",4323.3,156,2016,1872,144,0,11,2,156,2015,"63"],
 ["kalimantan-timur","Kalimantan Timur",4267.6,105,1038,841,197,0,7,3,105,1055,"64"],
 ["kalimantan-utara","Kalimantan Utara",749.4,55,482,447,35,0,4,1,55,484,"65"],
 ["sulawesi-utara","Sulawesi Utara",2721.4,171,1839,1507,332,0,11,4,171,1838,"71"],
 ["sulawesi-tengah","Sulawesi Tengah",3156.1,177,2017,1842,175,0,12,1,178,2022,"72"],
 ["sulawesi-selatan","Sulawesi Selatan",9563.1,313,3059,2266,793,0,21,3,311,3060,"73"],
 ["sulawesi-tenggara","Sulawesi Tenggara",2836.7,221,2285,1908,377,0,15,2,221,2292,"74"],
 ["gorontalo","Gorontalo",1242.2,77,729,657,72,0,5,1,77,732,"75"],
 ["sulawesi-barat","Sulawesi Barat",1525.3,69,648,575,73,0,6,0,69,650,"76"],
 ["maluku","Maluku",1970.6,119,1235,1200,35,0,9,2,119,1262,"81"],
 ["maluku-utara","Maluku Utara",1373.8,118,1185,1067,118,0,8,2,118,1209,"82"],
 ["papua-barat","Papua Barat",587.6,91,824,803,21,0,7,0,86,970,"92"],
 ["papua-barat-daya","Papua Barat Daya",636.4,132,1013,939,74,0,5,1,132,1056,"96"],
 ["papua","Papua",1073.6,105,999,934,51,14,8,1,107,1029,"91"],
 ["papua-selatan","Papua Selatan",549.7,82,690,677,13,0,4,0,82,690,"93"],
 ["papua-tengah","Papua Tengah",1492.3,131,1208,1172,36,0,8,0,131,1208,"94"],
 ["papua-pegunungan","Papua Pegunungan",1484.9,252,2627,2617,10,0,8,0,252,2634,"95"]
 ];
 const NATIONAL_ADMIN={regencies:416,cities:98,districts:7285,villageKelurahan:83762,desa:75252,kelurahan:8496,uptSpt:14,sourceYear:{regencies:2025,cities:2025,districts:2025,villageKelurahan:2025}};
 const BPS_ADMIN_REFERENCE={districts:7281,villageKelurahan:84291,sourceYear:{districts:2024,villageKelurahan:2025},definition:"separate BPS/Podes statistical series; do not merge counts with Kemendagri administrative master"};
 const PODES_MIX={villages:75753,kelurahan:8486,uptSpt:37,total:84276};
 const DEMAND_WEIGHT={pangan:1.0,hortikultura:0.32,perkebunan:0.12,buah:0.22,rempah:0.06,peternakan:0.28,perikanan:0.18,industri:0.14};
 const PHYSICAL_DEMAND_ANCHORS_2025=Object.freeze({
  jagung:{sourceCommodity:"Jagung",unit:"kg",annualPerCapita:1.5,source:"Bapanas konsumsi nasional update 2025",year:2025,status:"official_consumption_anchor"},
  ubi_kayu:{sourceCommodity:"Singkong",unit:"kg",annualPerCapita:10.9,source:"Bapanas konsumsi nasional update 2025",year:2025,status:"official_consumption_anchor"},
  ubi_jalar:{sourceCommodity:"Ubi Jalar",unit:"kg",annualPerCapita:4.0,source:"Bapanas konsumsi nasional update 2025",year:2025,status:"official_consumption_anchor"},
  kentang:{sourceCommodity:"Kentang",unit:"kg",annualPerCapita:2.5,source:"Bapanas konsumsi nasional update 2025",year:2025,status:"official_consumption_anchor"},
  kedelai:{sourceCommodity:"Kedelai",unit:"kg",annualPerCapita:8.8,source:"Bapanas konsumsi nasional update 2025",year:2025,status:"official_consumption_anchor"},
  kacang_tanah:{sourceCommodity:"Kacang Tanah",unit:"kg",annualPerCapita:0.4,source:"Bapanas konsumsi nasional update 2025",year:2025,status:"official_consumption_anchor"},
  kacang_hijau:{sourceCommodity:"Kacang Hijau",unit:"kg",annualPerCapita:0.3,source:"Bapanas konsumsi nasional update 2025",year:2025,status:"official_consumption_anchor"},
  kelapa:{sourceCommodity:"Kelapa",unit:"kg",annualPerCapita:1.0,source:"Bapanas konsumsi nasional update 2025",year:2025,status:"official_consumption_anchor_conversion_pending"}
 });
 const BAPANAS_NATIONAL_CONSUMPTION_2025=Object.freeze([
  ["beras","Padi-Padian","Beras",87.3],["jagung","Padi-Padian","Jagung",1.5],["terigu","Padi-Padian","Terigu",14.8],
  ["singkong","Umbi-umbian","Singkong",10.9],["ubi_jalar","Umbi-umbian","Ubi Jalar",4.0],["kentang","Umbi-umbian","Kentang",2.5],["sagu","Umbi-umbian","Sagu",0.3],["umbi_lainnya","Umbi-umbian","Umbi Lainnya",0.6],
  ["daging_ruminansia","Pangan Hewani","Daging Ruminansia",5.1],["daging_unggas","Pangan Hewani","Daging Unggas",10.5],["telur","Pangan Hewani","Telur",7.7],["susu","Pangan Hewani","Susu",2.3],["ikan","Pangan Hewani","Ikan",23.1],
  ["minyak_kelapa","Minyak dan Lemak","Minyak Kelapa",0.2],["minyak_sawit","Minyak dan Lemak","Minyak Sawit",10.0],["minyak_lainnya","Minyak dan Lemak","Minyak Lainnya",0.5],
  ["kelapa","Buah/biji berminyak","Kelapa",1.0],["kemiri","Buah/biji berminyak","Kemiri",0.2],
  ["kedelai","Kacang-kacangan","Kedelai",8.8],["kacang_tanah","Kacang-kacangan","Kacang Tanah",0.4],["kacang_hijau","Kacang-kacangan","Kacang Hijau",0.3],["kacang_lain","Kacang-kacangan","Kacang Lain",1.2],
  ["gula_pasir","Gula","Gula Pasir",8.4],["gula_merah","Gula","Gula Merah",0.5],["sayur","Sayuran dan buah","Sayur",56.5],["buah","Sayuran dan buah","Buah",39.1],["minuman","Lain-lain","Minuman",25.4],["bumbu","Lain-lain","Bumbu-Bumbuan",3.4]
 ]);
 const BAPANAS_MONTHLY_DEMAND_2025=Object.freeze({
  source:{publisher:"Badan Pangan Nasional",title:"Petunjuk Teknis Tata Cara Penyusunan Proyeksi Neraca Pangan Tahun 2025",decisionReference:"PDF cover: Keputusan Kepala Bapanas No. 27 Tahun 2025; lampiran heading: Nomor 22 Tahun 2025 (source-internal reference discrepancy preserved)",table:"Tabel 2.5 Koefisien Kebutuhan Pangan Bulanan Tahun 2025",unit:"annual-demand share per month",url:"https://data.badanpangan.go.id/nfs_storage/public/publication/documents/1776218737.pdf",status:"official_primary_pdf_table_transcribed"},
  // Values are transcribed as printed (four decimals). Their annual sums are not normalized:
  // HBKN coefficients intentionally add demand above the normal day-count allocation.
  records:Object.freeze({
   padi:Object.freeze({sourceCommodity:"Beras",mappingStatus:"downstream_signal_rice_to_paddy_index_only",coefficients:Object.freeze([0.0849,0.0769,0.0888,0.0822,0.0849,0.0823,0.0849,0.0849,0.0822,0.0849,0.0822,0.0850])}),
   jagung:Object.freeze({sourceCommodity:"Jagung pipilan kering",mappingStatus:"physical_commodity_match",coefficients:Object.freeze([0.0849,0.0767,0.0849,0.0822,0.0849,0.0822,0.0849,0.0849,0.0822,0.0849,0.0822,0.0849])}),
   cabai_merah:Object.freeze({sourceCommodity:"Cabai Merah",mappingStatus:"physical_commodity_match",coefficients:Object.freeze([0.0849,0.0785,0.0884,0.0822,0.0849,0.0839,0.0849,0.0849,0.0822,0.0849,0.0822,0.0853])}),
   cabai_rawit:Object.freeze({sourceCommodity:"Cabai Rawit",mappingStatus:"physical_commodity_match",coefficients:Object.freeze([0.0849,0.0791,0.0897,0.0822,0.0849,0.0834,0.0849,0.0849,0.0822,0.0849,0.0822,0.0854])}),
   bawang_merah:Object.freeze({sourceCommodity:"Bawang Merah",mappingStatus:"physical_commodity_match",coefficients:Object.freeze([0.0849,0.0789,0.0910,0.0822,0.0849,0.0835,0.0849,0.0849,0.0822,0.0849,0.0822,0.0850])}),
   bawang_putih:Object.freeze({sourceCommodity:"Bawang Putih",mappingStatus:"physical_commodity_match",coefficients:Object.freeze([0.0849,0.0796,0.0901,0.0822,0.0849,0.0829,0.0849,0.0849,0.0822,0.0849,0.0822,0.0850])}),
   kedelai:Object.freeze({sourceCommodity:"Kedelai",mappingStatus:"physical_commodity_match",coefficients:Object.freeze([0.0849,0.0767,0.0849,0.0822,0.0849,0.0822,0.0849,0.0849,0.0822,0.0849,0.0822,0.0849])})
  }),
  unmappedRecords:Object.freeze({
   daging_sapi:Object.freeze({sourceCommodity:"Daging Sapi",mappingStatus:"research_only_no_kg_meat_catalog_stage",coefficients:Object.freeze([0.0849,0.0811,0.0965,0.0822,0.0849,0.2336,0.0849,0.0849,0.0822,0.0849,0.0822,0.0855])}),
   daging_ayam:Object.freeze({sourceCommodity:"Daging Ayam",mappingStatus:"research_only_no_kg_meat_catalog_stage",coefficients:Object.freeze([0.0849,0.0786,0.0910,0.0822,0.0849,0.0827,0.0849,0.0849,0.0822,0.0849,0.0822,0.0857])}),
   telur_ayam:Object.freeze({sourceCommodity:"Telur Ayam",mappingStatus:"research_only_no_kg_egg_catalog_stage",coefficients:Object.freeze([0.0849,0.0825,0.0963,0.0822,0.0849,0.0824,0.0849,0.0849,0.0822,0.0849,0.0822,0.0858])}),
   gula_pasir:Object.freeze({sourceCommodity:"Gula Pasir",mappingStatus:"research_only_catalog_product_missing",coefficients:Object.freeze([0.0849,0.0786,0.0892,0.0822,0.0849,0.0823,0.0849,0.0849,0.0822,0.0849,0.0822,0.0850])}),
   minyak_goreng:Object.freeze({sourceCommodity:"Minyak Goreng",mappingStatus:"research_only_catalog_product_missing",coefficients:Object.freeze([0.0849,0.0786,0.0901,0.0822,0.0849,0.0822,0.0849,0.0849,0.0822,0.0849,0.0822,0.0852])})
  })
 });
 function seasonalDemandCoefficient(commodityId,day){
  const row=BAPANAS_MONTHLY_DEMAND_2025.records[String(commodityId)];if(!row)return 1/12;
  const safeDay=Math.max(1,Math.floor(Number(day)||1)),monthIndex=Math.floor((safeDay-1)/30)%12;
  return row.coefficients[monthIndex];
 }
 function seasonalDemandFactor(commodityId,day){return seasonalDemandCoefficient(commodityId,day)*12;}
 const BAPANAS_PROVINCIAL_CONSUMPTION_2025_PARTIAL=Object.freeze([
  // Exact Lampung leaf observations, Bapanas provincial dataset 2025; deliberately partial, not a complete province import.
  {provinceId:"lampung",provinceCode:"18",key:"beras",sourceCommodity:"Beras",group:"Padi-Padian",annualPerCapita:84.3,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"jagung",sourceCommodity:"Jagung",group:"Padi-Padian",annualPerCapita:1.0,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"singkong",sourceCommodity:"Singkong",group:"Umbi-umbian",annualPerCapita:12.4,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"ubi_jalar",sourceCommodity:"Ubi Jalar",group:"Umbi-umbian",annualPerCapita:3.5,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"kentang",sourceCommodity:"Kentang",group:"Umbi-umbian",annualPerCapita:1.2,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"daging_ruminansia",sourceCommodity:"Daging ruminansia",group:"Pangan Hewani",annualPerCapita:4.2,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"daging_unggas",sourceCommodity:"Daging Unggas",group:"Pangan Hewani",annualPerCapita:8.0,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"telur",sourceCommodity:"Telur",group:"Pangan Hewani",annualPerCapita:7.6,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"susu",sourceCommodity:"Susu",group:"Pangan Hewani",annualPerCapita:1.7,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"ikan",sourceCommodity:"Ikan",group:"Pangan Hewani",annualPerCapita:22.5,year:2025,unit:"kg/kap/tahun"},
  {provinceId:"lampung",provinceCode:"18",key:"kelapa",sourceCommodity:"Kelapa",group:"Buah/biji berminyak",annualPerCapita:1.2,year:2025,unit:"kg/kap/tahun"}
 ]);
 const BAPANAS_KABKOTA_CONSUMPTION_2025_PARTIAL=Object.freeze([
  // Verified leaf observations only; Bapanas 2025, code 3101 Administrasi Kepulauan Seribu. This is one complete locality extract, not a 514-locality import.
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"beras",sourceCommodity:"Beras",group:"Padi-Padian",annualPerCapita:88.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"jagung",sourceCommodity:"Jagung",group:"Padi-Padian",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"terigu",sourceCommodity:"Terigu",group:"Padi-Padian",annualPerCapita:13.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"singkong",sourceCommodity:"Singkong",group:"Umbi-umbian",annualPerCapita:7.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"ubi_jalar",sourceCommodity:"Ubi Jalar",group:"Umbi-umbian",annualPerCapita:0.8,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"kentang",sourceCommodity:"Kentang",group:"Umbi-umbian",annualPerCapita:0.8,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"sagu",sourceCommodity:"Sagu",group:"Umbi-umbian",annualPerCapita:0.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"umbi_lainnya",sourceCommodity:"Umbi Lainnya",group:"Umbi-umbian",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"daging_ruminansia",sourceCommodity:"Daging ruminansia",group:"Pangan Hewani",annualPerCapita:4.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"daging_unggas",sourceCommodity:"Daging Unggas",group:"Pangan Hewani",annualPerCapita:9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"telur",sourceCommodity:"Telur",group:"Pangan Hewani",annualPerCapita:10.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"susu",sourceCommodity:"Susu",group:"Pangan Hewani",annualPerCapita:2.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"ikan",sourceCommodity:"Ikan",group:"Pangan Hewani",annualPerCapita:45.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"minyak_kelapa",sourceCommodity:"Minyak Kelapa",group:"Minyak dan Lemak",annualPerCapita:1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"minyak_sawit",sourceCommodity:"Minyak Sawit",group:"Minyak dan Lemak",annualPerCapita:14.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"minyak_lainnya",sourceCommodity:"Minyak Lainnya",group:"Minyak dan Lemak",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"kelapa",sourceCommodity:"Kelapa",group:"Buah/Biji Berminyak",annualPerCapita:0.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"kemiri",sourceCommodity:"Kemiri",group:"Buah/Biji Berminyak",annualPerCapita:0.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"kedelai",sourceCommodity:"Kedelai",group:"Kacang-kacangan",annualPerCapita:6.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"kacang_tanah",sourceCommodity:"Kacang tanah",group:"Kacang-kacangan",annualPerCapita:0.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"kacang_hijau",sourceCommodity:"Kacang hijau",group:"Kacang-kacangan",annualPerCapita:0.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"kacang_lain",sourceCommodity:"Kacang lain",group:"Kacang-kacangan",annualPerCapita:0.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"gula_pasir",sourceCommodity:"Gula pasir",group:"Gula",annualPerCapita:6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"gula_merah",sourceCommodity:"Gula merah",group:"Gula",annualPerCapita:0.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"sayur",sourceCommodity:"Sayur",group:"Sayur dan Buah",annualPerCapita:47.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3101",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Administrasi Kepulauan Seribu",key:"buah",sourceCommodity:"Buah",group:"Sayur dan Buah",annualPerCapita:35.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"beras",sourceCommodity:"Beras",group:"Padi-Padian",annualPerCapita:76.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"jagung",sourceCommodity:"Jagung",group:"Padi-Padian",annualPerCapita:0.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"terigu",sourceCommodity:"Terigu",group:"Padi-Padian",annualPerCapita:17.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"singkong",sourceCommodity:"Singkong",group:"Umbi-umbian",annualPerCapita:7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"ubi_jalar",sourceCommodity:"Ubi Jalar",group:"Umbi-umbian",annualPerCapita:0.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"kentang",sourceCommodity:"Kentang",group:"Umbi-umbian",annualPerCapita:4.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"sagu",sourceCommodity:"Sagu",group:"Umbi-umbian",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"umbi_lainnya",sourceCommodity:"Umbi Lainnya",group:"Umbi-umbian",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"daging_ruminansia",sourceCommodity:"Daging ruminansia",group:"Pangan Hewani",annualPerCapita:6.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"daging_unggas",sourceCommodity:"Daging Unggas",group:"Pangan Hewani",annualPerCapita:15,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"telur",sourceCommodity:"Telur",group:"Pangan Hewani",annualPerCapita:8.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"susu",sourceCommodity:"Susu",group:"Pangan Hewani",annualPerCapita:3.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"ikan",sourceCommodity:"Ikan",group:"Pangan Hewani",annualPerCapita:17.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"minyak_kelapa",sourceCommodity:"Minyak Kelapa",group:"Minyak dan Lemak",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"minyak_sawit",sourceCommodity:"Minyak Sawit",group:"Minyak dan Lemak",annualPerCapita:9.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"minyak_lainnya",sourceCommodity:"Minyak Lainnya",group:"Minyak dan Lemak",annualPerCapita:0.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"kelapa",sourceCommodity:"Kelapa",group:"Buah/Biji Berminyak",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"kemiri",sourceCommodity:"Kemiri",group:"Buah/Biji Berminyak",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"kedelai",sourceCommodity:"Kedelai",group:"Kacang-kacangan",annualPerCapita:9.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"kacang_tanah",sourceCommodity:"Kacang tanah",group:"Kacang-kacangan",annualPerCapita:0.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"kacang_hijau",sourceCommodity:"Kacang hijau",group:"Kacang-kacangan",annualPerCapita:1.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"kacang_lain",sourceCommodity:"Kacang lain",group:"Kacang-kacangan",annualPerCapita:1.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"gula_pasir",sourceCommodity:"Gula pasir",group:"Gula",annualPerCapita:6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"gula_merah",sourceCommodity:"Gula merah",group:"Gula",annualPerCapita:0.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"sayur",sourceCommodity:"Sayur",group:"Sayur dan Buah",annualPerCapita:56.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3171",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Pusat",key:"buah",sourceCommodity:"Buah",group:"Sayur dan Buah",annualPerCapita:27.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"beras",sourceCommodity:"Beras",group:"Padi-Padian",annualPerCapita:81,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"jagung",sourceCommodity:"Jagung",group:"Padi-Padian",annualPerCapita:1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"terigu",sourceCommodity:"Terigu",group:"Padi-Padian",annualPerCapita:16.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"singkong",sourceCommodity:"Singkong",group:"Umbi-umbian",annualPerCapita:9.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"ubi_jalar",sourceCommodity:"Ubi Jalar",group:"Umbi-umbian",annualPerCapita:1.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"kentang",sourceCommodity:"Kentang",group:"Umbi-umbian",annualPerCapita:3.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"sagu",sourceCommodity:"Sagu",group:"Umbi-umbian",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"umbi_lainnya",sourceCommodity:"Umbi Lainnya",group:"Umbi-umbian",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"daging_ruminansia",sourceCommodity:"Daging ruminansia",group:"Pangan Hewani",annualPerCapita:7.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"daging_unggas",sourceCommodity:"Daging Unggas",group:"Pangan Hewani",annualPerCapita:14.8,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"telur",sourceCommodity:"Telur",group:"Pangan Hewani",annualPerCapita:9.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"susu",sourceCommodity:"Susu",group:"Pangan Hewani",annualPerCapita:4.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"ikan",sourceCommodity:"Ikan",group:"Pangan Hewani",annualPerCapita:21.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"minyak_kelapa",sourceCommodity:"Minyak Kelapa",group:"Minyak dan Lemak",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"minyak_sawit",sourceCommodity:"Minyak Sawit",group:"Minyak dan Lemak",annualPerCapita:9.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"minyak_lainnya",sourceCommodity:"Minyak Lainnya",group:"Minyak dan Lemak",annualPerCapita:0.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"kelapa",sourceCommodity:"Kelapa",group:"Buah/Biji Berminyak",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"kemiri",sourceCommodity:"Kemiri",group:"Buah/Biji Berminyak",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"kedelai",sourceCommodity:"Kedelai",group:"Kacang-kacangan",annualPerCapita:7.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"kacang_tanah",sourceCommodity:"Kacang tanah",group:"Kacang-kacangan",annualPerCapita:0.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"kacang_hijau",sourceCommodity:"Kacang hijau",group:"Kacang-kacangan",annualPerCapita:0.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"kacang_lain",sourceCommodity:"Kacang lain",group:"Kacang-kacangan",annualPerCapita:1.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"gula_pasir",sourceCommodity:"Gula pasir",group:"Gula",annualPerCapita:7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"gula_merah",sourceCommodity:"Gula merah",group:"Gula",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"sayur",sourceCommodity:"Sayur",group:"Sayur dan Buah",annualPerCapita:49.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3173",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Barat",key:"buah",sourceCommodity:"Buah",group:"Sayur dan Buah",annualPerCapita:40.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"beras",sourceCommodity:"Beras",group:"Padi-Padian",annualPerCapita:79,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"jagung",sourceCommodity:"Jagung",group:"Padi-Padian",annualPerCapita:1.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"terigu",sourceCommodity:"Terigu",group:"Padi-Padian",annualPerCapita:18,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"singkong",sourceCommodity:"Singkong",group:"Umbi-umbian",annualPerCapita:12.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"ubi_jalar",sourceCommodity:"Ubi Jalar",group:"Umbi-umbian",annualPerCapita:2.8,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"kentang",sourceCommodity:"Kentang",group:"Umbi-umbian",annualPerCapita:5.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"sagu",sourceCommodity:"Sagu",group:"Umbi-umbian",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"umbi_lainnya",sourceCommodity:"Umbi Lainnya",group:"Umbi-umbian",annualPerCapita:0.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"daging_ruminansia",sourceCommodity:"Daging ruminansia",group:"Pangan Hewani",annualPerCapita:6.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"daging_unggas",sourceCommodity:"Daging Unggas",group:"Pangan Hewani",annualPerCapita:15.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"telur",sourceCommodity:"Telur",group:"Pangan Hewani",annualPerCapita:9.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"susu",sourceCommodity:"Susu",group:"Pangan Hewani",annualPerCapita:5.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"ikan",sourceCommodity:"Ikan",group:"Pangan Hewani",annualPerCapita:25.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"minyak_kelapa",sourceCommodity:"Minyak Kelapa",group:"Minyak dan Lemak",annualPerCapita:0.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"minyak_sawit",sourceCommodity:"Minyak Sawit",group:"Minyak dan Lemak",annualPerCapita:11.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"minyak_lainnya",sourceCommodity:"Minyak Lainnya",group:"Minyak dan Lemak",annualPerCapita:1.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"kelapa",sourceCommodity:"Kelapa",group:"Buah/Biji Berminyak",annualPerCapita:0.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"kemiri",sourceCommodity:"Kemiri",group:"Buah/Biji Berminyak",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"kedelai",sourceCommodity:"Kedelai",group:"Kacang-kacangan",annualPerCapita:10.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"kacang_tanah",sourceCommodity:"Kacang tanah",group:"Kacang-kacangan",annualPerCapita:0.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"kacang_hijau",sourceCommodity:"Kacang hijau",group:"Kacang-kacangan",annualPerCapita:0.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"kacang_lain",sourceCommodity:"Kacang lain",group:"Kacang-kacangan",annualPerCapita:1.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"gula_pasir",sourceCommodity:"Gula pasir",group:"Gula",annualPerCapita:7.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"gula_merah",sourceCommodity:"Gula merah",group:"Gula",annualPerCapita:0.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"sayur",sourceCommodity:"Sayur",group:"Sayur dan Buah",annualPerCapita:59.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3174",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Selatan",key:"buah",sourceCommodity:"Buah",group:"Sayur dan Buah",annualPerCapita:45.2,year:2025,unit:"kg/kap/tahun"}
,
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"beras",sourceCommodity:"Beras",group:"Padi-Padian",annualPerCapita:82,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"jagung",sourceCommodity:"Jagung",group:"Padi-Padian",annualPerCapita:1.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"terigu",sourceCommodity:"Terigu",group:"Padi-Padian",annualPerCapita:20.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"singkong",sourceCommodity:"Singkong",group:"Umbi-umbian",annualPerCapita:11.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"ubi_jalar",sourceCommodity:"Ubi Jalar",group:"Umbi-umbian",annualPerCapita:3.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"kentang",sourceCommodity:"Kentang",group:"Umbi-umbian",annualPerCapita:4.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"sagu",sourceCommodity:"Sagu",group:"Umbi-umbian",annualPerCapita:0.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"umbi_lainnya",sourceCommodity:"Umbi Lainnya",group:"Umbi-umbian",annualPerCapita:0.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"daging_ruminansia",sourceCommodity:"Daging ruminansia",group:"Pangan Hewani",annualPerCapita:8,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"daging_unggas",sourceCommodity:"Daging Unggas",group:"Pangan Hewani",annualPerCapita:13.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"telur",sourceCommodity:"Telur",group:"Pangan Hewani",annualPerCapita:10.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"susu",sourceCommodity:"Susu",group:"Pangan Hewani",annualPerCapita:4.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"ikan",sourceCommodity:"Ikan",group:"Pangan Hewani",annualPerCapita:27.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"minyak_kelapa",sourceCommodity:"Minyak Kelapa",group:"Minyak dan Lemak",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"minyak_sawit",sourceCommodity:"Minyak Sawit",group:"Minyak dan Lemak",annualPerCapita:9.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"minyak_lainnya",sourceCommodity:"Minyak Lainnya",group:"Minyak dan Lemak",annualPerCapita:1.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"kelapa",sourceCommodity:"Kelapa",group:"Buah/Biji Berminyak",annualPerCapita:0.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"kemiri",sourceCommodity:"Kemiri",group:"Buah/Biji Berminyak",annualPerCapita:0.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"kedelai",sourceCommodity:"Kedelai",group:"Kacang-kacangan",annualPerCapita:9.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"kacang_tanah",sourceCommodity:"Kacang tanah",group:"Kacang-kacangan",annualPerCapita:0.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"kacang_hijau",sourceCommodity:"Kacang hijau",group:"Kacang-kacangan",annualPerCapita:0.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"kacang_lain",sourceCommodity:"Kacang lain",group:"Kacang-kacangan",annualPerCapita:1.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"gula_pasir",sourceCommodity:"Gula pasir",group:"Gula",annualPerCapita:7.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"gula_merah",sourceCommodity:"Gula merah",group:"Gula",annualPerCapita:0.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"sayur",sourceCommodity:"Sayur",group:"Sayur dan Buah",annualPerCapita:55.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3172",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Utara",key:"buah",sourceCommodity:"Buah",group:"Sayur dan Buah",annualPerCapita:42.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"beras",sourceCommodity:"Beras",group:"Padi-Padian",annualPerCapita:81.8,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"jagung",sourceCommodity:"Jagung",group:"Padi-Padian",annualPerCapita:0.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"terigu",sourceCommodity:"Terigu",group:"Padi-Padian",annualPerCapita:16.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"singkong",sourceCommodity:"Singkong",group:"Umbi-umbian",annualPerCapita:12.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"ubi_jalar",sourceCommodity:"Ubi Jalar",group:"Umbi-umbian",annualPerCapita:2.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"kentang",sourceCommodity:"Kentang",group:"Umbi-umbian",annualPerCapita:4.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"sagu",sourceCommodity:"Sagu",group:"Umbi-umbian",annualPerCapita:0.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"umbi_lainnya",sourceCommodity:"Umbi Lainnya",group:"Umbi-umbian",annualPerCapita:0.2,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"daging_ruminansia",sourceCommodity:"Daging ruminansia",group:"Pangan Hewani",annualPerCapita:7.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"daging_unggas",sourceCommodity:"Daging Unggas",group:"Pangan Hewani",annualPerCapita:13.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"telur",sourceCommodity:"Telur",group:"Pangan Hewani",annualPerCapita:8.9,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"susu",sourceCommodity:"Susu",group:"Pangan Hewani",annualPerCapita:5.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"ikan",sourceCommodity:"Ikan",group:"Pangan Hewani",annualPerCapita:24.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"minyak_kelapa",sourceCommodity:"Minyak Kelapa",group:"Minyak dan Lemak",annualPerCapita:0,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"minyak_sawit",sourceCommodity:"Minyak Sawit",group:"Minyak dan Lemak",annualPerCapita:10.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"minyak_lainnya",sourceCommodity:"Minyak Lainnya",group:"Minyak dan Lemak",annualPerCapita:0.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"kelapa",sourceCommodity:"Kelapa",group:"Buah/Biji Berminyak",annualPerCapita:0.4,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"kemiri",sourceCommodity:"Kemiri",group:"Buah/Biji Berminyak",annualPerCapita:0.1,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"kedelai",sourceCommodity:"Kedelai",group:"Kacang-kacangan",annualPerCapita:9.7,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"kacang_tanah",sourceCommodity:"Kacang tanah",group:"Kacang-kacangan",annualPerCapita:0.6,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"kacang_hijau",sourceCommodity:"Kacang hijau",group:"Kacang-kacangan",annualPerCapita:0.8,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"kacang_lain",sourceCommodity:"Kacang lain",group:"Kacang-kacangan",annualPerCapita:1.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"gula_pasir",sourceCommodity:"Gula pasir",group:"Gula",annualPerCapita:7.8,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"gula_merah",sourceCommodity:"Gula merah",group:"Gula",annualPerCapita:0.3,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"sayur",sourceCommodity:"Sayur",group:"Sayur dan Buah",annualPerCapita:55.5,year:2025,unit:"kg/kap/tahun"},
  {localityCode:"3175",provinceId:"dki-jakarta",provinceCode:"31",localityName:"Kota Administrasi Jakarta Timur",key:"buah",sourceCommodity:"Buah",group:"Sayur dan Buah",annualPerCapita:40.7,year:2025,unit:"kg/kap/tahun"}
 ]);
 const BPS_KABKOTA_POPULATION_2025=Object.freeze({
  "3101":Object.freeze({localityName:"Kepulauan Seribu",population:29090,sourceUnit:"ribu jiwa",sourceValue:29.09,year:2025,source:"BPS DKI Jakarta, Table 3.1.1 Population by Regency/Municipality, 2025"}),
  "3171":Object.freeze({localityName:"Jakarta Pusat",population:1038400,sourceUnit:"ribu jiwa",sourceValue:1038.40,year:2025,source:"BPS DKI Jakarta, Table 3.1.1 Population by Regency/Municipality, 2025"}),
  "3172":Object.freeze({localityName:"Jakarta Utara",population:1819010,sourceUnit:"ribu jiwa",sourceValue:1819.01,year:2025,source:"BPS DKI Jakarta, Table 3.1.1 Population by Regency/Municipality, 2025"}),
  "3173":Object.freeze({localityName:"Jakarta Barat",population:2487200,sourceUnit:"ribu jiwa",sourceValue:2487.20,year:2025,source:"BPS DKI Jakarta, Table 3.1.1 Population by Regency/Municipality, 2025"}),
  "3174":Object.freeze({localityName:"Jakarta Selatan",population:2219220,sourceUnit:"ribu jiwa",sourceValue:2219.22,year:2025,source:"BPS DKI Jakarta, Table 3.1.1 Population by Regency/Municipality, 2025"}),
  "3175":Object.freeze({localityName:"Jakarta Timur",population:3085060,sourceUnit:"ribu jiwa",sourceValue:3085.06,year:2025,source:"BPS DKI Jakarta, Table 3.1.1 Population by Regency/Municipality, 2025"})
 });
 const BPS_DKI_LOCALITY_CODES=Object.freeze(["3101","3171","3172","3173","3174","3175"]);
 let BPS_DKI_LOCALITY_GAME_POPULATION_2025=null;
 function getBpsDkiLocalityGamePopulation2025(){if(!BPS_DKI_LOCALITY_GAME_POPULATION_2025){const dki=provinceRecords.find(p=>p.id==="dki-jakarta");BPS_DKI_LOCALITY_GAME_POPULATION_2025=Object.freeze(Object.fromEntries(largestRemainder(dki.population,BPS_DKI_LOCALITY_CODES.map(code=>BPS_KABKOTA_POPULATION_2025[code].population)).map((population,index)=>[BPS_DKI_LOCALITY_CODES[index],population])));}return BPS_DKI_LOCALITY_GAME_POPULATION_2025;}
 const BAPANAS_GAME_CONSUMPTION_MAP=Object.freeze({
  jagung:{gameId:"jagung",mode:"physical"},singkong:{gameId:"ubi_kayu",mode:"physical"},ubi_jalar:{gameId:"ubi_jalar",mode:"physical"},kentang:{gameId:"kentang",mode:"physical"},kedelai:{gameId:"kedelai",mode:"physical"},kacang_tanah:{gameId:"kacang_tanah",mode:"physical"},kacang_hijau:{gameId:"kacang_hijau",mode:"physical"},
  beras:{gameId:"padi",mode:"downstream_signal"},kelapa:{gameId:"kelapa",mode:"unit_conversion_pending"},
  daging_ruminansia:{category:"peternakan",mode:"category_signal"},daging_unggas:{category:"peternakan",mode:"category_signal"},telur:{category:"peternakan",mode:"category_signal"},susu:{category:"peternakan",mode:"category_signal"},
  ikan:{category:"perikanan",mode:"category_signal"},minyak_kelapa:{category:"perkebunan",mode:"category_signal"},minyak_sawit:{category:"perkebunan",mode:"category_signal"},minyak_lainnya:{category:"industri",mode:"category_signal"},kemiri:{category:"rempah",mode:"category_signal"},kacang_lain:{category:"pangan",mode:"category_signal"},gula_pasir:{category:"pangan",mode:"category_signal"},gula_merah:{category:"pangan",mode:"category_signal"},sayur:{category:"hortikultura",mode:"category_signal"},buah:{category:"buah",mode:"category_signal"},minuman:{category:"industri",mode:"category_signal"},bumbu:{category:"rempah",mode:"category_signal"},terigu:{category:"industri",mode:"category_signal"},sagu:{category:"pangan",mode:"category_signal"},umbi_lainnya:{category:"pangan",mode:"category_signal"}
 });
 function buildConsumptionModel(){
  const physical={},categoryTotals={};
  BAPANAS_NATIONAL_CONSUMPTION_2025.forEach(([key,group,sourceCommodity,annualPerCapita])=>{const m=BAPANAS_GAME_CONSUMPTION_MAP[key]||{};const row={key,group,sourceCommodity,annualPerCapita,unit:"kg/kap/tahun",year:2025,source:"Bapanas konsumsi nasional update 2025",mappingStatus:m.mode||"unmapped",gameId:m.gameId||null,category:m.category||null};physical[key]=row;if(m.category)categoryTotals[m.category]=(categoryTotals[m.category]||0)+annualPerCapita;});
  return Object.freeze({rows:physical,categoryTotals});
 }
 const BAPANAS_CONSUMPTION_MODEL_2025=buildConsumptionModel();
 const SUPPLY_PROFILE={"jawa-barat":1.20,"jawa-tengah":1.28,"jawa-timur":1.32,"lampung":1.18,"sumatera-selatan":1.08,"sulawesi-selatan":1.16,"nusa-tenggara-barat":1.08,"aceh":0.92,"sumatera-utara":0.96,"sumatera-barat":0.94,"banten":0.88,"bali":0.86,"nusa-tenggara-timur":0.62,"papua-selatan":0.72};
 const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(n))?Number(n):min));
 function largestRemainder(total,weights){const sum=weights.reduce((a,b)=>a+b,0)||1;const raw=weights.map(w=>total*w/sum);const out=raw.map(Math.floor);let left=total-out.reduce((a,b)=>a+b,0);raw.map((v,i)=>({i,r:v-out[i]})).sort((a,b)=>b.r-a.r).slice(0,left).forEach(x=>out[x.i]++);return out;}
 const provincePopulation=largestRemainder(POPULATION,PROVINCES.map(p=>p[2]));
 const provinceRecords=PROVINCES.map((p,i)=>({id:p[0],name:p[1],populationReference2025:Math.round(p[2]*1000),population:provincePopulation[i],districtCount:p[3],villageKelurahanCount:p[4],desaCount:p[5],kelurahanCount:p[6],uptSptCount:p[7],regencyCount:p[8],cityCount:p[9],bpsDistrictCount:p[10],bpsVillageKelurahanCount:p[11],adminCode:p[12],populationAllocation:"proportional_to_BPS_2025_provincial_share",localityNamesStatus:"derived_kemendagri_2025_master_loaded_on_demand",adminAllocationStatus:"third_party_normalized_kemendagri_2025",sourceStatus:"BPS_population_weights_plus_Kemendagri_admin_master"}));
 function hash(text){let h=2166136261;for(let i=0;i<String(text).length;i++){h^=String(text).charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
 function random(seed){let a=seed>>>0;return function(){a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
 function activeAgentTarget(population){return clamp(Math.ceil(Math.sqrt(population)*0.08),1000,5000);}
 const ROLES=["farmer","livestock_operator","fisher","processor","wholesaler","retailer","logistics_operator","institutional_buyer","government_officer"];
 function buildAgents(seed){const count=activeAgentTarget(POPULATION),r=random(seed),weights=[.24,.08,.07,.12,.13,.15,.09,.07,.05],out=[];for(let i=0;i<count;i++){let roll=r(),sum=0,role=ROLES[0];for(let j=0;j<weights.length;j++){sum+=weights[j];if(roll<=sum){role=ROLES[j];break;}}const pi=Math.floor(r()*provinceRecords.length);out.push({id:"agent-"+String(i+1).padStart(4,"0"),provinceId:provinceRecords[pi].id,role,behavior:role==="farmer"||role==="livestock_operator"||role==="fisher"?"respond_to_expected_margin":role==="logistics_operator"?"route_capacity_and_cost":role==="government_officer"?"reserve_and_price_stability":"inventory_turnover_and_margin",riskTolerance:0.25+r()*0.75,priceSensitivity:0.25+r()*0.75,logisticsSkill:0.5+r(),active:true,representativeWeight:Math.max(1,Math.round(POPULATION/count)),lastAction:"observe_market",lastDecisionDay:0});}return out;}
 function catalog(){return typeof COMMODITIES!=="undefined"&&Array.isArray(COMMODITIES)?COMMODITIES:(Array.isArray(root.COMMODITIES)?root.COMMODITIES:[]);}
 function gameState(){return typeof S!=="undefined"&&S?S:(root.S||null);}
 function demandWeight(item){return Number(DEMAND_WEIGHT[item.category])||0.05;}
 function maizeProjectionRuntimeData(){
  const real=root.REAL_ECONOMIC_DATA||{},maize=real.maizeNationalDemand||{},balance=maize.nationalBalanceProjection2025||{},projection=maize.nationalDemandProjection2025||{},denominator=maize.populationDenominator||{};
  const production=real.maizeProduction2025||{};
  if(balance.status!=="official_projection"||!Number.isFinite(balance.totalNeedTon)||balance.totalNeedTon<=0||denominator.qualityStatus!=="official_projection"||!Number.isFinite(denominator.value)||denominator.value<=0||production.status!=="official_statistic_final"||!Number.isFinite(production.productionAt14MoistureTon)||production.productionAt14MoistureTon<=0)return null;
  return {maize,balance,projection,denominator,production};
 }
 function applyPaddyProductionReference(s){
  const data=REAL_ECONOMIC_DATA.paddyProvincialProduction2025;
  if(!s||!data||data.coverage?.verifiedProvinceCount!==38)return {status:"source_not_loaded"};
  const records=data.records||{},ids=Object.keys(records);
  const totalGkg=ids.reduce((sum,id)=>sum+Number(records[id]?.productionTonGkg||0),0);
  const totalRice=ids.reduce((sum,id)=>sum+Number(records[id]?.riceEquivalentTon||0),0);
  if(ids.length!==38||totalGkg!==data.provincialRowSumTonGkg||totalGkg-data.nationalTotalTonGkg!==data.provincialToNationalDifferenceTonGkg||totalRice!==data.nationalRiceEquivalentTon)return {status:"source_reconciliation_failed",provinceRows:ids.length,totalGkg,totalRice};
  if(!s.national.marketSupplyReference2025)s.national.marketSupplyReference2025={};
  s.national.marketSupplyReference2025.padi={
   unit:"tonne_GKG/year",riceEquivalentUnit:"tonne_rice/year",referenceYear:2025,
   nationalProductionTonGkg:data.nationalTotalTonGkg,provincialRowSumTonGkg:totalGkg,provincialToNationalDifferenceTonGkg:totalGkg-data.nationalTotalTonGkg,nationalRiceEquivalentTon:totalRice,
   coverage:{verifiedProvinceCount:38,totalProvinceCount:38,coverageStatus:"complete_official_provincial_table"},
   source:data.source,qualityDefinition:data.qualityDefinition,
   runtimeUse:data.runtimeUse,status:data.status,
   dailySupplyStatus:"annual_reference_only_monthly_harvest_curve_pending"
  };
  provinceRecords.forEach(meta=>{
   const row=records[meta.id],p=s.provinces[meta.id];
   if(!row||!p)return;
   if(!p.marketSupplyReference2025)p.marketSupplyReference2025={};
   p.marketSupplyReference2025.padi={
    unit:"kg_GKG/year",productionKgGkg:row.productionTonGkg*1000,
    riceEquivalentKg:row.riceEquivalentTon*1000,referenceYear:2025,
    source:data.source,status:"official_provincial_annual_reference_not_daily_supply"
   };
  });
  return {status:"applied",provinceRows:ids.length,totalGkg,totalRice};
 }
 function applyHorticultureProductionReference(s){
  const data=REAL_ECONOMIC_DATA.horticultureNationalProduction2025;
  if(!s||!data||data.coverage?.verifiedCommodityCount!==18)return {status:"source_not_loaded"};
  const records=data.records||{},ids=Object.keys(records);
  if(ids.length!==18||ids.some(id=>!catalog().some(item=>item.id===id)))return {status:"source_catalog_mismatch",records:ids.length};
  if(!s.national.marketSupplyReference2025)s.national.marketSupplyReference2025={};
  s.national.marketSupplyReference2025.horticulture={
   referenceYear:2025,unit:"kg/year",sourceUnit:data.unit,
   coverage:data.coverage,provincialCoverage:data.provincialCoverage,provincialSources:data.provincialSources,provincialRecords:Object.fromEntries(Object.entries(data.provincialRecords||{}).map(([provinceId,rows])=>[provinceId,Object.assign({},rows)])),source:data.source,status:data.status,
   runtimeUse:data.runtimeUse,records:Object.fromEntries(ids.map(id=>[id,Object.assign({},records[id])]))
  };
  return {status:"applied",commodityRows:ids.length};
 }
 function applyPlantationProductionReference(s){
  const data=REAL_ECONOMIC_DATA.plantationProduction2024Partial;
  if(!s||!data||data.coverage?.verifiedProvinceCount!==38||data.coverage?.verifiedCommodityCount!==7)return {status:"source_not_loaded"};
  const provinceIds=Object.keys(data.records||{}),commodityIds=Object.keys(data.commodityMap||{});
  if(provinceIds.length!==38||commodityIds.length!==7||provinceIds.some(id=>!provinceRecords.some(p=>p.id===id))||commodityIds.some(id=>!catalog().some(item=>item.id===id)))return {status:"source_catalog_mismatch",provinceRows:provinceIds.length,commodityRows:commodityIds.length};
  if(!s.national.marketSupplyReference2024)s.national.marketSupplyReference2024={};
  s.national.marketSupplyReference2024.plantation={
   referenceYear:2024,sourceUnit:data.sourceUnit,conversion:data.conversion,
   coverage:data.coverage,source:data.source,status:data.status,runtimeUse:data.runtimeUse,
   records:Object.fromEntries(provinceIds.map(provinceId=>[provinceId,Object.assign({},data.records[provinceId])]))
  };
  provinceIds.forEach(provinceId=>{
   const p=s.provinces[provinceId];
   if(!p.marketSupplyReference2024)p.marketSupplyReference2024={};
   p.marketSupplyReference2024.plantation={};
   commodityIds.forEach(id=>{
    const value=data.records[provinceId][id];
    if(!Number.isFinite(value)||value<0)throw new Error("Invalid BPS plantation production value: "+provinceId+"/"+id);
    p.marketSupplyReference2024.plantation[id]={
     unit:"kg/year",productionKg:value*data.conversion.kgPerThousandTonne,
     productionThousandTon:value,referenceYear:2024,source:data.source,
     status:"official_provincial_annual_reference_not_daily_supply"
    };
   });
  });
  return {status:"applied",provinceRows:provinceIds.length,commodityRows:commodityIds.length,observations:provinceIds.length*commodityIds.length};
 }
 function applyLivestockPopulationReference(s){
  const data=REAL_ECONOMIC_DATA.livestockPopulation2024;
  if(!s||!data||data.coverage?.verifiedProvinceCount!==38||data.coverage?.verifiedSpeciesCount!==7)return {status:"source_not_loaded"};
  const provinceIds=Object.keys(data.records||{}),speciesIds=Object.keys(data.species||{});
  if(provinceIds.length!==38||speciesIds.length!==7||provinceIds.some(id=>!provinceRecords.some(p=>p.id===id)))return {status:"source_coverage_mismatch",provinceRows:provinceIds.length,speciesRows:speciesIds.length};
  const sums=Object.fromEntries(speciesIds.map(id=>[id,0]));
  const records={};
  provinceIds.forEach(provinceId=>{
   const values=data.records[provinceId];
   if(!Array.isArray(values)||values.length!==speciesIds.length)throw new Error("Invalid BPS livestock population row: "+provinceId);
   const counts={};
   speciesIds.forEach((id,index)=>{
    const value=Number(values[index]);if(!Number.isFinite(value)||value<0)throw new Error("Invalid BPS livestock population value: "+provinceId+"/"+id);
    counts[id]=value;sums[id]+=value;
   });
   records[provinceId]=counts;
   const p=s.provinces[provinceId];
   p.livestockPopulationReference2024={referenceYear:2024,unit:"head",source:data.source,status:data.status,counts,catalogPopulation:Object.fromEntries(Object.entries(data.catalogMapping||{}).map(([speciesId,commodityId])=>[commodityId,counts[speciesId]]))};
  });
  speciesIds.forEach(id=>{if(sums[id]!==Number(data.nationalTotals[id]))throw new Error("BPS livestock population national total mismatch: "+id);});
  s.national.livestockPopulationReference2024={referenceYear:2024,unit:"head",source:data.source,status:data.status,coverage:data.coverage,species:data.species,catalogMapping:data.catalogMapping,nationalTotals:data.nationalTotals,provincialRowSums:sums,records};
  return {status:"applied",provinceRows:provinceIds.length,speciesRows:speciesIds.length,observations:provinceIds.length*speciesIds.length,mappedCatalogCommodities:Object.keys(data.catalogMapping||{}).length};
 }
 function applyPoultryPopulationReference(s){
  const data=REAL_ECONOMIC_DATA.poultryPopulation2025;
  if(!s||!data||data.coverage?.verifiedProvinceCount!==38||data.coverage?.verifiedSpeciesCount!==4)return {status:"source_not_loaded"};
  const provinceIds=Object.keys(data.records||{}),speciesIds=Object.keys(data.species||{});
  if(provinceIds.length!==38||speciesIds.length!==4||provinceIds.some(id=>!provinceRecords.some(p=>p.id===id)))return {status:"source_coverage_mismatch",provinceRows:provinceIds.length,speciesRows:speciesIds.length};
  const sums=Object.fromEntries(speciesIds.map(id=>[id,0])),available=Object.fromEntries(speciesIds.map(id=>[id,0])),records={};
  provinceIds.forEach(provinceId=>{
   const values=data.records[provinceId];
   if(!Array.isArray(values)||values.length!==speciesIds.length)throw new Error("Invalid BPS poultry population row: "+provinceId);
   const counts={};
   speciesIds.forEach((id,index)=>{
    const value=values[index];
    if(value!==null&&(!Number.isFinite(Number(value))||Number(value)<0))throw new Error("Invalid BPS poultry population value: "+provinceId+"/"+id);
    counts[id]=value===null?null:Number(value);
    if(value!==null){sums[id]+=Number(value);available[id]++;}
   });
   records[provinceId]=counts;
   const p=s.provinces[provinceId];
   p.poultryPopulationReference2025={referenceYear:2025,unit:"head",source:data.source,status:data.status,provisional:true,counts,catalogPopulation:Object.fromEntries(Object.entries(data.catalogMapping||{}).map(([speciesId,commodityId])=>[commodityId,counts[speciesId]]))};
  });
  speciesIds.forEach(id=>{if(sums[id]!==Number(data.nationalTotals[id]))throw new Error("BPS poultry population national total mismatch: "+id);});
  s.national.poultryPopulationReference2025={referenceYear:2025,unit:"head",source:data.source,status:data.status,provisional:true,coverage:data.coverage,species:data.species,catalogMapping:data.catalogMapping,nationalTotals:data.nationalTotals,provincialAvailableRowSums:sums,availableProvinceCounts:available,records};
  return {status:"applied",provinceRows:provinceIds.length,speciesRows:speciesIds.length,observations:provinceIds.length*speciesIds.length,availableObservations:Object.values(available).reduce((a,b)=>a+b,0),mappedCatalogCommodities:Object.keys(data.catalogMapping||{}).length};
 }
 function applyAquacultureProductionReference(s){
  const data=REAL_ECONOMIC_DATA.aquacultureNationalProduction2024;
  if(!s||!data||!data.recordsTon||Object.keys(data.recordsTon).length!==11)return {status:"source_not_loaded"};
  const ids=Object.keys(data.recordsTon),mapped=Object.keys(data.catalogMapping||{}),recordsKg={};
  ids.forEach(id=>{
   const tonnes=Number(data.recordsTon[id]);if(!Number.isFinite(tonnes)||tonnes<0)throw new Error("Invalid KKP aquaculture production value: "+id);
   recordsKg[id]=tonnes*1000;
  });
  mapped.forEach(id=>{const commodityId=data.catalogMapping[id];if(!catalog().some(item=>item.id===commodityId)||!Number.isFinite(data.recordsTon[id]))throw new Error("Aquaculture catalog mapping mismatch: "+id);});
  if(!s.national.marketSupplyReference2024)s.national.marketSupplyReference2024={};
  s.national.marketSupplyReference2024.aquaculture={referenceYear:2024,sourceUnit:data.sourceUnit,source:data.source,status:data.status,coverage:data.coverage,recordsTon:Object.assign({},data.recordsTon),recordsKg,catalogMapping:Object.assign({},data.catalogMapping),unmappedSpecies:Object.assign({},data.unmappedSpecies),runtimeUse:data.runtimeUse};
  return {status:"applied",sourceRecords:ids.length,mappedCatalogCommodities:mapped.length};
 }
 function applyAquacultureProvincialProductionReference(s){
  const data=REAL_ECONOMIC_DATA.aquacultureProvincialProduction2024Bps;
  if(!s||!data||data.coverage?.verifiedProvinceCount!==38||data.coverage?.verifiedSpeciesCount!==11)return {status:"source_not_loaded"};
  const provinceIds=Object.keys(data.records||{}),speciesIds=Object.keys(data.species||{});
  if(provinceIds.length!==38||speciesIds.length!==11||provinceIds.some(id=>!provinceRecords.some(p=>p.id===id)))return {status:"source_coverage_mismatch"};
  const sums=Object.fromEntries(speciesIds.map(id=>[id,0])),records={};
  provinceIds.forEach(provinceId=>{
   const values=data.records[provinceId];if(!Array.isArray(values)||values.length!==speciesIds.length)throw new Error("Invalid BPS aquaculture row: "+provinceId);
   const countsTon={};
   speciesIds.forEach((id,index)=>{const value=Number(values[index]);if(!Number.isFinite(value)||value<0)throw new Error("Invalid BPS aquaculture value: "+provinceId+"/"+id);countsTon[id]=value;sums[id]+=value;});
   records[provinceId]=countsTon;
   const p=s.provinces[provinceId];
   p.aquacultureProductionReference2024Bps={referenceYear:2024,unit:"tonne",source:data.source,status:data.status,countsTon,catalogProductionTon:Object.fromEntries(Object.entries(data.catalogMapping||{}).map(([speciesId,commodityId])=>[commodityId,countsTon[speciesId]]))};
  });
  speciesIds.forEach(id=>{if(sums[id]!==Number(data.provincialRowSumsTon[id]))throw new Error("BPS aquaculture provincial row sum mismatch: "+id);});
  if(!s.national.marketSupplyReference2024)s.national.marketSupplyReference2024={};
  s.national.marketSupplyReference2024.aquacultureBps={referenceYear:2024,sourceUnit:data.sourceUnit,source:data.source,status:data.status,coverage:data.coverage,species:data.species,catalogMapping:data.catalogMapping,nationalTotalsTon:data.nationalTotalsTon,provincialRowSumsTon:sums,provincialToNationalDifferencesTon:data.provincialToNationalDifferencesTon,kkpNationalComparisonTon:data.kkpNationalComparisonTon,records};
  return {status:"applied",provinceRows:provinceIds.length,speciesRows:speciesIds.length,observations:provinceIds.length*speciesIds.length,mappedCatalogCommodities:Object.keys(data.catalogMapping||{}).length};
 }
 function applyCommodityPhysicalCoverage(s){
  const items=catalog(),storage=root.AgroCommodityStorage;
  provinceRecords.forEach(meta=>{
   const p=s.provinces[meta.id];if(!p)return;
   if(!p.commodityPhysicalCoverage)p.commodityPhysicalCoverage={};
   if(!p.dailyPhysicalSupply)p.dailyPhysicalSupply={};
   if(!p.dailyPhysicalSupplyStatus)p.dailyPhysicalSupplyStatus={};
   items.forEach(item=>{
    const id=item.id,profile=storage&&typeof storage.profileFor==="function"?storage.profileFor(id):null;
    const demandRecord=(p.totalMarketDemand2025&&p.totalMarketDemand2025[id])||(p.regionalPhysicalDemand&&p.regionalPhysicalDemand[id])||(p.physicalDemand&&p.physicalDemand[id]);
    const horticultureData=REAL_ECONOMIC_DATA.horticultureNationalProduction2025;
    const provincialHorticultureValue=horticultureData?.provincialRecords?.[meta.id]?.[id];
    const horticultureProvincialRecord=Number.isFinite(provincialHorticultureValue)?{productionKg:provincialHorticultureValue*100,productionQuintal:provincialHorticultureValue}:null;
    const livestockPopulationHead=p.livestockPopulationReference2024?.catalogPopulation?.[id];
    const poultryPopulationHead=p.poultryPopulationReference2025?.catalogPopulation?.[id];
    const aquacultureNationalProductionTon=s.national.marketSupplyReference2024?.aquaculture?.recordsTon?.[id];
    const aquacultureBpsProvincialProductionTon=p.aquacultureProductionReference2024Bps?.catalogProductionTon?.[id];
    const aquacultureBpsProvincialRecord=Number.isFinite(aquacultureBpsProvincialProductionTon)?{productionKg:aquacultureBpsProvincialProductionTon*1000,productionTon:aquacultureBpsProvincialProductionTon,referenceYear:2024,scope:"province"}:null;
    const plantationValue=REAL_ECONOMIC_DATA.plantationProduction2024Partial?.records?.[meta.id]?.[id];
    const plantationProvincialRecord=Number.isFinite(plantationValue)?{productionKg:plantationValue*1000000,productionThousandTon:plantationValue,referenceYear:2024}:null;
    const supplyRecord=id==="padi"?p.marketSupplyReference2025?.padi:(id==="jagung"?s.national.marketSupplyReference2025?.jagung?.provincialProduction2025Partial?.records?.[meta.id]:(plantationProvincialRecord||horticultureProvincialRecord||aquacultureBpsProvincialRecord||s.national.marketSupplyReference2025?.horticulture?.records?.[id]||null));
    const economics=typeof COMMODITY_ECONOMICS!=="undefined"&&COMMODITY_ECONOMICS?COMMODITY_ECONOMICS[id]:null;
    const unit=economics?.unit||(item.unitType==="ternak"?"ekor":item.unitType==="pohon"?"kg_hasil_pohon":item.unitType==="kolam"?"kg_hasil_kolam":item.unitType==="koloni"?"kg_madu":item.unitType==="rak"?"kg_hasil_rak":"kg");
    p.commodityPhysicalCoverage[id]={
     commodityId:id,name:item.name,category:item.category,unit,
     unitStatus:economics?.unit?"catalog_economic_unit":"provisional_unit_requires_product_form_validation",
     growDays:item.growDays,marketModelStatus:"active_catalog_and_market_index",
     storageProfileStatus:profile?"storage_profile_available":"storage_profile_missing",
     demandStatus:demandRecord?"official_physical_demand_reference_available":"official_physical_demand_data_pending",
     demandAnnual:demandRecord?Number(demandRecord.annualTotalKg||demandRecord.annualTotal||0):null,
     supplyStatus:id==="padi"&&supplyRecord?"official_provincial_annual_supply_complete":id==="jagung"&&supplyRecord?"official_provincial_annual_supply_partial":plantationProvincialRecord||horticultureProvincialRecord?"official_provincial_annual_supply_partial":aquacultureBpsProvincialRecord?"official_provincial_annual_aquaculture_output_reference":supplyRecord?"official_national_annual_supply_reference":"official_provincial_supply_data_pending",
     supplyAnnualTon:id==="padi"&&supplyRecord?supplyRecord.productionKgGkg/1000:id==="jagung"&&supplyRecord?supplyRecord.productionTon:supplyRecord?supplyRecord.productionKg/1000:null,
     livestockPopulationHead:Number.isFinite(livestockPopulationHead)?livestockPopulationHead:null,
     livestockPopulationStatus:Number.isFinite(livestockPopulationHead)?"official_2024_standing_animal_stock_not_meat_output":item.unitType==="ternak"?"official_species_population_reference_pending":"not_applicable",
     poultryPopulationHead:Number.isFinite(poultryPopulationHead)?poultryPopulationHead:null,
     poultryPopulationStatus:poultryPopulationHead===null&&item.unitType==="ternak"?"official_poultry_population_cell_unavailable":Number.isFinite(poultryPopulationHead)?"official_2025_provisional_standing_poultry_stock_not_meat_or_egg_output":item.unitType==="ternak"?"poultry_species_population_reference_pending":"not_applicable",
     aquacultureNationalProductionTon:Number.isFinite(aquacultureNationalProductionTon)?aquacultureNationalProductionTon:null,
     aquacultureNationalProductionStatus:Number.isFinite(aquacultureNationalProductionTon)?"official_2024_national_aquaculture_output_reference_not_provincial_supply":"not_applicable",
     aquacultureBpsProvincialProductionTon:Number.isFinite(aquacultureBpsProvincialProductionTon)?aquacultureBpsProvincialProductionTon:null,
     aquacultureBpsProvincialProductionStatus:Number.isFinite(aquacultureBpsProvincialProductionTon)?(Number(REAL_ECONOMIC_DATA.aquacultureProvincialProduction2024Bps.kkpNationalComparisonTon?.[id])!==0?"official_bps_provincial_annual_reference_source_series_differs_from_kkp_national":"official_bps_provincial_annual_aquaculture_output_reference"):"not_applicable",
     dailySupplyStatus:id==="padi"?"annual_reference_only_monthly_harvest_curve_pending":id==="jagung"&&supplyRecord?"rounded_annual_partial_reference_only":aquacultureBpsProvincialRecord||plantationProvincialRecord||horticultureProvincialRecord?"provincial_annual_reference_only_monthly_harvest_curve_pending":supplyRecord?"national_reference_only_provincial_allocation_pending":"official_monthly_supply_data_pending",
     qualityStatus:"mixed_verified_reference_and_pending_data"
    };
    if(p.dailyPhysicalSupply[id]===undefined)p.dailyPhysicalSupply[id]=null;
    if(p.dailyPhysicalSupplyStatus[id]===undefined)p.dailyPhysicalSupplyStatus[id]=p.commodityPhysicalCoverage[id].dailySupplyStatus;
   });
  });
  s.commodityCoverageVersion=1;
  return {commodityCount:items.length,provinceCount:provinceRecords.length,allRegistered:items.length===60&&provinceRecords.every(meta=>Object.keys(s.provinces[meta.id]?.commodityPhysicalCoverage||{}).length===60)};
 }
 function applyMaizeTotalDemandProjection(s){
  const data=maizeProjectionRuntimeData();if(!s||!data)return {status:"source_not_loaded"};
  const version=2,annualNationalKg=data.balance.totalNeedTon*1000,annualPerCapita=annualNationalKg/data.denominator.value;
  // Keep physical kg demand separate from the legacy game demand index. No verified
  // province-level physical supply/stock unit conversion exists yet, so never rescale
  // inventory, production, reserve or unmet-demand index quantities into kilograms.
  provinceRecords.forEach(meta=>{
   const p=s.provinces[meta.id];if(!p)return;
   if(!p.totalMarketDemand2025)p.totalMarketDemand2025={};
   p.totalMarketDemand2025.jagung={unit:"kg",annualPerCapita,annualTotalKg:annualPerCapita*p.population,monthlyTotalKg:annualPerCapita*p.population/12,source:"Kementan Pusdatin / Bapanas national maize balance projection 2025",sourceTotalNeedTon:data.balance.totalNeedTon,populationDenominator:data.denominator.value,allocation:"national_per_capita_need_scaled_to_game_province_population",status:"official_national_projection_population_weighted_game_allocation",scope:"all_channel_total_need_including_feed_and_other_uses",unitCompatibilityStatus:"physical_demand_reference_only_supply_stock_conversion_pending",marketQuantityStatus:"not_converted_to_legacy_market_index",year:2025};
  });
  s.maizeTotalDemandRuntimeVersion=version;
  const nationalNeedTon=data.balance.totalNeedTon*POPULATION/data.denominator.value;
  s.national.marketDemandReference2025=s.national.marketDemandReference2025||{};
  s.national.marketDemandReference2025.jagung={unit:"tonne/year",officialNationalTotalNeedTon:data.balance.totalNeedTon,gamePopulationScaledNeedTon:nationalNeedTon,annualPerCapitaKg:annualPerCapita,roundedSummaryTotalNeedTon:data.projection.totalNeedTon,sourcePrecisionDifferenceTon:data.balance.totalNeedTon-data.projection.totalNeedTon,feedNeedTonRounded:data.projection.feedNeedTon,otherUsesNeedTonRounded:data.projection.otherUsesNeedTon,populationDenominator:data.denominator.value,unitCompatibilityStatus:"physical_demand_reference_only_supply_stock_conversion_pending",source:"Kementan Pusdatin / Bapanas national maize balance projection 2025",status:"official_projection_population_scaled_to_game",scope:"all_channel_total_need_including_feed_and_other_uses",year:2025};
  s.national.marketSupplyReference2025=s.national.marketSupplyReference2025||{};
  s.national.marketSupplyReference2025.jagung={unit:"tonne/year",officialNationalProductionTon:data.production.productionAt14MoistureTon,moisturePct:data.production.moisturePct,referenceYear:data.production.referenceYear,source:"BPS Luas Panen dan Produksi Jagung di Indonesia 2025 (Angka Tetap)",status:"official_statistic_final_reference_only",regionalAllocationStatus:"pending_official_provincial_production_data",balanceComparisonStatus:"not_compared_with_projected_demand_due_to_source_scope_and_methodology"};
  const provincialProduction=REAL_ECONOMIC_DATA.maizeProvincialProduction2025Partial;
  s.national.marketSupplyReference2025.jagung.provincialProduction2025Partial=provincialProduction?JSON.parse(JSON.stringify(provincialProduction)):null;
  s.national.marketSupplyReference2025.jagung.provincialReferenceCoverage=provincialProduction?provincialProduction.coverage:null;
  s.national.marketSupplyReference2025.jagung.provincialReferenceTotalTon=provincialProduction?Object.values(provincialProduction.records||{}).reduce((sum,row)=>sum+Number(row.productionTon||0),0):0;
  s.national.marketSupplyReference2025.jagung.regionalAllocationStatus="partial_official_provincial_references_loaded_not_daily_supply_allocated";
  return {status:"applied_reference_only",annualPerCapitaKg:annualPerCapita,gamePopulationScaledNeedTon:nationalNeedTon,version,marketQuantityStatus:"physical_demand_reference_only_supply_stock_conversion_pending"};
 }
 function provinceShare(p){return p.population/POPULATION;}
 function ensure(){const game=gameState();if(!game)return null;let s=game.nationalEconomy;if(!s||s.version!==VERSION){const seed=hash((game.name||"player")+"|"+COUNTRY_NAME+"|"+VERSION);const items=catalog();s={version:VERSION,countryName:COUNTRY_NAME,population:POPULATION,dayProcessed:0,seed,activeAgents:buildAgents(seed),agentCap:5000,agentFloor:1000,government:{treasury:1000000000000,procurementShare:0.05,importShareCap:0.10,reserveTargetDays:30,releaseTriggerDays:10,releaseShare:0.15,monthlyProcurementSpent:0,monthlyImportSpent:0,monthlyReleased:0,monthlyPurchased:0,monthlyImported:0,monthlyImportedByCommodity:{}},provinces:{},national:{demandIndex:{},supplyIndex:{},priceIndex:{},reserveIndex:{},tradeIndex:{},physicalDemand:{}},events:[],activeNationalEmergency:null,eventChancePerProvinceMonthly:0.006,calibrationStatus:"MIXED_OFFICIAL_REFERENCE_AND_EXPERIMENTAL_GAME_PARAMETERS"};provinceRecords.forEach(p=>{const state={population:p.population,inventory:{},production:{},demand:{},priceIndex:{},reserve:{},imports:{},unmetDemand:{},dailyProduction:{},dailyDemand:{},dailyPhysicalDemand:{},activeEffects:{},logisticsDisruption:0,physicalDemand:{},regionalPhysicalDemand:{},consumptionPressure:{},consumptionCategoryPressure:{}};items.forEach(item=>{const w=demandWeight(item);const monthlyDemand=p.population/1000*w;state.demand[item.id]=monthlyDemand;state.inventory[item.id]=monthlyDemand*0.5;state.production[item.id]=monthlyDemand/30*(SUPPLY_PROFILE[p.id]||1);state.priceIndex[item.id]=1;state.reserve[item.id]=monthlyDemand*0.25;state.consumptionPressure[item.id]=1;state.imports[item.id]=0;state.unmetDemand[item.id]=0;});Object.entries(PHYSICAL_DEMAND_ANCHORS_2025).forEach(([id,a])=>{const annualTotal=a.annualPerCapita*p.population;state.physicalDemand[id]={unit:a.unit,annualPerCapita:a.annualPerCapita,annualTotal,monthlyTotal:annualTotal/12,sourceCommodity:a.sourceCommodity,source:a.source,status:a.status,year:a.year};});
      Object.values(BAPANAS_CONSUMPTION_MODEL_2025.rows).forEach(row=>{const total=row.annualPerCapita*p.population;const pressure=1+(row.annualPerCapita/10)*0.02;if(row.mappingStatus==="physical"&&row.gameId){state.consumptionPressure[row.gameId]=pressure;state.physicalDemand[row.gameId]={unit:"kg",annualPerCapita:row.annualPerCapita,annualTotal:total,monthlyTotal:total/12,sourceCommodity:row.sourceCommodity,source:row.source,status:"official_bapanas_2025_physical_quantity",year:2025};}else if(row.mappingStatus==="downstream_signal"&&row.gameId){state.consumptionPressure[row.gameId]=pressure;}else if(row.category){state.consumptionCategoryPressure[row.category]=(state.consumptionCategoryPressure[row.category]||1)*pressure;}});items.forEach(item=>{const categoryPressure=state.consumptionCategoryPressure[item.category]||1;state.consumptionPressure[item.id]=(state.consumptionPressure[item.id]||1)*categoryPressure;});state.baseConsumptionPressure=Object.assign({},state.consumptionPressure);s.provinces[p.id]=state;});game.nationalEconomy=s;applyProvincialConsumptionRecordsToState(s,BAPANAS_PROVINCIAL_CONSUMPTION_2025_PARTIAL);s.regionalConsumptionSeedVersion=1;applyKabupatenKotaConsumptionRecordsToState(s,BAPANAS_KABKOTA_CONSUMPTION_2025_PARTIAL);s.kabkotaConsumptionSeedVersion=4;}else{provinceRecords.forEach(meta=>{const p=s.provinces[meta.id];if(p){if(!p.dailyProduction)p.dailyProduction={};if(!p.dailyDemand)p.dailyDemand={};if(!p.dailyPhysicalDemand)p.dailyPhysicalDemand={};if(!p.baseConsumptionPressure)p.baseConsumptionPressure=Object.assign({},p.consumptionPressure||{});if(!p.regionalPhysicalDemand)p.regionalPhysicalDemand={};}});if(!Object.prototype.hasOwnProperty.call(s,"activeNationalEmergency"))s.activeNationalEmergency=null;if(!s.regionalConsumptionSeedVersion){applyProvincialConsumptionRecordsToState(s,BAPANAS_PROVINCIAL_CONSUMPTION_2025_PARTIAL);s.regionalConsumptionSeedVersion=1;}if(!s.kabkotaConsumptionSeedVersion){applyKabupatenKotaConsumptionRecordsToState(s,BAPANAS_KABKOTA_CONSUMPTION_2025_PARTIAL);s.kabkotaConsumptionSeedVersion=4;}}applyMaizeTotalDemandProjection(s);applyPaddyProductionReference(s);applyHorticultureProductionReference(s);applyPlantationProductionReference(s);applyLivestockPopulationReference(s);applyPoultryPopulationReference(s);applyAquacultureProductionReference(s);applyAquacultureProvincialProductionReference(s);applyCommodityPhysicalCoverage(s);applyRegionalConsumerPriceReference(s);provinceRecords.forEach(meta=>{if(s.localityConsumption2025)applyCompleteKabkotaConsumptionToProvince(s,meta.id);});return s;}
 function applyProvincialConsumptionRecordsToState(s,records){
  const rows=Array.isArray(records)?records:[],seen=new Set(),byProvince={},expectedKeys=Object.keys(BAPANAS_CONSUMPTION_MODEL_2025.rows);
  rows.forEach(row=>{if(!row||row.year!==2025||row.unit!=="kg/kap/tahun"||!BAPANAS_CONSUMPTION_MODEL_2025.rows[row.key]||!Number.isFinite(row.annualPerCapita)||row.annualPerCapita<0)throw new Error("Invalid Bapanas provincial consumption record");const meta=provinceRecords.find(p=>p.id===row.provinceId);if(!meta||String(meta.adminCode)!==String(row.provinceCode))throw new Error("Unknown province or mismatched Bapanas province code");const key=row.provinceId+"|"+row.key;if(seen.has(key))throw new Error("Duplicate Bapanas province commodity record: "+key);seen.add(key);(byProvince[row.provinceId]||(byProvince[row.provinceId]={}))[row.key]=Object.assign({},row);});
  Object.keys(byProvince).forEach(provinceId=>{const p=s.provinces[provinceId],provinceRows=byProvince[provinceId],physical={},categoryTotals={},categoryKeys={};Object.keys(provinceRows).forEach(key=>{const row=provinceRows[key],model=BAPANAS_CONSUMPTION_MODEL_2025.rows[key],mapping=BAPANAS_GAME_CONSUMPTION_MAP[key];if(mapping.mode==="physical"||mapping.mode==="downstream_signal"){const ratio=model.annualPerCapita>0?row.annualPerCapita/model.annualPerCapita:1;if(mapping.gameId)p.consumptionPressure[mapping.gameId]=(p.baseConsumptionPressure[mapping.gameId]||1)*ratio;if(mapping.mode==="physical"&&mapping.gameId){const total=row.annualPerCapita*p.population;p.regionalPhysicalDemand[mapping.gameId]={unit:"kg",annualPerCapita:row.annualPerCapita,annualTotal:total,monthlyTotal:total/12,sourceCommodity:row.sourceCommodity,source:"Bapanas provincial consumption 2025",status:"official_provincial_physical_quantity",year:2025};}}else if(mapping.mode==="unit_conversion_pending"&&mapping.gameId){const ratio=model.annualPerCapita>0?row.annualPerCapita/model.annualPerCapita:1;p.consumptionPressure[mapping.gameId]=(p.baseConsumptionPressure[mapping.gameId]||1)*ratio;}else if(mapping.category){categoryTotals[mapping.category]=(categoryTotals[mapping.category]||0)+row.annualPerCapita;(categoryKeys[mapping.category]||(categoryKeys[mapping.category]=[])).push(key);}});
   Object.keys(categoryTotals).forEach(category=>{const expected=expectedKeys.filter(key=>BAPANAS_GAME_CONSUMPTION_MAP[key]&&BAPANAS_GAME_CONSUMPTION_MAP[key].category===category),complete=expected.every(key=>Object.prototype.hasOwnProperty.call(provinceRows,key));if(complete){const national=BAPANAS_CONSUMPTION_MODEL_2025.categoryTotals[category]||0,ratio=national>0?categoryTotals[category]/national:1;catalog().forEach(item=>{if(item.category===category)p.consumptionPressure[item.id]=(p.baseConsumptionPressure[item.id]||1)*ratio;});}});
   p.regionalConsumption2025={source:"Bapanas provincial consumption 2025",year:2025,unit:"kg/kap/tahun",recordCount:Object.keys(provinceRows).length,expectedMappedLeafCount:expectedKeys.length,coverageRatio:Object.keys(provinceRows).length/expectedKeys.length,status:Object.keys(provinceRows).length===expectedKeys.length?"complete":"partial_verified_observations",keys:Object.keys(provinceRows)};
  });
  s.regionalConsumptionSource="Bapanas provincial consumption 2025";s.regionalConsumptionCoverage={provinceCount:Object.keys(byProvince).length,recordCount:rows.length,status:Object.keys(byProvince).length===provinceRecords.length?"province_coverage_complete":"partial_province_coverage"};return s.regionalConsumptionCoverage;
 }
 function applyProvincialConsumptionRecords(records){const s=ensure();if(!s)throw new Error("Game state unavailable");return applyProvincialConsumptionRecordsToState(s,records);}
 function applyKabupatenKotaConsumptionRecordsToState(s,records){
  const rows=Array.isArray(records)?records:[],seen=new Set(),byLocality={};
  rows.forEach(row=>{if(!row||row.year!==2025||row.unit!=="kg/kap/tahun"||!BAPANAS_CONSUMPTION_MODEL_2025.rows[row.key]||!Number.isFinite(row.annualPerCapita)||row.annualPerCapita<0||!/^\d{4}$/.test(String(row.localityCode||"")))throw new Error("Invalid Bapanas kabupaten/kota consumption record");const meta=provinceRecords.find(p=>p.id===row.provinceId);if(!meta||String(meta.adminCode)!==String(row.provinceCode)||!String(row.localityCode).startsWith(String(row.provinceCode)))throw new Error("Unknown locality or mismatched province code");const key=row.localityCode+"|"+row.key;if(seen.has(key))throw new Error("Duplicate Bapanas locality commodity record: "+key);seen.add(key);(byLocality[row.localityCode]||(byLocality[row.localityCode]={localityCode:row.localityCode,provinceId:row.provinceId,provinceCode:row.provinceCode,localityName:row.localityName,rows:{}})).rows[row.key]=Object.assign({},row);});
  if(!s.localityConsumption2025)s.localityConsumption2025={};Object.keys(byLocality).forEach(code=>{const incoming=byLocality[code],existing=s.localityConsumption2025[code];s.localityConsumption2025[code]=Object.assign({},existing||{},incoming,{rows:Object.assign({},existing&&existing.rows||{},incoming.rows)});});
  const affectedProvinces=Array.from(new Set(Object.keys(byLocality).map(code=>byLocality[code].provinceId)));affectedProvinces.forEach(provinceId=>applyCompleteKabkotaConsumptionToProvince(s,provinceId));
  s.kabkotaConsumptionCoverage={source:"Bapanas kabupaten/kota consumption 2025",localityCount:Object.keys(s.localityConsumption2025).length,recordCount:Object.values(s.localityConsumption2025).reduce((n,x)=>n+Object.keys(x.rows).length,0),status:"partial_verified_observations"};return s.kabkotaConsumptionCoverage;
 }
 function applyCompleteKabkotaConsumptionToProvince(s,provinceId){
  const meta=provinceRecords.find(row=>row.id===String(provinceId)),p=s&&s.provinces&&s.provinces[String(provinceId)];if(!meta||!p)return {status:"unknown_province"};
  const expectedLocalityCount=meta.regencyCount+meta.cityCount,entries=Object.values(s.localityConsumption2025||{}).filter(entry=>entry.provinceId===meta.id);
  const gamePopulation=getBpsDkiLocalityGamePopulation2025(),officialWeights=entries.length===expectedLocalityCount&&entries.every(entry=>BPS_KABKOTA_POPULATION_2025[entry.localityCode]&&gamePopulation[entry.localityCode]);
  const expectedKeys=["beras","jagung","terigu","singkong","ubi_jalar","kentang","sagu","umbi_lainnya","daging_ruminansia","daging_unggas","telur","susu","ikan","minyak_kelapa","minyak_sawit","minyak_lainnya","kelapa","kemiri","kedelai","kacang_tanah","kacang_hijau","kacang_lain","gula_pasir","gula_merah","sayur","buah"],complete=officialWeights&&expectedKeys.every(key=>entries.every(entry=>entry.rows&&entry.rows[key]))&&entries.every(entry=>Object.keys(entry.rows||{}).length===expectedKeys.length);
  if(!complete){p.localityConsumption2025={source:"Bapanas 2025 locality leaf data + BPS 2025 population weights",status:"partial_not_applied_to_daily_province_demand",localityCount:entries.length,expectedLocalityCount,officialPopulationWeights:!!officialWeights};return p.localityConsumption2025;}
  const provincePopulation=p.population,weighted={};
  expectedKeys.forEach(key=>{let total=0;entries.forEach(entry=>{total+=(entry.rows[key].annualPerCapita*gamePopulation[entry.localityCode])/provincePopulation;});weighted[key]=total;});
  const categoryTotals={};expectedKeys.forEach(key=>{const mapping=BAPANAS_GAME_CONSUMPTION_MAP[key];if(mapping.category)categoryTotals[mapping.category]=(categoryTotals[mapping.category]||0)+weighted[key];});
  expectedKeys.forEach(key=>{const model=BAPANAS_CONSUMPTION_MODEL_2025.rows[key],mapping=BAPANAS_GAME_CONSUMPTION_MAP[key];if((mapping.mode==="physical"||mapping.mode==="downstream_signal"||mapping.mode==="unit_conversion_pending")&&mapping.gameId&&model.annualPerCapita>0){const ratio=weighted[key]/model.annualPerCapita;p.consumptionPressure[mapping.gameId]=(p.baseConsumptionPressure[mapping.gameId]||1)*ratio;if(mapping.mode==="physical"){const annualTotal=weighted[key]*provincePopulation;p.regionalPhysicalDemand[mapping.gameId]={unit:"kg",annualPerCapita:weighted[key],annualTotal,monthlyTotal:annualTotal/12,sourceCommodity:model.sourceCommodity,source:"Population-weighted Bapanas kabupaten/kota consumption 2025",status:"official_locality_leafs_weighted_by_bps_population",year:2025};}}});
  Object.keys(categoryTotals).forEach(category=>{const national=BAPANAS_CONSUMPTION_MODEL_2025.categoryTotals[category]||0;if(national>0){const ratio=categoryTotals[category]/national;catalog().forEach(item=>{if(item.category===category)p.consumptionPressure[item.id]=(p.baseConsumptionPressure[item.id]||1)*ratio;});}});
  p.localityConsumption2025={source:"Bapanas 2025 locality leaf data + BPS 2025 population weights",status:"complete_population_weighted_daily_demand_applied",localityCount:entries.length,expectedLocalityCount,leafKeyCount:expectedKeys.length,recordCount:entries.reduce((sum,entry)=>sum+Object.keys(entry.rows).length,0),populationBasis:"official_bps_2025_weights_scaled_to_game_population",aggregation:"population_weighted_per_capita_leaf_values"};return p.localityConsumption2025;
 }
 function applyKabupatenKotaConsumptionRecords(records){const s=ensure();if(!s)throw new Error("Game state unavailable");return applyKabupatenKotaConsumptionRecordsToState(s,records);}
 function localityConsumptionSnapshot(localityCode){const s=ensure(),entry=s&&s.localityConsumption2025&&s.localityConsumption2025[String(localityCode)];if(!entry)return null;const p=s.provinces[entry.provinceId],localityCount=provinceRecords.find(x=>x.id===entry.provinceId).regencyCount+provinceRecords.find(x=>x.id===entry.provinceId).cityCount,populationAnchor=BPS_KABKOTA_POPULATION_2025[entry.localityCode],population=populationAnchor?getBpsDkiLocalityGamePopulation2025()[entry.localityCode]:Math.floor(p.population/localityCount),populationStatus=populationAnchor?"official_bps_2025_weights_scaled_to_game_population":"equal_share_estimate_pending_official_locality_population",physicalDemand={},demandPressure={};Object.keys(entry.rows).forEach(key=>{const row=entry.rows[key],model=BAPANAS_CONSUMPTION_MODEL_2025.rows[key],mapping=BAPANAS_GAME_CONSUMPTION_MAP[key],ratio=model.annualPerCapita>0?row.annualPerCapita/model.annualPerCapita:1;if(mapping.gameId){demandPressure[mapping.gameId]=ratio;if(mapping.mode==="physical")physicalDemand[mapping.gameId]={unit:"kg",annualPerCapita:row.annualPerCapita,annualTotal:row.annualPerCapita*population,monthlyTotal:row.annualPerCapita*population/12,status:populationAnchor?"official_per_capita_with_official_bps_population":"official_per_capita_with_estimated_simulation_population",year:2025};}});return {localityCode:entry.localityCode,localityName:entry.localityName,provinceId:entry.provinceId,population,populationStatus,sourcePopulation:populationAnchor?populationAnchor.population:null,populationSource:populationAnchor?populationAnchor.source:null,populationYear:populationAnchor?populationAnchor.year:null,year:2025,unit:"kg/kap/tahun",recordCount:Object.keys(entry.rows).length,coverageStatus:"partial_verified_observations",physicalDemand,demandPressure,rows:entry.rows};}
 const PRICE_NEIGHBORS=Object.freeze({
  aceh:["sumatera-utara"],"sumatera-utara":["aceh","sumatera-barat","riau"],"sumatera-barat":["sumatera-utara","riau","jambi","bengkulu"],riau:["sumatera-utara","sumatera-barat","jambi","kepulauan-riau"],jambi:["riau","sumatera-barat","sumatera-selatan","bengkulu"],"sumatera-selatan":["jambi","bengkulu","lampung","kepulauan-bangka-belitung"],bengkulu:["sumatera-barat","jambi","sumatera-selatan","lampung"],lampung:["sumatera-selatan","bengkulu","banten","jawa-barat"],"kepulauan-bangka-belitung":["sumatera-selatan"],"kepulauan-riau":["riau"],"dki-jakarta":["banten","jawa-barat"],"jawa-barat":["banten","dki-jakarta","jawa-tengah","lampung"],"jawa-tengah":["jawa-barat","di-yogyakarta","jawa-timur"],"di-yogyakarta":["jawa-tengah","jawa-timur"],"jawa-timur":["jawa-tengah","di-yogyakarta","bali"],banten:["dki-jakarta","jawa-barat","lampung"],bali:["jawa-timur","nusa-tenggara-barat"],"nusa-tenggara-barat":["bali","nusa-tenggara-timur"],"nusa-tenggara-timur":["nusa-tenggara-barat"],"kalimantan-barat":["kalimantan-tengah"],"kalimantan-tengah":["kalimantan-barat","kalimantan-selatan","kalimantan-timur"],"kalimantan-selatan":["kalimantan-tengah","kalimantan-timur"],"kalimantan-timur":["kalimantan-tengah","kalimantan-selatan","kalimantan-utara"],"kalimantan-utara":["kalimantan-timur"],"sulawesi-utara":["gorontalo","sulawesi-tengah"],"gorontalo":["sulawesi-utara","sulawesi-tengah"],"sulawesi-tengah":["sulawesi-utara","gorontalo","sulawesi-barat","sulawesi-selatan","sulawesi-tenggara"],"sulawesi-barat":["sulawesi-tengah","sulawesi-selatan"],"sulawesi-selatan":["sulawesi-barat","sulawesi-tengah","sulawesi-tenggara"],"sulawesi-tenggara":["sulawesi-tengah","sulawesi-selatan"],maluku:["maluku-utara"],"maluku-utara":["maluku"],papua:["papua-barat","papua-barat-daya","papua-tengah","papua-selatan","papua-pegunungan"],"papua-barat":["papua-barat-daya","papua","papua-tengah"],"papua-barat-daya":["papua-barat","papua"],"papua-tengah":["papua-barat","papua","papua-pegunungan","papua-selatan"],"papua-selatan":["papua","papua-tengah"],"papua-pegunungan":["papua","papua-tengah"]
 });
 function regionalConsumerPriceReference(provinceId,commodityId){
  const data=typeof REAL_ECONOMIC_DATA!=="undefined"&&REAL_ECONOMIC_DATA.regionalConsumerPrices2025;
  if(!data)return null;
  const idx=data.columns.indexOf(String(commodityId));if(idx<0)return null;
  const target=String(provinceId), exact=data.records[target];
  if(exact&&Number.isFinite(exact[idx]))return {provinceId:target,commodityId:String(commodityId),priceRp:Number(exact[idx]),sourceProvinceId:target,sourceType:"official_exact",distance:0,jakartaMarkupApplied:false};
  const queue=(PRICE_NEIGHBORS[target]||[]).map(id=>({id,distance:1})),seen=new Set([target]);
  while(queue.length){
   const current=queue.shift();if(seen.has(current.id))continue;seen.add(current.id);
   const row=data.records[current.id];if(row&&Number.isFinite(row[idx])){const jakarta=target==="dki-jakarta";return {provinceId:target,commodityId:String(commodityId),priceRp:Math.round(Number(row[idx])*(jakarta?1.30:1)),sourceProvinceId:current.id,sourceType:"nearest_region_fallback",distance:current.distance,jakartaMarkupApplied:jakarta,jakartaMarkupRate:jakarta?0.30:0};}
   (PRICE_NEIGHBORS[current.id]||[]).forEach(id=>{if(!seen.has(id))queue.push({id,distance:current.distance+1});});
  }
  const national=Array.isArray(data.national)&&Number.isFinite(data.national[idx])?Number(data.national[idx]):null;
  return national===null?null:{provinceId:target,commodityId:String(commodityId),priceRp:national,sourceProvinceId:null,sourceType:"national_reference_fallback",distance:null,jakartaMarkupApplied:false};
 }
 function applyRegionalConsumerPriceReference(s){
  const data=typeof REAL_ECONOMIC_DATA!=="undefined"&&REAL_ECONOMIC_DATA.regionalConsumerPrices2025;if(!data)return {status:"source_unavailable"};
  provinceRecords.forEach(meta=>{const p=s.provinces[meta.id];p.regionalPriceReference2025={};data.columns.forEach(id=>{p.regionalPriceReference2025[id]=regionalConsumerPriceReference(meta.id,id);});});
  s.regionalPriceReference2025={source:data.source,columns:data.columns,provinceCount:provinceRecords.length,coverageStatus:"38_province_source_with_nearest_region_fallback"};
  return s.regionalPriceReference2025;
 }
 function boundedMarketQuote(commodityId,value){
  const item=catalog().find(x=>x.id===String(commodityId));if(!item)return null;
  const numeric=Number(value);if(!Number.isFinite(numeric)||numeric<=0)return null;
  const emergency=marketEmergencySnapshot();
  const authorized=!!(emergency&&emergency.active===true&&emergency.scope==="national"&&["national_disaster","war"].includes(emergency.type)&&
   (!Array.isArray(emergency.commodityIds)||!emergency.commodityIds.length||emergency.commodityIds.includes(String(commodityId))));
  return Math.round(authorized?Math.min(1e12,Math.max(0.01,numeric)):clamp(numeric,Number(item.marketFloor),Number(item.marketCeiling)));
 }
 function quoteLocality(localityCode,commodityId,nationalPrice){const snap=localityConsumptionSnapshot(localityCode);if(!snap)return null;const entry=ensure().localityConsumption2025[String(localityCode)],p=ensure().provinces[entry.provinceId],item=catalog().find(x=>x.id===commodityId);if(!item)return null;let pressure=snap.demandPressure[commodityId];if(!Number.isFinite(pressure)){const categoryKeys=Object.keys(entry.rows).filter(k=>BAPANAS_GAME_CONSUMPTION_MAP[k].category===item.category);if(categoryKeys.length)pressure=categoryKeys.reduce((sum,k)=>sum+entry.rows[k].annualPerCapita,0)/categoryKeys.reduce((sum,k)=>sum+(BAPANAS_CONSUMPTION_MODEL_2025.rows[k].annualPerCapita||0),0);}if(!Number.isFinite(pressure)||pressure<=0)pressure=1;const localDemandFactor=clamp(1+(pressure-1)*0.25,0.7,1.5);return boundedMarketQuote(commodityId,(Number(nationalPrice)||1)*p.priceIndex[commodityId]*localDemandFactor);}
 function applyNationalEmergency(input){
   const s=ensure();if(!s)throw new Error("Game state unavailable");
   const x=input||{},type=String(x.type||"");
   if(!["national_disaster","war"].includes(type))throw new Error("Only national_disaster or war can authorize a market-band override");
   const existing=marketEmergencySnapshot();if(existing)throw new Error("A national emergency is already active");
   const durationDays=Math.max(1,Math.min(3650,Math.floor(Number(x.durationDays)||30)));
   const ids=Array.isArray(x.commodityIds)&&x.commodityIds.length?Array.from(new Set(x.commodityIds.map(String))):catalog().map(item=>item.id);
   const known=new Set(catalog().map(item=>item.id));if(ids.some(id=>!known.has(id)))throw new Error("Unknown commodity in national emergency");
   const defaultLoss=type==="war"?0.18:0.25,defaultLogistics=type==="war"?0.28:0.18;
   const productionLoss=clamp(x.productionLossFraction==null?defaultLoss:x.productionLossFraction,0,0.95);
   const logisticsLoss=clamp(x.logisticsLossFraction==null?defaultLogistics:x.logisticsLossFraction,0,0.9);
   const eventId=String(x.eventId||("national-emergency-"+Math.max(1,s.dayProcessed+1)+"-"+(s.events.length+1)));
   if(!eventId.trim())throw new Error("National emergency eventId is required");
   provinceRecords.forEach(meta=>{
    const p=s.provinces[meta.id];if(!p)return;
    ids.forEach(id=>{p.activeEffects[id]={productionLoss,daysRemaining:durationDays};});
    p.logisticsDisruption=Math.max(Number(p.logisticsDisruption)||0,logisticsLoss);
   });
   const event={id:eventId,eventId,type,scope:"national",day:Math.max(1,s.dayProcessed+1),expiresAtDay:Math.max(1,s.dayProcessed+1)+durationDays-1,durationDays,commodityIds:ids,productionLossFraction:productionLoss,logisticsLossFraction:logisticsLoss,classification:"SIMULATION",parameterStatus:"EXPERIMENTAL",marketBandOverrideAuthorized:true,active:true};
   s.activeNationalEmergency=event;s.events.unshift(event);s.events=s.events.slice(0,100);return Object.assign({},event);
  }
  function marketEmergencySnapshot(){
   const s=ensure();if(!s||!s.activeNationalEmergency)return null;
   const event=s.activeNationalEmergency,currentDay=Math.max(1,Number(s.dayProcessed)||1);
   if(event.active!==true||currentDay>Number(event.expiresAtDay)){event.active=false;event.endedDay=currentDay;return null;}
   if(!["national_disaster","war"].includes(String(event.type||""))||event.scope!=="national"||!event.eventId)return null;
   return {active:true,scope:"national",type:event.type,eventId:String(event.eventId),startedDay:event.day,expiresAtDay:event.expiresAtDay,remainingDays:Math.max(0,event.expiresAtDay-currentDay+1),commodityIds:(event.commodityIds||[]).slice()};
  }
  function endNationalEmergency(eventId){
   const s=ensure();if(!s||!s.activeNationalEmergency)return {ok:false,reason:"no_active_national_emergency"};
   if(eventId&&String(eventId)!==String(s.activeNationalEmergency.eventId))return {ok:false,reason:"event_id_mismatch"};
   s.activeNationalEmergency.active=false;s.activeNationalEmergency.endedDay=Math.max(1,s.dayProcessed||1);
   return {ok:true,eventId:s.activeNationalEmergency.eventId,endedDay:s.activeNationalEmergency.endedDay};
  }
 function applyDisaster(input){const s=ensure();if(!s)throw new Error("Game state unavailable");const x=input||{},p=s.provinces[String(x.provinceId||x.regionId||"")];if(!p)throw new Error("Unknown province");const ids=Array.isArray(x.commodityIds)&&x.commodityIds.length?x.commodityIds:catalog().map(c=>c.id);const loss=clamp(x.productionLossFraction,0,0.95),logistics=clamp(x.logisticsLossFraction,0,0.9),days=Math.max(1,Math.floor(Number(x.durationDays)||30));ids.forEach(id=>{if(Object.prototype.hasOwnProperty.call(p.production,id))p.activeEffects[id]={productionLoss:loss,daysRemaining:days};});p.logisticsDisruption=Math.max(p.logisticsDisruption,logistics);const event={id:"event-"+s.dayProcessed+"-"+x.provinceId+"-"+s.events.length,day:Number(x.gameDay)||s.dayProcessed,provinceId:String(x.provinceId||x.regionId),province:provinceRecords.find(q=>q.id===String(x.provinceId||x.regionId)).name,type:String(x.type||"bencana"),commodityIds:ids,productionLossFraction:loss,logisticsLossFraction:logistics,durationDays:days,classification:"SIMULATION",parameterStatus:"EXPERIMENTAL"};s.events.unshift(event);s.events=s.events.slice(0,100);return event;}
 function evaluateAgents(s,day,items){
  const signals={},actionCounts={increase_supply:0,maintain_supply:0,reduce_supply:0,rebalance_processing:0,release_inventory:0,replenish_inventory:0,reroute_logistics:0,normal_routes:0,substitute_demand:0,normal_procurement:0,review_reserves:0,monitor_prices:0};
  provinceRecords.forEach(meta=>{signals[meta.id]={producerSensitivity:0,producerCount:0,buyerSensitivity:0,buyerCount:0,logisticsSkill:0,logisticsCount:0,averagePrice:1,maximumPrice:1};const p=s.provinces[meta.id];let sum=0,max=1;items.forEach(item=>{const value=p.priceIndex[item.id]||1;sum+=value;max=Math.max(max,value);});signals[meta.id].averagePrice=items.length?sum/items.length:1;signals[meta.id].maximumPrice=max;});
  s.activeAgents.forEach(agent=>{const signal=signals[agent.provinceId];if(!signal)return;const localPrice=signal.averagePrice,peak=signal.maximumPrice;let action="observe_market";
   if(agent.role==="farmer"||agent.role==="livestock_operator"||agent.role==="fisher"){signal.producerSensitivity+=agent.riskTolerance;signal.producerCount++;action=peak>1.15?"increase_supply":peak<0.9?"reduce_supply":"maintain_supply";}
   else if(agent.role==="processor"){signal.producerSensitivity+=agent.riskTolerance*0.65;signal.producerCount++;action=localPrice>1.08?"rebalance_processing":"maintain_supply";}
   else if(agent.role==="wholesaler"||agent.role==="retailer"||agent.role==="institutional_buyer"){signal.buyerSensitivity+=agent.priceSensitivity;signal.buyerCount++;action=peak>1.2?"substitute_demand":peak>1.08?"release_inventory":"replenish_inventory";}
   else if(agent.role==="logistics_operator"){signal.logisticsSkill+=agent.logisticsSkill;signal.logisticsCount++;action=peak>1.15?"reroute_logistics":"normal_routes";}
   else if(agent.role==="government_officer"){action=peak>1.15?"review_reserves":"monitor_prices";}
   agent.lastAction=action;agent.lastDecisionDay=day;if(Object.prototype.hasOwnProperty.call(actionCounts,action))actionCounts[action]++;
  });
  provinceRecords.forEach(meta=>{const signal=signals[meta.id];signal.producerSensitivity=signal.producerCount?signal.producerSensitivity/signal.producerCount:0.5;signal.buyerSensitivity=signal.buyerCount?signal.buyerSensitivity/signal.buyerCount:0.5;signal.logisticsSkill=signal.logisticsCount?signal.logisticsSkill/signal.logisticsCount:1;signal.supplyFactor=clamp(1+(signal.producerSensitivity-0.5)*0.06,0.95,1.08);signal.demandFactor=clamp(1-(signal.buyerSensitivity-0.5)*0.04,0.95,1.05);signal.logisticsFactor=clamp(1+signal.logisticsSkill*0.04,1.02,1.08);});
  s.national.agentActionCounts=actionCounts;s.national.activeAgentDecisionDay=day;return signals;
 }
 function runDaily(s,day){const items=catalog(),g=s.government,agentSignals=evaluateAgents(s,day,items);let totalDemand=0,totalSupply=0,totalPhysicalDemandKg=0;provinceRecords.forEach(meta=>{const p=s.provinces[meta.id],signal=agentSignals[meta.id];p.logisticsDisruption=Math.max(0,p.logisticsDisruption-0.002);p.dailyPhysicalDemand=p.dailyPhysicalDemand||{};Object.keys(p.dailyPhysicalDemand).forEach(id=>{delete p.dailyPhysicalDemand[id];});p.dailyPhysicalSupply=p.dailyPhysicalSupply||{};p.dailyPhysicalSupplyStatus=p.dailyPhysicalSupplyStatus||{};items.forEach(item=>{p.dailyPhysicalSupply[item.id]=null;p.dailyPhysicalSupplyStatus[item.id]=p.commodityPhysicalCoverage?.[item.id]?.dailySupplyStatus||"official_monthly_supply_data_pending";});const physicalIds=new Set([...Object.keys(p.physicalDemand||{}),...Object.keys(p.regionalPhysicalDemand||{}),...Object.keys(p.totalMarketDemand2025||{})]);physicalIds.forEach(id=>{const record=(p.totalMarketDemand2025&&p.totalMarketDemand2025[id])||(p.regionalPhysicalDemand&&p.regionalPhysicalDemand[id])||(p.physicalDemand&&p.physicalDemand[id]);if(!record||record.unit!=="kg"||String(record.status||"").includes("conversion_pending")||!Number.isFinite(record.annualTotalKg||record.annualTotal)||Number(record.annualTotalKg||record.annualTotal)<=0)return;const annualKg=Number(record.annualTotalKg||record.annualTotal),coefficients=BAPANAS_MONTHLY_DEMAND_2025.records[id]?.coefficients,monthIndex=Math.floor((Math.max(1,Math.floor(Number(day)||1))-1)/30)%12,monthShare=coefficients?coefficients[monthIndex]:1/12,dailyKg=annualKg*monthShare/30;p.dailyPhysicalDemand[id]=dailyKg;totalPhysicalDemandKg+=dailyKg;});items.forEach(item=>{const id=item.id,localIndex=p.priceIndex[id]||1,consumptionPressure=p.consumptionPressure[id]||1,seasonalFactor=seasonalDemandFactor(id,day),monthlyDemand=(p.demand[id]||0)*seasonalFactor,demand=monthlyDemand/30*signal.demandFactor*consumptionPressure*clamp(1-(localIndex-1)*0.05,0.85,1.05);let effect=p.activeEffects[id];if(effect&&effect.daysRemaining>0){effect.daysRemaining--;if(effect.daysRemaining===0)delete p.activeEffects[id];}const loss=effect?effect.productionLoss:0;const supplyResponse=clamp(1+(localIndex-1)*0.08*signal.producerSensitivity,0.85,1.2);const production=(p.production[id]||0)*(1-loss)*supplyResponse*signal.supplyFactor;p.dailyProduction=p.dailyProduction||{};p.dailyDemand=p.dailyDemand||{};p.dailyProduction[id]=production;p.dailyDemand[id]=demand;p.inventory[id]=Math.max(0,(p.inventory[id]||0)+production-demand);p.unmetDemand[id]=Math.max(0,demand-p.inventory[id]);totalDemand+=demand;totalSupply+=production;const cover=demand>0?p.inventory[id]/demand:30;const disruption=(p.logisticsDisruption||0)/signal.logisticsFactor;const elasticity=item.marketElasticity||0.08;const index=clamp(Math.pow(15/Math.max(0.25,cover),clamp(0.45+elasticity*0.6,0.45,0.65))+disruption*0.9,0.55,4.0);p.priceIndex[id]=index;});});s.national.totalDemandIndex=totalDemand;s.national.totalSupplyIndex=totalSupply;s.national.coverageRatio=totalDemand>0?totalSupply/totalDemand:1;s.national.dailyPhysicalDemandKg=totalPhysicalDemandKg;s.national.physicalDemandUnit="kg/day";s.national.physicalDemandLedgerStatus="household_and_verified_total_use_reference_only_not_yet_order_book_settled";
 // Monthly reserve procurement: buy no more than 5% of monthly demand, constrained by treasury.
 if(day%30===1){g.monthlyProcurementSpent=0;g.monthlyImportSpent=0;g.monthlyReleased=0;g.monthlyPurchased=0;g.monthlyImported=0;g.monthlyImportedByCommodity={};items.forEach(item=>{const id=item.id;provinceRecords.forEach(meta=>{const p=s.provinces[meta.id],monthlyDemand=(p.demand[id]||0)*seasonalDemandFactor(id,day),target=monthlyDemand*g.reserveTargetDays/30,need=Math.max(0,target-(p.reserve[id]||0)),qty=Math.min(need,monthlyDemand*g.procurementShare),price=Math.max(1,(item.marketPrice||item.basePrice||1)*p.priceIndex[id]),cost=qty*price;if(cost<=g.treasury&&qty>0){p.inventory[id]=Math.max(0,p.inventory[id]-qty);p.reserve[id]=(p.reserve[id]||0)+qty;g.treasury-=cost;g.monthlyProcurementSpent+=cost;g.monthlyPurchased+=qty;}});});}
 // Government release: reserve enters the affected local market only when shortage/price trigger is met.
 items.forEach(item=>{const id=item.id;provinceRecords.forEach(meta=>{const p=s.provinces[meta.id],monthlyDemand=(p.demand[id]||0)*seasonalDemandFactor(id,day),dailyDemand=monthlyDemand/30,cover=dailyDemand>0?p.inventory[id]/dailyDemand:30;if(cover<g.releaseTriggerDays&&p.priceIndex[id]>1.15){const qty=Math.min(p.reserve[id]||0,monthlyDemand*g.releaseShare);p.reserve[id]=Math.max(0,(p.reserve[id]||0)-qty);p.inventory[id]+=qty;g.monthlyReleased+=qty;}});});
 // Imports are the last safety valve, capped and paid from the treasury; only uncovered national demand is imported.
 items.forEach(item=>{const id=item.id;let shortage=0,monthly=0;provinceRecords.forEach(meta=>{const p=s.provinces[meta.id],monthlyDemand=(p.demand[id]||0)*seasonalDemandFactor(id,day),daily=monthlyDemand/30;shortage+=Math.max(0,daily-p.inventory[id]);monthly+=monthlyDemand;});if(shortage>0&&monthly>0){const alreadyImported=Number(g.monthlyImportedByCommodity[id])||0;const remainingImportCap=Math.max(0,monthly*g.importShareCap-alreadyImported);const qty=Math.min(shortage*30,remainingImportCap),price=Math.max(1,(item.marketPrice||item.basePrice||1)*1.15),cost=qty*price;if(cost<=g.treasury&&qty>0){let left=qty;provinceRecords.slice().sort((a,b)=>(s.provinces[a.id].inventory[id]||0)-(s.provinces[b.id].inventory[id]||0)).forEach(meta=>{if(left<=0)return;const p=s.provinces[meta.id],need=Math.max(0,((p.demand[id]||0)*seasonalDemandFactor(id,day))/30-p.inventory[id])*30,take=Math.min(left,need);p.inventory[id]+=take;p.imports[id]=(p.imports[id]||0)+take;left-=take;});const actual=qty-left;g.treasury-=actual*price;g.monthlyImportSpent+=actual*price;g.monthlyImported+=actual;g.monthlyImportedByCommodity[id]=alreadyImported+actual;}}});
 // National and local price indices are separate. Regional shocks do not directly reprice unaffected provinces.
 items.forEach(item=>{const id=item.id;let weighted=0,pop=0,reserve=0,demand=0;provinceRecords.forEach(meta=>{const p=s.provinces[meta.id];weighted+=p.priceIndex[id]*p.population;pop+=p.population;reserve+=p.reserve[id]||0;demand+=(p.demand[id]||0)*seasonalDemandFactor(id,day);});s.national.priceIndex[id]=pop?weighted/pop:1;s.national.reserveIndex[id]=demand?reserve/demand:0;});
 s.dayProcessed=day;return {day,provinceCount:provinceRecords.length,activeAgentCount:s.activeAgents.length,totalPopulation:s.population,government:{monthlyPurchased:g.monthlyPurchased,monthlyReleased:g.monthlyReleased,monthlyImported:g.monthlyImported,treasury:g.treasury},national:s.national};}
 function applyOrderBookFills(fills){
  const s=ensure();if(!s)return {ok:false,reason:"game_state_unavailable",applied:0};
  if(!Array.isArray(fills))return {ok:false,reason:"invalid_fills",applied:0};
  const totals={};
  for(const fill of fills){
   const p=s.provinces[String(fill.regionId||"")],id=String(fill.commodityId||""),qty=Number(fill.quantity),price=Number(fill.price);
   if(!p||!Object.prototype.hasOwnProperty.call(p.inventory,id)||!Number.isFinite(qty)||qty<=0||!Number.isFinite(price)||price<=0)return {ok:false,reason:"invalid_regional_fill",applied:0};
   const sellerIsNpc=String(fill.sellerId||"").startsWith("npc-");
   const buyerIsNpc=String(fill.buyerId||"").startsWith("npc-");
   if(sellerIsNpc){
    const available=Math.max(0,Number(p.inventory[id])||0);
    if(available+1e-7<qty)return {ok:false,reason:"regional_market_stock_shortfall:"+id,applied:0};
   }
   if(buyerIsNpc){
    const unmet=Math.max(0,Number(p.unmetDemand[id])||0);
    if(unmet+1e-7<qty)return {ok:false,reason:"regional_unmet_demand_shortfall:"+id,applied:0};
   }
  }
  fills.forEach(fill=>{
   const p=s.provinces[String(fill.regionId)],id=String(fill.commodityId),qty=Number(fill.quantity),price=Number(fill.price);
   if(String(fill.sellerId||"").startsWith("npc-"))p.inventory[id]=Math.max(0,(Number(p.inventory[id])||0)-qty);
   if(String(fill.buyerId||"").startsWith("npc-"))p.unmetDemand[id]=Math.max(0,(Number(p.unmetDemand[id])||0)-qty);
   if(!p.tradeIndex)p.tradeIndex={};
   const tradeDay=Number(fill.executedAt)||s.dayProcessed;
   const previous=p.tradeIndex[id]||{quantity:0,notional:0,lastPrice:0,day:0};
   const old=Number(previous.day)===tradeDay?previous:{quantity:0,notional:0,lastPrice:0,day:tradeDay};
   p.tradeIndex[id]={quantity:old.quantity+qty,notional:old.notional+qty*price,lastPrice:price,day:tradeDay};
   totals[id]=(totals[id]||0)+qty;
  });
  s.national.lastOrderBookTradeDay=s.dayProcessed;
  s.national.orderBookExecutedQuantity=Object.values(totals).reduce((a,b)=>a+b,0);
  return {ok:true,applied:fills.length,commodityQuantities:totals};
 }
 function generateMonthlyEvents(s,day){if(day%30!==1||!(s.eventChancePerProvinceMonthly>0))return;const r=random((s.seed^Math.imul(day,2654435761))>>>0);provinceRecords.forEach(meta=>{if(r()>=s.eventChancePerProvinceMonthly)return;const kind=r();const type=kind<0.42?"banjir":kind<0.78?"kekeringan":"gangguan_logistik";const commodityIds=type==="gangguan_logistik"?catalog().map(item=>item.id):["padi","jagung","cabai_merah","bawang_merah"];const loss=type==="banjir"?0.18+r()*0.42:type==="kekeringan"?0.12+r()*0.38:0;const logistics=type==="gangguan_logistik"?0.15+r()*0.35:0.04+r()*0.12;applyDisaster({provinceId:meta.id,gameDay:day,type,commodityIds,productionLossFraction:loss,logisticsLossFraction:logistics,durationDays:15+Math.floor(r()*46)});});}
 function updateDay(day){const s=ensure();if(!s||s.dayProcessed>=day)return null;const nextDay=Math.max(1,Math.floor(Number(day)||1));generateMonthlyEvents(s,nextDay);return runDaily(s,nextDay);}
 function provinceSnapshot(id){const s=ensure(),meta=provinceRecords.find(p=>p.id===String(id));if(!meta)return null;const p=s.provinces[meta.id];return {id:meta.id,name:meta.name,adminCode:meta.adminCode,population:p.population,populationReference2025:meta.populationReference2025,regencyCount:meta.regencyCount,cityCount:meta.cityCount,districtCount:meta.districtCount,villageKelurahanCount:meta.villageKelurahanCount,desaCount:meta.desaCount,kelurahanCount:meta.kelurahanCount,uptSptCount:meta.uptSptCount,bpsDistrictCount:meta.bpsDistrictCount,bpsVillageKelurahanCount:meta.bpsVillageKelurahanCount,prices:Object.assign({},p.priceIndex),inventory:Object.assign({},p.inventory),demand:Object.assign({},p.demand),unmetDemand:Object.assign({},p.unmetDemand),dailyProduction:Object.assign({},p.dailyProduction||{}),dailyDemand:Object.assign({},p.dailyDemand||{}),dailyPhysicalDemand:Object.assign({},p.dailyPhysicalDemand||{}),dailyPhysicalSupply:Object.assign({},p.dailyPhysicalSupply||{}),dailyPhysicalSupplyStatus:Object.assign({},p.dailyPhysicalSupplyStatus||{}),commodityPhysicalCoverage:Object.assign({},p.commodityPhysicalCoverage||{}),reserve:Object.assign({},p.reserve),imports:Object.assign({},p.imports),activeEffects:Object.assign({},p.activeEffects),livestockPopulationReference2024:Object.assign({},p.livestockPopulationReference2024?.counts||{}),poultryPopulationReference2025:Object.assign({},p.poultryPopulationReference2025?.counts||{}),aquacultureProductionReference2024Bps:Object.assign({},p.aquacultureProductionReference2024Bps?.countsTon||{}),regionalPriceReference2025:Object.assign({},p.regionalPriceReference2025||{}),tradeIndex:Object.assign({},p.tradeIndex||{}),localityNamesStatus:meta.localityNamesStatus,adminAllocationStatus:meta.adminAllocationStatus,physicalDemand:Object.assign({},p.physicalDemand),demandLayers:{household:{status:"official_bapanas_2025_where_mapped"},nonHousehold:{status:"official_bps_2025_numeric_extraction_pending"},total:{status:"pending_household_plus_nonhousehold_reconciliation"}}};}
 let adminMasterCache=null,adminMasterPromise=null;
 function parseCsvRows(text){const lines=String(text||"").replace(/\r/g,"").trim().split("\n");return lines.slice(1).filter(Boolean).map(line=>{const out=[];let value="",quoted=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){if(quoted&&line[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(ch===","&&!quoted){out.push(value);value="";}else value+=ch;}out.push(value);return out;});}
 async function loadAdministrativeMaster(options){
  if(adminMasterCache)return adminMasterCache;if(adminMasterPromise)return adminMasterPromise;
  const fetcher=root.fetch||(typeof fetch==="function"?fetch:null);if(!fetcher)throw new Error("Fetch tidak tersedia untuk memuat master wilayah.");
  const base=options&&options.basePath?String(options.basePath):"data/administrative_regions/";
  const files=["kemendagri_2025_provinces.csv","kemendagri_2025_regencies.csv","kemendagri_2025_districts.csv","kemendagri_2025_villages.csv"];
  adminMasterPromise=Promise.all(files.map(file=>fetcher.call(root,base+file).then(response=>{if(!response.ok)throw new Error("Gagal memuat "+file+" ("+response.status+")");return response.text();}))).then(texts=>{
   const provinces=parseCsvRows(texts[0]).map(r=>({id:r[0],name:r[1]}));
   const regencies=parseCsvRows(texts[1]).map(r=>({id:r[0],province_id:r[1],name:r[2]}));
   const districts=parseCsvRows(texts[2]).map(r=>({id:r[0],regency_id:r[1],name:r[2]}));
   const villages=parseCsvRows(texts[3]).map(r=>({id:r[0],district_id:r[1],name:r[2]}));
   if(provinces.length!==38||regencies.length!==514||districts.length!==7285||villages.length!==83762)throw new Error("Jumlah baris master wilayah tidak cocok dengan manifest Kepmendagri 2025.");
   const regencyById=new Map(regencies.map(r=>[r.id,r])),districtById=new Map(districts.map(d=>[d.id,d]));
   const byProvince={};provinces.forEach(p=>byProvince[p.id]={regencies:[],cities:[],districts:[],desa:[],kelurahan:[],uptSpt:[]});
   regencies.forEach(r=>{const bucket=byProvince[r.province_id];if(!bucket)throw new Error("Kabupaten/kota tanpa provinsi induk: "+r.id);(r.name.startsWith("Kota ")?bucket.cities:bucket.regencies).push(r);});
   districts.forEach(d=>{const parent=regencyById.get(d.regency_id);if(!parent)throw new Error("Kecamatan tanpa kabupaten/kota induk: "+d.id);byProvince[parent.province_id].districts.push(d);});
   villages.forEach(v=>{const parentDistrict=districtById.get(v.district_id);if(!parentDistrict)throw new Error("Desa/kelurahan tanpa kecamatan induk: "+v.id);const parentRegency=regencyById.get(parentDistrict.regency_id);const bucket=byProvince[parentRegency.province_id],type=v.id.slice(-4,-3);if(type==="1")bucket.kelurahan.push(v);else if(type==="2")bucket.desa.push(v);else if(type==="3")bucket.uptSpt.push(v);else throw new Error("Tipe kode desa/kelurahan tidak dikenal: "+v.id);});
   const totals={regencies:0,cities:0,districts:0,desa:0,kelurahan:0,uptSpt:0};Object.values(byProvince).forEach(x=>Object.keys(totals).forEach(k=>totals[k]+=x[k].length));
   if(totals.regencies!==416||totals.cities!==98||totals.districts!==7285||totals.desa!==75252||totals.kelurahan!==8496||totals.uptSpt!==14)throw new Error("Validasi agregat master wilayah gagal.");
   adminMasterCache={provinces,regencies,districts,villages,regencyById,districtById,byProvince,totals,source:"third-party normalized dataset derived from Kepmendagri 300.2.2-2138/2025"};return adminMasterCache;
  }).catch(error=>{adminMasterPromise=null;throw error;});
  return adminMasterPromise;
 }
 function normalizeLocalityLevel(level){const aliases={kabupaten:"regency",kota:"city",kecamatan:"district",village:"desa",desa_kelurahan:"villageKelurahan"};return aliases[level]||level;}
 function getLocalityRows(meta,level,master){const b=master.byProvince[meta.adminCode];if(!b)return [];if(level==="villageKelurahan")return b.desa.concat(b.kelurahan,b.uptSpt);const key=level==="regency"?"regencies":level==="city"?"cities":level==="district"?"districts":level;return b[key]||[];}
 function getLocalityAggregate(provinceId,level,index){
  const s=ensure();if(!s)return null;
  if(level==="country"){const demand={};catalog().forEach(item=>{demand[item.id]=provinceRecords.reduce((sum,meta)=>sum+(s.provinces[meta.id].demand[item.id]||0),0);});const physicalDemand={};Object.entries(PHYSICAL_DEMAND_ANCHORS_2025).forEach(([id,a])=>{const annualTotal=a.annualPerCapita*POPULATION;physicalDemand[id]={unit:a.unit,annualPerCapita:a.annualPerCapita,annualTotal,monthlyTotal:annualTotal/12,sourceCommodity:a.sourceCommodity,source:a.source,status:a.status,year:a.year};});return {id:"republik-arunika",name:COUNTRY_NAME,level,population:POPULATION,provinceCount:provinceRecords.length,administrativeTotals:Object.assign({},NATIONAL_ADMIN),bpsAdministrativeReference:Object.assign({},BPS_ADMIN_REFERENCE),monthlyDemandIndex:demand,physicalDemand,sourceStatus:"aggregate_game_population_and_demand"};}
  const meta=provinceRecords.find(p=>p.id===String(provinceId));if(!meta)return null;
  if(level==="province"){const province=provinceSnapshot(meta.id);province.level="province";province.monthlyDemandIndex=province.demand;return province;}
  level=normalizeLocalityLevel(level);
  const allowed={regency:meta.regencyCount,city:meta.cityCount,district:meta.districtCount,desa:meta.desaCount,kelurahan:meta.kelurahanCount,villageKelurahan:meta.villageKelurahanCount};
  const count=allowed[level];if(!Number.isInteger(count)||count<1||!Number.isInteger(index)||index<0||index>=count)return null;
  const p=s.provinces[meta.id],pop=Math.floor(p.population/count)+(index<p.population%count?1:0),demand={};
  Object.keys(p.demand).forEach(id=>{demand[id]=p.demand[id]/count;});
  return {id:meta.id+"-"+level+"-"+String(index+1).padStart(5,"0"),name:(level==="regency"?"Kabupaten simulasi ":level==="city"?"Kota simulasi ":level==="district"?"Kecamatan simulasi ":level==="desa"?"Desa simulasi ":level==="kelurahan"?"Kelurahan simulasi ":"Unit desa/kelurahan simulasi ")+(index+1),level,provinceId:meta.id,population:pop,monthlyDemandIndex:demand,sourceStatus:"derived_equal_split_not_official_locality_observation",masterNameStatus:"official_names_available_after_async_master_load",populationStatus:"equal_share_estimate_pending_locality_population_data"};
 }
 async function getLocalityAggregateAsync(provinceId,level,index,options){
  const s=ensure();if(!s)return null;if(level==="country"||level==="province")return getLocalityAggregate(provinceId,level,index);
  const meta=provinceRecords.find(p=>p.id===String(provinceId));if(!meta)return null;level=normalizeLocalityLevel(level);
  const master=await loadAdministrativeMaster(options),rows=getLocalityRows(meta,level,master),row=rows[index];if(!row)return null;
  const p=s.provinces[meta.id],populationAnchor=(level==="regency"||level==="city")?BPS_KABKOTA_POPULATION_2025[row.id]:null;
  const allocationCache={};
  function equalAllocate(total,rowsForParent,key){const n=rowsForParent.length;if(!n)return 0;const pos=Math.max(0,rowsForParent.findIndex(x=>x.id===key));return Math.floor(total/n)+(pos<total%n?1:0);}
  let population=0,populationStatus="derived_hierarchical_equal_share_pending_official_locality_population";
  if(populationAnchor){population=getBpsDkiLocalityGamePopulation2025()[row.id];populationStatus="official_bps_2025_weights_scaled_to_game_population";}
  else if(level==="regency"||level==="city"){population=equalAllocate(p.population,rows,row.id);}
  else if(level==="district"){
    const parent=master.regencyById.get(row.regency_id),parentRows=parent?(
      master.byProvince[meta.adminCode].regencies.some(x=>x.id===parent.id)
        ? master.byProvince[meta.adminCode].regencies
        : master.byProvince[meta.adminCode].cities
    ):[],parentPopulation=parent?equalAllocate(p.population,parentRows,parent.id):0;
    const childRows=master.districts.filter(x=>x.regency_id===row.regency_id);
    population=equalAllocate(parentPopulation,childRows,row.id);
  } else if(level==="villageKelurahan"||level==="desa"||level==="kelurahan"){
    const parentDistrict=master.districtById.get(row.district_id);
    const parentRegency=parentDistrict?master.regencyById.get(parentDistrict.regency_id):null;
    const parentLevelRows=parentRegency?(
      master.byProvince[meta.adminCode].regencies.some(x=>x.id===parentRegency.id)
        ? master.byProvince[meta.adminCode].regencies
        : master.byProvince[meta.adminCode].cities
    ):[],
    parentPopulation=parentRegency?equalAllocate(p.population,parentLevelRows,parentRegency.id):0;
    const districtRows=parentDistrict?master.districts.filter(x=>x.regency_id===parentDistrict.regency_id):[];
    const districtPopulation=parentDistrict?equalAllocate(parentPopulation,districtRows,parentDistrict.id):0;
    const childRows=master.villages.filter(x=>x.district_id===row.district_id);
    population=equalAllocate(districtPopulation,childRows,row.id);
  } else population=equalAllocate(p.population,rows,row.id);
  population=Math.max(0,Math.floor(population));
  const count=rows.length,demand={};Object.keys(p.demand).forEach(id=>{demand[id]=p.population>0?p.demand[id]*(population/p.population):0;});
  const physicalDemand={};Object.entries(PHYSICAL_DEMAND_ANCHORS_2025).forEach(([id,a])=>{const annualTotal=a.annualPerCapita*population;physicalDemand[id]={unit:a.unit,annualPerCapita:a.annualPerCapita,annualTotal,monthlyTotal:annualTotal/12,sourceCommodity:a.sourceCommodity,source:a.source,status:populationAnchor?"official_bps_kabkota_2025_weighted":"derived_equal_split_from_province"};});const localityHousehold=(level==="regency"||level==="city")?(localityConsumptionSnapshot(row.id)||{status:"not_yet_ingested",source:"Bapanas 2025 kabupaten/kota kg/kap/tahun"}):{status:"not_available_at_this_administrative_depth",source:"No verified Bapanas 2025 household leaf dataset at district/village depth"};return {id:row.id,name:row.name,level,provinceId:meta.id,provinceName:meta.name,population,monthlyDemandIndex:demand,physicalDemand,householdConsumption2025:localityHousehold,demandLayers:{household:{status:localityHousehold.coverageStatus||localityHousehold.status||"derived_from_provincial_bapanas_2025_anchor"},nonHousehold:{status:"official_bps_2025_numeric_extraction_pending"},total:{status:"pending_household_plus_nonhousehold_reconciliation"}},localMarketQuoteStatus:"bounded_experimental_quoteLocality_overlay_not_order_book_clearing",sourceStatus:"derived_kemendagri_2025_name_and_code",populationStatus,sourcePopulation:populationAnchor?populationAnchor.population:null,populationSource:populationAnchor?populationAnchor.source:null,administrativeMaster:"third-party normalized dataset derived from Kepmendagri 300.2.2-2138/2025"};
 }
 async function searchLocalities(provinceId,level,query,limit,options){
  const meta=provinceRecords.find(p=>p.id===String(provinceId));if(!meta)return [];level=normalizeLocalityLevel(level);
  const master=await loadAdministrativeMaster(options),rows=getLocalityRows(meta,level,master),q=String(query||"").trim().toLowerCase(),max=Math.max(1,Math.min(100,Math.floor(Number(limit)||30))),out=[];
  for(let i=0;i<rows.length&&out.length<max;i++){const row=rows[i];if(!q||row.name.toLowerCase().includes(q)||row.id.includes(q))out.push({index:i,id:row.id,name:row.name,level});}
  return out;
 }
 function quote(provinceId,commodityId,nationalPrice){const s=ensure(),p=s&&s.provinces[String(provinceId)];if(!p||!Object.prototype.hasOwnProperty.call(p.priceIndex,commodityId))return null;const ref=regionalConsumerPriceReference(String(provinceId),String(commodityId));const base=ref&&Number.isFinite(ref.priceRp)?ref.priceRp:(Number(nationalPrice)||1);return boundedMarketQuote(commodityId,base*p.priceIndex[commodityId]);}
 function runtimeDataRegistry(){
  const s=ensure(), verified=[];
  const add=(id,source,status,records,depth)=>verified.push({id,source,status,records,depth,runtimeBound:true});
  add("bapanas_national_consumption_2025","Badan Pangan Nasional","official_source_numeric_dataset_verified",BAPANAS_NATIONAL_CONSUMPTION_2025.length,"country");
  add("bapanas_monthly_demand_2025","Badan Pangan Nasional","official_source_numeric_dataset_verified",Object.keys(BAPANAS_MONTHLY_DEMAND_2025.records||{}).length,"country");
  add("bapanas_provincial_consumption_2025_partial","Badan Pangan Nasional","official_source_numeric_dataset_verified_partial",BAPANAS_PROVINCIAL_CONSUMPTION_2025_PARTIAL.length,"province");
  add("bapanas_kabkota_consumption_2025_partial","Badan Pangan Nasional","official_source_numeric_dataset_verified_partial",BAPANAS_KABKOTA_CONSUMPTION_2025_PARTIAL.length,"regency_city");
  add("bps_dki_kabkota_population_2025","Badan Pusat Statistik DKI Jakarta","official_source_numeric_dataset_verified",Object.keys(BPS_KABKOTA_POPULATION_2025).length,"regency_city");
  add("physical_demand_anchors_2025","Badan Pangan Nasional","official_consumption_anchor",Object.keys(PHYSICAL_DEMAND_ANCHORS_2025).length,"country_province_locality");
  add("administrative_master_2025","Kemendagri-derived normalized administrative master","runtime_admin_master",NATIONAL_ADMIN.regencies+NATIONAL_ADMIN.cities+NATIONAL_ADMIN.districts+NATIONAL_ADMIN.desa+NATIONAL_ADMIN.kelurahan+NATIONAL_ADMIN.uptSpt,"administrative");
  const maizeData=maizeProjectionRuntimeData();
  if(maizeData){
   add("kementan_maize_total_demand_projection_2025","Kementan Pusdatin / Bapanas","official_projection_runtime_market_demand",1,"country_to_province");
   add("bps_maize_production_2025","Badan Pusat Statistik","official_statistic_final_runtime_reference",1,"country");
   const provincial=REAL_ECONOMIC_DATA.maizeProvincialProduction2025Partial;
   if(provincial)add("bps_maize_provincial_production_2025_partial","Badan Pusat Statistik provincial offices","official_statistic_final_partial_rounded_reference",Object.keys(provincial.records||{}).length,"province");
  }
  const horticulture=REAL_ECONOMIC_DATA.horticultureNationalProduction2025;
  if(horticulture)add("bps_horticulture_production_2025_national_partial","Badan Pusat Statistik / Ditjen Hortikultura","official_statistic_final_national_partial_commodity_rows",Object.keys(horticulture.records||{}).length,"country");
  const livestock=REAL_ECONOMIC_DATA.livestockPopulation2024;
  if(livestock?.coverage?.verifiedProvinceCount===38)add("bps_livestock_population_2024","Badan Pusat Statistik / Kementerian Pertanian Ditjen PKH","official_statistic_final_all_provinces_population_stock",Object.keys(livestock.records||{}).length*Object.keys(livestock.species||{}).length,"province");
  const poultry=REAL_ECONOMIC_DATA.poultryPopulation2025;
  if(poultry?.coverage?.verifiedProvinceCount===38)add("bps_poultry_population_2025","Badan Pusat Statistik / Kementerian Pertanian Ditjen PKH","official_statistic_provisional_all_provinces_population_stock",Object.keys(poultry.records||{}).length*Object.keys(poultry.species||{}).length,"province");
  const aquaculture=REAL_ECONOMIC_DATA.aquacultureNationalProduction2024;
  if(aquaculture)add("kkp_aquaculture_national_production_2024","Kementerian Kelautan dan Perikanan","official_validated_national_annual_output",Object.keys(aquaculture.recordsTon||{}).length,"country");
  const aquacultureBps=REAL_ECONOMIC_DATA.aquacultureProvincialProduction2024Bps;
  if(aquacultureBps?.coverage?.verifiedProvinceCount===38)add("bps_aquaculture_production_2024_provincial","Badan Pusat Statistik / Kementerian Kelautan dan Perikanan","official_statistic_final_38_province_11_species",Object.keys(aquacultureBps.records||{}).length*Object.keys(aquacultureBps.species||{}).length,"province");
  const plantation=REAL_ECONOMIC_DATA.plantationProduction2024Partial;
  if(plantation?.coverage?.verifiedProvinceCount===38)add("bps_plantation_production_2024_partial","Badan Pusat Statistik","official_statistic_partial_provincial_annual_runtime_reference",Object.keys(plantation.records||{}).length*Object.keys(plantation.commodityMap||{}).length,"province");
  const paddy=REAL_ECONOMIC_DATA.paddyProvincialProduction2025;
  if(paddy)add("bps_paddy_production_2025_provincial","Badan Pusat Statistik","official_statistic_final_all_provinces",Object.keys(paddy.records||{}).length,"province");
  const coverage=commodityPhysicalCoverageSnapshot("lampung");
  const commodityCoverage={totalCatalogCommodities:catalog().length,registeredCoverageRecords:coverage?.coverage?.[0]?.commodities?.length||0,all60Registered:catalog().length===60&&(coverage?.coverage?.[0]?.commodities?.length||0)===60};
  const pending=[SOURCES.nonHouseholdConsumption];

  return {verified,pending,commodityCoverage,allRuntimeBound:verified.every(x=>x.runtimeBound),verifiedCount:verified.length,pendingCount:pending.length};
 }
 function runtimeDataUsageAudit(){
  const s=ensure();
  const audit={};
  if(!s)return {runtimeAvailable:false,audit};
  const nationalRows=BAPANAS_CONSUMPTION_MODEL_2025.rows;
  audit.bapanasNationalConsumption={
   sourceRecords:BAPANAS_NATIONAL_CONSUMPTION_2025.length,
   modelRows:Object.keys(nationalRows).length,
   runtimeMappedRows:Object.values(nationalRows).filter(row=>row.gameId||row.category).length,
   runtimeStateSignals:Object.keys(s.provinces.lampung?.consumptionPressure||{}).length>0,
   runtimeBound:true
  };
  audit.bapanasMonthlyDemand={
   sourceRecords:Object.keys(BAPANAS_MONTHLY_DEMAND_2025.records||{}).length,
   seasonalMappedRecords:Object.keys(BAPANAS_MONTHLY_DEMAND_2025.records||{}).filter(id=>Array.isArray(BAPANAS_MONTHLY_DEMAND_2025.records[id].coefficients)&&BAPANAS_MONTHLY_DEMAND_2025.records[id].coefficients.length===12&&BAPANAS_MONTHLY_DEMAND_2025.records[id].coefficients.every(Number.isFinite)).length,
   runtimeApplied:Object.values(s.provinces).some(province=>Object.values(province.dailyDemand||{}).some(value=>value>0)),
   runtimeBound:true
  };
  const lampungRows=BAPANAS_PROVINCIAL_CONSUMPTION_2025_PARTIAL.filter(r=>r.provinceId==="lampung");
  audit.bapanasProvincialConsumption={sourceRecords:lampungRows.length,runtimeApplied:!!s.regionalConsumptionSeedVersion,runtimeBound:true};
  const locality=localityConsumptionSnapshot("3101");
  audit.bapanasKabkotaConsumption={sourceRecords:BAPANAS_KABKOTA_CONSUMPTION_2025_PARTIAL.length,runtimeApplied:!!locality,runtimeBound:true};
  const dkiPopulation=getBpsDkiLocalityGamePopulation2025();
  audit.bpsDkiKabkotaPopulation={sourceRecords:Object.keys(BPS_KABKOTA_POPULATION_2025).length,runtimeApplied:Object.keys(dkiPopulation).length===Object.keys(BPS_KABKOTA_POPULATION_2025).length,runtimeBound:true};
  audit.physicalDemandAnchors={sourceRecords:Object.keys(PHYSICAL_DEMAND_ANCHORS_2025).length,runtimeApplied:Object.keys(s.provinces.lampung?.physicalDemand||{}).length>0,runtimeBound:true};
  audit.administrativeMaster={sourceRecords:NATIONAL_ADMIN.regencies+NATIONAL_ADMIN.cities+NATIONAL_ADMIN.districts+NATIONAL_ADMIN.desa+NATIONAL_ADMIN.kelurahan+NATIONAL_ADMIN.uptSpt,runtimeApplied:!!adminMasterCache,runtimeBound:true};
  const maizeData=maizeProjectionRuntimeData();
  if(maizeData){
   const lampung=s.provinces.lampung,expectedPerCapita=maizeData.balance.totalNeedTon*1000/maizeData.denominator.value;
   audit.maizeTotalMarketDemand={sourceRecords:1,runtimeApplied:s.maizeTotalDemandRuntimeVersion===2&&Math.abs((lampung.totalMarketDemand2025?.jagung?.annualPerCapita||0)-expectedPerCapita)<1e-9&&lampung.totalMarketDemand2025?.jagung?.unitCompatibilityStatus==="physical_demand_reference_only_supply_stock_conversion_pending"&&lampung.demand.jagung>0,runtimeBound:true};
   audit.maizeProductionReference={sourceRecords:1,runtimeApplied:s.national.marketSupplyReference2025?.jagung?.officialNationalProductionTon===maizeData.production.productionAt14MoistureTon&&s.national.marketSupplyReference2025.jagung.regionalAllocationStatus==="partial_official_provincial_references_loaded_not_daily_supply_allocated",runtimeBound:true};
   const provincial=REAL_ECONOMIC_DATA.maizeProvincialProduction2025Partial;
   audit.maizeProvincialProduction2025Partial={sourceRecords:Object.keys(provincial?.records||{}).length,runtimeApplied:Object.keys(s.national.marketSupplyReference2025?.jagung?.provincialProduction2025Partial?.records||{}).length===Object.keys(provincial?.records||{}).length&&s.national.marketSupplyReference2025.jagung.provincialReferenceCoverage?.coverageStatus==="partial_official_provincial_observations"&&s.national.marketSupplyReference2025.jagung.regionalAllocationStatus==="partial_official_provincial_references_loaded_not_daily_supply_allocated",runtimeBound:true};
  }
  const horticulture=REAL_ECONOMIC_DATA.horticultureNationalProduction2025;
  audit.horticultureNationalProduction2025={sourceRecords:Object.keys(horticulture?.records||{}).length,provincialRows:Object.keys(horticulture?.provincialRecords||{}).length,runtimeApplied:Object.keys(s.national.marketSupplyReference2025?.horticulture?.records||{}).length===Object.keys(horticulture?.records||{}).length&&Object.keys(s.national.marketSupplyReference2025.horticulture?.provincialRecords||{}).length===Object.keys(horticulture?.provincialRecords||{}).length&&s.national.marketSupplyReference2025.horticulture?.coverage?.verifiedCommodityCount===18&&s.national.marketSupplyReference2025.horticulture?.provincialCoverage?.verifiedProvinceCount===3,runtimeBound:true};
  const paddy=REAL_ECONOMIC_DATA.paddyProvincialProduction2025;
  audit.paddyProvincialProduction2025={sourceRecords:Object.keys(paddy?.records||{}).length,runtimeApplied:s.national.marketSupplyReference2025?.padi?.nationalProductionTonGkg===paddy?.nationalTotalTonGkg&&s.national.marketSupplyReference2025?.padi?.coverage?.verifiedProvinceCount===38,runtimeBound:true};
  const plantation=REAL_ECONOMIC_DATA.plantationProduction2024Partial;
  const plantationProvinceIds=Object.keys(plantation?.records||{}),plantationCommodityIds=Object.keys(plantation?.commodityMap||{});
  const plantationApplied=plantationProvinceIds.every(provinceId=>plantationCommodityIds.every(id=>{
   const row=s.provinces[provinceId]?.marketSupplyReference2024?.plantation?.[id];
   return row&&row.referenceYear===2024&&Number.isFinite(row.productionKg)&&row.productionKg===plantation.records[provinceId][id]*1000000;
  }));
  audit.plantationProduction2024Partial={sourceRecords:plantationProvinceIds.length*plantationCommodityIds.length,provinceRows:plantationProvinceIds.length,commodityRows:plantationCommodityIds.length,runtimeApplied:plantationApplied&&plantationProvinceIds.length===38&&plantationCommodityIds.length===7,runtimeBound:true};
  const livestock=REAL_ECONOMIC_DATA.livestockPopulation2024,livestockProvinceIds=Object.keys(livestock?.records||{}),livestockSpeciesIds=Object.keys(livestock?.species||{});
  const livestockApplied=livestockProvinceIds.every(provinceId=>livestockSpeciesIds.every((id,index)=>s.provinces[provinceId]?.livestockPopulationReference2024?.counts?.[id]===livestock.records[provinceId][index]));
  audit.livestockPopulation2024={sourceRecords:livestockProvinceIds.length*livestockSpeciesIds.length,provinceRows:livestockProvinceIds.length,speciesRows:livestockSpeciesIds.length,mappedCatalogCommodities:Object.keys(livestock?.catalogMapping||{}).length,runtimeApplied:livestockApplied&&livestockProvinceIds.length===38&&livestockSpeciesIds.length===7,runtimeBound:true};
  const aquaculture=REAL_ECONOMIC_DATA.aquacultureNationalProduction2024,aquacultureIds=Object.keys(aquaculture?.recordsTon||{}),aquacultureMappings=Object.keys(aquaculture?.catalogMapping||{});
  const aquacultureApplied=aquacultureIds.every(id=>s.national.marketSupplyReference2024?.aquaculture?.recordsTon?.[id]===aquaculture.recordsTon[id]&&s.national.marketSupplyReference2024?.aquaculture?.recordsKg?.[id]===aquaculture.recordsTon[id]*1000)&&aquacultureMappings.every(id=>catalog().some(item=>item.id===aquaculture.catalogMapping[id]));
  audit.aquacultureNationalProduction2024={sourceRecords:aquacultureIds.length,mappedCatalogCommodities:aquacultureMappings.length,runtimeApplied:aquacultureApplied&&aquacultureIds.length===11&&aquacultureMappings.length===4,runtimeBound:true};
  const poultry=REAL_ECONOMIC_DATA.poultryPopulation2025,poultryProvinceIds=Object.keys(poultry?.records||{}),poultrySpeciesIds=Object.keys(poultry?.species||{});
  const poultryApplied=poultryProvinceIds.every(provinceId=>poultrySpeciesIds.every((id,index)=>s.provinces[provinceId]?.poultryPopulationReference2025?.counts?.[id]===poultry.records[provinceId][index]));
  audit.poultryPopulation2025={sourceRecords:poultryProvinceIds.length*poultrySpeciesIds.length,availableRecords:poultryProvinceIds.reduce((sum,provinceId)=>sum+poultry.records[provinceId].filter(value=>value!==null).length,0),unavailableRecords:poultryProvinceIds.reduce((sum,provinceId)=>sum+poultry.records[provinceId].filter(value=>value===null).length,0),provinceRows:poultryProvinceIds.length,speciesRows:poultrySpeciesIds.length,runtimeApplied:poultryApplied&&poultryProvinceIds.length===38&&poultrySpeciesIds.length===4,runtimeBound:true};
  const aquacultureBps=REAL_ECONOMIC_DATA.aquacultureProvincialProduction2024Bps,aquacultureProvinceIds=Object.keys(aquacultureBps?.records||{}),aquacultureSpeciesIds=Object.keys(aquacultureBps?.species||{});
  const aquacultureBpsApplied=aquacultureProvinceIds.every(provinceId=>aquacultureSpeciesIds.every((id,index)=>s.provinces[provinceId]?.aquacultureProductionReference2024Bps?.countsTon?.[id]===aquacultureBps.records[provinceId][index]));
  audit.aquacultureProvincialProduction2024Bps={sourceRecords:aquacultureProvinceIds.length*aquacultureSpeciesIds.length,provinceRows:aquacultureProvinceIds.length,speciesRows:aquacultureSpeciesIds.length,mappedCatalogCommodities:Object.keys(aquacultureBps?.catalogMapping||{}).length,runtimeApplied:aquacultureBpsApplied&&aquacultureProvinceIds.length===38&&aquacultureSpeciesIds.length===11,runtimeBound:true};

  const coverage=commodityPhysicalCoverageSnapshot("lampung");
  audit.all60CommodityCoverage={sourceRecords:catalog().length,runtimeApplied:catalog().length===60&&coverage?.coverage?.[0]?.commodities?.length===60&&coverage.coverage[0].commodities.every(x=>x.marketModelStatus==="active_catalog_and_market_index"&&x.storageProfileStatus==="storage_profile_available"),runtimeBound:true};
  audit.allVerifiedDatasetsRuntimeBound=Object.values(audit).every(x=>x&&x.runtimeBound===true&&x.runtimeApplied!==false&&x.runtimeStateSignals!==false);
  return {runtimeAvailable:true,audit};
 }
 function physicalDemandSnapshot(provinceId){const s=ensure();if(!s)return null;const population=provinceId?((s.provinces[String(provinceId)]||{}).population):POPULATION;if(!population)return null;const anchors={};Object.entries(PHYSICAL_DEMAND_ANCHORS_2025).forEach(([id,a])=>{const annualTotal=a.annualPerCapita*population;anchors[id]={unit:a.unit,annualPerCapita:a.annualPerCapita,annualTotal,monthlyTotal:annualTotal/12,sourceCommodity:a.sourceCommodity,source:a.source,status:a.status,year:a.year};});return {level:provinceId?"province":"country",provinceId:provinceId||null,population,anchors};}
 function commodityPhysicalCoverageSnapshot(provinceId){
  const s=ensure();if(!s)return null;
  const items=catalog(),ids=provinceId?[String(provinceId)]:provinceRecords.map(p=>p.id);
  return {commodityCount:items.length,provinceIds:ids,coverage:ids.map(id=>{const p=s.provinces[id];return p?{provinceId:id,commodities:items.map(item=>Object.assign({},p.commodityPhysicalCoverage?.[item.id]||{commodityId:item.id,name:item.name,qualityStatus:"coverage_not_initialized"}))}:null;}).filter(Boolean)};
 }
 function snapshot(){const s=ensure();return {countryName:COUNTRY_NAME,population:POPULATION,provinceCount:provinceRecords.length,administrativeTotals:Object.assign({},NATIONAL_ADMIN),bpsAdministrativeReference:Object.assign({},BPS_ADMIN_REFERENCE),activeAgentCount:s.activeAgents.length,activeAgentCap:s.agentCap,government:Object.assign({},s.government),national:Object.assign({},s.national),calibrationStatus:s.calibrationStatus,administrativeMasterLoaded:!!adminMasterCache,provinces:provinceRecords.map(p=>({id:p.id,name:p.name,population:s.provinces[p.id].population,regencies:p.regencyCount,cities:p.cityCount,districts:p.districtCount,desa:p.desaCount,kelurahan:p.kelurahanCount,uptSpt:p.uptSptCount,villageKelurahan:p.villageKelurahanCount}))};}
 root.AgroNationalEconomy={version:VERSION,runtimeDataRegistry,runtimeDataUsageAudit,maizeProjectionRuntimeData,applyMaizeTotalDemandProjection,applyLivestockPopulationReference,applyPoultryPopulationReference,applyAquacultureProductionReference,applyAquacultureProvincialProductionReference,countryName:COUNTRY_NAME,population:POPULATION,provinces:provinceRecords,nationalAdminTotals:NATIONAL_ADMIN,bpsAdminReference:BPS_ADMIN_REFERENCE,sources:SOURCES,podesMix:PODES_MIX,physicalDemandAnchors2025:PHYSICAL_DEMAND_ANCHORS_2025,bpsKabkotaPopulation2025:BPS_KABKOTA_POPULATION_2025,bpsKabkotaSimulationPopulation2025:getBpsDkiLocalityGamePopulation2025(),bapanasMonthlyDemand2025:BAPANAS_MONTHLY_DEMAND_2025,seasonalDemandCoefficient,seasonalDemandFactor,bapanasNationalConsumption2025:BAPANAS_NATIONAL_CONSUMPTION_2025,bapanasConsumptionModel2025:BAPANAS_CONSUMPTION_MODEL_2025,bapanasProvincialConsumption2025Partial:BAPANAS_PROVINCIAL_CONSUMPTION_2025_PARTIAL,bapanasKabupatenKotaConsumption2025Partial:BAPANAS_KABKOTA_CONSUMPTION_2025_PARTIAL,applyProvincialConsumptionRecords,applyKabupatenKotaConsumptionRecords,localityConsumptionSnapshot,quoteLocality,physicalDemandSnapshot,commodityPhysicalCoverageSnapshot,regionalConsumerPriceReference,applyRegionalConsumerPriceReference,nonHouseholdConsumptionSource:SOURCES.nonHouseholdConsumption,ensure,applyDisaster,applyNationalEmergency,marketEmergencySnapshot,endNationalEmergency,generateMonthlyEvents,updateDay,provinceSnapshot,getLocalityAggregate,getLocalityAggregateAsync,searchLocalities,loadAdministrativeMaster,quote,snapshot,activeAgentTarget,applyOrderBookFills};
})(typeof window!=="undefined"?window:globalThis);
