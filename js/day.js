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

function finishDay(){
 console.log('finishDay dipanggil');
 const ov=el('progress');
 if(ov)ov.classList.add('hidden');
 const L=S.dayLog;
 if(!L){console.error('dayLog tidak ada');return;}
 
 // Es mencair jika tidak ada kulkas
 if(!S.warung.fridge&&S.warung.ice>0){
  L.lossIcePortions=S.warung.ice;
  L.lossIceValue=S.warung.ice/DATA.shop.iceKarung.portions*DATA.shop.iceKarung.price;
  ledger('RUGI','Es mencair '+S.warung.ice+' porsi (nilai '+rp(L.lossIceValue)+')',0);
  S.warung.ice=0;
 }else if(S.warung.fridge&&S.warung.ice>0){
  ledger('INFO','Es tersisa di kulkas: '+S.warung.ice+' porsi (aman)',0);
 }
 S.warung.operatedToday=false;
 
 // BELANJA HARIAN OTOMATIS
 const livingDetails=[];
 const autoBuy=[
  {key:'rice',check:()=>(S.livingStock.rice||0)<=0},
  {key:'egg',check:()=>(S.day%5===1||(S.livingStock.egg||0)<=0)},
  {key:'oil',check:()=>(S.day%30===1||(S.livingStock.oil||0)<=0)},
  {key:'mie',check:()=>(S.day%3===1||(S.livingStock.mie||0)<=0)},
  {key:'tempe',check:()=>(S.day%2===1||(S.livingStock.tempe||0)<=0)},
  {key:'sayur',check:()=>true},
  {key:'lauk',check:()=>(S.day%2===0||(S.livingStock.lauk||0)<=0)}
 ];
 autoBuy.forEach(ab=>{
  const item=DATA.living[ab.key];
  if(!item)return;
  if(ab.check()){
   spend('HIDUP','Beli '+item.name+' (otomatis)',item.price,'living');
   livingDetails.push({item:item.name,amt:item.price});
   if(!S.livingStock)S.livingStock={};
   S.livingStock[ab.key]=(S.livingStock[ab.key]||0)+1;
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
  ledger('RUGI','Kelapa busuk '+q+' butir',0);
  L.lossRot=q;S.stock={biasa:0,super:0};S.quarterUsed=0;
 }
 S.cuaca=rollWeather();
 const net=-L.expense+L.gross;
 S.reports.push({day:S.day-1,gross:L.gross,expense:L.expense,net,
  es:L.sales.es,whole:L.sales.whole,lost:L.lost,
  mat:Object.assign({},L.materials),iceMelt:L.lossIcePortions,
  shopping:L.shopping,living:L.living,bills:L.bills,
  weather:L.weather,buyers:L.buyerCount,
  dailyExpenses:L.dailyExpenses,commoditySales:L.commoditySales||[],fridge:S.warung.fridge});
 S.phase='pagi';S.dayLog=newDayLog();S.dayLog.weather=S.cuaca;
 save();showReport(L,net);render();
}
