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
function stockClassSafe(){
 if(!S||!S.stock)return null;
 const q=(S.stock.biasa||0)+(S.stock.super||0);
 if(q<=0)return null;
 const age=(S.day||0)-(S.harvestDay||0);
 if(age<=DATA.degrade.muda)return 'muda';
 if(age<=DATA.degrade.tua)return 'tua';
 return 'busuk';
}

// ===== RENDER DENGAN LOGIKA JALUR =====
function render(){
 try{
  if(!S){console.error('S undefined');return;}
  safeText('s-gold',safeRp(S.gold));
  safeText('s-day',S.day||1);
  safeText('s-month',monthOf(S.day||1));
  safeText('s-stock',stockLabel());
  const cuacaName=(S.cuaca&&DATA.weather[S.cuaca])?DATA.weather[S.cuaca].name:'-';
  safeText('s-weather',cuacaName);
  const phase=S.phase||'pagi';
  let speaker='Mentor',portrait='🤖',dialogText='';
  if(phase==='pagi'){
   speaker='Mentor';portrait='🤖';
   dialogText='Pagi, Bos '+(S.name||'')+'. Cuaca: '+cuacaName+'. Belanja harian otomatis.';
  }else if(phase==='siang'){
   speaker='Tengkulak';portrait='🧑‍💼';
   dialogText='Saya lewat tiap siang saat panen.';
  }else{
   speaker='Mentor';portrait='🤖';
   dialogText='Sore. Urus gudang dan rencana besok.';
  }
  say(speaker,portrait,dialogText);
  const A=el('actions');let h='';
  if(phase==='pagi'){
   // Panen
   if(S.trees&&Array.isArray(S.trees)){
    let readyCount=0;
    for(let i=0;i<S.trees.length;i++){
     const t=S.trees[i];
     const mature=t.mature||(S.day>=(t.plantedDay+DATA.matureDays));
     const canHarvest=t.lastHarvest===null||t.lastHarvest===undefined||(S.day-t.lastHarvest>=DATA.cycleDays);
     if(mature&&canHarvest)readyCount++;
    }
    const stockQ=(S.stock.biasa||0)+(S.stock.super||0);
    if(readyCount>0&&stockQ===0)h+='<button class="btn btn-success" onclick="harvest()">🌾 Panen ('+readyCount+' pohon)</button>';
   }
   // Jalur WARUNG: tampilkan belanja warung + kulkas, SEMBUNYIKAN tengkulak
   if(S.path==='warung'&&S.warung&&S.warung.open){
    h+='<button class="btn btn-primary" onclick="showShop()">🛒 Belanja Bahan Warung</button>';
    if(!S.warung.fridge)h+='<button class="btn btn-primary" onclick="buyFridge()">❄️ Beli Kulkas (Rp 2.000.000)</button>';
   }
   // Jalur TENGKULAK: tampilkan toko pertanian, SEMBUNYIKAN warung
   if(S.path==='tengkulak'){
    h+='<button class="btn btn-primary" onclick="showTokoPertanian()">🌱 Toko Pertanian (bibit+pupuk)</button>';
   }
   // Jalur MIX: tampilkan keduanya
   if(S.path==='mix'){
    if(S.warung&&S.warung.open){
     h+='<button class="btn btn-primary" onclick="showShop()">🛒 Belanja Bahan Warung</button>';
     if(!S.warung.fridge)h+='<button class="btn btn-primary" onclick="buyFridge()">❄️ Beli Kulkas</button>';
    }
    h+='<button class="btn btn-primary" onclick="showTokoPertanian()">🌱 Toko Pertanian</button>';
   }
   // Path chooser jika belum pilih
   if(!S.path)h+='<button class="btn btn-primary" onclick="showPathChoose()">🧭 Pilih Jalur Usaha</button>';
   h+='<button class="btn btn-primary" onclick="showLearn()"> Modul Belajar</button>';
   h+='<button class="btn btn-warning" onclick="setPhase(\'siang\')">➡ Lanjut ke Siang</button>';
  }else if(phase==='siang'){
   // WARUNG: buka warung, TIDAK ada tengkulak
   if(S.path==='warung'){
    if(!S.warung||!S.warung.open){
     h+='<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung Es Kelapa</button>';
    }else if(!S.warung.operatedToday){
     h+='<button class="btn btn-success" onclick="openScene()"> BUKA WARUNG (09-21)</button>';
    }else{
     h+='<p>Warung sudah beroperasi hari ini.</p>';
    }
   }
   // TENGKULAK: jual ke tengkulak + toko pertanian
   if(S.path==='tengkulak'){
    const sc=stockClassSafe();
    if(sc==='muda'){
     h+='<button class="btn btn-warning" onclick="sellTengkulak()">💼 Jual ke Tengkulak</button>';
    }
    h+='<button class="btn btn-primary" onclick="showTokoPertanian()">🌱 Toko Pertanian</button>';
   }
   // MIX: keduanya
   if(S.path==='mix'){
    if(!S.warung||!S.warung.open){
     h+='<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung</button>';
    }else if(!S.warung.operatedToday){
     h+='<button class="btn btn-success" onclick="openScene()">🏪 BUKA WARUNG</button>';
    }
    const sc=stockClassSafe();
    if(sc==='muda')h+='<button class="btn btn-warning" onclick="sellTengkulak()">💼 Jual ke Tengkulak</button>';
   }
   // Belum pilih jalur: tampilkan semua (default)
   if(!S.path){
    if(!S.warung||!S.warung.open){
     h+='<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung Es Kelapa</button>';
    }else if(!S.warung.operatedToday){
     h+='<button class="btn btn-success" onclick="openScene()">🏪 BUKA WARUNG (09-21)</button>';
    }
    const sc=stockClassSafe();
    if(sc==='muda')h+='<button class="btn btn-warning" onclick="sellTengkulak()">💼 Jual ke Tengkulak</button>';
   }
   h+='<button class="btn btn-warning" onclick="goSore()"> Lanjut ke Sore</button>';
  }else{
   // Sore - semua jalur bisa jual pasar untuk kelapa tua
   const sc=stockClassSafe();
   if(sc==='tua')h+='<button class="btn btn-warning" onclick="sellPasar()">🛒 Jual kelapa TUA ke pasar</button>';
   if(S.warung&&S.warung.open)h+='<button class="btn btn-primary" onclick="showSupplyShop()">🥥 Beli Kelapa dari Luar (Arbitrase)</button>';
   if((S.day||0)>30){
    if(S.path==='tengkulak'||S.path==='mix')h+='<button class="btn btn-primary" onclick="showSeedShop()">🌱 Bibit Kelapa Super</button>';
   }
   h+='<button class="btn btn-danger" onclick="startSleep()">😴 Tidur (Ganti Hari)</button>';
  }
  if(A)A.innerHTML=h;
 }catch(err){
  console.error('Render error:',err);
  const A=el('actions');
  if(A)A.innerHTML='<p style="color:red">Error: '+err.message+'</p><button class="btn btn-danger" onclick="resetGame()">🔄 Reset</button>';
 }
}

