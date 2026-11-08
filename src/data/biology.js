// =============================================================================
// Biology Lab Data - Turkish Educational Content
// =============================================================================

export const organelleData = {
  // ─── Animal & Plant Cell Common Organelles ─────────────────────────────────
  cellMembrane: {
    id: 'cellMembrane',
    name: 'Hücre Zarı',
    englishName: 'Cell Membrane',
    function: 'Hücreyi dış ortamdan ayırır ve madde geçişini kontrol eder.',
    description:
      'Hücre zarı, fosfolipid çift tabakasından oluşan yarı geçirgen bir yapıdır. Seçici geçirgenlik özelliği sayesinde hücreye giren ve çıkan maddeleri düzenler. Zarın yapısında fosfolipidler, proteinler, kolesterol ve karbonhidratlar bulunur.',
    size: '7-8 nm kalınlığında',
    discoveredBy: 'Robert Hooke (1665)',
    funFact:
      'Hücre zarı o kadar ince ki, bir kağıdı 10.000 kat bükseniz ancak o kalınlığa ulaşırsınız!',
    color: '#a78bfa',
    plantOnly: false,
  },
  nucleus: {
    id: 'nucleus',
    name: 'Çekirdek',
    englishName: 'Nucleus',
    function: 'Hücrenin yönetim merkezi; DNA\'yı barındırır ve gen ifadesini kontrol eder.',
    description:
      'Çekirdek, hücrenin en büyük organellerinden biridir. Çift katlı çekirdek zarıyla çevrilidir ve içinde kromatin (DNA + protein), çekirdekçik (nükleolus) ve nükleer sıvı bulunur. Hücrenin tüm yaşamsal faaliyetlerini yönetir.',
    size: '5-10 µm çapında',
    discoveredBy: 'Robert Brown (1831)',
    funFact:
      'İnsan vücudundaki tek çekirdeksiz hücre olgun alyuvar (kırmızı kan hücresi)dir! Daha fazla hemoglobin taşıyabilmek için çekirdeğini kaybetmiştir.',
    color: '#6366f1',
    plantOnly: false,
  },
  mitochondria: {
    id: 'mitochondria',
    name: 'Mitokondri',
    englishName: 'Mitochondria',
    function: 'Hücresel solunum ile ATP (enerji) üretir.',
    description:
      'Mitokondri, çift katlı zara sahip olan ve hücrenin "enerji santrali" olarak bilinen organeldir. İç zarındaki kıvrımlar (kristalar) yüzey alanını artırarak enerji üretimini hızlandırır. Kendi DNA\'sına sahip olması, endosimbiyoz teorisinin temel kanıtlarından biridir.',
    size: '1-10 µm uzunluğunda',
    discoveredBy: 'Albert von Kölliker (1857)',
    funFact:
      'Mitokondri kendi DNA\'sına sahiptir ve sadece anneden kalıtılır! Bilim insanları bu özelliği kullanarak insanlığın ortak atasını "Mitokondriyal Havva" olarak adlandırmıştır.',
    color: '#f87171',
    plantOnly: false,
  },
  roughER: {
    id: 'roughER',
    name: 'Granüllü Endoplazmik Retikulum',
    englishName: 'Rough Endoplasmic Reticulum',
    function: 'Ribozomlarla birlikte protein sentezi ve taşınması yapar.',
    description:
      'Granüllü ER, üzerinde ribozomlar bulunan zarla çevrili kanallar sistemidir. Sentezlenen proteinleri paketleyip Golgi aygıtına gönderir. Özellikle salgı hücrelerinde çok gelişmiştir.',
    size: 'Hücre hacminin %50\'sini kaplayabilir',
    discoveredBy: 'Keith Porter (1945)',
    funFact:
      'Bir hücredeki tüm ER kanallarını yan yana sersek, bir futbol sahasını kaplayabilir!',
    color: '#c084fc',
    plantOnly: false,
  },
  smoothER: {
    id: 'smoothER',
    name: 'Düz Endoplazmik Retikulum',
    englishName: 'Smooth Endoplasmic Reticulum',
    function: 'Lipit sentezi, karbonhidrat metabolizması ve detoksifikasyon yapar.',
    description:
      'Düz ER, üzerinde ribozom bulunmayan zarla çevrili kanal sistemidir. Yağ sentezi, kalsiyum depolama ve zararlı maddelerin detoksifikasyonu gibi görevleri vardır. Karaciğer ve kas hücrelerinde çok gelişmiştir.',
    size: 'Değişken',
    discoveredBy: 'Keith Porter (1945)',
    funFact:
      'Karaciğer hücrelerinde düz ER, alkol ve ilaçları zararsız hale getiren bir "arıtma tesisi" gibi çalışır!',
    color: '#d8b4fe',
    plantOnly: false,
  },
  ribosome: {
    id: 'ribosome',
    name: 'Ribozom',
    englishName: 'Ribosome',
    function: 'mRNA\'daki genetik bilgiyi okuyarak protein sentezler.',
    description:
      'Ribozomlar, RNA ve proteinlerden oluşan zarsız organellerdir. Serbest olarak sitoplazmada ya da granüllü ER üzerinde bulunabilirler. Prokaryot (70S) ve ökaryot (80S) hücrelerde farklı boyutlardadır.',
    size: '20-30 nm çapında',
    discoveredBy: 'George Palade (1955)',
    funFact:
      'Tek bir E. coli bakterisinde yaklaşık 20.000 ribozom bulunur. Bu ribozomlar saniyede 20 amino asit birleştirebilir!',
    color: '#fbbf24',
    plantOnly: false,
  },
  golgiApparatus: {
    id: 'golgiApparatus',
    name: 'Golgi Aygıtı',
    englishName: 'Golgi Apparatus',
    function: 'Proteinleri ve lipitleri işler, paketler ve hedeflerine gönderir.',
    description:
      'Golgi aygıtı (cisimciği), üst üste dizilmiş yassılaşmış zarlardan (sisterna) oluşur. ER\'den gelen proteinleri modifiye eder, etiketler ve doğru adrese gönderir. Salgı vezikülleri ve lizozomları da oluşturur.',
    size: '1-3 µm uzunluğunda',
    discoveredBy: 'Camillo Golgi (1898)',
    funFact:
      'Golgi aygıtı adını İtalyan bilim insanı Camillo Golgi\'den alır. Golgi, bu keşfiyle Nobel Ödülü kazanmıştır!',
    color: '#f59e0b',
    plantOnly: false,
  },
  lysosome: {
    id: 'lysosome',
    name: 'Lizozom',
    englishName: 'Lysosome',
    function: 'Hücre içi sindirim yapar; yaşlı organelleri ve yabancı maddeleri parçalar.',
    description:
      'Lizozomlar, Golgi aygıtından kökenli olan ve sindirim enzimleri içeren tek zarlı organellerdir. Fagositozla alınan maddeleri, hasarlı organelleri ve hücresel atıkları parçalar. "Otofaji" (kendini yeme) sürecinde rol oynarlar.',
    size: '0.1-1.2 µm çapında',
    discoveredBy: 'Christian de Duve (1955)',
    funFact:
      'Lizozomlar hücrenin "geri dönüşüm merkezi" gibidir. Bir hücre öldüğünde, lizozomları patlar ve hücreyi içeriden sindirir - buna "otoliz" denir!',
    color: '#fb923c',
    plantOnly: false,
  },
  centriole: {
    id: 'centriole',
    name: 'Sentriyol',
    englishName: 'Centriole',
    function: 'Hücre bölünmesinde iğ ipliklerinin oluşumunu sağlar.',
    description:
      'Sentriyoller, mikrotübüllerden oluşan silindirik yapılardır. Her hücrede birbirine dik konumda iki sentriyol bulunur (sentrozom). Hücre bölünmesinde kromozomları kutuplara çeken iğ ipliklerini organize eder. Bitki hücrelerinde genellikle bulunmaz.',
    size: '0.2 µm çapında, 0.5 µm uzunluğunda',
    discoveredBy: 'Edouard Van Beneden (1883)',
    funFact:
      'Sentriyoller 9+0 düzeninde 9 üçlü mikrotübül grubundan oluşur. Bu yapı, silya ve flagella\'nın temelini oluşturur!',
    color: '#38bdf8',
    plantOnly: false,
  },
  cytoplasm: {
    id: 'cytoplasm',
    name: 'Sitoplazma',
    englishName: 'Cytoplasm',
    function: 'Organellere ortam sağlar, metabolik reaksiyonlara ev sahipliği yapar.',
    description:
      'Sitoplazma, hücre zarı ile çekirdek zarı arasındaki jel kıvamındaki maddedir. Su, tuzlar, organik moleküller ve enzimler içerir. "Sitoplazma akımı" (siklozis) sayesinde maddeler hücre içinde taşınır.',
    size: 'Hücre hacminin büyük bölümünü kaplar',
    discoveredBy: 'Robert Remak (1852)',
    funFact:
      'Sitoplazma %70-80 oranında sudan oluşur. Hücre zarı hasar görürse sitoplazma dışarı akar ve hücre ölür!',
    color: '#e0e7ff',
    plantOnly: false,
  },

  // ─── Plant Cell Specific ──────────────────────────────────────────────────
  cellWall: {
    id: 'cellWall',
    name: 'Hücre Duvarı',
    englishName: 'Cell Wall',
    function: 'Hücreye şekil verir, mekanik destek ve koruma sağlar.',
    description:
      'Hücre duvarı, selülozdan yapılmış sert ve kalın bir yapıdır. Hücre zarının dışında bulunur. Bitki hücrelerine dikdörtgen şekillerini kazandırır. Turgor basıncına dayanarak bitkinin dik durmasını sağlar.',
    size: '0.1-10 µm kalınlığında',
    discoveredBy: 'Robert Hooke (1665)',
    funFact:
      'Robert Hooke, mantar dokusu kesitinde gördüğü küçük odacıkları "hücre" (cell) olarak adlandırmıştı. Aslında gördüğü şey sadece hücre duvarlarıydı!',
    color: '#84cc16',
    plantOnly: true,
  },
  chloroplast: {
    id: 'chloroplast',
    name: 'Kloroplast',
    englishName: 'Chloroplast',
    function: 'Fotosentez yaparak ışık enerjisini kimyasal enerjiye dönüştürür.',
    description:
      'Kloroplast, çift zarlı ve kendi DNA\'sına sahip bir organeldir. İç zarı düzdür ve "stroma" adı verilen sıvıyla doludur. Stroma içinde "tilakoid" adlı yassı kesecikler ve bunların üst üste dizilmesiyle oluşan "granum" yapıları bulunur. Klorofil pigmenti yeşil rengi verir.',
    size: '5-10 µm uzunluğunda',
    discoveredBy: 'Hugo von Mohl (1837)',
    funFact:
      'Bir yapraktaki kloroplastlar, saatte yaklaşık 300 milyon oksijen molekülü üretebilir! Fotosentez olmasaydı Dünya\'da yaşam olmazdı.',
    color: '#22c55e',
    plantOnly: true,
  },
  centralVacuole: {
    id: 'centralVacuole',
    name: 'Merkezi Koful',
    englishName: 'Central Vacuole',
    function: 'Su depolar, turgor basıncı oluşturur ve atık maddeleri depolar.',
    description:
      'Merkezi koful, olgun bitki hücrelerinde hücre hacminin %90\'ını kaplayabilen büyük bir su kesesidir. "Tonoplast" adlı tek katlı zarla çevrilidir. Turgor basıncı oluşturarak bitkinin dik durmasını sağlar.',
    size: 'Hücre hacminin %30-90\'ını kaplayabilir',
    discoveredBy: 'Félix Dujardin (1835)',
    funFact:
      'Bir bitki solduğunda aslında olan şey merkezi kofulların su kaybetmesidir. Bitkiye su verince kofullar tekrar dolar ve bitki canlanır!',
    color: '#67e8f9',
    plantOnly: true,
  },
  plasmodesmata: {
    id: 'plasmodesmata',
    name: 'Plazmodezmata',
    englishName: 'Plasmodesmata',
    function: 'Komşu hücreler arasında madde geçişi ve iletişim sağlar.',
    description:
      'Plazmodezmata, bitki hücre duvarını delip geçen ve komşu hücrelerin sitoplazmalarını birbirine bağlayan dar kanallardır. Bu kanallar sayesinde hücreler arasında su, besin ve sinyal molekülleri geçiş yapabilir.',
    size: '50-60 nm çapında',
    discoveredBy: 'Eduard Tangl (1879)',
    funFact:
      'Plazmodezmata, bitki hücrelerinin "sosyal ağı" gibidir. Bir yaprak hücresindeki bilgi, bu kanallar sayesinde saniyeler içinde komşu hücrelere ulaşabilir!',
    color: '#a3e635',
    plantOnly: true,
  },
}

