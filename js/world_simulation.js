/* Agrotycoon world simulation v0.1
 * Real observations calibrate this model; scenario parameters below are EXPERIMENTAL until historical imports are validated.
 * Simulated events are game fiction, never current news.
 */
(function(){
"use strict";
const VERSION="0.1.0";
const REGIONS=[
 {id:"banten",name:"Banten",crops:["padi","bawang_merah","jagung","kelapa"]},
 {id:"jambi",name:"Jambi",crops:["padi","jagung","kelapa"]},
 {id:"jatim",name:"Jawa Timur",crops:["padi","jagung","bawang_merah"]},
 {id:"sulsel",name:"Sulawesi Selatan",crops:["padi","jagung","bawang_merah"]},
 {id:"ntb",name:"Nusa Tenggara Barat",crops:["padi","jagung","bawang_merah"]}
];
const CROPS={
 padi:{name:"Padi",base:1,unit:"indeks",stage:"tanaman",floodLoss:[0.08,0.28],droughtLoss:[0.05,0.22],elasticity:0.65},
 jagung:{name:"Jagung",base:1,unit:"indeks",stage:"tanaman",floodLoss:[0.05,0.24],droughtLoss:[0.08,0.30],elasticity:0.8},
 bawang_merah:{name:"Bawang merah",base:1,unit:"indeks",stage:"umbi",floodLoss:[0.12,0.38],droughtLoss:[0.04,0.18],elasticity:0.95},
 kelapa:{name:"Kelapa",base:1,unit:"indeks",stage:"pohon/hasil panen",floodLoss:[0.00,0.08],droughtLoss:[0.03,0.12],elasticity:0.45}
};
// These probabilities/effect ranges are game-design assumptions, not published Indonesian disaster statistics.
const EXPERIMENTAL={monthlyEventChance:0.16,monthlyRecovery:0.22,transportShock:0.12,priceClamp:[0.55,2.8]};
function hashSeed(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let a=seed>>>0;return function(){a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function ensure(){
 if(!window.S||!S)return null;
 if(!S.worldSim||S.worldSim.version!==VERSION){
  S.worldSim={version:VERSION,seed:hashSeed((S.name||"pemain")+"|agrotycoon-world-v1"),dayProcessed:0,regions:{},events:[],bulletins:[],parameterStatus:"EXPERIMENTAL",priceIndex:{},shipments:[]};
  REGIONS.forEach(r=>{S.worldSim.regions[r.id]={inventory:{padi:1000,jagung:800,bawang_merah:300,kelapa:500},production:{padi:100,jagung:80,bawang_merah:30,kelapa:50},demand:{padi:100,jagung:75,bawang_merah:28,kelapa:45},routeDisruption:0,activeEffects:{}};S.worldSim.priceIndex[r.id]={padi:1,jagung:1,bawang_merah:1,kelapa:1};});
 }
 return S.worldSim;
}
function pick(r,a){return a[Math.floor(r()*a.length)];}
function makeBulletin(day,region,event,affected){
 const names=affected.map(x=>CROPS[x].name).join(", ");
 let headline,body;
 if(event==="banjir"){headline="Banjir mengganggu kegiatan pertanian";body="Model memperkirakan risiko kehilangan produksi untuk "+names+". Dampak bergantung pada paparan dan tahap tanaman; barang yang telah dipanen tidak otomatis hilang.";}
 else if(event==="kekeringan"){headline="Kekeringan menekan hasil pertanian";body="Model mengurangi perkiraan produksi "+names+" pada wilayah terdampak. Perubahan harga dihitung dari stok, produksi, permintaan, dan distribusi.";}
 else {headline="Gangguan distribusi regional";body="Kapasitas pengiriman turun sementara. Biaya dan waktu angkut dapat mengurangi peluang arbitrase antardaerah.";}
 return {id:"sim-"+day+"-"+region.id+"-"+event,gameDay:day,regionId:region.id,region:region.name,type:event,headline,body,affected,classification:"SIMULASI",parameterStatus:"EXPERIMENTAL"};
}
function updateDay(day){
 const w=ensure();if(!w||w.dayProcessed>=day)return [];
 const r=rng((w.seed^Math.imul(day,2654435761))>>>0),newEvents=[];
 REGIONS.forEach(region=>{
  const rs=w.regions[region.id],indices=w.priceIndex[region.id];
  Object.keys(rs.activeEffects).forEach(k=>{rs.activeEffects[k]=Math.max(0,rs.activeEffects[k]-EXPERIMENTAL.monthlyRecovery/30);if(rs.activeEffects[k]===0)delete rs.activeEffects[k];});
  // Run event roll on each 30-day game month; deterministic per seed/day.
  if(day%30===1 && r()<EXPERIMENTAL.monthlyEventChance){
   const event=pick(r,["banjir","kekeringan","distribusi"]);
   const affected=event==="distribusi"?[]:region.crops.filter(c=>c!=="kelapa"||r()<0.25);
   if(event==="distribusi"){rs.routeDisruption=Math.min(0.65,rs.routeDisruption+0.2+r()*0.25);}
   affected.forEach(c=>{const range=CROPS[c][event==="banjir"?"floodLoss":"droughtLoss"];rs.activeEffects[c]=Math.max(rs.activeEffects[c]||0,range[0]+r()*(range[1]-range[0]));});
   const e=makeBulletin(day,region,event,affected);w.events.unshift(e);w.bulletins.unshift(e);newEvents.push(e);
  }
  // Simple, transparent stock-flow model. Current values are simulated units/index, not official market quotations.
  Object.keys(CROPS).forEach(c=>{
   const loss=rs.activeEffects[c]||0;
   const produced=rs.production[c]*(1-loss);
   rs.inventory[c]=Math.max(0,rs.inventory[c]+produced-rs.demand[c]);
   const coverage=rs.demand[c]>0?rs.inventory[c]/rs.demand[c]:1;
   const disruption=rs.routeDisruption||0;
   const raw=1+(1-Math.min(2,coverage))*CROPS[c].elasticity+disruption*0.35;
   indices[c]=Math.max(EXPERIMENTAL.priceClamp[0],Math.min(EXPERIMENTAL.priceClamp[1],raw));
  });
  rs.routeDisruption=Math.max(0,rs.routeDisruption-0.015);
 });
 w.dayProcessed=day;w.events=w.events.slice(0,100);w.bulletins=w.bulletins.slice(0,100);
 return newEvents;
}
window.AgroWorldSim={version:VERSION,regions:REGIONS,crops:CROPS,experimental:EXPERIMENTAL,ensure,updateDay,formatIndex:n=>(Number(n)||0).toFixed(2)+"×"};
})();