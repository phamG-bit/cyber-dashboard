import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WeaponCard from '../components/WeaponCard'

const WEAPONS = [
  {
    id: 1,
    name: 'MILITECH AJAX',
    type: 'ASSAULT RIFLE',
    manufacturer: 'Militech Corp.',
    rarity: 'EPIC',
    damage: 850,
    fireRate: 720,
    accuracy: 74,
    price: 12500,
    damagePercent: 68,
    slots: 3,
  },
  {
    id: 2,
    name: 'KONPEKI PHANTOM',
    type: 'PISTOL',
    manufacturer: 'Custom Build',
    rarity: 'LEGENDARY',
    damage: 1240,
    fireRate: 280,
    accuracy: 91,
    price: 45000,
    damagePercent: 95,
    slots: 4,
  },
  {
    id: 3,
    name: 'NOKOTA M-179e',
    type: 'TECH WEAPON',
    manufacturer: 'Nokota Arms',
    rarity: 'RARE',
    damage: 620,
    fireRate: 180,
    accuracy: 88,
    price: 8750,
    damagePercent: 50,
    slots: 2,
  },
  {
    id: 4,
    name: 'ARASAKA KATANA',
    type: 'BLADE',
    manufacturer: 'Arasaka Corp.',
    rarity: 'LEGENDARY',
    damage: 980,
    fireRate: 0,
    accuracy: 100,
    price: 38000,
    damagePercent: 79,
    slots: 2,
  },
  {
    id: 5,
    name: 'MAELSTROM MSM-41',
    type: 'SMG',
    manufacturer: 'Maelstrom Gang',
    rarity: 'COMMON',
    damage: 390,
    fireRate: 1100,
    accuracy: 58,
    price: 2400,
    damagePercent: 31,
    slots: 1,
  },
  {
    id: 6,
    name: 'TSUNAMI NEKOMATA',
    type: 'SNIPER RIFLE',
    manufacturer: 'Tsunami Defense',
    rarity: 'EPIC',
    damage: 2100,
    fireRate: 45,
    accuracy: 97,
    price: 29000,
    damagePercent: 86,
    slots: 3,
  },
]

const FILTERS = [
  { label: 'ALL',    match: null },
  { label: 'RIFLE',  match: 'ASSAULT RIFLE' },
  { label: 'PISTOL', match: 'PISTOL' },
  { label: 'TECH',   match: 'TECH WEAPON' },
  { label: 'BLADE',  match: 'BLADE' },
  { label: 'SMG',    match: 'SMG' },
  { label: 'SNIPER', match: 'SNIPER RIFLE' },
]

export default function Arsenal() {
  const [activeFilter, setActiveFilter] = useState(null)

  const filtered = activeFilter === null
    ? WEAPONS
    : WEAPONS.filter(w => w.type === activeFilter)

  return (
    <motion.div
      className="relative z-10 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <main className="pt-20 px-4 md:px-8 pb-8 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="mb-8 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-1 h-6 bg-neon-red" style={{ boxShadow: '0 0 8px #ff0033' }} />
                <h2
                  className="text-lg font-mono font-bold tracking-widest uppercase"
                  style={{ color: '#f5ff00', textShadow: '0 0 6px #f5ff00' }}
                >
                  Arsenal
                </h2>
              </div>
              <p className="text-xs font-mono ml-4" style={{ color: 'rgba(0,255,255,0.4)' }}>
                CLEARANCE: ALPHA // {WEAPONS.length} WEAPONS INDEXED // HOVER TO INSPECT
              </p>
            </div>
            {/* Live stats */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'LEGENDARY', value: WEAPONS.filter(w => w.rarity === 'LEGENDARY').length, color: '#ff0033' },
                { label: 'EPIC',      value: WEAPONS.filter(w => w.rarity === 'EPIC').length,      color: '#bf00ff' },
                { label: 'RARE',      value: WEAPONS.filter(w => w.rarity === 'RARE').length,      color: '#f5ff00' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-mono font-bold" style={{ color: stat.color, textShadow: `0 0 6px ${stat.color}` }}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono tracking-widest" style={{ color: `${stat.color}60` }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map(f => {
            const isActive = activeFilter === f.match
            return (
              <motion.button
                key={f.label}
                onClick={() => setActiveFilter(f.match)}
                className="px-4 py-1.5 text-xs font-mono tracking-widest uppercase cursor-pointer"
                style={{
                  border:     isActive ? '1px solid #f5ff00' : '1px solid rgba(245,255,0,0.18)',
                  color:      isActive ? '#f5ff00' : 'rgba(245,255,0,0.35)',
                  background: isActive ? 'rgba(245,255,0,0.07)' : 'transparent',
                  boxShadow:  isActive ? '0 0 10px rgba(245,255,0,0.25)' : 'none',
                }}
                whileHover={{ color: '#f5ff00', borderColor: '#f5ff00' }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.12 }}
              >
                {f.label}
              </motion.button>
            )
          })}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: 'rgba(0,255,255,0.3)' }}>
              {filtered.length} ITEM{filtered.length !== 1 ? 'S' : ''}
            </span>
          </div>
        </div>

        {/* Weapon grid — key on filter so cards re-animate on filter change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter ?? 'all'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((weapon, i) => (
              <WeaponCard key={weapon.id} weapon={weapon} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-xs font-mono tracking-widest" style={{ color: 'rgba(0,255,255,0.3)' }}>
                  NO WEAPONS MATCH THIS FILTER
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer bar */}
        <div
          className="mt-8 flex items-center justify-between px-4 py-2"
          style={{ border: '1px solid rgba(245,255,0,0.08)', background: '#0a0a0a' }}
        >
          <span className="text-xs font-mono" style={{ color: 'rgba(245,255,0,0.25)' }}>
            ARSENAL v1.0 // WEAPON DATABASE
          </span>
          <div className="flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#ff0033' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span className="text-xs font-mono" style={{ color: 'rgba(255,0,51,0.5)' }}>
              RESTRICTED ACCESS
            </span>
          </div>
        </div>
      </main>
    </motion.div>
  )
}
