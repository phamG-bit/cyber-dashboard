import { motion } from 'framer-motion'

const COLORS = {
  yellow: {
    border: '#f5ff00',
    glow:   '#f5ff00',
    text:   '#f5ff00',
    bg:     'rgba(245,255,0,0.06)',
    bgHover:'rgba(245,255,0,0.12)',
  },
  cyan: {
    border: '#00ffff',
    glow:   '#00ffff',
    text:   '#00ffff',
    bg:     'rgba(0,255,255,0.06)',
    bgHover:'rgba(0,255,255,0.12)',
  },
  red: {
    border: '#ff0033',
    glow:   '#ff0033',
    text:   '#ff0033',
    bg:     'rgba(255,0,51,0.06)',
    bgHover:'rgba(255,0,51,0.12)',
  },
}

export default function GlowButton({ children, color = 'yellow', onClick, className = '' }) {
  const c = COLORS[color] ?? COLORS.yellow

  return (
    <motion.button
      onClick={onClick}
      className={`font-mono uppercase tracking-widest text-sm px-6 py-2.5 cursor-pointer transition-all duration-150 ${className}`}
      style={{
        color: c.text,
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 0 1px transparent`,
      }}
      whileHover={{
        scale: 1.04,
        background: c.bgHover,
        boxShadow: `0 0 12px ${c.glow}, 0 0 30px ${c.glow}44`,
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {children}
    </motion.button>
  )
}
