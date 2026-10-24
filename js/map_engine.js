// ===== MAP ENGINE v2: sprite gambar terkompres (556KB total) =====
// File yang ada: tile_kebun, tile_rumah, tile_toko, detail_rumah, detail_toko, truk
// Fallback: tile_pasar (emoji), detail_kebun (zoom dari tile_kebun)
const MapEngine=(function(){
const TILE=64;
const ASSETS={
 kebun:'assets/img/tile_kebun.png',
 rumah:'assets/img/tile_rumah.png',
 toko:'assets/img/tile_toko.png',
 d_rumah:'assets/img/detail_rumah.jpg',
 d_toko:'assets/img/detail_toko.jpg',
 truk:'assets/img/truk.png'
};
const IMG={};
let trukSprite=null;

function loadAssets(done){
 const keys=Object.keys(ASSETS);let n=0;
 keys.forEach(k=>{
  const im=new Image();
  im.onload=()=>{
   IMG[k]=im;
   if(k==='truk')trukSprite=chromaKey(im);
   if(++n===keys.length)done&&done();
  };
  im.onerror=()=>{
   console.warn('Asset gagal dimuat:',ASSETS[k]);
   if(++n===keys.length)done&&done();
  };
  im.src=ASSETS[k];
 });
}

function chromaKey(im){
 const c=document.createElement('canvas');
 c.width=im.width;c.height=im.height;
 const x=c.getContext('2d');
 x.drawImage(im,0,0);
 const d=x.getImageData(0,0,c.width,c.height);
 for(let i=0;i<d.data.length;i+=4){
  if(d.data[i]>238&&d.data[i+1]>238&&d.data[i+2]>238)d.data[i+3]=0;
 }
 x.putImageData(d,0,0);
 return c;
}

const canvas=document.getElementById('map-canvas');
const ctx=canvas.getContext('2d');
const wrap=document.getElementById('map-wrap');
const hudGold=document.getElementById('hud-gold');
const hudOwned=document.getElementById('hud-owned');
const btnPasar=document.getElementById('btn-pasar');
const dv=document.getElementById('detail-view');
const dvBg=document.getElementById('dv-bg');
const dvTitle=document.getElementById('dv-title');
const dvHot=document.getElementById('dv-hotspots');
const dvToast=document.getElementById('dv-toast');

let W=16,H=16;
let cam={x:120,y:300,zoom:1};
let gold=5000000;
let tiles={};
let vehicles=[];
let selected=null;
let pasarInduk=null;
let npcAcc=0;
let payloadStock=0;

const ROAD_Y=8, MARKET={x:14,y:8};
const key=(x,y)=>x+','+y;
const ownedCount=()=>Object.values(tiles).filter(t=>t.owner==='player').length;
const px=t=>({x:t.x*TILE+TILE/2,y:t.y*TILE+TILE/2});

function resize(){canvas.width=wrap.clientWidth;canvas.height=wrap.clientHeight;}
window.addEventListener('resize',resize);

function init(){
 resize();
 for(let x=0;x<W;x++)tiles[key(x,ROAD_Y)]={type:'jalan'};
 for(let y=0;y<H;y++)tiles[key(2,y)]={type:'jalan'};
 tiles[key(MARKET.x,MARKET.y)]={type:'pasar'};
 tiles[key(3,7)]={owner:'player',type:'kebun',trees:10};
 tiles[key(3,6)]={owner:'player',type:'rumah'};
 tiles[key(4,7)]={owner:'player',type:'toko'};
 tiles[key(6,6)]={owner:'npc',type:'kebun'};
 tiles[key(7,7)]={owner:'npc',type:'kebun'};
 loadAssets(()=>{});
 requestAnimationFrame(loop);
}

function pathBetween(a,b){
 const A=px(a),B=px(b);
 return [A,{x:A.x,y:ROAD_Y*TILE+TILE/2},{x:B.x,y:ROAD_Y*TILE+TILE/2},B];
}

function sendTruck(){
 if(payloadStock<=0){toast('Tidak ada stok. Masuk kebun → Panen dulu.');return;}
 const home={x:4,y:7};
 vehicles.push({x:px(home).x,y:px(home).y,home:home,path:pathBetween(home,MARKET),i:1,state:'toMarket',payload:payloadStock,npc:false});
 payloadStock=0;
}

function spawnNpc(){
 vehicles.push({x:px(MARKET).x,y:px(MARKET).y,home:MARKET,path:pathBetween(MARKET,pasarInduk),i:1,state:'npcToPasar',payload:200,npc:true});
}

let last=0;
function loop(ts){
 const dt=Math.min(50,(ts-last)||16);last=ts;
 update(dt);draw();updateHud();
 requestAnimationFrame(loop);
}

function update(dt){
 const sp=0.12*dt;
 vehicles=vehicles.filter(v=>{
  if(v.i>=v.path.length)return (v.state==='return'||v.state==='npcReturn')?false:true;
  const t=v.path[v.i],dx=t.x-v.x,dy=t.y-v.y,d=Math.hypot(dx,dy);
  if(d<sp){v.x=t.x;v.y=t.y;v.i++;onArrive(v);}
  else{v.x+=dx/d*sp;v.y+=dy/d*sp;}
  return true;
 });
 if(pasarInduk){npcAcc+=dt;if(npcAcc>6000){npcAcc=0;spawnNpc();}}
}

function onArrive(v){
 if(v.i<v.path.length)return;
 const cur={x:Math.floor(v.x/TILE),y:Math.floor(v.y/TILE)};
 const rev=v.payload*3500;
 if(v.state==='toMarket'||v.state==='npcToPasar'){
  gold+=rev;floatGold('+'+rev.toLocaleString('id-ID'),v.x,v.y);
  v.state=(v.state==='toMarket')?'return':'npcReturn';
  v.path=pathBetween(cur,v.home);v.i=1;
 }
}

function floatGold(txt,wx,wy){
 const d=document.createElement('div');
 d.className='float-gold';d.textContent=txt;
 d.style.left=(wx*cam.zoom-cam.x)+'px';d.style.top=(wy*cam.zoom-cam.y)+'px';
 wrap.appendChild(d);setTimeout(()=>d.remove(),1300);
}

function toast(t){dvToast.textContent=t;dvToast.style.display='block';setTimeout(()=>dvToast.style.display='none',2500);}

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle='#263238';ctx.fillRect(0,0,canvas.width,canvas.height);
 const z=cam.zoom;
 const x0=Math.max(0,Math.floor(cam.x/(TILE*z))-1),x1=Math.min(W,Math.ceil((cam.x+canvas.width)/(TILE*z))+1);
 const y0=Math.max(0,Math.floor(cam.y/(TILE*z))-1),y1=Math.min(H,Math.ceil((cam.y+canvas.height)/(TILE*z))+1);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const t=tiles[key(x,y)];
  const sx=x*TILE*z-cam.x,sy=y*TILE*z-cam.y,s=TILE*z;
  ctx.fillStyle=(t&&t.owner==='player')?'#AED581':(t&&t.owner==='npc')?'#7CB342':'#558B2F';
  ctx.fillRect(sx,sy,s-1,s-1);
  if(t){
   if(t.type==='jalan'){
    ctx.fillStyle='#616161';ctx.fillRect(sx,sy,s-1,s-1);
    ctx.fillStyle='#EEE';ctx.fillRect(sx,sy+s/2-1,s-1,2);
    continue;
   }
   // Pilih gambar atau fallback emoji
   const imgKey=(t.type==='kebun'||t.type==='pasarInduk')?'kebun':t.type;
   if(IMG[imgKey]){
    ctx.drawImage(IMG[imgKey],sx,sy,s,s);
   }else{
    // Fallback emoji (untuk pasar, pasarInduk, atau tile tanpa gambar)
    const emojiMap={pasar:'🏬',pasarInduk:'🏬',rumah:'🏠',toko:'🏪',kebun:'🌴'};
    ctx.font=Math.floor(s*0.5)+'px serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(emojiMap[t.type]||'',sx+s/2,sy+s/2);
   }
   if(t.owner==='npc'){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(sx,sy,s-1,s-1);}
  }
  if(selected&&selected.x===x&&selected.y===y){
   ctx.strokeStyle='#FFEB3B';ctx.lineWidth=3;
   ctx.strokeRect(sx+1,sy+1,s-3,s-3);
  }
 }
 vehicles.forEach(v=>{
  if(v.x<0||v.y<0||v.x>W*TILE||v.y>H*TILE)return;
  const sx=v.x*z-cam.x,sy=v.y*z-cam.y;
  if(trukSprite){
   ctx.drawImage(trukSprite,sx-16*z,sy-16*z,32*z,32*z);
  }else{
   ctx.font=Math.floor(26*z)+'px serif';
   ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillText(v.npc?'🚛':'🚚',sx,sy);
  }
 });
}

