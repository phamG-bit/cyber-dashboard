import { motion } from 'framer-motion'

const RARITY = {
  COMMON:    { color: '#00ffff', label: 'COMMON' },
  RARE:      { color: '#f5ff00', label: 'RARE' },
  EPIC:      { color: '#bf00ff', label: 'EPIC' },
  LEGENDARY: { color: '#ff0033', label: 'LEGENDARY' },
}

export default function WeaponCard({ weapon, index = 0 }) {
  const r = RARITY[weapon.rarity] ?? RARITY.COMMON

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <motion.div
        className="relative overflow-hidden cursor-pointer"
        style={{ border: `1px solid ${r.color}30`, background: '#080808' }}
        initial="idle"
        whileHover="hovered"
        variants={{
          idle:    { boxShadow: '0 0 0px transparent' },
          hovered: { boxShadow: `0 0 18px ${r.color}28, 0 0 50px ${r.color}0a` },
        }}
        transition={{ duration: 0.25 }}
      >
        {/* ── Image placeholder ── */}
        <div className="relative h-44 overflow-hidden" style={{ background: '#050505' }}>
          {/* Tech grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${r.color}08 1px, transparent 1px), linear-gradient(90deg, ${r.color}08 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
            }}
          />
          {/* Corner HUD brackets */}
          <span className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{ borderColor: `${r.color}30` }} />
          <span className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{ borderColor: `${r.color}30` }} />
          <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{ borderColor: `${r.color}30` }} />
          <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{ borderColor: `${r.color}30` }} />
          {/* Placeholder label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono tracking-[0.3em]" style={{ color: `${r.color}18` }}>
              [ IMG PENDING ]
            </span>
          </div>
          {/* Rarity glow bar at top */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${r.color}60, transparent)` }} />

          {/* ── Hover stats overlay (slides up from bottom) ── */}
          <motion.div
            className="absolute inset-x-0 bottom-0 px-3 pt-6 pb-3"
            style={{ background: `linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.90) 60%, transparent 100%)` }}
            variants={{
              idle:    { y: '100%', opacity: 0 },
              hovered: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="space-y-1.5">
              {weapon.fireRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-xs font-mono text-white/40 tracking-widest">FIRE RATE</span>
                  <span className="text-xs font-mono" style={{ color: r.color }}>{weapon.fireRate} RPM</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs font-mono text-white/40 tracking-widest">ACCURACY</span>
                <span className="text-xs font-mono" style={{ color: r.color }}>{weapon.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-white/40 tracking-widest">MOD SLOTS</span>
                <div className="flex gap-1">
                  {Array.from({ length: 4 }, (_, i) => (
                    <span
                      key={i}
                      className="block w-2 h-2"
                      style={{
                        background: i < weapon.slots ? r.color : 'rgba(255,255,255,0.08)',
                        boxShadow: i < weapon.slots ? `0 0 4px ${r.color}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Info section ── */}
        <div className="p-4">
          {/* Type + rarity badge */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(245,255,0,0.35)' }}>
              {weapon.type}
            </span>
            <span
              className="text-xs font-mono px-1.5 py-0.5 tracking-widest"
              style={{
                color: r.color,
                border: `1px solid ${r.color}40`,
                background: `${r.color}0d`,
              }}
            >
              {weapon.rarity}
            </span>
          </div>

          {/* Name */}
          <h3
            className="text-base font-mono font-bold tracking-wider mb-0.5"
            style={{ color: r.color, textShadow: `0 0 8px ${r.color}60` }}
          >
            {weapon.name}
          </h3>
          <p className="text-xs font-mono mb-4" style={{ color: 'rgba(0,255,255,0.3)' }}>
            {weapon.manufacturer}
          </p>

          {/* Damage bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span style={{ color: 'rgba(0,255,255,0.45)' }}>DMG</span>
              <span style={{ color: r.color }}>{weapon.damage}</span>
            </div>
            <div className="h-px bg-cyber-muted overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: r.color, boxShadow: `0 0 5px ${r.color}` }}
                initial={{ width: 0 }}
                animate={{ width: `${weapon.damagePercent}%` }}
                transition={{ delay: index * 0.07 + 0.35, duration: 1.1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(245,255,0,0.08)' }}>
            <span className="text-xs font-mono" style={{ color: 'rgba(0,255,255,0.35)' }}>PRICE</span>
            <span
              className="text-sm font-mono font-bold"
              style={{ color: '#f5ff00', textShadow: '0 0 6px #f5ff00' }}
            >
              €$ {weapon.price.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
