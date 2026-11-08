import React, { useState, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import {
  organelleData,
  mitosisStages,
  cellComparison,
  dnaData,
} from '../data/biology'
import {
  AnimalCell,
  PlantCell,
  NucleusStructureDetail,
  MitosisScene,
} from '../components/biology/CellModel'
import { DNAHelix } from '../components/biology/DNAHelix'
import {
  GiDna2,
  GiMicroscope,
  GiPlantRoots,
  GiSplitCross,
  GiDna1,
} from 'react-icons/gi'
import { FiPlay, FiPause, FiChevronRight, FiChevronLeft, FiInfo } from 'react-icons/fi'

const TABS = [
  { id: 'animal', label: 'Hayvan Hücresi', icon: GiMicroscope },
  { id: 'plant', label: 'Bitki Hücresi', icon: GiPlantRoots },
  { id: 'nucleus', label: 'Çekirdek Yapısı', icon: GiDna1 },
  { id: 'dna', label: 'DNA Çift Sarmalı', icon: GiDna2 },
  { id: 'mitosis', label: 'Hücre Bölünmesi (Mitoz)', icon: GiSplitCross },
]

export default function BiologyLab() {
  const [activeTab, setActiveTab] = useState('animal')

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
                      ? 'bg-biology text-white shadow-lg shadow-biology/20'
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
// 1. ANIMAL CELL MODULE
// ============================================================
function AnimalCellModule() {
  const [selectedOrganelle, setSelectedOrganelle] = useState('nucleus')

  const organelle = useMemo(
    () => organelleData[selectedOrganelle] || organelleData.nucleus,
    [selectedOrganelle]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Canvas */}
      <div className="lg:col-span-2 glass rounded-2xl h-[540px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-white">
          Organele tıklayarak detaylı bilgi alabilirsiniz
        </div>

        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.7} />
          <pointLight position={[6, 8, 6]} intensity={1.5} color="#c4b5fd" />
          <pointLight position={[-6, -6, -6]} intensity={0.4} color="#8b5cf6" />
          <Stars radius={50} depth={30} count={600} factor={3} />
          <Suspense fallback={null}>
            <AnimalCell
              selectedOrganelle={selectedOrganelle}
              onSelectOrganelle={setSelectedOrganelle}
            />
          </Suspense>
          <OrbitControls minDistance={2.5} maxDistance={9} />
        </Canvas>

        {/* Quick Organelle Selector Carousel */}
        <div className="p-3 bg-dark-900/80 border-t border-dark-800 flex items-center space-x-2 overflow-x-auto">
          {['nucleus', 'mitochondria', 'roughER', 'golgiApparatus', 'lysosome', 'centriole', 'cellMembrane'].map(
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
                      ? 'bg-biology text-white'
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

      {/* Organelle Encyclopedia Inspector */}
      <div className="glass rounded-2xl p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
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
              Görevi (Fonksiyonu)
            </span>
            <p className="text-sm text-dark-200 leading-relaxed font-medium">
              {organelle.function}
            </p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-dark-400 font-bold block mb-1">
              Ayrıntılı Yapı
            </span>
            <p className="text-xs text-dark-400 leading-relaxed">
              {organelle.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
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
// 2. PLANT CELL MODULE
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
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.7} />
          <pointLight position={[6, 8, 6]} intensity={1.5} color="#86efac" />
          <pointLight position={[-6, -6, -6]} intensity={0.4} />
          <Stars radius={50} depth={30} count={600} factor={3} />
          <Suspense fallback={null}>
            <PlantCell
              selectedOrganelle={selectedOrganelle}
              onSelectOrganelle={setSelectedOrganelle}
            />
          </Suspense>
          <OrbitControls minDistance={3} maxDistance={10} />
        </Canvas>

        <div className="p-3 bg-dark-900/80 border-t border-dark-800 flex items-center space-x-2 overflow-x-auto">
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
                    ? 'bg-emerald-600 text-white'
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
          <p className="text-xs text-dark-300 leading-relaxed font-medium">
            {organelle.function}
          </p>
          <p className="text-xs text-dark-400 leading-relaxed">
            {organelle.description}
          </p>
        </div>

        {/* Differences Card */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            Bitki ve Hayvan Hücresi Farkları
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-dark-800">
              <span className="text-dark-300">Hücre Duvarı:</span>
              <span className="text-emerald-400 font-bold">Sadece Bitkide Var</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-dark-800">
              <span className="text-dark-300">Kloroplast:</span>
              <span className="text-emerald-400 font-bold">Sadece Bitkide Var</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-dark-800">
              <span className="text-dark-300">Merkezi Koful:</span>
              <span className="text-emerald-400 font-bold">Bitkide Büyük & Tek</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-dark-900/60 border border-dark-800">
              <span className="text-dark-300">Sentriyol:</span>
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
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 8, 5]} intensity={1.5} color="#c7d2fe" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
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

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-800">
            <strong className="text-biology block mb-1">Çekirdek Zarı (Nükleer Zarf):</strong>
            Çift katlı fosfolipid tabakasıdır. Dış zarı granüllü endoplazmik retikulum ile devamlılık gösterir.
          </div>
          <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-800">
            <strong className="text-sky-400 block mb-1">Çekirdek Gözenekleri (Porlar):</strong>
            mRNA, ribozomal alt birimler ve proteinlerin çekirdek ile sitoplazma arasında geçişini kontrol eden dev protein kompleksleridir.
          </div>
          <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-800">
            <strong className="text-indigo-400 block mb-1">Çekirdekçik (Nükleolus):</strong>
            Zarsız yoğun bölgedir. Ribozomal RNA (rRNA) sentezi ve ribozom alt birimlerinin montaj fabrikasıdır.
          </div>
          <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-800">
            <strong className="text-purple-400 block mb-1">Kromatin İplikler:</strong>
            DNA molekülünün histon proteinleri etrafına sarılarak oluşturduğu nükleozom zincirleridir.
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 4. DNA DOUBLE HELIX MODULE
// ============================================================
function DNAModule() {
  const [unzipProgress, setUnzipProgress] = useState(0) // 0 to 1

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[540px] relative overflow-hidden flex flex-col">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 8, 5]} intensity={1.5} color="#c4b5fd" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <Stars radius={50} depth={20} count={500} factor={3} />
          <Suspense fallback={null}>
            <DNAHelix unzipProgress={unzipProgress} />
          </Suspense>
          <OrbitControls />
        </Canvas>

        {/* Unzip Slider Bar */}
        <div className="p-4 bg-dark-900/90 border-t border-dark-800 space-y-2">
          <div className="flex justify-between text-xs text-dark-300">
            <span>DNA Sarmalını Aç (Replikasyon / Helikaz Simülasyonu):</span>
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
          <span>Azotlu Organik Bazlar</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-white font-bold">Adenin (A)</span>
            </div>
            <span className="text-dark-400">Pürin bazı</span>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white font-bold">Timin (T)</span>
            </div>
            <span className="text-dark-400">Pirimidin bazı</span>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-white font-bold">Guanin (G)</span>
            </div>
            <span className="text-dark-400">Pürin bazı</span>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-white font-bold">Sitozin (C)</span>
            </div>
            <span className="text-dark-400">Pirimidin bazı</span>
          </div>
        </div>

        <div className="p-3 bg-dark-900 rounded-xl border border-dark-800 text-xs text-dark-300 space-y-1">
          <div className="text-biology font-bold">Chargaff Kuralı:</div>
          <div>Adenin her zaman Timin ile 2 hidrojen bağı yapar (A = T).</div>
          <div>Guanin her zaman Sitozin ile 3 hidrojen bağı yapar (G ≡ C).</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 5. MITOSIS DIVISION MODULE
// ============================================================
function MitosisModule() {
  const [stageIndex, setStageIndex] = useState(0)
  const currentStage = mitosisStages[stageIndex] || mitosisStages[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl h-[540px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-dark-700 text-xs text-white">
          Aşama: <span className="text-biology font-bold">{currentStage.name}</span>
        </div>

        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="flex-1">
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 8, 5]} intensity={1.5} color="#c4b5fd" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <Suspense fallback={null}>
            <MitosisScene stageIndex={stageIndex} />
          </Suspense>
          <OrbitControls />
        </Canvas>

        {/* Timeline Control Bar */}
        <div className="p-4 bg-dark-900/90 border-t border-dark-800 flex items-center justify-between">
          <button
            onClick={() => setStageIndex((s) => Math.max(0, s - 1))}
            disabled={stageIndex === 0}
            className="btn-ghost p-2 text-white disabled:opacity-30"
          >
            <FiChevronLeft className="text-xl" />
          </button>

          <div className="flex space-x-1.5">
            {mitosisStages.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setStageIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  stageIndex === idx ? 'bg-biology scale-125' : 'bg-dark-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setStageIndex((s) => Math.min(mitosisStages.length - 1, s + 1))}
            disabled={stageIndex === mitosisStages.length - 1}
            className="btn-ghost p-2 text-white disabled:opacity-30"
          >
            <FiChevronRight className="text-xl" />
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="border-b border-dark-800 pb-3">
          <span className="text-xs text-biology font-bold tracking-wider uppercase">
            Aşama {stageIndex + 1} / {mitosisStages.length}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{currentStage.name}</h3>
        </div>

        <div>
          <span className="text-xs text-dark-400 uppercase font-semibold block mb-1">
            Bu Aşamada Neler Olur?
          </span>
          <p className="text-sm text-dark-200 leading-relaxed font-medium">
            {currentStage.description}
          </p>
        </div>

        {currentStage.keyEvents && (
          <div>
            <span className="text-xs text-dark-400 uppercase font-semibold block mb-2">
              Önemli Olaylar:
            </span>
            <ul className="text-xs text-dark-300 space-y-1.5 list-disc list-inside">
              {currentStage.keyEvents.map((ev, i) => (
                <li key={i}>{ev}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
