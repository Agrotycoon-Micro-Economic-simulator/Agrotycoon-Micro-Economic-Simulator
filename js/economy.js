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
 if(totalCost<=0){msg('️ Tidak ada yang dibeli.');return false;}
 if(S.gold<totalCost){msg('️ Uang tidak cukup.');return false;}
 spend('BELANJA','Belanja bahan warung',totalCost,'shopping',details);
 items.forEach(it=>{
  const def=DATA.shop[it.key];
  if(def.portions&&it.key==='iceKarung')S.warung.ice+=it.qty*def.portions;
  if(def.portions&&it.key==='sugarBloc')S.warung.sugar+=it.qty*def.portions;
  if(def.pcs)S.warung.cups+=it.qty*def.pcs;
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

// NPC TENGKULAK INTERAKTIF
function sellTengkulak(){
 if(stockClass()!=='muda'){msg('️ Tengkulak hanya membeli butir muda.');return;}
 const q=stockQty();
 const biasaQty=S.stock.biasa||0;
 const superQty=S.stock.super||0;
 const revBiasa=biasaQty*DATA.priceTengkulak.biasa;
 const revSuper=superQty*DATA.priceTengkulak.super;
 const totalRev=revBiasa+revSuper;
 
 // Dialog NPC Tengkulak
 let dialogHtml='<h3>🧑💼 Pak Tengkulak Datang</h3>';
 dialogHtml+='<div style="background:#fff3cd;padding:12px;border-radius:8px;margin:10px 0;border-left:4px solid #ffc107">';
 dialogHtml+='<p><strong>"Halo Bos '+S.name+'! Saya lihat panenmu bagus hari ini."</strong></p>';
 dialogHtml+='<p>"Saya tawar harga standar ya: kelapa biasa Rp 3.500/butir, kelapa super Rp 5.000/butir. Saya borong semua, langsung saya angkut pakai truk."</p>';
 dialogHtml+='</div>';
 dialogHtml+='<div style="background:#e3f2fd;padding:12px;border-radius:8px;margin:10px 0">';
 dialogHtml+='<p><strong>Detail Penawaran:</strong></p>';
 dialogHtml+='<p>🥥 Kelapa biasa: '+biasaQty+' butir × Rp 3.500 = <b>'+rp(revBiasa)+'</b></p>';
 dialogHtml+='<p>🥥 Kelapa super: '+superQty+' butir × Rp 5.000 = <b>'+rp(revSuper)+'</b></p>';
 dialogHtml+='<hr><p><strong>Total: '+rp(totalRev)+'</strong></p>';
 dialogHtml+='</div>';
 dialogHtml+='<div style="background:#f5f5f5;padding:12px;border-radius:8px;margin:10px 0;font-size:13px">';
 dialogHtml+='<p><strong>💡 Info dari Pak Tengkulak:</strong></p>';
 dialogHtml+='<p>"Nanti saya juga bisa bantu jualin komoditas lain lho: '+DATA.futureCommodities.join(', ')+'. Tapi itu nanti ya, sekarang fokus kelapa dulu."</p>';
 dialogHtml+='<p>"Kalau kau mau harga lebih tinggi, coba olah sendiri jadi es kelapa atau jual eceran di warung. Tapi risikonya juga ada - stok bisa busuk kalau tidak laku."</p>';
 dialogHtml+='</div>';
 dialogHtml+='<div style="margin-top:15px">';
 dialogHtml+='<button class="btn btn-success" onclick="confirmSellTengkulak(true)">✅ Jual Semua ('+rp(totalRev)+')</button>';
 dialogHtml+='<button class="btn btn-warning" onclick="confirmSellTengkulak(false)">❌ Tidak Jadi Jual</button>';
 dialogHtml+='</div>';
 showModal(dialogHtml);
}
function confirmSellTengkulak(jual){
 closeModal();
 if(!jual){
  say('Tengkulak','🧑💼','"Yaudah, lain kali aja ya Bos. Saya lewat lagi besok."');
  save();render();
  return;
 }
 const q=stockQty();
 const rev=(S.stock.biasa||0)*DATA.priceTengkulak.biasa+(S.stock.super||0)*DATA.priceTengkulak.super;
 earn('PENJUALAN','Jual tengkulak '+q+' butir',rev,{biasa:S.stock.biasa,super:S.stock.super});
 S.dayLog.sales.tengkulak=q;S.dayLog.sales.tengkulakRev=rev;
 S.stats.tengkulak+=q;S.stock={biasa:0,super:0};
 say('Tengkulak','‍💼','"Makasih Bos! Saya angkut semua ya. Sampai jumpa panen berikutnya!"');
 save();render();
}

function sellPasar(){
 if(stockClass()!=='tua'){msg('⚠️ Pasar hanya membeli kelapa tua untuk santan.');return;}
 const q=stockQty(),rev=q*DATA.pricePasarTua;
 earn('PENJUALAN','Jual pasar kelapa santan '+q+' butir',rev);
 S.dayLog.sales.pasar=q;S.dayLog.sales.pasarRev=rev;
 S.stock={biasa:0,super:0};
 say('Pedagang','👩‍','Yang tua saya ambil untuk santan.');
 save();render();
}
function openWarung(){
 const total=DATA.warungCapex.reduce((a,c)=>a+c[1],0);
 if(S.gold<total){msg('⚠️ Uang tidak cukup untuk peralatan ('+rp(total)+').');return;}
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
 if(!S.livingStock)S.livingStock={};
 S.livingStock[key]=(S.livingStock[key]||0)+1;
 save();render();
}
function emptySlots(){return DATA.slots-S.trees.length;}
function buySeedling(n){
 n=Math.max(1,Math.floor(n));
 if(S.day<=30){msg('⚠️ Toko bibit super baru buka bulan ke-2.');return;}
 if(n>emptySlots()){msg('⚠️ Slot kosong tinggal '+emptySlots()+'.');return;}
 const cost=n*(DATA.seedling.price+DATA.seedling.labor);
 if(S.gold<cost){msg('⚠️ Uang tidak cukup: butuh '+rp(cost)+'.');return;}
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
