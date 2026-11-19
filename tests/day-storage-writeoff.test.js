const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync(require.resolve('../js/day.js'),'utf8');

function loadHelper(recordResult){
 const events=[];
 const sandbox={
  console,
  recordBusinessCogs:(desc,components)=>{
   events.push({desc,components});
   return recordResult===undefined
    ? components.reduce((sum,x)=>sum+Number(x.amount),0)
    : recordResult;
  },
  ledger:(...args)=>events.push({ledger:args})
 };
 vm.runInNewContext(source,sandbox,{filename:'js/day.js'});
 return {writeOff:sandbox.writeOffExpiredStorageLot,finishedWriteOff:sandbox.writeOffExpiredFinishedGoodsLot,runBatch:sandbox.runDayEndWriteoffTransaction,events};
}

test('daily storage write-off values each expired lot from its own unit cost',()=>{
 const {writeOff,events}=loadHelper();
 const state={day:20,landSystem:{inventory:{tomat:5},inventoryCost:{tomat:1100}}};
 const oldLot={id:'old',commodityId:'tomat',quantity:2,unitCost:100};
 const result=writeOff(state,{risk:'expired'},oldLot);
 assert.equal(result.ok,true);
 assert.equal(result.quantity,2);
 assert.equal(result.value,200);
 assert.equal(state.landSystem.inventory.tomat,3);
 assert.equal(state.landSystem.inventoryCost.tomat,900);
 assert.equal(oldLot.quantity,0);
 assert.equal(oldLot.writeoffDay,20);
 assert.equal(events.length,1);
 assert.equal(events[0].components[0].amount,200);
});

test('multiple expired lots preserve remaining inventory cost after each lot write-off',()=>{
 const {writeOff,events}=loadHelper();
 const state={day:30,landSystem:{inventory:{padi:7},inventoryCost:{padi:1700}}};
 const lotA={id:'a',commodityId:'padi',quantity:2,unitCost:100};
 const lotB={id:'b',commodityId:'padi',quantity:3,unitCost:500};
 const first=writeOff(state,{risk:'expired'},lotA);
 const second=writeOff(state,{risk:'expired'},lotB);
 assert.deepEqual([first.value,second.value],[200,1500]);
 assert.equal(state.landSystem.inventory.padi,2);
 assert.equal(state.landSystem.inventoryCost.padi,0);
 assert.equal(lotA.quantity,0);assert.equal(lotB.quantity,0);
 assert.deepEqual(events.map(e=>e.components[0].amount),[200,1500]);
});

test('write-off falls back to aggregate average cost only when lot unit cost is unavailable',()=>{
 const {writeOff}=loadHelper();
 const state={day:40,landSystem:{inventory:{jagung:4},inventoryCost:{jagung:800}}};
 const lot={id:'legacy',commodityId:'jagung',quantity:2};
 const result=writeOff(state,{risk:'expired'},lot);
 assert.equal(result.value,400);
 assert.equal(state.landSystem.inventory.jagung,2);
 assert.equal(state.landSystem.inventoryCost.jagung,400);
});

test('finished-goods write-off uses the expired lot unit cost and preserves remaining lot value',()=>{
 const {finishedWriteOff}=loadHelper();
 const state={day:10,landSystem:{finishedInventory:{jagung_bakar:5},finishedInventoryCost:{jagung_bakar:1100}}};
 const lot={id:'fg-old',commodityId:'jagung_bakar',quantity:2,unitCost:100,writeoffReason:'expired'};
 const result=finishedWriteOff(state,lot);
 assert.equal(result.ok,true);
 assert.equal(result.quantity,2);
 assert.equal(result.value,200);
 assert.equal(state.landSystem.finishedInventory.jagung_bakar,3);
 assert.equal(state.landSystem.finishedInventoryCost.jagung_bakar,900);
 assert.equal(lot.quantity,0);
});


test('finished-goods write-off leaves inventory untouched when HPP loss posting fails',()=>{
 const {finishedWriteOff,events}=loadHelper(0);
 const state={day:11,landSystem:{finishedInventory:{jagung_bakar:5},finishedInventoryCost:{jagung_bakar:1100}}};
 const lot={id:'fg-fail',commodityId:'jagung_bakar',quantity:2,unitCost:100,writeoffReason:'expired'};
 const result=finishedWriteOff(state,lot);
 assert.equal(result.ok,false);
 assert.equal(result.reason,'finished_writeoff_cogs_post_failed');
 assert.equal(state.landSystem.finishedInventory.jagung_bakar,5);
 assert.equal(state.landSystem.finishedInventoryCost.jagung_bakar,1100);
 assert.equal(lot.quantity,2);
 assert.equal(lot.writeoffDay,undefined);
 assert.equal(events.length,1);
});


