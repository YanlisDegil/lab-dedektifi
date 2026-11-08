// ============================================================
// Chemical Data for Laboratuvar Dedektifi - Chemistry Lab
// ============================================================

// --- Chemical Substances ---
export const chemicals = [
  { id: 'hcl', name: 'Hidroklorik Asit', formula: 'HCl', color: '#e0f2e0', pH: 1, state: 'sıvı', category: 'asit' },
  { id: 'naoh', name: 'Sodyum Hidroksit', formula: 'NaOH', color: '#f0f0ff', pH: 13, state: 'katı', category: 'baz' },
  { id: 'na', name: 'Sodyum', formula: 'Na', color: '#c0c0c0', pH: null, state: 'katı', category: 'metal' },
  { id: 'h2o', name: 'Su', formula: 'H₂O', color: '#d4f1f9', pH: 7, state: 'sıvı', category: 'nötr' },
  { id: 'caco3', name: 'Kalsiyum Karbonat', formula: 'CaCO₃', color: '#f5f5f0', pH: null, state: 'katı', category: 'tuz' },
  { id: 'agno3', name: 'Gümüş Nitrat', formula: 'AgNO₃', color: '#e8e8e8', pH: 5, state: 'katı', category: 'tuz' },
  { id: 'nacl', name: 'Sodyum Klorür', formula: 'NaCl', color: '#ffffff', pH: 7, state: 'katı', category: 'tuz' },
  { id: 'h2', name: 'Hidrojen', formula: 'H₂', color: '#f0f8ff', pH: null, state: 'gaz', category: 'ametal' },
  { id: 'o2', name: 'Oksijen', formula: 'O₂', color: '#e0f0ff', pH: null, state: 'gaz', category: 'ametal' },
  { id: 'fe', name: 'Demir', formula: 'Fe', color: '#8b8b8b', pH: null, state: 'katı', category: 'metal' },
  { id: 'cuso4', name: 'Bakır Sülfat', formula: 'CuSO₄', color: '#4da6ff', pH: 4, state: 'katı', category: 'tuz' },
  { id: 'ch4', name: 'Metan', formula: 'CH₄', color: '#f0fff0', pH: null, state: 'gaz', category: 'organik' },
  { id: 'mg', name: 'Magnezyum', formula: 'Mg', color: '#d0d0d0', pH: null, state: 'katı', category: 'metal' },
  { id: 'co2', name: 'Karbondioksit', formula: 'CO₂', color: '#f0f0f0', pH: null, state: 'gaz', category: 'ametal' },
  { id: 'cacl2', name: 'Kalsiyum Klorür', formula: 'CaCl₂', color: '#f8f8f8', pH: 7, state: 'katı', category: 'tuz' },
  { id: 'agcl', name: 'Gümüş Klorür', formula: 'AgCl', color: '#f5f5f5', pH: null, state: 'katı', category: 'tuz' },
  { id: 'nano3', name: 'Sodyum Nitrat', formula: 'NaNO₃', color: '#f8f8ff', pH: 7, state: 'katı', category: 'tuz' },
  { id: 'feso4', name: 'Demir(II) Sülfat', formula: 'FeSO₄', color: '#90ee90', pH: 4, state: 'katı', category: 'tuz' },
  { id: 'cu', name: 'Bakır', formula: 'Cu', color: '#b87333', pH: null, state: 'katı', category: 'metal' },
  { id: 'mgcl2', name: 'Magnezyum Klorür', formula: 'MgCl₂', color: '#f0f0f0', pH: 7, state: 'katı', category: 'tuz' },
]

