function el(id){return document.getElementById(id);}
function safeRp(n){if(n===undefined||n===null||isNaN(n))return 'Rp 0';return 'Rp '+Math.round(n).toLocaleString('id-ID');}
function safeText(id,text){var e=el(id);if(e)e.textContent=(text===undefined||text===null)?'-':String(text);}
function say(sp,po,tx){safeText('d-speaker',sp);safeText('d-portrait',po);safeText('d-text',tx);}
function msg(t){const m=el('msg');if(m){m.textContent=t;m.classList.remove('hidden');setTimeout(()=>m.classList.add('hidden'),9000);}}
function showModal(h){var mb=el('modal-body');var modal=el('modal');if(mb)mb.innerHTML=h;if(modal)modal.classList.remove('hidden');}
function closeModal(){var m=el('modal');if(m)m.classList.add('hidden');}
function stockLabel(){
 if(!S||!S.stock)return 'Gudang kosong';
 const q=(S.stock.biasa||0)+(S.stock.super||0);
 if(q<=0)return 'Gudang kosong';
 const age=S.day-(S.harvestDay||0);
 if(age<=DATA.degrade.muda)return q+' muda (h'+age+'/14)';
 if(age<=DATA.degrade.tua)return q+' TUA (h'+age+'/25)';
 return q+' BUSUK!';
}
function render(){
 try{
  if(!S){console.error('S undefined');return;}
  if(typeof ensureAgriState==='function')ensureAgriState();
  safeText('s-gold',safeRp(S.gold));
  safeText('s-day',S.day||1);
  safeText('s-month',monthOf(S.day||1));
  safeText('s-stock',stockLabel());
  const cuacaName=(S.cuaca&&DATA.weather[S.cuaca])?DATA.weather[S.cuaca].name:'-';
  safeText('s-weather',cuacaName);
  const currentLevelData = DATA.levels[S.level] || DATA.levels[1];
  const nextLevelData = DATA.levels[S.level+1];
  const xpText = nextLevelData ? `Lv.${S.level} (${S.xp}/${nextLevelData.xpReq} XP)` : `Lv.${S.level} (MAX)`;
  safeText('s-xp', xpText);
  const phase=S.phase||'pagi';
  let speaker='Mentor',portrait='🤖',dialogText='';
  if(phase==='pagi'){const lesson=getDailyLesson();speaker=lesson.speaker;portrait=lesson.portrait;dialogText='Pagi, '+(S.name||'Bos')+'. Cuaca: '+cuacaName+'. '+lesson.text;}
  else if(phase==='siang'){speaker='Tengkulak';portrait='🧑‍💼';dialogText='Saya lewat tiap siang saat panen.';}
  else{speaker='Mentor';portrait='';dialogText='Sore. Urus gudang dan rencana besok.';}
  say(speaker,portrait,dialogText);
  const A=el('actions');let h='';
  if(phase==='pagi'){
   if(S.trees&&Array.isArray(S.trees)){
    let readyCount=0;
    for(let i=0;i<S.trees.length;i++){
     const t=S.trees[i];
     const mature=t.mature||(S.day>=(t.plantedDay+DATA.matureDays));
     const canHarvest=t.lastHarvest===null||t.lastHarvest===undefined||(S.day-t.lastHarvest>=DATA.cycleDays);
     if(mature&&canHarvest)readyCount++;
    }
    if(readyCount>0&&stockQty()===0)h+='<button class="btn btn-success" onclick="harvest()">🌾 Panen ('+readyCount+' pohon)</button>';
   }
   if(S.path==='warung'&&S.warung&&S.warung.open){
    if((S.warung.successfulSales||0)>=3)h+='<button class="btn '+(S.warung.autoMode?'btn-success':'btn-primary')+'" onclick="toggleWarungMode()">'+(S.warung.autoMode?'🤖 Mode Otomatis AKTIF — Ubah ke Manual':'🧑‍🍳 Mode Manual — Aktifkan Otomatis')+'</button>';
    else h+='<p class="mode-hint">Mode otomatis terbuka setelah 3 transaksi penjualan berhasil ('+(S.warung.successfulSales||0)+'/3).</p>';
    h+='<button class="btn btn-primary" onclick="shopMaterials()">🛒 Belanja Bahan (Smart Rec)</button>';
    if(!S.warung.fridge)h+='<button class="btn btn-primary" onclick="showFridgeTutorial()">❄️ Pelajari Kulkas (Rp 2.000.000)</button>';
    // Upgrade lokasi warung
    if(S.warung.location==='depanRumah')h+='<button class="btn btn-warning" onclick="upgradeWarungLocation()">🏪 Upgrade ke Ruko Pinggir Jalan (belum wajib)</button>';
    if(S.warung.location==='pinggirJalan')h+='<button class="btn btn-warning" onclick="upgradeWarungLocation()">🏪 Upgrade ke Pasar/Kampus (Rp 15.000.000)</button>';
   }
   if(S.path==='tengkulak'||S.path==='mix'){
    h+='<button class="btn btn-primary" onclick="showTokoPertanian()">🌱 Toko Pertanian</button>';
   }
   if(!S.path)h+='<button class="btn btn-primary" onclick="showPathChoose()">🧭 Pilih Jalur Usaha</button>';
   // Menu iklan
   h+='<button class="btn btn-primary" onclick="showMentorQuestions()">🤖 Tanya Mentor (Pilihan A/B/C)</button>';
   h+='<button class="btn btn-primary" onclick="showGarden()">🌴 Kebun Saya & Pertumbuhan</button>';
   h+='<button class="btn btn-primary" onclick="showLandMarket()">🗺️ Beli / Kelola Lahan</button>';
   h+='<button class="btn btn-primary" onclick="showAdMenu()">📺 Nonton Iklan (Dapat Buff)</button>';
   h+='<button class="btn btn-warning" onclick="setPhase(\'siang\')">➡ Lanjut ke Siang</button>';
  }else if(phase==='siang'){
   if(S.path==='warung'||S.path==='mix'){
    if(!S.warung||!S.warung.open){
     h+='<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung (Pilih Paket)</button>';
    }else if(S.warung.autoMode){
     h+='<p class="mode-hint">🤖 Warung berjalan otomatis hari ini. Anda bisa lanjut mengelola usaha lain.</p>';
    }else if(!S.warung.operatedToday){
     h+='<button class="btn btn-success" onclick="openScene()">🏪 BUKA WARUNG (09-21)</button>';
    }
   }
   if(S.path==='tengkulak'||S.path==='mix'||!S.path){
    const sc=stockClassSafe();
    if(sc==='muda')h+='<button class="btn btn-warning" onclick="sellTengkulak()"> Jual ke Tengkulak</button>';
   }
   h+='<button class="btn btn-warning" onclick="goSore()">➡ Lanjut ke Sore</button>';
  }else{
   const sc=stockClassSafe();
   if(sc==='tua')h+='<button class="btn btn-warning" onclick="sellPasar()">🛒 Jual kelapa TUA ke pasar</button>';
   // Menu beli dari luar HANYA tgl 15-16
   const dayOfMonth = ((S.day - 1) % 30) + 1;
   if(dayOfMonth >= 15 && dayOfMonth <= 16 && S.warung && S.warung.open && (!S.purchases||S.purchases.externalCoconutMonth!==monthOf(S.day))){
    h+='<button class="btn btn-primary" onclick="showSupplyShop()">🥥 Beli Kelapa dari Luar (Hari '+dayOfMonth+' saja!)</button>';
   }
   if((!S.purchases||S.purchases.seedlingMonth!==monthOf(S.day))&&emptySlots()>0)h+='<button class="btn btn-primary" onclick="showSeedShop()">🌱 Pelajari Bibit Kelapa Super</button>';
   h+='<button class="btn btn-danger" onclick="startSleep()">😴 Tidur (Ganti Hari)</button>';
  }
  if(A)A.innerHTML=h;
 }catch(err){
  console.error('Render error:',err);
  const A=el('actions');
  if(A)A.innerHTML='<p style="color:red">Error: '+err.message+'</p><button class="btn btn-danger" onclick="resetGame()">🔄 Reset</button>';
 }
}
function stockClassSafe(){
 if(!S||!S.stock)return null;
 const q=(S.stock.biasa||0)+(S.stock.super||0);
 if(q<=0)return null;
 const age=(S.day||0)-(S.harvestDay||0);
 if(age<=DATA.degrade.muda)return 'muda';
 if(age<=DATA.degrade.tua)return 'tua';
 return 'busuk';
}
function setPhase(p){S.phase=p;if(p==='siang'&&S.warung&&S.warung.autoMode)runAutoWarungDay();save();render();}
function goSore(){
 if(S.phase==='siang'&&S.warung&&S.warung.open&&!S.warung.operatedToday){
  if(!confirm('Warung belum dibuka hari ini. Lewati?'))return;
  if(S.stats)S.stats.missedDays=(S.stats.missedDays||0)+1;
 }
 S.phase='sore';save();render();
}
function showPathChoose(){
 let h='<h3>🧭 Pilih Jalur Usaha</h3><p>Mentor: "Mau fokus ke mana, Bos?"</p>';
 Object.keys(DATA.paths).forEach(k=>{
  const p=DATA.paths[k];
  h+='<div style="background:#e8f5e9;padding:12px;margin:8px 0;border-radius:8px"><strong>'+p.name+'</strong><p style="font-size:13px">'+p.desc+'</p><button class="btn btn-primary" onclick="choosePath(\''+k+'\');closeModal()">Pilih</button></div>';
 });
 h+='<button class="btn" onclick="closeModal()">Nanti Saja</button>';
 showModal(h);
}
function showTokoPertanian(){
 let h='<h3>🌱 Toko Pertanian</h3>';
 h+='<p><strong>Bibit Kelapa Super:</strong> bibit Rp 50.000 + biaya tanam Rp 10.000/pohon. Total 20 pohon = Rp 1.200.000 (biaya tanam Rp 200.000). Hasil 30 butir/bulan saat matang.</p>';
 h+='<p>Slot kosong: '+emptySlots()+'</p>';
 h+='<input type="number" id="inp-seed" min="1" max="'+emptySlots()+'" value="1">';
 h+='<button class="btn btn-primary" onclick="buySeedling(parseInt(el(\'inp-seed\').value)||1);closeModal()">Beli & Tanam</button>';
 h+='<hr style="margin:15px 0"><p><strong>🚧 Komoditas Segera Hadir:</strong></p><ul>';
 DATA.futureCommodities.forEach(c=>{h+='<li>'+c+'</li>';});
 h+='</ul><button class="btn" onclick="closeModal()">Tutup</button>';
 showModal(h);
}
function showSupplyShop(){
 showModal('<h3>🥥 Pelajaran: Membeli Kelapa dari Luar</h3>'+
 '<p><b>Fungsi:</b> menambah bahan baku ketika panen sendiri belum cukup. Ini keputusan modal kerja, bukan keuntungan otomatis.</p><p><b>Risiko:</b> hitung biaya beli, sisa umur kesegaran, kapasitas olah, dan peluang penjualan. Jangan membeli lebih banyak daripada kemampuan menjual.</p>'+
 '<p style="font-size:13px;color:#666">⚠️ Tersedia tanggal 15–16 setiap bulan simulasi, dan hanya satu transaksi pembelian luar per bulan.</p>'+
 '<div style="background:#e8f5e9;padding:12px;margin:10px 0;border-radius:8px"><p><strong>Opsi 1: Petani Lain</strong><br>Harga: Rp 3.500/butir (murah)</p><button class="btn btn-primary" onclick="buyKelapaLuar(\'petani\')">Beli</button></div>'+
 '<div style="background:#fff3cd;padding:12px;margin:10px 0;border-radius:8px"><p><strong>Opsi 2: Tengkulak</strong><br>Harga: Rp 5.000/butir (siap pakai)</p><button class="btn btn-warning" onclick="buyKelapaLuar(\'tengkulak\')">Beli</button></div>'+
 '<button class="btn" onclick="closeModal()">Tutup</button>');
}
function showSeedShop(){
 const empty=emptySlots();
 showModal('<h3>🌱 Pelajaran: Bibit Kelapa Super</h3><p><b>Fungsi:</b> menambah kapasitas produksi jangka panjang. Setiap bibit berharga Rp50.000 dan penanaman Rp10.000; total Rp60.000/pohon.</p><p><b>Waktu panen:</b> simulasi menetapkan matang pada hari ke-1.080 sejak tanam; setelah matang, siklus panen berikutnya mengikuti aturan 30 hari.</p><p><b>Jenis & perawatan:</b> bibit super menghasilkan 30 butir per pohon per siklus menurut parameter game. Dalam praktik nyata, hasil dipengaruhi varietas, umur, air, unsur hara, gulma, dan hama; lakukan penyiraman awal dan pemantauan rutin.</p><p>Slot kosong: '+empty+'. Pembelian bibit hanya sekali per bulan simulasi.</p><input type="number" id="inp-seed" min="1" max="'+empty+'" value="1"><button class="btn btn-primary" onclick="buySeedling(parseInt(el(\'inp-seed\').value)||1);closeModal()">Pahami & Beli</button> <button class="btn" onclick="closeModal()">Tutup</button>');
}
function showFridgeTutorial(){
 showModal('<h3>❄️ Pelajaran: Kulkas Mini</h3><p><b>Fungsi:</b> menjaga stok es batu tetap tersedia sampai hari berikutnya. Tanpa kulkas, sisa es dibukukan sebagai kerugian saat pergantian hari.</p><p><b>Manfaat ekonomi:</b> mengurangi pemborosan bahan dan membuat pembelian lebih efisien. Harga simulasi: Rp2.000.000; kapasitas tercatat 200 porsi.</p><p><b>Keputusan investasi:</b> beli jika penghematan es yang biasanya mencair berpotensi menutup biaya kulkas. Perhatikan arus kas, bukan omzet saja.</p><button class="btn btn-success" onclick="buyFridge();closeModal()">Pahami & Beli</button> <button class="btn" onclick="closeModal()">Nanti</button>');
}
function showAccelOffer(){
 showModal('<h3>⏳ Bibit Tertanam</h3><p>Berbuah setelah <b>1.080 hari</b>.</p><button class="btn btn-primary" onclick="closeModal()">🕰 Tunggu</button><button class="btn btn-warning" onclick="accelIAP()">⚡ Speedy — US$1 / 20 pohon (belum aktif)</button><button class="btn btn-success" onclick="accelAd();closeModal()">📺 Iklan (skip 30 hari)</button>');
}
function showReport(L,net){
 if(!L)L={sales:{},materials:{},dailyExpenses:[]};
 const dayNum=(S.day||1)-1;
 const cogs=Number(L.cogs)||0;
 const businessExpense=Number(L.businessExpense)||0;
 const livingExpense=Number(L.livingExpense)||0;
 const businessResult=(Number(L.gross)||0)-cogs-businessExpense;
 let h='<h3>🌙 Laporan Hari '+dayNum+'</h3>';
 const weatherName=(L.weather&&DATA.weather[L.weather])?DATA.weather[L.weather].name:'-';
 h+='<p><strong>Cuaca:</strong> '+weatherName+' | <strong>Pembeli:</strong> '+(L.buyerCount||0)+'</p>';
 h+='<h4>💰 Penghasilan Kotor</h4><table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>🍹 Es ('+(L.sales.es||0)+')</td><td class="pos">'+safeRp(L.sales.esRev||0)+'</td></tr>';
 h+='<tr><td>🥥 Utuh ('+(L.sales.whole||0)+')</td><td class="pos">'+safeRp(L.sales.wholeRev||0)+'</td></tr>';
 if(L.sales.tengkulak)h+='<tr><td>💼 Tengkulak</td><td class="pos">'+safeRp(L.sales.tengkulakRev||0)+'</td></tr>';
 if(L.sales.pasar)h+='<tr><td>🛒 Pasar</td><td class="pos">'+safeRp(L.sales.pasarRev||0)+'</td></tr>';
 h+='<tr><td><b>Total Kotor</b></td><td class="pos"><b>'+safeRp(L.gross||0)+'</b></td></tr></table>';
 h+='<h4>📤 Pengeluaran Detail</h4><table><tr><th>Item</th><th>Nilai</th></tr>';
 L.dailyExpenses.forEach(d=>{h+='<tr><td>'+(d.item||'-')+'</td><td class="neg">-'+safeRp(d.amt||0)+'</td></tr>';});
 h+='<tr><td>🛒 Pembelian stok (arus kas, bukan beban)</td><td class="neg">-'+safeRp(L.shopping||0)+'</td></tr>';
 h+='<tr><td>🏪 CAPEX/investasi (arus kas, bukan beban)</td><td class="neg">-'+safeRp(L.capex||0)+'</td></tr>';
 h+='<tr><td>📦 HPP bahan yang benar-benar terpakai untuk penjualan (nonkas)</td><td class="neg">-'+safeRp(cogs)+'</td></tr>';
 h+='<tr><td>👷 Beban usaha lain (termasuk upah panen)</td><td class="neg">-'+safeRp(businessExpense||L.labor||0)+'</td></tr>';
 h+='<tr><td>🏠 Biaya hidup yang diakui</td><td class="neg">-'+safeRp(L.livingExpense||0)+'</td></tr>';
 h+='<tr><td><b>Total beban yang diakui</b></td><td class="neg"><b>'+safeRp(L.expense||0)+'</b></td></tr></table>';
 h+='<h4>📦 Bahan Terpakai</h4><p>🥥 '+(L.materials.kelapa||0)+' |  '+(L.materials.ice||0)+' | 🍯 '+(L.materials.sugar||0)+' | 🥤 '+(L.materials.cup||0)+'</p>';
 if(L.lossIcePortions)h+='<p class="neg">🫠 Es mencair '+L.lossIcePortions+' porsi</p>';
 h+='<h3 style="margin-top:15px">Hasil usaha sebelum biaya hidup (setelah HPP tercatat): <span class="'+(businessResult<0?'neg':'pos')+'">'+safeRp(businessResult)+'</span></h3>';
 const netNum=net||0;
 h+='<h3>Surplus setelah biaya hidup tercatat: <span class="'+(netNum<0?'neg':'pos')+'">'+safeRp(netNum)+'</span></h3>';
 h+='<p><b>Catatan akuntansi:</b> HPP penjualan kelapa utuh/es kelapa mulai dicatat berdasarkan biaya persediaan kelapa rata-rata dan biaya unit bahan warung. HPP untuk transaksi lama, susut bahan, komoditas lain, dan penyusutan aset belum lengkap; angka ini belum merupakan laba bersih final. Pembelian stok dan CAPEX mengurangi kas, tetapi tidak langsung dibebankan seluruhnya.</p>';
 h+='<p><b>🤖 AI:</b> "Surplus sementara hari ini '+safeRp(netNum)+'. Jangan menyebutnya laba bersih final sebelum HPP bahan terpakai dan penyusutan dihitung."</p>';
 h+='<button class="btn btn-primary" onclick="closeModal()">☀ Bangun (Hari '+(S.day||1)+')</button>';
 showModal(h);
}
const SCENE={timer:null,hour:9,events:[],idx:0,done:false};
function openScene(){
 if(!S.warung)S.warung={};
 S.warung.operatedToday=true;
 SCENE.hour=DATA.hours.open;SCENE.done=false;SCENE.idx=0;
 // Hitung demand berdasarkan lokasi warung
 const location = S.warung.location || 'depanRumah';
 const D=demandToday(location);
 const W=wholeBuyersToday();
 if(!S.dayLog)S.dayLog={};
 S.dayLog.buyerCount=D+W;
 SCENE.events=[];
 for(let i=0;i<D;i++)SCENE.events.push({h:DATA.hours.open+Math.floor(Math.random()*12),t:'es'});
 for(let i=0;i<W;i++)SCENE.events.push({h:DATA.hours.open+Math.floor(Math.random()*12),t:'whole'});
 SCENE.events.sort((a,b)=>a.h-b.h);
 safeText('sc-day','Hari '+(S.day||1)+' | '+((S.cuaca&&DATA.weather[S.cuaca])?DATA.weather[S.cuaca].name:'-')+' | '+DATA.warungLocations[location].name);
 const keeperEl=el('keeper');
 if(keeperEl)keeperEl.textContent='👨‍🍳';
 updScene();
 const ws=el('warung-scene');
 if(ws)ws.classList.remove('hidden');
 SCENE.timer=setInterval(tickHour,DATA.hours.secPerHour);
 tickHourUI();
}
function tickHour(){
 SCENE.hour++;
 if(SCENE.hour>DATA.hours.close){closeScene(false);return;}
 tickHourUI();
 spawnForHour(SCENE.hour-1);
}
function tickHourUI(){
 const clockEl=el('sc-clock');
 if(clockEl){
  const h=SCENE.hour;
  clockEl.textContent=(h<10?'0':'')+h+'.00';
 }
}
function spawnForHour(h){
 const list=SCENE.events.filter(e=>e.h===h);
 list.forEach((e,i)=>setTimeout(()=>spawnCustomer(e.t),i*500));
}
function spawnCustomer(t){
 const ws=el('warung-scene');
 if(ws&&ws.classList.contains('hidden'))return;
 const sc=el('scene');
 if(!sc)return;
 const c=document.createElement('div');
 c.className='customer';
 const skinColors=['#FFCC80','#D7A86E','#8D5524','#F1C27D','#E0AC69'];
 const shirtColors=['#2196F3','#E91E63','#4CAF50','#FF9800','#9C27B0','#00BCD4'];
 const skin=skinColors[Math.floor(Math.random()*skinColors.length)];
 const shirt=shirtColors[Math.floor(Math.random()*shirtColors.length)];
 c.innerHTML=`<div class="human-figure"><div class="h-head" style="background:${skin}"></div><div class="h-body" style="background:${shirt}"></div><div class="h-legs"><div class="h-leg"></div><div class="h-leg"></div></div></div>`;
 sc.appendChild(c);
 setTimeout(()=>c.classList.add('walk'),60);
 setTimeout(()=>{
  let ok=false;
  try{ if(t==='es')ok=trySellEs(); else ok=trySellWhole(); }catch(e){ok=false;}
  if(ok){
   playGameSound('sale');
   c.innerHTML+='<span class="bubble">'+(t==='es'?'🍹':'')+'</span>';
   floatText(t==='es'?'+Rp5.000':'+Rp13.000');
  }else{
   c.innerHTML+='<span class="bubble">💢</span>';
   if(S.dayLog)S.dayLog.lost=(S.dayLog.lost||0)+1;
   if(S.stats)S.stats.lostSales=(S.stats.lostSales||0)+1;
   floatText('Stok habis!');
  }
  updScene();save();
  setTimeout(()=>{
   c.classList.add('leave');
   setTimeout(()=>{if(c.parentNode)c.remove();},1200);
  },700);
 },1200);
}
function floatText(t){
 const f=document.createElement('div');
 f.className='float-money';
 f.textContent=t;
 const sc=el('scene');
 if(sc)sc.appendChild(f);
 setTimeout(()=>{if(f.parentNode)f.remove();},1300);
}
function updScene(){
 if(!S.dayLog)S.dayLog={sales:{}};
 if(!S.dayLog.sales)S.dayLog.sales={};
 if(!S.warung)S.warung={};
 safeText('sc-es',S.dayLog.sales.es||0);
 safeText('sc-whole',S.dayLog.sales.whole||0);
 const rev=(S.dayLog.sales.esRev||0)+(S.dayLog.sales.wholeRev||0);
 safeText('sc-rev',safeRp(rev));
 safeText('sc-lost',S.dayLog.lost||0);
 safeText('sc-ice',S.warung.ice||0);
 safeText('sc-sugar',S.warung.sugar||0);
 safeText('sc-cup',S.warung.cups||0);
 safeText('sc-coco',stockQty());
}
function closeScene(silent){
 const ws=el('warung-scene');
 if(ws&&ws.classList.contains('hidden'))return;
 clearInterval(SCENE.timer);
 if(ws)ws.classList.add('hidden');
 if(!silent){
  const esSold=(S.dayLog&&S.dayLog.sales)?(S.dayLog.sales.es||0):0;
  const wholeSold=(S.dayLog&&S.dayLog.sales)?(S.dayLog.sales.whole||0):0;
  const fridgeMsg=(S.warung&&S.warung.fridge)?' Sisa es aman di kulkas.':' Sisa es mencair malam ini.';
  say('Mentor','🤖','Warung tutup. Es '+esSold+', utuh '+wholeSold+'.'+fridgeMsg);
 }
 save();render();
}
const OB={idx:0,av:0};
OB.startStory=function(){
 const inp=el('inp-name');
 const n=inp?inp.value.trim():'';
 if(!n){alert('Isi nama Anda dulu.');return;}
 S.name=n;S.avatar=this.av;
 el('ob-char').classList.add('hidden');el('ob-story').classList.remove('hidden');
 this.showSlide();
};
OB.showSlide=function(){
 const s=STORY[this.idx];
 if(!s)return;
 const portraitEl=el('st-portrait');
 if(portraitEl){
  if(s[0]==='Kamu'){
   const avatars=PORTR.pemain||['🧑‍🌾'];
   portraitEl.textContent=avatars[S.avatar||0]||'🧑‍🌾';
  }else{
   portraitEl.textContent=s[1]||'';
  }
 }
 safeText('st-speaker',s[0]);
 safeText('st-text',s[2]);
};
OB.nextSlide=function(){
 this.idx++;
 if(this.idx>=STORY.length){
  S.storyDone=true;
  save();
  finishOnboard();
  return;
 }
 this.showSlide();
};
function finishOnboard(){
 const ob=el('onboard');
 if(ob)ob.remove();
 startGame();
}
function startGame(){
 const game=el('game');
 if(game)game.classList.remove('hidden');
 render();
}
function initAvatars(){
 const pick=el('avatar-pick');
 if(!pick)return;
 const avatars=PORTR.pemain||['🧑‍🌾'];
 pick.innerHTML=avatars.map((p,i)=>'<button class="avatar-btn'+(i===0?' sel':'')+'" onclick="OB.av='+i+';initAvatars()">'+p+'</button>').join('');
}

