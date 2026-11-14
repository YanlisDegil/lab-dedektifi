import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import {
  organelleData,
  mitosisStages,
} from '../data/biology'
import {
  AnimalCell,
  PlantCell,
  NucleusStructureDetail,
  MultiCellMitosisScene,
} from '../components/biology/CellModel'
import { DNAHelix } from '../components/biology/DNAHelix'
import {
  GiDna2,
  GiMicroscope,
  GiPlantRoots,
  GiSplitCross,
  GiDna1,
} from 'react-icons/gi'
import { FiPlay, FiPause, FiRotateCcw, FiInfo, FiFastForward } from 'react-icons/fi'

const TABS = [
  { id: 'animal', label: 'Hayvan Hücresi (3D)', icon: GiMicroscope },
  { id: 'plant', label: 'Bitki Hücresi (Altıgen Prizma)', icon: GiPlantRoots },
  { id: 'nucleus', label: 'Çekirdek İç Yapısı', icon: GiDna1 },
  { id: 'dna', label: 'DNA Çift Sarmalı (Fermuar Açma)', icon: GiDna2 },
  { id: 'mitosis', label: 'Hücre Bölünmesi (1→2→4→8 Hücre)', icon: GiSplitCross },
]

export default function BiologyLab() {
  const [activeTab, setActiveTab] = useState('animal')

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
                      ? 'bg-biology text-white shadow-lg shadow-biology/20 font-bold'
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
            <span className="w-2 h-2 rounded-full bg-biology animate-pulse" />
            <span>Sanal Biyoloji Laboratuvarı Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'animal' && <AnimalCellModule />}
        {activeTab === 'plant' && <PlantCellModule />}
        {activeTab === 'nucleus' && <NucleusDetailModule />}
        {activeTab === 'dna' && <DNAModule />}
        {activeTab === 'mitosis' && <MitosisModule />}
      </div>
    </div>
  )
}

