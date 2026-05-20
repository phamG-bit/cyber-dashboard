import { motion } from 'framer-motion'
import { useDesignMode, ComponentTag } from '../context/DesignModeContext'

const RARITY = {
  COMMON:    { color: '#00ffff' },
  RARE:      { color: '#f5ff00' },
  EPIC:      { color: '#bf00ff' },
  LEGENDARY: { color: '#ff0033' },
}

export default function WeaponThumb({ weapon, isSelected, onClick, index }) {
  const r = RARITY[weapon.rarity] ?? RARITY.COMMON
  const { isDesignMode } = useDesignMode()

  return (
    <motion.div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer relative overflow-hidden"
      style={{
        borderLeft: `2px solid ${isSelected ? r.color : 'transparent'}`,
        background: isSelected ? `${r.color}0a` : 'transparent',
        ...(isDesignMode ? { outline: '1px dashed rgba(0,255,255,0.35)' } : {}),
      }}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ background: `${r.color}07`, x: isSelected ? 0 : 2 }}
    >
      {isDesignMode && <ComponentTag name="WeaponThumb" />}

      {/* Selected indicator scanline sweep */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(90deg, ${r.color}08, transparent)` }}
        />
      )}

      {/* Thumbnail image */}
      <div
        className="w-14 h-9 flex-shrink-0 flex items-center justify-center"
        style={{ background: '#050505' }}
      >
        <img
          src={weapon.image}
          alt={weapon.name}
          className="w-full h-full object-contain"
          style={{
            filter: `drop-shadow(0 0 ${isSelected ? '8px' : '4px'} ${r.color}${isSelected ? '90' : '50'})`,
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-mono font-bold truncate mb-0.5"
          style={{
            color: isSelected ? r.color : 'rgba(245,255,0,0.65)',
            textShadow: isSelected ? `0 0 6px ${r.color}` : 'none',
          }}
        >
          {weapon.name}
        </p>
        <p className="text-xs font-mono" style={{ color: 'rgba(0,255,255,0.3)' }}>
          {weapon.type}
        </p>
      </div>

      {/* Rarity dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: r.color }}
        animate={{ boxShadow: isSelected ? [`0 0 4px ${r.color}`, `0 0 10px ${r.color}`, `0 0 4px ${r.color}`] : `0 0 0px transparent` }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.div>
  )
}
