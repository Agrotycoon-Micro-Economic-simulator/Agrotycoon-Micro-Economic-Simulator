loadSaved();
let h='';
if(!S||S.ledger.length===0){
 h='<div class="panel"><p>Belum ada data sesi ini. Mainkan dulu di index.html, lalu buka halaman ini lagi.</p></div>';
}else{
 h+='<div class="panel"><h3>Status Kas & Gudang</h3><p>Pemain: <b>'+S.name+'</b> | Hari '+S.day+' (Bulan '+monthOf(S.day)+')</p><p>Kas: <b>'+rp(S.gold)+'</b> | Gudang: '+stockQty()+' butir ('+(stockClass()||'-')+')</p><p>Warung: '+(S.warung.open?'buka':'belum')+' | 🧊 '+S.warung.ice+' porsi | 🍯 '+S.warung.sugar+' porsi | 🥤 '+S.warung.cups+' pcs</p></div>';
 h+='<div class="panel"><h3>Ringkasan Harian (sejak Hari 1)</h3><table><tr><th>Hari</th><th>Kotor</th><th>Pengeluaran</th><th>Net</th><th>Es/Utuh/Lepas</th><th>Bahan (🥥🧊🍯🥤)</th></tr>';
 S.reports.forEach(r=>{h+='<tr><td>'+r.day+'</td><td class="pos">'+rp(r.gross)+'</td><td class="neg">'+rp(r.expense)+'</td><td class="'+(r.net<0?'neg':'pos')+'">'+rp(r.net)+'</td><td>'+r.es+'/'+r.whole+'/'+r.lost+'</td><td>'+r.mat.kelapa+'/'+r.mat.ice+'/'+r.mat.sugar+'/'+r.mat.cup+(r.iceMelt?' (🫠'+r.iceMelt+')':'')+'</td></tr>';});
 h+='</table></div>';
 h+='<div class="panel"><h3>Buku Kas Lengkap</h3><table><tr><th>Hari</th><th>Kategori</th><th>Keterangan</th><th>Nilai</th></tr>';
 S.ledger.slice().reverse().forEach(r=>{h+='<tr><td>'+r.day+'</td><td>'+r.cat+'</td><td>'+r.desc+'</td><td class="'+(r.amt<0?'neg':'pos')+'">'+rp(r.amt)+'</td></tr>';});
 h+='</table></div>';
}
document.getElementById('acc').innerHTML=h;
