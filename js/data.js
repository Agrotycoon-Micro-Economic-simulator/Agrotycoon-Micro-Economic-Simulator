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
 shop:{iceKarung:20000,icePortions:40,sugarBloc:20000,sugarPortions:50,cupPack:8000,cupPcs:20},
 warungCapex:[["2 meja kayu",400000],["Tupperware besar 5L",50000],["Tupperware kecil air gula",20000],["2 golok",100000],["Plastic cup 50 pcs",15000]],
 living:{food:19650,bills:775000},
 degrade:{muda:14,tua:25},
 accel:{idrPer5:1000,adDays:30},
 hours:{open:9,close:21,secPerHour:2500}
};
const PORTR={kakek:'👴🏻',tengkulak:'🧑🏻‍',pedagang:'🏻‍',mentor:'🤖',pemain:['🧑🏻‍','👩🏻‍','🧔🏻','🏻🌾']};
const STORY=[
 ['Narator','📜','Kakekmu wafat minggu lalu. Notaris membacakan warisan: lahan 2.430 m² dengan 10 pohon kelapa produktif - nilai aset Rp 250.000.000 - ditambah uang tunai tabungan Rp 5.000.000.'],
 ['Kakek','👴','"Nak... kelapa itu kehidupan. Tapi ingat hukum kakek: kelapa yang sudah dipetik, waktunya terus berjalan. Sampai 14 hari ia masih muda - manis untuk es kelapa. Hari 15 sampai 25, airnya asam dan dagingnya mengeras; bawa ke pasar sebagai kelapa santan, harga jatuh tapi kau tidak rugi semua. Lewat 25 hari - ia busuk, dan kau rugi segalanya."'],
 ['Kakek','👴🏻','"Tengkulak datang tiap siang saat panen; ia borong semua dengan harganya sendiri. Warung desa ramai dari jam sembilan pagi sampai sembilan malam... kalau kau berani mengolah sendiri, untung itu punyamu."'],
 ['Kamu','🧑🏻‍','"Aku tidak akan menjual tanah ini. Aku memilih bertani - dan aku akan menjadi pengusaha dari tanah ini."'],
 ['Mentor','🤖','"Harimu terbagi: Pagi untuk lahan dan belanja bahan, Siang untuk membuka warung, Sore untuk pasar dan evaluasi, Malam untuk laporan. Biaya hidup berjalan tiap hari; tagihan datang tiap bulan. Selamat bekerja, Bos."']
];
const LEARN=[
 '1 pohon biasa = 20 butir/bulan; kelapa super = 30 butir/bulan.',
 'Upah kuli panen (panjat) = Rp 500/butir.',
 'Tengkulak membeli butir muda: biasa Rp 3.500, super Rp 5.000.',
 'Es kelapa laku Rp 5.000/gelas; 1 butir kelapa = 4 gelas; 1 gelas butuh 1 porsi es, 1 porsi gula, 1 cup.',
 'Kelapa utuh muda laku Rp 13.000/butir di warung; di kampung peminatnya 1-6 orang per hari.',
 'Belanja: es Rp 20.000/karung (40 porsi), gula merah Rp 20.000/blok (50 porsi), cup Rp 8.000/pak (20 pcs). Es sisa mencair saat malam.',
 'Pasar tradisional membeli kelapa tua (santan) Rp 3.500/butir.',
 'Hukum Kakek: umur <=14 hari muda; 15-25 hari tua; >25 hari busuk (Rp 0).'
];
