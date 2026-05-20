import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDesignMode } from '../context/DesignModeContext'
import { useUISound } from '../hooks/useUISound'

const COLORS = {
  yellow: { border: '#f5ff00', glow: '#f5ff00', text: '#f5ff00', bg: 'rgba(245,255,0,0.06)',  bgHover: 'rgba(245,255,0,0.14)' },
  cyan:   { border: '#00ffff', glow: '#00ffff', text: '#00ffff', bg: 'rgba(0,255,255,0.06)',  bgHover: 'rgba(0,255,255,0.14)' },
  red:    { border: '#ff0033', glow: '#ff0033', text: '#ff0033', bg: 'rgba(255,0,51,0.06)',   bgHover: 'rgba(255,0,51,0.14)'  },
}

export default function GlowButton({ children, color = 'yellow', onClick, className = '', sound = 'click' }) {
  const c = COLORS[color] ?? COLORS.yellow
  const { isDesignMode } = useDesignMode()
  const sounds = useUISound()
  const [flashKey, setFlashKey] = useState(null)

  const handleClick = () => {
    sounds[sound]?.()
    setFlashKey(Date.now())
    onClick?.()
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`relative overflow-hidden font-mono uppercase tracking-widest text-sm px-6 py-2.5 cursor-pointer transition-all duration-150 ${className}`}
      style={{
        color:      c.text,
        background: c.bg,
        border:     `1px solid ${c.border}`,
        boxShadow:  '0 0 0 1px transparent',
        ...(isDesignMode ? { outline: '1px dashed rgba(245,255,0,0.45)', outlineOffset: '2px' } : {}),
      }}
      whileHover={{
        scale: 1.04,
        background: c.bgHover,
        boxShadow: `0 0 12px ${c.glow}, 0 0 30px ${c.glow}44`,
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {/* Click glow flash — remounts on each click to restart animation */}
      {flashKey && (
        <motion.span
          key={flashKey}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${c.glow}40, transparent 70%)`, zIndex: 1 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      )}
      <span className="relative" style={{ zIndex: 2 }}>{children}</span>
    </motion.button>
  )
}
