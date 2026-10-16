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
  if(phase==='pagi'){speaker='Mentor';portrait='🤖';dialogText='Pagi, Bos '+(S.name||'')+'. Cuaca: '+cuacaName+'.';}
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
    if(!S.warung.fridge)h+='<button class="btn btn-primary" onclick="buyFridge()">❄️ Beli Kulkas (Rp 2.000.000)</button>';
    // Upgrade lokasi warung
    if(S.warung.location==='depanRumah')h+='<button class="btn btn-warning" onclick="upgradeWarungLocation()">🏪 Upgrade ke Ruko Pinggir Jalan (Rp 5.000.000)</button>';
    if(S.warung.location==='pinggirJalan')h+='<button class="btn btn-warning" onclick="upgradeWarungLocation()">🏪 Upgrade ke Pasar/Kampus (Rp 15.000.000)</button>';
   }
   if(S.path==='tengkulak'||S.path==='mix'){
    h+='<button class="btn btn-primary" onclick="showTokoPertanian()">🌱 Toko Pertanian</button>';
   }
   if(!S.path)h+='<button class="btn btn-primary" onclick="showPathChoose()">🧭 Pilih Jalur Usaha</button>';
   // Menu iklan
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
   if(dayOfMonth >= 15 && dayOfMonth <= 16 && S.warung && S.warung.open){
    h+='<button class="btn btn-primary" onclick="showSupplyShop()">🥥 Beli Kelapa dari Luar (Hari '+dayOfMonth+' saja!)</button>';
   }
   if((S.day||0)>30)h+='<button class="btn btn-primary" onclick="showSeedShop()">🌱 Bibit Kelapa Super</button>';
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
 h+='<p><strong>Bibit Kelapa Super:</strong> Rp 60.000/pohon. Hasil 30 butir/bulan.</p>';
 h+='<p>Slot kosong: '+emptySlots()+'</p>';
 h+='<input type="number" id="inp-seed" min="1" max="'+emptySlots()+'" value="1">';
 h+='<button class="btn btn-primary" onclick="buySeedling(parseInt(el(\'inp-seed\').value)||1);closeModal()">Beli & Tanam</button>';
 h+='<hr style="margin:15px 0"><p><strong>🚧 Komoditas Segera Hadir:</strong></p><ul>';
 DATA.futureCommodities.forEach(c=>{h+='<li>'+c+'</li>';});
 h+='</ul><button class="btn" onclick="closeModal()">Tutup</button>';
 showModal(h);
}
function showSupplyShop(){
 showModal('<h3>🥥 Beli Kelapa dari Luar</h3>'+
 '<p style="font-size:13px;color:#666">⚠️ HANYA tersedia tanggal 15-16 setiap bulan! Besok menu ini tidak muncul lagi.</p>'+
 '<div style="background:#e8f5e9;padding:12px;margin:10px 0;border-radius:8px"><p><strong>Opsi 1: Petani Lain</strong><br>Harga: Rp 3.500/butir (murah)</p><button class="btn btn-primary" onclick="buyKelapaLuar(\'petani\')">Beli</button></div>'+
 '<div style="background:#fff3cd;padding:12px;margin:10px 0;border-radius:8px"><p><strong>Opsi 2: Tengkulak</strong><br>Harga: Rp 5.000/butir (siap pakai)</p><button class="btn btn-warning" onclick="buyKelapaLuar(\'tengkulak\')">Beli</button></div>'+
 '<button class="btn" onclick="closeModal()">Tutup</button>');
}
function showSeedShop(){
 const empty=emptySlots();
 showModal('<h3>🌱 Bibit Kelapa Super</h3><p>Rp 60.000/pohon. Hasil 30 butir/bulan.</p><p>Slot kosong: '+empty+'</p><input type="number" id="inp-seed" min="1" max="'+empty+'" value="1"><button class="btn btn-primary" onclick="buySeedling(parseInt(el(\'inp-seed\').value)||1);closeModal()">Beli</button> <button class="btn" onclick="closeModal()">Batal</button>');
}
function showAccelOffer(){
 showModal('<h3>⏳ Bibit Tertanam</h3><p>Berbuah setelah <b>1.080 hari</b>.</p><button class="btn btn-primary" onclick="closeModal()">🕰 Tunggu</button><button class="btn btn-warning" onclick="accelIAP();closeModal()">💎 Bundle Rp 1.000 / 5 pohon</button><button class="btn btn-success" onclick="accelAd();closeModal()">📺 Iklan (skip 30 hari)</button>');
}
function showReport(L,net){
 if(!L)L={sales:{},materials:{},dailyExpenses:[]};
 const dayNum=(S.day||1)-1;
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
 h+='<tr><td>🛒 Belanja bahan</td><td class="neg">-'+safeRp(L.shopping||0)+'</td></tr>';
 h+='<tr><td>👷 Kuli panen</td><td class="neg">-'+safeRp(L.labor||0)+'</td></tr>';
 h+='<tr><td>🏪 CAPEX</td><td class="neg">-'+safeRp(L.capex||0)+'</td></tr>';
 h+='<tr><td><b>Total Pengeluaran</b></td><td class="neg"><b>'+safeRp(L.expense||0)+'</b></td></tr></table>';
 h+='<h4>📦 Bahan Terpakai</h4><p>🥥 '+(L.materials.kelapa||0)+' |  '+(L.materials.ice||0)+' | 🍯 '+(L.materials.sugar||0)+' | 🥤 '+(L.materials.cup||0)+'</p>';
 if(L.lossIcePortions)h+='<p class="neg">🫠 Es mencair '+L.lossIcePortions+' porsi</p>';
 const netNum=net||0;
 h+='<h3 style="margin-top:15px">NET PROFIT: <span class="'+(netNum<0?'neg':'pos')+'">'+safeRp(netNum)+'</span></h3>';
 h+='<p><b>🤖 AI:</b> "Kamu hari ini '+(netNum>=0?'untung':'rugi')+' bersih '+safeRp(Math.abs(netNum))+'. '+(netNum>=0?'Pertahankan.':'Evaluasi belanja & cuaca.')+'"</p>';
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
 const locationMod = DATA.warungLocations[location].minBuyersModifier;
 const D=Math.floor(demandToday()*locationMod);
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
 if(S.gold<upgrade.cost){msg('⚠️ Uang tidak cukup.');return;}
 spend('CAPEX','Upgrade warung ke '+upgrade.name,upgrade.cost,'capex');
 S.warung.location = upgrade.next;
 say('Mentor','🤖','Warung upgrade ke '+upgrade.name+'! Demand meningkat!');
 save();render();
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
 S.warung.autoMode=!S.warung.autoMode;
 save();render();
 msg(S.warung.autoMode?'Mode otomatis aktif. Warung akan beroperasi saat fase siang.':'Mode manual aktif. Buka warung secara manual pada fase siang.');
}
function runAutoWarungDay(){
 if(!S.warung||!S.warung.open||!S.warung.autoMode||S.warung.operatedToday)return;
 S.warung.operatedToday=true;
 const location=S.warung.location||'depanRumah';
 const locData=DATA.warungLocations[location]||DATA.warungLocations.depanRumah;
 const demand=Math.floor(demandToday()*(locData.minBuyersModifier||1));
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
 say('Sistem Warung','🤖','Operasi otomatis selesai. Es terjual '+(S.dayLog.sales.es||0)+', kelapa utuh '+(S.dayLog.sales.whole||0)+'.');
}