// ===== INTERIOR DETAIL VIEW =====
const HOTSPOTS={
 kebun:[
  {x:18,y:66,label:'🥥 Tumpukan Kelapa',act:()=>{const h=(tiles[key(3,7)]?tiles[key(3,7)].trees:0)*20;payloadStock+=h;toast('Panen +'+h+' butir masuk gudang toko.');}},
  {x:26,y:38,label:'🛖 Gubuk Pekerja',act:()=>toast('Kuli panen: upah Rp 500/butir (sync ke game utama segera).')},
  {x:48,y:50,label:'🌴 Pohon Panjat',act:()=>toast('10 pohon produktif. Siklus panen 30 hari.')}
 ],
 rumah:[
  {x:6,y:62,label:'🍚 Dapur',act:()=>toast('Stok dapur: beras 2kg, telur 1kg, minyak 1L.')},
  {x:40,y:62,label:'🪑 Meja Keluarga',act:()=>toast('Biaya hidup harian: Rp 19.650 (sync ke game utama).')},
  {x:78,y:64,label:'🛏 Tempat Tidur',act:()=>toast('Tidur = ganti hari. Sinkronisasi ke core engine: tahap berikutnya.')}
 ],
 toko:[
  {x:20,y:62,label:'🧊 Coolbox Es',act:()=>toast('Es: 40 porsi (mencair jika tanpa kulkas besar).')},
  {x:50,y:58,label:'🥥 Stok Kelapa',act:()=>toast('Stok siap jual: '+payloadStock+' butir.')},
  {x:37,y:17,label:'🥤 Rak Cup',act:()=>toast('Cup plastik: 52 pcs.')},
  {x:80,y:55,label:'🍰 Etalase',act:()=>toast('Es terjual hari ini: 0 gelas (sandbox).')}
 ]
};

