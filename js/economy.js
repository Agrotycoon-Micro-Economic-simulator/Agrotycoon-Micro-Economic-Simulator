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
 let value;
 try{value=Number(amt);}catch(_){value=NaN;}
 if(!Number.isFinite(value)||value<0){
  msg('⚠️ Nilai pengeluaran tidak valid. Transaksi dibatalkan.');
  return false;
 }
 if(!Number.isFinite(S.gold)||S.gold<value){
  msg('⚠️ Kas tidak cukup untuk pengeluaran ini. Transaksi dibatalkan.');
  return false;
 }
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
 return true;
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
function kelapaMarketQuote(referencePrice){
 const reference=Number(referencePrice);
 const nationalCurrent=typeof MARKET_ENGINE!=="undefined"&&MARKET_ENGINE?Number(MARKET_ENGINE.getPrice("kelapa")):3500;
 const current=typeof AgroNationalEconomy!=="undefined"&&S.playerRegionId?Number(AgroNationalEconomy.quote(S.playerRegionId,"kelapa",nationalCurrent)||nationalCurrent):nationalCurrent;
 if(!Number.isFinite(reference)||reference<=0||!Number.isFinite(current)||current<=0)return reference;
 return Math.max(1,Math.round(reference*(current/3500)));
}
function buyKelapaLuar(sumber){
 const harga = kelapaMarketQuote(sumber==='petani'?DATA.buyFromFarmer:DATA.buyFromTengkulak);
 showModal('<h3>🥥 Beli Kelapa dari '+(sumber==='petani'?'Petani Lain':'Tengkulak')+'</h3>'+
 '<p>Harga: '+rp(harga)+'/butir (muda, siap olah)</p>'+
 '<input type="number" id="inp-buy" min="1" max="200" value="20" placeholder="Jumlah butir...">'+
 '<button class="btn btn-success" onclick="confirmBuyKelapa(\''+sumber+'\')">Beli</button> '+
 '<button class="btn" onclick="closeModal()">Batal</button>');
}
function confirmBuyKelapa(sumber){
 const currentMonth=monthOf(S.day);
 if(S.purchases&&S.purchases.externalCoconutMonth===currentMonth){msg('Pembelian kelapa luar bulan ini sudah digunakan. Menu dibuka lagi pada tanggal 15 bulan berikutnya.');return;}
 const inp=el('inp-buy'); const rawQty=inp?String(inp.value).trim():''; const qty=rawQty===''?NaN:Number(rawQty);
 if(!Number.isInteger(qty)||qty<1||qty>200){msg('⚠️ Jumlah harus bilangan bulat antara 1 dan 200 butir.');return;}
 const harga=kelapaMarketQuote(sumber==='petani'?DATA.buyFromFarmer:DATA.buyFromTengkulak);
 const total=qty*harga;
 if(S.gold<total){msg('⚠️ Uang tidak cukup.');return;}
 spend('BELANJA','Beli '+qty+' butir dari '+(sumber==='petani'?'petani':'tengkulak'),total,'shopping',{sumber,butir:qty});
 if(typeof playGameSound==='function')playGameSound('purchase');
 if(!S.purchases)S.purchases={};S.purchases.externalCoconutMonth=currentMonth;
 const oldQty=stockQty();
 const oldValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):oldQty*3500;
 S.stockCostValue=oldValue+total;
 S.stock.biasa=(S.stock.biasa||0)+qty; S.harvestDay=S.day;
 if(sumber==='petani'&&typeof queueMarketTransaction==='function')queueMarketTransaction({commodityId:'kelapa',side:'buy',quantity:qty,price:harga,marketStage:'producer',source:'player_purchase_from_farmer'});
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
 // Never recommend a whole package that pushes any material above the 150% target.
 // Buy only complete packages that fit; if one package would exceed the cap, recommend zero.
 const packCount=(key,packSize)=>{
  if(!(packSize>0)||deficit[key]<packSize)return 0;
  return Math.max(0,Math.floor(deficit[key]/packSize));
 };
 const need={
  ice:packCount('ice',DATA.shop.iceKarung.portions),
  sugar:packCount('sugar',DATA.shop.sugarBloc.portions),
  cups:packCount('cups',DATA.shop.cupPack.pcs)
 };
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
 const validCount=value=>Number.isSafeInteger(value)&&value>=0&&value<=1000;
 if(!validCount(k)||!validCount(g)||!validCount(c)){
  msg('⚠️ Rekomendasi belanja tidak valid. Tidak ada perubahan transaksi.');return;
 }
 // Modal values can become stale while it is open. Recalculate the permitted package
 // counts at confirmation time so stock/demand changes cannot bypass the 150% cap.
 const currentPlan=materialPlan();
 if(k!==currentPlan.need.ice||g!==currentPlan.need.sugar||c!==currentPlan.need.cups){
  msg('⚠️ Stok atau permintaan berubah. Buka ulang rekomendasi sebelum membeli.');return;
 }
 const total=k*DATA.shop.iceKarung.price+g*DATA.shop.sugarBloc.price+c*DATA.shop.cupPack.price;
 if(!Number.isFinite(total)||total<=0){msg('Stok sudah memenuhi target permintaan saat ini.');return;}
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
 const readPackageCount=(id)=>{
  const input=el(id),raw=input?String(input.value).trim():'';
  if(!/^\d+$/.test(raw))return null;
  const value=Number(raw);
  return Number.isSafeInteger(value)&&value>=0&&value<=1000?value:null;
 };
 const k=readPackageCount('m-ice'),g=readPackageCount('m-sugar'),c=readPackageCount('m-cup');
 if(k===null||g===null||c===null){msg('⚠️ Jumlah tiap paket harus bilangan bulat antara 0 dan 1.000. Tidak ada perubahan transaksi.');return;}
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
 const ordinaryOffer=kelapaMarketQuote(DATA.priceTengkulak.biasa),superOffer=kelapaMarketQuote(DATA.priceTengkulak.super);
 const rev=(biasaQty*ordinaryOffer)+(superQty*superOffer);
 showModal('<h3>🧑‍💼 Pak Tengkulak Datang</h3>'+
 '<p>"Halo Bos '+S.name+'! Penawaran saat ini: biasa '+rp(ordinaryOffer)+', super '+rp(superOffer)+'. Saya borong semua."</p>'+
 '<p><b>Total Penawaran: '+rp(rev)+'</b></p>'+
 '<button class="btn btn-success" onclick="confirmSellTengkulak(true,'+rev+')">✅ Jual Semua</button> '+
 '<button class="btn" onclick="closeModal()">❌ Tidak Jadi</button>');
}
function confirmSellTengkulak(jual,rev){
 closeModal();
 if(!jual){say('Tengkulak','🧑‍💼','"Yaudah, lain kali aja ya Bos."');save();render();return;}
 const soldQty=stockQty();
 // The confirmation is the transaction boundary: revalidate stock and recompute proceeds
 // from current quantities, rather than trusting the amount captured by the modal.
 if(soldQty<=0||stockClass()!=='muda'){msg('⚠️ Stok kelapa muda sudah tidak tersedia. Penjualan dibatalkan.');save();render();return;}
 const soldBiasa=Math.max(0,Number(S.stock.biasa)||0),soldSuper=Math.max(0,Number(S.stock.super)||0);
 const ordinaryUnitPrice=kelapaMarketQuote(DATA.priceTengkulak.biasa),superUnitPrice=kelapaMarketQuote(DATA.priceTengkulak.super);
 const saleRevenue=soldBiasa*ordinaryUnitPrice+soldSuper*superUnitPrice;
 if(!Number.isFinite(saleRevenue)||saleRevenue<=0){msg('⚠️ Nilai penjualan tidak valid. Transaksi dibatalkan.');save();render();return;}
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):soldQty*3500;
 if(!Number.isFinite(stockValue)||stockValue<=0){msg('⚠️ Nilai persediaan kelapa tidak valid. Penjualan dibatalkan.');save();render();return;}
 const unitCost=stockValue/soldQty;
 if(!Number.isFinite(unitCost)||unitCost<=0){
  msg('⚠️ Biaya unit kelapa tidak valid. Penjualan dibatalkan.');save();render();return;
 }
 // Validate unit economics at the confirmation boundary before HPP, revenue, or stock mutation.
 // Existing accounting remains the sole owner of HPP posting.
 const weightedSalePrice=(soldBiasa*ordinaryUnitPrice+soldSuper*superUnitPrice)/soldQty;
 if(!Number.isFinite(weightedSalePrice)||weightedSalePrice<=0||
    !validateYoungCoconutTengkulakUnitEconomics(weightedSalePrice,unitCost)){
  msg('⚠️ Unit economics kelapa muda ke tengkulak tidak valid. Penjualan dibatalkan.');save();render();return;
 }
 if(recordBusinessCogs('HPP kelapa dijual ke tengkulak',[{account:'Persediaan Kelapa',amount:stockValue}])!==stockValue){msg('⚠️ HPP kelapa tidak valid. Penjualan dibatalkan.');save();render();return;}
 earn('PENJUALAN','Jual tengkulak '+soldQty+' butir',saleRevenue,{biasa:soldBiasa,super:soldSuper});
 if(typeof queueMarketTransaction==='function'){
  if(soldBiasa>0)queueMarketTransaction({commodityId:'kelapa',side:'sell',quantity:soldBiasa,price:ordinaryUnitPrice,marketStage:'producer',source:'player_sale_to_collector'});
  if(soldSuper>0)queueMarketTransaction({commodityId:'kelapa',side:'sell',quantity:soldSuper,price:superUnitPrice,marketStage:'producer',source:'player_sale_to_collector'});
 }
 S.dayLog.sales.tengkulak=soldQty;S.dayLog.sales.tengkulakRev=saleRevenue;
 S.stats.tengkulak+=soldQty;S.stock={biasa:0,super:0};S.stockCostValue=0;
 say('Tengkulak','🧑‍💼','"Makasih Bos! Saya angkut semua ya."');
 save();render();
}
function sellPasar(){
 if(stockClass()!=='tua'){msg('⚠️ Pasar hanya membeli kelapa tua.');return;}
 const q=stockQty(),salePrice=kelapaMarketQuote(DATA.pricePasarTua),rev=q*salePrice;
 if(!Number.isSafeInteger(q)||q<=0||!Number.isFinite(rev)||rev<=0){msg('⚠️ Kuantitas atau pendapatan penjualan pasar tidak valid. Transaksi dibatalkan.');save();render();return;}
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):q*3500;
 if(!Number.isFinite(stockValue)||stockValue<=0){msg('⚠️ Nilai persediaan kelapa tidak valid. Penjualan dibatalkan.');save();render();return;}
 const unitCost=stockValue/q;
 if(!Number.isFinite(unitCost)||unitCost<=0||!validateOldCoconutMarketUnitEconomics(salePrice,unitCost)){msg('⚠️ Unit economics kelapa tua tidak valid. Penjualan dibatalkan.');save();render();return;}
 if(recordBusinessCogs('HPP kelapa tua dijual ke pasar',[{account:'Persediaan Kelapa',amount:stockValue}])!==stockValue){msg('⚠️ HPP kelapa tidak valid. Penjualan dibatalkan.');save();render();return;}
 earn('PENJUALAN','Jual pasar kelapa tua '+q+' butir',rev);
 if(typeof queueMarketTransaction==='function')queueMarketTransaction({commodityId:'kelapa',side:'sell',quantity:q,price:salePrice,marketStage:'producer',source:'player_sale_to_market'});
 S.dayLog.sales.pasar=q;S.dayLog.sales.pasarRev=rev;
 S.stock={biasa:0,super:0};S.stockCostValue=0;
 say('Pedagang','👩‍🌾','Yang tua saya ambil untuk santan.');
 save();render();
}
function demandToday(location){const loc=DATA.warungLocations[location||((S.warung&&S.warung.location)||'depanRumah')]||DATA.warungLocations.depanRumah;const weather=S.cuaca||'panas';const minimum=(loc.minBuyersByWeather&&loc.minBuyersByWeather[weather])??(DATA.weather[weather]||DATA.weather.panas).minBuyers;let demand=minimum+Math.floor(Math.random()*30);if((location||((S.warung&&S.warung.location)||'depanRumah'))==='depanRumah'&&weather==='hujan')demand=Math.min(demand,45);return demand;}
function wholeBuyersToday(){const r=((S.day*104729)%100)/100;const w=DATA.weather[S.cuaca];const base=r<0.3?1:r<0.6?2:r<0.8?3:r<0.9?4:r<0.96?5:6;return Math.max(1,Math.ceil(base*w.wholeMult));}
function businessCogsComponents(components){
 if(!Array.isArray(components)||components.length===0)return false;
 const valid=[];
 for(const component of components){
  if(!component||typeof component.account!=='string'||!component.account.trim())return false;
  const amount=Number(component.amount);
  if(!Number.isFinite(amount)||amount<0)return false;
  if(amount>0)valid.push({account:component.account,amount});
 }
 const total=valid.reduce((sum,x)=>sum+x.amount,0);
 if(!Number.isFinite(total)||total<=0)return false;
 return {valid,total};
}
function businessCogsTotal(components){
 const validated=businessCogsComponents(components);
 return validated===false?0:validated.total;
}
function recordBusinessCogs(desc,components){
 // Validate the full cost set before touching any accounting totals or ledger state.
 const validated=businessCogsComponents(components);
 if(validated===false)return 0;
 const {valid,total}=validated;
 const lines=[{account:'HPP Penjualan',debit:total,credit:0}];
 valid.forEach(x=>lines.push({account:x.account,debit:0,credit:Number(x.amount)}));
 S.dayLog.cogs=(Number(S.dayLog.cogs)||0)+total;
 S.dayLog.expense=(Number(S.dayLog.expense)||0)+total;
 if(!S.dayLog.cogsByAccount||typeof S.dayLog.cogsByAccount!=='object')S.dayLog.cogsByAccount={};
 valid.forEach(x=>{S.dayLog.cogsByAccount[x.account]=(Number(S.dayLog.cogsByAccount[x.account])||0)+Number(x.amount);});
 ledger('HPP',desc,-total,{components:valid},{classification:'business_cogs',debitAccount:'HPP Penjualan',creditAccount:valid.map(x=>x.account).join(' / '),debit:total,credit:total,basis:'noncash',lines});
 return total;
}
function transferInventoryValue(desc,amount,fromAccount,toAccount){
 const value=Number(amount)||0;
 if(!Number.isFinite(value)||value<=0)return 0;
 ledger('PERSEDIAAN',desc,0,{amount:value,fromAccount,toAccount},{
  classification:'inventory_transfer',debitAccount:toAccount,creditAccount:fromAccount,
  debit:value,credit:value,basis:'noncash',
  lines:[{account:toAccount,debit:value,credit:0},{account:fromAccount,debit:0,credit:value}]
 });
 return value;
}
function takeCoconut(){
 if(S.quarterUsed>0){
  const unitCost=Math.max(0,Number(S.quarterCost)||3500);
  S.quarterUsed++;
  if(S.quarterUsed>=4){S.quarterUsed=0;S.quarterCost=0;}
  return {cost:unitCost/4,account:'Persediaan Kelapa Dalam Proses'};
 }
 const qty=stockQty();
 if(qty<=0)return false;
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):qty*3500;
 const unitCost=stockValue/qty;
 if(S.stock.biasa>0)S.stock.biasa--;else S.stock.super--;
 S.stockCostValue=Math.max(0,stockValue-unitCost);
 S.quarterUsed=1;S.quarterCost=unitCost;S.dayLog.materials.kelapa++;
 // Remove the whole coconut from raw stock, but transfer the unconsumed 3/4 into work in process.
 const remainingCost=unitCost-(unitCost/4);
 if(remainingCost>0)transferInventoryValue('Transfer sisa kelapa ke persediaan dalam proses',remainingCost,'Persediaan Kelapa','Persediaan Kelapa Dalam Proses');
 return {cost:unitCost/4,account:'Persediaan Kelapa'};
}
function previewCoconutCost(){
 if(S.quarterUsed>0)return {cost:Math.max(0,Number(S.quarterCost)||3500)/4,account:'Persediaan Kelapa Dalam Proses'};
 const qty=stockQty();
 if(qty<=0)return false;
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):qty*3500;
 const unitCost=stockValue/qty;
 if(!Number.isFinite(unitCost)||unitCost<0)return false;
 return {cost:unitCost/4,account:'Persediaan Kelapa'};
}
function validateEsUnitEconomics(salePrice, coconutCost, iceCost, sugarCost, cupCost){
 if(typeof AgroUnitEconomics!=='object'||typeof AgroUnitEconomics.calculate!=='function')return true;
 const evidence={kind:'game_parameter',sourceUrl:'js/data.js',period:'current game config',geography:'game scenario'};
 const result=AgroUnitEconomics.calculate({
  id:'coconut-ice-live-sale',
  name:'Penjualan es kelapa aktual',
  currency:'IDR',
  sellPricePerUnit:salePrice,
  sellPriceEvidence:evidence,
  plannedSalesUnitsPerMonth:1,
  salesVolumeEvidence:evidence,
  wasteRate:0,
  wasteEvidence:evidence,
  inputs:[{
   id:'coconut',
   quantityPerOutput:1/4,
   sourcingMode:'buy',
   purchasePricePerUnit:coconutCost,
   quantityEvidence:evidence,
   purchasePriceEvidence:evidence
  }],
  variableCosts:[
   {id:'ice',costPerProducedUnit:iceCost,evidence:evidence},
   {id:'sugar',costPerProducedUnit:sugarCost,evidence:evidence},
   {id:'cup',costPerProducedUnit:cupCost,evidence:evidence}
  ],
  fixedCostsMonthly:[],
  capex:[]
 });
 return Boolean(result&&result.ok&&result.complete&&result.metrics&&Number.isFinite(result.metrics.hppPerSaleableUnit));
}
function validateWholeCoconutUnitEconomics(salePrice, coconutCost){
 if(typeof AgroUnitEconomics!=='object'||typeof AgroUnitEconomics.calculate!=='function')return true;
 const evidence={kind:'game_parameter',sourceUrl:'js/data.js',period:'current game config',geography:'game scenario'};
 const result=AgroUnitEconomics.calculate({
  id:'whole-coconut-live-sale',
  name:'Penjualan kelapa utuh aktual',
  currency:'IDR',
  sellPricePerUnit:salePrice,
  sellPriceEvidence:evidence,
  plannedSalesUnitsPerMonth:1,
  salesVolumeEvidence:evidence,
  wasteRate:0,
  wasteEvidence:evidence,
  inputs:[{
   id:'whole-coconut',
   quantityPerOutput:1,
   sourcingMode:'buy',
   purchasePricePerUnit:coconutCost,
   quantityEvidence:evidence,
   purchasePriceEvidence:evidence
  }],
  variableCosts:[],
  fixedCostsMonthly:[],
  capex:[]
 });
 return Boolean(result&&result.ok&&result.complete&&result.metrics&&Number.isFinite(result.metrics.hppPerSaleableUnit));
}function validateOldCoconutMarketUnitEconomics(salePrice, coconutCost){
 if(typeof AgroUnitEconomics!=='object'||typeof AgroUnitEconomics.calculate!=='function')return true;
 const evidence={kind:'game_parameter',sourceUrl:'js/data.js',period:'current game config',geography:'game scenario'};
 const result=AgroUnitEconomics.calculate({
  id:'old-coconut-market-live-sale',
  name:'Penjualan kelapa tua ke pasar aktual',
  currency:'IDR',
  sellPricePerUnit:salePrice,
  sellPriceEvidence:evidence,
  plannedSalesUnitsPerMonth:1,
  salesVolumeEvidence:evidence,
  wasteRate:0,
  wasteEvidence:evidence,
  inputs:[{
   id:'old-coconut',
   quantityPerOutput:1,
   sourcingMode:'buy',
   purchasePricePerUnit:coconutCost,
   quantityEvidence:evidence,
   purchasePriceEvidence:evidence
  }],
  variableCosts:[],
  fixedCostsMonthly:[],
  capex:[]
 });
 return Boolean(result&&result.ok&&result.complete&&result.metrics&&Number.isFinite(result.metrics.hppPerSaleableUnit));
}
function validateYoungCoconutTengkulakUnitEconomics(salePrice, coconutCost){
 if(typeof AgroUnitEconomics!=='object'||typeof AgroUnitEconomics.calculate!=='function')return true;
 const evidence={kind:'game_parameter',sourceUrl:'js/data.js',period:'current game config',geography:'game scenario'};
 const result=AgroUnitEconomics.calculate({
  id:'young-coconut-tengkulak-live-sale',
  name:'Penjualan kelapa muda ke tengkulak aktual',
  currency:'IDR',
  sellPricePerUnit:salePrice,
  sellPriceEvidence:evidence,
  plannedSalesUnitsPerMonth:1,
  salesVolumeEvidence:evidence,
  wasteRate:0,
  wasteEvidence:evidence,
  inputs:[{
   id:'young-coconut',
   quantityPerOutput:1,
   sourcingMode:'buy',
   purchasePricePerUnit:coconutCost,
   quantityEvidence:evidence,
   purchasePriceEvidence:evidence
  }],
  variableCosts:[],
  fixedCostsMonthly:[],
  capex:[]
 });
 return Boolean(result&&result.ok&&result.complete&&result.metrics&&Number.isFinite(result.metrics.hppPerSaleableUnit));
}


