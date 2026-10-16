// Sistem lahan, kebun, komoditas dan risiko. Seluruh nominal adalah asumsi balancing game.
const LAND_TIERS=[
 {id:"small",name:"Kecil",areaM2:100,pricePerM2:75000},
 {id:"medium",name:"Menengah",areaM2:10000,pricePerM2:65000},
 {id:"large",name:"Besar",areaM2:100000,pricePerM2:55000},
 {id:"huge",name:"Raksasa",areaM2:10000000,pricePerM2:50000}
];
function ensureAgriState(){
 if(!S.landSystem)S.landSystem={lands:[{id:"warisan-2430",name:"Lahan Warisan",areaM2:2430,location:"warisan",purchaseCost:0,improvements:0,plots:[]}],nextId:1,market:{},quiz:{correct:0,attempts:0,mastery:{}}};
 if(!Array.isArray(S.landSystem.lands))S.landSystem.lands=[];
 if(!S.landSystem.market)S.landSystem.market={};
 if(!S.landSystem.inventory)S.landSystem.inventory={};
 if(!S.landSystem.quiz)S.landSystem.quiz={correct:0,attempts:0,mastery:{}};
 if(!S.landSystem.quiz.mastery)S.landSystem.quiz.mastery={};
 // Hubungkan kebun kelapa warisan yang sudah ada tanpa menghapus save lama.
 const legacy=S.landSystem.lands.find(l=>l.id==="warisan-2430");
 if(legacy&&!legacy.legacyTreesLinked){legacy.legacyTreesLinked=true;legacy.legacyTreeCount=Array.isArray(S.trees)?S.trees.length:10;}
}
function landFeeBreakdown(tier){
 const land=tier.areaM2*tier.pricePerM2;
 return {land,notary:Math.round(land*.015),tax:Math.round(land*.005),permit:Math.round(land*.01),prep:Math.round(land*.02)};
}
function totalLandCost(tier){const f=landFeeBreakdown(tier);return f.land+f.notary+f.tax+f.permit+f.prep;}
function showLandMarket(){
 ensureAgriState();
 let h='<h3>🗺️ Bursa Lahan Pertanian</h3><p>Harga, pajak, notaris, izin dan pembukaan lahan di bawah adalah <b>parameter simulasi</b>, bukan penawaran atau tarif hukum nyata. Lahan besar lebih murah per m², tetapi totalnya jauh lebih tinggi.</p>';
 LAND_TIERS.forEach(t=>{const f=landFeeBreakdown(t),total=totalLandCost(t);h+='<section class="agri-card"><h4>'+t.name+' — '+t.areaM2.toLocaleString("id-ID")+' m²</h4><p>Harga lahan: '+safeRp(f.land)+' ('+safeRp(t.pricePerM2)+'/m²)</p><p>Notaris 1,5%: '+safeRp(f.notary)+' · Pajak simulasi 0,5%: '+safeRp(f.tax)+'</p><p>Izin 1%: '+safeRp(f.permit)+' · Persiapan lahan 2%: '+safeRp(f.prep)+'</p><b>Total: '+safeRp(total)+'</b><br><button class="btn btn-primary" onclick="buyLandTier(\''+t.id+'\')">Beli lahan</button></section>';});
 h+='<h4>Lahan yang dimiliki</h4>'+S.landSystem.lands.map(l=>'<p>🌱 '+l.name+' — '+l.areaM2.toLocaleString("id-ID")+' m²; komoditas: '+(l.plots||[]).length+' petak</p>').join('');
 h+='<button class="btn btn-primary" onclick="showCommodityEconomics()">📊 Ekonomi 3 Komoditas Uji</button> <button class="btn btn-warning" onclick="resetTestCrops()">♻️ Reset Komoditas Uji</button> <button class="btn" onclick="closeModal()">Tutup</button>';showModal(h);
}
function buyLandTier(id){
 ensureAgriState();const t=LAND_TIERS.find(x=>x.id===id);if(!t)return;
 const f=landFeeBreakdown(t),cost=totalLandCost(t);
 if(!Number.isFinite(cost)||cost<=0){msg("Perhitungan biaya lahan tidak valid.");return;}
 if(S.gold<cost){msg("Kas tidak cukup. Total biaya termasuk komponen legal dan persiapan: "+safeRp(cost));return;}
 if(!confirm("Beli "+t.name+" "+t.areaM2.toLocaleString("id-ID")+" m² dengan total "+safeRp(cost)+"? Rincian pajak/notaris/izin merupakan asumsi game."))return;
 spend("CAPEX","Pembelian lahan "+t.name,cost,"capex",{areaM2:t.areaM2,breakdown:f});
 S.landSystem.lands.push({id:"land-"+(S.landSystem.nextId++),name:"Lahan "+t.name,areaM2:t.areaM2,location:"remote",purchaseCost:cost,improvements:0,plots:[]});
 save();showLandMarket();render();
}
function showGarden(){
 ensureAgriState();
 const landOptions=S.landSystem.lands.map(l=>'<option value="'+l.id+'">'+l.name+' ('+l.areaM2.toLocaleString("id-ID")+' m²)</option>').join('');
 let h='<h3>🌴 Kebun Saya — Peta 2D</h3><p>Visualisasi kebun dikelompokkan per petak, bukan menggambar setiap pohon. Pilih lahan dan komoditas untuk melihat kapasitas maksimum, biaya, hasil, dan proyeksi sebelum membeli bibit.</p>';
 h+='<label>Lahan</label><select id="garden-land" onchange="updatePlantingPlan()">'+landOptions+'</select><label>Komoditas</label><select id="garden-crop" onchange="updatePlantingPlan()">'+COMMODITIES.map(c=>'<option value="'+c.id+'">'+c.name+' — '+c.growDays+' hari</option>').join('')+'</select><label>Jumlah unit/petak yang direncanakan</label><input id="garden-count" type="number" min="1" max="10000" value="1" oninput="updatePlantingPlan()"><div id="planting-plan"></div><button class="btn btn-primary" onclick="plantCommodity()">Tanam / mulai produksi</button>';
 const trees=S.trees||[],normal=trees.filter(t=>t.type!=="super").length,superTrees=trees.filter(t=>t.type==="super").length,mature=trees.filter(t=>isMature(t)).length,avgAge=trees.length?Math.round(trees.reduce((s,t)=>s+(t.mature?DATA.matureDays:Math.max(0,S.day-t.plantedDay)),0)/trees.length):0,pct=trees.length?Math.min(100,Math.round(avgAge/DATA.matureDays*100)):0,ready=(trees.filter(t=>isMature(t)).length)*(DATA.yieldBiasa||20);
 h+='<h4>🥥 Kebun kelapa warisan</h4><div class="agri-2d-grove"><div class="grove-canopy">🌴 🌴 🌴 🌴 🌴</div><div class="grove-label">Kelompok pohon kelapa · '+trees.length+' pohon</div><div class="agri-progress"><span style="width:'+pct+'%"></span></div><p>Umur rata-rata '+avgAge+' / '+DATA.matureDays+' hari · '+pct+'% menuju umur matang</p><p>Pohon biasa '+normal+' · super '+superTrees+' · siap panen '+mature+'</p><p>Perkiraan panen siklus berikutnya: '+ready+' buah (asumsi '+(DATA.yieldBiasa||20)+' buah/pohon matang; verifikasi dengan mekanik panen kelapa lama).</p></div>';
 h+='<h4>Peta 2D lahan dan petak</h4>';
 S.landSystem.lands.forEach(l=>{const used=(l.plots||[]).reduce((sum,p)=>sum+p.count*agriAreaPerUnit(COMMODITY_BY_ID[p.commodity]),0),free=Math.max(0,l.areaM2-used);h+='<h5>'+l.name+' — '+l.areaM2.toLocaleString("id-ID")+' m²</h5><div class="agri-land-map"><div class="agri-land-plot inherited-plot"><b>🌴 Warisan / area tetap</b><small>Kelapa lama: '+(l.id==="warisan-2430"?trees.length+" pohon":"tidak ditautkan")+'</small></div>';
 (l.plots||[]).forEach(p=>{const crop=COMMODITY_BY_ID[p.commodity];if(!crop)return;const age=Math.max(0,S.day-p.plantedDay),progress=Math.min(100,Math.floor(age/crop.growDays*100));h+='<div class="agri-land-plot"><b>'+cropEmoji(crop)+' '+crop.name+' × '+p.count+'</b><small>'+p.count*agriAreaPerUnit(crop)+' m² · umur '+age+'/'+crop.growDays+' hari · sehat '+(p.health||100)+'%</small><div class="agri-progress"><span style="width:'+progress+'%"></span></div>'+(age>=crop.growDays?'<button class="btn btn-success" onclick="harvestCommodity(\''+l.id+'\',\''+p.id+'\')">Panen kelompok</button>':'<small>'+progress+'% tumbuh · '+(crop.growDays-age)+' hari menuju panen</small>')+' <button class="btn" onclick="careCommodity(\''+l.id+'\',\''+p.id+'\')">Rawat</button></div>';});
 h+='</div><p>Terpakai '+used.toLocaleString("id-ID")+' m² · tersedia '+free.toLocaleString("id-ID")+' m² · unit tambahan '+Math.floor(free/4)+' petak tanaman standar (indikasi awal; kebutuhan tiap komoditas berbeda).</p>';if(!(l.plots||[]).length)h+='<p>Belum ada petak komoditas baru.</p>';});
 h+='<button class="btn btn-primary" onclick="showCommodityEconomics()">📊 Ekonomi 3 Komoditas Uji</button> <button class="btn btn-warning" onclick="resetTestCrops()">♻️ Reset Komoditas Uji</button> <button class="btn" onclick="closeModal()">Tutup</button>';showModal(h);updatePlantingPlan();
}
function agriAreaPerUnit(c){if(!c)return 4;return c.unitType==="pohon"?25:c.unitType==="ternak"?10:c.unitType==="kolam"?20:c.unitType==="koloni"?5:c.unitType==="rak"?2:4;}
function cropEmoji(c){return c.category==="perkebunan"||c.unitType==="pohon"?"🌴":c.category==="hortikultura"?"🌶️":c.category==="peternakan"?"🐓":c.category==="perikanan"?"🐟":"🌱";}
function updatePlantingPlan(){
 const out=el("planting-plan"),landEl=el("garden-land"),cropEl=el("garden-crop"),countEl=el("garden-count");if(!out||!landEl||!cropEl||!countEl)return;
 const land=S.landSystem.lands.find(l=>l.id===landEl.value),c=COMMODITY_BY_ID[cropEl.value];if(!land||!c)return;
 const used=(land.plots||[]).reduce((sum,p)=>sum+p.count*agriAreaPerUnit(COMMODITY_BY_ID[p.commodity]),0),free=Math.max(0,land.areaM2-used),unitArea=agriAreaPerUnit(c),max=Math.floor(free/unitArea),count=Math.max(1,Math.min(max,Math.floor(Number(countEl.value)||1))),cost=count*(c.seedCost+c.careCost),yieldQty=count*c.yieldQty,rev=yieldQty*c.basePrice,margin=rev-cost,finance=COMMODITY_ECONOMICS[c.id],e=finance||{},b2b=e.tengkulakPrice||e.farmerPrice||c.basePrice,b2c=e.retailPrice||c.basePrice;
 out.innerHTML='<section class="agri-card"><h4>Rencana lahan sebelum membeli bibit</h4><p>Luas '+land.areaM2.toLocaleString("id-ID")+' m² · sudah terpakai '+used.toLocaleString("id-ID")+' m² · sisa '+free.toLocaleString("id-ID")+' m².</p><p>Komoditas ini memerlukan '+unitArea+' m²/unit; kapasitas maksimum saat ini <b>'+max.toLocaleString("id-ID")+' unit</b>. Rencana '+count+' unit memerlukan '+(count*unitArea).toLocaleString("id-ID")+' m².</p><p>Modal awal simulasi: <b>'+safeRp(cost)+'</b> · umur panen '+c.growDays+' hari · hasil asumsi '+yieldQty.toLocaleString("id-ID")+' unit hasil.</p><p>Omzet indikatif B2B '+safeRp(yieldQty*b2b)+' (harga '+safeRp(b2b)+' per unit) · omzet B2C '+safeRp(yieldQty*b2c)+' (harga '+safeRp(b2c)+' per unit).</p><p>Margin indikatif sebelum distribusi, susut, upah, biaya tetap dan pajak: B2B <b>'+safeRp(yieldQty*b2b-cost)+'</b> · B2C <b>'+safeRp(yieldQty*b2c-cost)+'</b>.</p><p><b>Kompatibilitas tanam berdampingan:</b> '+(c.id==="kelapa"?"Kelapa adalah tanaman tahunan; beri jarak tajuk dan cahaya, jangan menganggap seluruh area bawah tajuk cocok untuk tanaman yang butuh matahari penuh.":c.id==="cabai_merah"?"Cabai membutuhkan cahaya dan drainase baik. Bisa dipertimbangkan di sela kelapa muda jika cahaya cukup; hindari naungan tajuk kelapa matang dan genangan.":c.id==="jagung"?"Jagung memerlukan cahaya penuh; tumpangsari hanya masuk akal jika tajuk kelapa belum menaungi dan akses antarbaris cukup.":"Kecocokan belum dimodelkan per varietas/tanah; lakukan uji lokal sebelum menganggapnya kompatibel.")+'</p></section>';
 if(max===0)out.innerHTML+='<p class="agri-warning">Lahan tidak memiliki ruang cukup untuk komoditas ini.</p>';
}

