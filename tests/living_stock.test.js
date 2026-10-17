// Run with: node tests/living_stock.test.js
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"..","js","day.js"),"utf8");
const S={livingStock:{rice:2},day:1};
const DATA={living:{rice:{period:10},egg:{period:5},oil:{period:30},mie:{period:3},tempe:{period:2},sayur:{period:1},lauk:{period:2},electric:{price:8333}}};
const context={S,DATA};vm.createContext(context);vm.runInContext(source,context,{filename:"js/day.js"});
for(let i=0;i<9;i++)context.consumeLivingStockForDay();
assert.equal(S.livingStock.rice,2,"legacy stock remains before period");
context.consumeLivingStockForDay();assert.equal(S.livingStock.rice,1,"rice consumes after 10 use-days");assert.equal(S.livingUseDays.rice,0);
for(let i=0;i<10;i++)context.consumeLivingStockForDay();assert.equal(S.livingStock.rice,0,"second rice package consumes after another period");
S.livingStock.egg=0;for(let i=0;i<12;i++)context.consumeLivingStockForDay();assert.equal(S.livingStock.egg,0);assert.equal(S.livingUseDays.egg,0);
S.livingStock.egg=1;S.livingUseDays.egg=0;for(let i=0;i<4;i++)context.consumeLivingStockForDay();assert.equal(S.livingStock.egg,1);context.consumeLivingStockForDay();assert.equal(S.livingStock.egg,0);
S.livingStock.sayur=1;context.consumeLivingStockForDay();assert.equal(S.livingStock.sayur,0);assert.equal(S.livingStock.electric,undefined);
S.livingStock.tempe=-4;context.consumeLivingStockForDay();assert.equal(S.livingStock.tempe,0);assert.ok(Object.values(S.livingUseDays).every(v=>Number.isFinite(v)&&v>=0));
console.log("PASS: legacy stock preservation, period consumption, empty stock, utility exclusion.");
