// ===== MAP ENGINE v3: LIVING WORLD (gaya Sim Companies) =====
const MapEngine=(function(){
const TILE=64;
const ASSETS={kebun:'assets/img/tile_kebun.png',rumah:'assets/img/tile_rumah.png',toko:'assets/img/tile_toko.png',d_rumah:'assets/img/detail_rumah.jpg',d_toko:'assets/img/detail_toko.jpg',truk:'assets/img/truk.png'};
const IMG={};let trukSprite=null;
const SHIRTS=['#2196F3','#E91E63','#4CAF50','#FF9800','#9C27B0','#00BCD4'];
const SKINS=['#FFCC80','#D7A86E','#8D5524','#F1C27D'];
function loadAssets(done){const ks=Object.keys(ASSETS);let n=0;ks.forEach(k=>{const im=new Image();im.onload=()=>{IMG[k]=im;if(k==='truk')trukSprite=chromaKey(im);if(++n===ks.length)done&&done();};im.onerror=()=>{if(++n===ks.length)done&&done();};im.src=ASSETS[k];});}
function chromaKey(im){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height);for(let i=0;i<d.data.length;i+=4){if(d.data[i]>238&&d.data[i+1]>238&&d.data[i+2]>238)d.data[i+3]=0;}x.putImageData(d,0,0);return c;}

const canvas=document.getElementById('map-canvas'),ctx=canvas.getContext('2d'),wrap=document.getElementById('map-wrap');
const hudGold=document.getElementById('hud-gold'),hudOwned=document.getElementById('hud-owned'),btnPasar=document.getElementById('btn-pasar');
const dv=document.getElementById('detail-view'),dvBg=document.getElementById('dv-bg'),dvCv=document.getElementById('dv-canvas'),dvCtx=dvCv.getContext('2d');
const dvTitle=document.getElementById('dv-title'),dvHot=document.getElementById('dv-hotspots'),dvToast=document.getElementById('dv-toast');

let W=16,H=16,cam={x:120,y:300,zoom:1},gold=5000000,tiles={},vehicles=[],walkers=[],particles=[];
let selected=null,pasarInduk=null,npcAcc=0,npcTruckAcc=0,payloadStock=40;
const ROAD_Y=8,MARKET={x:14,y:8};
const key=(x,y)=>x+','+y;
const ownedCount=()=>Object.values(tiles).filter(t=>t.owner==='player').length;
const px=t=>({x:t.x*TILE+TILE/2,y:t.y*TILE+TILE/2});
function resize(){canvas.width=wrap.clientWidth;canvas.height=wrap.clientHeight;}
window.addEventListener('resize',resize);

function init(){
 resize();
 for(let x=0;x<W;x++)tiles[key(x,ROAD_Y)]={type:'jalan'};
 for(let y=0;y<H;y++)tiles[key(2,y)]={type:'jalan'};
 tiles[key(MARKET.x,MARKET.y)]={type:'pasar',queue:0};
 tiles[key(3,7)]={owner:'player',type:'kebun',trees:10,prod:0,pile:60};
 tiles[key(3,6)]={owner:'player',type:'rumah'};
 tiles[key(4,7)]={owner:'player',type:'toko',saleT:0,queue:0};
 tiles[key(6,6)]={owner:'npc',type:'kebun'};
 tiles[key(7,7)]={owner:'npc',type:'kebun'};
 for(let i=0;i<6;i++)spawnWalker();
 loadAssets(()=>{});
 requestAnimationFrame(loop);
}

// ===== NPC PEJALAN (hidup di jalan) =====
function roadList(){const a=[];for(const k in tiles)if(tiles[k].type==='jalan'){const p=k.split(',').map(Number);a.push({x:p[0],y:p[1]});}return a;}
function spawnWalker(){
 const rt=roadList();if(!rt.length)return;
 const t=rt[Math.floor(Math.random()*rt.length)],c=px(t);
 const w={x:c.x,y:c.y,target:null,sp:0.02+Math.random()*0.015,ph:Math.random()*6,sh:SHIRTS[Math.floor(Math.random()*6)],sk:SKINS[Math.floor(Math.random()*4)]};
 pickTarget(w);walkers.push(w);
}
function pickTarget(w){const rt=roadList();const t=rt[Math.floor(Math.random()*rt.length)];w.target=px(t);}

// ===== PARTIKEL =====
function part(o){particles.push(Object.assign({life:1200,age:0},o));}
function coin(x,y,txt){part({type:'coin',x,y,vy:-0.04,txt:txt||'+Rp5.000'});}
function cocoFall(x,y){part({type:'coco',x,y,vy:0.06,life:900});}
function mist(x,y){part({type:'mist',x,y,vy:-0.02,life:1500});}

// ===== PRODUKSI OTOMATIS (Sim Companies: bangunan bekerja sendiri) =====
function updateProduction(dt){
 for(const k in tiles){
  const t=tiles[k];
  if(t.owner==='player'&&t.type==='kebun'){
   t.prod=(t.prod||0)+dt;
   if(t.prod>15000){t.prod=0;t.pile=Math.min(200,(t.pile||0)+10);
    const c=px({x:+k.split(',')[0],y:+k.split(',')[1]});
    for(let i=0;i<3;i++)cocoFall(c.x-15+Math.random()*30,c.y-18);
   }
  }
  if(t.owner==='player'&&t.type==='toko'){
   t.saleT=(t.saleT||0)+dt;
   t.qT=(t.qT||0)+dt;
   if(t.qT>6000){t.qT=0;t.queue=Math.min(3,(t.queue||0)+1);}
   if(t.saleT>4000){t.saleT=0;
    if(payloadStock>=0.25&&(t.queue||0)>0){
     payloadStock-=0.25;t.queue--;gold+=5000;
     const c=px({x:+k.split(',')[0],y:+k.split(',')[1]});coin(c.x,c.y-10);
    }
   }
  }
  if(t.type==='pasar'){t.qT=(t.qT||0)+dt;if(t.qT>5000){t.qT=0;t.queue=Math.min(4,(t.queue||0)+1);}}
 }
}

// ===== KENDARAAN =====
function pathBetween(a,b){const A=px(a),B=px(b);return [A,{x:A.x,y:ROAD_Y*TILE+TILE/2},{x:B.x,y:ROAD_Y*TILE+TILE/2},B];}
function sendTruck(){
 if(payloadStock<=0){toast('Stok kosong. Klik kebun → Panen tumpukan.');return;}
 const home={x:4,y:7};
 vehicles.push({x:px(home).x,y:px(home).y,home,path:pathBetween(home,MARKET),i:1,state:'toMarket',payload:payloadStock,npc:false});
 payloadStock=0;
}
function spawnNpcTruck(){
 const farms=Object.keys(tiles).filter(k=>tiles[k].owner==='npc');
 if(!farms.length)return;
 const p=farms[Math.floor(Math.random()*farms.length)].split(',').map(Number);
 const f={x:p[0],y:p[1]};
 vehicles.push({x:px(MARKET).x,y:px(MARKET).y,home:MARKET,path:pathBetween(MARKET,f),i:1,state:'npcFarm',payload:0,npc:true});
}
function spawnPasarNpc(){
 if(!pasarInduk)return;
 vehicles.push({x:px(MARKET).x,y:px(MARKET).y,home:MARKET,path:pathBetween(MARKET,pasarInduk),i:1,state:'npcToPasar',payload:200,npc:true});
}

let last=0;
function loop(ts){const dt=Math.min(50,(ts-last)||16);last=ts;update(dt);draw();if(dv.style.display==='block')drawInterior(dt);updateHud();requestAnimationFrame(loop);}

function update(dt){
 updateProduction(dt);
 // pejalan
 walkers.forEach(w=>{
  if(!w.target)return pickTarget(w);
  const dx=w.target.x-w.x,dy=w.target.y-w.y,d=Math.hypot(dx,dy);
  if(d<2){pickTarget(w);}else{w.x+=dx/d*w.sp*dt;w.y+=dy/d*w.sp*dt;w.ph+=dt*0.02;w.dir=dx<0?-1:1;}
 });
 // truk NPC otomatis
 npcTruckAcc+=dt;if(npcTruckAcc>12000){npcTruckAcc=0;spawnNpcTruck();}
 npcAcc+=dt;if(npcAcc>6000){npcAcc=0;spawnPasarNpc();}
 // kendaraan
 vehicles=vehicles.filter(v=>{
  if(v.i>=v.path.length)return (v.state==='return'||v.state==='npcReturn')?false:true;
  const t=v.path[v.i],dx=t.x-v.x,dy=t.y-v.y,d=Math.hypot(dx,dy),sp=0.12*dt;
  if(d<sp){v.x=t.x;v.y=t.y;v.i++;onArrive(v);}else{v.x+=dx/d*sp;v.y+=dy/d*sp;}
  return true;
 });
 // partikel
 particles=particles.filter(p=>{p.age+=dt;p.y+=(p.vy||0)*dt;return p.age<p.life;});
}
function onArrive(v){
 if(v.i<v.path.length)return;
 const cur={x:Math.floor(v.x/TILE),y:Math.floor(v.y/TILE)};
 if(v.state==='toMarket'){gold+=v.payload*3500;coin(v.x,v.y-8,'+'+(v.payload*3500).toLocaleString('id-ID'));v.state='return';v.path=pathBetween(cur,v.home);v.i=1;}
 else if(v.state==='npcToPasar'){gold+=v.payload*3500;coin(v.x,v.y-8,'+'+(v.payload*3500).toLocaleString('id-ID'));v.state='npcReturn';v.path=pathBetween(cur,v.home);v.i=1;}
 else if(v.state==='npcFarm'||v.state==='npcFarmReturn'){v.state=v.state==='npcFarm'?'npcFarmReturn':'npcReturn';v.path=pathBetween(cur,v.state==='npcFarmReturn'?v.home:v.home);v.i=1;if(v.state==='npcReturn')v.path=pathBetween(cur,MARKET);}
}

// ===== GAMBAR ORANG (vector, animasi jalan) =====
function drawPerson(g,x,y,s,ph,sh,sk,dir){
 g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x,y+s*0.5,s*0.32,s*0.1,0,0,7);g.fill();
 const sw=Math.sin(ph)*s*0.16;
 g.strokeStyle='#333';g.lineWidth=Math.max(1,s*0.1);g.lineCap='round';
 g.beginPath();g.moveTo(x-s*0.07,y);g.lineTo(x-s*0.07+sw,y+s*0.45);g.moveTo(x+s*0.07,y);g.lineTo(x+s*0.07-sw,y+s*0.45);g.stroke();
 g.fillStyle=sh;g.fillRect(x-s*0.15,y-s*0.35,s*0.3,s*0.38);
 g.fillStyle=sk;g.beginPath();g.arc(x,y-s*0.48,s*0.15,0,7);g.fill();
}

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle='#263238';ctx.fillRect(0,0,canvas.width,canvas.height);
 const z=cam.zoom;
 const x0=Math.max(0,Math.floor(cam.x/(TILE*z))-1),x1=Math.min(W,Math.ceil((cam.x+canvas.width)/(TILE*z))+1);
 const y0=Math.max(0,Math.floor(cam.y/(TILE*z))-1),y1=Math.min(H,Math.ceil((cam.y+canvas.height)/(TILE*z))+1);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const t=tiles[key(x,y)],sx=x*TILE*z-cam.x,sy=y*TILE*z-cam.y,s=TILE*z;
  ctx.fillStyle=(t&&t.owner==='player')?'#AED581':(t&&t.owner==='npc')?'#7CB342':'#558B2F';
  ctx.fillRect(sx,sy,s-1,s-1);
  if(t){
   if(t.type==='jalan'){ctx.fillStyle='#616161';ctx.fillRect(sx,sy,s-1,s-1);ctx.fillStyle='#EEE';ctx.fillRect(sx,sy+s/2-1,s-1,2);continue;}
   const imgKey=(t.type==='kebun'||t.type==='pasarInduk')?'kebun':t.type;
   if(IMG[imgKey])ctx.drawImage(IMG[imgKey],sx,sy,s,s);
   else{ctx.font=Math.floor(s*0.5)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t.type==='pasar'?'🏬':t.type==='pasarInduk'?'🏬':'',sx+s/2,sy+s/2);}
   if(t.owner==='npc'){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(sx,sy,s-1,s-1);}
   // tumpukan panen + progress bar produksi
   if(t.type==='kebun'&&t.owner==='player'){
    const layers=Math.floor((t.pile||0)/40);
    for(let i=0;i<layers;i++){ctx.fillStyle='#795548';ctx.beginPath();ctx.arc(sx+s*0.78-i*4*z,sy+s*0.82-i*3*z,4*z,0,7);ctx.fill();}
    const p=(t.prod||0)/15000;
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(sx+4*z,sy+2*z,s-8*z,5*z);
    ctx.fillStyle='#FFEB3B';ctx.fillRect(sx+5*z,sy+3*z,(s-10*z)*p,3*z);
   }
   // antrean NPC di toko & pasar
   if((t.type==='toko'||t.type==='pasar')&&t.queue){
    for(let i=0;i<t.queue;i++)drawPerson(ctx,sx+s*0.86,sy+s*0.35+i*9*z,9*z,performance.now()*0.005+i,SHIRTS[i%6],SKINS[i%4],1);
   }
  }
  if(selected&&selected.x===x&&selected.y===y){ctx.strokeStyle='#FFEB3B';ctx.lineWidth=3;ctx.strokeRect(sx+1,sy+1,s-3,s-3);}
 }
 // pejalan
 walkers.forEach(w=>drawPerson(ctx,w.x*z-cam.x,w.y*z-cam.y,11*z,w.ph,w.sh,w.sk,w.dir||1));
 // truk
 vehicles.forEach(v=>{
  if(v.x<0||v.y<0||v.x>W*TILE||v.y>H*TILE)return;
  const sx=v.x*z-cam.x,sy=v.y*z-cam.y;
  if(trukSprite)ctx.drawImage(trukSprite,sx-16*z,sy-16*z,32*z,32*z);
  else{ctx.font=Math.floor(26*z)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🚚',sx,sy);}
  if(v.payload>0){ctx.font=Math.floor(10*z)+'px serif';ctx.fillText('🥥',sx,sy-18*z);}
 });
 // partikel
 particles.forEach(p=>{
  const a=1-p.age/p.life,sx=p.x*z-cam.x,sy=p.y*z-cam.y;
  if(p.type==='coin'){ctx.globalAlpha=a;ctx.fillStyle='#FFD54F';ctx.font='bold '+Math.floor(11*z)+'px sans-serif';ctx.textAlign='center';ctx.fillText(p.txt,sx,sy);ctx.globalAlpha=1;}
  if(p.type==='coco'){ctx.globalAlpha=a;ctx.fillStyle='#795548';ctx.beginPath();ctx.arc(sx,sy,3.5*z,0,7);ctx.fill();ctx.globalAlpha=1;}
  if(p.type==='mist'){ctx.globalAlpha=a*0.5;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(sx,sy,4*z,0,7);ctx.fill();ctx.globalAlpha=1;}
 });
}