// --- Chemical Reactions ---
export const reactions = [
  {
    id: 'neutralization',
    name: 'Nötrleşme Tepkimesi',
    reactant1: 'hcl',
    reactant2: 'naoh',
    equation: 'HCl + NaOH → NaCl + H₂O',
    products: ['nacl', 'h2o'],
    type: 'Nötrleşme',
    observations: {
      colorChange: { from: '#e0f2e0', to: '#d4f1f9' },
      temperature: 'artar',
      gas: false,
      precipitate: false,
      explosion: false,
      glow: false,
    },
    description: 'Asit ve baz birleşerek tuz ve su oluşturur. Bu ekzotermik bir tepkimedir, yani ısı açığa çıkar.',
    educationalNote: 'Nötrleşme tepkimeleri günlük hayatta mide yanmasına karşı antasit kullanımında görülür.',
    difficulty: 'Kolay',
  },
  {
    id: 'alkali_water',
    name: 'Alkali Metal + Su',
    reactant1: 'na',
    reactant2: 'h2o',
    equation: 'Na + H₂O → NaOH + H₂↑',
    products: ['naoh', 'h2'],
    type: 'Tek Yer Değiştirme',
    observations: {
      colorChange: { from: '#c0c0c0', to: '#f0f0ff' },
      temperature: 'çok artar',
      gas: true,
      precipitate: false,
      explosion: true,
      glow: true,
    },
    description: 'Sodyum metal suyla şiddetli tepkime verir, hidrojen gazı çıkar ve patlayıcı olabilir!',
    educationalNote: 'Alkali metaller periyodik tablonun 1. grubundadır ve çok reaktiftir. Suda patlarlar!',
    difficulty: 'Tehlikeli',
  },
  {
    id: 'marble_acid',
    name: 'Mermer + Asit',
    reactant1: 'caco3',
    reactant2: 'hcl',
    equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
    products: ['cacl2', 'h2o', 'co2'],
    type: 'Çift Yer Değiştirme',
    observations: {
      colorChange: { from: '#f5f5f0', to: '#f8f8f8' },
      temperature: 'hafif artar',
      gas: true,
      precipitate: false,
      explosion: false,
      glow: false,
    },
    description: 'Kalsiyum karbonat (mermer) asitle tepkime verir, karbondioksit gazı çıkar ve köpürme gözlenir.',
    educationalNote: 'Asit yağmurları mermeri aşındırır. Tarihi yapılar bu nedenle zarar görür.',
    difficulty: 'Kolay',
  },
  {
    id: 'precipitation',
    name: 'Çökelme Tepkimesi',
    reactant1: 'agno3',
    reactant2: 'nacl',
    equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
    products: ['agcl', 'nano3'],
    type: 'Çift Yer Değiştirme',
    observations: {
      colorChange: { from: '#e8e8e8', to: '#ffffff' },
      temperature: 'sabit',
      gas: false,
      precipitate: true,
      explosion: false,
      glow: false,
    },
    description: 'Gümüş nitrat ve sodyum klorür çözeltileri karıştırıldığında beyaz gümüş klorür çökeleği oluşur.',
    educationalNote: 'Çökelme tepkimeleri su arıtımında ve analitik kimyada sıklıkla kullanılır.',
    difficulty: 'Orta',
  },
  {
    id: 'hydrogen_combustion',
    name: 'Hidrojen Yanması',
    reactant1: 'h2',
    reactant2: 'o2',
    equation: '2H₂ + O₂ → 2H₂O',
    products: ['h2o'],
    type: 'Yanma',
    observations: {
      colorChange: { from: '#f0f8ff', to: '#d4f1f9' },
      temperature: 'çok artar',
      gas: false,
      precipitate: false,
      explosion: true,
      glow: true,
    },
    description: 'Hidrojen oksijen ile yanarak su oluşturur. Çok ekzotermik bir tepkimedir.',
    educationalNote: 'Hidrojen yakıt hücreleri temiz enerji kaynağı olarak gelecekte önemli rol oynayacak.',
    difficulty: 'Tehlikeli',
  },
  {
    id: 'displacement',
    name: 'Yer Değiştirme',
    reactant1: 'fe',
    reactant2: 'cuso4',
    equation: 'Fe + CuSO₄ → FeSO₄ + Cu',
    products: ['feso4', 'cu'],
    type: 'Tek Yer Değiştirme',
    observations: {
      colorChange: { from: '#4da6ff', to: '#90ee90' },
      temperature: 'hafif artar',
      gas: false,
      precipitate: true,
      explosion: false,
      glow: false,
    },
    description: 'Demir, bakır sülfat çözeltisindeki bakırın yerini alır. Çözelti maviden yeşile döner, bakır metal olarak çöker.',
    educationalNote: 'Aktiflik sırası: Metal ne kadar aktifse, daha az aktif metalin tuzlarından onun yerini alır.',
    difficulty: 'Orta',
  },
  {
    id: 'methane_combustion',
    name: 'Metan Yanması',
    reactant1: 'ch4',
    reactant2: 'o2',
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    products: ['co2', 'h2o'],
    type: 'Yanma',
    observations: {
      colorChange: { from: '#f0fff0', to: '#f0f0f0' },
      temperature: 'çok artar',
      gas: true,
      precipitate: false,
      explosion: false,
      glow: true,
    },
    description: 'Metan (doğal gaz) yanar, karbondioksit ve su buharı oluşur. Mavi bir alev gözlenir.',
    educationalNote: 'Evlerdeki doğal gaz başlıca metandır. Yanma tepkimesiyle ısınma sağlanır.',
    difficulty: 'Kolay',
  },
  {
    id: 'metal_acid',
    name: 'Metal + Asit',
    reactant1: 'mg',
    reactant2: 'hcl',
    equation: 'Mg + 2HCl → MgCl₂ + H₂↑',
    products: ['mgcl2', 'h2'],
    type: 'Tek Yer Değiştirme',
    observations: {
      colorChange: { from: '#d0d0d0', to: '#f0f0f0' },
      temperature: 'artar',
      gas: true,
      precipitate: false,
      explosion: false,
      glow: false,
    },
    description: 'Magnezyum seyreltik hidroklorik asitte çözünür, hidrojen gazı çıkar ve köpürme gözlenir.',
    educationalNote: 'Soy metaller (altın, platin) asitlerde çözünmez. Bu yüzden değerlidirler!',
    difficulty: 'Kolay',
  },
]