// ============================================================
// 1. ANIMAL CELL MODULE - BRIGHT LIGHTING & ORGANIC DETAILS
// ============================================================
function AnimalCellModule() {
  const [selectedOrganelle, setSelectedOrganelle] = useState('mitochondria')

  const organelle = useMemo(
    () => organelleData[selectedOrganelle] || organelleData.mitochondria,
    [selectedOrganelle]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[540px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-white">
          İncelemek istediğiniz organele 3D sahne üzerinden tıklayın
        </div>

        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} className="flex-1">
          {/* BRIGHT STUDIO LIGHTING */}
          <ambientLight intensity={1.1} />
          <directionalLight position={[6, 10, 6]} intensity={1.6} />
          <pointLight position={[-6, -6, -2]} intensity={0.8} color="#c4b5fd" />
          <Stars radius={50} depth={30} count={600} factor={3} />
          <Suspense fallback={null}>
            <AnimalCell
              selectedOrganelle={selectedOrganelle}
              onSelectOrganelle={setSelectedOrganelle}
            />
          </Suspense>
          <OrbitControls minDistance={2.5} maxDistance={9} />
        </Canvas>

        {/* Organelle Carousel */}
        <div className="p-3 bg-dark-900/90 border-t border-dark-800 flex items-center space-x-2 overflow-x-auto">
          {['mitochondria', 'nucleus', 'roughER', 'golgiApparatus', 'lysosome', 'centriole', 'cellMembrane'].map(
            (id) => {
              const item = organelleData[id]
              if (!item) return null
              const isSel = selectedOrganelle === id
              return (
                <button
                  key={id}
                  onClick={() => setSelectedOrganelle(id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSel
                      ? 'bg-biology text-white font-bold'
                      : 'bg-dark-800 text-dark-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              )
            }
          )}
        </div>
      </div>

      {/* Encyclopedia Card */}
      <div className="glass rounded-2xl p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-dark-800 pb-3">
            <div>
              <h3 className="text-xl font-bold text-white">{organelle.name}</h3>
              <span className="text-xs text-dark-400 italic">{organelle.englishName}</span>
            </div>
            <div
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: organelle.color }}
            />
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-biology font-bold block mb-1">
              Hücredeki Görevi
            </span>
            <p className="text-sm text-dark-200 leading-relaxed font-medium">
              {organelle.function}
            </p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-dark-400 font-bold block mb-1">
              Biyolojik Mimarisi
            </span>
            <p className="text-xs text-dark-400 leading-relaxed">
              {organelle.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-800">
              <span className="text-dark-500 block text-[10px]">Boyut:</span>
              <span className="text-white font-mono">{organelle.size || 'Belirtilmemiş'}</span>
            </div>
            <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-800">
              <span className="text-dark-500 block text-[10px]">Keşif:</span>
              <span className="text-white">{organelle.discoveredBy || 'Bilinmiyor'}</span>
            </div>
          </div>
        </div>

        {organelle.funFact && (
          <div className="p-3.5 bg-biology/10 border border-biology/30 rounded-xl text-xs text-violet-200">
            <span className="font-bold block mb-1 text-biology flex items-center space-x-1">
              <FiInfo />
              <span>Biliyor muydunuz?</span>
            </span>
            {organelle.funFact}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// 2. PLANT CELL MODULE (HEXAGONAL PRISM + REAL VACUOLE)
// ============================================================
function PlantCellModule() {
  const [selectedOrganelle, setSelectedOrganelle] = useState('chloroplast')
  const organelle = useMemo(
    () => organelleData[selectedOrganelle] || organelleData.chloroplast,
    [selectedOrganelle]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[540px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[6, 10, 6]} intensity={1.6} />
          <pointLight position={[-6, -6, 2]} intensity={0.8} />
          <Stars radius={50} depth={30} count={600} factor={3} />
          <Suspense fallback={null}>
            <PlantCell
              selectedOrganelle={selectedOrganelle}
              onSelectOrganelle={setSelectedOrganelle}
            />
          </Suspense>
          <OrbitControls minDistance={3} maxDistance={10} />
        </Canvas>

        <div className="p-3 bg-dark-900/90 border-t border-dark-800 flex items-center space-x-2 overflow-x-auto">
          {['chloroplast', 'cellWall', 'centralVacuole', 'nucleus', 'mitochondria'].map((id) => {
            const item = organelleData[id]
            if (!item) return null
            const isSel = selectedOrganelle === id
            return (
              <button
                key={id}
                onClick={() => setSelectedOrganelle(id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-dark-800 text-dark-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-dark-800 pb-2">
            <h3 className="text-lg font-bold text-white">{organelle.name}</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
              Bitki Hücresi
            </span>
          </div>
          <p className="text-xs text-dark-200 leading-relaxed font-medium">
            {organelle.function}
          </p>
          <p className="text-xs text-dark-400 leading-relaxed">
            {organelle.description}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2">
            Bitki ve Hayvan Hücresi Temel Farkları
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-dark-800">
              <span className="text-dark-300">Hücre Duvarı:</span>
              <span className="text-emerald-400 font-bold">Bitkide Selüloz Duvar Var</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-dark-800">
              <span className="text-dark-300">Kloroplast (Fotosentez):</span>
              <span className="text-emerald-400 font-bold">Sadece Bitkide Var</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-dark-800">
              <span className="text-dark-300">Merkezi Koful:</span>
              <span className="text-emerald-400 font-bold">Bitkide Dev & Tek (%70 Hacim)</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-dark-800">
              <span className="text-dark-300">Sentriyol (Sentrozom):</span>
              <span className="text-purple-400 font-bold">Sadece Hayvanda Var</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 3. NUCLEUS DETAIL MODULE
// ============================================================
function NucleusDetailModule() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[540px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 4.6], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.6} />
          <Suspense fallback={null}>
            <NucleusStructureDetail />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <GiMicroscope className="text-biology" />
          <span>Çekirdeğin İç Mimarisi</span>
        </h3>
        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-800">
            <strong className="text-biology block mb-1">Çekirdek Zarı (Nükleer Zarf):</strong>
            Çift katlı lipit tabakasıdır. Dış yüzeyi por kompleksleri ile donatılmıştır.
          </div>
          <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-800">
            <strong className="text-sky-400 block mb-1">Çekirdek Porları:</strong>
            mRNA ve ribozom alt birimlerinin sitoplazmaya çıkış kapılarıdır.
          </div>
          <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-800">
            <strong className="text-indigo-400 block mb-1">Çekirdekçik (Nükleolus):</strong>
            Yoğun protein ve rRNA bölgesidir; ribozomların montaj fabrikasıdır.
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 4. DNA MODULE
// ============================================================
function DNAModule() {
  const [unzipProgress, setUnzipProgress] = useState(0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[540px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 10, 5]} intensity={1.6} />
          <Stars radius={50} depth={20} count={500} factor={3} />
          <Suspense fallback={null}>
            <DNAHelix unzipProgress={unzipProgress} />
          </Suspense>
          <OrbitControls />
        </Canvas>

        {/* Unzip Slider */}
        <div className="p-4 bg-dark-900/90 border-t border-dark-800 space-y-2">
          <div className="flex justify-between text-xs text-dark-300">
            <span>DNA Çift Sarmalını Fermuar Gibi Aç (Helikaz / Replikasyon):</span>
            <span className="font-mono text-biology font-bold">
              %{Math.round(unzipProgress * 100)} Açıldı
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={unzipProgress}
            onChange={(e) => setUnzipProgress(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <GiDna2 className="text-biology text-xl" />
          <span>Watson-Crick Baz Eşleşmeleri</span>
        </h3>
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-800 flex items-center justify-between">
            <span className="text-white font-bold">Adenin (A) - Kırmızı</span>
            <span className="text-dark-400">Timin ile 2'li H bağı</span>
          </div>
          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-800 flex items-center justify-between">
            <span className="text-white font-bold">Timin (T) - Mavi</span>
            <span className="text-dark-400">Adenin ile 2'li H bağı</span>
          </div>
          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-800 flex items-center justify-between">
            <span className="text-white font-bold">Guanin (G) - Yeşil</span>
            <span className="text-dark-400">Sitozin ile 3'lü H bağı</span>
          </div>
          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-800 flex items-center justify-between">
            <span className="text-white font-bold">Sitozin (C) - Sarı</span>
            <span className="text-dark-400">Guanin ile 3'lü H bağı</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 5. SUCCESSIVE MITOSIS CELL DIVISION (1 → 2 → 4 → 8 CELLS)
// ============================================================
function MitosisModule() {
  const [cellCount, setCellCount] = useState(1) // 1, 2, 4, 8
  const [isDividing, setIsDividing] = useState(false)
  const [divisionProgress, setDivisionProgress] = useState(0) // 0 to 1
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0) // 0.2x to 3x

  // Trigger continuous smooth 3D division animation
  const handleStartDivision = () => {
    if (isDividing || cellCount >= 8) return
    setIsDividing(true)
    setDivisionProgress(0)

    let p = 0
    const step = 0.02 * speedMultiplier
    const timer = setInterval(() => {
      p += step
      setDivisionProgress(Math.min(1, p))
      if (p >= 1) {
        clearInterval(timer)
        setIsDividing(false)
        setDivisionProgress(0)
        setCellCount((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 8))
      }
    }, 30)
  }

  const handleReset = () => {
    setIsDividing(false)
    setDivisionProgress(0)
    setCellCount(1)
  }

  // Calculate current mitosis stage based on progress
  const currentStageName = useMemo(() => {
    if (!isDividing) return cellCount === 1 ? 'İnterfaz (Hazırlık)' : `${cellCount} Hücreli Doku`
    if (divisionProgress < 0.2) return 'Profaz: Kromatinler yoğunlaşıyor'
    if (divisionProgress < 0.45) return 'Metafaz: Ekvatoral düzlemde dizilim'
    if (divisionProgress < 0.75) return 'Anafaz: Kardeş kromatitler kutuplara çekiliyor'
    return 'Telofaz & Sitokinez: Boğumlanma ile bölünme tamamlanıyor!'
  }, [isDividing, divisionProgress, cellCount])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[540px] relative overflow-hidden flex flex-col">
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-white">
          Aktif Durum: <span className="text-biology font-bold">{currentStageName}</span> (Toplam:{' '}
          <span className="font-mono text-emerald-400 font-bold">{cellCount} Hücre</span>)
        </div>

        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} className="flex-1">
          <ambientLight intensity={1.1} />
          <directionalLight position={[6, 10, 6]} intensity={1.6} />
          <pointLight position={[-6, -6, 2]} intensity={0.8} />
          <Suspense fallback={null}>
            <MultiCellMitosisScene
              cellCount={cellCount}
              divisionProgress={divisionProgress}
              isDividing={isDividing}
            />
          </Suspense>
          <OrbitControls />
        </Canvas>

        {/* Division Progress Bar */}
        <div className="p-4 bg-dark-900/95 border-t border-dark-800 space-y-2">
          <div className="flex justify-between text-xs text-dark-300">
            <span>Bölünme İlerlemesi (Boğumlanma):</span>
            <span className="font-mono text-biology font-bold">
              %{Math.round(divisionProgress * 100)}
            </span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-biology transition-all duration-75"
              style={{ width: `${divisionProgress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <GiSplitCross className="text-biology text-xl" />
          <span>Mitoz Bölünme Kontrolü</span>
        </h3>

        {/* Next Division Button */}
        <button
          onClick={handleStartDivision}
          disabled={isDividing || cellCount >= 8}
          className="w-full btn-biology py-3.5 text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-biology/25"
        >
          <FiPlay />
          <span>
            {cellCount === 1
              ? 'Hücreyi Böl (1 → 2 Hücre)'
              : cellCount === 2
              ? 'Tekrar Böl (2 → 4 Hücre)'
              : cellCount === 4
              ? 'Tekrar Böl (4 → 8 Hücre)'
              : 'Maksimum Hücre Sayısına (8) Ulaşıldı'}
          </span>
        </button>

        {/* Speed Slider */}
        <div className="pt-2 border-t border-dark-800">
          <div className="flex justify-between text-xs text-dark-300 mb-1">
            <span>Bölünme Hızı (Hız Çarpanı):</span>
            <span className="font-mono font-bold text-white">{speedMultiplier.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.2"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-dark-400 mt-1">
            <span>0.2x (Ağır Çekim)</span>
            <span>1.0x (Normal)</span>
            <span>3.0x (Hızlı 2 Sn)</span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full btn-ghost border border-dark-700 py-2.5 text-xs font-bold flex items-center justify-center space-x-2"
        >
          <FiRotateCcw />
          <span>Başa Dön (1 Ana Hücreye Sıfırla)</span>
        </button>

        {/* Biological Info */}
        <div className="p-3.5 bg-dark-900 rounded-xl border border-dark-800 text-xs text-dark-300 space-y-1.5 leading-relaxed">
          <span className="text-biology font-bold block">Mitoz Formülü:</span>
          <div>$2^n$ kuralı geçerlidir:</div>
          <ul className="list-disc list-inside space-y-0.5 text-dark-400">
            <li>1. Bölünme: $2^1 = 2$ hücre</li>
            <li>2. Bölünme: $2^2 = 4$ hücre</li>
            <li>3. Bölünme: $2^3 = 8$ hücre</li>
          </ul>
          <div className="text-[11px] text-dark-400 pt-1">
            Oluşan tüm yavru hücrelerin kromozom sayısı ve genetik yapısı ana hücre ile tıpatıp aynıdır.
          </div>
        </div>
      </div>
    </div>
  )
}
