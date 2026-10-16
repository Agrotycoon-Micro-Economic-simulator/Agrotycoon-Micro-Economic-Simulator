const ACHIEVEMENTS = [
  // ========== PENJUALAN ES KELAPA (6 Tier) ==========
  {
    id: 'es_100',
    name: '🍹 Penjual Es Pemula',
    desc: 'Jual 100 gelas es kelapa pertama.',
    category: 'Penjualan Es',
    tier: 1,
    icon: '🍹',
    label: '100 Gelas',
    check: (S) => (S.stats.es || 0) >= 100,
    buff: { type: 'profit_multiplier', value: 0.002, desc: '+0.2% profit semua komoditas' }
  },
  {
    id: 'es_500',
    name: ' Juragan Es',
    desc: 'Jual 500 gelas es kelapa.',
    category: 'Penjualan Es',
    tier: 1,
    icon: '🍹',
    label: '500 Gelas',
    check: (S) => (S.stats.es || 0) >= 500,
    buff: { type: 'profit_multiplier', value: 0.005, desc: '+0.5% profit semua komoditas' }
  },
  {
    id: 'es_1000',
    name: '🍹 Master Es Kelapa',
    desc: 'Jual 1.000 gelas es kelapa.',
    category: 'Penjualan Es',
    tier: 2,
    icon: '🏅',
    label: '1.000 Gelas',
    check: (S) => (S.stats.es || 0) >= 1000,
    buff: { type: 'profit_multiplier', value: 0.01, desc: '+1% profit semua komoditas' }
  },
  {
    id: 'es_5000',
    name: '🍹 Raja Es Kelapa',
    desc: 'Jual 5.000 gelas es kelapa.',
    category: 'Penjualan Es',
    tier: 3,
    icon: '👑',
    label: '5.000 Gelas',
    check: (S) => (S.stats.es || 0) >= 5000,
    buff: { type: 'profit_multiplier', value: 0.03, desc: '+3% profit semua komoditas' }
  },
  {
    id: 'es_10000',
    name: ' Legenda Es Kelapa',
    desc: 'Jual 10.000 gelas es kelapa.',
    category: 'Penjualan Es',
    tier: 4,
    icon: '',
    label: '10.000 Gelas',
    check: (S) => (S.stats.es || 0) >= 10000,
    buff: { type: 'profit_multiplier', value: 0.05, desc: '+5% profit semua komoditas' }
  },
  {
    id: 'es_25000',
    name: '🍹 Dewa Es Kelapa',
    desc: 'Jual 25.000 gelas es kelapa.',
    category: 'Penjualan Es',
    tier: 4,
    icon: '⚡',
    label: '25.000 Gelas',
    check: (S) => (S.stats.es || 0) >= 25000,
    buff: { type: 'profit_multiplier', value: 0.10, desc: '+10% profit semua komoditas' }
  },
  
  // ========== PENJUALAN KE TENGKULAK (6 Tier) ==========
  {
    id: 'tengkulak_100',
    name: '💼 Mitra Tengkulak',
    desc: 'Jual 100 butir ke tengkulak.',
    category: 'Penjualan Tengkulak',
    tier: 1,
    icon: '🤝',
    label: '100 Butir',
    check: (S) => (S.stats.tengkulak || 0) >= 100,
    buff: { type: 'tengkulak_price_bonus', value: 0.01, desc: '+1% harga jual ke tengkulak' }
  },
  {
    id: 'tengkulak_500',
    name: '💼 Partner Tengkulak',
    desc: 'Jual 500 butir ke tengkulak.',
    category: 'Penjualan Tengkulak',
    tier: 1,
    icon: '',
    label: '500 Butir',
    check: (S) => (S.stats.tengkulak || 0) >= 500,
    buff: { type: 'tengkulak_price_bonus', value: 0.02, desc: '+2% harga jual ke tengkulak' }
  },
  {
    id: 'tengkulak_1000',
    name: '💼 Juragan Tengkulak',
    desc: 'Jual 1.000 butir ke tengkulak.',
    category: 'Penjualan Tengkulak',
    tier: 2,
    icon: '',
    label: '1.000 Butir',
    check: (S) => (S.stats.tengkulak || 0) >= 1000,
    buff: { type: 'tengkulak_price_bonus', value: 0.03, desc: '+3% harga jual ke tengkulak' }
  },
  {
    id: 'tengkulak_5000',
    name: ' Raja Tengkulak',
    desc: 'Jual 5.000 butir ke tengkulak.',
    category: 'Penjualan Tengkulak',
    tier: 3,
    icon: '',
    label: '5.000 Butir',
    check: (S) => (S.stats.tengkulak || 0) >= 5000,
    buff: { type: 'tengkulak_price_bonus', value: 0.05, desc: '+5% harga jual ke tengkulak' }
  },
  {
    id: 'tengkulak_10000',
    name: '💼 Legenda Tengkulak',
    desc: 'Jual 10.000 butir ke tengkulak.',
    category: 'Penjualan Tengkulak',
    tier: 4,
    icon: '🏆',
    label: '10.000 Butir',
    check: (S) => (S.stats.tengkulak || 0) >= 10000,
    buff: { type: 'tengkulak_price_bonus', value: 0.07, desc: '+7% harga jual ke tengkulak' }
  },
  {
    id: 'tengkulak_25000',
    name: '💼 Dewa Tengkulak',
    desc: 'Jual 25.000 butir ke tengkulak.',
    category: 'Penjualan Tengkulak',
    tier: 4,
    icon: '⚡',
    label: '25.000 Butir',
    check: (S) => (S.stats.tengkulak || 0) >= 25000,
    buff: { type: 'tengkulak_price_bonus', value: 0.10, desc: '+10% harga jual ke tengkulak' }
  },
  
  // ========== KEBUN KELAPA (6 Tier) ==========
  {
    id: 'trees_20',
    name: '🌳 Kebun Kecil',
    desc: 'Miliki 20 pohon kelapa.',
    category: 'Kebun Kelapa',
    tier: 1,
    icon: '🌱',
    label: '20 Pohon',
    check: (S) => S.trees.length >= 20,
    buff: { type: 'yield_bonus', value: 0.01, desc: '+1% hasil panen semua pohon' }
  },
  {
    id: 'trees_50',
    name: '🌳 Kebun Menengah',
    desc: 'Miliki 50 pohon kelapa.',
    category: 'Kebun Kelapa',
    tier: 2,
    icon: '🌴',
    label: '50 Pohon',
    check: (S) => S.trees.length >= 50,
    buff: { type: 'yield_bonus', value: 0.02, desc: '+2% hasil panen semua pohon' }
  },
  {
    id: 'trees_100',
    name: '🌳 Kebun Besar',
    desc: 'Miliki 100 pohon kelapa.',
    category: 'Kebun Kelapa',
    tier: 2,
    icon: '🌴',
    label: '100 Pohon',
    check: (S) => S.trees.length >= 100,
    buff: { type: 'yield_bonus', value: 0.03, desc: '+3% hasil panen semua pohon' }
  },
  {
    id: 'trees_200',
    name: ' Plantation Owner',
    desc: 'Miliki 200 pohon kelapa.',
    category: 'Kebun Kelapa',
    tier: 3,
    icon: '🏭',
    label: '200 Pohon',
    check: (S) => S.trees.length >= 200,
    buff: { type: 'yield_bonus', value: 0.05, desc: '+5% hasil panen semua pohon' }
  },
  {
    id: 'trees_500',
    name: ' Plantation King',
    desc: 'Miliki 500 pohon kelapa.',
    category: 'Kebun Kelapa',
    tier: 4,
    icon: '👑',
    label: '500 Pohon',
    check: (S) => S.trees.length >= 500,
    buff: { type: 'yield_bonus', value: 0.08, desc: '+8% hasil panen semua pohon' }
  },
  {
    id: 'trees_1000',
    name: ' Plantation Emperor',
    desc: 'Miliki 1.000 pohon kelapa.',
    category: 'Kebun Kelapa',
    tier: 4,
    icon: '⚡',
    label: '1.000 Pohon',
    check: (S) => S.trees.length >= 1000,
    buff: { type: 'yield_bonus', value: 0.10, desc: '+10% hasil panen semua pohon' }
  },
  
  // ========== KETAHANAN (4 Tier) ==========
  {
    id: 'survive_30',
    name: '📅 Survivor 30 Hari',
    desc: 'Bertahan 30 hari tanpa bangkrut.',
    category: 'Ketahanan',
    tier: 1,
    icon: '🛡️',
    label: '30 Hari',
    check: (S) => S.day >= 30 && S.gold > 0,
    buff: { type: 'loss_reduction', value: 0.02, desc: '-2% kerugian dari kelapa busuk' }
  },
  {
    id: 'survive_90',
    name: ' Survivor 3 Bulan',
    desc: 'Bertahan 90 hari (1 kuartal).',
    category: 'Ketahanan',
    tier: 2,
    icon: '️',
    label: '90 Hari',
    check: (S) => S.day >= 90 && S.gold > 0,
    buff: { type: 'loss_reduction', value: 0.04, desc: '-4% kerugian dari kelapa busuk' }
  },
  {
    id: 'survive_180',
    name: '📅 Survivor 6 Bulan',
    desc: 'Bertahan 180 hari.',
    category: 'Ketahanan',
    tier: 3,
    icon: '🏅',
    label: '180 Hari',
    check: (S) => S.day >= 180 && S.gold > 0,
    buff: { type: 'loss_reduction', value: 0.07, desc: '-7% kerugian dari kelapa busuk' }
  },
  {
    id: 'survive_365',
    name: '📅 Survivor 1 Tahun',
    desc: 'Bertahan 365 hari (1 tahun penuh).',
    category: 'Ketahanan',
    tier: 4,
    icon: '🎖️',
    label: '365 Hari',
    check: (S) => S.day >= 365 && S.gold > 0,
    buff: { type: 'loss_reduction', value: 0.10, desc: '-10% kerugian dari kelapa busuk' }
  },
  
  // ========== KEKAYAAN (5 Tier) ==========
  {
    id: 'wealth_10m',
    name: '💰 Jutaan Pertama',
    desc: 'Kumpulkan Rp 10.000.000 di kas.',
    category: 'Kekayaan',
    tier: 1,
    icon: '💵',
    label: 'Rp 10 Juta',
    check: (S) => S.gold >= 10000000,
    buff: { type: 'discount_rate', value: 0.01, desc: '-1% harga beli kebutuhan' }
  },
  {
    id: 'wealth_100m',
    name: '💰 Puluh Juta',
    desc: 'Kumpulkan Rp 100.000.000 di kas.',
    category: 'Kekayaan',
    tier: 2,
    icon: '',
    label: 'Rp 100 Juta',
    check: (S) => S.gold >= 100000000,
    buff: { type: 'discount_rate', value: 0.02, desc: '-2% harga beli kebutuhan' }
  },
  {
    id: 'wealth_500m',
    name: ' Ratus Juta',
    desc: 'Kumpulkan Rp 500.000.000 di kas.',
    category: 'Kekayaan',
    tier: 3,
    icon: '🤑',
    label: 'Rp 500 Juta',
    check: (S) => S.gold >= 500000000,
    buff: { type: 'discount_rate', value: 0.04, desc: '-4% harga beli kebutuhan' }
  },
  {
    id: 'wealth_1b',
    name: '💰 Miliarder',
    desc: 'Kumpulkan Rp 1.000.000.000 di kas.',
    category: 'Kekayaan',
    tier: 4,
    icon: '👑',
    label: 'Rp 1 Milyar',
    check: (S) => S.gold >= 1000000000,
    buff: { type: 'discount_rate', value: 0.06, desc: '-6% harga beli kebutuhan' }
  },
  {
    id: 'wealth_10b',
    name: '💰 Multi-Miliarder',
    desc: 'Kumpulkan Rp 10.000.000.000 di kas.',
    category: 'Kekayaan',
    tier: 4,
    icon: '',
    label: 'Rp 10 Milyar',
    check: (S) => S.gold >= 10000000000,
    buff: { type: 'discount_rate', value: 0.10, desc: '-10% harga beli kebutuhan' }
  }
];

