function startSleep(){
 if(!el('warung-scene').classList.contains('hidden'))closeScene(true);
 const steps=['Merekap transaksi warung...','Menghitung bahan terpakai...','Memproses cuaca besok...','Memotong biaya hidup...','Menyusun laporan harian...'];
 const ov=el('progress');ov.classList.remove('hidden');
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
 el('progress').classList.add('hidden');
 const L=S.dayLog;
 // Es mencair hanya jika TIDAK ada kulkas
 if(!S.warung.fridge&&S.warung.ice>0){
  L.lossIcePortions=S.warung.ice;
  L.lossIceValue=S.warung.ice/DATA.shop.iceKarung.portions*DATA.shop.iceKarung.price;
  ledger('RUGI','Es mencair '+S.warung.ice+' porsi (nilai '+rp(L.lossIceValue)+')',0);
  S.warung.ice=0;
 }else if(S.warung.fridge){
  // Es tersisa di kulkas, tidak rugi
  const sisa=S.warung.ice;
  if(sisa>0)ledger('INFO','Es tersisa di kulkas: '+sisa+' porsi (aman)',0);
 }
 S.warung.operatedToday=false;
 // Pengeluaran harian detail
 const livingDetails=[];
 // Beras: 1kg untuk 2 hari
 if(S.day%2===1||S.livingStock.rice<=0){
  if(S.livingStock.rice<=0){
   spend('HIDUP','Beli beras 1 kg (stok habis)',DATA.living.rice.price,'living');
   S.livingStock.rice=1;
   livingDetails.push({item:DATA.living.rice.name,amt:DATA.living.rice.price});
  }else{
   S.livingStock.rice--;
  }
 }
 // Lauk harian
 spend('HIDUP','Lauk pauk harian (tempe+ikan asin)',DATA.living.lauk.price,'living');
 livingDetails.push({item:DATA.living.lauk.name,amt:DATA.living.lauk.price});
 // Minyak
 spend('HIDUP','Minyak goreng harian',DATA.living.oil.price,'living');
 livingDetails.push({item:DATA.living.oil.name,amt:DATA.living.oil.price});
 // Gas
 spend('HIDUP','Gas LPG harian',DATA.living.gas.price,'living');
 livingDetails.push({item:DATA.living.gas.name,amt:DATA.living.gas.price});
 // Listrik
 spend('HIDUP','Listrik harian',DATA.living.electric.price,'living');
 livingDetails.push({item:DATA.living.electric.name,amt:DATA.living.electric.price});
 // Pulsa
 spend('HIDUP','Pulsa harian',DATA.living.pulsa.price,'living');
 livingDetails.push({item:DATA.living.pulsa.name,amt:DATA.living.pulsa.price});
 // Bensin
 spend('HIDUP','Bensin motor harian',DATA.living.bensin.price,'living');
 livingDetails.push({item:DATA.living.bensin.name,amt:DATA.living.bensin.price});
 // Mandi
 spend('HIDUP','Sabun mandi/cuci harian',DATA.living.mandi.price,'living');
 livingDetails.push({item:DATA.living.mandi.name,amt:DATA.living.mandi.price});
 L.dailyExpenses=livingDetails;
 const mOld=monthOf(S.day);
 S.day++;
 if(monthOf(S.day)>mOld){spend('HIDUP','Tagihan bulanan',DATA.living.bills.amount,'bills');}
 if(stockClass()==='busuk'&&stockQty()>0){
  const q=stockQty();S.stats.rotten+=q;
  ledger('RUGI','Kelapa busuk '+q+' butir',0);
  L.lossRot=q;S.stock={biasa:0,super:0};S.quarterUsed=0;
 }
 // Cuaca besok
 S.cuaca=rollWeather();
 const net=-L.expense+L.gross;
 S.reports.push({day:S.day-1,gross:L.gross,expense:L.expense,net,
  es:L.sales.es,whole:L.sales.whole,lost:L.lost,
  mat:Object.assign({},L.materials),iceMelt:L.lossIcePortions,
  shopping:L.shopping,living:L.living,bills:L.bills,
  weather:L.weather,buyers:L.buyerCount,
  dailyExpenses:L.dailyExpenses,fridge:S.warung.fridge});
 S.phase='pagi';S.dayLog=newDayLog();S.dayLog.weather=S.cuaca;
 save();showReport(L,net);render();
}
