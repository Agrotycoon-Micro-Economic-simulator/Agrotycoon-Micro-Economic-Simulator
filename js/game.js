let gameState = {
    gold: 5000000,
    kelapa: 0,
    hari: 1,
    sudahBelajar: false,
    sudahPanen: false
};

const DATA = {
    pohon: 10,
    hasilPerPohon: 20,
    biayaKuliPerButir: 500,
    hargaTengkulak: 3500,
    biayaHidupBulanan: 1364500,
    hppEsKelapaPerGelas: 1525,
    hargaJualEsKelapa: 5000,
    yieldPerButir: 4
};

function updateUI() {
    document.getElementById('gold').textContent = gameState.gold.toLocaleString('id-ID');
    document.getElementById('kelapa').textContent = gameState.kelapa;
    document.getElementById('hari').textContent = gameState.hari;
}

function bukaModulBelajar() {
    document.getElementById('modal-belajar').style.display = 'block';
}

function selesaiBelajar() {
    gameState.sudahBelajar = true;
    document.getElementById('modal-belajar').style.display = 'none';
    document.getElementById('btn-panen').disabled = false;
    document.getElementById('mentor-text').innerHTML = '🤖 AI Mentor: "Bagus! Sekarang Anda paham perangkap tengkulak. Silakan panen 200 butir kelapa Anda."';
    tampilkanPesan("✅ Modul pembelajaran selesai! Tombol Panen aktif.");
}

function panenKelapa() {
    if (!gameState.sudahBelajar) return;
    if (gameState.sudahPanen) {
        tampilkanPesan("⚠️ Anda sudah panen bulan ini. Tunggu siklus berikutnya.");
        return;
    }
    const totalPanen = DATA.pohon * DATA.hasilPerPohon;
    const biayaPanen = totalPanen * DATA.biayaKuliPerButir;
    
    gameState.kelapa = totalPanen;
    gameState.gold -= biayaPanen;
    gameState.sudahPanen = true;
    
    updateUI();
    document.getElementById('btn-jual').disabled = false;
    document.getElementById('btn-panen').disabled = true;
    tampilkanPesan(`🌾 Panen berhasil! Mendapat ${totalPanen} butir. Biaya kuli Rp ${biayaPanen.toLocaleString('id-ID')} telah dipotong.`);
}

function bukaMenuJual() {
    if (gameState.kelapa === 0) return;
    const bersihTengkulak = (gameState.kelapa * DATA.hargaTengkulak) - (gameState.kelapa * DATA.biayaKuliPerButir);
    const totalGelas = gameState.kelapa * DATA.yieldPerButir;
    const totalHpp = totalGelas * DATA.hppEsKelapaPerGelas;
    const totalPendapatanEs = totalGelas * DATA.hargaJualEsKelapa;
    const profitEs = totalPendapatanEs - totalHpp;

    const pilihan = confirm(
        `PILIHAN STRATEGIS:\n\n` +
        `A) Jual ke Tengkulak:\n` +
        `   Bersih (setelah kuli): Rp ${bersihTengkulak.toLocaleString('id-ID')}\n` +
        `   ⚠️ PERINGATAN: Ini TIDAK CUKUP untuk biaya hidup Rp ${DATA.biayaHidupBulanan.toLocaleString('id-ID')}!\n\n` +
        `B) Olah Jadi Es Kelapa (Rekomendasi):\n` +
        `   Total Gelas: ${totalGelas} gelas\n` +
        `   Total HPP: Rp ${totalHpp.toLocaleString('id-ID')}\n` +
        `   ✅ PROFIT BERSIH: Rp ${profitEs.toLocaleString('id-ID')}\n\n` +
        `Klik OK untuk Opsi B (Es Kelapa).\nKlik Batal untuk Opsi A (Tengkulak).`
    );

    if (pilihan) {
        gameState.gold += profitEs;
        tampilkanPesan(`🍹 Luar biasa! Profit Rp ${profitEs.toLocaleString('id-ID')} masuk ke kas. Anda selamat dari defisit!`);
    } else {
        gameState.gold += bersihTengkulak;
        tampilkanPesan(`📉 Anda memilih jual ke tengkulak. Pendapatan bersih hanya Rp ${bersihTengkulak.toLocaleString('id-ID')}. Anda DEFISIT!`);
    }

    gameState.kelapa = 0;
    gameState.hari += 30;
    gameState.sudahPanen = false;
    document.getElementById('btn-panen').disabled = false;
    document.getElementById('btn-jual').disabled = true;
    updateUI();
}

function tampilkanPesan(teks) {
    const msgArea = document.getElementById('message-area');
    msgArea.textContent = teks;
    msgArea.style.display = 'block';
    setTimeout(() => { msgArea.style.display = 'none'; }, 8000);
}

updateUI();
