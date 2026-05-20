import { motion } from 'framer-motion'

const ACCENT_COLORS = {
  cyan:   { border: '#00ffff', text: '#00ffff', dot: '#00ff88' },
  yellow: { border: '#f5ff00', text: '#f5ff00', dot: '#f5ff00' },
  red:    { border: '#ff0033', text: '#ff0033', dot: '#ff0033' },
}

export default function HUDPanel({ title, children, className = '', accentColor = 'cyan', active = true }) {
  const c = ACCENT_COLORS[accentColor] ?? ACCENT_COLORS.cyan

  return (
    <motion.div
      className={`relative p-5 ${className}`}
      style={{
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${c.border}30`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: 1,
        x: 0,
        boxShadow: [
          `0 0 5px ${c.border}10`,
          `0 0 20px ${c.border}25`,
          `0 0 5px ${c.border}10`,
        ],
      }}
      transition={{
        opacity: { duration: 0.4 },
        x: { duration: 0.4 },
        boxShadow: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
      }}
    >
      {/* HUD corner brackets */}
      {[
        { top: 0, left: 0, borderTop: 2, borderLeft: 2 },
        { top: 0, right: 0, borderTop: 2, borderRight: 2 },
        { bottom: 0, left: 0, borderBottom: 2, borderLeft: 2 },
        { bottom: 0, right: 0, borderBottom: 2, borderRight: 2 },
      ].map((pos, i) => (
        <motion.span
          key={i}
          className="absolute w-3 h-3"
          style={{
            ...pos,
            borderColor: c.border,
            borderTopWidth: pos.borderTop,
            borderLeftWidth: pos.borderLeft,
            borderBottomWidth: pos.borderBottom,
            borderRightWidth: pos.borderRight,
            borderStyle: 'solid',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.07 }}
        />
      ))}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-2" style={{ borderBottom: `1px solid ${c.border}20` }}>
        <motion.span
          className="w-2 h-2 rounded-full"
          style={{ background: active ? c.dot : '#ff0033' }}
          animate={{ opacity: active ? [1, 0.4, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <span
          className="text-xs font-mono tracking-widest uppercase"
          style={{ color: c.text, opacity: 0.7 }}
        >
          {title}
        </span>
        <span className="ml-auto text-xs font-mono" style={{ color: c.text, opacity: 0.3 }}>
          {active ? 'ACTIVE' : 'STANDBY'}
        </span>
      </div>

      {/* Content */}
      {children}
    </motion.div>
  )
}
