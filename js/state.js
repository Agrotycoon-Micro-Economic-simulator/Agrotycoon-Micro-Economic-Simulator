const SAVE_KEY='agrotycoon_save_v5';
const DEV_MODE=true;
let S=null;
function defaultState(){
 const trees=[];
 for(let i=0;i<10;i++)trees.push({slot:i,type:'biasa',plantedDay:0,mature:true,lastHarvest:-30});
 return {v:5,name:'',avatar:0,day:1,phase:'pagi',gold:5000000,
  stock:{biasa:0,super:0},harvestDay:-99,trees,quarterUsed:0,
  cuaca:'panas',
  warung:{open:false,ice:0,sugar:0,cups:0,operatedToday:false,fridge:false,fridgeCap:0},
  path:null,
  dayLog:newDayLog(),
  reports:[],ledger:[],realMoney:0,lastAdDay:0,storyDone:false,
  stats:{es:0,whole:0,tengkulak:0,rotten:0,missedDays:0,lostSales:0},
  livingStock:{rice:2,lauk:0,oil:0}
 };
}
function newDayLog(){return {gross:0,expense:0,shopping:0,labor:0,living:0,bills:0,capex:0,lossIcePortions:0,lossIceValue:0,
 materials:{kelapa:0,ice:0,sugar:0,cup:0},
 sales:{es:0,esRev:0,whole:0,wholeRev:0,tengkulak:0,tengkulakRev:0,pasar:0,pasarRev:0},lost:0,
 dailyExpenses:[],weather:'panas',buyerCount:0};}
function loadFresh(){S=defaultState();save();}
function loadSaved(){
 try{const r=localStorage.getItem(SAVE_KEY);S=r?JSON.parse(r):defaultState();}catch(e){S=defaultState();}
 if(!S.dayLog)S.dayLog=newDayLog();
 if(!S.livingStock)S.livingStock={rice:2,lauk:0,oil:0};
 if(!S.warung.fridge)S.warung.fridge=false;
}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(S));}
function ledger(cat,desc,amt,detail){S.ledger.push({day:S.day,cat,desc,amt,detail:detail||null});}
function rp(n){return 'Rp '+Math.round(n).toLocaleString('id-ID');}
function monthOf(d){return Math.floor((d-1)/30)+1;}
function stockQty(){return S.stock.biasa+S.stock.super;}
function stockAge(){return S.day-S.harvestDay;}
function stockClass(){const q=stockQty();if(q<=0)return null;const a=stockAge();return a<=DATA.degrade.muda?'muda':a<=DATA.degrade.tua?'tua':'busuk';}
function rollWeather(){
 const r=Math.random();
 if(r<0.4)return 'panas';
 if(r<0.75)return 'berawan';
 return 'hujan';
}
function rollBuyers(base){
 const w=DATA.weather[S.cuaca];
 const vary=0.7+Math.random()*0.6;
 return Math.max(5,Math.floor(base*w.esMult*vary));
}
