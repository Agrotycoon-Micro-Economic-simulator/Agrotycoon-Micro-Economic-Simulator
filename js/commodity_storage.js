(function(root){
 'use strict';
 const PROFILES=Object.freeze({
  padi:{name:"Gabah",status:"source_backed_condition_model",form:"gabah_kering_or_wet",safeMoistureMaxPct:14,highRiskMoistureMinPct:18,criticalMoistureMinPct:20,source:"FAO Rice: Post-harvest Operations; FAO Agricultural Engineering in Development — Storage",sourceUrl:"https://www.fao.org/4/t0522e/T0522E09.htm",notes:"FAO storage-duration table varies by both moisture and temperature. At 30 C, 18% moisture has about 2 days of recommended storage; at 25 C and 14% moisture about 50 days. Other sources report longer periods under controlled containers. Do not turn these conditional examples into a universal expiry."},
  jagung:{name:"Jagung pipilan",status:"source_backed_condition_model",safeMoistureMaxPct:14,recommendedLongStorageMoistureMaxPct:12,highRiskMoistureMinPct:16,criticalMoistureMinPct:18,source:"BSIP Tanaman Pangan — Inovasi Budi Daya & Pascapanen Jagung; BBRMP Babel — Good Handling Practices pada Jagung",sourceUrl:"https://tanamanpangan.bsip.pertanian.go.id/storage/assets/uploads/publikasi/hWTgjjZIWenPLFk4Furv2cybMDDQ8GW39TtHKpbW.pdf",notes:"Jagung pada kadar air 14% dapat bertahan lama bergantung suhu dan infeksi awal; 12% dianjurkan untuk penyimpanan. Jagung basah, berjamur, atau rusak tidak boleh diperlakukan sama dengan pipilan kering."},
  kelapa:{name:"Kelapa",status:"source_backed_form_specific_model",forms:{mature_husked:{ambientDaysMin:90,ambientDaysMax:150},mature_dehusked:{coolStorageDaysMax:60},young_tender_intact:{roomTemperatureObservedDays:13},young_partially_dehusked:{ambientAt30CDays:3}},source:"USDA Agricultural Research Service — Optimum Storage Conditions; Haseena et al. 2010, Post-harvest quality and shelf-life of tender coconut",sourceUrl:"https://www.ars.usda.gov/arsuserfiles/oc/np/commercialstorage/commercialstorage.pdf",notes:"Bentuk, kematangan, kulit, luka, suhu, dan kelembapan mengubah daya simpan. Nilai 13 hari adalah periode observasi mutu pada studi kelapa muda utuh, bukan klaim bahwa semua kelapa busuk pada hari ke-14."}
 });
 const finite=(v)=>Number.isFinite(Number(v));
 function assessLot(input){
  if(!input||typeof input!=="object")return {ok:false,reason:"invalid_lot"};
  const id=String(input.commodityId||"");
  const profile=PROFILES[id];
  if(!profile)return {ok:true,commodityId:id,risk:"unclassified",spoilageConfirmed:false,calibrationStatus:"research_required",reasons:["no_verified_storage_profile"],automaticExpiry:false};
  const age=finite(input.ageDays)?Math.max(0,Number(input.ageDays)):null;
  const moisture=finite(input.moisturePct)?Number(input.moisturePct):null;
  const temp=finite(input.temperatureC)?Number(input.temperatureC):null;
  const rh=finite(input.relativeHumidityPct)?Number(input.relativeHumidityPct):null;
  const reasons=[];
  let risk="normal";
  const raise=(next,reason)=>{const rank={normal:0,watch:1,high:2,critical:3,spoiled:4};if(rank[next]>rank[risk])risk=next;reasons.push(reason);};
  if(input.moldObserved===true||input.rottingObserved===true)raise("spoiled","visible_mold_or_rot_observed");
  if(input.physicalDamage===true)raise("watch","physical_damage_increases_infection_risk");
  if(input.pestObserved===true)raise("high","pest_activity_observed");
  if(input.flooded===true&&!input.driedAfterFlood){
   const wetDays=finite(input.daysSinceFlood)?Math.max(0,Number(input.daysSinceFlood)):0;
   if(wetDays>=3)raise("critical","flood_wet_and_not_dried_for_3_or_more_days");
   else if(wetDays>0)raise("high","flood_wet_and_not_dried");
  }
  if(id==="padi"||id==="jagung"){
   if(moisture===null)raise("watch","grain_moisture_not_recorded");
   else if(moisture>=profile.criticalMoistureMinPct)raise("critical","grain_moisture_at_or_above_critical_band");
   else if(moisture>=profile.highRiskMoistureMinPct)raise("high","grain_moisture_above_safe_storage_band");
   else if(moisture>(profile.safeMoistureMaxPct||14))raise("watch","grain_moisture_above_recommended_storage_limit");
   if(temp!==null&&temp>=30&&moisture!==null&&moisture>=18)raise("critical","hot_storage_and_high_grain_moisture");
   if(rh!==null&&rh>=85)raise("high","high_ambient_relative_humidity");
  }
  if(id==="kelapa"){
   const form=String(input.form||"");
   if(!profile.forms[form])raise("watch","coconut_form_not_classified");
   if(age!==null&&form==="young_partially_dehusked"&&temp!==null&&temp>=28&&age>=3)raise("high","young_partially_dehusked_coconut_at_ambient_30c_reaches_3_day_study_boundary");
   if(age!==null&&form==="mature_husked"&&age>150)raise("high","mature_husked_coconut_exceeds_upper_ambient_reference_range");
   if(rh!==null&&rh>90)raise("high","very_high_humidity_increases_surface_mold_risk");
  }
  return {ok:true,commodityId:id,ageDays:age,risk,spoilageConfirmed:risk==="spoiled",reasons,automaticExpiry:false,calibrationStatus:"condition_based_reference_model_not_universal_expiry",source:profile.source,sourceUrl:profile.sourceUrl};
 }
 root.AgroCommodityStorage=Object.freeze({profiles:PROFILES,assessLot});
})(typeof window!=="undefined"?window:globalThis);
