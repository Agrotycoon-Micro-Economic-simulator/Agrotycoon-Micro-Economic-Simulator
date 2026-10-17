function accEscape(value){
 return String(value===undefined||value===null?'':value).replace(/[&<>\"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[ch];});
}

loadSaved();
const accDiv = document.getElementById('acc');
let h='';

if(!S || S.ledger.length === 0){
 h='<div class="panel"><p>Belum ada data sesi ini. Mainkan dulu di index.html.</p></div>';
}else{
 const curMonth=monthOf(S.day);
 const monthReports=S.reports.filter(r=>monthOf(r.day)===curMonth);
 const monthGross=monthReports.reduce((a,r)=>a+r.gross,0);
 const monthExpense=monthReports.reduce((a,r)=>a+r.expense,0);
 
 // HITUNG ASET
 const stockValue = stockQty() * 3500;
 const bahanWarung = ((S.warung.ice||0)*500) + ((S.warung.sugar||0)*400) + ((S.warung.cups||0)*400);
 const pohonMuda = S.trees.filter(t => !(t.mature || S.day >= t.plantedDay + DATA.matureDays)).length;
 const nilaiAsetBiologis = pohonMuda * 60000;
 const kulkasValue = S.warung.fridge ? 2000000 : 0;
 // Aset Tetap Warung (estimasi penyusutan sederhana: 50% dari CAPEX)
 const capexTotal = S.ledger.filter(l=>l.cat==='CAPEX' && l.desc.includes('Paket')).reduce((a,l)=>a+Math.abs(l.amt),0);
 const nilaiAsetTetapWarung = Math.floor(capexTotal * 0.5); 
 
 const purchasedLandBook = ((S.landSystem&&S.landSystem.lands)||[]).filter(l=>l.id!=="warisan-2430").reduce((sum,l)=>sum+Math.max(0,Number(l.purchaseCost)||0)+Math.max(0,Number(l.improvements)||0),0);
 const totalAsetLancar = S.gold + stockValue + bahanWarung;
 const totalAsetTetap = nilaiAsetBiologis + kulkasValue + nilaiAsetTetapWarung + 250000000 + purchasedLandBook; // lahan warisan Rp250jt adalah asumsi narasi game
 const totalAset = totalAsetLancar + totalAsetTetap;
 const finance = S.finance || {};
 const loanLiabilities = (Array.isArray(finance.loans)?finance.loans:[]).filter(l=>["active","overdue"].includes(l.status)).reduce((sum,l)=>sum+Math.max(0,Number(l.principal)||0)+Math.max(0,Number(l.interestDue)||0),0);
 const payrollLiabilities = Math.max(0,Number(finance.payablesPayroll)||0);
 const totalLiabilities = loanLiabilities + payrollLiabilities + Math.max(0,Number(finance.debt)||0);
 const equity = totalAset - totalLiabilities;

 h+='<div class="panel"><h3>📊 Laba Rugi Bulan '+curMonth+'</h3>';
 h+='<table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>Pendapatan Kotor</td><td class="pos">'+rp(monthGross)+'</td></tr>';
 h+='<tr><td>Beban Operasional</td><td class="neg">-'+rp(monthExpense)+'</td></tr>';
 h+='<tr><td><b>Laba Bersih Bulan Ini</b></td><td class="'+(monthGross-monthExpense<0?'neg':'pos')+'"><b>'+rp(monthGross-monthExpense)+'</b></td></tr></table></div>';
 
 h+='<div class="panel"><h3>⚖️ Neraca Posisi Keuangan</h3>';
 h+='<h4 style="color:#2E7D32;margin:10px 0">A. ASET LANCAR (Liquid)</h4><table><tr><th>Keterangan</th><th>Nilai</th></tr>';
 h+='<tr><td>💰 Kas / Uang Tunai</td><td>'+rp(S.gold)+'</td></tr>';
 h+='<tr><td>🥥 Stok Kelapa ('+stockQty()+' butir)</td><td>'+rp(stockValue)+'</td></tr>';
 h+='<tr><td>🧊 Stok Bahan Warung (Es, Gula, Cup)</td><td>'+rp(bahanWarung)+'</td></tr>';
 h+='<tr><td><b>Total Aset Lancar</b></td><td><b>'+rp(totalAsetLancar)+'</b></td></tr></table>';
 
 h+='<h4 style="color:#1565C0;margin:15px 0 10px 0">B. ASET TETAP (Non-Liquid)</h4><table><tr><th>Keterangan</th><th>Nilai</th></tr>';
 h+='<tr><td>🌴 Lahan Warisan (2.430 m²)</td><td>'+rp(250000000)+'</td></tr>';
 h+='<tr><td>🌱 Aset Biologis ('+pohonMuda+' pohon muda @ Rp 60.000)</td><td>'+rp(nilaiAsetBiologis)+'</td></tr>';
 if(kulkasValue>0)h+='<tr><td>❄️ Kulkas Mini</td><td>'+rp(kulkasValue)+'</td></tr>';
 if(nilaiAsetTetapWarung>0)h+='<tr><td>🏪 Peralatan Warung (Nilai Buku)</td><td>'+rp(nilaiAsetTetapWarung)+'</td></tr>';
 h+='<tr><td><b>Total Aset Tetap</b></td><td><b>'+rp(totalAsetTetap)+'</b></td></tr></table>';
 
 h+='<h4 style="color:#E65100;margin:15px 0 10px 0">C. LIABILITAS & EKUITAS</h4><table><tr><th>Keterangan</th><th>Nilai</th></tr>';
 h+='<tr><td>Pokok pinjaman + bunga berjalan</td><td>'+rp(loanLiabilities)+'</td></tr>';
 h+='<tr><td>Utang gaji</td><td>'+rp(payrollLiabilities)+'</td></tr>';
 h+='<tr><td>Liabilitas lain tercatat</td><td>'+rp(Math.max(0,Number(finance.debt)||0))+'</td></tr>';
 h+='<tr><td><b>Total liabilitas</b></td><td><b>'+rp(totalLiabilities)+'</b></td></tr>';
 h+='<tr><td><b>Ekuitas (Aset − Liabilitas)</b></td><td><b>'+rp(equity)+'</b></td></tr></table><p class="accounting-note">Catatan: nilai lahan warisan Rp250 juta berasal dari narasi game, bukan appraisal; nilai pohon dan perlengkapan masih estimasi. Lahan tambahan dicatat berdasarkan biaya perolehan. Bunga pinjaman dan utang gaji berasal dari simulasi lokal.</p></div>';
 
 h+='<div class="panel"><h3>📅 Ringkasan Harian</h3><table><tr><th>Hari</th><th>Cuaca</th><th>Pembeli</th><th>Pendapatan</th><th>Beban</th><th>Laba/rugi</th><th>Kas masuk</th><th>Kas keluar</th><th>Arus kas bersih</th></tr>';
 S.reports.forEach(r=>{h+='<tr><td>'+r.day+'</td><td>'+(DATA.weather[r.weather]?.name||r.weather||'—')+'</td><td>'+r.buyers+'</td><td class="pos">'+rp(r.gross)+'</td><td class="neg">'+rp(r.expense)+'</td><td class="'+(r.net<0?'neg':'pos')+'">'+rp(r.net)+'</td><td>'+rp(r.cashIn||0)+'</td><td>'+rp(r.cashOut||0)+'</td><td class="'+((r.cashflow||0)<0?'neg':'pos')+'">'+rp(r.cashflow!==undefined?r.cashflow:((r.cashIn||0)-(r.cashOut||0)))+'</td></tr>';});
 h+='</table></div>';

 // Jurnal transaksi: tampilkan pengeluaran HIDUP dan semua transaksi lain, bukan hanya total harian.
 const ledgerRows=(Array.isArray(S.ledger)?S.ledger:[]).slice(-200).reverse();
 h+='<div class="panel"><h3>📒 Jurnal Transaksi (maksimal 200 terbaru)</h3>';
 if(!ledgerRows.length){
  h+='<p>Belum ada transaksi tercatat.</p>';
 }else{
  h+='<table><tr><th>Hari</th><th>Kategori</th><th>Uraian</th><th>Nilai</th><th>Rincian</th></tr>';
  ledgerRows.forEach(function(entry){
   const detail=entry.detail===undefined||entry.detail===null?'—':(typeof entry.detail==='string'?entry.detail:JSON.stringify(entry.detail));
   const amount=Number(entry.amt)||0;
   h+='<tr><td>'+accEscape(entry.day)+'</td><td>'+accEscape(entry.cat)+'</td><td>'+accEscape(entry.desc)+'</td><td class="'+(amount<0?'neg':'pos')+'">'+rp(amount)+'</td><td>'+accEscape(detail)+'</td></tr>';
  });
  h+='</table><p class="accounting-note">Jurnal menampilkan maksimal 200 transaksi terbaru. Pengeluaran rumah tangga dengan kategori HIDUP tetap terlihat sebagai transaksi terpisah.</p>';
 }
 h+='</div>';
}
accDiv.innerHTML=h;
