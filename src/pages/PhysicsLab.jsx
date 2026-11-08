import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import {
  PLANET_GRAVITY,
  CIRCUIT_CONFIGS,
  calcTotalResistance,
  calcCircuit,
  calcPendulum,
  calcProjectile,
} from '../data/physics'
import { CircuitScene } from '../components/physics/CircuitComponents'
import {
  PendulumScene,
  WaveScene,
  MagneticFieldScene,
  ProjectileScene,
} from '../components/physics/PhysicsSimulations'
import {
  FiZap,
  FiActivity,
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiCompass,
  FiTarget,
} from 'react-icons/fi'
import { GiPendulumSwing, GiWaveSurfer, GiMagnet } from 'react-icons/gi'

const TABS = [
  { id: 'circuit', label: 'Elektrik Devreleri', icon: FiZap },
  { id: 'pendulum', label: 'Sarkaç & Mekanik', icon: GiPendulumSwing },
  { id: 'wave', label: 'Dalga Mekaniği', icon: GiWaveSurfer },
  { id: 'magnet', label: 'Manyetizma', icon: GiMagnet },
  { id: 'projectile', label: 'Atış Hareketleri', icon: FiTarget },
]

export default function PhysicsLab() {
  const [activeTab, setActiveTab] = useState('circuit')

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
                      ? 'bg-physics text-white shadow-lg shadow-physics/20'
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
            <span className="w-2 h-2 rounded-full bg-physics animate-pulse" />
            <span>Sanal Fizik Laboratuvarı Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'circuit' && <CircuitsModule />}
        {activeTab === 'pendulum' && <PendulumModule />}
        {activeTab === 'wave' && <WaveModule />}
        {activeTab === 'magnet' && <MagnetismModule />}
        {activeTab === 'projectile' && <ProjectileModule />}
      </div>
    </div>
  )
}