function trySellEs(){
 if((S.warung.ice||0)<=0||(S.warung.sugar||0)<=0||(S.warung.cups||0)<=0)return false;
 if(!Number.isFinite(DATA.es.price)||DATA.es.price<=0)return false;
 const coconutPreview=previewCoconutCost();
 if(coconutPreview===false)return false;
 const iceQty=Number(S.warung.ice)||0,sugarQty=Number(S.warung.sugar)||0,cupQty=Number(S.warung.cups)||0;
 const iceCost=iceQty>0?(Number(S.warung.iceCost)||iceQty*(DATA.shop.iceKarung.price/DATA.shop.iceKarung.portions))/iceQty:DATA.shop.iceKarung.price/DATA.shop.iceKarung.portions;
 const sugarCost=sugarQty>0?(Number(S.warung.sugarCost)||sugarQty*(DATA.shop.sugarBloc.price/DATA.shop.sugarBloc.portions))/sugarQty:DATA.shop.sugarBloc.price/DATA.shop.sugarBloc.portions;
 const cupCost=cupQty>0?(Number(S.warung.cupsCost)||cupQty*(DATA.shop.cupPack.price/DATA.shop.cupPack.pcs))/cupQty:DATA.shop.cupPack.price/DATA.shop.cupPack.pcs;
 const hppComponents=[
  {account:coconutPreview.account,amount:coconutPreview.cost},
  {account:'Persediaan Es',amount:iceCost},
  {account:'Persediaan Gula',amount:sugarCost},
  {account:'Persediaan Cup',amount:cupCost}
 ];
 const expectedCogs=businessCogsTotal(hppComponents);
 if(expectedCogs<=0||!validateEsUnitEconomics(DATA.es.price,coconutPreview.cost,iceCost,sugarCost,cupCost))return false;
 if(recordBusinessCogs('HPP es kelapa 1 gelas',hppComponents)!==expectedCogs)return false;
 // HPP posting is validated and recorded before raw materials or sale state changes.
 const coconut=takeCoconut();
 if(coconut===false)return false;
 S.warung.ice--;S.warung.sugar--;S.warung.cups--;
 S.warung.iceCost=Math.max(0,(Number(S.warung.iceCost)||iceQty*iceCost)-iceCost);
 S.warung.sugarCost=Math.max(0,(Number(S.warung.sugarCost)||sugarQty*sugarCost)-sugarCost);
 S.warung.cupsCost=Math.max(0,(Number(S.warung.cupsCost)||cupQty*cupCost)-cupCost);
 S.dayLog.materials.ice++;S.dayLog.materials.sugar++;S.dayLog.materials.cup++;
 earn('PENJUALAN','Es kelapa 1 gelas',DATA.es.price);
 S.dayLog.sales.es++;S.dayLog.sales.esRev+=DATA.es.price;S.stats.es++;
 if(S.warung){S.warung.successfulSales=(S.warung.successfulSales||0)+1;}
 return true;
}
function trySellWhole(){
 if(!Number.isFinite(DATA.wholePrice)||DATA.wholePrice<=0)return false;
 if(stockQty()<=0&&S.quarterUsed===0)return false;
 // Validate unit economics before any spoilage/HPP/inventory mutation. If an open
 // coconut exists, its remaining WIP cost is a separate spoilage event; the unit
 // sale itself still uses the next whole coconut's recorded unit inventory cost.
 const wholeQty=stockQty();
 if(wholeQty<=0)return false;
 const wholeStockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):wholeQty*3500;
 const wholeUnitCost=wholeStockValue/wholeQty;
 if(!Number.isFinite(wholeUnitCost)||wholeUnitCost<=0)return false;
 if(!validateWholeCoconutUnitEconomics(DATA.wholePrice,wholeUnitCost))return false;
 if(S.quarterUsed>0){
  const remainingCost=(Number(S.quarterCost)||3500)*(4-S.quarterUsed)/4;
  if(remainingCost>0&&recordBusinessCogs('Susut kelapa terbuka sebelum penjualan utuh',[{account:'Persediaan Kelapa Dalam Proses',amount:remainingCost}])!==remainingCost)return false;
  S.quarterUsed=0;S.quarterCost=0;
 }
 if(stockQty()<=0)return false;
 const qty=stockQty();
 const stockValue=Number.isFinite(S.stockCostValue)?Math.max(0,S.stockCostValue):qty*3500;
 const unitCost=stockValue/qty;
 if(!Number.isFinite(unitCost)||unitCost<=0)return false;
 if(recordBusinessCogs('HPP kelapa utuh 1 butir',[{account:'Persediaan Kelapa',amount:unitCost}])!==unitCost)return false;
 if(S.stock.biasa>0)S.stock.biasa--;else S.stock.super--;
 S.stockCostValue=Math.max(0,stockValue-unitCost);
 S.dayLog.materials.kelapa++;
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
