function startSleep(){
 console.log('startSleep dipanggil');
 if(!el('warung-scene').classList.contains('hidden'))closeScene(true);
 const steps=['Merekap transaksi warung...','Belanja kebutuhan harian otomatis...','Memproses cuaca besok...','Memotong biaya hidup...','Menyusun laporan harian...'];
 const ov=el('progress');
 if(!ov){console.error('progress overlay tidak ada!');return;}
 ov.classList.remove('hidden');
 let i=0;
 el('bar-fill').style.width='0';
 const iv=setInterval(()=>{
  i++;
  el('bar-fill').style.width=(i*20)+'%';
  el('prog-text').textContent=steps[Math.min(i-1,steps.length-1)];
  if(i>=5){clearInterval(iv);setTimeout(finishDay,400);}
 },1000);
}

function consumeLivingStockForDay(){
 const keys=['rice','egg','oil','mie','tempe','sayur','lauk'];
 if(!S.livingStock||typeof S.livingStock!=='object')S.livingStock={};
 if(!S.livingUseDays||typeof S.livingUseDays!=='object')S.livingUseDays={};
 const consumed=[];
 keys.forEach(key=>{
  const item=DATA.living&&DATA.living[key];
  const period=Number(item&&item.period);
  const stock=Math.max(0,Math.floor(Number(S.livingStock[key])||0));
  S.livingStock[key]=stock;
  if(!Number.isFinite(period)||period<1){S.livingUseDays[key]=0;return;}
  if(stock<=0){S.livingUseDays[key]=0;return;}
  const elapsed=Math.max(0,Number(S.livingUseDays[key])||0)+1;
  if(elapsed>=period){S.livingStock[key]=stock-1;S.livingUseDays[key]=0;consumed.push(key);}
  else{S.livingStock[key]=stock;S.livingUseDays[key]=elapsed;}
 });
 return consumed;
}

function recordLivingStockConsumption(consumed){
 if(!Array.isArray(consumed)||!S.dayLog)return;
 consumed.forEach(key=>{
  const item=DATA.living&&DATA.living[key];
  const cost=Number(item&&item.price);
  if(!Number.isFinite(cost)||cost<=0)return;
  const lines=[
   {account:'Beban Dapur',debit:cost,credit:0},
   {account:'Persediaan Rumah Tangga',debit:0,credit:cost}
  ];
  ledger('KONSUMSI_RUMAH_TANGGA','Konsumsi '+item.name+' (1 paket)',-cost,{key,quantity:1,valuation:'current_configured_price'},{
   classification:'household_kitchen',
   debitAccount:'Beban Dapur',
   creditAccount:'Persediaan Rumah Tangga',
   debit:cost,
   credit:cost,
   basis:'noncash',
   lines
  });
  // Consumption is a household expense but not a second cash outflow.
  S.dayLog.expense=(Number(S.dayLog.expense)||0)+cost;
  S.dayLog.livingExpense=(Number(S.dayLog.livingExpense)||0)+cost;
 });
}

