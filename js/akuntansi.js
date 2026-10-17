function accEscape(value){
 return String(value===undefined||value===null?'':value).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});
}
function accAccounting(entry){
 if(entry&&entry.accounting)return entry.accounting;
 const cat=String(entry&&entry.cat||'');
 const desc=String(entry&&entry.desc||'').toLowerCase();
 const amount=Number(entry&&entry.amt)||0;
 if(amount>0&&cat==='PENJUALAN')return {classification:'business_revenue',debitAccount:'Kas',creditAccount:'Penjualan',debit:amount,credit:amount,legacy:true};
 if(amount<0&&cat==='HIDUP'){
  const keys=['rice','egg','oil','mie','tempe','sayur','lauk'];
  const kitchen=keys.some(key=>DATA.living&&DATA.living[key]&&desc.includes(String(DATA.living[key].name).toLowerCase()));
  return {classification:kitchen?'household_kitchen':'household_personal',debitAccount:kitchen?'Beban Dapur':'Beban Pribadi',creditAccount:'Kas',debit:Math.abs(amount),credit:Math.abs(amount),legacy:true};
 }
 if(amount<0&&cat==='BELANJA')return {classification:'business_purchase',debitAccount:'Pembelian Bahan Baku',creditAccount:'Kas',debit:Math.abs(amount),credit:Math.abs(amount),legacy:true};
 if(amount<0&&cat==='TENAGA')return {classification:'business_expense',debitAccount:'Beban Tenaga Kerja',creditAccount:'Kas',debit:Math.abs(amount),credit:Math.abs(amount),legacy:true};
 if(amount<0&&cat==='CAPEX')return {classification:'asset_purchase',debitAccount:'Aset Tetap/Modal',creditAccount:'Kas',debit:Math.abs(amount),credit:Math.abs(amount),legacy:true};
 return {classification:'legacy_unclassified',debitAccount:'Belum diklasifikasi',creditAccount:'Belum diklasifikasi',debit:0,credit:0,legacy:true};
}

loadSaved();
const accDiv = document.getElementById('acc');
let h='';

