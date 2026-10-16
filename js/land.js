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
 h+='<button class="btn" onclick="closeModal()">Tutup</button>';showModal(h);
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
 let h='<h3>🌴 Kebun Saya</h3><p>Kelapa warisan tetap dipertahankan. Untuk komoditas baru, pilih lahan, komoditas, dan jumlah petak. Maksimum katalog: 60 komoditas.</p>';
 h+='<label>Lahan</label><select id="garden-land">'+landOptions+'</select><label>Komoditas</label><select id="garden-crop">'+COMMODITIES.map(c=>'<option value="'+c.id+'">'+c.name+' — '+c.growDays+' hari</option>').join('')+'</select><label>Jumlah unit/petak</label><input id="garden-count" type="number" min="1" max="10000" value="1"><button class="btn btn-primary" onclick="plantCommodity()">Tanam / mulai produksi</button>';
 h+='<h4>Kelapa warisan</h4><div class="agri-grid">'+(S.trees||[]).map((t,i)=>{const age=t.mature?DATA.matureDays:Math.max(0,S.day-t.plantedDay);const pct=Math.min(100,Math.round(age/DATA.matureDays*100));const remain=Math.max(0,DATA.matureDays-age);return '<div class="agri-card"><b>🥥 Pohon '+(i+1)+'</b><p>'+(t.type==="super"?"Super":"Biasa")+' · '+(isMature(t)?"Siap panen":"Tumbuh")+'</p><div class="agri-progress"><span style="width:'+pct+'%"></span></div><small>Pertumbuhan '+pct+'% · '+(remain?remain+" hari lagi":"matang")+'</small></div>';}).join('')+'</div>';
 h+='<h4>Petak komoditas</h4>';
 S.landSystem.lands.forEach(l=>{h+='<h5>'+l.name+' — '+l.areaM2.toLocaleString("id-ID")+' m²</h5>';if(!(l.plots||[]).length){h+='<p>Belum ada petak komoditas.</p>';return;}l.plots.forEach(p=>{const c=COMMODITY_BY_ID[p.commodity];const age=Math.max(0,S.day-p.plantedDay),pct=Math.min(100,Math.floor(age/c.growDays*100));h+='<div class="agri-card"><b>'+c.name+' × '+p.count+'</b><p>Umur '+age+'/'+c.growDays+' hari · '+(p.health||100)+'% kesehatan · Risiko: '+(p.risk||"normal")+'</p><div class="agri-progress"><span style="width:'+pct+'%"></span></div><p>'+pct+'% tumbuh · '+(age>=c.growDays?"Siap dipanen":(c.growDays-age)+" hari menuju panen")+'</p>'+(age>=c.growDays?'<button class="btn btn-success" onclick="harvestCommodity(\''+l.id+'\',\''+p.id+'\')">Panen</button>':'')+' <button class="btn" onclick="careCommodity(\''+l.id+'\',\''+p.id+'\')">Rawat (+kesehatan)</button></div>';});});
 h+='<button class="btn" onclick="closeModal()">Tutup</button>';showModal(h);
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
 spend("CAPEX","Mulai produksi "+c.name+" × "+count,cost,"capex",{commodity:c.id,count});
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
 const weather=S.cuaca||"berawan",market=getCommodityPrice(c.id),riskLoss=(p.health||100)<40?.5:(weather==="hujan"&&["hortikultura","pangan"].includes(c.category)?.2:0),qty=Math.max(0,Math.floor(c.yieldQty*p.count*(p.health||100)/100*(1-riskLoss))),rev=qty*market;
 S.landSystem.market[c.id]=S.landSystem.market[c.id]||{sold:0,price:market};S.landSystem.market[c.id].sold+=qty;
 p.plantedDay=S.day;p.health=Math.max(50,(p.health||100)-10);
 S.gold+=rev;S.dayLog.gross+=rev;S.dayLog.sales.pasar=(S.dayLog.sales.pasar||0)+qty;S.dayLog.sales.pasarRev=(S.dayLog.sales.pasarRev||0)+rev;ledger("PENDAPATAN","Panen "+c.name+" "+qty+" unit",rev,"revenue",{commodity:c.id,marketPrice:market,riskLoss});
 save();msg("Panen "+c.name+": "+qty+" unit × "+safeRp(market)+" = "+safeRp(rev)+(riskLoss?" (hasil berkurang karena risiko/cuaca)":""));showGarden();render();
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
