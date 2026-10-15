function startSleep(){
 if(!el('warung-scene').classList.contains('hidden'))closeScene(true);
 const steps=['Merekap transaksi warung...','Menghitung bahan terpakai...','Es sisa mencair di cooler...','Memotong biaya hidup...','Menyusun laporan harian...'];
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
 if(S.warung.ice>0){
  L.lossIcePortions=S.warung.ice;
  L.lossIceValue=S.warung.ice/DATA.shop.icePortions*DATA.shop.iceKarung;
  ledger('RUGI','Es mencair '+S.warung.ice+' porsi (nilai '+rp(L.lossIceValue)+')',0);
  S.warung.ice=0;
 }
 S.warung.operatedToday=false;
 spend('HIDUP','Biaya hidup - makan',DATA.living.food,'living');
 const mOld=monthOf(S.day);
 S.day++;
 if(monthOf(S.day)>mOld){spend('HIDUP','Tagihan bulanan (listrik,pulsa,bensin,mandi,sabun)',DATA.living.bills,'bills');}
 if(stockClass()==='busuk'&&stockQty()>0){
  const q=stockQty();S.stats.rotten+=q;
  ledger('RUGI','Kelapa busuk '+q+' butir',0);
  L.lossRot=q;S.stock={biasa:0,super:0};S.quarterUsed=0;
 }
 const net=-L.expense+L.gross;
 S.reports.push({day:S.day-1,gross:L.gross,expense:L.expense,net,
  es:L.sales.es,whole:L.sales.whole,lost:L.lost,
  mat:Object.assign({},L.materials),iceMelt:L.lossIcePortions,
  shopping:L.shopping,living:L.living,bills:L.bills});
 S.phase='pagi';S.dayLog=newDayLog();
 save();showReport(L,net);render();
}