// HITUNG BUFF ACHIEVEMENT (TIDAK STACK - AMBIL YANG TERBESAR)
function calculateAchievementBuffs() {
  const buffs = {
    profit_multiplier: 0,
    tengkulak_price_bonus: 0,
    yield_bonus: 0,
    loss_reduction: 0,
    discount_rate: 0
  };
  
  if (!S.unlockedAchievements) return buffs;
  
  // Untuk setiap tipe buff, ambil yang TERBESAR (tidak stack)
  ACHIEVEMENTS.forEach(ach => {
    if (S.unlockedAchievements.includes(ach.id) && ach.buff) {
      const type = ach.buff.type;
      if (ach.buff.value > buffs[type]) {
        buffs[type] = Math.min(0.05, ach.buff.value);
      }
    }
  });
  
  return buffs;
}

// HITUNG BUFF IKLAN (SEMENTARA)
function calculateAdBuffs() {
  if (!S.adBuffs) S.adBuffs = {
    discount_rate: 0,
    yield_bonus: 0,
    profit_multiplier: 0,
    loss_reduction: 0,
    videosWatched: 0
  };
  return S.adBuffs;
}

// HITUNG TOTAL BUFF (Achievement + Iklan + Premium)
function calculateTotalBuffs() {
  const achievementBuffs = calculateAchievementBuffs();
  const adBuffs = calculateAdBuffs();
  const premiumBuffs = S.premiumBuffs || { profit_multiplier: 0, yield_bonus: 0, loss_reduction: 0, discount_rate: 0 };
  
  return {
    profit_multiplier: Math.min(0.50, achievementBuffs.profit_multiplier + adBuffs.profit_multiplier + premiumBuffs.profit_multiplier),
    tengkulak_price_bonus: Math.min(0.50, achievementBuffs.tengkulak_price_bonus + adBuffs.tengkulak_price_bonus + premiumBuffs.tengkulak_price_bonus),
    yield_bonus: Math.min(0.50, achievementBuffs.yield_bonus + adBuffs.yield_bonus + premiumBuffs.yield_bonus),
    loss_reduction: Math.min(0.50, achievementBuffs.loss_reduction + adBuffs.loss_reduction + premiumBuffs.loss_reduction),
    discount_rate: Math.min(0.50, achievementBuffs.discount_rate + adBuffs.discount_rate + premiumBuffs.discount_rate)
  };
}

