import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text3D, Center, MeshDistortMaterial, Sphere, Stars, Trail } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { GiAtom, GiDna2, GiMicroscope } from 'react-icons/gi'
import { FiZap, FiArrowRight, FiPlay } from 'react-icons/fi'

/* ─── 3D Atom Model ─── */
function ElectronOrbit({ radius, speed, tilt, color }) {
  const ref = useRef()
  const electronRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    if (electronRef.current) {
      electronRef.current.position.x = Math.cos(t) * radius
      electronRef.current.position.z = Math.sin(t) * radius
    }
  })

  const orbitPoints = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])

  const orbitGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(orbitPoints)
  }, [orbitPoints])

  return (
    <group rotation={tilt}>
      <line geometry={orbitGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.2} />
      </line>
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

function AtomModel() {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Nucleus */}
        <Sphere args={[0.4, 32, 32]}>
          <MeshDistortMaterial
            color="#6366f1"
            emissive="#4338ca"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            distort={0.3}
            speed={2}
          />
        </Sphere>
        {/* Proton glow */}
        <Sphere args={[0.2, 16, 16]} position={[0.1, 0.1, 0]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} transparent opacity={0.8} />
        </Sphere>
        <Sphere args={[0.18, 16, 16]} position={[-0.1, -0.05, 0.1]}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} transparent opacity={0.8} />
        </Sphere>
        
        {/* Electron orbits */}
        <ElectronOrbit radius={1.2} speed={2} tilt={[0, 0, 0]} color="#10b981" />
        <ElectronOrbit radius={1.2} speed={2.5} tilt={[Math.PI / 3, 0, Math.PI / 6]} color="#3b82f6" />
        <ElectronOrbit radius={1.5} speed={1.8} tilt={[Math.PI / 4, Math.PI / 4, 0]} color="#8b5cf6" />
        <ElectronOrbit radius={1.8} speed={1.5} tilt={[-Math.PI / 5, Math.PI / 3, Math.PI / 4]} color="#f59e0b" />
      </group>
    </Float>
  )
}

