function el(id){return document.getElementById(id);}
function say(sp,po,tx){el('d-speaker').textContent=sp;el('d-portrait').textContent=po;el('d-text').textContent=tx;}
function msg(t){const m=el('msg');m.textContent=t;m.classList.remove('hidden');setTimeout(()=>m.classList.add('hidden'),9000);}
function showModal(h){el('modal-body').innerHTML=h;el('modal').classList.remove('hidden');}
function closeModal(){el('modal').classList.add('hidden');}
function stockLabel(){
 const q=stockQty();if(q<=0)return 'Gudang kosong';
 const c=stockClass();
 if(c==='muda')return q+' muda (hari '+stockAge()+'/14)';
 if(c==='tua')return q+' TUA/santan (hari '+stockAge()+'/25)';
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
  say('Mentor','🤖','Pagi, Bos '+S.name+'. Satu hari satu keputusan. Mau ke lahan atau langsung lanjut?');
  if(readyTrees().length&&stockQty()===0)h+='<button class="btn btn-success" onclick="harvest()">🌾 Panen ('+readyTrees().length+' pohon siap)</button>';
  h+='<button class="btn btn-primary" onclick="showLearn()">📚 Modul Belajar Kelapa</button>';
  h+='<button class="btn btn-warning" onclick="setPhase(\'siang\')">➡ Lanjut ke Siang</button>';
 }else if(S.phase==='siang'){
  say('Tengkulak','🧑🏻‍','Saya lewat tiap siang saat panen. Kalau warungmu buka, saingi harga saya kalau bisa.');
  if(!S.warung.open)h+='<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung Es Kelapa (beli peralatan)</button>';
  if(S.warung.open)h+='<button class="btn btn-success" onclick="showProduce()">🍹 Produksi & Jual Es Kelapa</button>';
  if(stockClass()==='muda')h+='<button class="btn btn-warning" onclick="sellTengkulak()">💼 Jual semua ke Tengkulak</button>';
  h+='<button class="btn btn-warning" onclick="setPhase(\'sore\')">➡ Lanjut ke Sore</button>';
 }else{
  say('Mentor','🤖','Sore. Urus gudang dan rencana besok, lalu tidur.');
  if(stockClass()==='tua')h+='<button class="btn btn-warning" onclick="sellPasar()">🛒 Jual kelapa TUA ke pasar (santan)</button>';
  if(S.day>30)h+='<button class="btn btn-primary" onclick="showShop()">🌱 Toko Bibit Kelapa Super</button>';
  h+='<button class="btn btn-danger" onclick="endDay()">😴 Tidur (Akhiri Hari)</button>';
 }
 A.innerHTML=h;
}
function setPhase(p){S.phase=p;save();render();}
function showLearn(){
 showModal('<h3>📚 Modul: Fakta Kelapa (tanpa kesimpulan)</h3><ul>'+LEARN.map(x=>'<li>'+x+'</li>').join('')+'</ul><button class="btn btn-primary" onclick="S.learned=true;save();closeModal();render()">✅ Tutup</button>');
}
function showProduce(){
 const buah=stockQty();
 showModal('<h3>🍹 Produksi Es Kelapa</h3><p>Stok muda: <b>'+buah+' butir</b> (maks '+buah*4+' gelas).</p><p>Biaya: cup Rp 400/gelas; es Rp 20.000 + gula Rp 20.000 sekali per hari.</p><input type="number" id="inp-cups" min="1" max="'+buah*4+'" placeholder="Jumlah gelas..."><button class="btn btn-success" onclick="produceEs(el(\'inp-cups\').value);closeModal()">Produksi & Jual</button> <button class="btn" onclick="closeModal()">Batal</button>');
}
function showShop(){
 showModal('<h3>🌱 Toko Bibit Kelapa Super</h3><p>Bibit Rp 50.000 + upah tanam Rp 10.000 = Rp 60.000/pohon.</p><p>Hasil: 30 butir/bulan; harga tengkulak Rp 5.000/butir.</p><p>Slot kosong: '+emptySlots()+'</p><input type="number" id="inp-seed" min="1" max="'+emptySlots()+'" value="1"><button class="btn btn-primary" onclick="buySeedling(el(\'inp-seed\').value);closeModal()">Beli & Tanam</button> <button class="btn" onclick="closeModal()">Batal</button>');
}
function showAccelOffer(){
 showModal('<h3>⏳ Bibit Tertanam</h3><p>Pohon super berbuah setelah <b>1.080 hari game</b>. Pilih jalan Anda:</p><button class="btn btn-primary" onclick="closeModal()">🕰 Tunggu 1.080 hari</button><button class="btn btn-warning" onclick="accelIAP();closeModal()">💎 Bundle Percepatan Rp 1.000 uang asli / 5 pohon</button><button class="btn btn-success" onclick="accelAd();closeModal()">📺 Tonton Iklan (skip 30 hari)</button>');
}
function showReport(rows,net){
 let h='<h3>🌙 Laporan Hari '+S.day+'</h3><table><tr><th>Pos</th><th>Nilai</th></tr>';
 rows.forEach(r=>h+='<tr><td>'+r[0]+'</td><td class="'+(r[1]<0?'neg':'pos')+'">'+rp(r[1])+'</td></tr>');
 h+='<tr><td><b>Net perubahan hari ini</b></td><td class="'+(net<0?'neg':'pos')+'"><b>'+rp(net)+'</b></td></tr></table>';
 if(S.gold<0)h+='<p class="neg">⚠️ Kas minus! Anda hidup dari utang.</p>';
 h+='<button class="btn btn-primary" onclick="closeModal()">☀ Bangun (Pagi)</button>';
 showModal(h);
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
  if(S.name&&s[0]==='Kamu')el('st-portrait').textContent=PORTR.pemain[S.avatar];else el('st-portrait').textContent=s[1];
  el('st-speaker').textContent=s[0];el('st-text').textContent=s[2];
 },
 nextSlide(){
  this.idx++;
  if(this.idx>=STORY.length){S.storyDone=true;save();startGame();return;}
  this.showSlide();
 }
};
function startGame(){
 el('onboard').classList.add('hidden');el('game').classList.remove('hidden');render();
}
function initAvatars(){
 const w=el('avatar-pick');
 w.innerHTML=PORTR.pemain.map((p,i)=>'<button class="avatar-btn'+(i===0?' sel':'')+'" onclick="OB.av='+i+';initAvatars()">'+p+'</button>').join('');
}
load();
if(!S.storyDone){el('onboard').classList.remove('hidden');initAvatars();}
else startGame();