// MENU IKLAN
function showAdMenu(){
 const adsWatched = S.adSeason ? S.adSeason.adsWatchedThisSeason : 0;
 const currentBuff = calculateAdAchievementBuffs();
 let h='<h3>📺 Nonton Iklan (Dapat Buff)</h3>';
 h+='<p>Season saat ini: <b>'+adsWatched+' video ditonton</b></p>';
 h+='<p>Buff aktif: <b>-'+((currentBuff.discount_rate||0)*100).toFixed(1)+'% harga beli</b></p>';
 h+='<p style="font-size:12px;color:#666">Buff reset setiap 3 bulan. Nonton lagi untuk restore!</p>';
 h+='<div style="background:#e3f2fd;padding:12px;margin:10px 0;border-radius:8px">';
 h+='<p><strong>Milestone:</strong></p>';
 h+='<p>10 video → -1% | 50 video → -3% | 100 video → -5%</p>';
 h+='<p>500 video → -10% | 1000 video → -15% | 2500 video → -25%</p>';
 h+='</div>';
 h+='<button class="btn btn-primary" onclick="watchAd(\'discount_rate\',0.01)"> Tonton Iklan (+1% discount)</button>';
 h+='<button class="btn" onclick="closeModal()">Tutup</button>';
 showModal(h);
}

