import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import {
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
import { FiPlay, FiRotateCcw, FiInfo, FiSliders, FiPlus, FiTrash2 } from 'react-icons/fi'

const TABS = [
  { id: 'reactions', label: 'Kimyasal Reaksiyonlar', icon: GiBubbles },
  { id: 'ph', label: 'pH & Asit-Baz (Madde Karıştırma)', icon: GiChemicalDrop },
  { id: 'titration', label: 'Titrasyon Deneyi', icon: FiSliders },
  { id: 'periodic', label: '3D Periyodik Tablo (Bohr Atomu)', icon: GiAtom },
]

export default function ChemistryLab() {
  const [activeTab, setActiveTab] = useState('reactions')

  return (
    <div className="pt-16 min-h-screen bg-dark-950 flex flex-col">
      {/* Tab Navigation Header */}
      <div className="bg-dark-900/90 border-b border-dark-800 backdrop-blur sticky top-16 z-40">
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
                      ? 'bg-chemistry text-dark-950 shadow-lg shadow-chemistry/20 font-bold'
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
// 1. REACTIONS MODULE - BRIGHT LIGHTING & HIGH CONTRAST
// ============================================================
function ReactionsModule() {
  const [selectedReactionId, setSelectedReactionId] = useState(reactions[0].id)
  const [isReacting, setIsReacting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [burnerOn, setBurnerOn] = useState(false)
  const [temperature, setTemperature] = useState(25)

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

  // Color changes clearly during reaction
  const liquidColor = useMemo(() => {
    if (progress === 0) return '#0284c7' // Bright saturated blue at start
    if (currentReaction.observations?.precipitate) {
      return '#e2e8f0'
    }
    return progress > 0.5 ? '#10b981' : '#f59e0b'
  }, [progress, currentReaction])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* 3D Scene */}
      <div className="lg:col-span-2 glass rounded-2xl h-[530px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-dark-300">
          Tepkime: <span className="text-chemistry font-bold">{currentReaction.name}</span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs">
          <GiThermometerHot className="text-amber-400 text-base" />
          <span className="text-white font-mono font-bold">{temperature} °C</span>
        </div>

        <Canvas camera={{ position: [0, 1.2, 4.4], fov: 45 }} className="flex-1">
          {/* BRIGHT STUDIO LAB LIGHTING */}
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-4, 5, 2]} intensity={0.9} color="#ffffff" />
          <pointLight position={[4, 2, 3]} intensity={0.7} color="#e0f2fe" />
          <Suspense fallback={null}>
            <LabBench position={[0, -1.2, 0]} />
            <Beaker
              position={[0, -0.45, 0]}
              liquidLevel={0.65}
              liquidColor={liquidColor}
              showBubbles={isReacting && (currentReaction.observations?.gasRelease || burnerOn)}
              showPrecipitate={isReacting && progress > 0.65 && currentReaction.observations?.precipitate}
              precipitateColor="#ffffff"
            />
            <BunsenBurner
              position={[2.0, -0.5, 0]}
              isLit={burnerOn}
              flameIntensity={1}
            />
            <ErlenmeyerFlask
              position={[-2.0, -1.2, 0]}
              scale={0.9}
              liquidLevel={0.4}
              liquidColor="#38bdf8"
              label="Çözelti A"
            />
          </Suspense>
          <OrbitControls maxPolarAngle={Math.PI / 2 + 0.05} minDistance={2} maxDistance={7} />
        </Canvas>

        {/* Reaction Progress Bar */}
        {isReacting && (
          <div className="p-3 bg-dark-900/90 border-t border-dark-800 flex items-center space-x-4">
            <span className="text-xs text-dark-300 whitespace-nowrap">Reaksiyon İlerlemesi:</span>
            <div className="flex-1 bg-dark-800 h-2.5 rounded-full overflow-hidden">
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

      {/* Control Panel */}
      <div className="space-y-4">
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
            className={`w-full mt-2.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
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
          <div className="text-xs text-dark-300 leading-relaxed">
            {currentReaction.description}
          </div>
          <div className="pt-2 border-t border-dark-800 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-dark-800/60 p-2.5 rounded-lg">
              <span className="text-dark-400 block mb-0.5">Tepkime Türü:</span>
              <span className="text-white font-semibold">{currentReaction.type}</span>
            </div>
            <div className="bg-dark-800/60 p-2.5 rounded-lg">
              <span className="text-dark-400 block mb-0.5">Termal Etki:</span>
              <span className="text-white font-semibold">
                {currentReaction.deltaH < 0 ? 'Ekzotermik' : 'Endotermik'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 2. PH & ACID-BASE WITH MULTI-SUBSTANCE MIXER
// ============================================================
function PHModule() {
  // Mixture state: list of added components { name, pH, volume }
  const [mixture, setMixture] = useState([
    { name: 'Saf Su', pH: 7.0, volume: 100 },
  ])
  const [selectedSubstance, setSelectedSubstance] = useState(phExamples[0])
  const [addVolume, setAddVolume] = useState(50)
  const [dippedLitmus, setDippedLitmus] = useState(true)

  // Calculate total volume and blended pH
  const { totalVolume, mixedPH } = useMemo(() => {
    let totV = 0
    let hMoles = 0

    mixture.forEach((item) => {
      totV += item.volume
      const hConc = Math.pow(10, -item.pH)
      hMoles += hConc * item.volume
    })

    if (totV === 0) return { totalVolume: 0, mixedPH: 7.0 }
    const finalHConc = hMoles / totV
    const calculatedPH = Math.max(0, Math.min(14, -Math.log10(finalHConc)))
    return {
      totalVolume: totV,
      mixedPH: Number(calculatedPH.toFixed(2)),
    }
  }, [mixture])

  const currentColor = useMemo(() => getpHColor(mixedPH), [mixedPH])
  const currentLabel = useMemo(() => getpHLabel(mixedPH), [mixedPH])
  // Liquid height in beaker based on total volume (max 500 mL)
  const liquidLevel = useMemo(() => Math.min(0.9, Math.max(0.1, totalVolume / 500)), [totalVolume])

  const handleAddSubstance = () => {
    setMixture((prev) => [
      ...prev,
      {
        name: selectedSubstance.name,
        pH: selectedSubstance.pH,
        volume: addVolume,
      },
    ])
  }

  const handleResetMixture = () => {
    setMixture([{ name: 'Saf Su', pH: 7.0, volume: 100 }])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Simulation */}
      <div className="lg:col-span-2 glass rounded-2xl h-[530px] relative overflow-hidden flex flex-col">
        {/* HUD Info Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/20"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-xs font-semibold text-white">
            Çözelti: {totalVolume} mL | pH: {mixedPH.toFixed(2)} ({currentLabel})
          </span>
        </div>

        <Canvas camera={{ position: [0, 1.1, 4.2], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-4, 5, 2]} intensity={0.8} />
          <Suspense fallback={null}>
            <LabBench position={[0, -1.2, 0]} />
            <Beaker
              position={[-0.4, -0.45, 0]}
              liquidLevel={liquidLevel}
              liquidColor={currentColor}
            />
            {/* Digital pH meter with 3D screen */}
            <PHMeterDevice
              position={[1.5, -0.4, 0]}
              pH={mixedPH}
            />
            {/* Litmus Paper */}
            <LitmusPaper
              position={[-1.7, -0.3, 0]}
              isDipped={dippedLitmus}
              dippedColor={mixedPH < 6.8 ? '#ef4444' : mixedPH > 7.5 ? '#2563eb' : '#a855f7'}
            />
          </Suspense>
          <OrbitControls maxPolarAngle={Math.PI / 2 + 0.05} />
        </Canvas>

        {/* Turnusol Daldır Butonu */}
        <div className="p-3 bg-dark-900/90 border-t border-dark-800 flex items-center justify-between text-xs">
          <span className="text-dark-300">
            Turnusol: {dippedLitmus ? 'Daldırıldı (Asitte Kırmızı, Bazda Mavi)' : 'Kuru'}
          </span>
          <button
            onClick={() => setDippedLitmus(!dippedLitmus)}
            className="btn-chemistry px-3 py-1 text-xs"
          >
            {dippedLitmus ? 'Turnusolu Çıkar' : 'Turnusolu Daldır'}
          </button>
        </div>
      </div>

      {/* Control Panel: Add Any Substance & Mix! */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FiPlus className="text-chemistry" />
            <span>Behere Madde Ekle & Karıştır</span>
          </h3>

          <div>
            <label className="text-xs text-dark-400 block mb-1">Eklenecek Madde:</label>
            <select
              value={selectedSubstance.name}
              onChange={(e) => {
                const sub = phExamples.find((s) => s.name === e.target.value)
                if (sub) setSelectedSubstance(sub)
              }}
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl p-2.5 text-xs"
            >
              {phExamples.map((item, idx) => (
                <option key={idx} value={item.name}>
                  {item.name} (pH: {item.pH})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>Miktar (Hacim):</span>
              <span className="font-mono font-bold text-white">{addVolume} mL</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => setAddVolume(v)}
                  className={`py-1.5 rounded-lg text-xs font-semibold ${
                    addVolume === v
                      ? 'bg-chemistry text-dark-950 font-bold'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  +{v} mL
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddSubstance}
            disabled={totalVolume >= 500}
            className="w-full btn-chemistry py-2.5 text-xs font-bold flex items-center justify-center space-x-2"
          >
            <FiPlus />
            <span>Behere {addVolume} mL Ekle</span>
          </button>
        </div>

        {/* Current Mixture Content */}
        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-white">Beher İçeriği ({totalVolume} / 500 mL)</span>
            <button
              onClick={handleResetMixture}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <FiTrash2 />
              <span>Boşalt</span>
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
            {mixture.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-xs p-2 rounded-lg bg-dark-900/60 border border-dark-800"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getpHColor(item.pH) }}
                  />
                  <span className="text-white">{item.name}</span>
                </div>
                <span className="font-mono text-dark-400">
                  {item.volume} mL (pH {item.pH})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 3. TITRATION MODULE - VARIABLE DROP AMOUNTS & AUTO DRIP
// ============================================================
function TitrationModule() {
  const [volumeBaseAdded, setVolumeBaseAdded] = useState(0)
  const [isDripping, setIsDripping] = useState(false)
  const [dropProgress, setDropProgress] = useState(0)
  const [autoDrip, setAutoDrip] = useState(false)

  const currentPH = useMemo(
    () => calculateTitrationPH(volumeBaseAdded),
    [volumeBaseAdded]
  )
  const indicatorColor = useMemo(
    () => getTitrationIndicatorColor(currentPH),
    [currentPH]
  )

  // Continuous auto-drip effect
  useEffect(() => {
    if (!autoDrip) return
    const interval = setInterval(() => {
      setVolumeBaseAdded((v) => {
        if (v >= 50) {
          setAutoDrip(false)
          return 50
        }
        return v + 0.5
      })
    }, 200)
    return () => clearInterval(interval)
  }, [autoDrip])

  const handleAddAmount = (amount) => {
    setIsDripping(true)
    setDropProgress(0)
    let p = 0
    const dropTimer = setInterval(() => {
      p += 0.25
      setDropProgress(p)
      if (p >= 1) {
        clearInterval(dropTimer)
        setIsDripping(false)
        setVolumeBaseAdded((v) => Math.min(v + amount, 50))
      }
    }, 30)
  }

  const handleResetTitration = () => {
    setVolumeBaseAdded(0)
    setIsDripping(false)
    setAutoDrip(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Scene */}
      <div className="lg:col-span-2 glass rounded-2xl h-[530px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-white">
          Büret: <span className="text-purple-400 font-bold">0.1M NaOH</span> | Erlenmayer:{' '}
          <span className="text-sky-400 font-bold">0.1M HCl (25 mL)</span>
        </div>

        <Canvas camera={{ position: [0, 1.0, 5.0], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-4, 5, 2]} intensity={0.8} />
          <Suspense fallback={null}>
            <LabBench position={[0, -1.8, 0]} />
            <BuretteSetup
              position={[0, 0, 0]}
              liquidLevel={Math.max(0.04, 1 - volumeBaseAdded / 50)}
              liquidColor="#a855f7"
              isDripping={isDripping || autoDrip}
              dropProgress={dropProgress}
            />
            <ErlenmeyerFlask
              position={[0, -1.75, 0]}
              scale={1.05}
              liquidLevel={0.4 + (volumeBaseAdded / 50) * 0.3}
              liquidColor={indicatorColor}
            />
          </Suspense>
          <OrbitControls maxPolarAngle={Math.PI / 2 + 0.05} />
        </Canvas>

        {/* Live Gauges Bar */}
        <div className="p-4 bg-dark-900/95 border-t border-dark-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-dark-400">Eklenen NaOH: </span>
            <span className="font-mono text-purple-400 font-bold text-sm">
              {volumeBaseAdded.toFixed(1)} mL
            </span>
          </div>
          <div>
            <span className="text-dark-400">Çözelti pH: </span>
            <span
              className="font-mono font-black text-sm px-2.5 py-0.5 rounded"
              style={{
                backgroundColor: indicatorColor,
                color: currentPH > 8.2 ? '#ffffff' : '#020617',
              }}
            >
              {currentPH.toFixed(2)}
            </span>
          </div>
          <div>
            <span
              className={`font-semibold ${
                Math.abs(volumeBaseAdded - 25) < 0.6
                  ? 'text-emerald-400 font-bold'
                  : 'text-dark-300'
              }`}
            >
              {Math.abs(volumeBaseAdded - 25) < 0.6
                ? 'Eşdeğerlik (Dönüm) Noktası!'
                : volumeBaseAdded < 25
                ? 'Asidik Faz'
                : 'Bazik Faz'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Büret Musluk Kontrolleri</h3>

          {/* Quick Drop Buttons: 0.5, 1, 5, 10 mL */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAddAmount(1.0)}
              disabled={isDripping || volumeBaseAdded >= 50}
              className="btn-chemistry py-2.5 text-xs font-bold"
            >
              +1 mL Damlat
            </button>
            <button
              onClick={() => handleAddAmount(5.0)}
              disabled={isDripping || volumeBaseAdded >= 50}
              className="btn-chemistry py-2.5 text-xs font-bold"
            >
              +5 mL Hızlı Ekle
            </button>
            <button
              onClick={() => handleAddAmount(10.0)}
              disabled={isDripping || volumeBaseAdded >= 50}
              className="btn-ghost border border-dark-700 py-2 text-xs"
            >
              +10 mL Ekle
            </button>
            <button
              onClick={() => setAutoDrip(!autoDrip)}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                autoDrip
                  ? 'bg-amber-500 text-dark-950 animate-pulse'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
            >
              {autoDrip ? 'Akışı Durdur' : 'Sürekli Damlat'}
            </button>
          </div>

          <button
            onClick={handleResetTitration}
            className="w-full btn-ghost border border-dark-700 py-2 text-xs flex items-center justify-center space-x-1"
          >
            <FiRotateCcw />
            <span>Titrasyonu Sıfırla</span>
          </button>
        </div>

        {/* Titration Curve Chart */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-xs uppercase tracking-wider text-chemistry font-bold mb-3">
            Titrasyon Eğrisi (Dönüm Noktası pH ~8.2)
          </h4>
          <div className="h-40 bg-dark-900 rounded-xl p-2 relative flex items-end border border-dark-800">
            <svg className="w-full h-full overflow-visible">
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#64748b" strokeDasharray="3 3" />
              <path
                d="M 10 140 Q 100 135, 140 120 T 160 30 T 280 15"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <circle
                cx={`${(volumeBaseAdded / 50) * 90 + 5}%`}
                cy={`${(1 - currentPH / 14) * 100}%`}
                r="6"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 4. PERIODIC TABLE MODULE - EXACT BOHR MODEL FOR ALL ELEMENTS
// ============================================================
function PeriodicTableModule() {
  const [selectedAtomicNumber, setSelectedAtomicNumber] = useState(1) // Starts at Hydrogen
  const [filterCategory, setFilterCategory] = useState('all')

  const selectedElement = useMemo(
    () => elements.find((e) => e.number === selectedAtomicNumber) || elements[0],
    [selectedAtomicNumber]
  )

  // Real electron distribution across shells
  const shells = useMemo(
    () => getElectronShells(selectedAtomicNumber),
    [selectedAtomicNumber]
  )

  const categoryColor = useMemo(() => {
    return elementCategories[selectedElement.category]?.color || '#10b981'
  }, [selectedElement])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 3D Atom Viewer */}
      <div className="lg:col-span-5 glass rounded-2xl h-[560px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700">
          <span className="text-xs text-dark-400">3D Bohr Atom Modeli: </span>
          <span className="text-sm font-bold text-white">
            {selectedElement.name} ({selectedElement.symbol})
          </span>
        </div>

        <Canvas camera={{ position: [0, 0, 4.4], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.2} />
          <pointLight position={[5, 5, 5]} intensity={2.0} />
          <pointLight position={[-5, -5, -5]} intensity={0.8} />
          <Stars radius={50} depth={20} count={600} factor={3} />
          <Suspense fallback={null}>
            <BohrAtom
              atomicNumber={selectedElement.number}
              symbol={selectedElement.symbol}
              name={selectedElement.name}
              shells={shells}
              color={categoryColor}
            />
          </Suspense>
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>

        {/* Selected Element Specs Card */}
        <div className="p-4 bg-dark-900/95 border-t border-dark-800 space-y-2">
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
              <span className="text-dark-400 block">Proton / Elektron:</span>
              <span className="text-white font-mono font-bold">{selectedElement.number}</span>
            </div>
            <div className="bg-dark-800 p-2 rounded-lg">
              <span className="text-dark-400 block">Kütle No:</span>
              <span className="text-white font-mono font-bold">{selectedElement.mass}</span>
            </div>
            <div className="bg-dark-800 p-2 rounded-lg">
              <span className="text-dark-400 block">Katman Elektronları:</span>
              <span className="text-white font-mono font-bold">{shells.join(' , ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Periodic Table Grid */}
      <div className="lg:col-span-7 glass rounded-2xl p-5 flex flex-col h-[560px]">
        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-2 border-b border-dark-800 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-chemistry text-dark-950 font-bold'
                : 'text-dark-300 hover:bg-dark-800'
            }`}
          >
            Tümü (118 Element)
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