// TERAPKAN BUFF KE TRANSAKSI
function applyBuffToProfit(amount) {
  const buffs = calculateTotalBuffs();
  return amount * (1 + buffs.profit_multiplier);
}

function applyBuffToTengkulakPrice(price) {
  const buffs = calculateTotalBuffs();
  return price * (1 + buffs.tengkulak_price_bonus);
}

function applyBuffToYield(amount) {
  const buffs = calculateTotalBuffs();
  return amount * (1 + buffs.yield_bonus);
}

function applyBuffToLossReduction(lossAmount) {
  const buffs = calculateTotalBuffs();
  return lossAmount * (1 - buffs.loss_reduction);
}

function applyBuffToDiscount(price) {
  const buffs = calculateTotalBuffs();
  return price * (1 - buffs.discount_rate);
}

// SISTEM IKLAN BUFF
function watchAd(buffType) {
  if (!S.adBuffs) S.adBuffs = { discount_rate: 0, yield_bonus: 0, profit_multiplier: 0, loss_reduction: 0, videosWatched: 0 };
  
  const maxAds = 5;
  const currentAds = S.adBuffs[buffType + '_ads'] || 0;
  
  if (currentAds >= maxAds) {
    msg('⚠️ Maksimal 5 iklan untuk buff ini hari ini!');
    return false;
  }
  
  // Simulasi nonton iklan (nanti integrasi dengan AdMob/AdSense)
  S.adBuffs[buffType + '_ads'] = currentAds + 1;
  S.adBuffs.videosWatched++;
  
  const increment = 0.10; // +10% per iklan
  S.adBuffs[buffType] = Math.min(0.50, (S.adBuffs[buffType] || 0) + increment);
  
  save();
  return true;
}

