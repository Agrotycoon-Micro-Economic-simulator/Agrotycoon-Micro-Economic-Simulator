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
 const A=el('actions');let h='';
 if(S.phase==='pagi'){
  say('Mentor','🤖','Pagi, Bos '+S.name+'. Kelola lahan dan belanja bahan dagang.');
  if(readyTrees().length&&stockQty()===0)h+='<button class="btn btn-success" onclick="harvest()">🌾 Panen ('+readyTrees().length+' pohon siap)</button>';
  if(S.warung.open)h+='<button class="btn btn-primary" onclick="showShop()">🛒 Belanja Bahan (es/gula/cup)</button>';
  h+='<button class="btn btn-primary" onclick="showLearn()">📚 Modul Belajar</button>';
  h+='<button class="btn btn-warning" onclick="setPhase(\'siang\')">➡ Lanjut ke Siang</button>';
 }else if(S.phase==='siang'){
  if(!S.warung.open){
   say('Tengkulak','🧑🏻‍💼','Saya lewat tiap siang saat panen. Kalau warungmu buka, saingi harga saya kalau bisa.');
   h+='<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung Es Kelapa (beli peralatan)</button>';
  }else if(!S.warung.operatedToday){
   say('Mentor','🤖','Jam 09.00-21.00. Buka warung dan biarkan pelanggan datang sendiri.');
   h+='<button class="btn btn-success" onclick="openScene()">🏪 BUKA WARUNG (09.00-21.00)</button>';
  }else{
   say('Mentor','🤖','Warung sudah beroperasi hari ini. Lanjutkan ke sore.');
  }
  if(stockClass()==='muda')h+='<button class="btn btn-warning" onclick="sellTengkulak()">💼 Jual semua ke Tengkulak</button>';
  h+='<button class="btn btn-warning" onclick="goSore()">➡ Lanjut ke Sore</button>';
 }else{
  say('Mentor','🤖','Sore. Urus gudang dan rencana besok, lalu tidur.');
  if(stockClass()==='tua')h+='<button class="btn btn-warning" onclick="sellPasar()">🛒 Jual kelapa TUA ke pasar (santan)</button>';
  if(S.day>30)h+='<button class="btn btn-primary" onclick="showSeedShop()">🌱 Toko Bibit Kelapa Super</button>';
  h+='<button class="btn btn-danger" onclick="startSleep()">😴 Tidur (Ganti Hari)</button>';
 }
 A.innerHTML=h;
}
function setPhase(p){S.phase=p;save();render();}
function goSore(){
 if(S.phase==='siang'&&S.warung.open&&!S.warung.operatedToday){
  if(!confirm('Warung belum dibuka hari ini. Permintaan hari ini akan hilang. Lewati?'))return;
  S.stats.missedDays++;
 }
 S.phase='sore';save();render();
}
function showLearn(){
 showModal('<h3>📚 Modul: Fakta Kelapa (tanpa kesimpulan)</h3><ul>'+LEARN.map(x=>'<li>'+x+'</li>').join('')+'</ul><button class="btn btn-primary" onclick="closeModal();render()">✅ Tutup</button>');
}
function showShop(){
 showModal('<h3>🛒 Belanja Bahan Harian</h3>'+
 '<p>Stok saat ini: 🧊 '+S.warung.ice+' porsi | 🍯 '+S.warung.sugar+' porsi | 🥤 '+S.warung.cups+' pcs | 🥥 '+stockQty()+' butir</p>'+
 '<p>Es Rp 20.000/karung = 40 porsi (mencair malam!). Gula Rp 20.000/blok = 50 porsi. Cup Rp 8.000/pak = 20 pcs.</p>'+
 '<input type="number" id="in-ice" min="0" value="0" placeholder="Karung es">'+
 '<input type="number" id="in-sugar" min="0" value="0" placeholder="Blok gula">'+
 '<input type="number" id="in-cup" min="0" value="0" placeholder="Pak cup">'+
 '<button class="btn btn-success" onclick="if(shopMaterials(el(\'in-ice\').value,el(\'in-sugar\').value,el(\'in-cup\').value))closeModal()">Beli</button> '+
 '<button class="btn" onclick="closeModal()">Batal</button>');
}
function showSeedShop(){
 showModal('<h3>🌱 Toko Bibit Kelapa Super</h3><p>Bibit Rp 50.000 + upah tanam Rp 10.000 = Rp 60.000/pohon. Hasil 30 butir/bulan.</p><p>Slot kosong: '+emptySlots()+'</p><input type="number" id="inp-seed" min="1" max="'+emptySlots()+'" value="1"><button class="btn btn-primary" onclick="buySeedling(el(\'inp-seed\').value);closeModal()">Beli & Tanam</button> <button class="btn" onclick="closeModal()">Batal</button>');
}
function showAccelOffer(){
 showModal('<h3>⏳ Bibit Tertanam</h3><p>Pohon super berbuah setelah <b>1.080 hari game</b>.</p><button class="btn btn-primary" onclick="closeModal()">🕰 Tunggu 1.080 hari</button><button class="btn btn-warning" onclick="accelIAP();closeModal()">💎 Bundle Rp 1.000 uang asli / 5 pohon</button><button class="btn btn-success" onclick="accelAd();closeModal()">📺 Tonton Iklan (skip 30 hari)</button>');
}
function showReport(L,net){
 let h='<h3>🌙 Laporan Hari '+(S.day-1)+'</h3>';
 h+='<table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>🍹 Penjualan es ('+L.sales.es+' gelas)</td><td class="pos">'+rp(L.sales.esRev)+'</td></tr>';
 h+='<tr><td>🥥 Penjualan kelapa utuh ('+L.sales.whole+' butir)</td><td class="pos">'+rp(L.sales.wholeRev)+'</td></tr>';
 if(L.sales.tengkulak)h+='<tr><td>💼 Tengkulak ('+L.sales.tengkulak+' butir)</td><td class="pos">'+rp(L.sales.tengkulakRev)+'</td></tr>';
 if(L.sales.pasar)h+='<tr><td>🛒 Pasar santan ('+L.sales.pasar+' butir)</td><td class="pos">'+rp(L.sales.pasarRev)+'</td></tr>';
 h+='<tr><td><b>Penghasilan Kotor</b></td><td class="pos"><b>'+rp(L.gross)+'</b></td></tr>';
 h+='<tr><td>🛒 Modal belanja harian</td><td class="neg">-'+rp(L.shopping)+'</td></tr>';
 h+='<tr><td>👷 Tenaga (kuli panen)</td><td class="neg">-'+rp(L.labor)+'</td></tr>';
 h+='<tr><td>🏪 CAPEX peralatan/bibit</td><td class="neg">-'+rp(L.capex)+'</td></tr>';
 h+='<tr><td>🍚 Biaya hidup makan</td><td class="neg">-'+rp(L.living)+'</td></tr>';
 if(L.bills)h+='<tr><td>🧾 Tagihan bulanan</td><td class="neg">-'+rp(L.bills)+'</td></tr>';
 h+='<tr><td><b>Total Pengeluaran</b></td><td class="neg"><b>'+rp(L.expense)+'</b></td></tr>';
 h+='<tr><td>📦 Bahan terpakai</td><td>🥥 '+L.materials.kelapa+' | 🧊 '+L.materials.ice+' | 🍯 '+L.materials.sugar+' | 🥤 '+L.materials.cup+'</td></tr>';
 if(L.lossIcePortions)h+='<tr><td>🫠 Es mencair ('+L.lossIcePortions+' porsi)</td><td class="neg">nilai '+rp(L.lossIceValue)+'</td></tr>';
 if(L.lost)h+='<tr><td>😢 Pelanggan lepas</td><td>'+L.lost+' orang</td></tr>';
 h+='<tr><td><b>NET PROFIT</b></td><td class="'+(net<0?'neg':'pos')+'"><b>'+rp(net)+'</b></td></tr></table>';
 h+='<p><b>🤖 AI Mentor:</b> "Kamu hari ini '+(net>=0?'untung bersih':'rugi bersih')+' '+rp(Math.abs(net))+'. Ini laporannya. '+(net>=0?'Pertahankan ritme ini.':'Evaluasi belanja bahan dan jam bukamu.')+'"</p>';
 h+='<button class="btn btn-primary" onclick="closeModal()">☀ Bangun (Hari '+S.day+')</button>';
 showModal(h);
}
const SCENE={timer:null,hour:9,events:[],idx:0,done:false};
function openScene(){
 S.warung.operatedToday=true;
 SCENE.hour=DATA.hours.open;SCENE.done=false;SCENE.idx=0;
 const D=demandToday(),W=wholeBuyersToday();
 SCENE.events=[];
 for(let i=0;i<D;i++)SCENE.events.push({h:DATA.hours.open+Math.floor(Math.random()*12),t:'es'});
 for(let i=0;i<W;i++)SCENE.events.push({h:DATA.hours.open+Math.floor(Math.random()*12),t:'whole'});
 SCENE.events.sort((a,b)=>a.h-b.h);
 el('sc-day').textContent='Hari '+S.day;
 el('keeper').textContent=PORTR.pemain[S.avatar]||'🧑🏻‍🍳';
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
 const faces=['🧑🏻','👩🏻','👨🏻‍','🏻','👦🏻','👵🏻','👷🏻','👩🏻‍'];
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
 if(!silent)say('Mentor','🤖','Warung tutup jam '+el('sc-clock').textContent+'. Es terjual '+S.dayLog.sales.es+' gelas, kelapa utuh '+S.dayLog.sales.whole+' butir. Sisa es akan mencair malam ini.');
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
if(DEV_MODE){loadFresh();}else{loadSaved();}
if(!S.storyDone){initAvatars();}
else{const ob=el('onboard');if(ob)ob.remove();startGame();}
