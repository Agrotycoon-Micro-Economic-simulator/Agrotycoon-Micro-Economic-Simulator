function el(id){return document.getElementById(id);}
function say(sp,po,tx){el('d-speaker').textContent=sp;el('d-portrait').textContent=po;el('d-text').textContent=tx;}
function msg(t){const m=el('msg');m.textContent=t;m.classList.remove('hidden');setTimeout(()=>m.classList.add('hidden'),9000);}
function showModal(h){el('modal-body').innerHTML=h;el('modal').classList.remove('hidden');}
function closeModal(){el('modal').classList.add('hidden');}
function stockLabel(){
 const q=stockQty();if(q<=0)return 'Gudang kosong';
 const c=stockClass();
 if(c==='muda')return q+' muda (h'+stockAge()+'/14)';
 if(c==='tua')return q+' TUA (h'+stockAge()+'/25)';
 return q+' BUSUK!';
}
function render(){
 el('s-gold').textContent=rp(S.gold);
 el('s-day').textContent=S.day;
 el('s-month').textContent=monthOf(S.day);
 el('s-phase').textContent=S.phase.toUpperCase();
 el('s-stock').textContent=stockLabel();
 el('s-weather').textContent=DATA.weather[S.cuaca].name;
 const A=el('actions');let h='';
 if(S.phase==='pagi'){
  say('Mentor','','Pagi, Bos '+S.name+'. Cuaca: '+DATA.weather[S.cuaca].name+'.');
  if(readyTrees().length&&stockQty()===0)h+='<button class="btn btn-success" onclick="harvest()">🌾 Panen ('+readyTrees().length+' pohon)</button>';
  if(S.warung.open){
   h+='<button class="btn btn-primary" onclick="showShop()">🛒 Belanja Bahan Warung</button>';
   h+='<button class="btn btn-warning" onclick="showLivingShop()">🛒 Belanja Kebutuhan Harian</button>';
   if(!S.warung.fridge)h+='<button class="btn btn-primary" onclick="buyFridge()">️ Beli Kulkas (Rp 2.000.000)</button>';
  }
  if(!S.path)h+='<button class="btn btn-primary" onclick="showPathChoose()"> Pilih Jalur Usaha</button>';
  h+='<button class="btn btn-primary" onclick="showLearn()">📚 Modul Belajar</button>';
  h+='<button class="btn btn-warning" onclick="setPhase(\'siang\')">➡ Lanjut ke Siang</button>';
 }else if(S.phase==='siang'){
  if(!S.warung.open){
   say('Tengkulak','‍💼','Saya lewat tiap siang saat panen.');
   h+='<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung Es Kelapa</button>';
  }else if(!S.warung.operatedToday){
   say('Mentor','🤖','Cuaca: '+DATA.weather[S.cuaca].name+'. '+(S.warung.cups>0?S.warung.cups+' gelas siap.':'Belanja bahan dulu.'));
   h+='<button class="btn btn-success" onclick="openScene()">🏪 BUKA WARUNG (09-21)</button>';
  }else{
   say('Mentor','🤖','Warung sudah beroperasi hari ini.');
  }
  if(stockClass()==='muda')h+='<button class="btn btn-warning" onclick="sellTengkulak()">💼 Jual ke Tengkulak</button>';
  h+='<button class="btn btn-warning" onclick="goSore()">➡ Lanjut ke Sore</button>';
 }else{
  say('Mentor','🤖','Sore. Urus gudang dan rencana besok, lalu tidur.');
  if(stockClass()==='tua')h+='<button class="btn btn-warning" onclick="sellPasar()">🛒 Jual kelapa TUA ke pasar</button>';
  if(S.day>30)h+='<button class="btn btn-primary" onclick="showSeedShop()">🌱 Toko Bibit Kelapa Super</button>';
  h+='<button class="btn btn-danger" onclick="startSleep()">😴 Tidur (Ganti Hari)</button>';
 }
 A.innerHTML=h;
}
function setPhase(p){S.phase=p;save();render();}
function goSore(){
 if(S.phase==='siang'&&S.warung.open&&!S.warung.operatedToday){
  if(!confirm('Warung belum dibuka hari ini. Lewati?'))return;
  S.stats.missedDays++;
 }
 S.phase='sore';save();render();
}
function showLearn(){
 showModal('<h3>📚 Modul: Fakta Kelapa</h3><ul>'+LEARN.map(x=>'<li>'+x+'</li>').join('')+'</ul><button class="btn btn-primary" onclick="closeModal();render()">✅ Tutup</button>');
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
function showShop(){
 const items=[
  {key:'iceKarung',label:'Es Batu 1 Karung (40 porsi)',price:20000},
  {key:'sugarBloc',label:'Gula Merah 1 Blok (50 porsi)',price:20000},
  {key:'cupPack',label:'Cup Plastik 1 Pak (20 pcs)',price:8000}
 ];
 let h='<h3>🛒 Belanja Bahan Warung</h3>';
 h+='<p>Stok: 🧊 '+S.warung.ice+' | 🍯 '+S.warung.sugar+' | 🥤 '+S.warung.cups+' | 🥥 '+stockQty()+'</p>';
 h+='<p>Cuaca: '+DATA.weather[S.cuaca].name+'</p>';
 items.forEach((it,i)=>{
  h+='<div style="margin:8px 0;padding:8px;background:#f9f9f9;border-radius:6px"><strong>'+it.label+'</strong> - '+rp(it.price)+'/unit<br><input type="number" id="shop-'+i+'" min="0" value="0" style="width:80px"> unit</div>';
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
  const qty=+el('shop-'+i).value||0;
  if(qty>0){
   const cost=qty*it.price;total+=cost;
   buy.push({key:it.key,qty});
   details.push({name:it.label,qty,unit:it.portions?'porsi':'pcs',subtotal:cost});
  }
 });
 if(total===0){msg('️ Tidak ada yang dibeli.');return;}
 if(S.gold<total){msg('⚠️ Uang tidak cukup.');return;}
 spend('BELANJA','Belanja bahan warung',total,'shopping',details);
 buy.forEach(b=>{
  const def=items.find(x=>x.key===b.key);
  if(b.key==='iceKarung')S.warung.ice+=b.qty*def.portions;
  if(b.key==='sugarBloc')S.warung.sugar+=b.qty*def.portions;
  if(b.key==='cupPack')S.warung.cups+=b.qty*def.pcs;
 });
 say('Mentor','🤖','Bahan masuk gudang warung.');
 save();closeModal();render();
}
function showLivingShop(){
 const items=[
  {key:'rice',label:'Beras 1 kg (untuk 2 hari)',price:12000,stock:S.livingStock.rice},
  {key:'lauk',label:'Lauk (tempe+ikan asin)',price:10000,stock:S.livingStock.lauk},
  {key:'oil',label:'Minyak goreng 130ml',price:4200,stock:S.livingStock.oil}
 ];
 let h='<h3>🛒 Belanja Kebutuhan Harian</h3>';
 h+='<p>Stok: 🍚 '+S.livingStock.rice+' kg | 🥘 '+S.livingStock.lauk+' | ️ '+S.livingStock.oil+'</p>';
 items.forEach((it,i)=>{
  h+='<div style="margin:8px 0;padding:8px;background:#f9f9f9;border-radius:6px"><strong>'+it.label+'</strong> - '+rp(it.price)+' (stok: '+it.stock+')<br><button class="btn btn-primary" onclick="buyLivingItem(\''+it.key+'\');closeModal();render()">Beli 1</button></div>';
 });
 h+='<button class="btn" onclick="closeModal()">Tutup</button>';
 showModal(h);
}
function showSeedShop(){
 showModal('<h3>🌱 Toko Bibit Kelapa Super</h3><p>Bibit Rp 50.000 + upah Rp 10.000 = Rp 60.000/pohon. Hasil 30 butir/bulan.</p><p>Slot kosong: '+emptySlots()+'</p><input type="number" id="inp-seed" min="1" max="'+emptySlots()+'" value="1"><button class="btn btn-primary" onclick="buySeedling(el(\'inp-seed\').value);closeModal()">Beli & Tanam</button> <button class="btn" onclick="closeModal()">Batal</button>');
}
function showAccelOffer(){
 showModal('<h3>⏳ Bibit Tertanam</h3><p>Pohon super berbuah setelah <b>1.080 hari game</b>.</p><button class="btn btn-primary" onclick="closeModal()">🕰 Tunggu 1.080 hari</button><button class="btn btn-warning" onclick="accelIAP();closeModal()">💎 Bundle Rp 1.000 / 5 pohon</button><button class="btn btn-success" onclick="accelAd();closeModal()">📺 Iklan (skip 30 hari)</button>');
}
function showReport(L,net){
 let h='<h3>🌙 Laporan Hari '+(S.day-1)+'</h3>';
 h+='<p><strong>Cuaca:</strong> '+DATA.weather[L.weather].name+' | <strong>Pembeli:</strong> '+L.buyerCount+'</p>';
 h+='<h4>💰 Penghasilan Kotor</h4><table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>🍹 Es ('+L.sales.es+' gelas)</td><td class="pos">'+rp(L.sales.esRev)+'</td></tr>';
 h+='<tr><td> Kelapa utuh ('+L.sales.whole+' butir)</td><td class="pos">'+rp(L.sales.wholeRev)+'</td></tr>';
 if(L.sales.tengkulak)h+='<tr><td>💼 Tengkulak ('+L.sales.tengkulak+')</td><td class="pos">'+rp(L.sales.tengkulakRev)+'</td></tr>';
 if(L.sales.pasar)h+='<tr><td>🛒 Pasar ('+L.sales.pasar+')</td><td class="pos">'+rp(L.sales.pasarRev)+'</td></tr>';
 h+='<tr><td><b>Total Kotor</b></td><td class="pos"><b>'+rp(L.gross)+'</b></td></tr></table>';
 h+='<h4>📤 Pengeluaran Detail</h4><table><tr><th>Item</th><th>Nilai</th></tr>';
 L.dailyExpenses.forEach(d=>{h+='<tr><td>'+d.item+'</td><td class="neg">-'+rp(d.amt)+'</td></tr>';});
 h+='<tr><td>🛒 Belanja bahan warung</td><td class="neg">-'+rp(L.shopping)+'</td></tr>';
 h+='<tr><td>👷 Kuli panen</td><td class="neg">-'+rp(L.labor)+'</td></tr>';
 h+='<tr><td>🏪 CAPEX</td><td class="neg">-'+rp(L.capex)+'</td></tr>';
 if(L.bills)h+='<tr><td>🧾 Tagihan bulanan</td><td class="neg">-'+rp(L.bills)+'</td></tr>';
 h+='<tr><td><b>Total Pengeluaran</b></td><td class="neg"><b>'+rp(L.expense)+'</b></td></tr></table>';
 h+='<h4> Bahan Terpakai</h4><p> '+L.materials.kelapa+' |  '+L.materials.ice+' |  '+L.materials.sugar+' | 🥤 '+L.materials.cup+'</p>';
 if(L.lossIcePortions)h+='<p class="neg">🫠 Es mencair '+L.lossIcePortions+' porsi (nilai '+rp(L.lossIceValue)+')</p>';
 if(L.lost)h+='<p>😢 Pelanggan lepas: '+L.lost+'</p>';
 h+='<h3 style="margin-top:15px">NET PROFIT: <span class="'+(net<0?'neg':'pos')+'">'+rp(net)+'</span></h3>';
 h+='<p><b>🤖 AI:</b> "Kamu hari ini '+(net>=0?'untung':'rugi')+' bersih '+rp(Math.abs(net))+'. '+(net>=0?'Pertahankan.':'Evaluasi belanja & cuaca.')+'"</p>';
 h+='<button class="btn btn-primary" onclick="closeModal()">☀ Bangun (Hari '+S.day+')</button>';
 showModal(h);
}
const SCENE={timer:null,hour:9,events:[],idx:0,done:false};
function openScene(){
 S.warung.operatedToday=true;
 SCENE.hour=DATA.hours.open;SCENE.done=false;SCENE.idx=0;
 const D=demandToday(),W=wholeBuyersToday();
 S.dayLog.buyerCount=D+W;
 SCENE.events=[];
 for(let i=0;i<D;i++)SCENE.events.push({h:DATA.hours.open+Math.floor(Math.random()*12),t:'es'});
 for(let i=0;i<W;i++)SCENE.events.push({h:DATA.hours.open+Math.floor(Math.random()*12),t:'whole'});
 SCENE.events.sort((a,b)=>a.h-b.h);
 el('sc-day').textContent='Hari '+S.day+' | '+DATA.weather[S.cuaca].name;
 el('keeper').textContent=PORTR.pemain[S.avatar]||'‍🍳';
 updScene();
 el('warung-scene').classList.remove('hidden');
 SCENE.timer=setInterval(tickHour,DATA.hours.secPerHour);
 tickHourUI();
}
function tickHour(){
 SCENE.hour++;
 if(SCENE.hour>DATA.hours.close){closeScene(false);return;}
 tickHourUI();
 spawnForHour(SCENE.hour-1);
}
function tickHourUI(){el('sc-clock').textContent=(SCENE.hour<10?'0':'')+SCENE.hour+'.00';}
function spawnForHour(h){
 const list=SCENE.events.filter(e=>e.h===h);
 list.forEach((e,i)=>setTimeout(()=>spawnCustomer(e.t),i*500));
}
function spawnCustomer(t){
 if(el('warung-scene').classList.contains('hidden'))return;
 const sc=el('scene');
 const c=document.createElement('div');c.className='customer';
 const faces=['🏻','👩🏻','👨‍🌾','👩‍🌾','👦🏻','👵🏻','👷🏻','‍💼'];
 c.innerHTML='<span class="face">'+faces[Math.floor(Math.random()*faces.length)]+'</span>';
 sc.appendChild(c);
 setTimeout(()=>c.classList.add('walk'),60);
 setTimeout(()=>{
  let ok=false;
  if(t==='es')ok=trySellEs();else ok=trySellWhole();
  if(ok){c.innerHTML+='<span class="bubble">'+(t==='es'?'🍹':'🥥')+'</span>';floatText(t==='es'?'+Rp5.000':'+Rp13.000');}
  else{c.innerHTML+='<span class="bubble">💢</span>';S.dayLog.lost++;S.stats.lostSales++;floatText('Stok habis!');}
  updScene();save();
  setTimeout(()=>{c.classList.add('leave');setTimeout(()=>c.remove(),1200);},700);
 },1200);
}
function floatText(t){const f=document.createElement('div');f.className='float-money';f.textContent=t;el('scene').appendChild(f);setTimeout(()=>f.remove(),1300);}
function updScene(){
 el('sc-es').textContent=S.dayLog.sales.es;
 el('sc-whole').textContent=S.dayLog.sales.whole;
 el('sc-rev').textContent=rp(S.dayLog.sales.esRev+S.dayLog.sales.wholeRev);
 el('sc-lost').textContent=S.dayLog.lost;
 el('sc-ice').textContent=S.warung.ice;
 el('sc-sugar').textContent=S.warung.sugar;
 el('sc-cup').textContent=S.warung.cups;
 el('sc-coco').textContent=stockQty();
}
function closeScene(silent){
 if(el('warung-scene').classList.contains('hidden'))return;
 clearInterval(SCENE.timer);
 el('warung-scene').classList.add('hidden');
 if(!silent)say('Mentor','🤖','Warung tutup. Es '+S.dayLog.sales.es+', utuh '+S.dayLog.sales.whole+'.'+(S.warung.fridge?' Sisa es aman di kulkas.':' Sisa es mencair malam ini.'));
 save();render();
}
const OB={idx:0,av:0,
 startStory(){
  const n=el('inp-name').value.trim();
  if(!n){alert('Isi nama Anda dulu.');return;}
  S.name=n;S.avatar=this.av;
  el('ob-char').classList.add('hidden');el('ob-story').classList.remove('hidden');
  this.showSlide();
 },
 showSlide(){
  const s=STORY[this.idx];
  el('st-portrait').textContent=(s[0]==='Kamu')?(PORTR.pemain[S.avatar]):s[1];
  el('st-speaker').textContent=s[0];el('st-text').textContent=s[2];
 },
 nextSlide(){
  this.idx++;
  if(this.idx>=STORY.length){S.storyDone=true;save();finishOnboard();return;}
  this.showSlide();
 }
};
function finishOnboard(){const ob=el('onboard');if(ob)ob.remove();startGame();}
function startGame(){el('game').classList.remove('hidden');render();}
function initAvatars(){
 el('avatar-pick').innerHTML=PORTR.pemain.map((p,i)=>'<button class="avatar-btn'+(i===0?' sel':'')+'" onclick="OB.av='+i+';initAvatars()">'+p+'</button>').join('');
}

// INISIALISASI UTAMA - WAJIB PANGGIL initGameState()
initGameState();
if(!S.storyDone){initAvatars();}
else{const ob=el('onboard');if(ob)ob.remove();startGame();}
