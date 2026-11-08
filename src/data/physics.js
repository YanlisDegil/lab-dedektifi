// ============================================================
// Physics Data & Constants — Laboratuvar Dedektifi
// ============================================================

// --------------- Gravity presets for planets ----------------
export const PLANET_GRAVITY = [
  { id: 'earth',   label: 'Dünya',    g: 9.81,  color: '#3b82f6' },
  { id: 'moon',    label: 'Ay',       g: 1.62,  color: '#94a3b8' },
  { id: 'mars',    label: 'Mars',     g: 3.72,  color: '#ef4444' },
  { id: 'jupiter', label: 'Jüpiter',  g: 24.79, color: '#f59e0b' },
  { id: 'venus',   label: 'Venüs',    g: 8.87,  color: '#f97316' },
  { id: 'saturn',  label: 'Satürn',   g: 10.44, color: '#eab308' },
  { id: 'mercury', label: 'Merkür',   g: 3.7,   color: '#a3a3a3' },
]

// --------------- Resistor color code data ------------------
export const RESISTOR_COLORS = {
  0: { name: 'Siyah',    hex: '#1a1a1a' },
  1: { name: 'Kahverengi', hex: '#8B4513' },
  2: { name: 'Kırmızı',  hex: '#FF0000' },
  3: { name: 'Turuncu',   hex: '#FF8C00' },
  4: { name: 'Sarı',      hex: '#FFD700' },
  5: { name: 'Yeşil',     hex: '#00AA00' },
  6: { name: 'Mavi',      hex: '#0000FF' },
  7: { name: 'Mor',       hex: '#8B00FF' },
  8: { name: 'Gri',       hex: '#808080' },
  9: { name: 'Beyaz',     hex: '#FFFFFF' },
}

// --------------- Common circuit configurations ---------------
export const CIRCUIT_CONFIGS = [
  {
    id: 'simple',
    name: 'Basit Devre',
    description: '1 pil + 1 direnç. Ohm Yasasını gözlemleyin.',
    voltage: 9,
    resistors: [100],
    type: 'series',
    icon: '⚡',
  },
  {
    id: 'series',
    name: 'Seri Bağlı Devre',
    description: '3 direnç seri bağlı. Toplam direnç = R₁ + R₂ + R₃',
    voltage: 12,
    resistors: [100, 220, 330],
    type: 'series',
    icon: '🔗',
  },
  {
    id: 'parallel',
    name: 'Paralel Bağlı Devre',
    description: '3 direnç paralel bağlı. 1/R_top = 1/R₁ + 1/R₂ + 1/R₃',
    voltage: 9,
    resistors: [100, 200, 300],
    type: 'parallel',
    icon: '🔀',
  },
]

// --------------- Physics formulas (display) ------------------
export const FORMULAS = {
  ohm:               'V = I × R',
  power:             'P = V × I = I² × R',
  seriesResistance:  'R_toplam = R₁ + R₂ + R₃ + …',
  parallelResistance:'1/R_toplam = 1/R₁ + 1/R₂ + 1/R₃ + …',
  pendulumPeriod:    'T = 2π √(L / g)',
  pendulumFrequency: 'f = 1 / T',
  pendulumVmax:      'v_max = √(2gL(1 − cos θ₀))',
  waveEquation:      'y = A sin(2πft − 2πx/λ)',
  waveSpeed:         'v = f × λ',
  projectileRange:   'R = v₀² sin(2θ) / g',
  projectileMaxH:    'H = v₀² sin²(θ) / (2g)',
  projectileTime:    'T = 2v₀ sin(θ) / g',
  faradayLaw:        'EMF = −dΦ/dt',
  kineticEnergy:     'KE = ½mv²',
  potentialEnergy:   'PE = mgh',
}

// --------------- Unit helper --------------------------------
export function formatUnit(value, unit, decimals = 2) {
  if (value === undefined || value === null || isNaN(value)) return '—'
  return `${Number(value).toFixed(decimals)} ${unit}`
}

export function formatSI(value, unit, decimals = 2) {
  const abs = Math.abs(value)
  if (abs >= 1e6)  return `${(value / 1e6).toFixed(decimals)} M${unit}`
  if (abs >= 1e3)  return `${(value / 1e3).toFixed(decimals)} k${unit}`
  if (abs >= 1)    return `${value.toFixed(decimals)} ${unit}`
  if (abs >= 1e-3) return `${(value * 1e3).toFixed(decimals)} m${unit}`
  if (abs >= 1e-6) return `${(value * 1e6).toFixed(decimals)} μ${unit}`
  return `${value.toExponential(decimals)} ${unit}`
}

// --------------- Physics calculators -------------------------

/** Calculate total resistance for series or parallel configs */
export function calcTotalResistance(resistors, type) {
  if (!resistors || resistors.length === 0) return 0
  if (type === 'series') {
    return resistors.reduce((a, b) => a + b, 0)
  }
  // parallel
  const invSum = resistors.reduce((acc, r) => acc + 1 / r, 0)
  return invSum === 0 ? Infinity : 1 / invSum
}

/** Ohm's law derived values */
export function calcCircuit(voltage, totalResistance) {
  const current = totalResistance > 0 ? voltage / totalResistance : 0
  const power = voltage * current
  return { voltage, current, totalResistance, power }
}

