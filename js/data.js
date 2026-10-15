const DATA={
 slots:30,
 yieldBiasa:20,yieldSuper:30,
 priceTengkulak:{biasa:3500,super:5000},
 pricePasarTua:3500,
 wholePrice:13000,
 laborPerFruit:500,
 cycleDays:30,
 matureDays:1080,
 seedling:{price:50000,labor:10000},
 es:{price:5000},
 buyFromFarmer:3500,
 buyFromTengkulak:5000,
 shop:{
  iceKarung:{name:'Es Batu 1 Karung',price:20000,portions:40,unit:'karung'},
  sugarBloc:{name:'Gula Merah 1 Blok',price:20000,portions:50,unit:'blok'},
  cupPack:{name:'Cup Plastik 1 Pak (20 pcs)',price:8000,pcs:20,unit:'pak'},
  fridge:{name:'Kulkas Mini 1 Unit',price:2000000,unit:'unit',capacity:200}
 },
 // PAKET PERLENGKAPAN WARUNG
 warungPackages:{
  hemat:{name:'Paket Hemat (Rekomendasi)', items:[['Meja bekas',75000],['Golok warisan',0],['Tupperware baru',70000],['Cup plastik 50pcs',15000]], total:160000},
  standar:{name:'Paket Standar (Baru Semua)', items:[['Meja kayu baru',200000],['Golok baru',50000],['Tupperware baru',70000],['Cup plastik 50pcs',15000]], total:335000}
 },
 living:{
  rice:{name:'Beras 5 liter',price:65000,period:10},
  egg:{name:'Telur 1 kg',price:28000,period:5},
  oil:{name:'Minyak goreng 2 liter',price:32000,period:30},
  mie:{name:'Mie instan 5 bungkus',price:15000,period:3},
  tempe:{name:'Tempe 2 potong',price:8000,period:2},
  sayur:{name:'Sayur harian',price:7000,period:1},
  lauk:{name:'Lauk tambahan',price:15000,period:2},
  electric:{name:'Listrik harian',price:8333},
  pulsa:{name:'Pulsa harian',price:4167},
  bensin:{name:'Bensin motor harian',price:6667},
  mandi:{name:'Sabun mandi/cuci',price:6667}
 },
 degrade:{muda:14,tua:25},
 accel:{idrPer5:1000,adDays:30},
 hours:{open:9,close:21,secPerHour:2500},
 weather:{
  panas:{name:'☀️ Panas',esMult:1.4,wholeMult:0.8,minBuyers:45},
  berawan:{name:'⛅ Berawan',esMult:1.0,wholeMult:1.0,minBuyers:30},
  hujan:{name:'🌧️ Hujan',esMult:0.4,wholeMult:1.3,minBuyers:10}
 },
 paths:{
  warung:{name:'Warung Es Kelapa',desc:'Olah sendiri, margin tinggi. Mulai dengan modal kecil.'},
  tengkulak:{name:'Jual ke Tengkulak + Bertani',desc:'Cepat dapat uang, fokus tanam komoditas lain.'},
  mix:{name:'Kombinasi',desc:'Sebagian ke tengkulak, sebagian untuk warung.'}
 },
 // SISTEM LEVEL & KOMODITAS
 levels:{
  1:{name:'Pemula', xpReq:0, unlock:['Kelapa']},
  2:{name:'Pedagang Desa', xpReq:100, unlock:['Kelapa','Toge']},
  3:{name:'Juragan Kecil', xpReq:300, unlock:['Kelapa','Toge','Cabai Rawit']}
 },
 futureCommodities:['Jagung','Tomat','Ayam Pedaging','Lele','Bawang Merah']
};
const PORTR={kakek:'👴',tengkulak:'🧑‍💼',pedagang:'👩‍🌾',mentor:'🤖',pemain:['🧑‍🌾','👩‍🌾','🧔🏻','👨🏻']};
const STORY=[
 ['Narator','📜','Kakekmu wafat minggu lalu. Warisan: lahan 2.430 m² dengan 10 pohon kelapa produktif (Aset Rp 250.000.000) + uang tunai Rp 5.000.000.'],
 ['Kakek','👴','"Nak, ingat hukum kakek: kelapa petik punya waktu. ≤14 hari: muda (enak untuk es). 15-25 hari: tua (jadi santan, harga jatuh). >25 hari: busuk (rugi total)."'],
 ['Kakek','👴','"Tengkulak borong siang hari. Warung ramai pagi sampai malam. Kalau kau berani olah sendiri, untung itu punyamu."'],
 ['Kamu','🧑‍🌾','"Aku tidak akan menjual tanah ini. Aku akan menjadi pengusaha dari tanah ini."'],
 ['Mentor','🤖','"Selamat bekerja, Bos. Biaya hidup berjalan tiap hari. Kelola modal dengan bijak."']
];
const LEARN=[
 '1 pohon biasa = 20 butir/bulan; super = 30 butir/bulan. Upah kuli = Rp 500/butir.',
 'Es kelapa: Rp 5.000/gelas. 1 butir = 4 gelas. HPP per gelas ≈ Rp 1.525 (es, gula, cup).',
 'Kelapa utuh muda laku Rp 13.000/butir. Kelapa tua (santan) laku Rp 3.500/butir.',
 'Tips: Gunakan "Paket Hemat" saat membuka warung untuk menekan modal awal. Beli bahan sesuai rekomendasi cuaca.'
];