test('day-end write-off batch rolls back earlier lots when a later lot posting fails',()=>{
 const {writeOff,runBatch}=loadHelper();
 const state={day:50,dayLog:{storageWriteoffs:[]},landSystem:{inventory:{padi:7},inventoryCost:{padi:1700},storageLots:[
  {id:'a',commodityId:'padi',quantity:2,unitCost:100},
  {id:'b',commodityId:'padi',quantity:3,unitCost:500}
 ]}};
 const originalDayLog=state.dayLog;
 const result=runBatch(state,()=>{
  const first=writeOff(state,{risk:'expired'},state.landSystem.storageLots[0]);
  if(!first.ok)return first;
  state.dayLog.storageWriteoffs.push({lotId:first.lotId,value:first.value});
  return writeOff(state,{risk:'expired'},state.landSystem.storageLots[1]);
 });
 assert.equal(result.ok,false);
 assert.equal(result.reason,'finished_writeoff_cogs_post_failed');
 assert.equal(state.landSystem.inventory.padi,7);
 assert.equal(state.landSystem.inventoryCost.padi,1700);
 assert.deepEqual(state.landSystem.storageLots.map(x=>[x.quantity,x.writeoffDay]),[[2,undefined],[3,undefined]]);
 assert.deepEqual(state.dayLog.storageWriteoffs,[]);
 assert.equal(state.dayLog,originalDayLog);
});

test('day-end write-off batch commits all lot changes when every posting succeeds',()=>{
 const {writeOff,runBatch}=loadHelper();
 const state={day:51,dayLog:{storageWriteoffs:[]},landSystem:{inventory:{padi:7},inventoryCost:{padi:1700},storageLots:[
  {id:'a',commodityId:'padi',quantity:2,unitCost:100},
  {id:'b',commodityId:'padi',quantity:3,unitCost:500}
 ]}};
 const result=runBatch(state,()=>{
  for(const lot of state.landSystem.storageLots){
   const posted=writeOff(state,{risk:'expired'},lot);
   if(!posted.ok)return posted;
   state.dayLog.storageWriteoffs.push({lotId:posted.lotId,value:posted.value});
  }
  return {ok:true};
 });
 assert.equal(result.ok,true);
 assert.equal(state.landSystem.inventory.padi,2);
 assert.equal(state.landSystem.inventoryCost.padi,0);
 assert.deepEqual(state.dayLog.storageWriteoffs.map(x=>x.value),[200,1500]);
});


test('day-end spoilage batch restores ice, whole coconut, opened coconut and stats when any HPP posting fails',()=>{
 const {runBatch}=loadHelper();
 const state={
  day:60,
  dayLog:{lossIcePortions:0,lossIceValue:0,lossRot:0,storageWriteoffs:[]},
  warung:{fridge:false,ice:8,iceCost:4000},
  stats:{rotten:2},
  stock:{biasa:3,super:1},
  stockCostValue:14000,
  quarterUsed:2,
  quarterCost:3500,
  quarterOpenedDay:59,
  landSystem:{inventory:{},inventoryCost:{},storageLots:[]}
 };
 const originalDayLog=state.dayLog;
 const result=runBatch(state,()=>{
  state.warung.ice=0;state.warung.iceCost=0;
  state.dayLog.lossIcePortions=8;state.dayLog.lossIceValue=4000;
  state.stats.rotten+=4;state.stock={biasa:0,super:0};state.stockCostValue=0;
  state.quarterUsed=0;state.quarterCost=0;state.quarterOpenedDay=null;
  return {ok:false,reason:'rotten_coconut_writeoff_cogs_post_failed'};
 });
 assert.equal(result.ok,false);
 assert.equal(state.warung.ice,8);assert.equal(state.warung.iceCost,4000);
 assert.deepEqual(state.stock,{biasa:3,super:1});
 assert.equal(state.stockCostValue,14000);
 assert.equal(state.quarterUsed,2);assert.equal(state.quarterCost,3500);
 assert.equal(state.quarterOpenedDay,59);
 assert.equal(state.stats.rotten,2);
 assert.equal(state.dayLog.lossIcePortions,0);
 assert.equal(state.dayLog,originalDayLog);
});
