function isMature(t){return t.mature||S.day>=t.plantedDay+DATA.matureDays;}
function readyTrees(){return S.trees.filter(t=>isMature(t)&&(t.lastHarvest===null||S.day-t.lastHarvest>=DATA.cycleDays));}
function classifySpend(cat,desc){
 const text=String(desc||'').toLowerCase();
 if(cat==='HIDUP'){
  const kitchenKeys=['rice','egg','oil','mie','tempe','sayur','lauk'];
  const isKitchen=kitchenKeys.some(key=>DATA.living&&DATA.living[key]&&text.includes(String(DATA.living[key].name).toLowerCase()));
  return isKitchen
   ? {classification:'household_inventory_purchase',account:'Persediaan Rumah Tangga'}
   : {classification:'household_personal',account:'Beban Pribadi'};
 }
 if(cat==='BELANJA')return {classification:'business_purchase',account:'Pembelian Bahan Baku'};
 if(cat==='TENAGA')return {classification:'business_expense',account:'Beban Tenaga Kerja'};
 if(cat==='GAJI')return {classification:'business_expense',account:'Beban Gaji'};
 if(cat==='CAPEX')return {classification:'asset_purchase',account:'Aset Tetap/Modal'};
 if(cat==='PENJUALAN')return {classification:'business_revenue',account:'Penjualan'};
 return {classification:'unclassified_expense',account:'Beban Belum Diklasifikasi'};
}
function spend(cat,desc,amt,field,detail){
 const value=Number(amt)||0;
 const mapping=classifySpend(cat,desc);
 S.gold-=value;
 ledger(cat,desc,-value,detail,{
  classification:mapping.classification,
  debitAccount:mapping.account,
  creditAccount:'Kas',
  debit:value,
  credit:value,
  basis:'cash'
 });
 // Separate profit-and-loss expense from cash movements. Stock purchases remain inventory;
 // CAPEX remains an asset. Consumed business HPP is not yet fully costed in this prototype.
 if(mapping.classification==='business_expense'){
  S.dayLog.expense=(Number(S.dayLog.expense)||0)+value;
  S.dayLog.businessExpense=(Number(S.dayLog.businessExpense)||0)+value;
 }else if(mapping.classification==='household_personal'){
  S.dayLog.expense=(Number(S.dayLog.expense)||0)+value;
  S.dayLog.livingExpense=(Number(S.dayLog.livingExpense)||0)+value;
 }
 if(mapping.classification==='business_purchase')S.dayLog.businessPurchases=(Number(S.dayLog.businessPurchases)||0)+value;
 S.dayLog.cashOut=(Number(S.dayLog.cashOut)||0)+value;
 if(field)S.dayLog[field]+=value;
}
function earn(cat,desc,amt,detail){
 const value=Number(amt)||0;
 S.gold+=value;
 ledger(cat,desc,value,detail,{
  classification:'business_revenue',
  debitAccount:'Kas',
  creditAccount:'Penjualan',
  debit:value,
  credit:value,
  basis:'cash'
 });
 S.dayLog.gross+=value;
 S.dayLog.cashIn=(Number(S.dayLog.cashIn)||0)+value;
 gainXP(5);
} // +5 XP per transaksi
function harvest(){
 if(stockQty()>0){msg('⚠️ Gudang masih berisi. Jual/olah dulu stok lama.');return;}
 const rt=readyTrees();if(!rt.length){msg('⚠️ Belum ada pohon siap panen.');return;}
 let b=0,su=0;
 rt.forEach(t=>{if(t.type==='super')su+=DATA.yieldSuper;else b+=DATA.yieldBiasa;});
 const total=b+su,cost=total*DATA.laborPerFruit;
 if(!Number.isFinite(total)||total<=0||!Number.isFinite(cost)||cost<0){
  msg('⚠️ Data hasil panen atau upah tidak valid. Panen dibatalkan.');return;
 }
 if(!Number.isFinite(S.gold)||S.gold<cost){
  msg('⚠️ Uang tidak cukup untuk membayar upah panen '+rp(cost)+'. Panen dibatalkan.');return;
 }
 // Validate yield and cash before mutating tree harvest dates or recording expenses.
 rt.forEach(t=>{t.lastHarvest=S.day;});
 spend('TENAGA','Upah kuli panen '+total+' butir',cost,'labor',{butir:total});
 S.stock.biasa=b;S.stock.super=su;S.stockCostValue=total*3500;S.harvestDay=S.day;
 say('Mentor','🤖','Panen '+total+' butir masuk gudang.');
 save();render();
}
function buyKelapaLuar(sumber){
 const harga = sumber==='petani'?DATA.buyFromFarmer:DATA.buyFromTengkulak;
 showModal('<h3>🥥 Beli Kelapa dari '+(sumber==='petani'?'Petani Lain':'Tengkulak')+'</h3>'+
 '<p>Harga: '+rp(harga)+'/butir (muda, siap olah)</p>'+
 '<input type="number" id="inp-buy" min="1" max="200" value="20" placeholder="Jumlah butir...">'+
 '<button class="btn btn-success" onclick="confirmBuyKelapa(\''+sumber+'\')">Beli</button> '+
 '<button class="btn" onclick="closeModal()">Batal</button>');
}
function confirmBuyKelapa(sumber){
 const currentMonth=monthOf(S.day);
 if(S.purchases&&S.purchases.externalCoconutMonth===currentMonth){msg('Pembelian kelapa luar bulan ini sudah digunakan. Menu dibuka lagi pada tanggal 15 bulan berikutnya.');return;}
 const inp=el('inp-buy'); const qty=inp?(parseInt(inp.value)||0):0;
 if(qty<=0){msg('⚠️ Jumlah tidak valid.');return;}
 const harga=sumber==='petani'?DATA.buyFromFarmer:DATA.buyFromTengkulak;
 const total=qty*harga;
 if(S.gold<total){msg('⚠️ Uang tidak cukup.');return;}
 spend('BELANJA','Beli '+qty+' butir dari '+(sumber==='petani'?'petani':'tengkulak'),total,'shopping',{sumber,butir:qty});
 if(typeof playGameSound==='function')playGameSound('purchase');
 if(!S.purchases)S.purchases={};S.purchases.externalCoconutMonth=currentMonth;
 const oldQty=stockQty();
 const oldValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):oldQty*3500;
 S.stockCostValue=oldValue+total;
 S.stock.biasa=(S.stock.biasa||0)+qty; S.harvestDay=S.day;
 say('Mentor','🤖',qty+' butir kelapa muda masuk gudang.');
 save();closeModal();render();
}
function openWarung(){
 showModal('<h3>🏪 Pilih Paket Perlengkapan Warung</h3>'+
 '<p style="font-size:13px;color:#666">"Di dunia nyata, pengusaha cerdas menekan modal awal. Gunakan barang bekas yang masih layak, dan beli baru hanya untuk wadah makanan demi higiene."</p>'+
 '<div style="background:#e8f5e9;padding:12px;margin:10px 0;border-radius:8px;border-left:4px solid #4CAF50">'+
 '<p><strong>✅ Paket Hemat (Rekomendasi)</strong></p>'+
 '<p style="font-size:13px">Meja bekas + Golok warisan + Tupperware baru + Cup</p>'+
 '<p><b>Total: '+rp(DATA.warungPackages.hemat.total)+'</b></p>'+
 '<button class="btn btn-success" onclick="buyWarungPackage(\'hemat\')">Pilih Paket Hemat</button></div>'+
 '<div style="background:#fff3cd;padding:12px;margin:10px 0;border-radius:8px;border-left:4px solid #FFC107">'+
 '<p><strong>⭐ Paket Standar</strong></p>'+
 '<p style="font-size:13px">Meja baru + Golok baru + Tupperware baru + Cup</p>'+
 '<p><b>Total: '+rp(DATA.warungPackages.standar.total)+'</b></p>'+
 '<button class="btn btn-warning" onclick="buyWarungPackage(\'standar\')">Pilih Paket Standar</button></div>'+
 '<button class="btn" onclick="closeModal()">Batal</button>');
}
function buyWarungPackage(pkgKey){
 const pkg = DATA.warungPackages[pkgKey];
 if(S.gold<pkg.total){msg('⚠️ Uang tidak cukup.');return;}
 spend('CAPEX','Paket perlengkapan warung ('+pkg.name+')',pkg.total,'capex',pkg.items);
 S.warung.open=true;
 S.warung.autoMode=false;S.warung.successfulSales=S.warung.successfulSales||0;
 say('Mentor','🤖','Warung berdiri! Mode manual aktif. Setelah 3 transaksi berhasil, mode otomatis dapat dipilih.');
 save();closeModal();render();
}
function materialPlan(){
 const w=DATA.weather[S.cuaca]||DATA.weather.panas;
 const location=(S.warung&&S.warung.location)||'depanRumah';
 const demand=demandToday(location),target=Math.ceil(demand*1.5);
 const current={ice:Math.max(0,Number(S.warung.ice)||0),sugar:Math.max(0,Number(S.warung.sugar)||0),cups:Math.max(0,Number(S.warung.cups)||0)};
 const deficit={ice:Math.max(0,target-current.ice),sugar:Math.max(0,target-current.sugar),cups:Math.max(0,target-current.cups)};
 const need={ice:Math.ceil(deficit.ice/DATA.shop.iceKarung.portions),sugar:Math.ceil(deficit.sugar/DATA.shop.sugarBloc.portions),cups:Math.ceil(deficit.cups/DATA.shop.cupPack.pcs)};
 return {w,demand,target,current,deficit,need};
}
function shopMaterials(){
 const p=materialPlan(),k=p.need.ice,g=p.need.sugar,c=p.need.cups;
 const total=k*DATA.shop.iceKarung.price+g*DATA.shop.sugarBloc.price+c*DATA.shop.cupPack.price;
 showModal('<h3>🛒 Belanja Bahan Warung</h3>'+
 '<p>Cuaca: <b>'+p.w.name+'</b> | Target permintaan hari ini: <b>'+p.demand+' gelas</b></p>'+
 '<p>Target stok 150% permintaan = <b>'+p.target+' unit</b> per bahan. Jika stok sudah mencapai/melewati batas, rekomendasi pembelian menjadi nol.</p>'+
 '<div style="background:#e3f2fd;padding:10px;border-radius:6px;margin:10px 0">'+
 '<p><strong>🤖 Rekomendasi berbasis kekurangan stok:</strong></p>'+
 '<p>🧊 Es: stok '+p.current.ice+' porsi; '+(k?'beli '+k+' karung ('+(k*DATA.shop.iceKarung.portions)+' porsi)':'stok memenuhi target — 0 karung')+'.</p>'+
 '<p>🍯 Gula: stok '+p.current.sugar+' porsi; '+(g?'beli '+g+' blok ('+(g*DATA.shop.sugarBloc.portions)+' porsi)':'stok memenuhi target — 0 blok')+'.</p>'+
 '<p>🥤 Cup: stok '+p.current.cups+' pcs; '+(c?'beli '+c+' pak ('+(c*DATA.shop.cupPack.pcs)+' pcs)':'stok memenuhi target — 0 pak')+'.</p>'+
 '<p style="font-size:12px">Item juga dikunci ke 0 bila satu paket utuh akan melampaui batas stok 150% target.</p>'+
 '<p><b>Total: '+rp(total)+'</b></p></div>'+
 '<button class="btn btn-success" '+(total===0?'disabled ':'')+'onclick="buyRecommended('+k+','+g+','+c+')">✅ '+(total===0?'Tidak perlu belanja':'Beli sesuai rekomendasi')+'</button> '+
 '<button class="btn btn-primary" onclick="showManualShop()">⚙️ Atur Manual (tetap dibatasi)</button> '+
 '<button class="btn" onclick="closeModal()">Tutup</button>');
}
function buyRecommended(k,g,c){
 k=Math.max(0,Math.min(1000,Math.floor(Number(k)||0)));
 g=Math.max(0,Math.min(1000,Math.floor(Number(g)||0)));
 c=Math.max(0,Math.min(1000,Math.floor(Number(c)||0)));
 const total=k*DATA.shop.iceKarung.price+g*DATA.shop.sugarBloc.price+c*DATA.shop.cupPack.price;
 if(total===0){msg('Stok sudah memenuhi target permintaan saat ini.');return;}
 if(S.gold<total){msg('Uang tidak cukup. Total belanja: '+rp(total));return;}
 spend('BELANJA','Belanja bahan (rekomendasi)',total,'shopping',[
  {name:'Es Batu '+k+' karung',qty:k,subtotal:k*DATA.shop.iceKarung.price},
  {name:'Gula Merah '+g+' blok',qty:g,subtotal:g*DATA.shop.sugarBloc.price},
  {name:'Cup Plastik '+c+' pak',qty:c,subtotal:c*DATA.shop.cupPack.price}
 ]);
 S.warung.ice=(S.warung.ice||0)+k*DATA.shop.iceKarung.portions;
 S.warung.sugar=(S.warung.sugar||0)+g*DATA.shop.sugarBloc.portions;
 S.warung.cups=(S.warung.cups||0)+c*DATA.shop.cupPack.pcs;
 S.warung.iceCost=(Number(S.warung.iceCost)||0)+k*DATA.shop.iceKarung.price;
 S.warung.sugarCost=(Number(S.warung.sugarCost)||0)+g*DATA.shop.sugarBloc.price;
 S.warung.cupsCost=(Number(S.warung.cupsCost)||0)+c*DATA.shop.cupPack.price;
 if(typeof playGameSound==='function')playGameSound('purchase');
 say('Mentor','🤖','Bahan masuk gudang sesuai kekurangan stok dan ukuran paket.');
 save();closeModal();render();
}
function showManualShop(){
 showModal('<h3>⚙️ Belanja Manual</h3>'+
 '<div style="margin:8px 0"><strong>Es Batu ('+DATA.shop.iceKarung.portions+' porsi/karung, '+rp(DATA.shop.iceKarung.price)+')</strong><br><input type="number" id="m-ice" min="0" value="0" style="width:80px"> karung</div>'+
 '<div style="margin:8px 0"><strong>Gula Merah ('+DATA.shop.sugarBloc.portions+' porsi/blok, '+rp(DATA.shop.sugarBloc.price)+')</strong><br><input type="number" id="m-sugar" min="0" value="0" style="width:80px"> blok</div>'+
 '<div style="margin:8px 0"><strong>Cup Plastik ('+DATA.shop.cupPack.pcs+' pcs/pak, '+rp(DATA.shop.cupPack.price)+')</strong><br><input type="number" id="m-cup" min="0" value="0" style="width:80px"> pak</div>'+
 '<button class="btn btn-success" onclick="buyManual()">Beli</button> <button class="btn" onclick="shopMaterials()">Kembali</button>');
}
function buyManual(){
 const k=Math.max(0,Math.min(1000,parseInt(el('m-ice').value)||0));
 const g=Math.max(0,Math.min(1000,parseInt(el('m-sugar').value)||0));
 const c=Math.max(0,Math.min(1000,parseInt(el('m-cup').value)||0));
 const total=k*DATA.shop.iceKarung.price+g*DATA.shop.sugarBloc.price+c*DATA.shop.cupPack.price;
 if(k===0&&g===0&&c===0){msg('Masukkan jumlah paket yang ingin dibeli.');return;}
 if(S.gold<total){msg('Uang tidak cukup. Total belanja: '+rp(total));return;}
 spend('BELANJA','Belanja bahan (manual)',total,'shopping',[
  {name:'Es Batu',qty:k,subtotal:k*DATA.shop.iceKarung.price},{name:'Gula Merah',qty:g,subtotal:g*DATA.shop.sugarBloc.price},{name:'Cup Plastik',qty:c,subtotal:c*DATA.shop.cupPack.price}
 ]);
 S.warung.ice=(S.warung.ice||0)+k*DATA.shop.iceKarung.portions;
 S.warung.sugar=(S.warung.sugar||0)+g*DATA.shop.sugarBloc.portions;
 S.warung.cups=(S.warung.cups||0)+c*DATA.shop.cupPack.pcs;
 S.warung.iceCost=(Number(S.warung.iceCost)||0)+k*DATA.shop.iceKarung.price;
 S.warung.sugarCost=(Number(S.warung.sugarCost)||0)+g*DATA.shop.sugarBloc.price;
 S.warung.cupsCost=(Number(S.warung.cupsCost)||0)+c*DATA.shop.cupPack.price;
 if(typeof playGameSound==='function')playGameSound('purchase');
 save();closeModal();render();
}
function buyFridge(){
 if(S.warung.fridge){msg('⚠️ Sudah punya kulkas.');return;}
 if(S.gold<DATA.shop.fridge.price){msg('⚠️ Uang tidak cukup.');return;}
 spend('CAPEX','Beli Kulkas Mini',DATA.shop.fridge.price,'capex');
 S.warung.fridge=true;S.warung.fridgeCap=DATA.shop.fridge.capacity;
 if(typeof playGameSound==='function')playGameSound('purchase');
 say('Mentor','🤖','Kulkas terpasang! Es sisa tidak akan mencair malam ini.');
 save();render();
}
function sellTengkulak(){
 if(stockClass()!=='muda'){msg('⚠️ Tengkulak hanya membeli butir muda.');return;}
 const q=stockQty(), biasaQty=S.stock.biasa||0, superQty=S.stock.super||0;
 const rev=(biasaQty*DATA.priceTengkulak.biasa)+(superQty*DATA.priceTengkulak.super);
 showModal('<h3>🧑‍💼 Pak Tengkulak Datang</h3>'+
 '<p>"Halo Bos '+S.name+'! Saya tawar harga standar: biasa Rp 3.500, super Rp 5.000. Saya borong semua."</p>'+
 '<p><b>Total Penawaran: '+rp(rev)+'</b></p>'+
 '<button class="btn btn-success" onclick="confirmSellTengkulak(true,'+rev+')">✅ Jual Semua</button> '+
 '<button class="btn" onclick="closeModal()">❌ Tidak Jadi</button>');
}
function confirmSellTengkulak(jual,rev){
 closeModal();
 if(!jual){say('Tengkulak','🧑‍💼','"Yaudah, lain kali aja ya Bos."');save();render();return;}
 const soldQty=stockQty();
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):soldQty*3500;
 if(stockValue>0)recordBusinessCogs('HPP kelapa dijual ke tengkulak',[{account:'Persediaan Kelapa',amount:stockValue}]);
 earn('PENJUALAN','Jual tengkulak '+soldQty+' butir',rev,{biasa:S.stock.biasa,super:S.stock.super});
 S.dayLog.sales.tengkulak=soldQty;S.dayLog.sales.tengkulakRev=rev;
 S.stats.tengkulak+=soldQty;S.stock={biasa:0,super:0};S.stockCostValue=0;
 say('Tengkulak','🧑‍💼','"Makasih Bos! Saya angkut semua ya."');
 save();render();
}
function sellPasar(){
 if(stockClass()!=='tua'){msg('⚠️ Pasar hanya membeli kelapa tua.');return;}
 const q=stockQty(),rev=q*DATA.pricePasarTua;
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):q*3500;
 if(stockValue>0)recordBusinessCogs('HPP kelapa tua dijual ke pasar',[{account:'Persediaan Kelapa',amount:stockValue}]);
 earn('PENJUALAN','Jual pasar kelapa tua '+q+' butir',rev);
 S.dayLog.sales.pasar=q;S.dayLog.sales.pasarRev=rev;
 S.stock={biasa:0,super:0};S.stockCostValue=0;
 say('Pedagang','👩‍🌾','Yang tua saya ambil untuk santan.');
 save();render();
}
function demandToday(location){const loc=DATA.warungLocations[location||((S.warung&&S.warung.location)||'depanRumah')]||DATA.warungLocations.depanRumah;const weather=S.cuaca||'panas';const minimum=(loc.minBuyersByWeather&&loc.minBuyersByWeather[weather])??(DATA.weather[weather]||DATA.weather.panas).minBuyers;let demand=minimum+Math.floor(Math.random()*30);if((location||((S.warung&&S.warung.location)||'depanRumah'))==='depanRumah'&&weather==='hujan')demand=Math.min(demand,45);return demand;}
function wholeBuyersToday(){const r=((S.day*104729)%100)/100;const w=DATA.weather[S.cuaca];const base=r<0.3?1:r<0.6?2:r<0.8?3:r<0.9?4:r<0.96?5:6;return Math.max(1,Math.ceil(base*w.wholeMult));}
function recordBusinessCogs(desc,components){
 const valid=(components||[]).filter(x=>Number.isFinite(Number(x.amount))&&Number(x.amount)>0);
 const total=valid.reduce((sum,x)=>sum+Number(x.amount),0);
 if(total<=0)return 0;
 const lines=[{account:'HPP Penjualan',debit:total,credit:0}];
 valid.forEach(x=>lines.push({account:x.account,debit:0,credit:Number(x.amount)}));
 S.dayLog.cogs=(Number(S.dayLog.cogs)||0)+total;
 S.dayLog.expense=(Number(S.dayLog.expense)||0)+total;
 ledger('HPP',desc,-total,{components:valid},{classification:'business_cogs',debitAccount:'HPP Penjualan',creditAccount:valid.map(x=>x.account).join(' / '),debit:total,credit:total,basis:'noncash',lines});
 return total;
}
function takeCoconut(){
 if(S.quarterUsed>0){
  const unitCost=Math.max(0,Number(S.quarterCost)||3500);
  S.quarterUsed++;
  if(S.quarterUsed>=4){S.quarterUsed=0;S.quarterCost=0;}
  return unitCost/4;
 }
 const qty=stockQty();
 if(qty<=0)return false;
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):qty*3500;
 const unitCost=stockValue/qty;
 if(S.stock.biasa>0)S.stock.biasa--;else S.stock.super--;
 S.stockCostValue=Math.max(0,stockValue-unitCost);
 S.quarterUsed=1;S.quarterCost=unitCost;S.dayLog.materials.kelapa++;
 return unitCost/4;
}
function trySellEs(){
 if((S.warung.ice||0)<=0||(S.warung.sugar||0)<=0||(S.warung.cups||0)<=0)return false;
 const coconutCost=takeCoconut();
 if(coconutCost===false)return false;
 const iceQty=Number(S.warung.ice)||0,sugarQty=Number(S.warung.sugar)||0,cupQty=Number(S.warung.cups)||0;
 const iceCost=iceQty>0?(Number(S.warung.iceCost)||iceQty*(DATA.shop.iceKarung.price/DATA.shop.iceKarung.portions))/iceQty:DATA.shop.iceKarung.price/DATA.shop.iceKarung.portions;
 const sugarCost=sugarQty>0?(Number(S.warung.sugarCost)||sugarQty*(DATA.shop.sugarBloc.price/DATA.shop.sugarBloc.portions))/sugarQty:DATA.shop.sugarBloc.price/DATA.shop.sugarBloc.portions;
 const cupCost=cupQty>0?(Number(S.warung.cupsCost)||cupQty*(DATA.shop.cupPack.price/DATA.shop.cupPack.pcs))/cupQty:DATA.shop.cupPack.price/DATA.shop.cupPack.pcs;
 S.warung.ice--;S.warung.sugar--;S.warung.cups--;
 S.warung.iceCost=Math.max(0,(Number(S.warung.iceCost)||iceQty*iceCost)-iceCost);
 S.warung.sugarCost=Math.max(0,(Number(S.warung.sugarCost)||sugarQty*sugarCost)-sugarCost);
 S.warung.cupsCost=Math.max(0,(Number(S.warung.cupsCost)||cupQty*cupCost)-cupCost);
 S.dayLog.materials.ice++;S.dayLog.materials.sugar++;S.dayLog.materials.cup++;
 recordBusinessCogs('HPP es kelapa 1 gelas',[
  {account:'Persediaan Kelapa',amount:coconutCost},
  {account:'Persediaan Es',amount:iceCost},
  {account:'Persediaan Gula',amount:sugarCost},
  {account:'Persediaan Cup',amount:cupCost}
 ]);
 earn('PENJUALAN','Es kelapa 1 gelas',DATA.es.price);
 S.dayLog.sales.es++;S.dayLog.sales.esRev+=DATA.es.price;S.stats.es++;
 if(S.warung){S.warung.successfulSales=(S.warung.successfulSales||0)+1;}
 return true;
}
function trySellWhole(){
 if(stockQty()<=0&&S.quarterUsed===0)return false;
 if(S.quarterUsed>0){
  const remainingCost=(Number(S.quarterCost)||3500)*(4-S.quarterUsed)/4;
  if(remainingCost>0)recordBusinessCogs('Susut kelapa terbuka sebelum penjualan utuh',[{account:'Persediaan Kelapa Dalam Proses',amount:remainingCost}]);
  S.quarterUsed=0;S.quarterCost=0;
 }
 if(stockQty()<=0)return false;
 const qty=stockQty();
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):qty*3500;
 const unitCost=stockValue/qty;
 if(S.stock.biasa>0)S.stock.biasa--;else S.stock.super--;
 S.stockCostValue=Math.max(0,stockValue-unitCost);
 S.dayLog.materials.kelapa++;
 recordBusinessCogs('HPP kelapa utuh 1 butir',[{account:'Persediaan Kelapa',amount:unitCost}]);
 earn('PENJUALAN','Kelapa utuh 1 butir',DATA.wholePrice);
 S.dayLog.sales.whole++;S.dayLog.sales.wholeRev+=DATA.wholePrice;S.stats.whole++;
 if(typeof playGameSound==='function')playGameSound('sale');
 if(S.warung){S.warung.successfulSales=(S.warung.successfulSales||0)+1;}
 return true;
}
function buyLivingItem(key){
 const item=DATA.living[key];if(!item)return;
 if(S.gold<item.price){msg('⚠️ Uang tidak cukup.');return;}
 spend('HIDUP','Beli '+item.name,item.price,'living');
 const oldStock=Math.max(0,Number(S.livingStock[key])||0);
 S.livingStock[key]=oldStock+1;
 if(oldStock===0){if(!S.livingUseDays)S.livingUseDays={};S.livingUseDays[key]=0;}
 save();render();
}
function emptySlots(){return DATA.slots-S.trees.length;}
function buySeedling(n){
 const currentMonth=monthOf(S.day);
 if(S.purchases&&S.purchases.seedlingMonth===currentMonth){msg('Pembelian bibit bulan ini sudah digunakan. Mentor akan membuka kembali menu pada bulan berikutnya.');return;}
 n=Math.max(1,Math.floor(n));
 if(n>emptySlots()){msg('⚠️ Slot kosong tinggal '+emptySlots()+'.');return;}
 const cost=n*(DATA.seedling.price+DATA.seedling.labor);
 if(S.gold<cost){msg('⚠️ Uang tidak cukup: '+rp(cost)+'.');return;}
 spend('CAPEX','Bibit super '+n+' pohon',cost,'capex',{pohon:n});
 if(typeof playGameSound==='function')playGameSound('purchase');
 for(let i=0;i<n;i++)S.trees.push({slot:S.trees.length,type:'super',plantedDay:S.day,mature:false,lastHarvest:null});
 if(!S.purchases)S.purchases={};S.purchases.seedlingMonth=currentMonth;
 save();render();showAccelOffer();
}
function accelIAP(){
 // Jangan mengaku menerima pembayaran tanpa verifikasi server dari penyedia pembayaran.
 const im=(S.trees||[]).filter(t=>!isMature(t));
 if(!im.length){msg('Tidak ada pohon yang membutuhkan percepatan.');return;}
 msg('Speedy: harga rancangan US$1 per 20 pohon. Pembelian belum aktif karena backend pembayaran dan verifikasi transaksi belum terpasang. Tidak ada uang yang ditagih atau pertumbuhan yang diubah.');
 showModal('<h3>⚡ Speedy — Percepatan Kebun</h3><p>Rancangan harga: <b>US$1 per 20 pohon</b>. Untuk melindungi pemain, fitur belum menerima pembayaran sampai tersedia backend pembayaran, validasi tanda tangan/webhook, pencegahan transaksi ganda, dan pencatatan pesanan.</p><p>Tidak ada pembayaran yang dilakukan pada layar ini. Setelah integrasi resmi selesai, pembelian akan diterapkan hanya pada pohon yang dipilih dan transaksi terverifikasi.</p><button class="btn" onclick="closeModal()">Tutup</button>');
}
function accelAd(){
 if(S.lastAdDay===S.day){msg('⚠️ Skip iklan sudah dipakai hari ini.');return;}
 S.trees.forEach(t=>{if(!isMature(t))t.plantedDay-=DATA.accel.adDays;});
 S.lastAdDay=S.day;ledger('IKLAN','Skip pertumbuhan 30 hari',0);
 save();render();
}
function choosePath(p){
 S.path=p;
 say('Mentor','🤖','Jalur dipilih: '+DATA.paths[p].name+'.');
 save();render();
}

// ACHIEVEMENT CHECK - dipanggil setelah setiap aksi penting
function triggerAchievementCheck() {
  if (typeof checkAllAchievements === 'function') {
    checkAllAchievements();
  }
}

// Override earn() untuk trigger achievement
const originalEarn = earn;
earn = function(cat, desc, amt, detail) {
  originalEarn(cat, desc, amt, detail);
  triggerAchievementCheck();
};
