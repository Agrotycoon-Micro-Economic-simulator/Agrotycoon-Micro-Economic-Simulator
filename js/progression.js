/* Agrotycoon progression rules v1.
 * Wealth is a conservative book-value estimate, not market appraisal.
 * Gold premium currency is intentionally separate and not enabled in this frontend phase.
 */
(function(root){
 "use strict";
 const RULES=[
  {id:"small_land",title:"Lahan kecil (100 m²)",level:3,wealth:10000000,description:"Pembelian lahan kecil di luar lahan warisan."},
  {id:"staff",title:"Mempekerjakan karyawan",level:7,wealth:25000000,description:"Membuka modul perekrutan dan biaya tenaga kerja saat sistem payroll diaktifkan."},
  {id:"medium_land",title:"Lahan menengah (1.000 m²)",level:8,wealth:50000000,description:"Ekspansi budidaya dengan kebutuhan modal lebih besar."},
  {id:"expansion",title:"Ekspansi usaha",level:10,wealth:50000000,description:"Membuka rencana usaha multi-unit dan investasi tambahan."},
  {id:"loan",title:"Pengajuan pinjaman",level:5,wealth:15000000,description:"Membuka akses kredit setelah tersedia modul tenor, bunga, cicilan, dan gagal bayar."},
  {id:"large_land",title:"Lahan besar (10.000 m²)",level:15,wealth:250000000,description:"Investasi lahan skala besar."},
  {id:"huge_land",title:"Lahan raksasa (100.000 m²)",level:25,wealth:1000000000,description:"Investasi lahan skala sangat besar."},
  {id:"consultants",title:"Konsultan bisnis",level:10,wealth:50000000,description:"Rencana biaya layanan 1–10 Gold per proyek; belum dapat dibeli sebelum dompet Gold terpisah tersedia."},
  {id:"government",title:"Sistem pemerintahan & kebijakan",level:20,wealth:250000000,description:"Kebijakan, izin, insentif, pajak, dan regulasi simulasi."}
 ];
 function number(n){return Number.isFinite(Number(n))?Number(n):0}
 function wealth(state){
  if(!state)return 0;
  const land=(state.landSystem&&Array.isArray(state.landSystem.lands)?state.landSystem.lands:[]).reduce((sum,l)=>sum+Math.max(0,number(l.purchaseCost))+Math.max(0,number(l.improvements)),0);
  const data=typeof DATA!=="undefined"?DATA:(root.DATA||{});
  const equipment=state.warung&&state.warung.fridge?number((data.shop&&data.shop.fridge||{}).price):0;
  const prices=data.priceTengkulak||{};\n  const stock=number(state.stock&&state.stock.biasa)*number(prices.biasa)+number(state.stock&&state.stock.super)*number(prices.super);
  const finance=state.finance||{};\n  const loanDebt=(Array.isArray(finance.loans)?finance.loans:[]).filter(l=>["active","overdue"].includes(l.status)).reduce((sum,l)=>sum+number(l.principal)+number(l.interestDue),0);\n  const debt=number(finance.debt)+number(finance.payablesPayroll)+loanDebt;
  return Math.max(0,number(state.gold)+land+equipment+stock-debt);
 }
 function rule(id){return RULES.find(r=>r.id===id)||null}
 function status(id,state){const r=rule(id);if(!r)return {allowed:false,reason:"Aturan tidak ditemukan."};const s=state||(typeof S!=="undefined"?S:(root.S||{}));const lv=Math.max(1,number(s.level)||1),w=wealth(s),missing=[];if(lv<r.level)missing.push("Level "+r.level);if(w<r.wealth)missing.push("kekayaan Rp "+r.wealth.toLocaleString("id-ID"));return {allowed:missing.length===0,rule:r,level:lv,wealth:w,missing,reason:missing.length?"Syarat belum terpenuhi: "+missing.join(" dan "):"Syarat level dan kekayaan terpenuhi."}}
 function landRule(tierId){return ({small:"small_land",medium:"medium_land",large:"large_land",huge:"huge_land"})[tierId]||"small_land"}
 function commodityLevel(c){if(!c)return 1;if(c.category==="pangan")return 1;if(c.category==="hortikultura"||c.category==="buah")return 3;if(c.category==="perkebunan"||c.category==="rempah")return 5;if(c.category==="peternakan")return 7;if(c.category==="perikanan")return 10;if(c.category==="industri")return 12;return 5}
 function commodityStatus(c,state){const s=state||(typeof S!=="undefined"?S:(root.S||{})),required=commodityLevel(c),level=Math.max(1,number(s.level)||1);return {allowed:level>=required,required,level,reason:level>=required?"Komoditas terbuka.":"Komoditas terbuka mulai level "+required+"."}}
 root.AgroProgression={version:"1.0.0",rules:RULES,wealth,rule,status,landRule,commodityLevel,commodityStatus};
})(typeof window!=="undefined"?window:this);
