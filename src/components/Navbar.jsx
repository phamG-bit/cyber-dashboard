import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesignMode, ComponentTag } from '../context/DesignModeContext'
import { useUISound } from '../hooks/useUISound'

const NAV_ITEMS = [
  { label: 'DASHBOARD', page: 'dashboard' },
  { label: 'ARSENAL',   page: 'arsenal' },
  { label: 'ANALYTICS', page: null },
  { label: 'NETWORK',   page: null },
  { label: 'SETTINGS',  page: null },
]

export default function Navbar({ activePage = 'dashboard', onNavigate }) {
  const [clock, setClock] = useState('')
  const [glitching, setGlitching] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDesignMode, toggleDesignMode } = useDesignMode()
  const sounds = useUISound()

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const trigger = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 400)
    }, 4000)
    return () => clearInterval(trigger)
  }, [])

  return (<>
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-cyber-black/90 backdrop-blur-sm"
      style={{
        borderBottom: '1px solid rgba(245,255,0,0.2)',
        boxShadow: '0 1px 30px rgba(245,255,0,0.08)',
        ...(isDesignMode ? { outline: '1px dashed rgba(0,255,255,0.5)' } : {}),
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 20 }}
    >
      {isDesignMode && <ComponentTag name="Navbar" />}

      {/* Logo */}
      <div className="relative select-none cursor-pointer" onClick={() => onNavigate?.('dashboard')}>
        <span className="text-xl font-mono font-bold text-neon-yellow tracking-widest" style={{ textShadow: '0 0 8px #f5ff00, 0 0 16px #f5ff00' }}>
          CYBER
        </span>
        <span className="text-xl font-mono font-bold text-neon-cyan tracking-widest" style={{ textShadow: '0 0 8px #00ffff, 0 0 16px #00ffff' }}>
          .OS
        </span>
        {glitching && (
          <>
            <span className="absolute inset-0 text-xl font-mono font-bold text-neon-red tracking-widest" style={{ clipPath: 'inset(30% 0 50% 0)', transform: 'translate(3px, 0)', opacity: 0.8 }} aria-hidden="true">
              CYBER.OS
            </span>
            <span className="absolute inset-0 text-xl font-mono font-bold text-neon-cyan tracking-widest" style={{ clipPath: 'inset(65% 0 10% 0)', transform: 'translate(-3px, 0)', opacity: 0.8 }} aria-hidden="true">
              CYBER.OS
            </span>
          </>
        )}
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_ITEMS.map((item, i) => {
          const isActive = item.page === activePage
          const isNavigable = item.page !== null
          return (
            <div key={item.label} className="relative flex flex-col items-center gap-1">
              <motion.button
                onClick={() => { if (isNavigable) { sounds.click(); onNavigate?.(item.page) } }}
                className="text-xs font-mono tracking-widest transition-colors duration-150"
                style={{
                  color:      isActive ? '#f5ff00' : isNavigable ? 'rgba(245,255,0,0.45)' : 'rgba(245,255,0,0.2)',
                  cursor:     isNavigable ? 'pointer' : 'default',
                  textShadow: isActive ? '0 0 8px #f5ff00' : 'none',
                }}
                whileHover={isNavigable ? { color: '#f5ff00', textShadow: '0 0 8px #f5ff00' } : {}}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
              >
                {item.label}
              </motion.button>
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-px"
                  style={{ background: '#f5ff00', boxShadow: '0 0 6px #f5ff00' }}
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Right: design toggle + status + clock */}
      <div className="flex items-center gap-4">
        {/* Design mode toggle */}
        <motion.button
          onClick={() => { sounds.toggle(!isDesignMode); toggleDesignMode() }}
          className="hidden sm:flex items-center gap-1.5 text-xs font-mono tracking-widest px-2.5 py-1 cursor-pointer"
          style={{
            border:     isDesignMode ? '1px solid #00ffff' : '1px solid rgba(245,255,0,0.2)',
            color:      isDesignMode ? '#00ffff' : 'rgba(245,255,0,0.4)',
            background: isDesignMode ? 'rgba(0,255,255,0.07)' : 'transparent',
            boxShadow:  isDesignMode ? '0 0 10px rgba(0,255,255,0.25)' : 'none',
            textShadow: isDesignMode ? '0 0 6px #00ffff' : 'none',
            transition: 'all 0.2s ease',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ opacity: 0.7 }}>⟨/⟩</span>
          {isDesignMode ? 'DESIGN' : 'DEV'}
        </motion.button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span className="text-xs font-mono text-neon-cyan/60 tracking-widest hidden sm:block">ONLINE</span>
        </div>
        <button
          className="md:hidden cursor-pointer"
          onClick={() => { sounds.click(); setMobileMenuOpen(v => !v) }}
          style={{ color: mobileMenuOpen ? '#00ffff' : 'rgba(245,255,0,0.7)' }}
        >
          <span className="text-xl font-mono leading-none">{mobileMenuOpen ? '✕' : '≡'}</span>
        </button>
        <span className="text-sm font-mono text-neon-cyan tracking-widest" style={{ textShadow: '0 0 6px #00ffff' }}>
          {clock}
        </span>
      </div>
    </motion.nav>

    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          className="fixed inset-x-0 top-0 bottom-0 z-40 flex flex-col md:hidden"
          style={{ background: '#030303', paddingTop: '52px' }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.page === activePage
            const isNavigable = item.page !== null
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (isNavigable) { sounds.click(); onNavigate?.(item.page); setMobileMenuOpen(false) }
                }}
                className="flex items-center gap-3 px-8 py-5 font-mono tracking-[0.25em] text-sm text-left w-full"
                style={{
                  borderBottom: '1px solid rgba(245,255,0,0.05)',
                  color:      isActive ? '#f5ff00' : isNavigable ? 'rgba(245,255,0,0.4)' : 'rgba(245,255,0,0.12)',
                  cursor:     isNavigable ? 'pointer' : 'default',
                  textShadow: isActive ? '0 0 10px #f5ff00' : 'none',
                }}
              >
                <span style={{ color: isActive ? '#f5ff00' : 'rgba(245,255,0,0.15)' }}>▶</span>
                {item.label}
                {!isNavigable && <span className="ml-auto text-xs opacity-40">LOCKED</span>}
              </button>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  </>)
}