// --- pH Examples ---
export const phExamples = [
  { name: 'Mide Asidi', pH: 1.0, color: '#ff0000', icon: '🫁' },
  { name: 'Limon Suyu', pH: 2.0, color: '#ff3300', icon: '🍋' },
  { name: 'Sirke', pH: 2.9, color: '#ff5500', icon: '🫗' },
  { name: 'Portakal Suyu', pH: 3.5, color: '#ff8800', icon: '🍊' },
  { name: 'Domates Suyu', pH: 4.0, color: '#ffaa00', icon: '🍅' },
  { name: 'Kahve', pH: 5.0, color: '#cccc00', icon: '☕' },
  { name: 'Süt', pH: 6.5, color: '#99dd00', icon: '🥛' },
  { name: 'Saf Su', pH: 7.0, color: '#44ee00', icon: '💧' },
  { name: 'Kan', pH: 7.4, color: '#00cc44', icon: '🩸' },
  { name: 'Deniz Suyu', pH: 8.0, color: '#00aaaa', icon: '🌊' },
  { name: 'Kabartma Tozu', pH: 8.5, color: '#0088cc', icon: '🧁' },
  { name: 'Sabun', pH: 10.0, color: '#0055ee', icon: '🧼' },
  { name: 'Amonyak', pH: 11.5, color: '#3333ff', icon: '🧪' },
  { name: 'Çamaşır Suyu', pH: 12.5, color: '#6600ff', icon: '🫧' },
  { name: 'Tuz Ruhu (kons.)', pH: 0.5, color: '#cc0000', icon: '⚗️' },
]

// Universal indicator color function
export function getpHColor(pH) {
  if (pH <= 0) return '#ff0000'
  if (pH <= 1) return '#ff1100'
  if (pH <= 2) return '#ff3300'
  if (pH <= 3) return '#ff6600'
  if (pH <= 4) return '#ff9900'
  if (pH <= 5) return '#ffcc00'
  if (pH <= 6) return '#ccee00'
  if (pH <= 7) return '#66dd00'
  if (pH <= 8) return '#00cc44'
  if (pH <= 9) return '#00aaaa'
  if (pH <= 10) return '#0077cc'
  if (pH <= 11) return '#0044ee'
  if (pH <= 12) return '#3333ff'
  if (pH <= 13) return '#6600ff'
  return '#9900cc'
}

export function getpHLabel(pH) {
  if (pH < 3) return 'Kuvvetli Asit'
  if (pH < 6) return 'Zayıf Asit'
  if (pH < 6.5) return 'Hafif Asidik'
  if (pH <= 7.5) return 'Nötr'
  if (pH <= 8.5) return 'Hafif Bazik'
  if (pH < 11) return 'Zayıf Baz'
  return 'Kuvvetli Baz'
}

// --- Periodic Table Elements ---
// Categories: alkali, toprak-alkali, gecis, metal, yarimetal, ametal, halojen, soygaz, lantanit, aktinit
export const elementCategories = {
  alkali: { name: 'Alkali Metaller', color: '#ef4444', textColor: '#fecaca' },
  'toprak-alkali': { name: 'Toprak Alkali Metaller', color: '#f97316', textColor: '#fed7aa' },
  gecis: { name: 'Geçiş Metalleri', color: '#eab308', textColor: '#fef08a' },
  metal: { name: 'Diğer Metaller', color: '#22c55e', textColor: '#bbf7d0' },
  yarimetal: { name: 'Yarı Metaller', color: '#14b8a6', textColor: '#99f6e4' },
  ametal: { name: 'Ametaller', color: '#3b82f6', textColor: '#bfdbfe' },
  halojen: { name: 'Halojenler', color: '#8b5cf6', textColor: '#ddd6fe' },
  soygaz: { name: 'Soy Gazlar', color: '#ec4899', textColor: '#fbcfe8' },
  lantanit: { name: 'Lantanitler', color: '#f59e0b', textColor: '#fde68a' },
  aktinit: { name: 'Aktinitler', color: '#b45309', textColor: '#fcd34d' },
}