// ============================================================
// 1. CIRCUITS MODULE
// ============================================================
function CircuitsModule() {
  const [selectedConfigId, setSelectedConfigId] = useState(CIRCUIT_CONFIGS[0].id)
  const [voltage, setVoltage] = useState(9.0) // Volts
  const [switchOn, setSwitchOn] = useState(true)

  const currentConfig = useMemo(
    () => CIRCUIT_CONFIGS.find((c) => c.id === selectedConfigId) || CIRCUIT_CONFIGS[0],
    [selectedConfigId]
  )

  const totalResistance = useMemo(
    () => calcTotalResistance(currentConfig.resistors, currentConfig.type),
    [currentConfig]
  )

  const circuitResult = useMemo(
    () => (switchOn ? calcCircuit(voltage, totalResistance) : { current: 0, power: 0 }),
    [voltage, totalResistance, switchOn]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Circuit Canvas */}
      <div className="lg:col-span-2 glass rounded-2xl h-[520px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-white">
          Devre: <span className="text-physics font-bold">{currentConfig.name}</span>
        </div>

        <Canvas camera={{ position: [0, 3.5, 4.0], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-5, 5, -5]} intensity={0.4} color="#3b82f6" />
          <Suspense fallback={null}>
            <CircuitScene
              config={currentConfig}
              voltage={voltage}
              switchOn={switchOn}
            />
          </Suspense>
          <OrbitControls maxPolarAngle={Math.PI / 2.2} />
        </Canvas>

        {/* Live Gauges Bar */}
        <div className="p-4 bg-dark-900/90 border-t border-dark-800 grid grid-cols-3 gap-4 text-center">
          <div className="bg-dark-800/60 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">GERİLİM (V)</div>
            <div className="text-lg font-mono font-black text-amber-400">
              {voltage.toFixed(1)} V
            </div>
          </div>
          <div className="bg-dark-800/60 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">AKIM (I)</div>
            <div className="text-lg font-mono font-black text-physics">
              {(circuitResult.current * 1000).toFixed(1)} mA
            </div>
          </div>
          <div className="bg-dark-800/60 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">GÜÇ (P)</div>
            <div className="text-lg font-mono font-black text-emerald-400">
              {(circuitResult.power * 1000).toFixed(1)} mW
            </div>
          </div>
        </div>
      </div>

      {/* Control & Theory Panel */}
      <div className="space-y-4">
        {/* Preset Selector */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FiZap className="text-physics" />
            <span>Devre Konfigürasyonu</span>
          </h3>

          <div className="space-y-2">
            {CIRCUIT_CONFIGS.map((conf) => (
              <button
                key={conf.id}
                onClick={() => setSelectedConfigId(conf.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  conf.id === selectedConfigId
                    ? 'border-physics bg-physics/10 text-white font-semibold'
                    : 'border-dark-700 bg-dark-900/60 text-dark-300 hover:bg-dark-800'
                }`}
              >
                <div className="font-bold text-sm mb-0.5">{conf.name}</div>
                <div className="text-dark-400">{conf.description}</div>
              </button>
            ))}
          </div>

          {/* Voltage slider */}
          <div className="pt-2 border-t border-dark-800">
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>Pil Gerilimi:</span>
              <span className="font-mono font-bold text-amber-400">{voltage} V</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="24"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Switch Toggle */}
          <button
            onClick={() => setSwitchOn(!switchOn)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              switchOn
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-600/80 hover:bg-red-500 text-white'
            }`}
          >
            {switchOn ? 'Devre Anahtarını Aç (Akımı Kes)' : 'Devre Anahtarını Kapat (Akım Başlat)'}
          </button>
        </div>

        {/* Ohm's Law Explanation Card */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-physics font-bold">
            Ohm Yasası Formülleri
          </h4>
          <div className="bg-dark-900 p-3 rounded-xl font-mono text-center text-physics font-bold text-sm border border-dark-800">
            V = I · R &nbsp;&nbsp;|&nbsp;&nbsp; P = V · I = I² · R
          </div>
          <div className="text-xs text-dark-400 leading-relaxed">
            Eşdeğer Direnç (R_eş):{' '}
            <strong className="text-white font-mono">{totalResistance.toFixed(1)} Ω</strong>.
            Gerilim arttıkça akım doğru orantılı olarak artar ve ampul daha parlak yanar.
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 2. PENDULUM MODULE
// ============================================================
function PendulumModule() {
  const [length, setLength] = useState(2.0) // meters
  const [mass, setMass] = useState(1.0) // kg
  const [angle0Deg, setAngle0Deg] = useState(30) // degrees
  const [gravity, setGravity] = useState(9.81) // m/s²
  const [isPlaying, setIsPlaying] = useState(true)

  const pendulumData = useMemo(
    () => calcPendulum(length, gravity, angle0Deg, mass),
    [length, gravity, angle0Deg, mass]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Scene */}
      <div className="lg:col-span-2 glass rounded-2xl h-[520px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-5, 5, -5]} intensity={0.4} />
          <Suspense fallback={null}>
            <PendulumScene
              length={length}
              mass={mass}
              gravity={gravity}
              angle0Deg={angle0Deg}
              isPlaying={isPlaying}
            />
          </Suspense>
          <OrbitControls />
        </Canvas>

        {/* Live Values Bar */}
        <div className="p-4 bg-dark-900/90 border-t border-dark-800 grid grid-cols-3 gap-4 text-center">
          <div className="bg-dark-800/60 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">PERİYOT (T)</div>
            <div className="text-lg font-mono font-black text-physics">
              {pendulumData.period.toFixed(2)} s
            </div>
          </div>
          <div className="bg-dark-800/60 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">FREKANS (f)</div>
            <div className="text-lg font-mono font-black text-emerald-400">
              {pendulumData.frequency.toFixed(2)} Hz
            </div>
          </div>
          <div className="bg-dark-800/60 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">MAKS. HIZ</div>
            <div className="text-lg font-mono font-black text-amber-400">
              {pendulumData.vMax.toFixed(2)} m/s
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Sarkaç Parametreleri</h3>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-physics text-base"
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
          </div>

          {/* Length Slider */}
          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>İp Uzunluğu (L):</span>
              <span className="font-mono font-bold text-white">{length.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Mass Slider */}
          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>Kütle (m):</span>
              <span className="font-mono font-bold text-white">{mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="5.0"
              step="0.1"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Initial Angle */}
          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>Başlangıç Açısı (θ₀):</span>
              <span className="font-mono font-bold text-white">{angle0Deg}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              step="1"
              value={angle0Deg}
              onChange={(e) => setAngle0Deg(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Planet presets */}
          <div>
            <span className="text-xs text-dark-300 block mb-2">Gezegen Yerçekimi (g):</span>
            <div className="grid grid-cols-2 gap-1.5">
              {PLANET_GRAVITY.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setGravity(p.g)}
                  className={`p-2 rounded-lg text-xs font-semibold transition-all text-left ${
                    gravity === p.g
                      ? 'bg-physics text-white'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  <div>{p.name}</div>
                  <div className="text-[10px] opacity-75 font-mono">{p.g} m/s²</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Physics Formula Card */}
        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="text-xs uppercase tracking-wider text-physics font-bold">
            Basit Sarkaç Formülü
          </div>
          <div className="p-3 bg-dark-900 rounded-xl font-mono text-center text-physics font-bold text-sm border border-dark-800">
            T = 2π √(L / g)
          </div>
          <p className="text-xs text-dark-400 leading-relaxed">
            Periyot, sarkacın kütlesinden bağımsızdır! Sadece ipin boyuna ve yerçekimi ivmesine bağlıdır.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 3. WAVE MODULE
// ============================================================
function WaveModule() {
  const [amplitude, setAmplitude] = useState(0.8)
  const [frequency, setFrequency] = useState(1.2)
  const [mode, setMode] = useState('single')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[520px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.2} />
          <Suspense fallback={null}>
            <WaveScene amplitude={amplitude} frequency={frequency} mode={mode} />
          </Suspense>
          <OrbitControls enableRotate={false} />
        </Canvas>

        {/* Mode Selector */}
        <div className="p-3 bg-dark-900/80 border-t border-dark-800 flex items-center justify-center space-x-2">
          {[
            { id: 'single', label: 'Tek Dalga İlerlemesi' },
            { id: 'interference', label: 'Girişim (İki Dalga)' },
            { id: 'standing', label: 'Kararlı (Duran) Dalga' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === m.id
                  ? 'bg-physics text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Dalga Değişkenleri</h3>

          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>Genlik (A):</span>
              <span className="font-mono font-bold text-white">{amplitude.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={amplitude}
              onChange={(e) => setAmplitude(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>Frekans (f):</span>
              <span className="font-mono font-bold text-white">{frequency.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="p-3 bg-dark-900 rounded-xl font-mono text-center text-physics font-bold text-xs border border-dark-800">
            v = λ · f &nbsp;|&nbsp; y(x,t) = A·sin(2πft - kx)
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 4. MAGNETISM MODULE
// ============================================================
function MagnetismModule() {
  const [showLines, setShowLines] = useState(true)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[520px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 8, 5]} intensity={1.5} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <Suspense fallback={null}>
            <MagneticFieldScene showFieldLines={showLines} />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={0.5} />
        </Canvas>

        <div className="p-3 bg-dark-900/80 border-t border-dark-800 flex items-center justify-between">
          <span className="text-xs text-dark-300">
            Manyetik alan çizgileri N kutbundan çıkıp S kutbuna girer.
          </span>
          <button
            onClick={() => setShowLines(!showLines)}
            className="btn-physics text-xs px-3 py-1.5"
          >
            {showLines ? 'Alan Çizgilerini Gizle' : 'Alan Çizgilerini Göster'}
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <GiMagnet className="text-physics text-lg" />
          <span>Manyetik Alan Özellikleri</span>
        </h3>
        <p className="text-xs text-dark-300 leading-relaxed">
          Mıknatısın etrafındaki manyetik alan çizgileri asla birbirini kesmez. Çizgilerin sıklaştığı kutup bölgelerinde manyetik kuvvet en şiddetlidir.
        </p>
        <div className="p-3 bg-dark-900 rounded-xl border border-dark-800 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-red-400 font-bold">N Kutbu:</span>
            <span className="text-dark-300">Kuzey Arayan Kutup</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-400 font-bold">S Kutbu:</span>
            <span className="text-dark-300">Güney Arayan Kutup</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 5. PROJECTILE MODULE
// ============================================================
function ProjectileModule() {
  const [v0, setV0] = useState(25) // m/s
  const [angleDeg, setAngleDeg] = useState(45) // degrees
  const [gravity, setGravity] = useState(9.81) // m/s²
  const [isFired, setIsFired] = useState(false)
  const [progress, setProgress] = useState(0)

  const result = useMemo(
    () => calcProjectile(v0, angleDeg, gravity),
    [v0, angleDeg, gravity]
  )

  const handleFire = () => {
    setIsFired(true)
    setProgress(0)
    let p = 0
    const timer = setInterval(() => {
      p += 0.02
      setProgress(p)
      if (p >= 1) {
        clearInterval(timer)
      }
    }, 30)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[520px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 8, 5]} intensity={1.2} />
          <Suspense fallback={null}>
            <ProjectileScene
              v0={v0}
              angleDeg={angleDeg}
              gravity={gravity}
              isFired={isFired}
              flightTimeProgress={progress}
            />
          </Suspense>
          <OrbitControls />
        </Canvas>

        {/* Live Metrics */}
        <div className="p-4 bg-dark-900/90 border-t border-dark-800 grid grid-cols-3 gap-3 text-center">
          <div className="bg-dark-800/60 p-2 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">MAKSİMUM YÜKSEKLİK</div>
            <div className="text-base font-mono font-bold text-amber-400">
              {result.maxHeight.toFixed(2)} m
            </div>
          </div>
          <div className="bg-dark-800/60 p-2 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">MENZİL (X_MAX)</div>
            <div className="text-base font-mono font-bold text-physics">
              {result.range.toFixed(2)} m
            </div>
          </div>
          <div className="bg-dark-800/60 p-2 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">UÇUŞ SÜRESİ</div>
            <div className="text-base font-mono font-bold text-emerald-400">
              {result.flightTime.toFixed(2)} s
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Atış Kontrolleri</h3>

          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>İlk Hız (v₀):</span>
              <span className="font-mono font-bold text-white">{v0} m/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={v0}
              onChange={(e) => setV0(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>Atış Açısı (θ):</span>
              <span className="font-mono font-bold text-white">{angleDeg}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="85"
              step="1"
              value={angleDeg}
              onChange={(e) => setAngleDeg(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <button
            onClick={handleFire}
            className="w-full btn-physics py-3 text-sm flex items-center justify-center space-x-2"
          >
            <FiTarget />
            <span>Topu Ateşle</span>
          </button>
        </div>
      </div>
    </div>
  )
}
