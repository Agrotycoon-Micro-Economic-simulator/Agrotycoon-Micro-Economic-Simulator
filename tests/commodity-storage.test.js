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

test('market-unit registry exposes only verified physical references and preserves legacy quantity status',()=>{
 const registry=vm.runInContext('MARKET_UNIT_REGISTRY',context);
 assert.equal(Object.keys(registry).length,58);
 for(const id of Object.keys(registry)){
  assert.ok(registry[id].unit,id+' missing unit');
  assert.ok(registry[id].productForm,id+' missing product form');
 }
 for(const id of ['lele','nila','gurami','patin']){
  assert.equal(registry[id].unit,'kg');
  assert.equal(registry[id].status,'official_producer_price_unit_stage_locked');
 }
 assert.equal(registry.bayam.unit,'kg');
 assert.equal(registry.udang_vaname.unit,'kg');
 assert.equal(registry.udang_vaname.status,'official_aquaculture_production_value_unit');
 assert.equal(registry.jamur_tiram.unit,'kg');
 assert.equal(registry.jamur_tiram.status,'government_extension_farmer_sale_reference');
 assert.equal(registry.sawi.unit,'kg');
 assert.equal(registry.stroberi,undefined);
 assert.equal(registry.kapas,undefined);
 assert.equal(registry.madu.unit,'kg');
 assert.equal(registry.madu.status,'official_forest_honey_producer_unit_scope_limited');
 assert.equal(registry.sapi_perah.unit,'ekor');
 assert.equal(registry.sapi_perah.productForm,'sapi perah hidup; reference weight 250 kg per head');
 assert.equal(registry.domba.unit,'ekor');
 assert.equal(registry.domba.productForm,'domba hidup; reference weight 30 kg per head');
 assert.equal(registry.melon.unit,'100 kg');
 assert.equal(registry.jahe.unit,'50 kg');
 assert.equal(registry.kunyit.unit,'50 kg');
 assert.equal(registry.lengkuas.unit,'50 kg');
 assert.equal(registry.serai.unit,'ikat');
 assert.equal(registry.nanas.unit,'10 kg');
 assert.equal(registry.durian.unit,'10 kg');
 for(const id of ['tebu','teh','tembakau','vanili'])assert.equal(registry[id].unit,'kg');
 assert.equal(registry.teh.productForm,'pucuk teh basah pada tahap produsen; teh hijau kering merupakan produk olahan terpisah');
 assert.equal(registry.tembakau.productForm,'daun tembakau kering; rajangan kering dicatat sebagai produk olahan berbeda');
 assert.equal(registry.vanili.productForm,'polong vanili kering');
 assert.equal(registry.alpukat.unit,'kg');
 assert.equal(registry.alpukat.status,'official_producer_price_unit_provincial_reference');
 const quantityStatuses=vm.runInContext('COMMODITIES.map(c=>c.quantityScaleStatus)',context);
 assert.equal(quantityStatuses.length,60);
 assert.ok(quantityStatuses.every(s=>s==='unconverted_legacy_simulation_index'));
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

test('expired or spoiled lots are never eligible for FIFO consumption',()=>{
 const state={day:10,landSystem:{inventory:{tomat:7},inventoryCost:{tomat:700},storageLots:[
  {id:'expired',commodityId:'tomat',quantity:3,unitCost:100,receivedDay:1,ageDays:9,ageKnown:true,form:'whole_fresh',storageType:'ambient',temperatureC:30,relativeHumidityPct:85,quantityUnit:'unconverted_simulation_market_units',quantityCalibrationStatus:'legacy_index_to_physical_unit_conversion_pending',quantityScaleStatus:'unconverted_legacy_simulation_index'},
  {id:'fresh',commodityId:'tomat',quantity:4,unitCost:100,receivedDay:10,ageDays:0,ageKnown:true,form:'whole_fresh',storageType:'ambient',temperatureC:30,relativeHumidityPct:85,quantityUnit:'unconverted_simulation_market_units',quantityCalibrationStatus:'legacy_index_to_physical_unit_conversion_pending',quantityScaleStatus:'unconverted_legacy_simulation_index'}
 ]}};
 const plan=storage.planLotConsumption(state,'tomat',4);
 assert.equal(plan.ok,true);
 assert.equal(plan.available,4);
 assert.equal(plan.unusable,3);
 assert.deepEqual(Array.from(plan.unusableLots, x=>x.lotId),['expired']);
 assert.deepEqual(Array.from(plan.used, x=>x.lot.id),['fresh']);
 assert.deepEqual(state.landSystem.storageLots.map(x=>x.quantity),[3,4]);
});

test('spoilage shortfall blocks consumption without mutating lots',()=>{
 const state={day:10,landSystem:{inventory:{tomat:4},inventoryCost:{tomat:400},storageLots:[
  {id:'expired',commodityId:'tomat',quantity:4,unitCost:100,receivedDay:1,ageDays:9,ageKnown:true,form:'whole_fresh',storageType:'ambient',temperatureC:30,relativeHumidityPct:85,quantityUnit:'unconverted_simulation_market_units',quantityCalibrationStatus:'legacy_index_to_physical_unit_conversion_pending',quantityScaleStatus:'unconverted_legacy_simulation_index'}
 ]}};
 const before=JSON.stringify(state.landSystem.storageLots);
 const plan=storage.planLotConsumption(state,'tomat',1);
 assert.equal(plan.ok,false);
 assert.equal(plan.reason,'lot_quantity_unavailable_due_to_spoilage');
 assert.equal(plan.unusable,4);
 assert.equal(plan.available,0);
 assert.equal(JSON.stringify(state.landSystem.storageLots),before);
});

test('unknown commodity IDs never receive invented expiry rules',()=>{
 const r=assess({commodityId:'unknown',ageDays:999});
 assert.equal(r.risk,'unclassified');assert.equal(r.expired,false);
});

test('observed mold or rot confirms spoilage',()=>{
 const r=assess({commodityId:'padi',ageDays:1,moisturePct:12,moldObserved:true});
 assert.equal(r.risk,'spoiled');assert.equal(r.spoilageConfirmed,true);
});


test('all 60 commodities expose separate source, transaction and inventory quantity layers without guessed conversion',()=>{
 const units=vm.runInContext('AgroCommodityUnits',context);
 const contracts=units.quantityContracts;
 assert.equal(units.version,'0.2.0');
 assert.equal(Object.keys(contracts).length,60);
 for(const id of storage.catalogIds){
  const c=contracts[id];
  assert.ok(c,id+' missing quantity contract');
  assert.equal(c.inventoryBaseUnit,'legacy_simulation_index');
  assert.equal(c.physicalInventoryBaseUnit,null);
  assert.equal(c.conversionFactor,null);
  assert.equal(c.conversionStatus,'pending_verified_factor_and_product_form');
  assert.equal(c.conversionTest,'blocked_no_verified_conversion_fixture');
  assert.equal(c.quantityScaleStatus,'unconverted_legacy_simulation_index');
  assert.equal(units.canConvertQuantity(id),false);
 }
 assert.equal(contracts.melon.sourceUnit,'100 kg');
 assert.equal(contracts.melon.transactionUnit,'100 kg');
 assert.equal(contracts.jahe.transactionUnit,'50 kg');
 assert.equal(contracts.serai.transactionUnit,'ikat');
 assert.equal(contracts.nanas.transactionUnit,'10 kg');
 assert.equal(contracts.kelapa.transactionUnit,'buah');
 assert.equal(contracts.stroberi.sourceUnit,null);
 assert.equal(contracts.kapas.sourceUnit,null);
 assert.equal(contracts.stroberi.sourceUnitStatus,'butuh_riset_lanjutan');
 assert.equal(contracts.kapas.sourceUnitStatus,'butuh_riset_lanjutan');
});

test('storage receipts and FIFO consumption remain on legacy index until conversion is verified',()=>{
 const state={day:1,landSystem:{inventory:{},inventoryCost:{}}};
 const blocked=storage.receiveLot(state,{commodityId:'tomat',quantity:2,quantityUnit:'kg',unitCost:100});
 assert.equal(blocked.ok,false);
 assert.equal(blocked.reason,'quantity_contract_not_enabled');
 const accepted=storage.receiveLot(state,{commodityId:'tomat',quantity:5,unitCost:100});
 assert.equal(accepted.ok,true);
 assert.equal(accepted.lot.quantityUnit,'unconverted_simulation_market_units');
 assert.equal(accepted.lot.quantityScaleStatus,'unconverted_legacy_simulation_index');
 const mismatch={id:'physical-lot',commodityId:'tomat',quantity:3,receivedDay:2,quantityUnit:'kg',quantityCalibrationStatus:'verified',quantityScaleStatus:'physical_kg'};
 state.landSystem.storageLots.push(mismatch);
 const consumed=storage.consumeLots(state,'tomat',1);
 assert.equal(consumed.ok,false);
 assert.equal(consumed.reason,'quantity_contract_mismatch');
 assert.equal(state.landSystem.storageLots[0].quantity,5);
});

test('consumeLots also preserves atomicity when all eligible stock is spoiled',()=>{
 const state={day:10,landSystem:{inventory:{tomat:2},inventoryCost:{tomat:400},storageLots:[
  {id:'moldy',commodityId:'tomat',quantity:2,unitCost:200,receivedDay:10,ageDays:0,ageKnown:true,form:'whole_fresh',storageType:'ambient',temperatureC:30,relativeHumidityPct:85,moldObserved:true,quantityUnit:'unconverted_simulation_market_units',quantityCalibrationStatus:'legacy_index_to_physical_unit_conversion_pending',quantityScaleStatus:'unconverted_legacy_simulation_index'}
 ]}};
 const before=JSON.stringify(state.landSystem.storageLots);
 const result=storage.consumeLots(state,'tomat',1);
 assert.equal(result.ok,false);
 assert.equal(result.reason,'lot_quantity_unavailable_due_to_spoilage');
 assert.equal(JSON.stringify(state.landSystem.storageLots),before);
 assert.equal(state.landSystem.inventory.tomat,2);
 assert.equal(state.landSystem.inventoryCost.tomat,400);
});

test('legacy storage lots receive only the explicit legacy quantity contract during migration',()=>{
 const state={day:10,landSystem:{inventory:{},inventoryCost:{},storageLots:[{id:'old-lot',commodityId:'padi',quantity:8,receivedDay:9}]}};
 const book=storage.ensureLotBook(state);
 assert.equal(book.lots[0].quantityUnit,'unconverted_simulation_market_units');
 assert.equal(book.lots[0].quantityCalibrationStatus,'legacy_index_to_physical_unit_conversion_pending');
 assert.equal(book.lots[0].quantityScaleStatus,'unconverted_legacy_simulation_index');
});


test('storage consumption preflight is non-mutating and shortfall is atomic', () => {
  const state = { day: 1, landSystem: { inventory: { padi: 5 }, inventoryCost: { padi: 500 }, storageLots: [
    { id: 'a', commodityId: 'padi', quantity: 2, unitCost: 100, receivedDay: 1, quantityUnit: 'unconverted_simulation_market_units', quantityCalibrationStatus: 'legacy_index_to_physical_unit_conversion_pending', quantityScaleStatus: 'unconverted_legacy_simulation_index' },
    { id: 'b', commodityId: 'padi', quantity: 3, unitCost: 100, receivedDay: 1, quantityUnit: 'unconverted_simulation_market_units', quantityCalibrationStatus: 'legacy_index_to_physical_unit_conversion_pending', quantityScaleStatus: 'unconverted_legacy_simulation_index' }
  ]}};
  const before = state.landSystem.storageLots.map(l => l.quantity);
  const plan = storage.planLotConsumption(state, 'padi', 6);
  assert.equal(plan.ok, false);
  assert.equal(plan.reason, 'lot_quantity_shortfall');
  assert.deepEqual(state.landSystem.storageLots.map(l => l.quantity), before);

  const okPlan = storage.planLotConsumption(state, 'padi', 4);
  assert.equal(okPlan.ok, true);
  assert.equal(okPlan.available, 5);
  assert.deepEqual(state.landSystem.storageLots.map(l => l.quantity), before);
  const result = storage.consumeLots(state, 'padi', 4);
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(JSON.stringify(result.consumed)), [{ lotId: 'a', quantity: 2 }, { lotId: 'b', quantity: 2 }]);
  assert.deepEqual(state.landSystem.storageLots.map(l => l.quantity), [1]);
});


test('FIFO lot valuation drives HPP from actual lot unit costs, not aggregate weighted average',()=>{
 const state={day:10,landSystem:{inventory:{tomat:5},inventoryCost:{tomat:1100},storageLots:[
  {id:'cheap',commodityId:'tomat',quantity:2,unitCost:100,receivedDay:1,ageDays:1,ageKnown:true,form:'whole_fresh',storageType:'ambient',temperatureC:20,relativeHumidityPct:85,quantityUnit:'unconverted_simulation_market_units',quantityCalibrationStatus:'legacy_index_to_physical_unit_conversion_pending',quantityScaleStatus:'unconverted_legacy_simulation_index'},
  {id:'expensive',commodityId:'tomat',quantity:3,unitCost:300,receivedDay:2,ageDays:1,ageKnown:true,form:'whole_fresh',storageType:'ambient',temperatureC:20,relativeHumidityPct:85,quantityUnit:'unconverted_simulation_market_units',quantityCalibrationStatus:'legacy_index_to_physical_unit_conversion_pending',quantityScaleStatus:'unconverted_legacy_simulation_index'}
 ]}};
 const plan=storage.planLotConsumption(state,'tomat',2);
 assert.equal(plan.ok,true);
 assert.equal(plan.consumedCost,200);
 assert.equal(plan.remainingCostValue,900);
 assert.deepEqual(Array.from(plan.used, x=>[x.lot.id,x.quantity,x.unitCost]),[['cheap',2,100]]);
});

test('FIFO HPP after an expired lot write-off remains tied to the surviving lot cost',()=>{
 const state={day:10,landSystem:{inventory:{tomat:3},inventoryCost:{tomat:900},storageLots:[
  {id:'expired',commodityId:'tomat',quantity:2,unitCost:100,receivedDay:1,ageDays:9,ageKnown:true,form:'whole_fresh',storageType:'ambient',temperatureC:30,relativeHumidityPct:85,quantityUnit:'unconverted_simulation_market_units',quantityCalibrationStatus:'legacy_index_to_physical_unit_conversion_pending',quantityScaleStatus:'unconverted_legacy_simulation_index'},
  {id:'survivor',commodityId:'tomat',quantity:3,unitCost:300,receivedDay:10,ageDays:0,ageKnown:true,form:'whole_fresh',storageType:'ambient',temperatureC:20,relativeHumidityPct:85,quantityUnit:'unconverted_simulation_market_units',quantityCalibrationStatus:'legacy_index_to_physical_unit_conversion_pending',quantityScaleStatus:'unconverted_legacy_simulation_index'}
 ]}};
 const plan=storage.planLotConsumption(state,'tomat',2);
 assert.equal(plan.ok,true);
 assert.equal(plan.consumedCost,600);
 assert.equal(plan.remainingCostValue,300);
 assert.deepEqual(Array.from(plan.used, x=>x.lot.id),['survivor']);
});
