// ===== HELPER FUNCTIONS =====
function el(id){
 var e = document.getElementById(id);
 return e;
}
function safeRp(n){
 if(n === undefined || n === null || isNaN(n)) return 'Rp 0';
 return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}
function safeText(id, text){
 var e = el(id);
 if(e) e.textContent = (text === undefined || text === null) ? '-' : String(text);
}
function safeHtml(id, html){
 var e = el(id);
 if(e) e.innerHTML = (html === undefined || html === null) ? '' : html;
}

function say(sp, po, tx){
 safeText('d-speaker', sp);
 safeText('d-portrait', po);
 safeText('d-text', tx);
}

function msg(t){
 var m = el('msg');
 if(m){
  m.textContent = t;
  m.classList.remove('hidden');
  setTimeout(function(){ m.classList.add('hidden'); }, 9000);
 }
}

function showModal(h){
 var mb = el('modal-body');
 var modal = el('modal');
 if(mb) mb.innerHTML = h;
 if(modal) modal.classList.remove('hidden');
}

function closeModal(){
 var m = el('modal');
 if(m) m.classList.add('hidden');
}

function stockLabel(){
 if(!S || !S.stock) return 'Gudang kosong';
 var q = (S.stock.biasa || 0) + (S.stock.super || 0);
 if(q <= 0) return 'Gudang kosong';
 var age = S.day - (S.harvestDay || 0);
 if(age <= DATA.degrade.muda) return q + ' muda (h' + age + '/14)';
 if(age <= DATA.degrade.tua) return q + ' TUA (h' + age + '/25)';
 return q + ' BUSUK!';
}

// ===== RENDER UTAMA =====
function render(){
 try {
  if(!S){
   console.error('S is undefined in render()');
   return;
  }
  
  // Update stats bar
  safeText('s-gold', safeRp(S.gold));
  safeText('s-day', S.day || 1);
  safeText('s-month', monthOf(S.day || 1));
  safeText('s-stock', stockLabel());
  
  var cuacaName = '-';
  if(S.cuaca && DATA.weather && DATA.weather[S.cuaca]){
   cuacaName = DATA.weather[S.cuaca].name;
  }
  safeText('s-weather', cuacaName);
  
  // Update dialog
  var phase = S.phase || 'pagi';
  var speaker = 'Mentor';
  var portrait = '';
  var dialogText = '';
  
  if(phase === 'pagi'){
   speaker = 'Mentor';
   portrait = '🤖';
   dialogText = 'Pagi, Bos ' + (S.name || '') + '. Cuaca: ' + cuacaName + '.';
  } else if(phase === 'siang'){
   speaker = 'Tengkulak';
   portrait = '🧑💼';
   dialogText = 'Saya lewat tiap siang saat panen.';
  } else {
   speaker = 'Mentor';
   portrait = '🤖';
   dialogText = 'Sore. Urus gudang dan rencana besok.';
  }
  say(speaker, portrait, dialogText);
  
  // Build actions
  var actionsHtml = '';
  var A = el('actions');
  
  if(phase === 'pagi'){
   // Cek pohon siap panen
   if(S.trees && Array.isArray(S.trees)){
    var readyCount = 0;
    for(var i=0; i<S.trees.length; i++){
     var t = S.trees[i];
     var mature = t.mature || (S.day >= (t.plantedDay + DATA.matureDays));
     var canHarvest = t.lastHarvest === null || t.lastHarvest === undefined || (S.day - t.lastHarvest >= DATA.cycleDays);
     if(mature && canHarvest) readyCount++;
    }
    var stockQty = (S.stock.biasa || 0) + (S.stock.super || 0);
    if(readyCount > 0 && stockQty === 0){
     actionsHtml += '<button class="btn btn-success" onclick="harvest()">🌾 Panen (' + readyCount + ' pohon)</button>';
    }
   }
   
   // Warung buttons
   if(S.warung && S.warung.open){
    actionsHtml += '<button class="btn btn-primary" onclick="showShop()">🛒 Belanja Bahan Warung</button>';
    actionsHtml += '<button class="btn btn-warning" onclick="showLivingShop()"> Belanja Kebutuhan Harian</button>';
    if(!S.warung.fridge){
     actionsHtml += '<button class="btn btn-primary" onclick="buyFridge()">❄️ Beli Kulkas (Rp 2.000.000)</button>';
    }
   }
   
   // Path chooser
   if(!S.path){
    actionsHtml += '<button class="btn btn-primary" onclick="showPathChoose()">🧭 Pilih Jalur Usaha</button>';
   }
   
   actionsHtml += '<button class="btn btn-primary" onclick="showLearn()">📚 Modul Belajar</button>';
   actionsHtml += '<button class="btn btn-warning" onclick="setPhase(\'siang\')">➡ Lanjut ke Siang</button>';
   
  } else if(phase === 'siang'){
   if(!S.warung || !S.warung.open){
    actionsHtml += '<button class="btn btn-primary" onclick="openWarung()">🏪 Buka Warung Es Kelapa</button>';
   } else if(!S.warung.operatedToday){
    actionsHtml += '<button class="btn btn-success" onclick="openScene()">🏪 BUKA WARUNG (09-21)</button>';
   } else {
    actionsHtml += '<p>Warung sudah beroperasi hari ini.</p>';
   }
   
   var stockClass = stockClassSafe();
   if(stockClass === 'muda'){
    actionsHtml += '<button class="btn btn-warning" onclick="sellTengkulak()">💼 Jual ke Tengkulak</button>';
   }
   actionsHtml += '<button class="btn btn-warning" onclick="goSore()">➡ Lanjut ke Sore</button>';
   
  } else {
   var stockClass = stockClassSafe();
   if(stockClass === 'tua'){
    actionsHtml += '<button class="btn btn-warning" onclick="sellPasar()"> Jual kelapa TUA ke pasar</button>';
   }
   if((S.day || 0) > 30){
    actionsHtml += '<button class="btn btn-primary" onclick="showSeedShop()">🌱 Toko Bibit Kelapa Super</button>';
   }
   actionsHtml += '<button class="btn btn-danger" onclick="startSleep()">😴 Tidur (Ganti Hari)</button>';
  }
  
  if(A) A.innerHTML = actionsHtml;
  
 } catch(err) {
  console.error('Render error:', err);
  var A = el('actions');
  if(A) A.innerHTML = '<p style="color:red">Error di render: ' + err.message + '</p><button class="btn btn-danger" onclick="resetGame()">🔄 Reset Game</button>';
 }
}