function openDetail(x,y){
 const t=tiles[key(x,y)];
 if(!t||t.owner!=='player'){return;}
 // Pilih scene: kalau ada gambar pakai, kalau tidak pakai kebun zoom
 if(t.type==='rumah'&&IMG.d_rumah){
  dvBg.src=ASSETS.d_rumah;
 }else if(t.type==='toko'&&IMG.d_toko){
  dvBg.src=ASSETS.d_toko;
 }else if(t.type==='kebun'){
  // Fallback: pakai tile_kebun zoom + overlay hijau gelap
  if(IMG.kebun){
   dvBg.src=ASSETS.kebun;
   dvBg.style.objectFit='cover';
   dvBg.style.filter='brightness(0.85) saturate(1.2)';
  }else{
   dvBg.style.display='none';
   dv.style.background='linear-gradient(180deg,#4CAF50 0%,#2E7D32 100%)';
  }
 }else{
  toast('Lahan kosong. Belum ada bangunan.');return;
 }
 dvBg.style.display='block';
 dvBg.style.filter=(t.type==='kebun')?'brightness(0.85) saturate(1.2)':'';
 dvTitle.textContent=t.type==='kebun'?'🌴 Kebun Kelapa — Desa Warisan':t.type==='rumah'?'🏠 Rumah Keluarga':t.type==='toko'?'🏪 Warung Es Kelapa':'';
 dvHot.innerHTML='';
 (HOTSPOTS[t.type]||[]).forEach(h=>{
  const b=document.createElement('button');
  b.className='hotspot';b.style.left=h.x+'%';b.style.top=h.y+'%';b.textContent=h.label;
  b.onclick=h.act;
  dvHot.appendChild(b);
 });
 dv.style.display='block';
}

