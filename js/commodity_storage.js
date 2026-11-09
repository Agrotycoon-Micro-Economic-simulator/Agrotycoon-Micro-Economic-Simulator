(function(root){
'use strict';
const GROUPS={
 grain:['padi','jagung','kedelai','kacang_tanah','kacang_hijau'],
 allium:['bawang_merah','bawang_putih'],
 tuber:['ubi_kayu','ubi_jalar','kentang'],
 leafy:['bayam','kangkung','sawi'],
 veg:['cabai_merah','cabai_rawit','tomat','kacang_panjang','mentimun','terong','kubis','wortel'],
 rhizome:['jahe','kunyit','lengkuas','serai'],
 fruit:['pisang','pepaya','mangga','durian','alpukat','jeruk','nanas','semangka','melon','stroberi'],
 plantation:['tebu','kopi','kakao','teh','karet','kelapa_sawit','vanili','lada','kapas','tembakau'],
 livestock:['ayam_pedaging','ayam_petelur','bebek','kambing','sapi_potong','sapi_perah','domba'],
 fish:['lele','nila','gurami','udang_vaname','patin'],
 stable:['madu'], mushroom:['jamur_tiram']
};
const BASE={
 grain:{storageClass:'dry_grain',form:'dry_grain',ambientDays:180,idealDays:365,referenceTempC:25,referenceRhPct:65,moistureMaxPct:14,moistureRequired:true,source:'FAO grain storage; BSIP postharvest guidance',sourceUrl:'https://www.fao.org/4/t0522e/T0522E09.htm',evidence:'conditional_reference'},
 allium:{storageClass:'cured_bulb',form:'cured_whole',ambientDays:45,idealDays:150,referenceTempC:15,referenceRhPct:70,source:'FAO horticultural storage tables',sourceUrl:'https://www.fao.org/4/y4358e/y4358e08.htm',evidence:'category_reference'},
 tuber:{storageClass:'root_tuber',form:'whole_unwashed',ambientDays:14,idealDays:60,referenceTempC:13,referenceRhPct:85,source:'FAO horticultural storage guidance',sourceUrl:'https://www.fao.org/4/x5403e/x5403e09.htm',evidence:'category_reference'},
 leafy:{storageClass:'leafy_fresh',form:'whole_fresh',ambientDays:2,idealDays:10,referenceTempC:2,referenceRhPct:95,source:'FAO horticultural storage tables',sourceUrl:'https://www.fao.org/4/y4358e/y4358e08.htm',evidence:'category_reference'},
 veg:{storageClass:'fresh_vegetable',form:'whole_fresh',ambientDays:5,idealDays:14,referenceTempC:10,referenceRhPct:90,source:'FAO horticultural storage tables',sourceUrl:'https://www.fao.org/4/y4358e/y4358e08.htm',evidence:'category_reference'},
 rhizome:{storageClass:'fresh_rhizome',form:'whole_unprocessed',ambientDays:21,idealDays:60,referenceTempC:12,referenceRhPct:85,source:'FAO horticultural storage guidance',sourceUrl:'https://www.fao.org/4/x5403e/x5403e09.htm',evidence:'category_reference'},
 fruit:{storageClass:'fresh_fruit',form:'whole_unprocessed',ambientDays:7,idealDays:21,referenceTempC:10,referenceRhPct:90,source:'FAO relative perishability and crop storage-life tables',sourceUrl:'https://www.fao.org/4/x5403e/x5403e09.htm',evidence:'category_reference'},
 plantation:{storageClass:'plantation_harvest',form:'fresh_harvest',ambientDays:3,idealDays:14,referenceTempC:20,referenceRhPct:80,source:'FAO postharvest handling principles; commodity-specific values need validation',sourceUrl:'https://www.fao.org/4/y4893e/y4893e06.htm',evidence:'provisional_research_required'},
 livestock:{storageClass:'live_animal',form:'live',ambientDays:null,idealDays:null,referenceTempC:25,referenceRhPct:60,source:'Live animal is not a meat shelf-life lot; slaughtered meat uses separate product form',sourceUrl:'https://ask.fsis.usda.gov/article/How-long-can-I-keep-meat-in-the-refrigerator',evidence:'state_dependent'},
 fish:{storageClass:'live_aquaculture',form:'live_in_water',ambientDays:null,idealDays:null,referenceTempC:27,referenceRhPct:70,source:'Live aquatic stock needs water-quality/mortality model; harvested fish uses chilled-fish profile',sourceUrl:'https://www.fao.org/4/v7180e/v7180e07.htm',evidence:'state_dependent'},
 stable:{storageClass:'stable_food',form:'sealed_honey',ambientDays:730,idealDays:1095,referenceTempC:25,referenceRhPct:55,source:'Conservative sealed-honey quality horizon; moisture ingress is the key risk',sourceUrl:'https://www.fao.org/4/x5403e/x5403e09.htm',evidence:'conservative_game_horizon'},
 mushroom:{storageClass:'fresh_mushroom',form:'whole_fresh',ambientDays:2,idealDays:7,referenceTempC:2,referenceRhPct:95,source:'FAO horticultural perishability table classifies mushrooms as very highly perishable',sourceUrl:'https://www.fao.org/4/x5403e/x5403e09.htm',evidence:'category_reference'}
};
const OV={
 padi:{ambientDays:180,idealDays:365,moistureMaxPct:14,moistureCriticalPct:18,form:'gabah_kering',referenceTempC:25,referenceRhPct:65,sourceUrl:'https://www.fao.org/4/t0522e/T0522E09.htm'},
 kelapa:{ambientDays:120,idealDays:150,form:'mature_husked',referenceTempC:25,referenceRhPct:70,source:'USDA commercial storage reference: mature husked coconut around 3-5 months ambient',sourceUrl:'https://www.ars.usda.gov/arsuserfiles/oc/np/commercialstorage/commercialstorage.pdf',evidence:'source_backed_form_specific'},
 jagung:{ambientDays:180,idealDays:365,moistureMaxPct:12,moistureCriticalPct:16,form:'pipilan_kering',referenceTempC:25,referenceRhPct:65,sourceUrl:'https://tanamanpangan.bsip.pertanian.go.id/storage/assets/uploads/publikasi/hWTgjjZIWenPLFk4Furv2cybMDDQ8GW39TtHKpbW.pdf'},
 bawang_merah:{ambientDays:45,idealDays:150,referenceTempC:15,referenceRhPct:70},bawang_putih:{ambientDays:90,idealDays:240,referenceTempC:0,referenceRhPct:70},
 ubi_kayu:{ambientDays:3,idealDays:14},ubi_jalar:{ambientDays:14,idealDays:90},kentang:{ambientDays:21,idealDays:120},
 cabai_merah:{ambientDays:3,idealDays:14},cabai_rawit:{ambientDays:4,idealDays:14},tomat:{ambientDays:5,idealDays:14,referenceTempC:12.5},
 bayam:{ambientDays:1,idealDays:7},kangkung:{ambientDays:1,idealDays:5},sawi:{ambientDays:2,idealDays:10},kubis:{ambientDays:14,idealDays:90,referenceTempC:0,referenceRhPct:98},wortel:{ambientDays:14,idealDays:120,referenceTempC:0},
 jahe:{ambientDays:21,idealDays:90},kunyit:{ambientDays:21,idealDays:60},lengkuas:{ambientDays:14,idealDays:60},serai:{ambientDays:3,idealDays:14},
 tebu:{ambientDays:2,idealDays:5,form:'fresh_cut_stalk'},kopi:{ambientDays:3,idealDays:7,form:'fresh_cherry'},kakao:{ambientDays:5,idealDays:10,form:'fresh_pod'},teh:{ambientDays:1,idealDays:2,form:'fresh_leaf'},karet:{ambientDays:1,idealDays:2,form:'fresh_latex'},kelapa_sawit:{ambientDays:1,idealDays:2,form:'fresh_fruit_bunch'},vanili:{ambientDays:2,idealDays:5,form:'fresh_green_pod'},lada:{ambientDays:180,idealDays:365,form:'dried_pepper'},kapas:{ambientDays:180,idealDays:365,form:'dry_raw_fiber'},tembakau:{ambientDays:3,idealDays:7,form:'fresh_leaf'},
 pisang:{ambientDays:4,idealDays:14},pepaya:{ambientDays:3,idealDays:14},mangga:{ambientDays:4,idealDays:21},durian:{ambientDays:2,idealDays:7},alpukat:{ambientDays:3,idealDays:14},jeruk:{ambientDays:14,idealDays:45},nanas:{ambientDays:7,idealDays:28},semangka:{ambientDays:7,idealDays:21},melon:{ambientDays:5,idealDays:14},stroberi:{ambientDays:1,idealDays:7,referenceTempC:1},
 jamur_tiram:{ambientDays:2,idealDays:7,referenceTempC:2,referenceRhPct:95},madu:{ambientDays:730,idealDays:1095,form:'sealed_honey'},
 ayam_pedaging:{form:'live',ambientDays:null,idealDays:null},ayam_petelur:{form:'live',ambientDays:null,idealDays:null},bebek:{form:'live',ambientDays:null,idealDays:null},kambing:{form:'live',ambientDays:null,idealDays:null},sapi_potong:{form:'live',ambientDays:null,idealDays:null},sapi_perah:{form:'live',ambientDays:null,idealDays:null},domba:{form:'live',ambientDays:null,idealDays:null},
 lele:{form:'live_in_water',ambientDays:null,idealDays:null},nila:{form:'live_in_water',ambientDays:null,idealDays:null},gurami:{form:'live_in_water',ambientDays:null,idealDays:null},udang_vaname:{form:'live_in_water',ambientDays:null,idealDays:null},patin:{form:'live_in_water',ambientDays:null,idealDays:null}
};
const PROFILES={};Object.entries(GROUPS).forEach(([g,ids])=>ids.forEach(id=>PROFILES[id]={...BASE[g],...(OV[id]||{}),commodityId:id}));
const rank={normal:0,watch:1,high:2,critical:3,expired:4,spoiled:5};
const finite=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v));
function profileFor(id,form){
 const p=PROFILES[id];if(!p)return null;
 if(['opened','cut','peeled','shredded','fresh_flesh'].includes(form))return {...p,storageClass:'opened_fresh',form,ambientDays:2,idealDays:5,referenceTempC:4,referenceRhPct:90,damageMultiplier:2.5,evidence:'conservative_opened_product_game_calibration'};
 if(['raw_meat','slaughtered_chilled'].includes(form))return {...p,storageClass:'raw_meat',form,ambientDays:1,idealDays:2,referenceTempC:4,referenceRhPct:85,source:'USDA FSIS: raw poultry/ground meat 1-2 days refrigerated; whole beef cuts 3-5 days',sourceUrl:'https://ask.fsis.usda.gov/article/How-long-can-I-keep-meat-in-the-refrigerator',evidence:'source_backed_refrigerated_guidance'};
 if(['raw_beef_cut'].includes(form))return {...p,storageClass:'raw_meat',form,ambientDays:2,idealDays:5,referenceTempC:4,referenceRhPct:85,source:'USDA FSIS: raw beef cuts 3-5 days refrigerated',sourceUrl:'https://ask.fsis.usda.gov/article/How-long-can-I-keep-meat-in-the-refrigerator',evidence:'source_backed_refrigerated_guidance'};
 if(['raw_fish','harvested_chilled'].includes(form))return {...p,storageClass:'raw_fish',form,ambientDays:1,idealDays:2,referenceTempC:0,referenceRhPct:95,source:'FAO: chilled fish shelf life is species- and temperature-dependent',sourceUrl:'https://www.fao.org/4/v7180e/v7180e07.htm',evidence:'source_backed_temperature_dependent_guidance'};
 if(form==='frozen')return {...p,storageClass:'frozen_food',form,ambientDays:365,idealDays:730,referenceTempC:-18,referenceRhPct:50,evidence:'frozen_quality_horizon_game_calibration'};
 if(form==='mature_husked')return {...p,storageClass:'whole_coconut',form,ambientDays:120,idealDays:150,referenceTempC:25,referenceRhPct:70,source:'USDA commercial storage reference: mature husked coconut around 3-5 months ambient',sourceUrl:'https://www.ars.usda.gov/arsuserfiles/oc/np/commercialstorage/commercialstorage.pdf',evidence:'source_backed_form_specific'};
 if(form==='young_partially_dehusked')return {...p,storageClass:'tender_coconut',form,ambientDays:3,idealDays:13,referenceTempC:25,referenceRhPct:80,source:'Tender coconut postharvest study; maturity and husk integrity affect shelf life',sourceUrl:'https://pmc.ncbi.nlm.nih.gov/articles/PMC3551135/',evidence:'source_backed_form_specific'};
 return p;
}
function assessLot(input){
 if(!input||typeof input!=='object')return {ok:false,reason:'invalid_lot'};
 const id=String(input.commodityId||'');
 if(['es','es_batu','ice'].includes(id)){
  const t=finite(input.temperatureC)?Number(input.temperatureC):25,freezer=input.storageType==='freezer'||t<=-1,melted=!freezer&&t>=20&&(Number(input.ageDays)||0)>=1;
  return {ok:true,commodityId:id,mechanism:'melting_not_biological_spoilage',risk:melted?'expired':'normal',expired:melted,spoilageConfirmed:false,quality:melted?0:100,shelfLifeDays:freezer?null:1,calibrationStatus:'one_day_ambient_game_rule'};
 }
 const p=profileFor(id,input.form||PROFILES[id]?.form);
 if(!p)return {ok:true,commodityId:id,risk:'unclassified',expired:false,spoilageConfirmed:false,calibrationStatus:'research_required',reasons:['no_profile']};
 const age=finite(input.ageDays)?Math.max(0,Number(input.ageDays)):0;
 if(['live_animal','live_aquaculture'].includes(p.storageClass))return {ok:true,commodityId:id,form:p.form,risk:'normal',expired:false,spoilageConfirmed:false,quality:100,calibrationStatus:'live_health_model_required'};
 const temp=finite(input.temperatureC)?Number(input.temperatureC):30,rh=finite(input.relativeHumidityPct)?Number(input.relativeHumidityPct):80,moist=finite(input.moisturePct)?Number(input.moisturePct):null;
 let rate=Math.pow(2,Math.max(-3,Math.min(4,(temp-Number(p.referenceTempC||25))/10)));
 if(['dry_grain','dry_vegetable','stable_food'].includes(p.storageClass)){if(rh>70)rate*=1+Math.min(2,(rh-70)/30);if(rh<25)rate*=1.15;}
 else {if(rh>90)rate*=1+Math.min(.75,(rh-90)/20);if(rh<55)rate*=1+Math.min(.5,(55-rh)/100);}
 if(input.physicalDamage===true)rate*=1.8;
 if(input.opened===true)rate*=2.5;
 if(p.moistureRequired&&moist===null)rate*=1.35;
 if(p.moistureMaxPct&&moist!==null&&moist>p.moistureMaxPct)rate*=1+Math.min(3,(moist-p.moistureMaxPct)/4);
 if(p.moistureCriticalPct&&moist!==null&&moist>=p.moistureCriticalPct)rate*=2;
 if(input.flooded===true&&!input.driedAfterFlood){const wet=finite(input.daysSinceFlood)?Math.max(0,Number(input.daysSinceFlood)):0;rate*=1+Math.min(4,wet);if(wet>=3)rate*=1.5;}
 const days=Number(input.storageType==='refrigerated'?p.idealDays:p.ambientDays);
 if(!Number.isFinite(days)||days<=0)return {ok:true,commodityId:id,risk:'unclassified',expired:false,spoilageConfirmed:false,calibrationStatus:'research_required'};
 const effectiveAge=age*rate,ratio=effectiveAge/days,quality=Math.max(0,Math.min(100,100*(1-ratio)));
 let risk=ratio>=1?'expired':ratio>=.8?'critical':ratio>=.55?'high':ratio>=.3?'watch':'normal';
 if(input.flooded===true&&!input.driedAfterFlood&&finite(input.daysSinceFlood)&&Number(input.daysSinceFlood)>=3&&['dry_grain','root_tuber'].includes(p.storageClass)&&rank[risk]<rank.critical)risk='critical';
 if(p.moistureCriticalPct&&moist!==null&&moist>=p.moistureCriticalPct&&rank[risk]<rank.critical)risk='critical';
 if(input.moldObserved===true||input.rottingObserved===true)risk='spoiled';
 return {ok:true,commodityId:id,form:p.form,ageDays:age,effectiveAgeDays:Number(effectiveAge.toFixed(3)),shelfLifeDays:days,quality:Number(quality.toFixed(2)),risk,expired:['expired','spoiled'].includes(risk),spoilageConfirmed:['expired','spoiled'].includes(risk),automaticExpiry:false,calibrationStatus:p.evidence,reference:{temperatureC:p.referenceTempC,relativeHumidityPct:p.referenceRhPct},source:p.source,sourceUrl:p.sourceUrl,reasons:[...(input.flooded&&!input.driedAfterFlood?['flood_wet_not_dried']:[]),...(input.physicalDamage?['physical_damage']:[]),...(input.opened?['opened_or_cut']:[])]};
}
function ensureLotBook(state){
 if(!state||typeof state!=='object')return {ok:false,reason:'invalid_state'};
 if(!state.landSystem||typeof state.landSystem!=='object')state.landSystem={inventory:{},inventoryCost:{}};
 const ls=state.landSystem;if(!Array.isArray(ls.storageLots))ls.storageLots=[];
 if(!ls.storageMigrationDone){Object.keys(ls.inventory||{}).forEach(id=>{const q=Math.max(0,Number(ls.inventory[id])||0);if(q>0&&!ls.storageLots.some(l=>l.commodityId===id))ls.storageLots.push({id:'legacy-'+id+'-'+(state.day||0),commodityId:id,quantity:q,unitCost:Math.max(0,Number(ls.inventoryCost&&ls.inventoryCost[id])||0)/q,receivedDay:Number(state.day)||0,ageDays:0,ageKnown:false,form:PROFILES[id]?.form||'unknown_legacy_form',storageType:'unknown',temperatureC:null,relativeHumidityPct:null,quality:100,legacyOpeningStock:true});});ls.storageMigrationDone=true;}
 return {ok:true,lots:ls.storageLots};
}
function receiveLot(state,input){
 const b=ensureLotBook(state);if(!b.ok||!input||!PROFILES[input.commodityId]||!finite(input.quantity)||Number(input.quantity)<=0)return {ok:false,reason:'invalid_receipt'};
 const p=PROFILES[input.commodityId],q=Number(input.quantity),lot={id:String(input.id||('lot-'+input.commodityId+'-'+(state.day||0)+'-'+b.lots.length)),commodityId:input.commodityId,quantity:q,unitCost:Math.max(0,Number(input.unitCost)||0),receivedDay:Number(input.day??state.day)||0,ageDays:0,ageKnown:true,form:input.form||p.form,storageType:input.storageType||'ambient',temperatureC:finite(input.temperatureC)?Number(input.temperatureC):30,relativeHumidityPct:finite(input.relativeHumidityPct)?Number(input.relativeHumidityPct):80,moisturePct:finite(input.moisturePct)?Number(input.moisturePct):null,quality:100,physicalDamage:input.physicalDamage===true};
 b.lots.push(lot);return {ok:true,lot};
}
function consumeLots(state,id,qty){
 const b=ensureLotBook(state);if(!b.ok||!finite(qty)||Number(qty)<=0)return {ok:false,reason:'invalid_consumption'};
 let rem=Number(qty);const used=[];const lots=b.lots.filter(l=>l.commodityId===id).sort((a,c)=>a.receivedDay-c.receivedDay);
 for(const l of lots){if(rem<=1e-9)break;const n=Math.min(Math.max(0,Number(l.quantity)||0),rem);if(!n)continue;l.quantity-=n;rem-=n;used.push({lotId:l.id,quantity:n});}
 if(rem>1e-6)return {ok:false,reason:'lot_quantity_shortfall',remaining:rem};
 b.lots=b.lots.filter(l=>l.quantity>1e-9);return {ok:true,consumed:used};
}
function tickLots(state,day,environment){
 const b=ensureLotBook(state);if(!b.ok)return b;const env=environment||{},results=[];
 b.lots.forEach(l=>{if(!l.ageKnown){results.push({lotId:l.id,skipped:true,reason:'legacy_age_unknown'});return;}l.ageDays=Math.max(0,Number(day)-Number(l.receivedDay));if(finite(env.temperatureC))l.temperatureC=Number(env.temperatureC);if(finite(env.relativeHumidityPct))l.relativeHumidityPct=Number(env.relativeHumidityPct);const a=assessLot({...l,ageDays:l.ageDays});l.quality=a.quality??100;l.assessment=a;results.push({lotId:l.id,commodityId:l.commodityId,quantity:l.quantity,...a});});
 return {ok:true,results,lots:b.lots};
}
function setLotConditions(state,id,conditions){
 const b=ensureLotBook(state);if(!b.ok)return b;const l=b.lots.find(x=>x.id===id);if(!l)return {ok:false,reason:'lot_not_found'};
 ['form','storageType','temperatureC','relativeHumidityPct','moisturePct','physicalDamage','opened','flooded','driedAfterFlood','daysSinceFlood','moldObserved','rottingObserved','pestObserved'].forEach(k=>{if(Object.prototype.hasOwnProperty.call(conditions||{},k))l[k]=conditions[k];});
 return {ok:true,lot:l,assessment:assessLot({...l,ageDays:l.ageDays})};
}
root.AgroCommodityStorage=Object.freeze({profiles:Object.freeze(PROFILES),catalogIds:Object.freeze(Object.keys(PROFILES)),profileFor,assessLot,ensureLotBook,receiveLot,consumeLots,tickLots,setLotConditions});
})(typeof window!=='undefined'?window:globalThis);
