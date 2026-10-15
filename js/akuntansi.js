// Akuntansi hanya butuh state, tidak perlu boot ulang
function loadAccState(){
 try{const r=localStorage.getItem(SAVE_KEY);if(r){S=JSON.parse(r);if(!S.dayLog)S.dayLog=newDayLog();if(!S.livingStock)S.livingStock={rice:2,lauk:0,oil:0};if(!S.warung.fridge)S.warung.fridge=false;if(!S.stats)S.stats={es:0,whole:0,tengkulak:0,rotten:0,missedDays:0,lostSales:0};if(!S.cuaca)S.cuaca='panas';}else{S=defaultState();}}catch(e){S=defaultState();}
}
loadAccState();
const accDiv=document.getElementById('acc');
let h='';
if(!S||S.ledger.length===0){h='<div class="panel"><p>Belum ada data sesi ini.</p></div>';}
else{
 const curMonth=monthOf(S.day);
 const monthReports=S.reports.filter(r=>monthOf(r.day)===curMonth);
 const monthGross=monthReports.reduce((a,r)=>a+r.gross,0);
 const monthExpense=monthReports.reduce((a,r)=>a+r.expense,0);
 const monthNet=monthGross-monthExpense;
 h+='<div class="panel"><h3> Laba Rugi Bulan '+curMonth+'</h3><table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>Pendapatan Kotor</td><td class="pos">'+rp(monthGross)+'</td></tr>';
 h+='<tr><td>Beban Operasional</td><td class="neg">-'+rp(monthExpense)+'</td></tr>';
 h+='<tr><td><b>Laba Bersih Bulan Ini</b></td><td class="'+(monthNet<0?'neg':'pos')+'"><b>'+rp(monthNet)+'</b></td></tr></table></div>';
 const totalAsset=S.gold+stockQty()*3500+(S.warung.fridge?2000000:0);
 h+='<div class="panel"><h3>️ Neraca Sederhana</h3><table><tr><th>Aset</th><th>Nilai</th></tr>';
 h+='<tr><td>Kas</td><td>'+rp(S.gold)+'</td></tr>';
 h+='<tr><td>Stok Kelapa ('+stockQty()+' butir)</td><td>'+rp(stockQty()*3500)+'</td></tr>';
 h+='<tr><td>Stok Bahan Warung</td><td>'+rp(S.warung.ice*500+S.warung.sugar*400+S.warung.cups*400)+'</td></tr>';
 if(S.warung.fridge)h+='<tr><td>Kulkas</td><td>'+rp(2000000)+'</td></tr>';
 h+='<tr><td><b>Total Aset</b></td><td><b>'+rp(totalAsset)+'</b></td></tr></table></div>';
 const cashIn=S.reports.reduce((a,r)=>a+r.gross,0);
 const cashOut=S.reports.reduce((a,r)=>a+r.expense,0);
 h+='<div class="panel"><h3>💹 Arus Kas Kumulatif</h3><table><tr><th>Pos</th><th>Nilai</th></tr>';
 h+='<tr><td>Kas Masuk</td><td class="pos">'+rp(cashIn)+'</td></tr>';
 h+='<tr><td>Kas Keluar</td><td class="neg">-'+rp(cashOut)+'</td></tr>';
 h+='<tr><td><b>Arus Kas Bersih</b></td><td class="'+(cashIn-cashOut<0?'neg':'pos')+'"><b>'+rp(cashIn-cashOut)+'</b></td></tr></table></div>';
 h+='<div class="panel"><h3>📅 Ringkasan Harian</h3><table><tr><th>Hari</th><th>Cuaca</th><th>Pembeli</th><th>Kotor</th><th>Pengeluaran</th><th>Net</th><th>Es/Utuh/Lepas</th><th>Bahan</th></tr>';
 S.reports.forEach(r=>{h+='<tr><td>'+r.day+'</td><td>'+DATA.weather[r.weather].name+'</td><td>'+r.buyers+'</td><td class="pos">'+rp(r.gross)+'</td><td class="neg">'+rp(r.expense)+'</td><td class="'+(r.net<0?'neg':'pos')+'">'+rp(r.net)+'</td><td>'+r.es+'/'+r.whole+'/'+r.lost+'</td><td>'+r.mat.kelapa+'/'+r.mat.ice+'/'+r.mat.sugar+'/'+r.mat.cup+(r.iceMelt?' 🫠'+r.iceMelt:'')+'</td></tr>';});
 h+='</table></div>';
 h+='<div class="panel"><h3>📚 Buku Kas Detail</h3><table><tr><th>Hari</th><th>Kategori</th><th>Keterangan</th><th>Detail</th><th>Nilai</th></tr>';
 S.ledger.slice().reverse().forEach(r=>{h+='<tr><td>'+r.day+'</td><td>'+r.cat+'</td><td>'+r.desc+'</td><td>'+(r.detail?JSON.stringify(r.detail):'-')+'</td><td class="'+(r.amt<0?'neg':'pos')+'">'+rp(r.amt)+'</td></tr>';});
 h+='</table></div>';
}
accDiv.innerHTML=h;
