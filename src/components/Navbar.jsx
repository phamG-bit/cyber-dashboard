import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = ['DASHBOARD', 'ANALYTICS', 'NETWORK', 'TERMINAL', 'SETTINGS']

export default function Navbar() {
  const [clock, setClock] = useState('')
  const [glitching, setGlitching] = useState(false)

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

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-cyber-black/90 backdrop-blur-sm"
      style={{ borderBottom: '1px solid rgba(245,255,0,0.2)', boxShadow: '0 1px 30px rgba(245,255,0,0.08)' }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 20 }}
    >
      {/* Logo with glitch */}
      <div className="relative select-none">
        <span
          className="text-xl font-mono font-bold text-neon-yellow tracking-widest"
          style={{ textShadow: '0 0 8px #f5ff00, 0 0 16px #f5ff00' }}
        >
          CYBER
        </span>
        <span
          className="text-xl font-mono font-bold text-neon-cyan tracking-widest"
          style={{ textShadow: '0 0 8px #00ffff, 0 0 16px #00ffff' }}
        >
          .OS
        </span>
        {/* Glitch layers */}
        {glitching && (
          <>
            <span
              className="absolute inset-0 text-xl font-mono font-bold text-neon-red tracking-widest"
              style={{ clipPath: 'inset(30% 0 50% 0)', transform: 'translate(3px, 0)', opacity: 0.8 }}
              aria-hidden="true"
            >
              CYBER.OS
            </span>
            <span
              className="absolute inset-0 text-xl font-mono font-bold text-neon-cyan tracking-widest"
              style={{ clipPath: 'inset(65% 0 10% 0)', transform: 'translate(-3px, 0)', opacity: 0.8 }}
              aria-hidden="true"
            >
              CYBER.OS
            </span>
          </>
        )}
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link, i) => (
          <motion.a
            key={link}
            href="#"
            className="text-xs font-mono tracking-widest text-neon-yellow/60 hover:text-neon-cyan transition-colors duration-200 cursor-pointer"
            whileHover={{ textShadow: '0 0 8px #00ffff' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
          >
            {link}
          </motion.a>
        ))}
      </div>

      {/* Clock + status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span className="text-xs font-mono text-neon-cyan/60 tracking-widest hidden sm:block">ONLINE</span>
        </div>
        <span
          className="text-sm font-mono text-neon-cyan tracking-widest"
          style={{ textShadow: '0 0 6px #00ffff' }}
        >
          {clock}
        </span>
      </div>
    </motion.nav>
  )
}