// ===== INTERIOR HIDUP =====
let interior={type:null,persons:[],t:0,mistT:0,workerBusy:0};
function openDetail(x,y){
 const t=tiles[key(x,y)];
 if(!t||t.owner!=='player')return;
 interior={type:t.type,persons:[],t:0,mistT:0,workerBusy:0};
 if(t.type==='rumah'&&IMG.d_rumah){dvBg.src=ASSETS.d_rumah;interior.persons.push({x:0.1,y:0.62,tx:0.4,ty:0.64,ph:0,sh:SHIRTS[1],sk:SKINS[0],st:'walk'});}
 else if(t.type==='toko'&&IMG.d_toko){dvBg.src=ASSETS.d_toko;interior.persons.push({x:0.62,y:0.6,tx:0.62,ty:0.6,ph:0,sh:'#FFF',sk:SKINS[1],st:'worker'});}
 else if(t.type==='kebun'){dvBg.src=ASSETS.kebun;dvBg.style.filter='brightness(.9) saturate(1.15)';
  interior.persons.push({x:0.3,y:0.7,tx:0.6,ty:0.72,ph:0,sh:SHIRTS[3],sk:SKINS[2],st:'walk'});
  interior.persons.push({x:0.7,y:0.75,tx:0.35,ty:0.78,ph:2,sh:SHIRTS[0],sk:SKINS[3],st:'walk'});}
 else{toast('Lahan kosong. Belum ada bangunan.');return;}
 dvBg.style.display='block';
 dvTitle.textContent=t.type==='kebun'?'🌴 Kebun Kelapa — Desa Warisan':t.type==='rumah'?'🏠 Rumah Keluarga':'🏪 Warung Es Kelapa';
 dvHot.innerHTML='';
 (HOTSPOTS[t.type]||[]).forEach(h=>{const b=document.createElement('button');b.className='hotspot';b.style.left=h.x+'%';b.style.top=h.y+'%';b.textContent=h.label;b.onclick=h.act;dvHot.appendChild(b);});
 dvCv.width=dv.clientWidth;dvCv.height=dv.clientHeight;
 dv.style.display='block';
}
function closeDetail(){dv.style.display='none';}
function drawInterior(dt){
 const g=dvCtx,Wd=dvCv.width,Hd=dvCv.height;
 g.clearRect(0,0,Wd,Hd);
 interior.t+=dt;interior.mistT+=dt;
 const T=interior.type;
 if(T==='toko'&&interior.mistT>900){interior.mistT=0;part2(g,0.2*Wd,0.6*Hd,'mist');}
 if(T==='rumah'&&interior.mistT>1100){interior.mistT=0;part2(g,0.07*Wd,0.55*Hd,'mist');}
 // spawn pelanggan toko
 if(T==='toko'&&interior.t>5000&&interior.persons.filter(p=>p.st!=='worker').length<3){
  interior.t=0;
  interior.persons.push({x:-0.05,y:0.8,tx:0.42,ty:0.8,ph:Math.random()*6,sh:SHIRTS[Math.floor(Math.random()*6)],sk:SKINS[Math.floor(Math.random()*4)],st:'walk'});
 }
 interior.persons=interior.persons.filter(p=>{
  if(p.st==='walk'){
   const dx=(p.tx-p.x)*Wd,dy=(p.ty-p.y)*Hd,d=Math.hypot(dx,dy),sp=0.00012*dt*Wd;
   if(d<4){p.st=(T==='toko')?'wait':'walk';if(T!=='toko'){const pts=[[0.1,0.62],[0.4,0.64],[0.8,0.68],[0.3,0.75]];const q=pts[Math.floor(Math.random()*pts.length)];p.tx=q[0];p.ty=q[1];}else{p.wait=1800;interior.workerBusy=1500;}}
   else{p.x+=dx/d*sp/Wd*Wd/Wd;p.x+= (dx/d)*(sp/Wd);p.y+=(dy/d)*(sp/Hd);p.ph+=dt*0.012;}
  }else if(p.st==='wait'){
   p.wait-=dt;p.ph+=dt*0.004;
   if(p.wait<=0){if(interior.workerBusy<=0){coin2(g,p.x*Wd,p.y*Hd-40);p.st='leave';p.tx=1.1;}}
  }else if(p.st==='leave'){
   const dx=(p.tx-p.x)*Wd,sp=0.00015*dt*Wd;
   p.x+=(dx>0?1:-1)*(sp/Wd);p.ph+=dt*0.012;
   if(p.x>1.1||p.x<-0.1)return false;
  }else if(p.st==='worker'){
   p.ph+=dt*0.004;
   if(interior.workerBusy>0){interior.workerBusy-=dt;if(interior.workerBusy<=0){const w=interior.persons.find(q=>q.st==='wait');if(w){w.st='leave';w.tx=1.1;coin2(g,w.x*Wd,w.y*Hd-40);}}}
  }
  drawPerson(g,p.x*Wd,p.y*Hd,(T==='kebun'?46:60),p.ph,p.sh,p.sk,1);
  return true;
 });
 // partikel interior
 interior.parts=(interior.parts||[]).filter(p=>{p.age+=dt;p.y+=p.vy*dt;const a=1-p.age/p.life;g.globalAlpha=a;if(p.type==='mist'){g.fillStyle='#fff';g.beginPath();g.arc(p.x,p.y,10,0,7);g.fill();}else{g.fillStyle='#FFD54F';g.font='bold 16px sans-serif';g.textAlign='center';g.fillText('+Rp5.000',p.x,p.y);}g.globalAlpha=1;return p.age<p.life;});
}
function part2(g,x,y,type){(interior.parts=interior.parts||[]).push({type,x,y,vy:-0.02,life:1400,age:0});}
function coin2(g,x,y){(interior.parts=interior.parts||[]).push({type:'coin',x,y,vy:-0.05,life:1100,age:0});}