// ===== TOKO PERTANIAN (placeholder untuk komoditas masa depan) =====
function showTokoPertanian(){
 let h='<h3> Toko Pertanian</h3>';
 h+='<p><strong>Bibit Kelapa Super:</strong> Rp 60.000/pohon (Rp 50.000 bibit + Rp 10.000 upah tanam). Hasil 30 butir/bulan.</p>';
 h+='<p>Slot kosong: '+emptySlots()+'</p>';
 h+='<input type="number" id="inp-seed" min="1" max="'+emptySlots()+'" value="1">';
 h+='<button class="btn btn-primary" onclick="buySeedling(parseInt(el(\'inp-seed\').value)||1);closeModal()">Beli Bibit Kelapa</button>';
 h+='<hr style="margin:15px 0">';
 h+='<p><strong>🚧 Komoditas Segera Hadir:</strong></p>';
 h+='<ul style="padding-left:20px">';
 DATA.futureCommodities.forEach(c=>{h+='<li>'+c+' (coming soon)</li>';});
 h+='</ul>';
 h+='<p style="font-size:12px;color:#666">Pupuk, pestisida, dan bibit komoditas lain akan hadir setelah sistem kelapa stabil.</p>';
 h+='<button class="btn" onclick="closeModal()">Tutup</button>';
 showModal(h);
}