function stockClassSafe(){
 if(!S || !S.stock) return null;
 var q = (S.stock.biasa || 0) + (S.stock.super || 0);
 if(q <= 0) return null;
 var age = (S.day || 0) - (S.harvestDay || 0);
 if(age <= DATA.degrade.muda) return 'muda';
 if(age <= DATA.degrade.tua) return 'tua';
 return 'busuk';
}

function setPhase(p){
 S.phase = p;
 save();
 render();
}

function goSore(){
 if(S.phase === 'siang' && S.warung && S.warung.open && !S.warung.operatedToday){
  if(!confirm('Warung belum dibuka hari ini. Lewati?')) return;
  if(S.stats) S.stats.missedDays = (S.stats.missedDays || 0) + 1;
 }
 S.phase = 'sore';
 save();
 render();
}

function showLearn(){
 showModal('<h3>📚 Modul: Fakta Kelapa</h3><ul>' + LEARN.map(function(x){return '<li>'+x+'</li>';}).join('') + '</ul><button class="btn btn-primary" onclick="closeModal();render()">✅ Tutup</button>');
}

function showPathChoose(){
 var h = '<h3>🧭 Pilih Jalur Usaha</h3><p>Mentor: "Mau fokus ke mana, Bos?"</p>';
 if(DATA.paths){
  Object.keys(DATA.paths).forEach(function(k){
   var p = DATA.paths[k];
   h += '<div style="background:#e8f5e9;padding:12px;margin:8px 0;border-radius:8px"><strong>' + p.name + '</strong><p style="font-size:13px">' + p.desc + '</p><button class="btn btn-primary" onclick="choosePath(\'' + k + '\');closeModal()">Pilih</button></div>';
  });
 }
 h += '<button class="btn" onclick="closeModal()">Nanti Saja</button>';
 showModal(h);
}

