const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const context=vm.createContext({console});context.window=context;
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js','commodity_storage.js'),'utf8'),context);
const storage=context.AgroCommodityStorage,assess=lot=>storage.assessLot(lot);

test('all 60 catalog commodities have an explicit storage or live-stock profile',()=>{
 assert.equal(storage.catalogIds.length,60);
 for(const id of storage.catalogIds)assert.ok(storage.profiles[id],id+' missing profile');
});

test('every actual COMMODITIES catalog ID has a matching storage profile',()=>{
 vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js','commodities.js'),'utf8'),context);
 const ids=vm.runInContext('COMMODITIES.map(c=>c.id)',context);
 assert.equal(ids.length,60);
 for(const id of ids)assert.ok(storage.profiles[id],'missing profile for '+id);
});

test('dry paddy and dry maize do not expire on a daily tick',()=>{
 for(const commodityId of ['padi','jagung']){
  const r=assess({commodityId,ageDays:1,moisturePct:12,temperatureC:28,relativeHumidityPct:65});
  assert.notEqual(r.risk,'expired');assert.equal(r.expired,false);
 }
});

test('flood-wet grain reaches critical risk after three days but is not forcibly written off',()=>{
 const day1=assess({commodityId:'padi',ageDays:1,moisturePct:22,temperatureC:30,flooded:true,daysSinceFlood:1,driedAfterFlood:false});
 const day3=assess({commodityId:'padi',ageDays:3,moisturePct:22,temperatureC:30,flooded:true,daysSinceFlood:3,driedAfterFlood:false});
 assert.ok(['normal','watch','high','critical'].includes(day1.risk));
 assert.equal(day3.risk,'critical');assert.equal(day3.expired,false);assert.equal(day3.automaticExpiry,false);
});

test('whole mature coconut has long storage life while opened flesh deteriorates much faster',()=>{
 const whole=assess({commodityId:'kelapa',form:'mature_husked',ageDays:30,temperatureC:27,relativeHumidityPct:70});
 const opened=assess({commodityId:'kelapa',form:'opened',opened:true,ageDays:1,temperatureC:30,relativeHumidityPct:80});
 assert.equal(whole.expired,false);assert.ok(whole.shelfLifeDays>=120);
 assert.ok(['high','critical','expired','spoiled'].includes(opened.risk));
});

test('ice melts after one ambient day but remains stable in freezer',()=>{
 const ambient=assess({commodityId:'es_batu',ageDays:1,temperatureC:30,storageType:'ambient'});
 const freezer=assess({commodityId:'es_batu',ageDays:1,temperatureC:-18,storageType:'freezer'});
 assert.equal(ambient.expired,true);assert.equal(ambient.mechanism,'melting_not_biological_spoilage');
 assert.equal(freezer.expired,false);
});

test('raw poultry, beef cuts and fish use distinct chilled handling guidance',()=>{
 const poultry=assess({commodityId:'ayam_pedaging',form:'raw_meat',ageDays:2,temperatureC:4,storageType:'refrigerated'});
 const beef=assess({commodityId:'sapi_potong',form:'raw_beef_cut',ageDays:4,temperatureC:4,storageType:'refrigerated'});
 const fish=assess({commodityId:'lele',form:'raw_fish',ageDays:1,temperatureC:0,storageType:'refrigerated'});
 assert.equal(poultry.shelfLifeDays,2);assert.equal(beef.shelfLifeDays,5);assert.equal(fish.shelfLifeDays,2);
});

test('live animals and live fish do not receive meat or fish expiry timers',()=>{
 for(const commodityId of ['ayam_pedaging','sapi_potong','lele','nila']){
  const r=assess({commodityId,ageDays:365,temperatureC:30});
  assert.equal(r.expired,false);assert.equal(r.calibrationStatus,'live_health_model_required');
 }
});

test('temperature and humidity affect effective age',()=>{
 const cool=assess({commodityId:'tomat',ageDays:3,temperatureC:12.5,relativeHumidityPct:90});
 const hot=assess({commodityId:'tomat',ageDays:3,temperatureC:32,relativeHumidityPct:95});
 assert.ok(hot.effectiveAgeDays>cool.effectiveAgeDays);
});

test('opened coconut or physically damaged produce degrades faster',()=>{
 const intact=assess({commodityId:'mangga',ageDays:2,temperatureC:25,relativeHumidityPct:85});
 const damaged=assess({commodityId:'mangga',ageDays:2,temperatureC:25,relativeHumidityPct:85,physicalDamage:true});
 assert.ok(damaged.effectiveAgeDays>intact.effectiveAgeDays);
});

test('legacy aggregate stock is preserved with unknown age rather than falsely dated',()=>{
 const state={day:50,landSystem:{inventory:{padi:10},inventoryCost:{padi:100}}};
 const b=storage.ensureLotBook(state);
 assert.equal(b.lots.length,1);assert.equal(b.lots[0].ageKnown,false);
 const tick=storage.tickLots(state,51,{temperatureC:35,relativeHumidityPct:95});
 assert.equal(tick.results[0].skipped,true);assert.equal(b.lots[0].quantity,10);
});

test('new harvest lots age daily and FIFO consumption removes oldest quantity first',()=>{
 const state={day:1,landSystem:{inventory:{},inventoryCost:{}}};
 storage.receiveLot(state,{commodityId:'tomat',quantity:5,unitCost:100,day:1});
 storage.receiveLot(state,{commodityId:'tomat',quantity:7,unitCost:120,day:2});
 const tick=storage.tickLots(state,3,{temperatureC:30,relativeHumidityPct:85});
 assert.equal(tick.lots[0].ageDays,2);
 const used=storage.consumeLots(state,'tomat',6);
 assert.equal(used.ok,true);assert.equal(used.consumed[0].quantity,5);assert.equal(used.consumed[1].quantity,1);
 assert.equal(state.landSystem.storageLots[0].quantity,6);
});

test('unknown commodity IDs never receive invented expiry rules',()=>{
 const r=assess({commodityId:'unknown',ageDays:999});
 assert.equal(r.risk,'unclassified');assert.equal(r.expired,false);
});

test('observed mold or rot confirms spoilage',()=>{
 const r=assess({commodityId:'padi',ageDays:1,moisturePct:12,moldObserved:true});
 assert.equal(r.risk,'spoiled');assert.equal(r.spoilageConfirmed,true);
});