export const elements = [
  // Period 1
  { z: 1, symbol: 'H', name: 'Hidrojen', mass: 1.008, category: 'ametal', period: 1, group: 1, electron: '1s¹', col: 1, row: 1 },
  { z: 2, symbol: 'He', name: 'Helyum', mass: 4.003, category: 'soygaz', period: 1, group: 18, electron: '1s²', col: 18, row: 1 },
  // Period 2
  { z: 3, symbol: 'Li', name: 'Lityum', mass: 6.941, category: 'alkali', period: 2, group: 1, electron: '[He] 2s¹', col: 1, row: 2 },
  { z: 4, symbol: 'Be', name: 'Berilyum', mass: 9.012, category: 'toprak-alkali', period: 2, group: 2, electron: '[He] 2s²', col: 2, row: 2 },
  { z: 5, symbol: 'B', name: 'Bor', mass: 10.81, category: 'yarimetal', period: 2, group: 13, electron: '[He] 2s² 2p¹', col: 13, row: 2 },
  { z: 6, symbol: 'C', name: 'Karbon', mass: 12.01, category: 'ametal', period: 2, group: 14, electron: '[He] 2s² 2p²', col: 14, row: 2 },
  { z: 7, symbol: 'N', name: 'Azot', mass: 14.01, category: 'ametal', period: 2, group: 15, electron: '[He] 2s² 2p³', col: 15, row: 2 },
  { z: 8, symbol: 'O', name: 'Oksijen', mass: 16.00, category: 'ametal', period: 2, group: 16, electron: '[He] 2s² 2p⁴', col: 16, row: 2 },
  { z: 9, symbol: 'F', name: 'Flor', mass: 19.00, category: 'halojen', period: 2, group: 17, electron: '[He] 2s² 2p⁵', col: 17, row: 2 },
  { z: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, category: 'soygaz', period: 2, group: 18, electron: '[He] 2s² 2p⁶', col: 18, row: 2 },
  // Period 3
  { z: 11, symbol: 'Na', name: 'Sodyum', mass: 22.99, category: 'alkali', period: 3, group: 1, electron: '[Ne] 3s¹', col: 1, row: 3 },
  { z: 12, symbol: 'Mg', name: 'Magnezyum', mass: 24.31, category: 'toprak-alkali', period: 3, group: 2, electron: '[Ne] 3s²', col: 2, row: 3 },
  { z: 13, symbol: 'Al', name: 'Alüminyum', mass: 26.98, category: 'metal', period: 3, group: 13, electron: '[Ne] 3s² 3p¹', col: 13, row: 3 },
  { z: 14, symbol: 'Si', name: 'Silisyum', mass: 28.09, category: 'yarimetal', period: 3, group: 14, electron: '[Ne] 3s² 3p²', col: 14, row: 3 },
  { z: 15, symbol: 'P', name: 'Fosfor', mass: 30.97, category: 'ametal', period: 3, group: 15, electron: '[Ne] 3s² 3p³', col: 15, row: 3 },
  { z: 16, symbol: 'S', name: 'Kükürt', mass: 32.07, category: 'ametal', period: 3, group: 16, electron: '[Ne] 3s² 3p⁴', col: 16, row: 3 },
  { z: 17, symbol: 'Cl', name: 'Klor', mass: 35.45, category: 'halojen', period: 3, group: 17, electron: '[Ne] 3s² 3p⁵', col: 17, row: 3 },
  { z: 18, symbol: 'Ar', name: 'Argon', mass: 39.95, category: 'soygaz', period: 3, group: 18, electron: '[Ne] 3s² 3p⁶', col: 18, row: 3 },
  // Period 4
  { z: 19, symbol: 'K', name: 'Potasyum', mass: 39.10, category: 'alkali', period: 4, group: 1, electron: '[Ar] 4s¹', col: 1, row: 4 },
  { z: 20, symbol: 'Ca', name: 'Kalsiyum', mass: 40.08, category: 'toprak-alkali', period: 4, group: 2, electron: '[Ar] 4s²', col: 2, row: 4 },
  { z: 21, symbol: 'Sc', name: 'Skandiyum', mass: 44.96, category: 'gecis', period: 4, group: 3, electron: '[Ar] 3d¹ 4s²', col: 3, row: 4 },
  { z: 22, symbol: 'Ti', name: 'Titanyum', mass: 47.87, category: 'gecis', period: 4, group: 4, electron: '[Ar] 3d² 4s²', col: 4, row: 4 },
  { z: 23, symbol: 'V', name: 'Vanadyum', mass: 50.94, category: 'gecis', period: 4, group: 5, electron: '[Ar] 3d³ 4s²', col: 5, row: 4 },
  { z: 24, symbol: 'Cr', name: 'Krom', mass: 52.00, category: 'gecis', period: 4, group: 6, electron: '[Ar] 3d⁵ 4s¹', col: 6, row: 4 },
  { z: 25, symbol: 'Mn', name: 'Mangan', mass: 54.94, category: 'gecis', period: 4, group: 7, electron: '[Ar] 3d⁵ 4s²', col: 7, row: 4 },
  { z: 26, symbol: 'Fe', name: 'Demir', mass: 55.85, category: 'gecis', period: 4, group: 8, electron: '[Ar] 3d⁶ 4s²', col: 8, row: 4 },
  { z: 27, symbol: 'Co', name: 'Kobalt', mass: 58.93, category: 'gecis', period: 4, group: 9, electron: '[Ar] 3d⁷ 4s²', col: 9, row: 4 },
  { z: 28, symbol: 'Ni', name: 'Nikel', mass: 58.69, category: 'gecis', period: 4, group: 10, electron: '[Ar] 3d⁸ 4s²', col: 10, row: 4 },
  { z: 29, symbol: 'Cu', name: 'Bakır', mass: 63.55, category: 'gecis', period: 4, group: 11, electron: '[Ar] 3d¹⁰ 4s¹', col: 11, row: 4 },
  { z: 30, symbol: 'Zn', name: 'Çinko', mass: 65.38, category: 'gecis', period: 4, group: 12, electron: '[Ar] 3d¹⁰ 4s²', col: 12, row: 4 },
  { z: 31, symbol: 'Ga', name: 'Galyum', mass: 69.72, category: 'metal', period: 4, group: 13, electron: '[Ar] 3d¹⁰ 4s² 4p¹', col: 13, row: 4 },
  { z: 32, symbol: 'Ge', name: 'Germanyum', mass: 72.63, category: 'yarimetal', period: 4, group: 14, electron: '[Ar] 3d¹⁰ 4s² 4p²', col: 14, row: 4 },
  { z: 33, symbol: 'As', name: 'Arsenik', mass: 74.92, category: 'yarimetal', period: 4, group: 15, electron: '[Ar] 3d¹⁰ 4s² 4p³', col: 15, row: 4 },
  { z: 34, symbol: 'Se', name: 'Selenyum', mass: 78.97, category: 'ametal', period: 4, group: 16, electron: '[Ar] 3d¹⁰ 4s² 4p⁴', col: 16, row: 4 },
  { z: 35, symbol: 'Br', name: 'Brom', mass: 79.90, category: 'halojen', period: 4, group: 17, electron: '[Ar] 3d¹⁰ 4s² 4p⁵', col: 17, row: 4 },
  { z: 36, symbol: 'Kr', name: 'Kripton', mass: 83.80, category: 'soygaz', period: 4, group: 18, electron: '[Ar] 3d¹⁰ 4s² 4p⁶', col: 18, row: 4 },
  // Period 5
  { z: 37, symbol: 'Rb', name: 'Rubidyum', mass: 85.47, category: 'alkali', period: 5, group: 1, electron: '[Kr] 5s¹', col: 1, row: 5 },
  { z: 38, symbol: 'Sr', name: 'Stronsiyum', mass: 87.62, category: 'toprak-alkali', period: 5, group: 2, electron: '[Kr] 5s²', col: 2, row: 5 },
  { z: 39, symbol: 'Y', name: 'İtriyum', mass: 88.91, category: 'gecis', period: 5, group: 3, electron: '[Kr] 4d¹ 5s²', col: 3, row: 5 },
  { z: 40, symbol: 'Zr', name: 'Zirkonyum', mass: 91.22, category: 'gecis', period: 5, group: 4, electron: '[Kr] 4d² 5s²', col: 4, row: 5 },
  { z: 41, symbol: 'Nb', name: 'Niyobyum', mass: 92.91, category: 'gecis', period: 5, group: 5, electron: '[Kr] 4d⁴ 5s¹', col: 5, row: 5 },
  { z: 42, symbol: 'Mo', name: 'Molibden', mass: 95.95, category: 'gecis', period: 5, group: 6, electron: '[Kr] 4d⁵ 5s¹', col: 6, row: 5 },
  { z: 43, symbol: 'Tc', name: 'Teknesyum', mass: 98, category: 'gecis', period: 5, group: 7, electron: '[Kr] 4d⁵ 5s²', col: 7, row: 5 },
  { z: 44, symbol: 'Ru', name: 'Rutenyum', mass: 101.1, category: 'gecis', period: 5, group: 8, electron: '[Kr] 4d⁷ 5s¹', col: 8, row: 5 },
  { z: 45, symbol: 'Rh', name: 'Rodyum', mass: 102.9, category: 'gecis', period: 5, group: 9, electron: '[Kr] 4d⁸ 5s¹', col: 9, row: 5 },
  { z: 46, symbol: 'Pd', name: 'Paladyum', mass: 106.4, category: 'gecis', period: 5, group: 10, electron: '[Kr] 4d¹⁰', col: 10, row: 5 },
  { z: 47, symbol: 'Ag', name: 'Gümüş', mass: 107.9, category: 'gecis', period: 5, group: 11, electron: '[Kr] 4d¹⁰ 5s¹', col: 11, row: 5 },
  { z: 48, symbol: 'Cd', name: 'Kadmiyum', mass: 112.4, category: 'gecis', period: 5, group: 12, electron: '[Kr] 4d¹⁰ 5s²', col: 12, row: 5 },
  { z: 49, symbol: 'In', name: 'İndiyum', mass: 114.8, category: 'metal', period: 5, group: 13, electron: '[Kr] 4d¹⁰ 5s² 5p¹', col: 13, row: 5 },
  { z: 50, symbol: 'Sn', name: 'Kalay', mass: 118.7, category: 'metal', period: 5, group: 14, electron: '[Kr] 4d¹⁰ 5s² 5p²', col: 14, row: 5 },
  { z: 51, symbol: 'Sb', name: 'Antimon', mass: 121.8, category: 'yarimetal', period: 5, group: 15, electron: '[Kr] 4d¹⁰ 5s² 5p³', col: 15, row: 5 },
  { z: 52, symbol: 'Te', name: 'Tellür', mass: 127.6, category: 'yarimetal', period: 5, group: 16, electron: '[Kr] 4d¹⁰ 5s² 5p⁴', col: 16, row: 5 },
  { z: 53, symbol: 'I', name: 'İyot', mass: 126.9, category: 'halojen', period: 5, group: 17, electron: '[Kr] 4d¹⁰ 5s² 5p⁵', col: 17, row: 5 },
  { z: 54, symbol: 'Xe', name: 'Ksenon', mass: 131.3, category: 'soygaz', period: 5, group: 18, electron: '[Kr] 4d¹⁰ 5s² 5p⁶', col: 18, row: 5 },
  // Period 6
  { z: 55, symbol: 'Cs', name: 'Sezyum', mass: 132.9, category: 'alkali', period: 6, group: 1, electron: '[Xe] 6s¹', col: 1, row: 6 },
  { z: 56, symbol: 'Ba', name: 'Baryum', mass: 137.3, category: 'toprak-alkali', period: 6, group: 2, electron: '[Xe] 6s²', col: 2, row: 6 },
  // Lantanides (z: 57-71, displayed in separate row)
  { z: 57, symbol: 'La', name: 'Lantan', mass: 138.9, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 5d¹ 6s²', col: 3, row: 9 },
  { z: 58, symbol: 'Ce', name: 'Seryum', mass: 140.1, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f¹ 5d¹ 6s²', col: 4, row: 9 },
  { z: 59, symbol: 'Pr', name: 'Praseodimyum', mass: 140.9, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f³ 6s²', col: 5, row: 9 },
  { z: 60, symbol: 'Nd', name: 'Neodimyum', mass: 144.2, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f⁴ 6s²', col: 6, row: 9 },
  { z: 61, symbol: 'Pm', name: 'Prometyum', mass: 145, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f⁵ 6s²', col: 7, row: 9 },
  { z: 62, symbol: 'Sm', name: 'Samaryum', mass: 150.4, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f⁶ 6s²', col: 8, row: 9 },
  { z: 63, symbol: 'Eu', name: 'Evropiyum', mass: 152.0, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f⁷ 6s²', col: 9, row: 9 },
  { z: 64, symbol: 'Gd', name: 'Gadolinyum', mass: 157.3, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f⁷ 5d¹ 6s²', col: 10, row: 9 },
  { z: 65, symbol: 'Tb', name: 'Terbiyum', mass: 158.9, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f⁹ 6s²', col: 11, row: 9 },
  { z: 66, symbol: 'Dy', name: 'Disprosyum', mass: 162.5, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f¹⁰ 6s²', col: 12, row: 9 },
  { z: 67, symbol: 'Ho', name: 'Holmiyum', mass: 164.9, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f¹¹ 6s²', col: 13, row: 9 },
  { z: 68, symbol: 'Er', name: 'Erbiyum', mass: 167.3, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f¹² 6s²', col: 14, row: 9 },
  { z: 69, symbol: 'Tm', name: 'Tulyum', mass: 168.9, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f¹³ 6s²', col: 15, row: 9 },
  { z: 70, symbol: 'Yb', name: 'İterbiyum', mass: 173.0, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f¹⁴ 6s²', col: 16, row: 9 },
  { z: 71, symbol: 'Lu', name: 'Lütesyum', mass: 175.0, category: 'lantanit', period: 6, group: 3, electron: '[Xe] 4f¹⁴ 5d¹ 6s²', col: 17, row: 9 },
  // Continue Period 6
  { z: 72, symbol: 'Hf', name: 'Hafniyum', mass: 178.5, category: 'gecis', period: 6, group: 4, electron: '[Xe] 4f¹⁴ 5d² 6s²', col: 4, row: 6 },
  { z: 73, symbol: 'Ta', name: 'Tantal', mass: 180.9, category: 'gecis', period: 6, group: 5, electron: '[Xe] 4f¹⁴ 5d³ 6s²', col: 5, row: 6 },
  { z: 74, symbol: 'W', name: 'Tungsten', mass: 183.8, category: 'gecis', period: 6, group: 6, electron: '[Xe] 4f¹⁴ 5d⁴ 6s²', col: 6, row: 6 },
  { z: 75, symbol: 'Re', name: 'Renyum', mass: 186.2, category: 'gecis', period: 6, group: 7, electron: '[Xe] 4f¹⁴ 5d⁵ 6s²', col: 7, row: 6 },
  { z: 76, symbol: 'Os', name: 'Osmiyum', mass: 190.2, category: 'gecis', period: 6, group: 8, electron: '[Xe] 4f¹⁴ 5d⁶ 6s²', col: 8, row: 6 },
  { z: 77, symbol: 'Ir', name: 'İridyum', mass: 192.2, category: 'gecis', period: 6, group: 9, electron: '[Xe] 4f¹⁴ 5d⁷ 6s²', col: 9, row: 6 },
  { z: 78, symbol: 'Pt', name: 'Platin', mass: 195.1, category: 'gecis', period: 6, group: 10, electron: '[Xe] 4f¹⁴ 5d⁹ 6s¹', col: 10, row: 6 },
  { z: 79, symbol: 'Au', name: 'Altın', mass: 197.0, category: 'gecis', period: 6, group: 11, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', col: 11, row: 6 },
  { z: 80, symbol: 'Hg', name: 'Cıva', mass: 200.6, category: 'gecis', period: 6, group: 12, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', col: 12, row: 6 },
  { z: 81, symbol: 'Tl', name: 'Talyum', mass: 204.4, category: 'metal', period: 6, group: 13, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', col: 13, row: 6 },
  { z: 82, symbol: 'Pb', name: 'Kurşun', mass: 207.2, category: 'metal', period: 6, group: 14, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', col: 14, row: 6 },
  { z: 83, symbol: 'Bi', name: 'Bizmut', mass: 209.0, category: 'metal', period: 6, group: 15, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', col: 15, row: 6 },
  { z: 84, symbol: 'Po', name: 'Polonyum', mass: 209, category: 'yarimetal', period: 6, group: 16, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', col: 16, row: 6 },
  { z: 85, symbol: 'At', name: 'Astatin', mass: 210, category: 'halojen', period: 6, group: 17, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', col: 17, row: 6 },
  { z: 86, symbol: 'Rn', name: 'Radon', mass: 222, category: 'soygaz', period: 6, group: 18, electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', col: 18, row: 6 },
  // Period 7
  { z: 87, symbol: 'Fr', name: 'Fransiyum', mass: 223, category: 'alkali', period: 7, group: 1, electron: '[Rn] 7s¹', col: 1, row: 7 },
  { z: 88, symbol: 'Ra', name: 'Radyum', mass: 226, category: 'toprak-alkali', period: 7, group: 2, electron: '[Rn] 7s²', col: 2, row: 7 },
  // Actinides (z: 89-103, displayed in separate row)
  { z: 89, symbol: 'Ac', name: 'Aktinyum', mass: 227, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 6d¹ 7s²', col: 3, row: 10 },
  { z: 90, symbol: 'Th', name: 'Toryum', mass: 232.0, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 6d² 7s²', col: 4, row: 10 },
  { z: 91, symbol: 'Pa', name: 'Protaktinyum', mass: 231.0, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f² 6d¹ 7s²', col: 5, row: 10 },
  { z: 92, symbol: 'U', name: 'Uranyum', mass: 238.0, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f³ 6d¹ 7s²', col: 6, row: 10 },
  { z: 93, symbol: 'Np', name: 'Neptünyum', mass: 237, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f⁴ 6d¹ 7s²', col: 7, row: 10 },
  { z: 94, symbol: 'Pu', name: 'Plütonyum', mass: 244, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f⁶ 7s²', col: 8, row: 10 },
  { z: 95, symbol: 'Am', name: 'Amerikyum', mass: 243, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f⁷ 7s²', col: 9, row: 10 },
  { z: 96, symbol: 'Cm', name: 'Küriyum', mass: 247, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f⁷ 6d¹ 7s²', col: 10, row: 10 },
  { z: 97, symbol: 'Bk', name: 'Berkelyum', mass: 247, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f⁹ 7s²', col: 11, row: 10 },
  { z: 98, symbol: 'Cf', name: 'Kaliforniyum', mass: 251, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f¹⁰ 7s²', col: 12, row: 10 },
  { z: 99, symbol: 'Es', name: 'Aynştaynyum', mass: 252, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f¹¹ 7s²', col: 13, row: 10 },
  { z: 100, symbol: 'Fm', name: 'Fermiyum', mass: 257, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f¹² 7s²', col: 14, row: 10 },
  { z: 101, symbol: 'Md', name: 'Mendelevyum', mass: 258, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f¹³ 7s²', col: 15, row: 10 },
  { z: 102, symbol: 'No', name: 'Nobelyum', mass: 259, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f¹⁴ 7s²', col: 16, row: 10 },
  { z: 103, symbol: 'Lr', name: 'Lavrensiyum', mass: 266, category: 'aktinit', period: 7, group: 3, electron: '[Rn] 5f¹⁴ 7s² 7p¹', col: 17, row: 10 },
  // Continue Period 7
  { z: 104, symbol: 'Rf', name: 'Rutherfordiyum', mass: 267, category: 'gecis', period: 7, group: 4, electron: '[Rn] 5f¹⁴ 6d² 7s²', col: 4, row: 7 },
  { z: 105, symbol: 'Db', name: 'Dubnyum', mass: 268, category: 'gecis', period: 7, group: 5, electron: '[Rn] 5f¹⁴ 6d³ 7s²', col: 5, row: 7 },
  { z: 106, symbol: 'Sg', name: 'Seaborgiyum', mass: 269, category: 'gecis', period: 7, group: 6, electron: '[Rn] 5f¹⁴ 6d⁴ 7s²', col: 6, row: 7 },
  { z: 107, symbol: 'Bh', name: 'Bohriyum', mass: 270, category: 'gecis', period: 7, group: 7, electron: '[Rn] 5f¹⁴ 6d⁵ 7s²', col: 7, row: 7 },
  { z: 108, symbol: 'Hs', name: 'Hassiyum', mass: 277, category: 'gecis', period: 7, group: 8, electron: '[Rn] 5f¹⁴ 6d⁶ 7s²', col: 8, row: 7 },
  { z: 109, symbol: 'Mt', name: 'Maytneriyum', mass: 278, category: 'gecis', period: 7, group: 9, electron: '[Rn] 5f¹⁴ 6d⁷ 7s²', col: 9, row: 7 },
  { z: 110, symbol: 'Ds', name: 'Darmstadtiyum', mass: 281, category: 'gecis', period: 7, group: 10, electron: '[Rn] 5f¹⁴ 6d⁸ 7s²', col: 10, row: 7 },
  { z: 111, symbol: 'Rg', name: 'Röntgenyum', mass: 282, category: 'gecis', period: 7, group: 11, electron: '[Rn] 5f¹⁴ 6d⁹ 7s²', col: 11, row: 7 },
  { z: 112, symbol: 'Cn', name: 'Kopernikyum', mass: 285, category: 'gecis', period: 7, group: 12, electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', col: 12, row: 7 },
  { z: 113, symbol: 'Nh', name: 'Nihonyum', mass: 286, category: 'metal', period: 7, group: 13, electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', col: 13, row: 7 },
  { z: 114, symbol: 'Fl', name: 'Flerovyum', mass: 289, category: 'metal', period: 7, group: 14, electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', col: 14, row: 7 },
  { z: 115, symbol: 'Mc', name: 'Moskovyum', mass: 290, category: 'metal', period: 7, group: 15, electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', col: 15, row: 7 },
  { z: 116, symbol: 'Lv', name: 'Livermoryum', mass: 293, category: 'metal', period: 7, group: 16, electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', col: 16, row: 7 },
  { z: 117, symbol: 'Ts', name: 'Tennessine', mass: 294, category: 'halojen', period: 7, group: 17, electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', col: 17, row: 7 },
  { z: 118, symbol: 'Og', name: 'Oganesson', mass: 294, category: 'soygaz', period: 7, group: 18, electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', col: 18, row: 7 },
]

// Electron shell configuration for atom model visualization
export function getElectronShells(z) {
  const shellConfig = [2, 8, 18, 32, 32, 18, 8]
  const shells = []
  let remaining = z
  for (let i = 0; i < shellConfig.length && remaining > 0; i++) {
    const electrons = Math.min(remaining, shellConfig[i])
    shells.push(electrons)
    remaining -= electrons
  }
  return shells
}

// Titration data
export const titrationConfig = {
  acid: { name: 'HCl', concentration: 0.1, volume: 50 }, // 50 mL of 0.1 M HCl
  base: { name: 'NaOH', concentration: 0.1 }, // 0.1 M NaOH in burette
  indicator: 'Fenolftalein',
  equivalenceVolume: 50, // mL of NaOH needed
}

// Calculate pH during titration of strong acid with strong base
export function calculateTitrationPH(volumeBase, config = titrationConfig) {
  const { acid, base } = config
  const molesAcid = acid.concentration * acid.volume / 1000
  const molesBase = base.concentration * volumeBase / 1000
  const totalVolume = (acid.volume + volumeBase) / 1000

  if (molesBase < molesAcid) {
    // Before equivalence point
    const excessAcid = molesAcid - molesBase
    const concentration = excessAcid / totalVolume
    return -Math.log10(concentration)
  } else if (Math.abs(molesBase - molesAcid) < 0.0001) {
    // At equivalence point
    return 7.0
  } else {
    // After equivalence point
    const excessBase = molesBase - molesAcid
    const concentration = excessBase / totalVolume
    const pOH = -Math.log10(concentration)
    return 14 - pOH
  }
}

// Titration indicator color
export function getTitrationIndicatorColor(pH) {
  // Phenolphthalein: colorless below pH 8.2, pink above
  if (pH < 8.2) return '#f5f5dc' // colorless/slightly yellow
  if (pH < 10) {
    const t = (pH - 8.2) / 1.8
    // Transition from colorless to pink
    const r = Math.round(245 + (255 - 245) * t)
    const g = Math.round(245 - (245 - 105) * t)
    const b = Math.round(220 - (220 - 180) * t)
    return `rgb(${r},${g},${b})`
  }
  return '#ff69b4' // hot pink
}
