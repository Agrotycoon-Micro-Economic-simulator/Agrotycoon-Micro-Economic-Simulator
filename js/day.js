function endDay(){
 if(!el('warung-scene').classList.contains('hidden'))closeScene(true);
 const oldStart=S.dayStartGold;
 const report=[];
 const ls=S.lastSale||{sold:0,rev:0,spoiled:0};
 if(ls.sold>0)report.push(['Es terjual '+ls.sold+' gelas',ls.rev]);
 if(ls.spoiled>0)report.push(['Es basi '+ls.spoiled+' gelas (rugi)',0]);
 if(S.warung.open&&!ls.sold)report.push(['Tidak ada penjualan hari ini',0]);
 S.gold-=DATA.living.food;ledger('Biaya hidup - makan',-DATA.living.food);
 report.push(['Makan harian',-DATA.living.food]);
 const mOld=monthOf(S.day);
 S.day++;
 if(monthOf(S.day)>mOld){
  S.gold-=DATA.living.bills;
  ledger('Tagihan bulanan (listrik,pulsa,bensin,mandi,sabun)',-DATA.living.bills);
  report.push(['Tagihan bulanan',-DATA.living.bills]);
 }
 if(stockClass()==='busuk'&&stockQty()>0){
  const q=stockQty();S.stats.rotten+=q;
  ledger('Kerugian - '+q+' butir busuk',0);
  report.push(['Busuk (rugi total) '+q+' butir',0]);
  S.stock={biasa:0,super:0};
 }
 S.phase='pagi';S.dayStartGold=S.gold;S.lastSale={sold:0,rev:0,spoiled:0};
 save();showReport(report,S.gold-oldStart);render();
}