function closeDetail(){dv.style.display='none';}

// ===== INTERAKSI PETA =====
let drag=null;
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y,moved:false};});
canvas.addEventListener('pointermove',e=>{
 if(!drag)return;
 const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
 if(Math.abs(dx)+Math.abs(dy)>5)drag.moved=true;
 cam.x=drag.cx-dx;cam.y=drag.cy-dy;
});
canvas.addEventListener('pointerup',e=>{
 if(drag&&!drag.moved){
  const r=canvas.getBoundingClientRect();
  const wx=(e.clientX-r.left+cam.x)/cam.zoom,wy=(e.clientY-r.top+cam.y)/cam.zoom;
  const tx=Math.floor(wx/TILE),ty=Math.floor(wy/TILE);
  selected={x:tx,y:ty};
  const t=tiles[key(tx,ty)];
  if(t&&t.owner==='player')openDetail(tx,ty);
  else if(!t)offerBuy(tx,ty);
  else toast(t.type==='pasar'?'Pasar desa: tempat truk menjual.':t.type==='jalan'?'Jalan logistik.':'Lahan NPC: tidak dijual.');
 }
 drag=null;
});
canvas.addEventListener('wheel',e=>{
 e.preventDefault();
 cam.zoom=Math.min(2,Math.max(0.4,cam.zoom*(e.deltaY<0?1.1:0.9)));
},{passive:false});

function isAdjacentOwned(x,y){
 return [[1,0],[-1,0],[0,1],[0,-1]].some(d=>{
  const t=tiles[key(x+d[0],y+d[1])];
  return t&&t.owner==='player';
 });
}

function offerBuy(x,y){
 if(!isAdjacentOwned(x,y)){toast('Terlalu jauh. Beli lahan yang menempel dulu.');return;}
 if(gold<2000000){toast('Uang tidak cukup (Rp 2.000.000/Ha).');return;}
 gold-=2000000;
 tiles[key(x,y)]={owner:'player',type:'kosong'};
 if(ownedCount()>=25&&W<64){W+=8;H+=8;}
 toast('Lahan dibeli! Klik lagi untuk bangun.');
}

function buildPasarInduk(){
 if(ownedCount()<5){alert('Minimal 5 Ha dulu.');return;}
 if(gold<50000000){alert('Butuh Rp 50.000.000.');return;}
 const spot=Object.entries(tiles).find(([k,t])=>t.owner==='player'&&t.type==='kosong');
 if(!spot){alert('Siapkan lahan kosong milik Anda dulu.');return;}
 gold-=50000000;
 const [cx,cy]=spot[0].split(',').map(Number);
 tiles[spot[0]]={owner:'player',type:'pasarInduk'};
 pasarInduk={x:cx,y:cy};
}

function updateHud(){
 hudGold.textContent=gold.toLocaleString('id-ID');
 hudOwned.textContent=ownedCount();
 btnPasar.style.display=(ownedCount()>=5&&!pasarInduk)?'block':'none';
}

init();
return {sendTruck,buildPasarInduk,closeDetail};
})();