function showShop(){
 var items = [
  {key:'iceKarung', label:'Es Batu 1 Karung (40 porsi)', price:20000},
  {key:'sugarBloc', label:'Gula Merah 1 Blok (50 porsi)', price:20000},
  {key:'cupPack', label:'Cup Plastik 1 Pak (20 pcs)', price:8000}
 ];
 var h = '<h3>🛒 Belanja Bahan Warung</h3>';
 var ice = S.warung ? (S.warung.ice || 0) : 0;
 var sugar = S.warung ? (S.warung.sugar || 0) : 0;
 var cups = S.warung ? (S.warung.cups || 0) : 0;
 var stockQ = (S.stock.biasa || 0) + (S.stock.super || 0);
 h += '<p>Stok: 🧊 ' + ice + ' | 🍯 ' + sugar + ' | 🥤 ' + cups + ' |  ' + stockQ + '</p>';
 var cuacaName = (S.cuaca && DATA.weather[S.cuaca]) ? DATA.weather[S.cuaca].name : '-';
 h += '<p>Cuaca: ' + cuacaName + '</p>';
 items.forEach(function(it, i){
  h += '<div style="margin:8px 0;padding:8px;background:#f9f9f9;border-radius:6px"><strong>' + it.label + '</strong> - ' + safeRp(it.price) + '/unit<br><input type="number" id="shop-' + i + '" min="0" value="0" style="width:80px"> unit</div>';
 });
 h += '<button class="btn btn-success" onclick="doShop()">Beli</button> <button class="btn" onclick="closeModal()">Batal</button>';
 showModal(h);
}

function doShop(){
 var items = [
  {key:'iceKarung', label:'Es Batu 1 Karung', price:20000, portions:40},
  {key:'sugarBloc', label:'Gula Merah 1 Blok', price:20000, portions:50},
  {key:'cupPack', label:'Cup Plastik 1 Pak', price:8000, pcs:20}
 ];
 var buy = [];
 var total = 0;
 var details = [];
 items.forEach(function(it, i){
  var inp = el('shop-' + i);
  var qty = inp ? (parseInt(inp.value) || 0) : 0;
  if(qty > 0){
   var cost = qty * it.price;
   total += cost;
   buy.push({key:it.key, qty:qty});
   details.push({name:it.label, qty:qty, unit:it.portions?'porsi':'pcs', subtotal:cost});
  }
 });
 if(total === 0){ msg('⚠️ Tidak ada yang dibeli.'); return; }
 if(S.gold < total){ msg('️ Uang tidak cukup.'); return; }
 spend('BELANJA', 'Belanja bahan warung', total, 'shopping', details);
 buy.forEach(function(b){
  var def = items.find(function(x){return x.key === b.key;});
  if(b.key === 'iceKarung') S.warung.ice = (S.warung.ice || 0) + b.qty * def.portions;
  if(b.key === 'sugarBloc') S.warung.sugar = (S.warung.sugar || 0) + b.qty * def.portions;
  if(b.key === 'cupPack') S.warung.cups = (S.warung.cups || 0) + b.qty * def.pcs;
 });
 say('Mentor', '🤖', 'Bahan masuk gudang warung.');
 save();
 closeModal();
 render();
}

function showLivingShop(){
 var items = [
  {key:'rice', label:'Beras 1 kg (untuk 2 hari)', price:12000},
  {key:'lauk', label:'Lauk (tempe+ikan asin)', price:10000},
  {key:'oil', label:'Minyak goreng 130ml', price:4200}
 ];
 var h = '<h3>🛒 Belanja Kebutuhan Harian</h3>';
 var ls = S.livingStock || {rice:0, lauk:0, oil:0};
 h += '<p>Stok: 🍚 ' + (ls.rice||0) + ' kg |  ' + (ls.lauk||0) + ' | 🛢️ ' + (ls.oil||0) + '</p>';
 items.forEach(function(it){
  var stok = ls[it.key] || 0;
  h += '<div style="margin:8px 0;padding:8px;background:#f9f9f9;border-radius:6px"><strong>' + it.label + '</strong> - ' + safeRp(it.price) + ' (stok: ' + stok + ')<br><button class="btn btn-primary" onclick="buyLivingItem(\'' + it.key + '\');closeModal();render()">Beli 1</button></div>';
 });
 h += '<button class="btn" onclick="closeModal()">Tutup</button>';
 showModal(h);
}

