const SAVE_KEY='agrotycoon_save_v15';
let S=null;
function defaultState(){
 const trees=[];
 for(let i=0;i<10;i++)trees.push({slot:i,type:'biasa',plantedDay:0,mature:true,lastHarvest:-30});
 return {v:15,name:'',avatar:0,day:1,phase:'pagi',gold:5000000, xp:0, level:1,
  stock:{biasa:0,super:0},harvestDay:-99,trees,quarterUsed:0,
  cuaca:'panas',
  warung:{open:false,ice:0,sugar:0,cups:0,operatedToday:false,fridge:false,fridgeCap:0,autoMode:false,successfulSales:0},
  path:null,
  dayLog:newDayLog(),
  reports:[],ledger:[],realMoney:0,lastAdDay:0,storyDone:false,
  stats:{es:0,whole:0,tengkulak:0,rotten:0,missedDays:0,lostSales:0},
  livingStock:{rice:2,lauk:0,oil:0,mie:0,tempe:0,sayur:0,egg:0},
  unlockedAchievements:[]
 };
}
function newDayLog(){return {gross:0,expense:0,shopping:0,labor:0,living:0,bills:0,capex:0,lossIcePortions:0,lossIceValue:0,
 materials:{kelapa:0,ice:0,sugar:0,cup:0},
 sales:{es:0,esRev:0,whole:0,wholeRev:0,tengkulak:0,tengkulakRev:0,pasar:0,pasarRev:0},lost:0,
 dailyExpenses:[],weather:'panas',buyerCount:0};}
function initGameState(){
 const hasSave = localStorage.getItem(SAVE_KEY) !== null;
 if(hasSave){ loadSaved(); } else { loadFresh(); }
}
function loadFresh(){ S=defaultState(); save(); }
function loadSaved(){
 try{
  const r=localStorage.getItem(SAVE_KEY);
  if(r){
   S=JSON.parse(r);
   if(!S.dayLog)S.dayLog=newDayLog();
   if(!S.livingStock)S.livingStock={rice:2,lauk:0,oil:0,mie:0,tempe:0,sayur:0,egg:0};
   if(!S.warung)S.warung={open:false,ice:0,sugar:0,cups:0,operatedToday:false,fridge:false,fridgeCap:0,autoMode:false,successfulSales:0};
   if(typeof S.warung.autoMode!=='boolean')S.warung.autoMode=false;
   if(!Number.isFinite(S.warung.successfulSales))S.warung.successfulSales=0;
   if(!S.stats)S.stats={es:0,whole:0,tengkulak:0,rotten:0,missedDays:0,lostSales:0};
   if(!S.xp)S.xp=0; if(!S.level)S.level=1;
   if(!S.unlockedAchievements)S.unlockedAchievements=[];
  } else { throw new Error('Null save'); }
 }catch(e){ console.error(e); S=defaultState(); }
}
function save(){ localStorage.setItem(SAVE_KEY,JSON.stringify(S)); }
function gainXP(amount){
 S.xp += amount;
 const nextLevel = S.level + 1;
 if(DATA.levels[nextLevel] && S.xp >= DATA.levels[nextLevel].xpReq){
  S.level = nextLevel;
  msg('🎉 NAIK LEVEL! Anda sekarang: ' + DATA.levels[S.level].name + ' (Komoditas baru terbuka!)');
 }
 save();
}
function ledger(cat,desc,amt,detail){S.ledger.push({day:S.day,cat,desc,amt,detail:detail||null});}
function rp(n){return 'Rp '+Math.round(n).toLocaleString('id-ID');}
function monthOf(d){return Math.floor((d-1)/30)+1;}
function stockQty(){return (S.stock.biasa||0)+(S.stock.super||0);}
function stockAge(){return S.day-(S.harvestDay||0);}
function stockClass(){const q=stockQty();if(q<=0)return null;const a=stockAge();return a<=DATA.degrade.muda?'muda':a<=DATA.degrade.tua?'tua':'busuk';}
function rollWeather(){const r=Math.random();if(r<0.4)return 'panas';if(r<0.75)return 'berawan';return 'hujan';}
function rollBuyers(base){const w=DATA.weather[S.cuaca];const vary=0.8+Math.random()*0.4;return Math.max(w.minBuyers,Math.floor(base*w.esMult*vary));}