function plantCommodity(){
 ensureAgriState();const land=S.landSystem.lands.find(l=>l.id===el("garden-land").value),c=COMMODITY_BY_ID[el("garden-crop").value],count=Math.max(1,Math.min(10000,Math.floor(Number(el("garden-count").value)||1)));
 if(!land||!c){msg("Lahan atau komoditas tidak valid.");return;}
 const areaPerUnit=c.unitType==="pohon"?25:c.unitType==="ternak"?10:c.unitType==="kolam"?20:c.unitType==="koloni"?5:c.unitType==="rak"?2:4;
 const used=(land.plots||[]).reduce((sum,p)=>sum+p.count*(COMMODITY_BY_ID[p.commodity]?.unitType==="pohon"?25:COMMODITY_BY_ID[p.commodity]?.unitType==="ternak"?10:COMMODITY_BY_ID[p.commodity]?.unitType==="kolam"?20:COMMODITY_BY_ID[p.commodity]?.unitType==="koloni"?5:COMMODITY_BY_ID[p.commodity]?.unitType==="rak"?2:4),0);
 if(used+count*areaPerUnit>land.areaM2){msg("Lahan tidak cukup. Kebutuhan "+(count*areaPerUnit)+" m²; tersedia "+(land.areaM2-used)+" m².");return;}
 const cost=count*(c.seedCost+c.careCost);
 if(!Number.isFinite(cost)||S.gold<cost){msg("Kas tidak cukup. Biaya awal: "+safeRp(cost));return;}
 if(!confirm("Mulai "+c.name+" × "+count+"? Biaya awal simulasi "+safeRp(cost)+". Umur produksi "+c.growDays+" hari."))return;
 spend("OPEX","Biaya budidaya "+c.name+" × "+count,cost,"expense",{commodity:c.id,count});
 if(!land.plots)land.plots=[];
 land.plots.push({id:"plot-"+Date.now()+"-"+Math.floor(Math.random()*100000),commodity:c.id,count,plantedDay:S.day,health:100,risk:"normal",lastCareDay:S.day});
 save();showGarden();render();
}
function careCommodity(landId,plotId){
 ensureAgriState();const l=S.landSystem.lands.find(x=>x.id===landId),p=l&&l.plots.find(x=>x.id===plotId);if(!p)return;
 const cost=Math.max(1000,p.count*250);if(S.gold<cost){msg("Kas tidak cukup untuk perawatan "+safeRp(cost));return;}
 spend("OPEX","Perawatan "+COMMODITY_BY_ID[p.commodity].name,cost,"expense",{count:p.count});p.health=Math.min(100,(p.health||100)+20);p.lastCareDay=S.day;save();showGarden();
}
function harvestCommodity(landId,plotId){
 ensureAgriState();const l=S.landSystem.lands.find(x=>x.id===landId),idx=l&&l.plots.findIndex(x=>x.id===plotId);if(!l||idx<0)return;
 const p=l.plots[idx],c=COMMODITY_BY_ID[p.commodity];if(S.day-p.plantedDay<c.growDays){msg("Belum matang.");return;}
 const weather=S.cuaca||"berawan",market=getCommodityPrice(c.id),riskLoss=(p.health||100)<40?.5:(weather==="hujan"&&["hortikultura","pangan"].includes(c.category)?.2:0),qty=Math.max(0,Math.round(c.yieldQty*p.count*(p.health||100)/100*(1-riskLoss)*100)/100);
 S.landSystem.inventory[c.id]=(S.landSystem.inventory[c.id]||0)+qty;
 p.plantedDay=S.day;p.health=Math.max(50,(p.health||100)-10);
 if(!S.dayLog.commodityHarvests)S.dayLog.commodityHarvests=[];
 S.dayLog.commodityHarvests.push({commodity:c.id,name:c.name,quantity:qty,riskLoss});
 save();msg("Panen "+c.name+": "+qty+" "+(COMMODITY_ECONOMICS[c.id]?.unit||"unit")+" masuk persediaan. Pilih jual ke tengkulak, jual langsung, atau olah menjadi produk.");showCommodityEconomics(c.id);render();
}
function getCommodityPrice(id){
 ensureAgriState();const c=COMMODITY_BY_ID[id];if(!c)return 0;
 const m=S.landSystem.market[id]||(S.landSystem.market[id]={sold:0,price:c.basePrice});
 // Model permintaan sederhana: pasokan besar menekan harga; pasokan rendah menaikkan harga, dengan batas aman.
 const pressure=Math.max(.65,Math.min(1.4,1-(m.sold||0)/(c.yieldQty*100)));
 m.price=Math.round(c.basePrice*pressure);return m.price;
}
function tickAgricultureDay(){
 ensureAgriState();
 S.landSystem.lands.forEach(l=>(l.plots||[]).forEach(p=>{
  const c=COMMODITY_BY_ID[p.commodity];if(!c)return;
  const daysSince=S.day-(p.lastCareDay||p.plantedDay);
  let loss=0;if(S.cuaca==="hujan"&&["hortikultura","pangan"].includes(c.category))loss=.5;else if(S.cuaca==="panas"&&daysSince>10)loss=.7;
  if(loss){p.health=Math.max(0,(p.health||100)-loss);p.risk=loss===.5?"kelebihan air":"stres kekeringan";}
 }));
}

