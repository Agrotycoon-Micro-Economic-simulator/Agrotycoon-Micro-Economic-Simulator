// ===== MAP ENGINE PROTOTYPE (gaya Sim Companies) =====
const MapEngine=(function(){
const TILE=64;
const canvas=document.getElementById('map-canvas');
const ctx=canvas.getContext('2d');
const wrap=document.getElementById('map-wrap');
const detailBox=document.getElementById('tile-detail');
const hudGold=document.getElementById('hud-gold');
const hudOwned=document.getElementById('hud-owned');
const btnPasar=document.getElementById('btn-pasar');

let W=16,H=16;                 // ukuran world dalam tile (1 tile = 1 Ha), bisa expand
let cam={x:120,y:300,zoom:1};  // kamera (pan+zoom)
let gold=5000000;
let tiles={};                  // "x,y" -> {owner,type,...}
let vehicles=[];
let selected=null;
let pasarInduk=null;
let npcAcc=0;
let payloadStock=0;            // butir siap jual

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
 requestAnimationFrame(loop);
}

function pathBetween(a,b){
 const A=px(a),B=px(b);
 return [A,{x:A.x,y:ROAD_Y*TILE+TILE/2},{x:B.x,y:ROAD_Y*TILE+TILE/2},B];
}

function sendTruck(){
 if(payloadStock<=0){alert('Tidak ada stok siap jual. Klik kebun lalu Panen.');return;}
 const home={x:4,y:7};
 vehicles.push({x:px(home).x,y:px(home).y,home:home,path:pathBetween(home,MARKET),i:1,state:'toMarket',payload:payloadStock,npc:false});
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
  if(v.state==='toMarket')payloadStock=0;
  v.state=(v.state==='toMarket')?'return':'npcReturn';
  v.path=pathBetween(cur,v.home);v.i=1;
 }
}
function floatGold(txt,wx,wy){
 const d=document.createElement('div');d.className='float-gold';d.textContent=txt;
 d.style.left=(wx*cam.zoom-cam.x)+'px';d.style.top=(wy*cam.zoom-cam.y)+'px';
 wrap.appendChild(d);setTimeout(()=>d.remove(),1300);
}

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
   if(t.type==='jalan'){ctx.fillStyle='#616161';ctx.fillRect(sx,sy,s-1,s-1);}
   let icon=t.type==='pasar'?'🏬':t.type==='pasarInduk'?'🏬':t.type==='kebun'?'🌴':t.type==='rumah'?'🏠':t.type==='toko'?'🏪':'';
   if(icon){ctx.font=Math.floor(s*0.5)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(icon,sx+s/2,sy+s/2);}
  }
  if(selected&&selected.x===x&&selected.y===y){ctx.strokeStyle='#FFEB3B';ctx.lineWidth=3;ctx.strokeRect(sx+1,sy+1,s-3,s-3);}
 }
 vehicles.forEach(v=>{
  if(v.x<0||v.y<0||v.x>W*TILE||v.y>H*TILE)return; // HIDE kalau lewat batas map
  ctx.font=Math.floor(26*z)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(v.npc?'🚛':'🚚',v.x*z-cam.x,v.y*z-cam.y);
 });
}

// ===== INTERAKSI =====
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
  selectTile(Math.floor(wx/TILE),Math.floor(wy/TILE));
 }
 drag=null;
});
canvas.addEventListener('wheel',e=>{
 e.preventDefault();
 cam.zoom=Math.min(2,Math.max(0.4,cam.zoom*(e.deltaY<0?1.1:0.9)));
},{passive:false});

function isAdjacentOwned(x,y){
 return [[1,0],[-1,0],[0,1],[0,-1]].some(d=>{const t=tiles[key(x+d[0],y+d[1])];return t&&t.owner==='player';});
}
function selectTile(x,y){
 selected={x,y};
 const t=tiles[key(x,y)];let h='';
 if(t&&t.owner==='player'){
  if(t.type==='kebun')h='<h3>🌴 Kebun Kelapa (1 Ha)</h3><p>Pohon: '+t.trees+' | Siap panen: '+t.trees*20+' butir</p><button class="btn btn-success" onclick="MapEngine.harvest()">🌾 Panen Semua</button>';
  else if(t.type==='rumah')h='<h3>🏠 Rumah</h3><p>Pusat keluarga & konsumsi harian.</p>';
  else if(t.type==='toko')h='<h3>🏪 Toko Es Kelapa</h3><p>Stok siap jual: '+payloadStock+' butir</p>';
  else if(t.type==='pasarInduk')h='<h3>🏬 Pasar Induk Anda</h3><p>NPC datang membeli tiap beberapa detik.</p>';
  else h='<h3>🟩 Lahan Anda (1 Ha)</h3><p>Kosong. Siap dibangun.</p>';
 }else if(!t){
  h='<h3>🟩 Lahan Kosong (1 Ha)</h3>';
  h+=isAdjacentOwned(x,y)?'<p>Harga: Rp 2.000.000</p><button class="btn btn-primary" onclick="MapEngine.buyTile('+x+','+y+')">Beli</button>':'<p>Terlalu jauh. Beli lahan yang menempel dulu.</p>';
 }else{
  h='<h3>'+(t.type==='pasar'?'🏬 Pasar Desa':t.type==='jalan'?'🛣️ Jalan Logistik':'🌾 Lahan NPC')+'</h3>';
 }
 h+='<br><br><button class="btn" onclick="MapEngine.closeDetail()">Tutup</button>';
 detailBox.innerHTML=h;detailBox.style.display='block';
}
function closeDetail(){detailBox.style.display='none';selected=null;}
function harvest(){payloadStock+= (tiles[key(3,7)]?tiles[key(3,7)].trees*20:0);closeDetail();selectTile(4,7);}
function buyTile(x,y){
 if(gold<2000000){alert('Uang tidak cukup.');return;}
 gold-=2000000;tiles[key(x,y)]={owner:'player',type:'kosong'};
 if(ownedCount()>=25&&W<64){W+=8;H+=8;} // map membesar seiring ekspansi
 closeDetail();
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
return {sendTruck,buildPasarInduk,buyTile,harvest,closeDetail};
})();
