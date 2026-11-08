import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import {
  PLANET_GRAVITY,
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
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiTarget,
  FiAlertTriangle,
} from 'react-icons/fi'
import { GiPendulumSwing, GiWaveSurfer, GiMagnet } from 'react-icons/gi'

const TABS = [
  { id: 'circuit', label: 'Elektrik Devreleri (2 Ampul Seri/Paralel)', icon: FiZap },
  { id: 'pendulum', label: 'Sarkaç & Mekanik', icon: GiPendulumSwing },
  { id: 'wave', label: 'Dalga Mekaniği', icon: GiWaveSurfer },
  { id: 'magnet', label: 'Manyetizma & Pusula', icon: GiMagnet },
  { id: 'projectile', label: 'Atış Hareketleri (200 Metre)', icon: FiTarget },
]

export default function PhysicsLab() {
  const [activeTab, setActiveTab] = useState('circuit')

  return (
    <div className="pt-16 min-h-screen bg-dark-950 flex flex-col">
      {/* Navigation Header */}
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
                      ? 'bg-physics text-white shadow-lg shadow-physics/20 font-bold'
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
// 1. CIRCUITS MODULE WITH 2 BULBS (SERIES & PARALLEL) + BURNOUT
// ============================================================
function CircuitsModule() {
  const [circuitType, setCircuitType] = useState('series_2bulbs')
  const [voltage, setVoltage] = useState(9.0)
  const [switchOn, setSwitchOn] = useState(true)
  const [isBurnedOut, setIsBurnedOut] = useState(false)

  // Overvoltage Burnout Check:
  // If single or parallel: voltage > 15V burns the bulb!
  // If series (2 bulbs): voltage > 26V (meaning > 13V per bulb) burns the bulbs!
  useEffect(() => {
    if (!switchOn) return
    const maxAllowedVoltage = circuitType === 'series_2bulbs' ? 26 : 15
    if (voltage > maxAllowedVoltage) {
      setIsBurnedOut(true)
    }
  }, [voltage, circuitType, switchOn])

  const handleResetCircuit = () => {
    setIsBurnedOut(false)
    setVoltage(9.0)
    setSwitchOn(true)
  }

  // Electrical values
  const bulbVoltage = !switchOn || isBurnedOut ? 0 : circuitType === 'series_2bulbs' ? voltage / 2 : voltage
  const current = !switchOn || isBurnedOut ? 0 : circuitType === 'series_2bulbs' ? voltage / 20 : (voltage / 10) * 2

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Circuit Canvas */}
      <div className="lg:col-span-2 glass rounded-2xl h-[530px] relative overflow-hidden flex flex-col">
        {/* Burnout Warning Banner */}
        {isBurnedOut && (
          <div className="absolute top-4 left-4 right-4 z-20 bg-rose-950/95 border-2 border-rose-500 p-3 rounded-xl flex items-center justify-between text-white shadow-2xl animate-bounce-slow">
            <div className="flex items-center space-x-2 text-xs font-bold">
              <FiAlertTriangle className="text-xl text-rose-400" />
              <span>DİKKAT: Gerilim çok yüksek! Ampulün filamanı aşırı akımdan eridi ve patladı!</span>
            </div>
            <button
              onClick={handleResetCircuit}
              className="bg-white text-rose-950 px-3 py-1.5 rounded-lg text-xs font-extrabold hover:bg-rose-100"
            >
              Ampulü Yenile
            </button>
          </div>
        )}

        <Canvas camera={{ position: [0, 3.2, 4.2], fov: 45 }} className="flex-1">
          {/* BRIGHT STUDIO LIGHTING */}
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.6} />
          <pointLight position={[-4, 5, 2]} intensity={0.9} color="#ffffff" />
          <Suspense fallback={null}>
            <CircuitScene
              circuitType={circuitType}
              voltage={voltage}
              switchOn={switchOn}
              isBurnedOut={isBurnedOut}
              onToggleSwitch={() => setSwitchOn(!switchOn)}
            />
          </Suspense>
          <OrbitControls maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={9} />
        </Canvas>

        {/* Live Gauges Bar */}
        <div className="p-4 bg-dark-900/95 border-t border-dark-800 grid grid-cols-3 gap-4 text-center">
          <div className="bg-dark-800/80 p-2 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400 font-bold">PİL GERİLİMİ</div>
            <div className="text-lg font-mono font-black text-amber-400">
              {voltage.toFixed(1)} V
            </div>
          </div>
          <div className="bg-dark-800/80 p-2 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400 font-bold">HER BİR AMPUL GERİLİMİ</div>
            <div className="text-lg font-mono font-black text-physics">
              {bulbVoltage.toFixed(1)} V
            </div>
          </div>
          <div className="bg-dark-800/80 p-2 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400 font-bold">TOPLAM DEVRE AKIMI</div>
            <div className="text-lg font-mono font-black text-emerald-400">
              {(current * 1000).toFixed(0)} mA
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FiZap className="text-physics text-lg" />
            <span>Devre Bağlantı Türü</span>
          </h3>

          <div className="space-y-2">
            {[
              {
                id: 'series_2bulbs',
                name: 'Seri Bağlı Devre (2 Ampul)',
                desc: 'Ampuller gerilimi paylaşır (V/2). Biri patlarsa devre kesilir!',
              },
              {
                id: 'parallel_2bulbs',
                name: 'Paralel Bağlı Devre (2 Ampul)',
                desc: 'Her iki ampul de tam gerilim (V) alır ve eşit parlaklıkta yanar!',
              },
              {
                id: 'simple',
                name: 'Basit Devre (Tek Ampul)',
                desc: '1 Pil, 1 Anahtar ve 1 Ampulden oluşan temel devre.',
              },
            ].map((conf) => (
              <button
                key={conf.id}
                onClick={() => {
                  setCircuitType(conf.id)
                  setIsBurnedOut(false)
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  circuitType === conf.id
                    ? 'border-physics bg-physics/20 text-white font-semibold'
                    : 'border-dark-700 bg-dark-900/60 text-dark-300 hover:bg-dark-800'
                }`}
              >
                <div className="font-bold text-sm mb-0.5 text-white">{conf.name}</div>
                <div className="text-dark-400">{conf.desc}</div>
              </button>
            ))}
          </div>

          {/* Voltage Slider */}
          <div className="pt-2 border-t border-dark-800">
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>Pil Gerilimi:</span>
              <span className="font-mono font-bold text-amber-400">{voltage.toFixed(1)} V</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="30"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-[10px] text-dark-400 mt-1 flex justify-between">
              <span>1.5V</span>
              <span>12V (Nominal)</span>
              <span className="text-rose-400 font-bold">&gt;15V (Aşırı Gerilim!)</span>
            </div>
          </div>

          {/* Switch Toggle */}
          <button
            onClick={() => setSwitchOn(!switchOn)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              switchOn
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {switchOn ? 'Anahtarı Aç (Akımı Kes)' : 'Anahtarı Kapat (Akımı Başlat)'}
          </button>

          {isBurnedOut && (
            <button
              onClick={handleResetCircuit}
              className="w-full btn-ghost border border-rose-500 text-rose-300 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
            >
              <FiRotateCcw />
              <span>Devreyi ve Ampulü Sıfırla</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 2. PENDULUM MODULE
// ============================================================
function PendulumModule() {
  const [length, setLength] = useState(2.0)
  const [mass, setMass] = useState(1.0)
  const [angle0Deg, setAngle0Deg] = useState(30)
  const [gravity, setGravity] = useState(9.81)
  const [isPlaying, setIsPlaying] = useState(true)

  const pendulumData = useMemo(
    () => calcPendulum(length, gravity, angle0Deg, mass),
    [length, gravity, angle0Deg, mass]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[530px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
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

        <div className="p-4 bg-dark-900/95 border-t border-dark-800 grid grid-cols-3 gap-4 text-center">
          <div className="bg-dark-800/80 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">PERİYOT (T)</div>
            <div className="text-lg font-mono font-black text-physics">
              {pendulumData.period.toFixed(2)} s
            </div>
          </div>
          <div className="bg-dark-800/80 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">FREKANS (f)</div>
            <div className="text-lg font-mono font-black text-emerald-400">
              {pendulumData.frequency.toFixed(2)} Hz
            </div>
          </div>
          <div className="bg-dark-800/80 p-2.5 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">MAKS. HIZ</div>
            <div className="text-lg font-mono font-black text-amber-400">
              {pendulumData.vMax.toFixed(2)} m/s
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Sarkaç Ayarları</h3>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-physics text-base"
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
        </div>

        <div>
          <div className="flex justify-between text-xs text-dark-300 mb-1">
            <span>İp Boyu (L):</span>
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

        <div>
          <span className="text-xs text-dark-300 block mb-2">Gezegen Yerçekimi (g):</span>
          <div className="grid grid-cols-2 gap-1.5">
            {PLANET_GRAVITY.map((p) => (
              <button
                key={p.name}
                onClick={() => setGravity(p.g)}
                className={`p-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  gravity === p.g
                    ? 'bg-physics text-white font-bold'
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
      <div className="lg:col-span-2 glass rounded-2xl h-[530px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <WaveScene amplitude={amplitude} frequency={frequency} mode={mode} />
          </Suspense>
          <OrbitControls enableRotate={false} />
        </Canvas>

        <div className="p-3 bg-dark-900/90 border-t border-dark-800 flex items-center justify-center space-x-2">
          {[
            { id: 'single', label: 'Tek Dalga Yayılımı' },
            { id: 'interference', label: 'Girişim (Yapıcı / Yıkıcı)' },
            { id: 'standing', label: 'Duran (Kararlı) Dalga' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === m.id
                  ? 'bg-physics text-white font-bold'
                  : 'bg-dark-800 text-dark-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Dalga Kontrolleri</h3>
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
      <div className="lg:col-span-2 glass rounded-2xl h-[530px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 5.0], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.6} />
          <Suspense fallback={null}>
            <MagneticFieldScene showFieldLines={showLines} />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={0.4} />
        </Canvas>

        <div className="p-3 bg-dark-900/90 border-t border-dark-800 flex items-center justify-between">
          <span className="text-xs text-dark-300">
            Mıknatıs döndürüldüğünde harfler arkasından görünmez, 3D yüzeyinde kalır.
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
          <span>Manyetizma ve Pusulalar</span>
        </h3>
        <p className="text-xs text-dark-300 leading-relaxed">
          Pusulaların kırmızı ucu mıknatısın mavi (S) kutbuna, mavi ucu ise kırmızı (N) kutbuna doğru yönelir. Çizgiler N kutbundan dışarı çıkarak S kutbuna dalar.
        </p>
      </div>
    </div>
  )
}

// ============================================================
// 5. PROJECTILE MODULE (UP TO 200 METERS WITH CLEAR LABELS)
// ============================================================
function ProjectileModule() {
  const [v0, setV0] = useState(35) // m/s
  const [angleDeg, setAngleDeg] = useState(45)
  const [gravity, setGravity] = useState(9.81)
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
    }, 25)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[530px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [3, 0, 9.5], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 12, 5]} intensity={1.6} />
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
        <div className="p-4 bg-dark-900/95 border-t border-dark-800 grid grid-cols-3 gap-3 text-center">
          <div className="bg-dark-800/80 p-2 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">MAKSİMUM YÜKSEKLİK</div>
            <div className="text-base font-mono font-bold text-amber-400">
              {result.maxHeight.toFixed(1)} m
            </div>
          </div>
          <div className="bg-dark-800/80 p-2 rounded-xl border border-dark-700">
            <div className="text-[10px] text-dark-400">MENZİL (X_MAX)</div>
            <div className="text-base font-mono font-bold text-physics">
              {result.range.toFixed(1)} m
            </div>
          </div>
          <div className="bg-dark-800/80 p-2 rounded-xl border border-dark-700">
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
          <h3 className="text-sm font-bold text-white">Atış Kontrolleri (0 - 200m)</h3>

          <div>
            <div className="flex justify-between text-xs text-dark-300 mb-1">
              <span>İlk Hız (v₀):</span>
              <span className="font-mono font-bold text-white">{v0} m/s</span>
            </div>
            <input
              type="range"
              min="10"
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
              min="15"
              max="80"
              step="1"
              value={angleDeg}
              onChange={(e) => setAngleDeg(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <button
            onClick={handleFire}
            className="w-full btn-physics py-3 text-sm flex items-center justify-center space-x-2 font-bold"
          >
            <FiTarget />
            <span>Topu Ateşle ({v0} m/s)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
