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
  say('Mentor','','Pagi, Bos '+S.name+'. Kelola lahan dan belanja bahan dagang.');
  if(readyTrees().length&&stockQty()===0)h+='<button class="btn btn-success" onclick="harvest()">🌾 Panen ('+readyTrees().length+' pohon siap)</button>';
  if(S.warung.open)h+='<button class="btn btn-primary" onclick="showShop()">🛒 Belanja Bahan (hitung otomatis)</button>';
  h+='<button class="btn btn-primary" onclick="showLearn()"> Modul Belajar</button>';
  h+='<button class="btn btn-warning" onclick="setPhase(\'siang\')">➡ Lanjut ke Siang</button>';
 }else if(S.phase==='siang'){
  if(!S.warung.open){
   say('Tengkulak','🧑‍💼','Saya lewat tiap siang saat panen. Kalau warungmu buka, saingi harga saya kalau bisa.');
   h+='<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung Es Kelapa (beli peralatan)</button>';
  }else if(!S.warung.operatedToday){
   say('Mentor','🤖',S.warung.cups>0?('Siang ramai. '+S.warung.cups+' gelas siap dijual. Buka warung dan layani pelanggan!'):'Tidak ada gelas siap jual. Produksi dulu pagi tadi, atau jual butir ke tengkulak.');
   if(S.warung.cups>0)h+='<button class="btn btn-success" onclick="openScene()">🏪 BUKA WARUNG (09.00-21.00)</button>';
  }else{
   say('Mentor','🤖','Warung sudah beroperasi hari ini. Lanjutkan ke sore.');
  }
  if(stockClass()==='muda')h+='<button class="btn btn-warning" onclick="sellTengkulak()"> Jual semua ke Tengkulak</button>';
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
 // Hitung stok bahan saat ini
 const curIce=S.warung.ice, curSugar=S.warung.sugar, curCup=S.warung.cups;
 const maxFromCoconut=stockQty()*4; // maksimal gelas dari stok kelapa
 const maxFromIce=curIce;
 const maxFromSugar=curSugar;
 const maxFromCup=curCup;
 const maxPossible=Math.min(maxFromCoconut, maxFromIce, maxFromSugar, maxFromCup);
 
 showModal('<h3>🛒 Belanja Bahan Harian (Otomatis)</h3>'+
 '<p>Stok saat ini: 🧊 '+curIce+' porsi | 🍯 '+curSugar+' porsi |  '+curCup+' pcs | 🥥 '+stockQty()+' butir (= '+maxFromCoconut+' gelas)</p>'+
 '<p><strong>Masukkan jumlah gelas yang ingin diproduksi hari ini:</strong></p>'+
 '<p style="font-size:12px;color:#666">Sistem akan otomatis hitung berapa karung es, blok gula, dan pak cup yang perlu dibeli.</p>'+
 '<input type="number" id="in-gelas" min="1" max="'+Math.max(1,maxFromCoconut)+'" value="'+Math.min(40,maxFromCoconut)+'" placeholder="Jumlah gelas...">'+
 '<button class="btn btn-primary" onclick="previewShop()">🔍 Hitung Biaya</button> '+
 '<button class="btn" onclick="closeModal()">Batal</button>'+
 '<div id="shop-preview" style="margin-top:15px"></div>');
}
function previewShop(){
 const gelas=+el('in-gelas').value;
 if(!gelas||gelas<=0){msg('⚠️ Masukkan jumlah gelas.');return;}
 
 // Hitung kebutuhan bahan
 const needIce=Math.max(0, gelas-S.warung.ice);
 const needSugar=Math.max(0, gelas-S.warung.sugar);
 const needCup=Math.max(0, gelas-S.warung.cups);
 
 // Konversi ke unit belanja
 const karung=Math.ceil(needIce/DATA.shop.icePortions);
 const blok=Math.ceil(needSugar/DATA.shop.sugarPortions);
 const pak=Math.ceil(needCup/DATA.shop.cupPcs);
 
 const cost=karung*DATA.shop.iceKarung+blok*DATA.shop.sugarBloc+pak*DATA.shop.cupPack;
 
 // Cek stok kelapa
 if(gelas>stockQty()*4){
  el('shop-preview').innerHTML='<p style="color:#d32f2f">⚠️ Stok kelapa tidak cukup! Butuh '+Math.ceil(gelas/4)+' butir, punya '+stockQty()+' butir.</p>';
  return;
 }
 
 if(cost===0){
  el('shop-preview').innerHTML='<p style="color:#2E7D32">✅ Bahan sudah cukup untuk '+gelas+' gelas. Tidak perlu belanja!</p>'+
   '<button class="btn btn-success" onclick="closeModal()">OK</button>';
  return;
 }
 
 el('shop-preview').innerHTML=
 '<div style="background:#e8f5e9;padding:12px;border-radius:8px;margin:10px 0">'+
 '<p><strong>Untuk produksi '+gelas+' gelas, sistem akan beli:</strong></p>'+
 (karung>0?'<p>🧊 '+karung+' karung es × Rp '+DATA.shop.iceKarung.toLocaleString('id-ID')+' = Rp '+(karung*DATA.shop.iceKarung).toLocaleString('id-ID')+'</p>':'')+
 (blok>0?'<p> '+blok+' blok gula × Rp '+DATA.shop.sugarBloc.toLocaleString('id-ID')+' = Rp '+(blok*DATA.shop.sugarBloc).toLocaleString('id-ID')+'</p>':'')+
 (pak>0?'<p>🥤 '+pak+' pak cup × Rp '+DATA.shop.cupPack.toLocaleString('id-ID')+' = Rp '+(pak*DATA.shop.cupPack).toLocaleString('id-ID')+'</p>':'')+
 '<hr><p><strong>Total: Rp '+cost.toLocaleString('id-ID')+'</strong></p>'+
 '<p style="font-size:12px">Saldo Anda: Rp '+S.gold.toLocaleString('id-ID')+'</p>'+
 (cost>S.gold?'<p style="color:#d32f2f">⚠️ Uang tidak cukup!</p>':'')+
 '</div>'+
 '<button class="btn btn-success" onclick="confirmShop('+karung+','+blok+','+pak+','+cost+')">✅ Beli Sekarang</button> '+
 '<button class="btn" onclick="closeModal()">Batal</button>';
}
function confirmShop(k,b,p,cost){
 if(S.gold<cost){msg('️ Uang tidak cukup.');return;}
 spend('BELANJA','Belanja es '+k+' karung, gula '+b+' blok, cup '+p+' pak',cost,'shopping');
 S.warung.ice+=k*DATA.shop.icePortions;
 S.warung.sugar+=b*DATA.shop.sugarPortions;
 S.warung.cups+=p*DATA.shop.cupPcs;
 say('Mentor','','Bahan masuk gudang warung. Ingat: es sisa akan mencair malam nanti.');
 save();closeModal();render();
}
function showSeedShop(){
 showModal('<h3>🌱 Toko Bibit Kelapa Super</h3><p>Bibit Rp 50.000 + upah tanam Rp 10.000 = Rp 60.000/pohon. Hasil 30 butir/bulan.</p><p>Slot kosong: '+emptySlots()+'</p><input type="number" id="inp-seed" min="1" max="'+emptySlots()+'" value="1"><button class="btn btn-primary" onclick="buySeedling(el(\'inp-seed\').value);closeModal()">Beli & Tanam</button> <button class="btn" onclick="closeModal()">Batal</button>');
}
function showAccelOffer(){
 showModal('<h3> Bibit Tertanam</h3><p>Pohon super berbuah setelah <b>1.080 hari game</b>.</p><button class="btn btn-primary" onclick="closeModal()">🕰 Tunggu 1.080 hari</button><button class="btn btn-warning" onclick="accelIAP();closeModal()">💎 Bundle Rp 1.000 uang asli / 5 pohon</button><button class="btn btn-success" onclick="accelAd();closeModal()">📺 Tonton Iklan (skip 30 hari)</button>');
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
 h+='<tr><td>📦 Bahan terpakai</td><td>🥥 '+L.materials.kelapa+' | 🧊 '+L.materials.ice+' |  '+L.materials.sugar+' |  '+L.materials.cup+'</td></tr>';
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
 el('keeper').textContent=PORTR.pemain[S.avatar]||'🧑🏻‍';
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
 const faces=['🧑🏻','👩🏻','👨‍','🏻','🏻','👵🏻','👷🏻','👩‍'];
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
 if(!silent)say('Mentor','','Warung tutup jam '+el('sc-clock').textContent+'. Es terjual '+S.dayLog.sales.es+' gelas, kelapa utuh '+S.dayLog.sales.whole+' butir. Sisa es akan mencair malam ini.');
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