function finishDay(){
 console.log('finishDay dipanggil');
 const ov=el('progress');
 if(ov)ov.classList.add('hidden');
 const L=S.dayLog;
 if(!L){console.error('dayLog tidak ada');return;}
 
 // Es mencair jika tidak ada kulkas
 if(!S.warung.fridge&&S.warung.ice>0){
  L.lossIcePortions=S.warung.ice;
  L.lossIceValue=Number.isFinite(S.warung.iceCost)?Math.max(0,S.warung.iceCost):S.warung.ice/DATA.shop.iceKarung.portions*DATA.shop.iceKarung.price;
  if(L.lossIceValue>0&&typeof recordBusinessCogs==='function')recordBusinessCogs('Susut persediaan es mencair',[{account:'Persediaan Es (susut)',amount:L.lossIceValue}]);
  else ledger('RUGI','Es mencair '+S.warung.ice+' porsi (nilai '+rp(L.lossIceValue)+')',0);
  S.warung.ice=0;S.warung.iceCost=0;
 }else if(S.warung.fridge&&S.warung.ice>0){
  ledger('INFO','Es tersisa di kulkas: '+S.warung.ice+' porsi (aman)',0);
 }
 S.warung.operatedToday=false;
 
 // Konsumsi paket mengikuti periode daya pakai DATA.living.period.
 const consumedLiving=consumeLivingStockForDay();
 recordLivingStockConsumption(consumedLiving);
 // Restock otomatis hanya jika stok paket habis.
 const livingDetails=[];
 const autoBuy=[
  {key:'rice',check:()=>(S.livingStock.rice||0)<=0},
  {key:'egg',check:()=>(S.livingStock.egg||0)<=0},
  {key:'oil',check:()=>(S.livingStock.oil||0)<=0},
  {key:'mie',check:()=>(S.livingStock.mie||0)<=0},
  {key:'tempe',check:()=>(S.livingStock.tempe||0)<=0},
  {key:'sayur',check:()=>(S.livingStock.sayur||0)<=0},
  {key:'lauk',check:()=>(S.livingStock.lauk||0)<=0}
 ];
 autoBuy.forEach(ab=>{
  const item=DATA.living[ab.key];
  if(!item)return;
  if(ab.check()){
   spend('HIDUP','Beli '+item.name+' (otomatis)',item.price,'living');
   livingDetails.push({item:item.name,amt:item.price});
   if(!S.livingStock)S.livingStock={};
   const oldStock=Math.max(0,Number(S.livingStock[ab.key])||0);
   S.livingStock[ab.key]=oldStock+1;
   if(oldStock===0){if(!S.livingUseDays)S.livingUseDays={};S.livingUseDays[ab.key]=0;}
  }
 });
 ['electric','pulsa','bensin','mandi'].forEach(k=>{
  const item=DATA.living[k];
  if(item){
   spend('HIDUP',item.name,item.price,'living');
   livingDetails.push({item:item.name,amt:item.price});
  }
 });
 L.dailyExpenses=livingDetails;
 
 if(typeof tickAgricultureDay==='function')tickAgricultureDay();
 // Payroll is processed once per in-game day; unpaid wages remain a recorded liability.
 if(typeof AgroStaff!=="undefined"){
  const payroll=AgroStaff.payroll();
  if(payroll.count)ledger("SDM","Rekap payroll "+payroll.count+" karyawan",0,{paid:payroll.paid,unpaid:payroll.unpaid});
 }
 if(typeof AgroFinance!=="undefined")AgroFinance.accrueDay();
 // Advance the seeded regional simulation and the data-only NPC market before incrementing the clock.
 if(typeof AgroWorldSim!=='undefined'){
  const worldEvents=AgroWorldSim.updateDay(S.day);
  worldEvents.forEach(ev=>ledger('DUNIA_SIMULASI',ev.headline+' — '+ev.region,0,{type:ev.type,classification:ev.classification,affected:ev.affected}));
 }
 if(typeof AgroNationalEconomy!=='undefined'){
  // Aggregate 200m residents by province; no per-resident objects are created.
  const nationalTick=AgroNationalEconomy.updateDay(S.day);
  if(nationalTick&&S.day%30===1){
   ledger('KEBIJAKAN_NEGARA','Rekap cadangan dan impor nasional',0,{activeAgents:nationalTick.activeAgentCount,monthlyPurchased:nationalTick.government.monthlyPurchased,monthlyReleased:nationalTick.government.monthlyReleased,monthlyImported:nationalTick.government.monthlyImported,treasury:nationalTick.government.treasury});
  }
 }
 if(typeof BACKGROUND_ECONOMY!=='undefined'&&typeof MARKET_ENGINE!=='undefined'){
  // Restore this save's prices before repricing. This is a local NPC simulation, not a global player market.
  if(S.marketPrices&&typeof S.marketPrices==='object'){
   MARKET_ENGINE.catalog.forEach(item=>{const p=Number(S.marketPrices[item.id]);if(Number.isFinite(p)&&p>=item.marketFloor&&p<=item.marketCeiling)item.marketPrice=p;});
  }
  const queuedPlayerTransactions=Array.isArray(S.marketTransactions)?S.marketTransactions.slice():[];
  const marketTick=BACKGROUND_ECONOMY.tick({day:S.day,activePlayers:1,policies:S.marketPolicies||{},playerTransactions:queuedPlayerTransactions});
  S.marketTransactions=[];
  S.marketPrices=Object.fromEntries(MARKET_ENGINE.catalog.map(item=>[item.id,item.marketPrice]));
  S.marketLastTick={day:marketTick.gameDay,scope:marketTick.scope,npcTransactionCount:marketTick.npcTransactionCount,playerTransactionCount:marketTick.playerTransactionCount,priceUpdates:marketTick.priceUpdates.length,marketIsGloballyShared:false};
 }
 // Persist one deterministic regional NPC order batch after the day's regional and market prices are updated.
 if(typeof AgroNpcOrderGenerator!=='undefined'&&typeof AgroNationalEconomy!=='undefined'&&typeof AgroPlayerOrderBook!=='undefined'&&typeof MARKET_ENGINE!=='undefined'){
  const provinces=AgroNationalEconomy.provinces.map(meta=>AgroNationalEconomy.provinceSnapshot(meta.id)).filter(Boolean);
  const proposal=AgroNpcOrderGenerator.buildDailyOrders({day:S.day,provinces,catalog:MARKET_ENGINE.catalog,getPrice:id=>MARKET_ENGINE.getPrice(id)});
  if(proposal&&proposal.ok){
   const stored=AgroPlayerOrderBook.replaceNpcOrders(proposal.orders,S.day);
   if(stored&&stored.ok&&!stored.alreadyGenerated)ledger('PASAR','Order NPC regional dibuat '+stored.storedCount,0,{day:S.day,summary:proposal.summary,calibrationStatus:proposal.summary.calibrationStatus});
  }
 }
 // Expire open market orders at the start of the next in-game day.
 if(typeof AgroPlayerOrderBook!=='undefined'&&typeof AgroPlayerOrderBook.expire==='function'){
  const expiry=AgroPlayerOrderBook.expire(S.day+1);
  if(expiry&&expiry.expiredCount)ledger('PASAR','Order kedaluwarsa '+expiry.expiredCount,0,{expiredOrderIds:expiry.expiredOrderIds,targetDay:expiry.targetDay});
 }
 const mOld=monthOf(S.day);
 S.day++;
 if(typeof AgroCommodityStorage!=='undefined'&&S.quarterUsed>0){const openedAge=Math.max(0,S.day-(Number(S.quarterOpenedDay)||S.day));const weather=S.cuaca||'berawan';const env=S.storageEnvironment||{temperatureC:weather==='panas'?33:weather==='hujan'?27:30,relativeHumidityPct:weather==='hujan'?95:weather==='panas'?65:80};const opened=AgroCommodityStorage.assessLot({commodityId:'kelapa',form:'opened',opened:true,ageDays:openedAge,temperatureC:S.warung&&S.warung.fridge?4:env.temperatureC,relativeHumidityPct:env.relativeHumidityPct,storageType:S.warung&&S.warung.fridge?'refrigerated':(env.storageType||'ambient')});if(opened.expired){const loss=Math.max(0,Number(S.quarterCost)||0)*(Math.max(0,4-(Number(S.quarterUsed)||0))/4);if(loss>0&&typeof recordBusinessCogs==='function')recordBusinessCogs('Susut kelapa terbuka rusak',[{account:'Persediaan Kelapa Dalam Proses (susut)',amount:loss}]);else ledger('RUGI','Kelapa terbuka rusak',0);L.lossOpenedCoconut=loss;S.quarterUsed=0;S.quarterCost=0;S.quarterOpenedDay=null;}}
 if(typeof AgroCommodityStorage!=='undefined'&&S.landSystem){const weather=S.cuaca||'berawan';const env=S.storageEnvironment||{temperatureC:weather==='panas'?33:weather==='hujan'?27:30,relativeHumidityPct:weather==='hujan'?95:weather==='panas'?65:80};const storageTick=AgroCommodityStorage.tickLots(S,S.day,env);if(storageTick&&storageTick.ok){const expired=storageTick.results.filter(x=>!x.skipped&&x.expired);expired.forEach(result=>{const lot=S.landSystem.storageLots.find(x=>x.id===result.lotId);if(!lot||lot.writeoffDay)return;const inventoryQty=Math.max(0,Number(S.landSystem.inventory[lot.commodityId])||0),writeoffQty=Math.min(inventoryQty,Math.max(0,Number(lot.quantity)||0));if(writeoffQty<=0){lot.quantity=0;lot.writeoffDay=S.day;return;}const inventoryCost=Math.max(0,Number(S.landSystem.inventoryCost[lot.commodityId])||0),averageCost=inventoryQty>0?inventoryCost/inventoryQty:0,lossValue=Math.min(inventoryCost,writeoffQty*averageCost);S.landSystem.inventory[lot.commodityId]=Math.max(0,inventoryQty-writeoffQty);S.landSystem.inventoryCost[lot.commodityId]=Math.max(0,inventoryCost-lossValue);lot.quantity=0;lot.writeoffDay=S.day;lot.writeoffReason=result.risk;if(lossValue>0&&typeof recordBusinessCogs==='function')recordBusinessCogs('Susut persediaan '+lot.commodityId+' kedaluwarsa',[{account:'Persediaan Bahan Baku Pertanian (susut)',amount:lossValue}]);else ledger('RUGI','Persediaan '+lot.commodityId+' kedaluwarsa '+writeoffQty,0,{lotId:lot.id,quantity:writeoffQty});if(!S.dayLog.storageWriteoffs)S.dayLog.storageWriteoffs=[];S.dayLog.storageWriteoffs.push({day:S.day,lotId:lot.id,commodityId:lot.commodityId,quantity:writeoffQty,value:lossValue,reason:result.risk});});S.landSystem.storageLots=S.landSystem.storageLots.filter(x=>Number(x.quantity)>1e-9);const alerts=storageTick.results.filter(x=>!x.skipped&&['high','critical','expired','spoiled'].includes(x.risk));if(alerts.length){if(!S.dayLog.storageAlerts)S.dayLog.storageAlerts=[];S.dayLog.storageAlerts.push(...alerts.map(x=>({day:S.day,lotId:x.lotId,commodityId:x.commodityId,quantity:x.quantity,risk:x.risk,quality:x.quality})));}}}
 if(monthOf(S.day)!==mOld&&S.purchases){S.purchases.seedlingMonth=0;S.purchases.externalCoconutMonth=0;}
 if(monthOf(S.day)>mOld && DATA.living && DATA.living.bills && Number.isFinite(DATA.living.bills.amount) && DATA.living.bills.amount>0){spend('HIDUP','Tagihan bulanan',DATA.living.bills.amount,'bills');}
 if(stockClass()==='busuk'&&stockQty()>0){
  const q=stockQty();S.stats.rotten+=q;
  const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):q*3500;
  const openCoconutValue=Math.max(0,Number(S.quarterCost)||0)*Math.max(0,4-(Number(S.quarterUsed)||0))/4;
  const rottenComponents=[];
  if(stockValue>0)rottenComponents.push({account:'Persediaan Kelapa (susut)',amount:stockValue});
  if(openCoconutValue>0)rottenComponents.push({account:'Persediaan Kelapa Dalam Proses (susut)',amount:openCoconutValue});
  if(rottenComponents.length&&typeof recordBusinessCogs==='function')recordBusinessCogs('Susut persediaan kelapa busuk',rottenComponents);
  else ledger('RUGI','Kelapa busuk '+q+' butir',0);
  L.lossRot=q;S.stock={biasa:0,super:0};S.stockCostValue=0;S.quarterUsed=0;S.quarterCost=0;S.quarterOpenedDay=null;
 }
 S.cuaca=rollWeather();
 const net=-L.expense+L.gross;
 const businessResult=(Number(L.gross)||0)-(Number(L.cogs)||0)-(Number(L.businessExpense)||0);
 S.reports.push({day:S.day-1,gross:L.gross,expense:L.expense,businessExpense:Number(L.businessExpense)||0,livingExpense:Number(L.livingExpense)||0,businessPurchases:Number(L.businessPurchases)||0,cogs:Number(L.cogs)||0,cogsByAccount:Object.assign({},L.cogsByAccount||{}),businessResult,capex:Number(L.capex)||0,net,cashIn:Number(L.cashIn)||0,cashOut:Number(L.cashOut)||0,cashflow:(Number(L.cashIn)||0)-(Number(L.cashOut)||0),
  es:L.sales.es,whole:L.sales.whole,lost:L.lost,
  mat:Object.assign({},L.materials),iceMelt:L.lossIcePortions,
  shopping:L.shopping,living:L.living,bills:L.bills,
  weather:L.weather,buyers:L.buyerCount,
  dailyExpenses:L.dailyExpenses,commoditySales:L.commoditySales||[],fridge:S.warung.fridge});
 S.phase='pagi';S.dayLog=newDayLog();S.dayLog.weather=S.cuaca;
 save();showReport(L,net);render();
}
