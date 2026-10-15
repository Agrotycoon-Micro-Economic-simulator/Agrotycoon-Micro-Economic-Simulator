function isMature(t){return t.mature||S.day>=t.plantedDay+DATA.matureDays;}
function readyTrees(){return S.trees.filter(t=>isMature(t)&&(t.lastHarvest===null||S.day-t.lastHarvest>=DATA.cycleDays));}
function harvest(){
 if(stockQty()>0){msg('⚠️ Gudang masih berisi. Jual atau olah dulu stok lama sebelum panen baru.');return;}
 const rt=readyTrees();if(!rt.length){msg('⚠️ Belum ada pohon siap panen.');return;}
 let b=0,su=0;
 rt.forEach(t=>{if(t.type==='super')su+=DATA.yieldSuper;else b+=DATA.yieldBiasa;t.lastHarvest=S.day;});
 const total=b+su,cost=total*DATA.laborPerFruit;
 S.gold-=cost;ledger('Upah kuli panen ('+total+' butir)',-cost);
 S.stock.biasa=b;S.stock.super=su;S.harvestDay=S.day;
 say('Mentor','🤖','Panen '+total+' butir ('+b+' biasa, '+su+' super). Upah kuli '+rp(cost)+' lunas. Jam stok dimulai hari ini, Bos.');
 save();render();
}
function sellTengkulak(){
 if(stockClass()!=='muda'){msg('⚠️ Tengkulak hanya membeli butir muda.');return;}
 const rev=S.stock.biasa*DATA.priceTengkulak.biasa+S.stock.super*DATA.priceTengkulak.super;
 S.gold+=rev;ledger('Jual tengkulak ('+stockQty()+' butir)',rev);
 S.stats.tengkulak+=stockQty();S.stock={biasa:0,super:0};
 say('Tengkulak','🧑‍💼','Beres. Semua saya angkut hari ini juga. Sampai jumpa panen berikutnya.');
 save();render();
}
function sellPasar(){
 if(stockClass()!=='tua'){msg('⚠️ Pasar hanya membeli kelapa tua untuk santan.');return;}
 const q=stockQty(),rev=q*DATA.pricePasarTua;
 S.gold+=rev;ledger('Jual pasar - kelapa santan ('+q+' butir)',rev);
 S.stock={biasa:0,super:0};
 say('Pedagang','👩🏻‍','Yang tua saya ambil untuk santan. Harganya segitu adanya, ya.');
 save();render();
}
function openWarung(){
 const total=DATA.warungCapex.reduce((a,c)=>a+c[1],0);
 if(S.gold<total){msg('⚠️ Uang tidak cukup untuk peralatan ('+rp(total)+').');return;}
 DATA.warungCapex.forEach(c=>{S.gold-=c[1];ledger('Peralatan warung - '+c[0],-c[1]);});
 S.warung.open=true;
 say('Mentor','🤖','Warung berdiri di depan rumah. Setiap siang Anda bisa memproduksi es kelapa.');
 save();render();
}
function demandToday(){return 15+((S.day*7919)%36);}
function produceEs(cups){
 cups=Math.max(0,Math.floor(cups));if(cups<=0)return;
 const need=Math.ceil(cups/DATA.es.cupsPerFruit);
 if(stockClass()!=='muda'||stockQty()<need){msg('⚠️ Stok muda tidak cukup: butuh '+need+' butir.');return;}
 let cost=cups*DATA.es.plastic;
 if(S.warung.fixedPaidDay!==S.day){cost+=DATA.es.ice+DATA.es.sugar;S.warung.fixedPaidDay=S.day;}
 S.gold-=cost;ledger('HPP es kelapa ('+cups+' gelas)',-cost);
 let take=need;const fromB=Math.min(S.stock.biasa,take);S.stock.biasa-=fromB;take-=fromB;S.stock.super-=take;
 const sold=Math.min(cups,demandToday());
 const rev=sold*DATA.es.price;S.gold+=rev;ledger('Penjualan es kelapa ('+sold+' gelas)',rev);
 S.stats.es+=sold;
 say('Mentor','🤖','Terjual '+sold+' gelas; '+(cups-sold)+' gelas sisa basi. Penerimaan '+rp(rev)+'.');
 save();render();
}
function emptySlots(){return DATA.slots-S.trees.length;}
function buySeedling(n){
 n=Math.max(1,Math.floor(n));
 if(S.day<=30){msg('⚠️ Toko bibit super baru buka bulan ke-2.');return;}
 if(n>emptySlots()){msg('⚠️ Slot kosong tinggal '+emptySlots()+'.');return;}
 const cost=n*(DATA.seedling.price+DATA.seedling.labor);
 if(S.gold<cost){msg('⚠️ Uang tidak cukup: butuh '+rp(cost)+'.');return;}
 S.gold-=cost;ledger('Bibit super '+n+' pohon (bibit+upah tanam)',-cost);
 for(let i=0;i<n;i++)S.trees.push({slot:S.trees.length,type:'super',plantedDay:S.day,mature:false,lastHarvest:null});
 save();render();showAccelOffer();
}
function accelIAP(){
 const im=S.trees.filter(t=>!isMature(t));
 if(!im.length){msg('Tidak ada pohon belum berbuah.');return;}
 if(!confirm('Bundle Percepatan: Rp 1.000 (uang asli) per 5 pohon.\nPrototipe: payment gateway belum aktif - simulasikan pembayaran berhasil?'))return;
 im.sort((a,b)=>a.plantedDay-b.plantedDay).slice(0,5).forEach(t=>{t.mature=true;});
 S.realMoney+=1000;ledger('(Simulasi IAP) Bundle percepatan 5 pohon',0);
 say('Mentor','🤖','5 pohon dipercepat langsung berbuah. Pada produksi, transaksi ini menagih Rp 1.000 uang asli.');
 save();render();
}
function accelAd(){
 if(S.lastAdDay===S.day){msg('⚠️ Skip iklan sudah dipakai hari ini.');return;}
 S.trees.forEach(t=>{if(!isMature(t))t.plantedDay-=DATA.accel.adDays;});
 S.lastAdDay=S.day;ledger('Iklan: skip pertumbuhan 30 hari',0);
 say('Mentor','🤖','Semua bibit tumbuh 30 hari lebih cepat.');
 save();render();
}
