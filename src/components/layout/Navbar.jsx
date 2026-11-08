import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiHome, FiDroplet, FiZap, FiHeart } from 'react-icons/fi'
import { GiMicroscope, GiAtom, GiDna2 } from 'react-icons/gi'

const navLinks = [
  { path: '/', label: 'Ana Sayfa', icon: FiHome, color: 'text-dark-300' },
  { path: '/kimya', label: 'Kimya Laboratuvarı', icon: GiAtom, color: 'text-chemistry' },
  { path: '/fizik', label: 'Fizik Laboratuvarı', icon: FiZap, color: 'text-physics' },
  { path: '/biyoloji', label: 'Biyoloji Laboratuvarı', icon: GiDna2, color: 'text-biology' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-dark-950/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-purple-500 to-chemistry flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <GiMicroscope className="text-white text-xl" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 via-purple-500 to-chemistry rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white">
                Laboratuvar <span className="text-gradient">Dedektifi</span>
              </h1>
              <p className="text-[10px] text-dark-400 -mt-1 tracking-wider uppercase">3D İnteraktif Bilim</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path !== '/' && location.pathname.startsWith(link.path))
              const Icon = link.icon
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? `${link.color} bg-dark-800/50`
                      : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/30'
                  }`}
                >
                  <Icon className="text-base" />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                        link.path === '/kimya' ? 'bg-chemistry' :
                        link.path === '/fizik' ? 'bg-physics' :
                        link.path === '/biyoloji' ? 'bg-biology' :
                        'bg-primary-500'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-dark-700/50"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path))
                const Icon = link.icon
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? `${link.color} bg-dark-800/50`
                        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/30'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
