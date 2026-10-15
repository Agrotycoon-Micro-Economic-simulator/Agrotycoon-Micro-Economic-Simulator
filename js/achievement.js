const ACHIEVEMENTS = [
  // KATEGORI: PEMULA (Tutorial)
  {
    id: 'first_harvest',
    name: '🌾 Panen Perdana',
    desc: 'Panen kelapa pertama dari lahan warisan kakek.',
    category: 'Pemula',
    icon: '🌴',
    check: (S) => S.stats.es + S.stats.whole + S.stats.tengkulak > 0 || S.day > 1
  },
  {
    id: 'first_sale',
    name: '💰 Transaksi Pertama',
    desc: 'Lakukan penjualan pertama (es, utuh, atau tengkulak).',
    category: 'Pemula',
    icon: '🤝',
    check: (S) => (S.reports && S.reports.length > 0 && S.reports[0].gross > 0)
  },
  {
    id: 'open_warung',
    name: '🏪 Pembuka Warung',
    desc: 'Buka warung es kelapa pertama.',
    category: 'Pemula',
    icon: '',
    check: (S) => S.warung && S.warung.open
  },
  {
    id: 'buy_fridge',
    name: '❄️ Modernisasi',
    desc: 'Beli kulkas untuk menyimpan es.',
    category: 'Pemula',
    icon: '❄️',
    check: (S) => S.warung && S.warung.fridge
  },
  
  // KATEGORI: PEDAGANG (Trading)
  {
    id: 'sell_100_es',
    name: '🍹 Juragan Es',
    desc: 'Jual 100 gelas es kelapa.',
    category: 'Pedagang',
    icon: '🍹',
    check: (S) => (S.stats.es || 0) >= 100
  },
  {
    id: 'sell_500_es',
    name: '🍹 Raja Es Kelapa',
    desc: 'Jual 500 gelas es kelapa.',
    category: 'Pedagang',
    icon: '👑',
    check: (S) => (S.stats.es || 0) >= 500
  },
  {
    id: 'sell_tengkulak_500',
    name: '💼 Mitra Tengkulak',
    desc: 'Jual 500 butir ke tengkulak.',
    category: 'Pedagang',
    icon: '',
    check: (S) => (S.stats.tengkulak || 0) >= 500
  },
  {
    id: 'arbitrase',
    name: '🔄 Master Arbitrase',
    desc: 'Beli kelapa dari luar dan jual kembali dengan profit.',
    category: 'Pedagang',
    icon: '',
    check: (S) => S.ledger.some(l => l.cat === 'BELANJA' && l.desc.includes('dari'))
  },
  
  // KATEGORI: PETANI (Farming)
  {
    id: 'plant_super',
    name: '🌱 Petani Modern',
    desc: 'Tanam bibit kelapa super pertama.',
    category: 'Petani',
    icon: '🌱',
    check: (S) => S.trees.some(t => t.type === 'super')
  },
  {
    id: 'plant_20',
    name: '🌴 Kebun Luas',
    desc: 'Miliki 20 pohon kelapa (biasa + super).',
    category: 'Petani',
    icon: '🌳',
    check: (S) => S.trees.length >= 20
  },
  {
    id: 'avoid_rotten',
    name: '️ Zero Waste',
    desc: 'Selesaikan 30 hari tanpa ada kelapa busuk.',
    category: 'Petani',
    icon: '🎯',
    check: (S) => (S.stats.rotten || 0) === 0 && S.day >= 30
  },
  
  // KATEGORI: PENGUSAHA (Business)
  {
    id: 'survive_30',
    name: '📅 Survivor 30 Hari',
    desc: 'Bertahan 30 hari tanpa bangkrut.',
    category: 'Pengusaha',
    icon: '️',
    check: (S) => S.day >= 30 && S.gold > 0
  },
  {
    id: 'survive_90',
    name: '📅 Veteran 90 Hari',
    desc: 'Bertahan 90 hari (1 kuartal).',
    category: 'Pengusaha',
    icon: '',
    check: (S) => S.day >= 90 && S.gold > 0
  },
  {
    id: 'profit_day',
    name: '📈 Hari Profitable',
    desc: 'Raih profit bersih > Rp 500.000 dalam 1 hari.',
    category: 'Pengusaha',
    icon: '💹',
    check: (S) => S.reports && S.reports.some(r => r.net > 500000)
  },
  {
    id: 'level_3',
    name: '⭐ Naik Level 3',
    desc: 'Capai level Juragan Kecil.',
    category: 'Pengusaha',
    icon: '⭐',
    check: (S) => S.level >= 3
  }
];

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
    // Tampilkan notifikasi achievement baru
    newUnlocks.forEach(ach => {
      showAchievementNotification(ach);
    });
  }
}

function showAchievementNotification(ach) {
  const notif = document.createElement('div');
  notif.className = 'achievement-notif';
  notif.innerHTML = `
    <div class="notif-content">
      <div class="notif-icon">${ach.icon}</div>
      <div class="notif-text">
        <div class="notif-title">Achievement Unlocked!</div>
        <div class="notif-name">${ach.name}</div>
      </div>
    </div>
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add('show'), 100);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 500);
  }, 4000);
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