function setPhase(p){S.phase=p;save();render();}
function goSore(){
 if(S.phase==='siang'&&S.warung&&S.warung.open&&!S.warung.operatedToday){
  if(!confirm('Warung belum dibuka hari ini. Lewati?'))return;
  if(S.stats)S.stats.missedDays=(S.stats.missedDays||0)+1;
 }
 S.phase='sore';save();render();
}
function showLearn(){
 showModal('<h3> Modul: Fakta Kelapa</h3><ul>'+LEARN.map(x=>'<li>'+x+'</li>').join('')+'</ul><button class="btn btn-primary" onclick="closeModal();render()">✅ Tutup</button>');
}
function showPathChoose(){
 let h='<h3>🧭 Pilih Jalur Usaha</h3><p>Mentor: "Mau fokus ke mana, Bos?"</p>';
 if(DATA.paths){
  Object.keys(DATA.paths).forEach(k=>{
   const p=DATA.paths[k];
   h+='<div style="background:#e8f5e9;padding:12px;margin:8px 0;border-radius:8px"><strong>'+p.name+'</strong><p style="font-size:13px">'+p.desc+'</p><button class="btn btn-primary" onclick="choosePath(\''+k+'\');closeModal()">Pilih</button></div>';
  });
 }
 h+='<button class="btn" onclick="closeModal()">Nanti Saja</button>';
 showModal(h);
}
function showShop(){
 const items=[
  {key:'iceKarung',label:'Es Batu 1 Karung (40 porsi)',price:20000},
  {key:'sugarBloc',label:'Gula Merah 1 Blok (50 porsi)',price:20000},
  {key:'cupPack',label:'Cup Plastik 1 Pak (20 pcs)',price:8000}
 ];
 let h='<h3>🛒 Belanja Bahan Warung</h3>';
 const ice=S.warung?(S.warung.ice||0):0;
 const sugar=S.warung?(S.warung.sugar||0):0;
 const cups=S.warung?(S.warung.cups||0):0;
 const stockQ=(S.stock.biasa||0)+(S.stock.super||0);
 h+='<p>Stok:  '+ice+' | 🍯 '+sugar+' | 🥤 '+cups+' |  '+stockQ+'</p>';
 const cuacaName=(S.cuaca&&DATA.weather[S.cuaca])?DATA.weather[S.cuaca].name:'-';
 h+='<p>Cuaca: '+cuacaName+'</p>';
 items.forEach((it,i)=>{
  h+='<div style="margin:8px 0;padding:8px;background:#f9f9f9;border-radius:6px"><strong>'+it.label+'</strong> - '+safeRp(it.price)+'/unit<br><input type="number" id="shop-'+i+'" min="0" value="0" style="width:80px"> unit</div>';
 });
 h+='<button class="btn btn-success" onclick="doShop()">Beli</button> <button class="btn" onclick="closeModal()">Batal</button>';
 showModal(h);
}
function doShop(){
 const items=[
  {key:'iceKarung',label:'Es Batu 1 Karung',price:20000,portions:40},
  {key:'sugarBloc',label:'Gula Merah 1 Blok',price:20000,portions:50},
  {key:'cupPack',label:'Cup Plastik 1 Pak',price:8000,pcs:20}
 ];
 const buy=[];let total=0;const details=[];
 items.forEach((it,i)=>{
  const inp=el('shop-'+i);
  const qty=inp?(parseInt(inp.value)||0):0;
  if(qty>0){
   const cost=qty*it.price;total+=cost;
   buy.push({key:it.key,qty:qty});
   details.push({name:it.label,qty:qty,unit:it.portions?'porsi':'pcs',subtotal:cost});
  }
 });
 if(total===0){msg('⚠️ Tidak ada yang dibeli.');return;}
 if(S.gold<total){msg('⚠️ Uang tidak cukup.');return;}
 spend('BELANJA','Belanja bahan warung',total,'shopping',details);
 buy.forEach(b=>{
  const def=items.find(x=>x.key===b.key);
  if(b.key==='iceKarung')S.warung.ice=(S.warung.ice||0)+b.qty*def.portions;
  if(b.key==='sugarBloc')S.warung.sugar=(S.warung.sugar||0)+b.qty*def.portions;
  if(b.key==='cupPack')S.warung.cups=(S.warung.cups||0)+b.qty*def.pcs;
 });
 say('Mentor','🤖','Bahan masuk gudang warung.');
 save();closeModal();render();
}
function showSeedShop(){
 const empty=emptySlots();
 showModal('<h3>🌱 Bibit Kelapa Super</h3><p>Bibit Rp 50.000 + upah Rp 10.000 = Rp 60.000/pohon. Hasil 30 butir/bulan.</p><p>Slot kosong: '+empty+'</p><input type="number" id="inp-seed" min="1" max="'+empty+'" value="1"><button class="btn btn-primary" onclick="buySeedling(parseInt(el(\'inp-seed\').value)||1);closeModal()">Beli & Tanam</button> <button class="btn" onclick="closeModal()">Batal</button>');
}
function showAccelOffer(){
 showModal('<h3>⏳ Bibit Tertanam</h3><p>Pohon super berbuah setelah <b>1.080 hari game</b>.</p><button class="btn btn-primary" onclick="closeModal()">🕰 Tunggu 1.080 hari</button><button class="btn btn-warning" onclick="accelIAP();closeModal()">💎 Bundle Rp 1.000 / 5 pohon</button><button class="btn btn-success" onclick="accelAd();closeModal()">📺 Iklan (skip 30 hari)</button>');
}
function showReport(L,net){
 if(!L)L={sales:{},materials:{},dailyExpenses:[]};
 if(!L.sales)L.sales={};
 if(!L.materials)L.materials={};
 if(!L.dailyExpenses)L.dailyExpenses=[];
 const dayNum=(S.day||1)-1;
 let h='<h3>🌙 Laporan Hari '+dayNum+'</h3>';
 const weatherName=(L.weather&&DATA.weather[L.weather])?DATA.weather[L.weather].name:'-';
 h+='<p><strong>Cuaca:</strong> '+weatherName+' | <strong>Pembeli:</strong> '+(L.buyerCount||0)+'</p>';
 h+='<h4>💰 Penghasilan Kotor</h4><table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>🍹 Es ('+(L.sales.es||0)+' gelas)</td><td class="pos">'+safeRp(L.sales.esRev||0)+'</td></tr>';
 h+='<tr><td>🥥 Kelapa utuh ('+(L.sales.whole||0)+' butir)</td><td class="pos">'+safeRp(L.sales.wholeRev||0)+'</td></tr>';
 if(L.sales.tengkulak)h+='<tr><td> Tengkulak ('+L.sales.tengkulak+')</td><td class="pos">'+safeRp(L.sales.tengkulakRev||0)+'</td></tr>';
 if(L.sales.pasar)h+='<tr><td>🛒 Pasar ('+L.sales.pasar+')</td><td class="pos">'+safeRp(L.sales.pasarRev||0)+'</td></tr>';
 h+='<tr><td><b>Total Kotor</b></td><td class="pos"><b>'+safeRp(L.gross||0)+'</b></td></tr></table>';
 h+='<h4> Pengeluaran Detail</h4><table><tr><th>Item</th><th>Nilai</th></tr>';
 L.dailyExpenses.forEach(d=>{h+='<tr><td>'+(d.item||'-')+'</td><td class="neg">-'+safeRp(d.amt||0)+'</td></tr>';});
 h+='<tr><td>🛒 Belanja bahan warung</td><td class="neg">-'+safeRp(L.shopping||0)+'</td></tr>';
 h+='<tr><td>👷 Kuli panen</td><td class="neg">-'+safeRp(L.labor||0)+'</td></tr>';
 h+='<tr><td>🏪 CAPEX</td><td class="neg">-'+safeRp(L.capex||0)+'</td></tr>';
 if(L.bills)h+='<tr><td>🧾 Tagihan bulanan</td><td class="neg">-'+safeRp(L.bills)+'</td></tr>';
 h+='<tr><td><b>Total Pengeluaran</b></td><td class="neg"><b>'+safeRp(L.expense||0)+'</b></td></tr></table>';
 h+='<h4>📦 Bahan Terpakai</h4><p>🥥 '+(L.materials.kelapa||0)+' | 🧊 '+(L.materials.ice||0)+' |  '+(L.materials.sugar||0)+' | 🥤 '+(L.materials.cup||0)+'</p>';
 if(L.lossIcePortions)h+='<p class="neg">🫠 Es mencair '+L.lossIcePortions+' porsi (nilai '+safeRp(L.lossIceValue||0)+')</p>';
 if(L.lost)h+='<p>😢 Pelanggan lepas: '+L.lost+'</p>';
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
 const D=demandToday(),W=wholeBuyersToday();
 if(!S.dayLog)S.dayLog={};
 S.dayLog.buyerCount=D+W;
 SCENE.events=[];
 for(let i=0;i<D;i++)SCENE.events.push({h:DATA.hours.open+Math.floor(Math.random()*12),t:'es'});
 for(let i=0;i<W;i++)SCENE.events.push({h:DATA.hours.open+Math.floor(Math.random()*12),t:'whole'});
 SCENE.events.sort((a,b)=>a.h-b.h);
 safeText('sc-day','Hari '+(S.day||1)+' | '+((S.cuaca&&DATA.weather[S.cuaca])?DATA.weather[S.cuaca].name:'-'));
 const keeperEl=el('keeper');
 if(keeperEl)keeperEl.textContent='🧑‍🍳';
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
 const faces=['🧑🏻','👩🏻','👨🌾','👩‍','👦🏻','👵🏻','👷🏻','‍💼'];
 c.innerHTML='<span class="face">'+faces[Math.floor(Math.random()*faces.length)]+'</span>';
 sc.appendChild(c);
 setTimeout(()=>c.classList.add('walk'),60);
 setTimeout(()=>{
  let ok=false;
  try{
   if(t==='es')ok=trySellEs();
   else ok=trySellWhole();
  }catch(e){console.error('Sell error:',e);ok=false;}
  if(ok){
   c.innerHTML+='<span class="bubble">'+(t==='es'?'🍹':'🥥')+'</span>';
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
 const stockQ=(S.stock.biasa||0)+(S.stock.super||0);
 safeText('sc-coco',stockQ);
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
 const obChar=el('ob-char');
 const obStory=el('ob-story');
 if(obChar)obChar.classList.add('hidden');
 if(obStory)obStory.classList.remove('hidden');
 this.showSlide();
};
OB.showSlide=function(){
 const s=STORY[this.idx];
 if(!s)return;
 const portraitEl=el('st-portrait');
 if(portraitEl){
  if(s[0]==='Kamu'){
   const avatars=PORTR.pemain||['‍🌾'];
   portraitEl.textContent=avatars[S.avatar||0]||'‍🌾';
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
console.log('=== UI.JS INIT ===');
if(typeof initGameState==='function'){
 initGameState();
}else{
 console.error('initGameState tidak ada!');
 loadSaved();
}
console.log('S:',S);
if(S&&!S.storyDone){
 console.log('Onboarding...');
 initAvatars();
}else{
 console.log('Start game...');
 const ob=el('onboard');
 if(ob)ob.remove();
 startGame();
}
console.log('=== UI.JS INIT END ===');

// TAMBAHAN: FITUR BELI DARI LUAR (ARBITRASE)
function showSupplyShop(){
 let h='<h3>🥥 Beli Kelapa dari Luar</h3>';
 h+='<p><strong>Masalah:</strong> Stok kelapa habis sebelum 14 hari? Beli dari petani lain untuk tetap jualan!</p>';
 h+='<div style="background:#e8f5e9;padding:12px;margin:10px 0;border-radius:8px">';
 h+='<p><strong>Opsi 1: Beli dari Petani Lain</strong></p>';
 h+='<p>Harga: Rp 3.500/butir (murah, tapi harus panen sendiri)</p>';
 h+='<p>Cocok untuk: Stok besar, margin tipis tapi aman</p>';
 h+='<button class="btn btn-primary" onclick="buyKelapaLuar(\'petani\')">Beli dari Petani</button>';
 h+='</div>';
 h+='<div style="background:#fff3cd;padding:12px;margin:10px 0;border-radius:8px">';
 h+='<p><strong>Opsi 2: Beli dari Tengkulak</strong></p>';
 h+='<p>Harga: Rp 5.000/butir (mahal, tapi siap pakai)</p>';
 h+='<p>Cocok untuk: Stok mendesak, margin lebih tipis</p>';
 h+='<button class="btn btn-warning" onclick="buyKelapaLuar(\'tengkulak\')">Beli dari Tengkulak</button>';
 h+='</div>';
 h+='<div style="background:#f5f5f5;padding:12px;margin:10px 0;border-radius:8px;font-size:13px">';
 h+='<p><strong>💡 Tips Arbitrase:</strong></p>';
 h+='<p>Beli Rp 3.500 → Olah jadi es → Jual Rp 5.000/gelas (4 gelas/butir = Rp 20.000)</p>';
 h+='<p>HPP es: Rp 1.525/gelas → Profit Rp 3.475/gelas × 4 = Rp 13.900/butir</p>';
 h+='<p>Margin: Rp 13.900 - Rp 3.500 = <b>Rp 10.400/butir</b> (297% ROI!)</p>';
 h+='</div>';
 h+='<button class="btn" onclick="closeModal()">Tutup</button>';
 showModal(h);
}