// ===== HOTSPOT =====
const HOTSPOTS={
 kebun:[
  {x:18,y:66,label:'🥥 Tumpukan Kelapa',act:()=>{const t=tiles[key(3,7)];const h=t.pile||0;if(h<=0){toast('Belum ada panen matang. Tunggu progress bar penuh.');return;}payloadStock+=h;t.pile=0;toast('Panen +'+h+' butir masuk gudang toko.');}},
  {x:26,y:38,label:'🛖 Gubuk Pekerja',act:()=>toast('2 kuli aktif: memanjat & mengupas. Upah Rp 500/butir.')},
  {x:48,y:50,label:'🌴 Pohon Panjat',act:()=>toast('10 pohon produktif. Panen otomatis tiap 15 detik.')}
 ],
 rumah:[
  {x:6,y:62,label:'🍚 Dapur',act:()=>toast('Ibu memasak: beras 2kg, telur 1kg, minyak 1L.')},
  {x:40,y:62,label:'🪑 Meja Keluarga',act:()=>toast('Biaya hidup harian Rp 19.650 (sync core engine: tahap berikutnya).')},
  {x:78,y:64,label:'🛏 Tempat Tidur',act:()=>toast('Tidur = ganti hari. Akan tersinkron ke core engine.')}
 ],
 toko:[
  {x:20,y:62,label:'🧊 Coolbox Es',act:()=>toast('Es menjaga cup tetap dingin. Tanpa kulkas besar, es mencair malam.')},
  {x:50,y:58,label:'🥥 Stok Kelapa',act:()=>toast('Stok siap jual: '+Math.floor(payloadStock)+' butir.')},
  {x:37,y:17,label:'🥤 Rak Cup',act:()=>toast('Cup plastik tersedia. Pelanggan datang tiap beberapa detik.')},
  {x:80,y:55,label:'🍰 Etalase',act:()=>toast('Penjualan otomatis berjalan: lihat koin melayang di scene.')}
 ]
};