function resetDailyAdBuffs() {
  if (!S.adBuffs) return;
  S.adBuffs = { discount_rate: 0, yield_bonus: 0, profit_multiplier: 0, loss_reduction: 0, videosWatched: S.adBuffs.videosWatched || 0 };
  save();
}

function checkAllAchievements() {
  if (!S.unlockedAchievements) S.unlockedAchievements = [];
  let newUnlocks = [];
  
  ACHIEVEMENTS.forEach(ach => {
    if (!S.unlockedAchievements.includes(ach.id)) {
      try {
        if (ach.check(S)) {
          S.unlockedAchievements.push(ach.id);
          newUnlocks.push(ach);
        }
      } catch (e) {
        console.error('Achievement check error:', ach.id, e);
      }
    }
  });
  
  if (newUnlocks.length > 0) {
    save();
    newUnlocks.forEach(ach => {
      showAchievementNotification(ach);
    });
  }
}

function showAchievementNotification(ach) {
  const tierColors = {
    1: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    2: 'linear-gradient(135deg, #2196F3, #03A9F4)',
    3: 'linear-gradient(135deg, #FF9800, #FFC107)',
    4: 'linear-gradient(135deg, #FFD700, #FFA500)'
  };
  
  const notif = document.createElement('div');
  notif.className = 'achievement-notif';
  notif.style.background = tierColors[ach.tier] || tierColors[1];
  notif.innerHTML = `
    <div class="notif-content">
      <div class="notif-icon">${ach.icon}</div>
      <div class="notif-text">
        <div class="notif-title">Tier ${ach.tier} Achievement Unlocked!</div>
        <div class="notif-name">${ach.name}</div>
        <div class="notif-buff" style="font-size:0.85em;margin-top:4px;color:#fff"> Buff: ${ach.buff.desc}</div>
      </div>
    </div>
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add('show'), 100);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 500);
  }, 5000);
}

function getAchievementsByCategory() {
  const categories = {};
  ACHIEVEMENTS.forEach(ach => {
    if (!categories[ach.category]) categories[ach.category] = [];
    const unlocked = S.unlockedAchievements && S.unlockedAchievements.includes(ach.id);
    categories[ach.category].push({ ...ach, unlocked });
  });
  return categories;
}

function getAchievementProgress() {
  const total = ACHIEVEMENTS.length;
  const unlocked = S.unlockedAchievements ? S.unlockedAchievements.length : 0;
  return { total, unlocked, percentage: Math.round((unlocked / total) * 100) };
}

function getTierProgress() {
  const tiers = {1: {total: 0, unlocked: 0}, 2: {total: 0, unlocked: 0}, 3: {total: 0, unlocked: 0}, 4: {total: 0, unlocked: 0}};
  ACHIEVEMENTS.forEach(ach => {
    tiers[ach.tier].total++;
    if (S.unlockedAchievements && S.unlockedAchievements.includes(ach.id)) {
      tiers[ach.tier].unlocked++;
    }
  });
  return tiers;
}

function getActiveBuffsDisplay() {
  const achievementBuffs = calculateAchievementBuffs();
  const adBuffs = calculateAdBuffs();
  const premiumBuffs = S.premiumBuffs || { profit_multiplier: 0, yield_bonus: 0, loss_reduction: 0, discount_rate: 0 };
  
  const activeBuffs = [];
  
  if (achievementBuffs.profit_multiplier > 0) activeBuffs.push({icon: '🏆', text: `+${(achievementBuffs.profit_multiplier * 100).toFixed(1)}% profit (Achievement)`, type: 'achievement'});
  if (adBuffs.profit_multiplier > 0) activeBuffs.push({icon: '📺', text: `+${(adBuffs.profit_multiplier * 100).toFixed(1)}% profit (Iklan)`, type: 'ad'});
  if (premiumBuffs.profit_multiplier > 0) activeBuffs.push({icon: '💎', text: `+${(premiumBuffs.profit_multiplier * 100).toFixed(1)}% profit (Premium)`, type: 'premium'});
  
  if (achievementBuffs.yield_bonus > 0) activeBuffs.push({icon: '🏆', text: `+${(achievementBuffs.yield_bonus * 100).toFixed(1)}% hasil panen (Achievement)`, type: 'achievement'});
  if (adBuffs.yield_bonus > 0) activeBuffs.push({icon: '', text: `+${(adBuffs.yield_bonus * 100).toFixed(1)}% hasil panen (Iklan)`, type: 'ad'});
  
  if (achievementBuffs.loss_reduction > 0) activeBuffs.push({icon: '🏆', text: `-${(achievementBuffs.loss_reduction * 100).toFixed(1)}% kerugian (Achievement)`, type: 'achievement'});
  if (adBuffs.loss_reduction > 0) activeBuffs.push({icon: '', text: `-${(adBuffs.loss_reduction * 100).toFixed(1)}% kerugian (Iklan)`, type: 'ad'});
  
  if (achievementBuffs.discount_rate > 0) activeBuffs.push({icon: '🏆', text: `-${(achievementBuffs.discount_rate * 100).toFixed(1)}% harga beli (Achievement)`, type: 'achievement'});
  if (adBuffs.discount_rate > 0) activeBuffs.push({icon: '📺', text: `-${(adBuffs.discount_rate * 100).toFixed(1)}% harga beli (Iklan)`, type: 'ad'});
  
  return activeBuffs;
}

// ===== PATCH: SISTEM ACHIEVEMENT IKLAN YANG BENAR =====
// Achievement iklan TETAP TERCATAT di profil (tidak hilang)
// TAPI buff-nya RESET TOTAL setiap 3 bulan
// Pemain harus nonton ulang dari awal untuk dapat buff lagi

// Inisialisasi tracking iklan per season (dipanggil saat load game)
function initAdSeasonTracking() {
  if (!S.adSeason) {
    S.adSeason = {
      startDate: Date.now(),
      adsWatchedThisSeason: 0,
      activeBuffs: { discount_rate: 0 }
    };
    save();
  }
  
  // Cek apakah sudah 3 bulan (90 hari)
  const threeMonths = 90 * 24 * 60 * 60 * 1000;
  const seasonAge = Date.now() - S.adSeason.startDate;
  
  if (seasonAge > threeMonths) {
    // RESET TOTAL buff iklan, tapi achievement tetap tercatat
    S.adSeason = {
      startDate: Date.now(),
      adsWatchedThisSeason: 0,
      activeBuffs: { discount_rate: 0 }
    };
    save();
    console.log('🔄 Season iklan direset! Buff iklan = 0. Mulai nonton dari awal.');
  }
}

// Hitung buff achievement iklan berdasarkan adsWatchedThisSeason
function calculateAdAchievementBuffs() {
  initAdSeasonTracking();
  
  const adsWatched = S.adSeason.adsWatchedThisSeason || 0;
  const buffs = { discount_rate: 0 };
  
  // Milestone: 10, 50, 100, 500, 1000, 2500 video
  if (adsWatched >= 2500) buffs.discount_rate = 0.25;
  else if (adsWatched >= 1000) buffs.discount_rate = 0.15;
  else if (adsWatched >= 500) buffs.discount_rate = 0.10;
  else if (adsWatched >= 100) buffs.discount_rate = 0.05;
  else if (adsWatched >= 50) buffs.discount_rate = 0.03;
  else if (adsWatched >= 10) buffs.discount_rate = 0.01;
  
  return buffs;
}

// Track iklan yang ditonton (dipanggil setiap kali pemain nonton iklan)
function trackAdWatchedForSeason() {
  initAdSeasonTracking();
  S.adSeason.adsWatchedThisSeason = (S.adSeason.adsWatchedThisSeason || 0) + 1;
  
  // Update total lifetime ads (untuk achievement permanen di profil)
  if (!S.totalAdsWatched) S.totalAdsWatched = 0;
  S.totalAdsWatched++;
  
  save();
  
  // Cek apakah ada achievement iklan baru yang unlock (untuk badge profil)
  checkAllAchievements();
}

// Override calculateTotalBuffs untuk pakai adSeason
const _originalCalculateTotalBuffs = calculateTotalBuffs;
calculateTotalBuffs = function() {
  const achievementBuffs = calculateAchievementBuffs();
  const adAchievementBuffs = calculateAdAchievementBuffs(); // PAKAI YANG BARU
  const premiumBuffs = S.premiumBuffs || { profit_multiplier: 0, yield_bonus: 0, loss_reduction: 0, discount_rate: 0 };
  const activeAdBuffs = S.activeAdBuffs || { profit_multiplier: 0, yield_bonus: 0, loss_reduction: 0, discount_rate: 0 };
  
  return {
    profit_multiplier: Math.min(0.50, achievementBuffs.profit_multiplier + premiumBuffs.profit_multiplier + activeAdBuffs.profit_multiplier),
    tengkulak_price_bonus: Math.min(0.50, achievementBuffs.tengkulak_price_bonus + premiumBuffs.tengkulak_price_bonus + activeAdBuffs.tengkulak_price_bonus),
    yield_bonus: Math.min(0.50, achievementBuffs.yield_bonus + premiumBuffs.yield_bonus + activeAdBuffs.yield_bonus),
    loss_reduction: Math.min(0.50, achievementBuffs.loss_reduction + premiumBuffs.loss_reduction + activeAdBuffs.loss_reduction),
    discount_rate: Math.min(0.50, achievementBuffs.discount_rate + adAchievementBuffs.discount_rate + premiumBuffs.discount_rate + activeAdBuffs.discount_rate)
  };
};

// Panggil init saat load
if (typeof loadSaved !== 'undefined') {
  const _originalLoadSaved = loadSaved;
  loadSaved = function() {
    _originalLoadSaved();
    initAdSeasonTracking();
  };
}
