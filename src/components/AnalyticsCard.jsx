import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDesignMode, ComponentTag } from '../context/DesignModeContext'

const ACCENT = {
  yellow: { text: '#f5ff00', glow: '0 0 6px #f5ff00', bar: '#f5ff00', border: 'rgba(245,255,0,0.25)' },
  cyan:   { text: '#00ffff', glow: '0 0 6px #00ffff', bar: '#00ffff', border: 'rgba(0,255,255,0.25)' },
  red:    { text: '#ff0033', glow: '0 0 6px #ff0033', bar: '#ff0033', border: 'rgba(255,0,51,0.25)' },
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function useCounter(target, duration = 1400) {
  const [value, setValue] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(easeOutCubic(progress) * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

export default function AnalyticsCard({ title, value, unit = '', delta, color = 'yellow', progress = 70, index = 0 }) {
  const c = ACCENT[color] ?? ACCENT.yellow
  const count = useCounter(value)
  const isPositive = delta >= 0
  const { isDesignMode } = useDesignMode()

  return (
    <motion.div
      className="relative p-5 bg-cyber-dark overflow-hidden"
      style={{
        border: `1px solid ${c.border}`,
        ...(isDesignMode ? { outline: '1px dashed rgba(0,255,255,0.5)', outlineOffset: '2px' } : {}),
      }}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4 }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 30px ${c.text}22`,
        transition: { duration: 0.2 },
      }}
    >
      {isDesignMode && <ComponentTag name="AnalyticsCard" />}

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: c.text }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: c.text }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-mono tracking-widest text-neon-yellow/50 uppercase">{title}</span>
        {delta !== undefined && (
          <span className="text-xs font-mono" style={{ color: isPositive ? '#00ffff' : '#ff0033' }}>
            {isPositive ? '+' : ''}{delta}%
          </span>
        )}
      </div>

      {/* Counter */}
      <div className="mb-4">
        <span className="text-4xl font-mono font-bold tabular-nums" style={{ color: c.text, textShadow: c.glow }}>
          {count.toLocaleString()}
        </span>
        {unit && (
          <span className="text-sm font-mono ml-2" style={{ color: c.text, opacity: 0.5 }}>{unit}</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-cyber-muted overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: c.bar, boxShadow: `0 0 6px ${c.bar}` }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: index * 0.12 + 0.3, duration: 1.4, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs font-mono text-neon-yellow/20">0</span>
        <span className="text-xs font-mono" style={{ color: c.text, opacity: 0.4 }}>{progress}%</span>
      </div>
    </motion.div>
  )
}