// ─── Nucleus Structure Data ─────────────────────────────────────────────────
export const nucleusStructureData = {
  nuclearEnvelope: {
    id: 'nuclearEnvelope',
    name: 'Çekirdek Zarı',
    englishName: 'Nuclear Envelope',
    description:
      'Çift katlı zardan oluşur. Dış zar endoplazmik retikulum ile bağlantılıdır. İç ve dış zarlar arasında "perinükleer aralık" bulunur.',
    function: 'Çekirdek içeriğini sitoplazmadan ayırır ve korur.',
  },
  nuclearPores: {
    id: 'nuclearPores',
    name: 'Çekirdek Gözenekleri',
    englishName: 'Nuclear Pores',
    description:
      'Çekirdek zarındaki protein komplekslerinden oluşan kapılardır. Seçici geçirgenlik gösterir. mRNA, ribozom alt birimleri ve proteinlerin geçişini kontrol eder.',
    function: 'Çekirdek ile sitoplazma arasındaki madde geçişini düzenler.',
  },
  nucleolus: {
    id: 'nucleolus',
    name: 'Çekirdekçik (Nükleolus)',
    englishName: 'Nucleolus',
    description:
      'Çekirdek içindeki zarla çevrili olmayan yoğun bölgedir. Ribozomal RNA (rRNA) sentezlendiği ve ribozom alt birimlerinin oluşturulduğu yerdir.',
    function: 'rRNA sentezi ve ribozom alt birimlerinin montajı.',
  },
  chromatin: {
    id: 'chromatin',
    name: 'Kromatin',
    englishName: 'Chromatin',
    description:
      'DNA ve histon proteinlerinden oluşan ipliksi yapıdır. Hücre bölünmesi sırasında yoğunlaşarak kromozomları oluşturur. Ökromatin (açık, aktif) ve heterokromatin (yoğun, inaktif) olarak ikiye ayrılır.',
    function: 'Genetik bilgiyi taşır ve gen ifadesini düzenler.',
  },
  nuclearLamina: {
    id: 'nuclearLamina',
    name: 'Nükleer Lamina',
    englishName: 'Nuclear Lamina',
    description:
      'Çekirdek zarının iç yüzeyini kaplayan lamin proteinlerinden oluşan ağ yapısıdır. Çekirdeğe yapısal destek sağlar ve kromatinin organizasyonunda rol oynar.',
    function: 'Çekirdeğe yapısal destek sağlar.',
  },
}

