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
 shop:{
  iceKarung:{name:'Es Batu 1 Karung',price:20000,portions:40,unit:'karung'},
  sugarBloc:{name:'Gula Merah 1 Blok',price:20000,portions:50,unit:'blok'},
  cupPack:{name:'Cup Plastik 1 Pak (20 pcs)',price:8000,pcs:20,unit:'pak'},
  fridge:{name:'Kulkas Mini 1 Unit',price:2000000,unit:'unit',capacity:200}
 },
 warungCapex:[['2 meja kayu',400000],['Tupperware besar 5L',50000],['Tupperware kecil air gula',20000],['2 golok',100000],['Cup plastik starter 50 pcs',15000]],
 living:{
  rice:{name:'Beras 1 kg',price:12000,days:2},
  lauk:{name:'Lauk (tempe+ikan asin)',price:10000,days:1},
  oil:{name:'Minyak goreng 130ml',price:4200,days:1},
  gas:{name:'Gas LPG 33g',price:383,days:1},
  electric:{name:'Listrik harian',price:8333,days:1},
  pulsa:{name:'Pulsa harian',price:4167,days:1},
  bensin:{name:'Bensin motor harian',price:6667,days:1},
  mandi:{name:'Sabun mandi/cuci',price:6667,days:1},
  bills:{name:'Tagihan bulanan (listrik+pulsa+bensin+mandi+sabun)',amount:775000}
 },
 degrade:{muda:14,tua:25},
 accel:{idrPer5:1000,adDays:30},
 hours:{open:9,close:21,secPerHour:2500},
 weather:{
  panas:{name:'️ Panas',esMult:1.4,wholeMult:0.8},
  berawan:{name:'⛅ Berawan',esMult:1.0,wholeMult:1.0},
  hujan:{name:'🌧️ Hujan',esMult:0.4,wholeMult:1.3}
 },
 paths:{
  warung:{name:'Warung Es Kelapa',desc:'Olah sendiri, margin tinggi, butuh kulkas & modal'},
  tengkulak:{name:'Jual ke Tengkulak + Bertani',desc:'Cepat dapat uang, margin tipis, fokus tanam komoditas lain'},
  mix:{name:'Kombinasi',desc:'Sebagian ke tengkulak, sebagian untuk warung'}
 }
};
const PORTR={kakek:'👴',tengkulak:'🧑‍💼',pedagang:'🏻‍',mentor:'',pemain:['🧑🏻','👩🏻‍','🏻','🏻']};
const STORY=[
 ['Narator','📜','Kakekmu wafat minggu lalu. Notaris membacakan warisan: lahan 2.430 m² dengan 10 pohon kelapa produktif - nilai aset Rp 250.000.000 - ditambah uang tunai tabungan Rp 5.000.000.'],
 ['Kakek','👴','"Nak... kelapa itu kehidupan. Tapi ingat hukum kakek: kelapa yang sudah dipetik, waktunya terus berjalan. Sampai 14 hari ia masih muda - manis untuk es kelapa. Hari 15 sampai 25, airnya asam dan dagingnya mengeras; bawa ke pasar sebagai kelapa santan, harga jatuh tapi kau tidak rugi semua. Lewat 25 hari - ia busuk, dan kau rugi segalanya."'],
 ['Kakek','👴','"Tengkulak datang tiap siang saat panen; ia borong semua dengan harganya sendiri. Warung desa ramai dari jam sembilan pagi sampai sembilan malam... kalau kau berani mengolah sendiri, untung itu punyamu."'],
 ['Kamu','🧑‍','"Aku tidak akan menjual tanah ini. Aku memilih bertani - dan aku akan menjadi pengusaha dari tanah ini."'],
 ['Mentor','🤖','"Harimu terbagi: Pagi untuk lahan dan belanja bahan, Siang untuk membuka warung, Sore untuk pasar dan evaluasi, Malam untuk laporan. Biaya hidup berjalan tiap hari; tagihan datang tiap bulan. Selamat bekerja, Bos."']
];
const LEARN=[
 '1 pohon biasa = 20 butir/bulan; kelapa super = 30 butir/bulan.',
 'Upah kuli panen (panjat) = Rp 500/butir.',
 'Tengkulak membeli butir muda: biasa Rp 3.500, super Rp 5.000.',
 'Es kelapa laku Rp 5.000/gelas; 1 butir = 4 gelas; 1 gelas butuh 1 porsi es, 1 porsi gula, 1 cup.',
 'Kelapa utuh muda laku Rp 13.000/butir di warung; di kampung peminatnya 1-6 orang per hari.',
 'Belanja: es Rp 20.000/karung (40 porsi), gula merah Rp 20.000/blok (50 porsi), cup Rp 8.000/pak (20 pcs). Es sisa mencair saat malam TANPA kulkas.',
 'Pasar tradisional membeli kelapa tua (santan) Rp 3.500/butir.',
 'Hukum Kakek: umur <=14 hari muda; 15-25 hari tua; >25 hari busuk (Rp 0).'
];