function showCommodityEconomics(focusId){
 ensureAgriState();
 const ids=["kelapa","cabai_merah","jagung"],labels={kelapa:"Kelapa warisan",cabai_merah:"Cabai merah",jagung:"Jagung"};
 let h='<h3>📊 Ekonomi Komoditas — Mode Uji</h3><p>Harga pasar dan biaya bervariasi menurut daerah, mutu, musim, ukuran panen dan kontrak. Harga berikut adalah acuan/parameter simulasi; bukan jaminan transaksi nyata.</p>';
 ids.forEach(id=>{const e=COMMODITY_ECONOMICS[id],stock=S.landSystem.inventory[id]||0;
 if(id==="kelapa"){h+='<section class="agri-card"><h4>🥥 '+labels[id]+'</h4><p>Warisan: '+(S.trees||[]).length+' pohon · siklus game '+DATA.cycleDays+' hari · hasil normal '+DATA.yieldBiasa+' buah/pohon per siklus.</p><p>Tengkulak: '+safeRp(e.farmerPrice)+'/buah. Jual langsung/produk es kelapa: harga game '+safeRp(e.retailPrice)+'/gelas, tetapi harus memperhitungkan es, gula, gelas, tenaga kerja, dan permintaan.</p></section>';return;}
 const c=COMMODITY_BY_ID[id],yieldQty=e.yieldPer4m2||c.yieldQty,cost=e.costPer4m2||c.setupCost,b2b=e.tengkulakPrice||e.farmerPrice,retail=e.retailPrice,qty=stock;
 const rawProfitB2B=yieldQty*b2b-cost,rawProfitRetail=yieldQty*retail-cost;
 const p=e.processed,units=Math.floor(yieldQty/p.inputKg),processedRevenue=units*p.price,processedOther=units*p.otherCost,processedProfit=processedRevenue-processedOther-cost;
 h+='<section class="agri-card"><h4>'+(id==="cabai_merah"?"🌶️ ":"🌽 ")+labels[id]+' — basis 4 m²</h4><p>Umur panen: '+c.growDays+' hari · estimasi hasil '+yieldQty+' '+e.unit+'/siklus · biaya awal '+safeRp(cost)+'</p><p>Tengkulak/B2B: '+safeRp(b2b)+'/'+e.unit+' → omzet '+safeRp(yieldQty*b2b)+' → <b>laba indikatif '+safeRp(rawProfitB2B)+'</b>.</p><p>Jual langsung/B2C: '+safeRp(retail)+'/'+e.unit+' → omzet '+safeRp(yieldQty*retail)+' → <b>laba indikatif '+safeRp(rawProfitRetail)+'</b>.</p><p>Produk jadi: '+p.name+'; kebutuhan bahan '+p.inputKg+' kg/unit; '+units+' unit; harga jual '+safeRp(p.price)+'/unit; biaya bahan tambahan '+safeRp(p.otherCost)+'/unit. Omzet '+safeRp(processedRevenue)+'; laba indikatif setelah biaya awal dan bahan tambahan <b>'+safeRp(processedProfit)+'</b>. Perhitungan belum memasukkan kemasan tambahan, penyusutan alat, tenaga kerja pengolahan, distribusi, produk gagal, pajak, dan barang tidak terjual.</p><p>Persediaan siap jual: '+qty.toFixed(2)+' '+e.unit+'</p>';
 if(qty>0){h+='<button class="btn btn-primary" onclick="sellCommodity(\''+id+'\',\'b2b\')">Jual semua ke tengkulak/B2B</button> <button class="btn btn-primary" onclick="sellCommodity(\''+id+'\',\'retail\')">Jual langsung/B2C</button> <button class="btn btn-success" onclick="processCommodity(\''+id+'\')">Olah produk jadi</button>';}
 h+='<details><summary>Catatan model</summary><p>'+e.notes+'</p></details></section>';
 });
 h+='<button class="btn btn-primary" onclick="showLogisticsCalculator()">🚚 Kalkulator Distribusi</button> <button class="btn btn-warning" onclick="resetTestCrops()">♻️ Reset petak & stok komoditas uji</button> <button class="btn" onclick="showGarden()">Kembali ke kebun</button> <button class="btn" onclick="closeModal()">Tutup</button>';showModal(h);
}
function sellCommodity(id,channel){
 ensureAgriState();const e=COMMODITY_ECONOMICS[id];if(!e||id==="kelapa"){msg("Penjualan kelapa warisan tetap memakai sistem warung/tengkulak lama.");return;}
 const qty=S.landSystem.inventory[id]||0;if(qty<=0){msg("Persediaan kosong.");return;}
 const price=channel==="b2b"?(e.tengkulakPrice||e.farmerPrice):e.retailPrice,rev=Math.round(qty*price);
 const distance=Number(prompt("Jarak pengiriman satu arah (km). Default 10 km:", "10"));if(!Number.isFinite(distance)||distance<0){msg("Jarak tidak valid; penjualan dibatalkan.");return;}
 const vehicle=(prompt("Kendaraan: ketik motor atau pickup. Default pickup untuk volume besar:",qty>=20?"pickup":"motor")||"motor").toLowerCase();
 const cold=/^(y|ya|yes|1)$/i.test(prompt("Gunakan box pendingin? Ketik ya atau tidak. Untuk cabai segar, sesuaikan kebutuhan rute/mutu.","tidak")||"tidak");
 const logistics=logisticsPrompt(qty,distance,vehicle,cold);if(!logistics){msg("Biaya distribusi tidak valid; penjualan dibatalkan.");return;}const net=rev-logistics.total;
 if(!confirm("Konfirmasi penjualan "+COMMODITY_BY_ID[id].name+"\nOmzet: "+safeRp(rev)+"\n"+logisticsBreakdown(logistics)+"\nKas bersih sebelum biaya budidaya: "+safeRp(net)))return;
 S.landSystem.market[id]=S.landSystem.market[id]||{sold:0,price};S.landSystem.market[id].sold=(S.landSystem.market[id].sold||0)+qty;
 S.landSystem.inventory[id]=0;S.gold+=net;S.dayLog.gross+=rev;S.dayLog.expense+=logistics.total;
 if(!S.dayLog.commoditySales)S.dayLog.commoditySales=[];
 S.dayLog.commoditySales.push({commodity:id,name:COMMODITY_BY_ID[id].name,quantity:qty,unitPrice:price,revenue:rev,channel,logisticsCost:logistics.total,netAfterLogistics:net});
 ledger("PENDAPATAN","Penjualan "+COMMODITY_BY_ID[id].name+" "+channel,rev,"revenue",{commodity:id,quantity:qty,unitPrice:price});
 if(logistics.total)ledger("OPEX","Distribusi "+COMMODITY_BY_ID[id].name,logistics.total,"expense",{distanceKm:distance,vehicle,coldBox:cold});
 save();msg("Omzet "+safeRp(rev)+"; biaya distribusi "+safeRp(logistics.total)+"; kas bersih sebelum biaya budidaya "+safeRp(net)+".");showCommodityEconomics(id);render();
}
function processCommodity(id){
 ensureAgriState();const e=COMMODITY_ECONOMICS[id];if(!e||id==="kelapa"){msg("Produk olahan komoditas ini belum diaktifkan di mode uji.");return;}
 const stock=S.landSystem.inventory[id]||0,p=e.processed,units=Math.floor(stock/p.inputKg);
 if(units<1){msg("Persediaan belum cukup untuk membuat satu unit "+p.name+".");return;}
 const input=units*p.inputKg,rev=units*p.price,cost=units*p.otherCost;
 const distance=Number(prompt("Jarak pengiriman produk jadi satu arah (km). Default 10 km:", "10"));if(!Number.isFinite(distance)||distance<0){msg("Jarak tidak valid; pengolahan dibatalkan.");return;}
 const vehicle=(prompt("Kendaraan distribusi: motor atau pickup.","motor")||"motor").toLowerCase();
 const cold=/^(y|ya|yes|1)$/i.test(prompt("Perlu box pendingin? Ketik ya/tidak.","tidak")||"tidak");
 const logistics=logisticsPrompt(units,distance,vehicle,cold);if(!logistics){msg("Biaya distribusi tidak valid; pengolahan dibatalkan.");return;}
 if(!confirm("Olah "+input.toFixed(2)+" "+e.unit+" menjadi "+units+" unit "+p.name+"? Omzet "+safeRp(rev)+", biaya bahan tambahan "+safeRp(cost)+"\n"+logisticsBreakdown(logistics)+"\nKas bersih sebelum budidaya "+safeRp(rev-cost-logistics.total)+". Produk diasumsikan langsung terjual."))return;
 S.landSystem.inventory[id]=Math.round((stock-input)*100)/100;S.gold+=rev-cost-logistics.total;S.dayLog.gross+=rev;S.dayLog.expense+=cost+logistics.total;
 ledger("PENDAPATAN","Penjualan produk jadi "+p.name,rev,"revenue",{commodity:id,units});
 ledger("OPEX","Biaya bahan tambahan "+p.name,cost,"expense",{commodity:id,units});
 if(logistics.total)ledger("OPEX","Distribusi produk jadi "+p.name,logistics.total,"expense",{distanceKm:distance,vehicle,coldBox:cold});
 if(!S.dayLog.commoditySales)S.dayLog.commoditySales=[];
 S.dayLog.commoditySales.push({commodity:id,name:p.name,quantity:units,unitPrice:p.price,revenue:rev,processingCost:cost});
 save();msg("Produk jadi terjual: omzet "+safeRp(rev)+", biaya tambahan "+safeRp(cost)+", margin kas sebelum alokasi biaya budidaya "+safeRp(rev-cost)+".");showCommodityEconomics(id);render();
}
function resetTestCrops(){
 ensureAgriState();
 if(!confirm("Reset mode uji? Ini menghapus petak komoditas non-kelapa, stok cabai/jagung, dan statistik pasar uji. Kebun kelapa warisan, uang, bangunan, dan progres utama tidak dihapus."))return;
 S.landSystem.lands.forEach(l=>{l.plots=(l.plots||[]).filter(p=>p.commodity==="kelapa");});
 S.landSystem.inventory={};S.landSystem.market={};S.landSystem.quiz={correct:0,attempts:0,mastery:{}};
 save();showGarden();render();msg("Mode uji komoditas direset. Kelapa warisan dan progres utama tetap ada.");
}