// ===== INTERAKSI PETA =====
let drag=null;
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y,moved:false};});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5)drag.moved=true;cam.x=drag.cx-dx;cam.y=drag.cy-dy;});
canvas.addEventListener('pointerup',e=>{
 if(drag&&!drag.moved){
  const r=canvas.getBoundingClientRect();
  const wx=(e.clientX-r.left+cam.x)/cam.zoom,wy=(e.clientY-r.top+cam.y)/cam.zoom;
  const tx=Math.floor(wx/TILE),ty=Math.floor(wy/TILE);
  selected={x:tx,y:ty};
  const t=tiles[key(tx,ty)];
  if(t&&t.owner==='player')openDetail(tx,ty);
  else if(!t)offerBuy(tx,ty);
  else toast(t.type==='pasar'?'Pasar desa: NPC antre & truk bongkar muat.':t.type==='jalan'?'Jalan logistik.':'Lahan NPC: tidak dijual.');
 }
 drag=null;
});
canvas.addEventListener('wheel',e=>{e.preventDefault();cam.zoom=Math.min(2,Math.max(0.4,cam.zoom*(e.deltaY<0?1.1:0.9)));},{passive:false});
function isAdjacentOwned(x,y){return [[1,0],[-1,0],[0,1],[0,-1]].some(d=>{const t=tiles[key(x+d[0],y+d[1])];return t&&t.owner==='player';});}
function offerBuy(x,y){
 if(!isAdjacentOwned(x,y)){toast('Terlalu jauh. Beli lahan menempel dulu.');return;}
 if(gold<2000000){toast('Uang tidak cukup (Rp 2.000.000/Ha).');return;}
 gold-=2000000;tiles[key(x,y)]={owner:'player',type:'kosong'};
 if(ownedCount()>=25&&W<64){W+=8;H+=8;}
 toast('Lahan dibeli!');
}
function buildPasarInduk(){
 if(ownedCount()<5){alert('Minimal 5 Ha.');return;}
 if(gold<50000000){alert('Butuh Rp 50.000.000.');return;}
 const spot=Object.entries(tiles).find(([k,t])=>t.owner==='player'&&t.type==='kosong');
 if(!spot){alert('Siapkan lahan kosong dulu.');return;}
 gold-=50000000;const [cx,cy]=spot[0].split(',').map(Number);
 tiles[spot[0]]={owner:'player',type:'pasarInduk'};pasarInduk={x:cx,y:cy};
}
function toast(t){dvToast.textContent=t;dvToast.style.display='block';setTimeout(()=>dvToast.style.display='none',2500);}
function updateHud(){hudGold.textContent=gold.toLocaleString('id-ID');hudOwned.textContent=ownedCount();btnPasar.style.display=(ownedCount()>=5&&!pasarInduk)?'block':'none';}

init();
return {sendTruck,buildPasarInduk,closeDetail};
})();
