loadSaved();
const accDiv = document.getElementById('acc');
let h='';

if(!S || S.ledger.length === 0){
 h='<div class="panel"><p>Belum ada data sesi ini. Mainkan dulu di index.html, lalu buka halaman ini lagi.</p></div>';
}else{
 // Hitung pohon muda (belum produktif)
 const pohonMuda = S.trees.filter(t => !(t.mature || S.day >= t.plantedDay + DATA.matureDays)).length;
 const pohonProduktif = S.trees.length - pohonMuda;
 const nilaiAsetBiologis = pohonMuda * (DATA.seedling.price + DATA.seedling.labor); // Rp 60.000/pohon
 
 // Laba Rugi Bulan Berjalan
 const curMonth=monthOf(S.day);
 const monthReports=S.reports.filter(r=>monthOf(r.day)===curMonth);
 const monthGross=monthReports.reduce((a,r)=>a+r.gross,0);
 const monthExpense=monthReports.reduce((a,r)=>a+r.expense,0);
 const monthNet=monthGross-monthExpense;
 
 h+='<div class="panel"><h3>📊 Laba Rugi Bulan '+curMonth+'</h3>';
 h+='<table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>Pendapatan Kotor</td><td class="pos">'+safeRp(monthGross)+'</td></tr>';
 h+='<tr><td>Beban Operasional</td><td class="neg">-'+safeRp(monthExpense)+'</td></tr>';
 h+='<tr><td><b>Laba Bersih Bulan Ini</b></td><td class="'+(monthNet<0?'neg':'pos')+'"><b>'+safeRp(monthNet)+'</b></td></tr></table></div>';
 
 // Neraca dengan Aset Biologis
 const stockValue = stockQty() * 3500;
 const bahanWarung = (S.warung.ice||0)*500 + (S.warung.sugar||0)*400 + (S.warung.cups||0)*400;
 const kulkasValue = S.warung.fridge ? 2000000 : 0;
 const totalAset = S.gold + stockValue + bahanWarung + kulkasValue + nilaiAsetBiologis;
 
 h+='<div class="panel"><h3>⚖️ Neraca Sederhana</h3>';
 h+='<table><tr><th>Aset</th><th>Nilai</th></tr>';
 h+='<tr><td>💰 Kas</td><td>'+safeRp(S.gold)+'</td></tr>';
 h+='<tr><td>🥥 Stok Kelapa ('+stockQty()+' butir)</td><td>'+safeRp(stockValue)+'</td></tr>';
 h+='<tr><td>🧊 Stok Bahan Warung</td><td>'+safeRp(bahanWarung)+'</td></tr>';
 if(kulkasValue>0)h+='<tr><td>❄️ Kulkas</td><td>'+safeRp(kulkasValue)+'</td></tr>';
 if(pohonMuda>0)h+='<tr><td>🌱 Aset Biologis ('+pohonMuda+' pohon muda)</td><td>'+safeRp(nilaiAsetBiologis)+'</td></tr>';
 h+='<tr><td><b>Total Aset</b></td><td><b>'+safeRp(totalAset)+'</b></td></tr>';
 h+='<tr><td colspan="2" style="font-size:12px;color:#666">Detail: '+pohonProduktif+' pohon produktif + '+pohonMuda+' pohon muda (Rp 60.000/pohon)</td></tr>';
 h+='</table></div>';
 
 // Arus Kas
 const cashIn=S.reports.reduce((a,r)=>a+r.gross,0);
 const cashOut=S.reports.reduce((a,r)=>a+r.expense,0);
 h+='<div class="panel"><h3> Arus Kas Kumulatif</h3>';
 h+='<table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>Kas Masuk (Total Pendapatan)</td><td class="pos">'+safeRp(cashIn)+'</td></tr>';
 h+='<tr><td>Kas Keluar (Total Pengeluaran)</td><td class="neg">-'+safeRp(cashOut)+'</td></tr>';
 h+='<tr><td><b>Arus Kas Bersih</b></td><td class="'+(cashIn-cashOut<0?'neg':'pos')+'"><b>'+safeRp(cashIn-cashOut)+'</b></td></tr></table></div>';
 
 // Ringkasan Harian
 h+='<div class="panel"><h3>📅 Ringkasan Harian</h3><table><tr><th>Hari</th><th>Cuaca</th><th>Pembeli</th><th>Kotor</th><th>Pengeluaran</th><th>Net</th><th>Es/Utuh/Lepas</th><th>Bahan</th></tr>';
 S.reports.forEach(r=>{h+='<tr><td>'+r.day+'</td><td>'+DATA.weather[r.weather].name+'</td><td>'+r.buyers+'</td><td class="pos">'+safeRp(r.gross)+'</td><td class="neg">'+safeRp(r.expense)+'</td><td class="'+(r.net<0?'neg':'pos')+'">'+safeRp(r.net)+'</td><td>'+r.es+'/'+r.whole+'/'+r.lost+'</td><td>'+r.mat.kelapa+'/'+r.mat.ice+'/'+r.mat.sugar+'/'+r.mat.cup+(r.iceMelt?' 🫠'+r.iceMelt:'')+'</td></tr>';});
 h+='</table></div>';
 
 // Buku Kas Detail
 h+='<div class="panel"><h3>📚 Buku Kas Detail</h3><table><tr><th>Hari</th><th>Kategori</th><th>Keterangan</th><th>Detail</th><th>Nilai</th></tr>';
 S.ledger.slice().reverse().forEach(r=>{h+='<tr><td>'+r.day+'</td><td>'+r.cat+'</td><td>'+r.desc+'</td><td>'+(r.detail?JSON.stringify(r.detail):'-')+'</td><td class="'+(r.amt<0?'neg':'pos')+'">'+safeRp(r.amt)+'</td></tr>';});
 h+='</table></div>';
}
accDiv.innerHTML=h;