// ─── DNA Data ───────────────────────────────────────────────────────────────
export const dnaData = {
  basePairs: [
    {
      base1: 'Adenin (A)',
      base2: 'Timin (T)',
      bonds: 2,
      color1: '#ef4444',
      color2: '#3b82f6',
      description: 'Adenin ve Timin arasında 2 hidrojen bağı bulunur.',
    },
    {
      base1: 'Guanin (G)',
      base2: 'Sitozin (C)',
      bonds: 3,
      color1: '#22c55e',
      color2: '#eab308',
      description: 'Guanin ve Sitozin arasında 3 hidrojen bağı bulunur.',
    },
  ],
  facts: [
    'İnsan DNA\'sı yaklaşık 3.2 milyar baz çiftinden oluşur.',
    'DNA çift sarmalının çapı 2 nanometredir.',
    'Bir hücredeki DNA\'yı düz bir çizgi halinde uzatsanız yaklaşık 2 metre uzunluğunda olurdu.',
    'İnsan DNA\'sının %99.9\'u tüm insanlarda aynıdır.',
    'DNA her 10.5 baz çiftinde bir tam tur atar (360°).',
    'İnsan genomunda yaklaşık 20.000-25.000 gen bulunur.',
    'DNA\'nın %98\'i protein kodlamaz ve buna "kodlamayan DNA" denir.',
    'Bir sarmal turunun yüksekliği 3.4 nanometredir.',
  ],
  structure: {
    diameter: '2 nm',
    helixPitch: '3.4 nm (her tur)',
    basePairsPerTurn: '10.5',
    majorGrooveWidth: '2.2 nm',
    minorGrooveWidth: '1.2 nm',
  },
  replication:
    'DNA replikasyonu yarı korunumlu (semi-konservatif) bir mekanizmadır. DNA helikaz enzimi çift sarmalı açar, DNA polimeraz yeni zinciri sentezler. Her yeni DNA molekülü bir eski ve bir yeni zincirden oluşur.',
}

