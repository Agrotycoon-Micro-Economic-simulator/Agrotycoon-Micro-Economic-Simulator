const SAVE_KEY = 'agrotycoon_save_v1';
let gameState = { gold: 5000000, kelapa: 0, hari: 1, sudahBelajar: false, sudahPanen: false, bulan: 0 };
const DATA = { pohon: 10, hasilPerPohon: 20, biayaKuliPerButir: 500, hargaTengkulak: 3500, biayaHidupBulanan: 1364500, hppEsKelapaPerGelas: 1525, hargaJualEsKelapa: 5000, yieldPerButir: 4 };

function simpan() { localStorage.setItem(SAVE_KEY, JSON.stringify(gameState)); }
function muat() { const s = localStorage.getItem(SAVE_KEY); if (s) { try { gameState = Object.assign(gameState, JSON.parse(s)); } catch (e) {} } }
function rp(n) { return n.toLocaleString('id-ID'); }

function updateUI() {
    document.getElementById('gold').textContent = rp(gameState.gold);
    document.getElementById('kelapa').textContent = rp(gameState.kelapa);
    document.getElementById('hari').textContent = gameState.hari;
    document.getElementById('btn-panen').disabled = !gameState.sudahBelajar || gameState.sudahPanen;
    document.getElementById('btn-jual').disabled = gameState.kelapa <= 0;
}
function bukaModulBelajar() { document.getElementById('modal-belajar').style.display = 'block'; }
function selesaiBelajar() {
    gameState.sudahBelajar = true;
    document.getElementById('modal-belajar').style.display = 'none';
    document.getElementById('mentor-text').innerHTML = '🤖 AI Mentor: "Bagus! Sekarang Anda paham perangkap tengkulak. Silakan panen 200 butir kelapa Anda."';
    tampilkanPesan('✅ Modul pembelajaran selesai! Tombol Panen aktif.');
    simpan(); updateUI();
}
function panenKelapa() {
    if (!gameState.sudahBelajar || gameState.sudahPanen) return;
    const totalPanen = DATA.pohon * DATA.hasilPerPohon;
    const biayaPanen = totalPanen * DATA.biayaKuliPerButir;
    gameState.kelapa += totalPanen;
    gameState.gold -= biayaPanen;
    gameState.sudahPanen = true;
    simpan(); updateUI();
    tampilkanPesan(`🌾 Panen ${totalPanen} butir. Upah kuli Rp ${rp(biayaPanen)} sudah dibayar.`);
}
function bukaMenuJual() {
    if (gameState.kelapa <= 0) return;
    const brutoTengkulak = gameState.kelapa * DATA.hargaTengkulak;
    const totalGelas = gameState.kelapa * DATA.yieldPerButir;
    const totalHpp = totalGelas * DATA.hppEsKelapaPerGelas;
    const pendapatanEs = totalGelas * DATA.hargaJualEsKelapa;
    const profitEs = pendapatanEs - totalHpp;
    const biayaPanen = gameState.kelapa * DATA.biayaKuliPerButir;
    const netTengkulak = brutoTengkulak - biayaPanen - DATA.biayaHidupBulanan;
    const netEs = profitEs - biayaPanen - DATA.biayaHidupBulanan;

    const pilihan = confirm(
        `PILIHAN STRATEGIS (Bulan ke-${gameState.bulan + 1}):\n\n` +
        `A) Jual ke Tengkulak:\n   Bruto: Rp ${rp(brutoTengkulak)} (kuli sudah dibayar saat panen)\n` +
        `   Net setelah biaya hidup Rp ${rp(DATA.biayaHidupBulanan)}: Rp ${rp(netTengkulak)} → DEFISIT!\n\n` +
        `B) Olah Jadi Es Kelapa (${totalGelas} gelas):\n   Omzet: Rp ${rp(pendapatanEs)} | HPP: Rp ${rp(totalHpp)}\n` +
        `   Net setelah biaya hidup: Rp ${rp(netEs)} → SURPLUS!\n\n` +
        `Klik OK = Opsi B (Es Kelapa). Klik Batal = Opsi A (Tengkulak).`
    );

    let tambah = 0;
    if (pilihan) {
        tambah = profitEs;
        gameState.gold += tambah;
    } else {
        tambah = brutoTengkulak;
        gameState.gold += tambah;
    }
    gameState.kelapa = 0;
    gameState.hari += 30;
    gameState.bulan += 1;
    gameState.gold -= DATA.biayaHidupBulanan;
    gameState.sudahPanen = false;
    const net = tambah - biayaPanen - DATA.biayaHidupBulanan;
    simpan(); updateUI();
    tampilkanPesan(`${pilihan ? '🍹 Es kelapa terjual!' : '📉 Jual ke tengkulak.'} Cashflow bulan ${gameState.bulan}: ${net >= 0 ? 'SURPLUS' : 'DEFISIT'} Rp ${rp(Math.abs(net))}. Saldo Gold: Rp ${rp(gameState.gold)}.`);
}
function tampilkanPesan(teks) {
    const m = document.getElementById('message-area');
    m.textContent = teks; m.style.display = 'block';
    setTimeout(() => { m.style.display = 'none'; }, 10000);
}
function resetSave() { if (confirm('Hapus seluruh save dan mulai dari awal?')) { localStorage.removeItem(SAVE_KEY); location.reload(); } }

muat();
updateUI();
const footer = document.querySelector('footer');
if (footer) { const b = document.createElement('button'); b.className = 'btn btn-warning'; b.style.marginTop = '10px'; b.textContent = '🔄 Reset Save'; b.onclick = resetSave; footer.appendChild(b); }
