const SAVE_KEY='agrotycoon_save_v2';
let S=null;
function defaultState(){
 const trees=[];
 for(let i=0;i<10;i++)trees.push({slot:i,type:'biasa',plantedDay:0,mature:true,lastHarvest:-30});
 return {v:2,name:'',avatar:0,day:1,phase:'pagi',gold:5000000,dayStartGold:5000000,
  stock:{biasa:0,super:0},harvestDay:-99,trees,
  warung:{open:false,fixedPaidDay:0},learned:false,ledger:[],realMoney:0,lastAdDay:0,storyDone:false,
  stats:{es:0,tengkulak:0,rotten:0}};
}
function load(){try{const r=localStorage.getItem(SAVE_KEY);S=r?JSON.parse(r):defaultState();}catch(e){S=defaultState();}}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(S));}
function ledger(desc,amt){S.ledger.push({day:S.day,desc,amt});}
function rp(n){return 'Rp '+Math.round(n).toLocaleString('id-ID');}
function monthOf(d){return Math.floor((d-1)/30)+1;}
function stockQty(){return S.stock.biasa+S.stock.super;}
function stockAge(){return S.day-S.harvestDay;}
function stockClass(){const q=stockQty();if(q<=0)return null;const a=stockAge();return a<=DATA.degrade.muda?'muda':a<=DATA.degrade.tua?'tua':'busuk';}