// ─── Mitosis Stage Data ─────────────────────────────────────────────────────
export const mitosisStages = [
  {
    id: 'interphase',
    name: 'İnterfaz',
    englishName: 'Interphase',
    description:
      'Hücre bölünmeye hazırlanır. DNA replikasyonu gerçekleşir, organeller çoğalır ve hücre büyür. İnterfaz; G1, S ve G2 evrelerinden oluşur. Hücre döngüsünün en uzun evresidir (%90).',
    keyEvents: [
      'DNA kendini eşler (S evresi)',
      'Hücre büyür ve protein sentezler',
      'Organeller çoğalır',
      'Sentriyoller eşlenir',
    ],
    color: '#a78bfa',
  },
  {
    id: 'prophase',
    name: 'Profaz',
    englishName: 'Prophase',
    description:
      'Kromatin yoğunlaşarak kromozomları oluşturur. Her kromozom iki kardeş kromatidden oluşur ve sentromerle birbirine bağlıdır. Çekirdek zarı parçalanmaya başlar, sentriyoller kutuplara hareket eder.',
    keyEvents: [
      'Kromozomlar yoğunlaşır ve görünür hale gelir',
      'Çekirdek zarı erimeye başlar',
      'Çekirdekçik kaybolur',
      'İğ iplikleri oluşmaya başlar',
    ],
    color: '#8b5cf6',
  },
  {
    id: 'metaphase',
    name: 'Metafaz',
    englishName: 'Metaphase',
    description:
      'Kromozomlar hücrenin ortasında (ekvatoral düzlem / metafaz plağı) dizilir. İğ iplikleri kromozomların sentromerlerine bağlanır. En kısa evredir.',
    keyEvents: [
      'Kromozomlar hücrenin ortasına dizilir',
      'İğ iplikleri sentromerlere bağlanır',
      'Çekirdek zarı tamamen erir',
      'Kromozomlar en belirgin halleriyle görülür',
    ],
    color: '#7c3aed',
  },
  {
    id: 'anaphase',
    name: 'Anafaz',
    englishName: 'Anaphase',
    description:
      'Kardeş kromatidler sentromerden ayrılır ve iğ iplikleri tarafından zıt kutuplara çekilir. En hızlı gerçekleşen evredir.',
    keyEvents: [
      'Sentromerler ayrılır',
      'Kardeş kromatidler kutuplara çekilir',
      'Hücre uzamaya başlar',
      'Her kutba eşit sayıda kromozom gider',
    ],
    color: '#6d28d9',
  },
  {
    id: 'telophase',
    name: 'Telofaz',
    englishName: 'Telophase',
    description:
      'Kromozomlar kutuplara ulaşır ve tekrar kromatine dönüşür. Her kutupda yeni çekirdek zarı oluşur. Çekirdekçik yeniden belirir. İğ iplikleri kaybolur.',
    keyEvents: [
      'Çekirdek zarı yeniden oluşur',
      'Kromozomlar gevşer (kromatin halini alır)',
      'Çekirdekçik tekrar görünür',
      'İğ iplikleri çözülür',
    ],
    color: '#5b21b6',
  },
  {
    id: 'cytokinesis',
    name: 'Sitokinez',
    englishName: 'Cytokinesis',
    description:
      'Sitoplazma bölünerek iki yeni hücre oluşur. Hayvan hücrelerinde "boğumlanma" ile, bitki hücrelerinde "ara lamel" oluşumuyla gerçekleşir.',
    keyEvents: [
      'Sitoplazma ikiye bölünür',
      'Hayvan hücresinde boğumlanma olur',
      'Bitki hücresinde hücre plağı oluşur',
      'İki yavru hücre meydana gelir',
    ],
    color: '#4c1d95',
  },
]

