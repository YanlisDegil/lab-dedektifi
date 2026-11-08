import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import {
  chemicals,
  reactions,
  phExamples,
  getpHColor,
  getpHLabel,
  elements,
  elementCategories,
  getElectronShells,
  calculateTitrationPH,
  getTitrationIndicatorColor,
} from '../data/chemicals'
import {
  LabBench,
  Beaker,
  ErlenmeyerFlask,
  BunsenBurner,
  BuretteSetup,
  PHMeterDevice,
  LitmusPaper,
  BohrAtom,
} from '../components/chemistry/LabEquipment'
import {
  GiAtom,
  GiBubbles,
  GiChemicalDrop,
  GiFlame,
  GiThermometerHot,
} from 'react-icons/gi'
import { FiPlay, FiRotateCcw, FiInfo, FiSliders } from 'react-icons/fi'

const TABS = [
  { id: 'reactions', label: 'Kimyasal Reaksiyonlar', icon: GiBubbles },
  { id: 'ph', label: 'pH & Asit-Baz', icon: GiChemicalDrop },
  { id: 'titration', label: 'Titrasyon Deneyi', icon: FiSliders },
  { id: 'periodic', label: '3D Periyodik Tablo', icon: GiAtom },
]

export default function ChemistryLab() {
  const [activeTab, setActiveTab] = useState('reactions')

  return (
    <div className="pt-16 min-h-screen bg-dark-950 flex flex-col">
      {/* Tab Navigation Header */}
      <div className="bg-dark-900/80 border-b border-dark-800 backdrop-blur sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-2">
          <div className="flex space-x-2">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-chemistry text-dark-950 shadow-lg shadow-chemistry/20'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-xs text-dark-400">
            <span className="w-2 h-2 rounded-full bg-chemistry animate-pulse" />
            <span>Sanal Kimya Laboratuvarı Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'reactions' && <ReactionsModule />}
        {activeTab === 'ph' && <PHModule />}
        {activeTab === 'titration' && <TitrationModule />}
        {activeTab === 'periodic' && <PeriodicTableModule />}
      </div>
    </div>
  )
}

