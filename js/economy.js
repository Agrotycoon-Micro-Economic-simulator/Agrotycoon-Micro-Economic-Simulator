function isMature(t){return t.mature||S.day>=t.plantedDay+DATA.matureDays;}
function readyTrees(){return S.trees.filter(t=>isMature(t)&&(t.lastHarvest===null||S.day-t.lastHarvest>=DATA.cycleDays));}
function spend(cat,desc,amt,field,detail){S.gold-=amt;ledger(cat,desc,-amt,detail);S.dayLog.expense+=amt;S.dayLog.cashOut=(Number(S.dayLog.cashOut)||0)+amt;if(field)S.dayLog[field]+=amt;}
function earn(cat,desc,amt,detail){S.gold+=amt;ledger(cat,desc,amt,detail);S.dayLog.gross+=amt;S.dayLog.cashIn=(Number(S.dayLog.cashIn)||0)+amt;gainXP(5);} // +5 XP per transaksi
function harvest(){
 if(stockQty()>0){msg('⚠️ Gudang masih berisi. Jual/olah dulu stok lama.');return;}
 const rt=readyTrees();if(!rt.length){msg('⚠️ Belum ada pohon siap panen.');return;}
 let b=0,su=0;
 rt.forEach(t=>{if(t.type==='super')su+=DATA.yieldSuper;else b+=DATA.yieldBiasa;t.lastHarvest=S.day;});
 const total=b+su,cost=total*DATA.laborPerFruit;
 spend('TENAGA','Upah kuli panen '+total+' butir',cost,'labor',{butir:total});
 S.stock.biasa=b;S.stock.super=su;S.harvestDay=S.day;
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
 const need={ice:Math.ceil(deficit.ice/40),sugar:Math.ceil(deficit.sugar/50),cups:Math.ceil(deficit.cups/20)};
 return {w,demand,target,current,deficit,need};
}
function shopMaterials(){
 const p=materialPlan(),k=p.need.ice,g=p.need.sugar,c=p.need.cups;
 const total=k*20000+g*20000+c*8000;
 showModal('<h3>🛒 Belanja Bahan Warung</h3>'+
 '<p>Cuaca: <b>'+p.w.name+'</b> | Target permintaan hari ini: <b>'+p.demand+' gelas</b></p>'+
 '<p>Target stok 150% permintaan = <b>'+p.target+' unit</b> per bahan. Jika stok sudah mencapai/melewati batas, rekomendasi pembelian menjadi nol.</p>'+
 '<div style="background:#e3f2fd;padding:10px;border-radius:6px;margin:10px 0">'+
 '<p><strong>🤖 Rekomendasi berbasis kekurangan stok:</strong></p>'+
 '<p>🧊 Es: stok '+p.current.ice+' porsi; '+(k?'beli '+k+' karung ('+(k*40)+' porsi)':'stok memenuhi target — 0 karung')+'.</p>'+
 '<p>🍯 Gula: stok '+p.current.sugar+' porsi; '+(g?'beli '+g+' blok ('+(g*50)+' porsi)':'stok memenuhi target — 0 blok')+'.</p>'+
 '<p>🥤 Cup: stok '+p.current.cups+' pcs; '+(c?'beli '+c+' pak ('+(c*20)+' pcs)':'stok memenuhi target — 0 pak')+'.</p>'+
 '<p style="font-size:12px">Pembelian dibulatkan ke paket utuh; stok akhir dapat sedikit melampaui target 150% karena ukuran paket.</p>'+
 '<p><b>Total: '+rp(total)+'</b></p></div>'+
 '<button class="btn btn-success" '+(total===0?'disabled ':'')+'onclick="buyRecommended('+k+','+g+','+c+')">✅ '+(total===0?'Tidak perlu belanja':'Beli sesuai rekomendasi')+'</button> '+
 '<button class="btn btn-primary" onclick="showManualShop()">⚙️ Atur Manual (tetap dibatasi)</button> '+
 '<button class="btn" onclick="closeModal()">Tutup</button>');
}
function buyRecommended(k,g,c){
 k=Math.max(0,Math.min(1000,Math.floor(Number(k)||0)));
 g=Math.max(0,Math.min(1000,Math.floor(Number(g)||0)));
 c=Math.max(0,Math.min(1000,Math.floor(Number(c)||0)));
 const total=k*20000+g*20000+c*8000;
 if(total===0){msg('Stok sudah memenuhi target permintaan saat ini.');return;}
 if(S.gold<total){msg('Uang tidak cukup. Total belanja: '+rp(total));return;}
 spend('BELANJA','Belanja bahan (rekomendasi)',total,'shopping',[
  {name:'Es Batu '+k+' karung',qty:k,subtotal:k*20000},
  {name:'Gula Merah '+g+' blok',qty:g,subtotal:g*20000},
  {name:'Cup Plastik '+c+' pak',qty:c,subtotal:c*8000}
 ]);
 S.warung.ice=(S.warung.ice||0)+k*40;
 S.warung.sugar=(S.warung.sugar||0)+g*50;
 S.warung.cups=(S.warung.cups||0)+c*20;
 if(typeof playGameSound==='function')playGameSound('purchase');
 say('Mentor','🤖','Bahan masuk gudang sesuai kekurangan stok dan ukuran paket.');
 save();closeModal();render();
}
function showManualShop(){
 showModal('<h3>⚙️ Belanja Manual</h3>'+
 '<div style="margin:8px 0"><strong>Es Batu (40 porsi/karung, Rp 20.000)</strong><br><input type="number" id="m-ice" min="0" value="0" style="width:80px"> karung</div>'+
 '<div style="margin:8px 0"><strong>Gula Merah (50 porsi/blok, Rp 20.000)</strong><br><input type="number" id="m-sugar" min="0" value="0" style="width:80px"> blok</div>'+
 '<div style="margin:8px 0"><strong>Cup Plastik (20 pcs/pak, Rp 8.000)</strong><br><input type="number" id="m-cup" min="0" value="0" style="width:80px"> pak</div>'+
 '<button class="btn btn-success" onclick="buyManual()">Beli</button> <button class="btn" onclick="shopMaterials()">Kembali</button>');
}
function buyManual(){
 const k=Math.max(0,Math.min(1000,parseInt(el('m-ice').value)||0));
 const g=Math.max(0,Math.min(1000,parseInt(el('m-sugar').value)||0));
 const c=Math.max(0,Math.min(1000,parseInt(el('m-cup').value)||0));
 const total=k*20000+g*20000+c*8000;
 if(k===0&&g===0&&c===0){msg('Masukkan jumlah paket yang ingin dibeli.');return;}
 if(S.gold<total){msg('Uang tidak cukup. Total belanja: '+rp(total));return;}
 spend('BELANJA','Belanja bahan (manual)',total,'shopping',[
  {name:'Es Batu',qty:k,subtotal:k*20000},{name:'Gula Merah',qty:g,subtotal:g*20000},{name:'Cup Plastik',qty:c,subtotal:c*8000}
 ]);
 S.warung.ice=(S.warung.ice||0)+k*40;
 S.warung.sugar=(S.warung.sugar||0)+g*50;
 S.warung.cups=(S.warung.cups||0)+c*20;
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
 earn('PENJUALAN','Jual tengkulak '+stockQty()+' butir',rev,{biasa:S.stock.biasa,super:S.stock.super});
 S.dayLog.sales.tengkulak=stockQty();S.dayLog.sales.tengkulakRev=rev;
 S.stats.tengkulak+=stockQty();S.stock={biasa:0,super:0};
 say('Tengkulak','🧑‍💼','"Makasih Bos! Saya angkut semua ya."');
 save();render();
}
function sellPasar(){
 if(stockClass()!=='tua'){msg('⚠️ Pasar hanya membeli kelapa tua.');return;}
 const q=stockQty(),rev=q*DATA.pricePasarTua;
 earn('PENJUALAN','Jual pasar kelapa tua '+q+' butir',rev);
 S.dayLog.sales.pasar=q;S.dayLog.sales.pasarRev=rev;
 S.stock={biasa:0,super:0};
 say('Pedagang','👩‍🌾','Yang tua saya ambil untuk santan.');
 save();render();
}
function demandToday(location){const loc=DATA.warungLocations[location||((S.warung&&S.warung.location)||'depanRumah')]||DATA.warungLocations.depanRumah;const weather=S.cuaca||'panas';const minimum=(loc.minBuyersByWeather&&loc.minBuyersByWeather[weather])??(DATA.weather[weather]||DATA.weather.panas).minBuyers;let demand=minimum+Math.floor(Math.random()*30);if((location||((S.warung&&S.warung.location)||'depanRumah'))==='depanRumah'&&weather==='hujan')demand=Math.min(demand,45);return demand;}
function wholeBuyersToday(){const r=((S.day*104729)%100)/100;const w=DATA.weather[S.cuaca];const base=r<0.3?1:r<0.6?2:r<0.8?3:r<0.9?4:r<0.96?5:6;return Math.max(1,Math.ceil(base*w.wholeMult));}
function takeCoconut(){
 if(S.quarterUsed>0){S.quarterUsed++;if(S.quarterUsed>=4)S.quarterUsed=0;return true;}
 if(stockQty()<=0)return false;
 if(S.stock.biasa>0)S.stock.biasa--;else S.stock.super--;
 S.quarterUsed=1;S.dayLog.materials.kelapa++;return true;
}
function trySellEs(){
 if((S.warung.ice||0)<=0||(S.warung.sugar||0)<=0||(S.warung.cups||0)<=0)return false;
 if(!takeCoconut())return false;
 S.warung.ice--;S.warung.sugar--;S.warung.cups--;
 S.dayLog.materials.ice++;S.dayLog.materials.sugar++;S.dayLog.materials.cup++;
 earn('PENJUALAN','Es kelapa 1 gelas',DATA.es.price);
 S.dayLog.sales.es++;S.dayLog.sales.esRev+=DATA.es.price;S.stats.es++;
 if(S.warung){S.warung.successfulSales=(S.warung.successfulSales||0)+1;}
 return true;
}
function trySellWhole(){
 if(stockQty()<=0&&S.quarterUsed===0)return false;
 if(S.quarterUsed>0)S.quarterUsed=0;
 if(stockQty()<=0)return false;
 if(S.stock.biasa>0)S.stock.biasa--;else S.stock.super--;
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
 S.livingStock[key]=(S.livingStock[key]||0)+1;
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
