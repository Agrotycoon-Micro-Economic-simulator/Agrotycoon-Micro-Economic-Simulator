const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const context=vm.createContext({console});
context.window=context;
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js','commodity_storage.js'),'utf8'),context);
const assess=lot=>context.AgroCommodityStorage.assessLot(lot);

test('dry paddy is not automatically expired merely because a day elapsed',()=>{
 const result=assess({commodityId:'padi',ageDays:1,moisturePct:14,temperatureC:28,relativeHumidityPct:70});
 assert.equal(result.risk,'normal');
 assert.equal(result.spoilageConfirmed,false);
 assert.equal(result.automaticExpiry,false);
});

test('wet flood-exposed paddy escalates by exposure duration and is not universally expired at day three',()=>{
 const day1=assess({commodityId:'padi',ageDays:1,moisturePct:22,temperatureC:30,flooded:true,daysSinceFlood:1,driedAfterFlood:false});
 const day3=assess({commodityId:'padi',ageDays:3,moisturePct:22,temperatureC:30,flooded:true,daysSinceFlood:3,driedAfterFlood:false});
 assert.equal(day1.risk,'critical');
 assert.equal(day3.risk,'critical');
 assert.equal(day3.spoilageConfirmed,false);
 assert.equal(day3.automaticExpiry,false);
 assert.ok(day3.reasons.includes('flood_wet_and_not_dried_for_3_or_more_days'));
});

test('dry maize does not receive daily spoilage and moisture above bands increases risk',()=>{
 const dry=assess({commodityId:'jagung',ageDays:30,moisturePct:12,temperatureC:27,relativeHumidityPct:70});
 const wet=assess({commodityId:'jagung',ageDays:1,moisturePct:19,temperatureC:30,relativeHumidityPct:90});
 assert.equal(dry.risk,'normal');
 assert.equal(dry.spoilageConfirmed,false);
 assert.equal(wet.risk,'critical');
});

test('coconut storage assessment distinguishes mature husked and young partially dehusked forms',()=>{
 const mature=assess({commodityId:'kelapa',form:'mature_husked',ageDays:30,temperatureC:27,relativeHumidityPct:80});
 const young=assess({commodityId:'kelapa',form:'young_partially_dehusked',ageDays:3,temperatureC:30,relativeHumidityPct:70});
 assert.equal(mature.risk,'normal');
 assert.equal(young.risk,'high');
 assert.equal(mature.automaticExpiry,false);
});

test('unknown commodity stays unclassified instead of receiving an invented expiry',()=>{
 const result=assess({commodityId:'unknown',ageDays:365});
 assert.equal(result.risk,'unclassified');
 assert.equal(result.calibrationStatus,'research_required');
 assert.equal(result.automaticExpiry,false);
});

test('observed mold or rot is the only direct spoilage confirmation in the assessment contract',()=>{
 const result=assess({commodityId:'padi',moisturePct:13,moldObserved:true});
 assert.equal(result.risk,'spoiled');
 assert.equal(result.spoilageConfirmed,true);
});
