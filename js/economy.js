function isMature(t){return t.mature||S.day>=t.plantedDay+DATA.matureDays;}
function readyTrees(){return S.trees.filter(t=>isMature(t)&&(t.lastHarvest===null||S.day-t.lastHarvest>=DATA.cycleDays));}
function spend(cat,desc,amt,field,detail){S.gold-=amt;ledger(cat,desc,-amt,detail);S.dayLog.expense+=amt;if(field)S.dayLog[field]+=amt;}
function earn(cat,desc,amt,detail){S.gold+=amt;ledger(cat,desc,amt,detail);S.dayLog.gross+=amt;}
function harvest(){
 if(stockQty()>0){msg('️ Gudang masih berisi. Jual atau olah dulu stok lama sebelum panen baru.');return;}
 const rt=readyTrees();if(!rt.length){msg('⚠️ Belum ada pohon siap panen.');return;}
 let b=0,su=0;
 rt.forEach(t=>{if(t.type==='super')su+=DATA.yieldSuper;else b+=DATA.yieldBiasa;t.lastHarvest=S.day;});
 const total=b+su,cost=total*DATA.laborPerFruit;
 spend('TENAGA','Upah kuli panen '+total+' butir',cost,'labor',{butir:total});
 S.stock.biasa=b;S.stock.super=su;S.harvestDay=S.day;
 say('Mentor','🤖','Panen '+total+' butir masuk gudang. Jam stok dimulai hari ini.');
 save();render();
}
function shopMaterials(items){
 let totalCost=0;const details=[];
 items.forEach(it=>{
  if(it.qty<=0)return;
  const def=DATA.shop[it.key];
  if(!def)return;
  const cost=it.qty*def.price;
  totalCost+=cost;
  details.push({name:def.name,qty:it.qty,unit:def.unit,subtotal:cost});
 });
 if(totalCost<=0){msg('⚠️ Tidak ada yang dibeli.');return false;}
 if(S.gold<totalCost){msg('⚠️ Uang tidak cukup.');return false;}
 spend('BELANJA','Belanja bahan warung',totalCost,'shopping',details);
 details.forEach(d=>{
  const def=Object.values(DATA.shop).find(x=>x.name===d.name);
  if(def.portions)S.warung.ice+=d.name.includes('Es')?d.qty*def.portions:0;
  if(def.portions&&d.name.includes('Gula'))S.warung.sugar+=d.qty*def.portions;
  if(def.pcs)S.warung.cups+=d.qty*def.pcs;
 });
 say('Mentor','🤖','Bahan masuk gudang warung.');
 save();render();return true;
}
function buyFridge(){
 if(S.warung.fridge){msg('⚠️ Sudah punya kulkas.');return;}
 if(S.gold<DATA.shop.fridge.price){msg('⚠️ Uang tidak cukup.');return;}
 spend('CAPEX','Beli '+DATA.shop.fridge.name,DATA.shop.fridge.price,'capex');
 S.warung.fridge=true;S.warung.fridgeCap=DATA.shop.fridge.capacity;
 say('Mentor','🤖','Kulkas terpasang! Es sisa tidak akan mencair malam ini.');
 save();render();
}
function sellTengkulak(){
 if(stockClass()!=='muda'){msg('️ Tengkulak hanya membeli butir muda.');return;}
 const q=stockQty(),rev=S.stock.biasa*DATA.priceTengkulak.biasa+S.stock.super*DATA.priceTengkulak.super;
 earn('PENJUALAN','Jual tengkulak '+q+' butir',rev,{biasa:S.stock.biasa,super:S.stock.super});
 S.dayLog.sales.tengkulak=q;S.dayLog.sales.tengkulakRev=rev;
 S.stats.tengkulak+=q;S.stock={biasa:0,super:0};
 say('Tengkulak','🧑‍💼','Beres. Semua saya angkut hari ini juga.');
 save();render();
}
function sellPasar(){
 if(stockClass()!=='tua'){msg('⚠️ Pasar hanya membeli kelapa tua untuk santan.');return;}
 const q=stockQty(),rev=q*DATA.pricePasarTua;
 earn('PENJUALAN','Jual pasar kelapa santan '+q+' butir',rev);
 S.dayLog.sales.pasar=q;S.dayLog.sales.pasarRev=rev;
 S.stock={biasa:0,super:0};
 say('Pedagang','👩🏻','Yang tua saya ambil untuk santan.');
 save();render();
}
function openWarung(){
 const total=DATA.warungCapex.reduce((a,c)=>a+c[1],0);
 if(S.gold<total){msg('️ Uang tidak cukup untuk peralatan ('+rp(total)+').');return;}
 DATA.warungCapex.forEach(c=>spend('CAPEX','Peralatan warung - '+c[0],c[1],'capex'));
 S.warung.open=true;
 say('Mentor','🤖','Warung berdiri. Setiap pagi belanja bahan, siang buka jam 09.00-21.00.');
 save();render();
}
function demandToday(){
 const base=15+((S.day*7919)%36);
 return rollBuyers(base);
}
function wholeBuyersToday(){
 const r=((S.day*104729)%100)/100;
 const w=DATA.weather[S.cuaca];
 const base=r<0.3?1:r<0.6?2:r<0.8?3:r<0.9?4:r<0.96?5:6;
 return Math.max(1,Math.ceil(base*w.wholeMult));
}
function takeCoconut(){
 if(S.quarterUsed>0){S.quarterUsed++;if(S.quarterUsed>=4)S.quarterUsed=0;return true;}
 if(stockQty()<=0)return false;
 if(S.stock.biasa>0)S.stock.biasa--;else S.stock.super--;
 S.quarterUsed=1;S.dayLog.materials.kelapa++;return true;
}
function trySellEs(){
 if(S.warung.ice<=0||S.warung.sugar<=0||S.warung.cups<=0)return false;
 const before=S.dayLog.materials.kelapa;
 if(!takeCoconut())return false;
 S.warung.ice--;S.warung.sugar--;S.warung.cups--;
 S.dayLog.materials.ice++;S.dayLog.materials.sugar++;S.dayLog.materials.cup++;
 earn('PENJUALAN','Es kelapa 1 gelas',DATA.es.price);
 S.dayLog.sales.es++;S.dayLog.sales.esRev+=DATA.es.price;S.stats.es++;
 return true;
}
function trySellWhole(){
 if(stockQty()<=0&&S.quarterUsed===0)return false;
 if(S.quarterUsed>0){S.quarterUsed=0;}
 if(stockQty()<=0)return false;
 if(S.stock.biasa>0)S.stock.biasa--;else S.stock.super--;
 S.dayLog.materials.kelapa++;
 earn('PENJUALAN','Kelapa utuh 1 butir',DATA.wholePrice);
 S.dayLog.sales.whole++;S.dayLog.sales.wholeRev+=DATA.wholePrice;S.stats.whole++;
 return true;
}
function buyLivingItem(key){
 const item=DATA.living[key];if(!item)return;
 if(S.gold<item.price){msg('⚠️ Uang tidak cukup.');return;}
 spend('HIDUP','Beli '+item.name,item.price,'living');
 if(key==='rice')S.livingStock.rice+=1;
 if(key==='lauk')S.livingStock.lauk+=1;
 if(key==='oil')S.livingStock.oil+=1;
 save();render();
}
function emptySlots(){return DATA.slots-S.trees.length;}
function buySeedling(n){
 n=Math.max(1,Math.floor(n));
 if(S.day<=30){msg('⚠️ Toko bibit super baru buka bulan ke-2.');return;}
 if(n>emptySlots()){msg('⚠️ Slot kosong tinggal '+emptySlots()+'.');return;}
 const cost=n*(DATA.seedling.price+DATA.seedling.labor);
 if(S.gold<cost){msg('️ Uang tidak cukup: butuh '+rp(cost)+'.');return;}
 spend('CAPEX','Bibit super '+n+' pohon (bibit+upah tanam)',cost,'capex',{pohon:n});
 for(let i=0;i<n;i++)S.trees.push({slot:S.trees.length,type:'super',plantedDay:S.day,mature:false,lastHarvest:null});
 save();render();showAccelOffer();
}
function accelIAP(){
 const im=S.trees.filter(t=>!isMature(t));
 if(!im.length){msg('Tidak ada pohon belum berbuah.');return;}
 if(!confirm('Bundle Percepatan: Rp 1.000 (uang asli) per 5 pohon.\nPrototipe: payment gateway belum aktif - simulasikan pembayaran berhasil?'))return;
 im.sort((a,b)=>a.plantedDay-b.plantedDay).slice(0,5).forEach(t=>{t.mature=true;});
 S.realMoney+=1000;ledger('IAP','(Simulasi) Bundle percepatan 5 pohon',0);
 save();render();
}
function accelAd(){
 if(S.lastAdDay===S.day){msg('⚠️ Skip iklan sudah dipakai hari ini.');return;}
 S.trees.forEach(t=>{if(!isMature(t))t.plantedDay-=DATA.accel.adDays;});
 S.lastAdDay=S.day;ledger('IKLAN','Skip pertumbuhan 30 hari',0);
 save();render();
}
function choosePath(p){
 S.path=p;
 say('Mentor','🤖','Jalur dipilih: '+DATA.paths[p].name+'. '+DATA.paths[p].desc);
 save();render();
}