/* ─── Floating Molecules ─── */
function FloatingMolecule({ position, color, scale = 1 }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3
      ref.current.rotation.y = state.clock.elapsedTime * 0.2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.25, 0.1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.2, -0.15, 0.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

/* ─── DNA Strand ─── */
function DNAStrand({ position }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const helixPoints = useMemo(() => {
    const points1 = []
    const points2 = []
    for (let i = 0; i < 50; i++) {
      const t = i * 0.2
      points1.push(new THREE.Vector3(Math.cos(t) * 0.4, t * 0.15 - 2, Math.sin(t) * 0.4))
      points2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.4, t * 0.15 - 2, Math.sin(t + Math.PI) * 0.4))
    }
    return { points1, points2 }
  }, [])

  return (
    <group ref={ref} position={position} scale={0.6}>
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3(helixPoints.points1), 64, 0.03, 8, false
        ]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
      </mesh>
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3(helixPoints.points2), 64, 0.03, 8, false
        ]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} />
      </mesh>
      {/* Base pairs */}
      {Array.from({ length: 12 }, (_, i) => {
        const t = i * 0.8
        const p1 = new THREE.Vector3(Math.cos(t) * 0.4, t * 0.15 - 2, Math.sin(t) * 0.4)
        const p2 = new THREE.Vector3(Math.cos(t + Math.PI) * 0.4, t * 0.15 - 2, Math.sin(t + Math.PI) * 0.4)
        const mid = new THREE.Vector3().lerpVectors(p1, p2, 0.5)
        const dir = new THREE.Vector3().subVectors(p2, p1)
        const len = dir.length()
        return (
          <mesh key={i} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())}>
            <cylinderGeometry args={[0.015, 0.015, len, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#f59e0b' : '#ef4444'} emissive={i % 2 === 0 ? '#f59e0b' : '#ef4444'} emissiveIntensity={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

/* ─── Hero 3D Scene ─── */
function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
      <pointLight position={[0, 10, -10]} intensity={0.3} color="#8b5cf6" />
      
      <Suspense fallback={null}>
        <AtomModel />
        <FloatingMolecule position={[-3, 1.5, -2]} color="#10b981" scale={0.8} />
        <FloatingMolecule position={[3.5, -1, -1]} color="#3b82f6" scale={0.6} />
        <FloatingMolecule position={[-2.5, -2, -1.5]} color="#f59e0b" scale={0.7} />
        <DNAStrand position={[4, 0, -3]} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Suspense>
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}

/* ─── Lab Card Component ─── */
function LabCard({ title, description, icon: Icon, color, bgGlow, path, features, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <Link to={path} className="block group">
        <div className={`relative glass rounded-2xl p-6 h-full transition-all duration-500 group-hover:scale-[1.02] group-hover:${bgGlow} overflow-hidden`}>
          {/* Glow effect */}
          <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
          
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="text-white text-2xl" />
          </div>
          
          {/* Content */}
          <h3 className="text-xl font-display font-bold text-white mb-2">{title}</h3>
          <p className="text-dark-400 text-sm mb-4 leading-relaxed">{description}</p>
          
          {/* Features */}
          <div className="space-y-2 mb-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs text-dark-300">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color}`} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className={`flex items-center space-x-2 text-sm font-medium ${
            path === '/kimya' ? 'text-chemistry' : path === '/fizik' ? 'text-physics' : 'text-biology'
          } group-hover:translate-x-1 transition-transform duration-300`}>
            <FiPlay className="text-xs" />
            <span>Laboratuvara Gir</span>
            <FiArrowRight className="text-xs" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ─── Stats Section ─── */
function StatsSection() {
  const stats = [
    { label: 'Deney Sayısı', value: '50+', color: 'text-chemistry' },
    { label: '3D Animasyon', value: '100+', color: 'text-physics' },
    { label: 'Konu Başlığı', value: '30+', color: 'text-biology' },
    { label: 'İnteraktif Model', value: '25+', color: 'text-primary-400' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="glass rounded-2xl p-6 text-center"
        >
          <div className={`text-3xl font-display font-bold ${stat.color} mb-1`}>{stat.value}</div>
          <div className="text-dark-400 text-sm">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Main HomePage ─── */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/60 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent z-10" />
        
        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-chemistry animate-pulse" />
                <span className="text-xs text-dark-300 font-medium">3D İnteraktif Bilim Platformu</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                <span className="text-white">Laboratuvar</span>
                <br />
                <span className="text-gradient">Dedektifi</span>
              </h1>
              
              <p className="text-lg text-dark-300 mb-8 leading-relaxed max-w-lg">
                Kimya, fizik ve biyoloji deneylerini <strong className="text-white">3 boyutlu</strong> ve{' '}
                <strong className="text-white">interaktif</strong> ortamda keşfet. 
                pH ölçümünden elektrik devrelerine, hücre yapısından DNA modeline kadar her şey parmaklarının ucunda.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/kimya"
                  className="btn-primary px-8 py-3 text-base shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow"
                >
                  <FiPlay className="mr-2" />
                  Keşfetmeye Başla
                </Link>
                <a
                  href="#laboratories"
                  className="btn-ghost px-8 py-3 text-base border border-dark-700 hover:border-dark-500"
                >
                  Laboratuvarları İncele
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Labs Section */}
      <section id="laboratories" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Sanal <span className="text-gradient">Laboratuvarlar</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Üç farklı bilim dalında tam donanımlı 3D laboratuvarlarda deneyler yap, keşfet ve öğren.
            </p>
          </motion.div>

          {/* Stats */}
          <StatsSection />

          {/* Lab Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <LabCard
              title="Kimya Laboratuvarı"
              description="Kimyasal reaksiyonları 3D ortamda gerçekleştir. pH ölçümü yap, titrasyonlar gerçekleştir, asit-baz dengeleri ile çalış."
              icon={GiAtom}
              color="from-chemistry to-emerald-400"
              bgGlow="glow-chemistry"
              path="/kimya"
              delay={0}
              features={[
                'pH ve Sıcaklık Ölçümü',
                'Asit-Baz Reaksiyonları',
                'Titrasyon Deneyleri',
                'Periyodik Tablo (3D)',
                'Kimyasal Bağ Modelleri',
                'Yanma ve Çökelme Tepkimeleri',
              ]}
            />
            <LabCard
              title="Fizik Laboratuvarı"
              description="Elektrik devreleri kur, mekanik deneyleri simüle et. Ohm yasasından dalga mekaniğine kadar her şeyi gör."
              icon={FiZap}
              color="from-physics to-blue-400"
              bgGlow="glow-physics"
              path="/fizik"
              delay={0.15}
              features={[
                'Elektrik Devresi Kurma',
                'Ohm Yasası Simülasyonu',
                'Sarkaç ve Mekanik Deneyler',
                'Dalga Mekaniği',
                'Manyetik Alan Görselleştirme',
                'Atış ve Hareket Deneyleri',
              ]}
            />
            <LabCard
              title="Biyoloji Laboratuvarı"
              description="Hücrenin 3D modelini keşfet, DNA çift sarmalını incele. Organelleri yakından tanı, biyolojik süreçleri izle."
              icon={GiDna2}
              color="from-biology to-violet-400"
              bgGlow="glow-biology"
              path="/biyoloji"
              delay={0.3}
              features={[
                'Hayvan Hücresi 3D Modeli',
                'Bitki Hücresi 3D Modeli',
                'DNA Çift Sarmal Yapısı',
                'Organel Detaylı İnceleme',
                'Çekirdek İç Yapısı',
                'Hücre Bölünmesi Animasyonu',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Neden <span className="text-gradient">Laboratuvar Dedektifi</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '3D Görselleştirme', desc: 'Tüm deneyler ve modeller gerçekçi 3 boyutlu ortamda', icon: '🎯' },
              { title: 'İnteraktif Deneyler', desc: 'Parametreleri değiştir, sonuçları anında gör', icon: '⚡' },
              { title: 'Güvenli Ortam', desc: 'Tehlikeli deneyleri güvenle sanal ortamda dene', icon: '🛡️' },
              { title: 'Kapsamlı İçerik', desc: 'Lise ve üniversite müfredatına uygun', icon: '📚' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-display font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GiMicroscope className="text-primary-500" />
            <span className="font-display font-bold text-white">Laboratuvar Dedektifi</span>
          </div>
          <p className="text-dark-500 text-sm">
            © 2026 Laboratuvar Dedektifi. 3D İnteraktif Bilim Eğitim Platformu.
          </p>
        </div>
      </footer>
    </div>
  )
}