function showSeedShop(){
 var empty = emptySlots();
 showModal('<h3>🌱 Toko Bibit Kelapa Super</h3><p>Bibit Rp 50.000 + upah Rp 10.000 = Rp 60.000/pohon. Hasil 30 butir/bulan.</p><p>Slot kosong: ' + empty + '</p><input type="number" id="inp-seed" min="1" max="' + empty + '" value="1"><button class="btn btn-primary" onclick="buySeedling(parseInt(el(\'inp-seed\').value)||1);closeModal()">Beli & Tanam</button> <button class="btn" onclick="closeModal()">Batal</button>');
}

function showAccelOffer(){
 showModal('<h3>⏳ Bibit Tertanam</h3><p>Pohon super berbuah setelah <b>1.080 hari game</b>.</p><button class="btn btn-primary" onclick="closeModal()">🕰 Tunggu 1.080 hari</button><button class="btn btn-warning" onclick="accelIAP();closeModal()">💎 Bundle Rp 1.000 / 5 pohon</button><button class="btn btn-success" onclick="accelAd();closeModal()">📺 Iklan (skip 30 hari)</button>');
}

function showReport(L, net){
 if(!L) L = {sales:{}, materials:{}, dailyExpenses:[]};
 if(!L.sales) L.sales = {};
 if(!L.materials) L.materials = {};
 if(!L.dailyExpenses) L.dailyExpenses = [];
 
 var dayNum = (S.day || 1) - 1;
 var h = '<h3>🌙 Laporan Hari ' + dayNum + '</h3>';
 var weatherName = (L.weather && DATA.weather[L.weather]) ? DATA.weather[L.weather].name : '-';
 h += '<p><strong>Cuaca:</strong> ' + weatherName + ' | <strong>Pembeli:</strong> ' + (L.buyerCount || 0) + '</p>';
 h += '<h4>💰 Penghasilan Kotor</h4><table><tr><th>Pos</th><th>Nilai</th></tr>';
 h += '<tr><td>🍹 Es (' + (L.sales.es||0) + ' gelas)</td><td class="pos">' + safeRp(L.sales.esRev||0) + '</td></tr>';
 h += '<tr><td>🥥 Kelapa utuh (' + (L.sales.whole||0) + ' butir)</td><td class="pos">' + safeRp(L.sales.wholeRev||0) + '</td></tr>';
 if(L.sales.tengkulak) h += '<tr><td>💼 Tengkulak (' + L.sales.tengkulak + ')</td><td class="pos">' + safeRp(L.sales.tengkulakRev||0) + '</td></tr>';
 if(L.sales.pasar) h += '<tr><td>🛒 Pasar (' + L.sales.pasar + ')</td><td class="pos">' + safeRp(L.sales.pasarRev||0) + '</td></tr>';
 h += '<tr><td><b>Total Kotor</b></td><td class="pos"><b>' + safeRp(L.gross||0) + '</b></td></tr></table>';
 h += '<h4>📤 Pengeluaran Detail</h4><table><tr><th>Item</th><th>Nilai</th></tr>';
 L.dailyExpenses.forEach(function(d){ h += '<tr><td>' + (d.item||'-') + '</td><td class="neg">-' + safeRp(d.amt||0) + '</td></tr>'; });
 h += '<tr><td>🛒 Belanja bahan warung</td><td class="neg">-' + safeRp(L.shopping||0) + '</td></tr>';
 h += '<tr><td>👷 Kuli panen</td><td class="neg">-' + safeRp(L.labor||0) + '</td></tr>';
 h += '<tr><td>🏪 CAPEX</td><td class="neg">-' + safeRp(L.capex||0) + '</td></tr>';
 if(L.bills) h += '<tr><td> Tagihan bulanan</td><td class="neg">-' + safeRp(L.bills) + '</td></tr>';
 h += '<tr><td><b>Total Pengeluaran</b></td><td class="neg"><b>' + safeRp(L.expense||0) + '</b></td></tr></table>';
 h += '<h4>📦 Bahan Terpakai</h4><p>🥥 ' + (L.materials.kelapa||0) + ' | 🧊 ' + (L.materials.ice||0) + ' | 🍯 ' + (L.materials.sugar||0) + ' | 🥤 ' + (L.materials.cup||0) + '</p>';
 if(L.lossIcePortions) h += '<p class="neg">🫠 Es mencair ' + L.lossIcePortions + ' porsi (nilai ' + safeRp(L.lossIceValue||0) + ')</p>';
 if(L.lost) h += '<p>😢 Pelanggan lepas: ' + L.lost + '</p>';
 var netNum = net || 0;
 h += '<h3 style="margin-top:15px">NET PROFIT: <span class="' + (netNum < 0 ? 'neg' : 'pos') + '">' + safeRp(netNum) + '</span></h3>';
 h += '<p><b>🤖 AI:</b> "Kamu hari ini ' + (netNum >= 0 ? 'untung' : 'rugi') + ' bersih ' + safeRp(Math.abs(netNum)) + '. ' + (netNum >= 0 ? 'Pertahankan.' : 'Evaluasi belanja & cuaca.') + '"</p>';
 h += '<button class="btn btn-primary" onclick="closeModal()"> Bangun (Hari ' + (S.day||1) + ')</button>';
 showModal(h);
}