// UPGRADE LOKASI WARUNG
function upgradeWarungLocation(){
 const currentLocation = S.warung.location || 'depanRumah';
 const upgrades = {
  depanRumah: {next:'pinggirJalan',cost:5000000,name:'Ruko Pinggir Jalan'},
  pinggirJalan: {next:'pasar',cost:15000000,name:'Pasar/Kampus/Pabrik'}
 };
 const upgrade = upgrades[currentLocation];
 if(!upgrade){msg('⚠️ Lokasi sudah maksimal.');return;}
 if(!S.tutorialSeen)S.tutorialSeen={};
 const tutorialKey='upgrade_'+currentLocation;
 if(!S.tutorialSeen[tutorialKey]){S.tutorialSeen[tutorialKey]=true;save();showModal('<h3>🏪 Pelajaran: Memilih Lokasi</h3><p>Lokasi ramai dapat menaikkan permintaan, tetapi keputusan lokasi harus dibandingkan dengan modal, biaya sewa, tenaga kerja, dan stok yang mampu Anda suplai.</p><p>Perlu diingat: upgrade lokasi dalam versi simulasi ini memiliki biaya investasi awal. Hitung periode balik modal sebelum mengambil keputusan.</p><button class="btn btn-primary" onclick="closeModal();upgradeWarungLocation()">Lanjut lihat biaya</button> <button class="btn" onclick="closeModal()">Belajar nanti</button>');return;}
 if(S.gold<upgrade.cost){msg('⚠️ Uang tidak cukup.');return;}
 spend('CAPEX','Upgrade warung ke '+upgrade.name,upgrade.cost,'capex');
 S.warung.location = upgrade.next;
 say('Mentor','🤖','Warung upgrade ke '+upgrade.name+'! Demand meningkat!');
 save();render();
}