// ============================================================
// 1. REACTIONS MODULE
// ============================================================
function ReactionsModule() {
  const [selectedReactionId, setSelectedReactionId] = useState(reactions[0].id)
  const [isReacting, setIsReacting] = useState(false)
  const [progress, setProgress] = useState(0) // 0 to 1
  const [burnerOn, setBurnerOn] = useState(false)
  const [temperature, setTemperature] = useState(25) // °C

  const currentReaction = useMemo(
    () => reactions.find((r) => r.id === selectedReactionId) || reactions[0],
    [selectedReactionId]
  )

  const handleStartReaction = () => {
    setIsReacting(true)
    setProgress(0)
  }

  const handleReset = () => {
    setIsReacting(false)
    setProgress(0)
    setTemperature(25)
  }

  // Reaction animation progress
  useEffect(() => {
    if (!isReacting) return
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(timer)
          return 1
        }
        return prev + 0.04
      })
    }, 100)
    return () => clearInterval(timer)
  }, [isReacting])

  // Heat effect on temperature
  useEffect(() => {
    if (burnerOn) {
      const interval = setInterval(() => {
        setTemperature((t) => Math.min(t + 2, 100))
      }, 200)
      return () => clearInterval(interval)
    } else {
      const interval = setInterval(() => {
        setTemperature((t) => Math.max(t - 1, 25))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [burnerOn])

  // Liquid color interpolation
  const liquidColor = useMemo(() => {
    if (progress === 0) return '#60a5fa'
    if (currentReaction.observations?.precipitate) {
      return '#e2e8f0'
    }
    return progress > 0.5 ? '#10b981' : '#f59e0b'
  }, [progress, currentReaction])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* 3D Canvas Area */}
      <div className="lg:col-span-2 glass rounded-2xl h-[520px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-dark-300">
          Reaksiyon: <span className="text-chemistry font-bold">{currentReaction.name}</span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs">
          <GiThermometerHot className="text-amber-400 text-base" />
          <span className="text-white font-mono font-bold">{temperature} °C</span>
        </div>

        <Canvas camera={{ position: [0, 1.2, 4.5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-5, 5, -5]} intensity={0.4} color="#10b981" />
          <Suspense fallback={null}>
            <LabBench position={[0, -1.2, 0]} />
            {/* Main Reaction Beaker */}
            <Beaker
              position={[0, -0.45, 0]}
              liquidLevel={0.65}
              liquidColor={liquidColor}
              showBubbles={isReacting && (currentReaction.observations?.gasRelease || burnerOn)}
              showPrecipitate={isReacting && progress > 0.7 && currentReaction.observations?.precipitate}
              precipitateColor="#ffffff"
            />
            {/* Bunsen burner on the side */}
            <BunsenBurner
              position={[2.0, -0.5, 0]}
              isLit={burnerOn}
              flameIntensity={1}
            />
            {/* Reagent Erlenmeyer Flask */}
            <ErlenmeyerFlask
              position={[-2.0, -1.2, 0]}
              scale={0.9}
              liquidLevel={0.4}
              liquidColor="#38bdf8"
              label="Reaktif A"
            />
          </Suspense>
          <OrbitControls maxPolarAngle={Math.PI / 2 + 0.1} minDistance={2} maxDistance={7} />
        </Canvas>

        {/* Reaction Progress Bar */}
        {isReacting && (
          <div className="p-3 bg-dark-900/80 border-t border-dark-800 flex items-center space-x-4">
            <span className="text-xs text-dark-300 whitespace-nowrap">Reaksiyon İlerlemesi:</span>
            <div className="flex-1 bg-dark-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-chemistry h-full transition-all duration-150"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-chemistry font-bold">
              %{Math.round(progress * 100)}
            </span>
          </div>
        )}
      </div>

      {/* Control & Information Panel */}
      <div className="space-y-4">
        {/* Reaction Selector */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
            <GiBubbles className="text-chemistry" />
            <span>Deney Seçimi</span>
          </h3>
          <select
            value={selectedReactionId}
            onChange={(e) => {
              setSelectedReactionId(e.target.value)
              handleReset()
            }}
            className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl p-3 text-sm focus:border-chemistry focus:ring-1 focus:ring-chemistry"
          >
            {reactions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type})
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={handleStartReaction}
              disabled={isReacting && progress >= 1}
              className="btn-chemistry py-2.5 flex items-center justify-center space-x-2"
            >
              <FiPlay />
              <span>Tepkimeyi Başlat</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost border border-dark-700 py-2.5 flex items-center justify-center space-x-2"
            >
              <FiRotateCcw />
              <span>Sıfırla</span>
            </button>
          </div>

          <button
            onClick={() => setBurnerOn(!burnerOn)}
            className={`w-full mt-2 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
              burnerOn
                ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                : 'bg-dark-800 hover:bg-dark-700 text-dark-300'
            }`}
          >
            <GiFlame className={burnerOn ? 'text-amber-400 animate-bounce' : ''} />
            <span>{burnerOn ? 'Bek Alevini Kapat' : 'Bek Alevi ile Isıt'}</span>
          </button>
        </div>

        {/* Reaction Details */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="text-xs uppercase tracking-wider text-chemistry font-bold">
            Kimyasal Eşitlik
          </div>
          <div className="p-3 bg-dark-900 rounded-xl font-mono text-center text-emerald-400 font-bold text-sm tracking-wide border border-dark-800">
            {currentReaction.equation}
          </div>

          <div className="text-xs text-dark-400 leading-relaxed">
            {currentReaction.description}
          </div>

          <div className="pt-2 border-t border-dark-800 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-dark-800/50 p-2.5 rounded-lg">
              <span className="text-dark-400 block mb-0.5">Tepkime Türü:</span>
              <span className="text-white font-semibold">{currentReaction.type}</span>
            </div>
            <div className="bg-dark-800/50 p-2.5 rounded-lg">
              <span className="text-dark-400 block mb-0.5">Termal Etki:</span>
              <span className="text-white font-semibold">
                {currentReaction.deltaH < 0 ? 'Ekzotermik (Isı Veren)' : 'Endotermik (Isı Alan)'}
              </span>
            </div>
          </div>

          {/* Observations */}
          <div className="p-3 bg-dark-800/30 rounded-xl border border-dark-700/50">
            <div className="text-xs font-semibold text-white mb-1.5 flex items-center space-x-1">
              <FiInfo className="text-chemistry" />
              <span>Gözlemlenebilir Değişimler:</span>
            </div>
            <ul className="text-xs text-dark-300 space-y-1 list-disc list-inside">
              {currentReaction.observations?.colorChange && (
                <li>Renk değişimi gerçekleşir</li>
              )}
              {currentReaction.observations?.gasRelease && (
                <li>Gaz kabarcıkları ({currentReaction.observations.gasType || 'gaz'}) açığa çıkar</li>
              )}
              {currentReaction.observations?.precipitate && (
                <li>Dipte katı çökelti oluşur</li>
              )}
              {currentReaction.observations?.temperatureChange && (
                <li>Sıcaklık değişimi gözlenir</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 2. PH & ACID-BASE MODULE
// ============================================================
function PHModule() {
  const [pH, setPH] = useState(7.0)
  const [dippedLitmus, setDippedLitmus] = useState(false)

  const currentColor = useMemo(() => getpHColor(pH), [pH])
  const currentLabel = useMemo(() => getpHLabel(pH), [pH])

  // Select a preset substance
  const handleSelectExample = (item) => {
    setPH(item.pH)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Simulation */}
      <div className="lg:col-span-2 glass rounded-2xl h-[520px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/20"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-xs font-semibold text-white">
            pH: {pH.toFixed(1)} - {currentLabel}
          </span>
        </div>

        <Canvas camera={{ position: [0, 1.0, 4.2], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-5, 5, -5]} intensity={0.4} />
          <Suspense fallback={null}>
            <LabBench position={[0, -1.2, 0]} />
            {/* Beaker filled with pH solution */}
            <Beaker
              position={[-0.4, -0.45, 0]}
              liquidLevel={0.7}
              liquidColor={currentColor}
            />
            {/* Digital pH meter with electrode probe dipped into beaker */}
            <PHMeterDevice
              position={[1.5, -0.4, 0]}
              pH={pH}
            />
            {/* Litmus Paper */}
            <LitmusPaper
              position={[-1.6, -0.3, 0]}
              isDipped={dippedLitmus}
              dippedColor={pH < 7 ? '#ef4444' : pH > 7 ? '#3b82f6' : '#a855f7'}
            />
          </Suspense>
          <OrbitControls maxPolarAngle={Math.PI / 2 + 0.1} />
        </Canvas>

        {/* Turnusol Daldır Butonu */}
        <div className="p-3 bg-dark-900/80 border-t border-dark-800 flex items-center justify-between">
          <span className="text-xs text-dark-300">
            Turnusol Kağıdı Durumu: {dippedLitmus ? 'Çözeltiye Daldırıldı' : 'Kuru'}
          </span>
          <button
            onClick={() => setDippedLitmus(!dippedLitmus)}
            className="btn-chemistry text-xs px-4 py-1.5"
          >
            {dippedLitmus ? 'Kağıdı Çıkar' : 'Turnusol Kağıdını Daldır'}
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-4">
        {/* pH Slider Card */}
        <div className="glass rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-white">pH Derecesi Ayarı</span>
            <span
              className="text-lg font-black font-mono px-2.5 py-0.5 rounded-lg text-dark-950"
              style={{ backgroundColor: currentColor }}
            >
              {pH.toFixed(1)}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="14"
            step="0.1"
            value={pH}
            onChange={(e) => setPH(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 my-4"
          />

          {/* Color gradient track indicator */}
          <div className="h-3 rounded-full w-full bg-gradient-to-r from-red-600 via-yellow-400 via-green-500 via-blue-600 to-purple-800 shadow-inner" />
          <div className="flex justify-between text-[10px] text-dark-400 mt-1">
            <span>0 (Güçlü Asit)</span>
            <span>7 (Nötr)</span>
            <span>14 (Güçlü Baz)</span>
          </div>
        </div>

        {/* Common Substances */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-xs uppercase tracking-wider text-chemistry font-bold mb-3">
            Günlük Maddelerin pH Değerleri
          </h4>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {phExamples.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectExample(item)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                  Math.abs(pH - item.pH) < 0.2
                    ? 'bg-dark-800 border border-chemistry text-white'
                    : 'bg-dark-900/60 hover:bg-dark-800/80 text-dark-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getpHColor(item.pH) }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-bold text-dark-400">
                  pH {item.pH}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 3. TITRATION MODULE
// ============================================================
function TitrationModule() {
  const [volumeBaseAdded, setVolumeBaseAdded] = useState(0) // mL of NaOH
  const [isDripping, setIsDripping] = useState(false)
  const [dropProgress, setDropProgress] = useState(0)

  // Calculations
  const currentPH = useMemo(
    () => calculateTitrationPH(volumeBaseAdded),
    [volumeBaseAdded]
  )
  const indicatorColor = useMemo(
    () => getTitrationIndicatorColor(currentPH),
    [currentPH]
  )

  const handleAddDrop = () => {
    setIsDripping(true)
    setDropProgress(0)
    let p = 0
    const dropTimer = setInterval(() => {
      p += 0.2
      setDropProgress(p)
      if (p >= 1) {
        clearInterval(dropTimer)
        setIsDripping(false)
        setVolumeBaseAdded((v) => Math.min(v + 1.0, 50))
      }
    }, 40)
  }

  const handleResetTitration = () => {
    setVolumeBaseAdded(0)
    setIsDripping(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Scene */}
      <div className="lg:col-span-2 glass rounded-2xl h-[520px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-white">
          Büret: <span className="text-purple-400 font-bold">0.1M NaOH</span> | Erlenmayer:{' '}
          <span className="text-sky-400 font-bold">0.1M HCl (25 mL)</span>
        </div>

        <Canvas camera={{ position: [0, 1.0, 5.0], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-5, 5, -5]} intensity={0.4} />
          <Suspense fallback={null}>
            <LabBench position={[0, -1.8, 0]} />
            {/* Burette Setup */}
            <BuretteSetup
              position={[0, 0, 0]}
              liquidLevel={Math.max(0.05, 1 - volumeBaseAdded / 50)}
              liquidColor="#a855f7"
              isDripping={isDripping}
              dropProgress={dropProgress}
            />
            {/* Erlenmeyer Flask receiving drops */}
            <ErlenmeyerFlask
              position={[0, -1.75, 0]}
              scale={1.05}
              liquidLevel={0.4 + (volumeBaseAdded / 50) * 0.3}
              liquidColor={indicatorColor}
            />
          </Suspense>
          <OrbitControls maxPolarAngle={Math.PI / 2 + 0.1} />
        </Canvas>

        {/* Titration Live Monitor Bar */}
        <div className="p-4 bg-dark-900/90 border-t border-dark-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-dark-400">Eklenen NaOH Hacmi: </span>
            <span className="font-mono text-purple-400 font-bold text-sm">
              {volumeBaseAdded.toFixed(1)} mL
            </span>
          </div>
          <div>
            <span className="text-dark-400">Çözelti pH: </span>
            <span
              className="font-mono font-black text-sm px-2 py-0.5 rounded"
              style={{
                backgroundColor: indicatorColor,
                color: currentPH > 8.5 ? '#ffffff' : '#020617',
              }}
            >
              {currentPH.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-dark-400">Eşdeğerlik Durumu: </span>
            <span
              className={`font-semibold ${
                Math.abs(volumeBaseAdded - 25) < 0.5
                  ? 'text-emerald-400 font-bold'
                  : 'text-dark-300'
              }`}
            >
              {Math.abs(volumeBaseAdded - 25) < 0.5
                ? 'Eşdeğerlik Noktası (Dönüm) Ulaşıldı!'
                : volumeBaseAdded < 25
                ? 'Asidik Bölge'
                : 'Bazik Fazla'}
            </span>
          </div>
        </div>
      </div>

      {/* Control & Analysis Panel */}
      <div className="space-y-4">
        {/* Burette Controller */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Büret Kontrolü</h3>
          <div className="space-y-3">
            <button
              onClick={handleAddDrop}
              disabled={isDripping || volumeBaseAdded >= 50}
              className="w-full btn-chemistry py-3 text-sm flex items-center justify-center space-x-2"
            >
              <GiChemicalDrop className="text-lg" />
              <span>1 mL NaOH Damlat</span>
            </button>

            <div>
              <div className="flex justify-between text-xs text-dark-300 mb-1">
                <span>Hızlı Hacim Ayarı:</span>
                <span className="font-mono font-bold text-white">{volumeBaseAdded} mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={volumeBaseAdded}
                onChange={(e) => setVolumeBaseAdded(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <button
              onClick={handleResetTitration}
              className="w-full btn-ghost border border-dark-700 py-2 text-xs flex items-center justify-center space-x-1"
            >
              <FiRotateCcw />
              <span>Titrasyonu Baştan Başlat</span>
            </button>
          </div>
        </div>

        {/* Titration Curve Chart Preview */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-xs uppercase tracking-wider text-chemistry font-bold mb-3">
            Titrasyon Eğrisi (pH / Eklenen Baz)
          </h4>
          <div className="h-40 bg-dark-900 rounded-xl p-2 relative flex items-end border border-dark-800">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
              <div className="border-b border-dark-400 text-[9px]">pH 14</div>
              <div className="border-b border-dark-400 text-[9px]">pH 7 (Dönüm)</div>
              <div className="border-b border-dark-400 text-[9px]">pH 0</div>
            </div>

            {/* SVG Curve */}
            <svg className="w-full h-full overflow-visible">
              {/* Reference equivalence line */}
              <line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke="#64748b"
                strokeDasharray="3 3"
              />
              {/* Curve path */}
              <path
                d="M 10 140 Q 100 135, 140 120 T 160 30 T 280 15"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              {/* Current indicator point */}
              <circle
                cx={`${(volumeBaseAdded / 50) * 90 + 5}%`}
                cy={`${(1 - currentPH / 14) * 100}%`}
                r="5"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="text-[11px] text-dark-400 mt-2 leading-relaxed">
            Fenolftalein indikatörü asidik ortamda renksizdir; pH 8.2 civarında pembe renge dönerek titrasyonun bittiğini haber verir.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 4. 3D PERIODIC TABLE MODULE
// ============================================================
function PeriodicTableModule() {
  const [selectedAtomicNumber, setSelectedAtomicNumber] = useState(6) // Carbon default
  const [filterCategory, setFilterCategory] = useState('all')

  const selectedElement = useMemo(
    () => elements.find((e) => e.number === selectedAtomicNumber) || elements[5],
    [selectedAtomicNumber]
  )

  const shells = useMemo(
    () => getElectronShells(selectedAtomicNumber),
    [selectedAtomicNumber]
  )

  const categoryColor = useMemo(() => {
    return (
      elementCategories[selectedElement.category]?.color || '#10b981'
    )
  }, [selectedElement])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 3D Atom Viewer */}
      <div className="lg:col-span-5 glass rounded-2xl h-[560px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700">
          <span className="text-xs text-dark-400">3D Bohr Atom Modeli: </span>
          <span className="text-sm font-bold text-white">
            {selectedElement.name} ({selectedElement.symbol})
          </span>
        </div>

        <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <Stars radius={50} depth={20} count={500} factor={3} />
          <Suspense fallback={null}>
            <BohrAtom
              atomicNumber={selectedElement.number}
              symbol={selectedElement.symbol}
              name={selectedElement.name}
              shells={shells}
              color={categoryColor}
            />
          </Suspense>
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.8} />
        </Canvas>

        {/* Selected Element Specs Card */}
        <div className="p-4 bg-dark-900/90 border-t border-dark-800 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-white">{selectedElement.symbol}</span>
              <span className="ml-2 text-sm text-dark-300">{selectedElement.name}</span>
            </div>
            <div
              className="text-xs px-2.5 py-1 rounded-full font-semibold text-dark-950"
              style={{ backgroundColor: categoryColor }}
            >
              {elementCategories[selectedElement.category]?.name || selectedElement.category}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
            <div className="bg-dark-800 p-2 rounded-lg">
              <span className="text-dark-400 block">Atom No (Z):</span>
              <span className="text-white font-mono font-bold">{selectedElement.number}</span>
            </div>
            <div className="bg-dark-800 p-2 rounded-lg">
              <span className="text-dark-400 block">Kütle No:</span>
              <span className="text-white font-mono font-bold">{selectedElement.mass}</span>
            </div>
            <div className="bg-dark-800 p-2 rounded-lg">
              <span className="text-dark-400 block">Katmanlar:</span>
              <span className="text-white font-mono font-bold">{shells.join(' - ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Periodic Table Grid */}
      <div className="lg:col-span-7 glass rounded-2xl p-5 flex flex-col h-[560px]">
        {/* Category filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-2 border-b border-dark-800 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-chemistry text-dark-950 font-bold'
                : 'text-dark-300 hover:bg-dark-800'
            }`}
          >
            Tümü
          </button>
          {Object.entries(elementCategories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setFilterCategory(key)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                filterCategory === key
                  ? 'bg-dark-700 text-white font-semibold'
                  : 'text-dark-400 hover:bg-dark-800'
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Element Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 content-start">
          {elements
            .filter((el) => filterCategory === 'all' || el.category === filterCategory)
            .map((el) => {
              const isSelected = el.number === selectedAtomicNumber
              const col = elementCategories[el.category]?.color || '#64748b'
              return (
                <button
                  key={el.number}
                  onClick={() => setSelectedAtomicNumber(el.number)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-white ring-2 ring-white/50 bg-dark-800 scale-105 z-10'
                      : 'border-dark-700/60 bg-dark-900/60 hover:bg-dark-800 hover:border-dark-500'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 12px ${col}88` : 'none',
                  }}
                >
                  <div className="text-[9px] text-dark-400">{el.number}</div>
                  <div
                    className="text-base font-black my-0.5"
                    style={{ color: col }}
                  >
                    {el.symbol}
                  </div>
                  <div className="text-[9px] text-dark-300 truncate">{el.name}</div>
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}
