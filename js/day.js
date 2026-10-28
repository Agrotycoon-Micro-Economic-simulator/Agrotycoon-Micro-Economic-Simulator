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
 // Advance the seeded world economy before incrementing the in-game clock.
 if(typeof AgroWorldSim!=='undefined'){
  const worldEvents=AgroWorldSim.updateDay(S.day);
  worldEvents.forEach(ev=>ledger('DUNIA_SIMULASI',ev.headline+' — '+ev.region,0,{type:ev.type,classification:ev.classification,affected:ev.affected}));
 }
 const mOld=monthOf(S.day);
 S.day++;
 if(monthOf(S.day)!==mOld&&S.purchases){S.purchases.seedlingMonth=0;S.purchases.externalCoconutMonth=0;}
 if(monthOf(S.day)>mOld && DATA.living && DATA.living.bills && Number.isFinite(DATA.living.bills.amount) && DATA.living.bills.amount>0){spend('HIDUP','Tagihan bulanan',DATA.living.bills.amount,'bills');}
 if(stockClass()==='busuk'&&stockQty()>0){
  const q=stockQty();S.stats.rotten+=q;
  const rottenValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):q*3500;
  if(rottenValue>0&&typeof recordBusinessCogs==='function')recordBusinessCogs('Susut persediaan kelapa busuk',[{account:'Persediaan Kelapa (susut)',amount:rottenValue}]);
  else ledger('RUGI','Kelapa busuk '+q+' butir',0);
  L.lossRot=q;S.stock={biasa:0,super:0};S.stockCostValue=0;S.quarterUsed=0;S.quarterCost=0;
 }
 S.cuaca=rollWeather();
 const net=-L.expense+L.gross;
 const businessResult=(Number(L.gross)||0)-(Number(L.cogs)||0)-(Number(L.businessExpense)||0);
 S.reports.push({day:S.day-1,gross:L.gross,expense:L.expense,businessExpense:Number(L.businessExpense)||0,livingExpense:Number(L.livingExpense)||0,businessPurchases:Number(L.businessPurchases)||0,cogs:Number(L.cogs)||0,businessResult,capex:Number(L.capex)||0,net,cashIn:Number(L.cashIn)||0,cashOut:Number(L.cashOut)||0,cashflow:(Number(L.cashIn)||0)-(Number(L.cashOut)||0),
  es:L.sales.es,whole:L.sales.whole,lost:L.lost,
  mat:Object.assign({},L.materials),iceMelt:L.lossIcePortions,
  shopping:L.shopping,living:L.living,bills:L.bills,
  weather:L.weather,buyers:L.buyerCount,
  dailyExpenses:L.dailyExpenses,commoditySales:L.commoditySales||[],fridge:S.warung.fridge});
 S.phase='pagi';S.dayLog=newDayLog();S.dayLog.weather=S.cuaca;
 save();showReport(L,net);render();
}