if(!S || S.ledger.length === 0){
 h='<div class="panel"><p>Belum ada data sesi ini. Mainkan dulu di index.html.</p></div>';
}else{
 const curMonth=monthOf(S.day);
 const monthLedger=(Array.isArray(S.ledger)?S.ledger:[]).filter(entry=>monthOf(Number(entry.day)||S.day)===curMonth);
 const classifiedMonth=monthLedger.map(entry=>({entry,accounting:accAccounting(entry),amount:Math.abs(Number(entry.amt)||0)}));
 const sumClass=key=>classifiedMonth.filter(row=>row.accounting.classification===key).reduce((sum,row)=>sum+row.amount,0);
 const monthGross=sumClass('business_revenue');
 const monthPurchases=sumClass('business_purchase');
 const monthBusinessExpense=sumClass('business_expense');
 const monthKitchen=sumClass('household_kitchen');
 const monthPersonal=sumClass('household_personal');
 const monthBusinessResult=monthGross-monthPurchases-monthBusinessExpense;
 const monthCashIn=monthLedger.reduce((sum,entry)=>sum+Math.max(0,Number(entry.amt)||0),0);
 const monthCashOut=monthLedger.reduce((sum,entry)=>sum+Math.max(0,-(Number(entry.amt)||0)),0);
 const monthNetCash=monthCashIn-monthCashOut;
 const monthOpeningCash=(Number(S.gold)||0)-monthNetCash;
 
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

 h+='<div class="panel"><h3>📊 Laporan Usaha dan Rumah Tangga — Bulan '+curMonth+'</h3>';
 h+='<table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>Penjualan (kredit: Penjualan)</td><td class="pos">'+rp(monthGross)+'</td></tr>';
 h+='<tr><td>Pembelian bahan baku</td><td class="neg">-'+rp(monthPurchases)+'</td></tr>';
 h+='<tr><td>Beban usaha lain</td><td class="neg">-'+rp(monthBusinessExpense)+'</td></tr>';
 h+='<tr><td><b>Hasil usaha sebelum biaya rumah tangga</b></td><td class="'+(monthBusinessResult<0?'neg':'pos')+'"><b>'+rp(monthBusinessResult)+'</b></td></tr>';
 h+='<tr><td>Belanja dapur / kebutuhan makanan</td><td class="neg">-'+rp(monthKitchen)+'</td></tr>';
 h+='<tr><td>Pengeluaran pribadi/rumah tangga lainnya</td><td class="neg">-'+rp(monthPersonal)+'</td></tr>';
 h+='<tr><td><b>Hasil setelah pengeluaran rumah tangga</b></td><td class="'+(monthBusinessResult-monthKitchen-monthPersonal<0?'neg':'pos')+'"><b>'+rp(monthBusinessResult-monthKitchen-monthPersonal)+'</b></td></tr></table>';
 h+='<h4>Rekonsiliasi kas bulan berjalan</h4><table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>Kas awal bulan (hasil rekonsiliasi)</td><td>'+rp(monthOpeningCash)+'</td></tr>';
 h+='<tr><td>Kas masuk</td><td class="pos">'+rp(monthCashIn)+'</td></tr>';
 h+='<tr><td>Kas keluar</td><td class="neg">-'+rp(monthCashOut)+'</td></tr>';
 h+='<tr><td><b>Kas akhir hasil rekonsiliasi</b></td><td><b>'+rp(monthOpeningCash+monthCashIn-monthCashOut)+'</b></td></tr>';
 h+='<tr><td><b>Saldo kas aktual (S.gold)</b></td><td><b>'+rp(S.gold)+'</b></td></tr></table>';
 h+='<p class="accounting-note">Transaksi lama tanpa metadata diklasifikasikan secara terbatas berdasarkan kategori/uraian; transaksi yang tidak dapat dipastikan tidak dimasukkan ke kelompok usaha/rumah tangga. Pembelian bahan baku dipisahkan dari beban tenaga kerja. Hasil usaha ini belum otomatis merupakan laba akuntansi penuh/HPP karena pemakaian persediaan, depresiasi, dan transaksi nonkas belum seluruhnya terintegrasi.</p></div>';
 
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

 // Jurnal berpasangan: setiap transaksi kas baru memiliki debit dan kredit yang seimbang.
 const ledgerRows=(Array.isArray(S.ledger)?S.ledger:[]).slice(-200).reverse();
 h+='<div class="panel"><h3>📒 Jurnal Umum — maksimal 200 transaksi terbaru</h3>';
 if(!ledgerRows.length){
  h+='<p>Belum ada transaksi tercatat.</p>';
 }else{
  h+='<table><tr><th>Hari</th><th>Keterangan</th><th>Akun debit</th><th>Debit</th><th>Akun kredit</th><th>Kredit</th><th>Rincian</th></tr>';
  ledgerRows.forEach(function(entry){
   const detail=entry.detail===undefined||entry.detail===null?'—':(typeof entry.detail==='string'?entry.detail:JSON.stringify(entry.detail));
   const amount=Math.abs(Number(entry.amt)||0);
   const posting=accAccounting(entry);
   const known=posting.classification!=='legacy_unclassified';
   h+='<tr><td>'+accEscape(entry.day)+'</td><td>'+accEscape(entry.desc)+'<br><small>'+accEscape(entry.cat)+(posting.legacy?' · rekonstruksi transaksi lama':'')+'</small></td><td>'+accEscape(posting.debitAccount)+'</td><td>'+rp(known?posting.debit:0)+'</td><td>'+accEscape(posting.creditAccount)+'</td><td>'+rp(known?posting.credit:0)+'</td><td>'+accEscape(detail)+'</td></tr>';
  });
  h+='</table><p class="accounting-note">Jurnal menampilkan maksimal 200 transaksi terbaru. Transaksi kas baru mencatat debit dan kredit dengan nilai sama. Transaksi lama yang tidak dapat diklasifikasikan ditandai belum diklasifikasi, bukan dipaksakan ke akun tertentu.</p>';
 }
 h+='</div>';
}
accDiv.innerHTML=h;
