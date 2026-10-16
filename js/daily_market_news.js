/* Live official weather-alert reader. No fabricated fallback headlines. */
(function(){
"use strict";
const feed=document.getElementById("weather-feed"), status=document.getElementById("weather-status");
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function dateLabel(s){if(!s)return "Waktu tidak tersedia";const d=new Date(s);return Number.isNaN(d.getTime())?s:d.toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Jakarta"})+" WIB";}
async function loadAlerts(){
 try{
  const res=await fetch("https://www.bmkg.go.id/alerts/nowcast/id",{cache:"no-store"});
  if(!res.ok)throw new Error("HTTP "+res.status);
  const xmlText=await res.text(), doc=new DOMParser().parseFromString(xmlText,"application/xml");
  if(doc.querySelector("parsererror"))throw new Error("Format feed tidak terbaca");
  const items=[...doc.querySelectorAll("item")];
  if(!items.length)throw new Error("Feed tidak memuat item peringatan yang dapat dibaca");
  status.textContent="Feed BMKG berhasil dimuat. Tampilkan waktu publikasi dari sumber; periksa validitas tiap peringatan.";
  feed.innerHTML=items.map(item=>{
   const get=n=>item.querySelector(n)?.textContent?.trim()||"";
   const title=get("title"), desc=get("description"), pub=get("pubDate"), link=get("link");
   const safeLink=/^https:\/\//i.test(link)?link:"https://www.bmkg.go.id/alerts/nowcast/id";
   return '<article class="news"><h3>'+escapeHTML(title||"Peringatan cuaca BMKG")+'</h3><p class="small muted">Publikasi: '+escapeHTML(dateLabel(pub))+'</p><p>'+escapeHTML(desc||"Buka tautan sumber untuk rincian wilayah dan masa berlaku.")+'</p><p><a href="'+escapeHTML(safeLink)+'" target="_blank" rel="noopener">Buka sumber BMKG</a></p></article>';
  }).join("");
 }catch(err){
  status.textContent="Feed langsung tidak berhasil dimuat dari browser ini ("+err.message+"). Tidak ada berita pengganti yang dibuat. Buka sumber resmi BMKG untuk melihat peringatan terkini.";
  feed.innerHTML='<p><a href="https://www.bmkg.go.id/alerts/nowcast/id" target="_blank" rel="noopener">Buka feed peringatan dini BMKG</a></p>';
 }
}
document.getElementById("calc").addEventListener("click",()=>{
 const b=Number(document.getElementById("buy").value),s=Number(document.getElementById("sell").value),c=Number(document.getElementById("cost").value),q=Number(document.getElementById("qty").value),out=document.getElementById("margin");
 const inputs=["buy","sell","cost","qty"].map(id=>document.getElementById(id));
 if(inputs.some(x=>x.value.trim()==="")||![b,s,c,q].every(Number.isFinite)||b<0||s<0||c<0||q<=0){out.textContent="Lengkapi semua angka dengan nilai valid. Harga kosong tidak dianggap nol.";return;}
 const per=s-b-c,total=per*q,fmt=n=>"Rp "+Math.round(n).toLocaleString("id-ID");
 out.textContent="Margin estimasi/unit: "+fmt(per)+". Total estimasi: "+fmt(total)+". Ini belum memasukkan biaya atau risiko yang belum Anda isi (mis. susut, izin, bongkar-muat, pembiayaan, dan keterlambatan).";
});
loadAlerts();
})();