function showMentorQuestions(){
 const topics=[
  {q:'A. Bagaimana cara merawat kelapa muda?',a:'Pilih bibit sehat dan sesuai tujuan, siapkan lubang serta bahan organik, siram saat kurang hujan, jaga area sekitar tanaman dari gulma, dan pantau hama. Kebutuhan nyata bergantung pada jenis kelapa, umur, tanah, dan iklim.',b:'Kelapa tidak perlu air dan bisa dibiarkan tanpa pemeriksaan.',c:'Semua pohon harus diberi pestisida setiap hari.',correct:'a',why:'Perawatan dilakukan berdasarkan kondisi tanaman dan pengamatan; pestisida bukan tindakan rutin tanpa diagnosis.'},
  {q:'B. Apa keputusan yang tepat saat stok warung berlebih?',a:'Belanja sebanyak mungkin agar gudang penuh.',b:'Bandingkan stok dengan target permintaan, hentikan pembelian saat batas tercapai, lalu gunakan stok yang ada.',c:'Abaikan modal yang tertahan di persediaan.',correct:'b',why:'Stok berlebih mengikat modal dan meningkatkan risiko bahan rusak atau tidak terpakai.'},
  {q:'C. Apa yang harus diperiksa sebelum menanam jagung?',a:'Kesesuaian benih, sinar matahari, ketersediaan air, drainase, kesuburan tanah, dan rencana pemupukan.',b:'Hanya warna kemasan benih.',c:'Tanam di lahan tergenang selama mungkin.',correct:'a',why:'Jagung membutuhkan cahaya cukup dan air yang memadai; genangan berkepanjangan dapat merusak akar.'},
  {q:'D. Bagaimana mengurangi risiko budidaya bawang merah?',a:'Gunakan benih bermutu, pantau tanaman, kelola air dan nutrisi, serta kendalikan hama sesuai hasil pengamatan.',b:'Semprot pestisida kimia setiap hari tanpa melihat kondisi.',c:'Gunakan umbi bibit yang rusak agar hemat.',correct:'a',why:'Benih bermutu dan pengamatan rutin membantu mengurangi risiko penyakit serta penggunaan input yang tidak perlu.'},
  {q:'E. Bagaimana membedakan omzet dan laba?',a:'Omzet adalah seluruh penerimaan penjualan; laba memperhitungkan biaya yang relevan.',b:'Omzet dan laba selalu sama.',c:'Laba hanya dihitung dari uang tunai yang terlihat di meja.',correct:'a',why:'Laba harus dihitung setelah biaya produksi, operasional, tenaga kerja, dan kerugian diperhitungkan.'},
  {q:'F. Cabai merah: kapan memilih tengkulak atau jual langsung?',a:'Selalu jual langsung karena harga eceran pasti berarti laba lebih besar.',b:'Bandingkan harga bersih setelah ongkos angkut, susut, waktu, kemasan, risiko tidak laku, dan volume yang sanggup diserap pembeli.',c:'Harga jual tidak perlu dibandingkan dengan biaya.',correct:'b',why:'B2B biasanya menyerap volume lebih besar dengan harga per unit lebih rendah. B2C berpotensi memberi harga lebih tinggi, tetapi menambah biaya penjualan dan risiko barang tersisa.'},
  {q:'G. Jagung pipilan: apa yang menentukan harga B2B?',a:'Mutu, kadar air, kebersihan, volume, lokasi, biaya pengeringan, dan kontrak pembeli.',b:'Hanya warna karung.',c:'Semua pembeli wajib membayar harga eceran.',correct:'a',why:'Harga jagung pipilan sangat dipengaruhi mutu dan kadar air. Pengeringan dan transportasi harus masuk perhitungan biaya.'},
  {q:'H. Mengapa usaha olahan cabai harus menghitung biaya tambahan?',a:'Karena cabai mentah berubah menjadi produk tanpa biaya lain.',b:'Karena ada bahan tambahan, kemasan, tenaga kerja, energi, penyusutan alat, distribusi dan risiko produk tidak terjual.',c:'Karena omzet produk jadi selalu merupakan laba bersih.',correct:'b',why:'Margin produk jadi harus dikurangi biaya bahan baku dan semua biaya konversi. Harga jual yang lebih tinggi belum tentu menghasilkan laba lebih tinggi.'},
  {q:'I. Kapan memakai box pendingin untuk distribusi?',a:'Untuk semua komoditas tanpa melihat kebutuhan.',b:'Saat komoditas mudah rusak dan rute/waktu pengiriman memerlukan pengendalian suhu; hitung sewa box, es/energi, kapasitas, BBM, tol dan bongkar muat.',c:'Box pendingin menghapus seluruh risiko kerusakan.',correct:'b',why:'Rantai dingin membantu menjaga mutu produk yang sensitif suhu, tetapi biaya harus dibandingkan dengan pengurangan susut dan nilai kontrak.'},
  {q:'J. Apa yang harus diperiksa sebelum menerima kontrak pasokan B2B?',a:'Jumlah, spesifikasi mutu, jadwal, harga bersih, syarat pembayaran, penalti, kemasan, pengiriman dan kapasitas pasokan.',b:'Hanya nilai omzet tertulis.',c:'Terima semua pesanan meski stok tidak cukup.',correct:'a',why:'Kontrak harus dapat dipenuhi. Keterlambatan, mutu tidak sesuai dan pembayaran tertunda bisa menghabiskan modal kerja.'}
 ];
 showModal('<h3>🤖 Tanya Mentor — Pilih Topik</h3><p>Pilih pertanyaan yang sudah disediakan. Sistem ini tidak memakai kolom pertanyaan bebas atau AI eksternal, sehingga ringan untuk game.</p>'+
 topics.map((t,i)=>'<button class="btn btn-primary" style="display:block;width:100%;margin:7px 0;text-align:left" onclick="showMentorAnswer('+i+')">'+t.q+'</button>').join('')+
 '<button class="btn" onclick="closeModal()">Tutup</button>');
 window._mentorQuestionBank=topics;
}
function showMentorAnswer(index){
 const topics=window._mentorQuestionBank||[];const t=topics[index];if(!t)return;
 showModal('<h3>'+t.q+'</h3><p>Pilih jawaban Anda. Mentor akan menjelaskan konsekuensi pilihan.</p>'+
 ['a','b','c'].map(k=>'<button class="btn btn-primary" style="display:block;width:100%;margin:7px 0;text-align:left" onclick="answerMentorQuestion('+index+',\''+k+'\')"><b>'+k.toUpperCase()+'.</b> '+t[k]+'</button>').join('')+
 '<button class="btn" onclick="showMentorQuestions()">Kembali</button>');
}
function answerMentorQuestion(index,choice){
 const topics=window._mentorQuestionBank||[];const t=topics[index];if(!t)return;
 ensureAgriState();const ok=choice===t.correct;
 S.landSystem.quiz.attempts=(S.landSystem.quiz.attempts||0)+1;
 if(ok){S.landSystem.quiz.correct=(S.landSystem.quiz.correct||0)+1;S.landSystem.quiz.mastery[index]=(S.landSystem.quiz.mastery[index]||0)+1;}
 save();
 showModal('<h3>'+(ok?'✅ Jawaban benar':'📘 Mari pelajari lagi')+'</h3><p><b>Jawaban Anda:</b> '+choice.toUpperCase()+'</p><p><b>Jawaban yang benar:</b> '+t.correct.toUpperCase()+'.</p><p>'+t.why+'</p><p>Penguasaan topik: '+(S.landSystem.quiz.mastery[index]||0)+' jawaban benar · Akurasi keseluruhan: '+Math.round(100*(S.landSystem.quiz.correct||0)/Math.max(1,S.landSystem.quiz.attempts||0))+'%</p><button class="btn btn-primary" onclick="showMentorQuestions()">Pilih topik lain</button> <button class="btn" onclick="closeModal()">Selesai</button>');
}
function getDailyLesson(){
 const lessons=[
  {speaker:'Mentor',portrait:'🤖',text:'Konsep hari ini: modal kerja adalah uang untuk membeli bahan dan membayar biaya operasi. Jangan habiskan seluruh kas untuk aset tetap.'},
  {speaker:'Naya • Mentor Kelapa',portrait:'👩🏻‍🌾',text:'Kelapa muda dan tua tidak selalu punya pasar yang sama. Umur panen memengaruhi mutu, harga, dan pembeli yang cocok. Catat umur stok agar tidak membusuk.'},
  {speaker:'Mentor',portrait:'🤖',text:'Omzet bukan laba. Laba bersih dihitung setelah HPP, upah, biaya hidup usaha, dan kerugian stok dikurangi dari pendapatan.'},
  {speaker:'Naya • Mentor Kelapa',portrait:'👩🏽‍🌾',text:'Satu butir kelapa dapat diolah menjadi beberapa gelas. Bandingkan pendapatan olahan dengan biaya es, gula, cup, tenaga, waktu, dan risiko barang tidak terjual.'},
  {speaker:'Mentor',portrait:'🤖',text:'Persediaan terlalu sedikit menyebabkan kehilangan penjualan; terlalu banyak mengikat modal dan meningkatkan risiko rusak. Gunakan target stok berdasarkan permintaan, bukan tebakan.'},
  {speaker:'Alya • Mentor Jagung',portrait:'👩🏻‍🌾',text:'Komoditas berikutnya yang akan dipelajari adalah jagung: keputusan tanam perlu mempertimbangkan umur panen, biaya benih, pupuk, air, hasil per hektare, dan harga pasar.'},
  {speaker:'Mentor',portrait:'🤖',text:'Kulkas adalah aset produktif jika penghematan bahan lebih besar daripada biaya kepemilikan dan operasinya. Nilai investasi dari arus kas, bukan dari tampilannya.'},
  {speaker:'Mira • Mentor Peternakan',portrait:'👩🏾‍🌾',text:'Dalam peternakan, biaya pakan dan tingkat kematian dapat menentukan laba. Pendapatan tinggi belum tentu menguntungkan jika biaya variabel dan risikonya tinggi.'}
 ];
 return lessons[((Math.max(1,S.day)-1)%lessons.length)];
}
function playGameSound(type){
 if(S&&S.soundEnabled===false)return;
 try{
  const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
  const ctx=new AudioCtx(),now=ctx.currentTime;
  const notes=type==='sale'?[660,880]:type==='purchase'?[440,554,659]:[523,659,784];
  notes.forEach((freq,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,now+i*.09);gain.gain.exponentialRampToValueAtTime(.08,now+i*.09+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+i*.09+.16);osc.connect(gain);gain.connect(ctx.destination);osc.start(now+i*.09);osc.stop(now+i*.09+.18);});
  setTimeout(()=>ctx.close(),700);
 }catch(e){console.debug('Audio tidak tersedia',e);}
}
console.log('=== UI.JS INIT ===');
if(typeof initGameState==='function'){ initGameState(); } else { loadSaved(); }
if(S&&!S.storyDone){ initAvatars(); }
else{ const ob=el('onboard'); if(ob)ob.remove(); startGame(); }
console.log('=== UI.JS INIT END ===');
// MODE WARUNG MANUAL / OTOMATIS
function toggleWarungMode(){
 if(!S.warung||!S.warung.open){msg('Buka warung terlebih dahulu.');return;}
 if((S.warung.successfulSales||0)<3){msg('Mode otomatis terbuka setelah 3 penjualan berhasil.');return;}
 if(!S.warung.autoMode&&(!S.tutorialSeen||!S.tutorialSeen.autoMode)){
  if(!S.tutorialSeen)S.tutorialSeen={};S.tutorialSeen.autoMode=true;save();
  showModal('<h3>🤖 Pelajaran: Operasi Warung Otomatis</h3><p>Sistem akan memproses perkiraan pembeli saat fase siang dan menjual hanya jika bahan tersedia. Anda menghemat waktu pengelolaan, tetapi tetap harus mengawasi persediaan, kas, permintaan, dan laporan laba-rugi.</p><p>Otomatisasi tidak menghilangkan risiko: stok habis berarti penjualan hilang; stok berlebih mengikat modal dan es tanpa kulkas dapat mencair.</p><button class="btn btn-success" onclick="closeModal();toggleWarungMode()">Pahami & Aktifkan</button> <button class="btn" onclick="closeModal()">Nanti</button>');return;
 }
 S.warung.autoMode=!S.warung.autoMode;
 if(S.warung.autoMode)playGameSound('purchase');
 save();render();
 msg(S.warung.autoMode?'Mode otomatis aktif. Warung akan beroperasi saat fase siang.':'Mode manual aktif. Buka warung secara manual pada fase siang.');
}
function runAutoWarungDay(){
 if(!S.warung||!S.warung.open||!S.warung.autoMode||S.warung.operatedToday)return;
 S.warung.operatedToday=true;
 const location=S.warung.location||'depanRumah';
 const locData=DATA.warungLocations[location]||DATA.warungLocations.depanRumah;
 const demand=demandToday(location);
 const wholeDemand=wholeBuyersToday();
 if(!S.dayLog.sales)S.dayLog.sales={es:0,esRev:0,whole:0,wholeRev:0,tengkulak:0,tengkulakRev:0,pasar:0,pasarRev:0};
 S.dayLog.buyerCount=(S.dayLog.buyerCount||0)+demand+wholeDemand;
 for(let i=0;i<demand;i++){
  if(trySellEs())continue;
  S.dayLog.lost=(S.dayLog.lost||0)+1;
  S.stats.lostSales=(S.stats.lostSales||0)+1;
 }
 for(let i=0;i<wholeDemand;i++){
  if(trySellWhole())continue;
  S.dayLog.lost=(S.dayLog.lost||0)+1;
  S.stats.lostSales=(S.stats.lostSales||0)+1;
 }
 save();render();
 if(typeof playGameSound==='function'&&((S.dayLog.sales.es||0)+(S.dayLog.sales.whole||0)>0))playGameSound('sale');
 say('Sistem Warung','🤖','Operasi otomatis selesai. Es terjual '+(S.dayLog.sales.es||0)+', kelapa utuh '+(S.dayLog.sales.whole||0)+'.');
}