// ─── Cell Type Comparison ───────────────────────────────────────────────────
export const cellComparison = {
  common: [
    'Hücre zarı',
    'Çekirdek',
    'Mitokondri',
    'Ribozom',
    'Endoplazmik retikulum',
    'Golgi aygıtı',
    'Lizozom',
    'Sitoplazma',
  ],
  animalOnly: [
    'Sentriyol (hücre bölünmesinde)',
    'Küçük kofullar',
    'Düzensiz şekil',
  ],
  plantOnly: [
    'Hücre duvarı (selüloz)',
    'Kloroplast (fotosentez)',
    'Merkezi koful (büyük)',
    'Plazmodezmata',
    'Dikdörtgen şekil',
  ],
}

// ─── Fun Facts ──────────────────────────────────────────────────────────────
export const cellFunFacts = [
  'İnsan vücudunda yaklaşık 37.2 trilyon hücre bulunur!',
  'En büyük insan hücresi yumurta hücresidir (100 µm). Çıplak gözle görülebilir!',
  'En küçük insan hücresi sperm hücresidir (5 µm).',
  'Vücudunuzdaki hücreler her 7-10 yılda bir tamamen yenilenir.',
  'Bir devekuşu yumurtası tek bir hücredir - dünyanın en büyük hücresi!',
  'Sinir hücreleri (nöronlar) 1 metreye kadar uzunluk olabilir.',
  'Bakteriler ökaryot hücrelerin 10-100 katı daha küçüktür.',
  'Mitokondri ve kloroplastın kendi DNA\'ları vardır - endosimbiyoz teorisi!',
  'Bir hücredeki DNA\'yı çözüp uzatsak, Güneş\'e gidip geri gelebilirsiniz.',
  'Hücreleriniz şu an bile bölünerek yenileniyor!',
]
