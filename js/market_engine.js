/* Agrotycoon shared-market price core.
 * Price limits are game-design guardrails. Cross-player aggregates must come from an authoritative server;
 * browser/localStorage data is never treated as the market for all players.
 */
(function(root){
 "use strict";
 const SCHEMA_VERSION=1;
 const DEFAULT_ELASTICITY=0.35;

 function finiteNonNegative(value){
  return typeof value==="number"&&Number.isFinite(value)&&value>=0;
 }
 function getCatalog(catalog){
  const rows=Array.isArray(catalog)?catalog:[];
  const seen=new Set();
  return rows.filter(item=>{
   if(!item||typeof item.id!=="string"||!item.id||seen.has(item.id))return false;
   seen.add(item.id);
   return finiteNonNegative(item.basePrice)&&finiteNonNegative(item.marketFloor)&&
    finiteNonNegative(item.marketCeiling)&&item.marketFloor<=item.basePrice&&item.basePrice<=item.marketCeiling;
  });
 }
 function validateAggregate(aggregate){
  if(!aggregate||typeof aggregate!=="object")return {ok:false,reason:"missing_authoritative_aggregate"};
  const fields=["buyQty","sellQty","volume","weightedPrice","previousPrice"];
  for(const field of fields){
   if(aggregate[field]!=null&&!finiteNonNegative(aggregate[field]))return {ok:false,reason:"invalid_"+field};
  }
  if(aggregate.volume!=null&&aggregate.volume>0&&!(aggregate.weightedPrice>0)){
   return {ok:false,reason:"positive_volume_requires_weighted_price"};
  }
  return {ok:true};
 }
 function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

 // aggregate must be server-derived from executed transactions of active players in the same market window.
 // No orders or unfilled listings count as transactions.
 function calculatePrice(commodity,aggregate,options){
  if(!commodity||typeof commodity.id!=="string")return {ok:false,reason:"invalid_commodity"};
  const validation=validateAggregate(aggregate);
  if(!validation.ok)return {ok:false,reason:validation.reason};
  const floor=Number(commodity.marketFloor),ceiling=Number(commodity.marketCeiling);
  const base=Number(commodity.basePrice);
  if(!finiteNonNegative(floor)||!finiteNonNegative(ceiling)||!finiteNonNegative(base)||floor>base||base>ceiling||floor>ceiling){
   return {ok:false,reason:"invalid_price_bounds"};
  }
  const opts=options||{};
  const elasticity=finiteNonNegative(opts.elasticity)?opts.elasticity:DEFAULT_ELASTICITY;
  const buy=Number(aggregate.buyQty)||0;
  const sell=Number(aggregate.sellQty)||0;
  const volume=Number(aggregate.volume)||0;
  const last=Number(aggregate.previousPrice)>0?Number(aggregate.previousPrice):base;
  const traded=volume>0?Number(aggregate.weightedPrice):last;
  // Net order-flow pressure is bounded [-1,1], so one quiet market window cannot cause an unbounded jump.
  const pressure=(buy+sell)>0?clamp((buy-sell)/(buy+sell),-1,1):0;
  const pressureAdjusted=traded*Math.exp(elasticity*pressure);
  const price=clamp(Math.round(pressureAdjusted),floor,ceiling);
  return {
   ok:true,commodityId:commodity.id,price,floor,ceiling,referencePrice:traded,
   buyQty:buy,sellQty:sell,executedVolume:volume,pressure,
   source:volume>0?"server_executed_trade_vwap":"previous_market_price",
   schemaVersion:SCHEMA_VERSION
  };
 }
 function buildPriceBoard(catalog,aggregates,options){
  const rows=getCatalog(catalog);
  const data=aggregates&&typeof aggregates==="object"?aggregates:{};
  return rows.map(item=>{
   const aggregate=data[item.id];
   if(!aggregate)return {ok:true,commodityId:item.id,name:item.name,price:item.marketPrice||item.basePrice,
    floor:item.marketFloor,ceiling:item.marketCeiling,source:"baseline_no_authoritative_aggregate"};
   const result=calculatePrice(item,aggregate,options);
   return Object.assign({name:item.name},result);
  });
 }
 function applyServerSnapshot(catalog,aggregates,options){
  const board=buildPriceBoard(catalog,aggregates,options);
  const failed=board.filter(row=>row.ok===false);
  return {ok:failed.length===0,board,errors:failed.map(row=>({commodityId:row.commodityId,reason:row.reason})),
   source:"authoritative_server_aggregate_required",schemaVersion:SCHEMA_VERSION};
 }
 root.AgroMarketEngine=Object.freeze({
  version:"1.0.0",schemaVersion:SCHEMA_VERSION,defaultElasticity:DEFAULT_ELASTICITY,
  validateAggregate,calculatePrice,buildPriceBoard,applyServerSnapshot
 });
})(typeof window!=="undefined"?window:globalThis);