// ===== SCENE WARUNG =====
var SCENE = {timer:null, hour:9, events:[], idx:0, done:false};

function openScene(){
 if(!S.warung) S.warung = {};
 S.warung.operatedToday = true;
 SCENE.hour = DATA.hours.open;
 SCENE.done = false;
 SCENE.idx = 0;
 var D = demandToday();
 var W = wholeBuyersToday();
 if(!S.dayLog) S.dayLog = {};
 S.dayLog.buyerCount = D + W;
 SCENE.events = [];
 for(var i=0; i<D; i++) SCENE.events.push({h:DATA.hours.open + Math.floor(Math.random()*12), t:'es'});
 for(var i=0; i<W; i++) SCENE.events.push({h:DATA.hours.open + Math.floor(Math.random()*12), t:'whole'});
 SCENE.events.sort(function(a,b){return a.h - b.h;});
 safeText('sc-day', 'Hari ' + (S.day||1) + ' | ' + ((S.cuaca && DATA.weather[S.cuaca]) ? DATA.weather[S.cuaca].name : '-'));
 var keeperEl = el('keeper');
 if(keeperEl) keeperEl.textContent = '🧑‍';
 updScene();
 var ws = el('warung-scene');
 if(ws) ws.classList.remove('hidden');
 SCENE.timer = setInterval(tickHour, DATA.hours.secPerHour);
 tickHourUI();
}

function tickHour(){
 SCENE.hour++;
 if(SCENE.hour > DATA.hours.close){ closeScene(false); return; }
 tickHourUI();
 spawnForHour(SCENE.hour - 1);
}

function tickHourUI(){
 var clockEl = el('sc-clock');
 if(clockEl){
  var h = SCENE.hour;
  clockEl.textContent = (h < 10 ? '0' : '') + h + '.00';
 }
}

function spawnForHour(h){
 var list = SCENE.events.filter(function(e){return e.h === h;});
 list.forEach(function(e, i){ setTimeout(function(){ spawnCustomer(e.t); }, i * 500); });
}

function spawnCustomer(t){
 var ws = el('warung-scene');
 if(ws && ws.classList.contains('hidden')) return;
 var sc = el('scene');
 if(!sc) return;
 var c = document.createElement('div');
 c.className = 'customer';
 var faces = ['🧑🏻','👩🏻','👨','👩🏻','🏻','👵🏻','👷🏻','🧑💼'];
 c.innerHTML = '<span class="face">' + faces[Math.floor(Math.random()*faces.length)] + '</span>';
 sc.appendChild(c);
 setTimeout(function(){ c.classList.add('walk'); }, 60);
 setTimeout(function(){
  var ok = false;
  try {
   if(t === 'es') ok = trySellEs();
   else ok = trySellWhole();
  } catch(e) {
   console.error('Sell error:', e);
   ok = false;
  }
  if(ok){
   c.innerHTML += '<span class="bubble">' + (t==='es'?'🍹':'') + '</span>';
   floatText(t==='es'?'+Rp5.000':'+Rp13.000');
  } else {
   c.innerHTML += '<span class="bubble">💢</span>';
   if(S.dayLog) S.dayLog.lost = (S.dayLog.lost||0) + 1;
   if(S.stats) S.stats.lostSales = (S.stats.lostSales||0) + 1;
   floatText('Stok habis!');
  }
  updScene();
  save();
  setTimeout(function(){
   c.classList.add('leave');
   setTimeout(function(){ if(c.parentNode) c.remove(); }, 1200);
  }, 700);
 }, 1200);
}