/** Pendulum calculations */
export function calcPendulum(length, gravity, angle0Deg, mass) {
  const angle0 = (angle0Deg * Math.PI) / 180
  const period = 2 * Math.PI * Math.sqrt(length / gravity)
  const frequency = 1 / period
  const vMax = Math.sqrt(2 * gravity * length * (1 - Math.cos(angle0)))
  const hMax = length * (1 - Math.cos(angle0))
  const peMax = mass * gravity * hMax
  const keMax = 0.5 * mass * vMax * vMax
  return { period, frequency, vMax, hMax, peMax, keMax }
}

/** Projectile motion calculations */
export function calcProjectile(v0, angleDeg, gravity) {
  const angle = (angleDeg * Math.PI) / 180
  const range = (v0 * v0 * Math.sin(2 * angle)) / gravity
  const maxHeight = (v0 * v0 * Math.sin(angle) * Math.sin(angle)) / (2 * gravity)
  const flightTime = (2 * v0 * Math.sin(angle)) / gravity
  return { range, maxHeight, flightTime }
}

/** Get projectile position at time t */
export function projectilePos(v0, angleDeg, gravity, t, airResistance = false) {
  const angle = (angleDeg * Math.PI) / 180
  const vx = v0 * Math.cos(angle)
  const vy = v0 * Math.sin(angle)
  if (!airResistance) {
    const x = vx * t
    const y = vy * t - 0.5 * gravity * t * t
    return { x, y: Math.max(0, y) }
  }
  // simple linear drag approximation
  const k = 0.05
  const x = (vx / k) * (1 - Math.exp(-k * t))
  const y = ((vy + gravity / k) / k) * (1 - Math.exp(-k * t)) - (gravity * t) / k
  return { x, y: Math.max(0, y) }
}

// --------------- Wave calculations ---------------------------
export function waveY(amplitude, frequency, time, x, wavelength) {
  return amplitude * Math.sin(2 * Math.PI * frequency * time - (2 * Math.PI * x) / wavelength)
}

// --------------- Educational info panels ---------------------
export const EXPERIMENT_INFO = {
  circuits: {
    title: 'Elektrik Devreleri',
    description:
      'Elektrik devreleri, elektrik akımının iletkenler üzerinden akmasını sağlayan kapalı döngülerdir. ' +
      'Ohm Yasası (V = IR) gerilim, akım ve direnç arasındaki temel ilişkiyi tanımlar.',
    facts: [
      'Seri devrelerde toplam direnç, dirençlerin toplamıdır.',
      'Paralel devrelerde toplam direnç, tek tek dirençlerden küçüktür.',
      'Güç (Watt) = Gerilim × Akım formülüyle hesaplanır.',
      'Bakır, en iyi elektrik iletkenlerinden biridir.',
    ],
  },
  pendulum: {
    title: 'Sarkaç ve Mekanik',
    description:
      'Basit sarkaç, küçük açılar için harmonik hareket yapar. ' +
      'Salınım periyodu yalnızca ip uzunluğuna ve yerçekimine bağlıdır; kütleye bağlı değildir.',
    facts: [
      'Galileo, sarkaç hareketini katedralin avizesini gözleyerek keşfetmiştir.',
      'Periyot formülü: T = 2π√(L/g)',
      'Kütle periyodu etkilemez (küçük açılar için).',
      'Enerji korunumu: PE + KE = sabit',
    ],
  },
  waves: {
    title: 'Dalga Mekaniği',
    description:
      'Dalgalar, enerjiyi bir noktadan diğerine madde taşımadan ileten bozunumlardır. ' +
      'Enine dalgalarda titreşim yönü hareket yönüne diktir.',
    facts: [
      'Dalga hızı = Frekans × Dalga boyu (v = fλ)',
      'Girişim: İki dalga üst üste geldiğinde yapıcı veya yıkıcı girişim oluşur.',
      'Duran dalgalar, iki zıt yönde ilerleyen eşit dalganın üst üste gelmesiyle oluşur.',
      'Ses dalgaları boyuna, ışık dalgaları enine dalgalardır.',
    ],
  },
  magnetism: {
    title: 'Manyetizma ve Elektromanyetik',
    description:
      'Manyetik alan, hareketli yüklerin veya mıknatısların çevresinde oluşan kuvvet alanıdır. ' +
      'Faraday Yasası, değişen manyetik akının elektrik alanı indüklediğini gösterir.',
    facts: [
      'Her mıknatısın kuzey ve güney kutbu vardır; tek kutup yoktur.',
      'Solenoidin içindeki alan neredeyse homojendir.',
      "Faraday'ın indüksiyon yasası: EMF = −dΦ/dt",
      "Dünya'nın manyetik alanı bizi güneş rüzgârından korur.",
    ],
  },
  projectile: {
    title: 'Atış Hareketleri',
    description:
      'Eğik atış, bir cismin belirli bir açıyla fırlatılmasıyla oluşan parabolik harekettir. ' +
      'Yatay ve düşey hareketler birbirinden bağımsızdır.',
    facts: [
      'Maksimum menzil 45° atış açısında elde edilir (hava direnci yok ise).',
      'Yatay hız sabittir (hava direnci ihmal edildiğinde).',
      'Düşey hareket serbest düşme gibidir.',
      'Menzil = v₀²sin(2θ)/g',
    ],
  },
}
