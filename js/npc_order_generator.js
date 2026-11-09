/* Regional NPC order proposals derived from the national economy's executed daily state.
 * Orders are aggregate NPC pools, not individual agent inventories. Production quantities
 * remain experimental scenario values until region/commodity capacity data is calibrated.
 */
(function (root) {
  "use strict";
  function positive(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function buildDailyOrders(input) {
    const x = input && typeof input === "object" ? input : {};
    const day = Number(x.day);
    if (!Number.isSafeInteger(day) || day < 1) {
      return { ok: false, reason: "invalid_game_day", day: null, orders: [], summary: { buyCount: 0, sellCount: 0 } };
    }
    const provinces = Array.isArray(x.provinces) ? x.provinces : [];
    const catalog = Array.isArray(x.catalog) ? x.catalog : [];
    const getPrice = typeof x.getPrice === "function" ? x.getPrice : () => null;
    const orders = [];
    let sequence = 0;
    const seenRegions = new Set();
    provinces.slice().sort((a, b) => String(a && a.id).localeCompare(String(b && b.id))).forEach(province => {
      if (!province || !province.id || seenRegions.has(String(province.id))) return;
      const regionId = String(province.id);
      seenRegions.add(regionId);
      catalog.forEach(item => {
        if (!item || !item.id) return;
        const id = String(item.id);
        const production = positive(province.dailyProduction && province.dailyProduction[id]);
        const unmetDemand = positive(province.unmetDemand && province.unmetDemand[id]);
        if (production <= 0 && unmetDemand <= 0) return;
        const nationalPrice = positive(getPrice(id));
        if (nationalPrice <= 0) return;
        const index = positive(province.prices && province.prices[id]) || 1;
        const floor = positive(item.marketFloor);
        const ceiling = positive(item.marketCeiling);
        if (floor <= 0 || ceiling < floor) return;
        const localPrice = Math.round(Math.min(ceiling, Math.max(floor, nationalPrice * index)));
        if (!Number.isFinite(localPrice) || localPrice <= 0) return;
        const common = {
          commodityId: id, limitPrice: localPrice, createdAt: day, expiresAt: day + 1,
          actorType: "npc", regionId, stage: "producer",
          calibrationStatus: "experimental_regional_simulation_aggregate",
          sourceRegion: "AgroNationalEconomy.provinceSnapshot", sourceDay: day
        };
        if (production > 0) {
          sequence += 1;
          orders.push(Object.assign({}, common, {
            orderId: "npc-supply-" + day + "-" + regionId + "-" + id,
            side: "sell", quantity: production, ownerId: "npc-producer-pool-" + regionId,
            sequence, quantityBasis: "modeled_daily_regional_production"
          }));
        }
        if (unmetDemand > 0) {
          sequence += 1;
          orders.push(Object.assign({}, common, {
            orderId: "npc-demand-" + day + "-" + regionId + "-" + id,
            side: "buy", quantity: unmetDemand, ownerId: "npc-buyer-pool-" + regionId,
            sequence, quantityBasis: "regional_unmet_demand_after_inventory"
          }));
        }
      });
    });
    return {
      ok: true, day, orders,
      summary: {
        buyCount: orders.filter(order => order.side === "buy").length,
        sellCount: orders.filter(order => order.side === "sell").length,
        totalBuyQuantity: orders.filter(order => order.side === "buy").reduce((sum, order) => sum + order.quantity, 0),
        totalSellQuantity: orders.filter(order => order.side === "sell").reduce((sum, order) => sum + order.quantity, 0),
        regionCount: seenRegions.size,
        calibrationStatus: "experimental_regional_simulation_aggregate"
      }
    };
  }
  root.AgroNpcOrderGenerator = { version: "0.1.0", buildDailyOrders };
})(typeof window !== "undefined" ? window : globalThis);
if (typeof module !== "undefined" && module.exports) module.exports = globalThis.AgroNpcOrderGenerator;