function estimateLogistics(quantity,distanceKm,vehicle,coldBox,options={}){
 const v=vehicle==="pickup"?"pickup":"motor",roundTrip=Math.max(0,distanceKm)*2;
 const fuelPerLiter=Number(options.fuelPerLiter)||19000,efficiency=v==="pickup"?8:35;
 const days=Math.max(1,Math.ceil(roundTrip/350));
 const fuel=Math.ceil(roundTrip/efficiency*fuelPerLiter);
 const driverDaily=Number(options.driverDaily)||175000,mealDaily=Number(options.mealDaily)||100000;
 const driver=driverDaily*days,meal=mealDaily*days;
 const parkingDaily=Math.max(0,Number(options.parkingDaily)||0),parking=parkingDaily*days;
 const toll=Math.max(0,Number(options.toll)||0),rentalDaily=Math.max(0,Number(options.rentalDaily)||0),rental=rentalDaily*days;
 const unofficialRisk=Math.max(0,Number(options.unofficialRisk)||0);
 const cooling=coldBox?Math.max(0,Number(options.coldBoxFee)||75000):0,packaging=Math.ceil(Math.max(0,quantity)*500);
 return {distanceKm,roundTripKm:roundTrip,days,vehicle:v,fuelPerLiter,efficiency,fuel,driverDaily,driver,mealDaily,meal,parkingDaily,parking,toll,rentalDaily,rental,unofficialRisk,coldBox:cooling,packaging,total:fuel+driver+meal+parking+toll+rental+unofficialRisk+cooling+packaging};
}
function logisticsPrompt(quantity,distance,vehicle,cold){
 const days=Math.max(1,Math.ceil(distance*2/350));
 const fuel=Number(prompt("Harga BBM per liter (default Rp19.000; ubah sesuai jenis BBM/lokasi):","19000"));
 const driver=Number(prompt("Uang jalan sopir per hari, di luar makan (Rp). Acuan awal Rp150.000–200.000:","175000"));
 const meal=Number(prompt("Uang makan sopir per hari (Rp), terpisah dari uang jalan:","100000"));
 const toll=Number(prompt("Total tol pulang-pergi seluruh rute (Rp). Masukkan hasil rute/tarif gerbang aktual; 0 bila tidak lewat tol:","0"));
 const parking=Number(prompt("Total parkir pulang-pergi (Rp):","0"));
 const rental=Number(prompt("Sewa kendaraan per hari (Rp). Isi 0 jika kendaraan milik sendiri:","0"));
 const risk=Number(prompt("Cadangan pungutan/biaya tak terduga (Rp) — skenario risiko, bukan tarif resmi; isi 0 jika tidak dipakai:","0"));
 const coldFee=cold?Number(prompt("Biaya box pendingin/es/energi untuk perjalanan ini (Rp):","75000")):0;
 const vals=[fuel,driver,meal,toll,parking,rental,risk,coldFee];
 if(vals.some(x=>!Number.isFinite(x)||x<0))return null;
 return estimateLogistics(quantity,distance,vehicle,cold,{fuelPerLiter:fuel,driverDaily:driver,mealDaily:meal,toll,parkingDaily:parking/days,rentalDaily:rental,unofficialRisk:risk,coldBoxFee:coldFee});
}
function logisticsBreakdown(r){
 return "Jarak PP: "+r.roundTripKm+" km ("+r.days+" hari estimasi)\nBBM: "+safeRp(r.fuel)+" ("+r.efficiency+" km/l × "+safeRp(r.fuelPerLiter)+"/liter)\nUang jalan sopir: "+safeRp(r.driver)+" ("+safeRp(r.driverDaily)+"/hari, terpisah dari makan)\nUang makan sopir: "+safeRp(r.meal)+" ("+safeRp(r.mealDaily)+"/hari)\nTol: "+safeRp(r.toll)+"\nParkir: "+safeRp(r.parking)+"\nSewa kendaraan: "+safeRp(r.rental)+"\nCadangan risiko biaya tak terduga: "+safeRp(r.unofficialRisk)+"\nBox pendingin: "+safeRp(r.coldBox)+"\nKemasan: "+safeRp(r.packaging)+"\nTOTAL DISTRIBUSI: "+safeRp(r.total);
}
function showLogisticsCalculator(){
 const h='<h3>🚚 Kalkulator Distribusi</h3><p>Estimasi dibuat per rute. BBM awal Rp19.000/liter sesuai parameter uji yang dapat diubah; sopir Rp175.000/hari dan makan Rp100.000/hari adalah asumsi awal, bukan tarif nasional. Masukkan tol dari rute aktual. Cadangan pungutan/biaya tak terduga opsional dan tidak dianggap tarif resmi.</p><label>Jumlah barang (kg/unit)</label><input id="log-qty" type="number" min="0" value="20"><label>Jarak satu arah (km)</label><input id="log-distance" type="number" min="0" value="700"><label>Kendaraan</label><select id="log-vehicle"><option value="motor">Motor</option><option value="pickup" selected>Pickup</option></select><label><input id="log-cold" type="checkbox"> Pakai box pendingin</label><label>Harga BBM per liter (Rp)</label><input id="log-fuel" type="number" min="0" value="19000"><label>Uang jalan sopir per hari (Rp, tidak termasuk makan)</label><input id="log-driver" type="number" min="0" value="175000"><label>Uang makan sopir per hari (Rp)</label><input id="log-meal" type="number" min="0" value="100000"><label>Hari perjalanan (otomatis 350 km/hari; bisa dikoreksi)</label><input id="log-days" type="number" min="1" value="4"><label>Total tol pulang-pergi (Rp, cek rute aktual)</label><input id="log-toll" type="number" min="0" value="0"><label>Total parkir pulang-pergi (Rp)</label><input id="log-parking" type="number" min="0" value="0"><label>Sewa kendaraan per hari (Rp)</label><input id="log-rental" type="number" min="0" value="0"><label>Cadangan biaya tak terduga/pungutan (opsional, bukan tarif resmi)</label><input id="log-risk" type="number" min="0" value="0"><label>Box pendingin/es/energi untuk seluruh rute (Rp)</label><input id="log-cold-fee" type="number" min="0" value="75000"><button class="btn btn-primary" onclick="calculateLogisticsUI()">Hitung biaya</button><div id="log-result"></div><button class="btn" onclick="showCommodityEconomics()">Kembali</button>';
 showModal(h);
}
function calculateLogisticsUI(){
 const qty=Math.max(0,Number(el("log-qty").value)||0),distance=Number(el("log-distance").value),vehicle=el("log-vehicle").value,cold=el("log-cold").checked,days=Math.max(1,Math.floor(Number(el("log-days").value)||1));
 const options={fuelPerLiter:Number(el("log-fuel").value),driverDaily:Number(el("log-driver").value),mealDaily:Number(el("log-meal").value),toll:Number(el("log-toll").value),parkingDaily:Number(el("log-parking").value)/days,rentalDaily:Number(el("log-rental").value),unofficialRisk:Number(el("log-risk").value),coldBoxFee:Number(el("log-cold-fee").value)};
 if(!Number.isFinite(distance)||distance<0||Object.values(options).some(x=>!Number.isFinite(x)||x<0)){msg("Semua angka harus valid dan tidak negatif.");return;}
 const r=estimateLogistics(qty,distance,vehicle,cold,options);r.days=days;r.driver=options.driverDaily*days;r.meal=options.mealDaily*days;r.rental=options.rentalDaily*days;r.parking=options.parkingDaily*days;
 r.total=r.fuel+r.driver+r.meal+r.parking+r.toll+r.rental+r.unofficialRisk+r.coldBox+r.packaging;
 el("log-result").innerHTML='<section class="agri-card"><p>Jarak pulang-pergi: '+r.roundTripKm.toLocaleString("id-ID")+' km · hari perjalanan: '+days+'</p><p>BBM: '+safeRp(r.fuel)+' ('+r.efficiency+' km/liter × '+safeRp(r.fuelPerLiter)+'/liter)</p><p>Uang jalan sopir: '+safeRp(r.driver)+' ('+safeRp(r.driverDaily)+'/hari, di luar makan)</p><p>Uang makan sopir: '+safeRp(r.meal)+'</p><p>Tol: '+safeRp(r.toll)+' · parkir: '+safeRp(r.parking)+'</p><p>Sewa kendaraan: '+safeRp(r.rental)+'</p><p>Cadangan risiko biaya tak terduga: '+safeRp(r.unofficialRisk)+'</p><p>Box pendingin: '+safeRp(r.coldBox)+' · kemasan: '+safeRp(r.packaging)+'</p><h4>Total distribusi: '+safeRp(r.total)+'</h4><p>Belum termasuk penginapan, bongkar-muat, penyusutan/servis kendaraan, asuransi, dan susut barang kecuali dimasukkan manual. Tarif tol harus diambil dari rute aktual.</p></section>';
}
