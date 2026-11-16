import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GiAtom, GiDna2, GiMicroscope } from 'react-icons/gi'
import { FiZap, FiArrowRight, FiCheckCircle, FiShield, FiCompass, FiLayers } from 'react-icons/fi'

export default function HomePage() {
  const labs = [
    {
      id: 'kimya',
      title: 'Kimya Laboratuvarı',
      subtitle: 'Tepkimeler, pH & Atom Modelleri',
      desc: 'Nötrleşme ve yanma deneyleri, çoklu madde pH ölçümü, büretli titrasyon ve 118 elementin dönen 3D Bohr atom modelleri.',
      path: '/kimya',
      accent: 'emerald',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-dark-950',
      icon: GiAtom,
      features: [
        'Nötrleşme ve Yanma Deneyleri',
        'Dijital pH Metre & Karışım Simülatörü',
        'Büret & Fenolftalein Titrasyonu',
        '118 Elementin 3D Bohr Atom Modelleri',
      ],
    },
    {
      id: 'fizik',
      title: 'Fizik Laboratuvarı',
      subtitle: 'Devreler, Manyetosfer & Mekanik',
      desc: 'Seri/paralel 2 ampullü devreler, aşırı gerilim patlama koruması, ayarlanabilir ağırlıklı sarkaç, Dünya manyetosferi ve 200m atış sahası.',
      path: '/fizik',
      accent: 'sky',
      tagColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      btnColor: 'bg-sky-500 hover:bg-sky-400 text-dark-950',
      icon: FiZap,
      features: [
        '2 Ampul Seri & Paralel Devreler (Patlama Uyarılı)',
        'Sarkaç Kütle & Ağırlık Seçim Paneli',
        'Dünya Manyetosferi, Auroralar & Güneş Rüzgarı',
        'Metre Çizgili 200m Atış Hareketi Sahası',
      ],
    },
    {
      id: 'biyoloji',
      title: 'Biyoloji Laboratuvarı',
      subtitle: 'Hücre Mimarisi & Akıcı Bölünme',
      desc: 'Kristalı gerçekçi mitokondri, altıgen bitki hücresi, nükleer porlu çekirdek anatomisi ve 1 → 2 → 4 → 8 akıcı mitoz bölünme motoru.',
      path: '/biyoloji',
      accent: 'purple',
      tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      btnColor: 'bg-purple-500 hover:bg-purple-400 text-dark-950',
      icon: GiDna2,
      features: [
        'Katlantılı Krista Sırtlı Gerçekçi Mitokondri',
        'Altıgen Hücre Çeperli Bitki Hücresi & Kloroplast',
        'Por Kompleksli ve Kromatinli Çekirdek Yapısı',
        'Akıcı Boğumlanan 1→2→4→8 Mitoz Bölünme',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 border-b border-slate-800/80 overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs text-slate-300 font-medium mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>İnteraktif 3D Eğitim Platformu</span>
          </motion.div>

          {/* Main Title - Modern, Editorial & Prestigious */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5 leading-tight"
          >
            Laboratuvar Dedektifi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal"
          >
            Kimya, fizik ve biyoloji deneylerini cihazınızda doğrudan çalıştırın. Gerçek fizik motoru, formüller ve hassas üç boyutlu simülasyonlar tek bir ekranda.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto"
          >
            <a
              href="#labs"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-200 transition-all shadow-md shadow-white/10 flex items-center justify-center space-x-2"
            >
              <span>Laboratuvarları Başlat</span>
              <FiArrowRight />
            </a>
            <Link
              to="/kimya"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              <GiMicroscope className="text-emerald-400 text-base" />
              <span>Hızlı Başlangıç</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CORE LABS SHOWCASE */}
      <section id="labs" className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 w-full flex-1">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Deney Alanları
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Çalışmak istediğiniz laboratuvarı seçerek deney araçlarına hemen ulaşın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {labs.map((lab, idx) => {
            const Icon = lab.icon
            return (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <Icon className="text-2xl text-white" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${lab.tagColor}`}>
                      3D Modül
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-white mb-1">
                    {lab.title}
                  </h3>
                  <div className="text-xs text-slate-400 mb-3 font-medium">
                    {lab.subtitle}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {lab.desc}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-2 mb-8 pt-4 border-t border-slate-800/80">
                    {lab.features.map((f, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                        <FiCheckCircle className="text-slate-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Entry Button */}
                <Link
                  to={lab.path}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${lab.btnColor}`}
                >
                  <span>Laboratuvara Gir</span>
                  <FiArrowRight />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* COMPACT CLEAN FOOTER */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950/80 text-center text-xs text-slate-400 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-semibold text-slate-300">
            Laboratuvar Dedektifi &copy; {new Date().getFullYear()}
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <Link to="/kimya" className="hover:text-white transition-colors">Kimya</Link>
            <Link to="/fizik" className="hover:text-white transition-colors">Fizik</Link>
            <Link to="/biyoloji" className="hover:text-white transition-colors">Biyoloji</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