function floatText(t){
 var f = document.createElement('div');
 f.className = 'float-money';
 f.textContent = t;
 var sc = el('scene');
 if(sc) sc.appendChild(f);
 setTimeout(function(){ if(f.parentNode) f.remove(); }, 1300);
}

function updScene(){
 if(!S.dayLog) S.dayLog = {sales:{}};
 if(!S.dayLog.sales) S.dayLog.sales = {};
 if(!S.warung) S.warung = {};
 safeText('sc-es', S.dayLog.sales.es || 0);
 safeText('sc-whole', S.dayLog.sales.whole || 0);
 var rev = (S.dayLog.sales.esRev || 0) + (S.dayLog.sales.wholeRev || 0);
 safeText('sc-rev', safeRp(rev));
 safeText('sc-lost', S.dayLog.lost || 0);
 safeText('sc-ice', S.warung.ice || 0);
 safeText('sc-sugar', S.warung.sugar || 0);
 safeText('sc-cup', S.warung.cups || 0);
 var stockQ = (S.stock.biasa || 0) + (S.stock.super || 0);
 safeText('sc-coco', stockQ);
}

function closeScene(silent){
 var ws = el('warung-scene');
 if(ws && ws.classList.contains('hidden')) return;
 clearInterval(SCENE.timer);
 if(ws) ws.classList.add('hidden');
 if(!silent){
  var esSold = (S.dayLog && S.dayLog.sales) ? (S.dayLog.sales.es || 0) : 0;
  var wholeSold = (S.dayLog && S.dayLog.sales) ? (S.dayLog.sales.whole || 0) : 0;
  var fridgeMsg = (S.warung && S.warung.fridge) ? ' Sisa es aman di kulkas.' : ' Sisa es mencair malam ini.';
  say('Mentor', '', 'Warung tutup. Es ' + esSold + ', utuh ' + wholeSold + '.' + fridgeMsg);
 }
 save();
 render();
}

// ===== ONBOARDING =====
var OB = {idx:0, av:0};

OB.startStory = function(){
 var inp = el('inp-name');
 var n = inp ? inp.value.trim() : '';
 if(!n){ alert('Isi nama Anda dulu.'); return; }
 S.name = n;
 S.avatar = this.av;
 var obChar = el('ob-char');
 var obStory = el('ob-story');
 if(obChar) obChar.classList.add('hidden');
 if(obStory) obStory.classList.remove('hidden');
 this.showSlide();
};

OB.showSlide = function(){
 var s = STORY[this.idx];
 if(!s) return;
 var portraitEl = el('st-portrait');
 if(portraitEl){
  if(s[0] === 'Kamu'){
   var avatars = PORTR.pemain || ['🧑‍'];
   portraitEl.textContent = avatars[S.avatar || 0] || '🧑‍🌾';
  } else {
   portraitEl.textContent = s[1] || '';
  }
 }
 safeText('st-speaker', s[0]);
 safeText('st-text', s[2]);
};

OB.nextSlide = function(){
 this.idx++;
 if(this.idx >= STORY.length){
  S.storyDone = true;
  save();
  finishOnboard();
  return;
 }
 this.showSlide();
};

function finishOnboard(){
 var ob = el('onboard');
 if(ob) ob.remove();
 startGame();
}

function startGame(){
 var game = el('game');
 if(game) game.classList.remove('hidden');
 render();
}

function initAvatars(){
 var pick = el('avatar-pick');
 if(!pick) return;
 var avatars = PORTR.pemain || ['🧑‍'];
 pick.innerHTML = avatars.map(function(p, i){
  return '<button class="avatar-btn' + (i===0?' sel':'') + '" onclick="OB.av=' + i + ';initAvatars()">' + p + '</button>';
 }).join('');
}

// ===== INISIALISASI =====
console.log('=== UI.JS INIT START ===');
console.log('typeof initGameState:', typeof initGameState);
console.log('typeof S before init:', typeof S);

if(typeof initGameState === 'function'){
 initGameState();
} else {
 console.error('initGameState tidak ada! Memuat manual...');
 loadSaved();
}

console.log('S setelah init:', S);
console.log('S.storyDone:', S ? S.storyDone : 'S undefined');

if(S && !S.storyDone){
 console.log('Menampilkan onboarding...');
 initAvatars();
} else {
 console.log('Melanjutkan game...');
 var ob = el('onboard');
 if(ob) ob.remove();
 startGame();
}

console.log('=== UI.JS INIT END ===');
