import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WeaponThumb from '../components/WeaponThumb'
import GlowButton from '../components/GlowButton'
import { useDesignMode, ComponentTag } from '../context/DesignModeContext'

const WEAPONS = [
  {
    id: 1,
    name: 'MALORIAN ARMS 3516',
    type: 'PISTOL',
    manufacturer: 'Malorian Arms',
    rarity: 'LEGENDARY',
    damage: 1560,
    fireRate: 320,
    accuracy: 96,
    price: 78000,
    damagePercent: 100,
    fireRatePercent: 55,
    accuracyPercent: 96,
    slots: 4,
    serial: 'MAL-3516-77X',
    origin: 'Night City',
    image: '/weapons/malorian-3516.png',
  },
  {
    id: 2,
    name: 'BALD EAGLE',
    type: 'PISTOL',
    manufacturer: 'Constitutional Arms',
    rarity: 'EPIC',
    damage: 980,
    fireRate: 210,
    accuracy: 89,
    price: 22000,
    damagePercent: 63,
    fireRatePercent: 36,
    accuracyPercent: 89,
    slots: 3,
    serial: 'CA-BE-0491',
    origin: 'Pacifica',
    image: '/weapons/bald-eagle.png',
  },
  {
    id: 3,
    name: 'TSUNAMI RASETSU',
    type: 'SNIPER RIFLE',
    manufacturer: 'Tsunami Defense Systems',
    rarity: 'LEGENDARY',
    damage: 3200,
    fireRate: 28,
    accuracy: 99,
    price: 95000,
    damagePercent: 98,
    fireRatePercent: 5,
    accuracyPercent: 99,
    slots: 4,
    serial: 'TDS-RST-2077',
    origin: 'Arasaka Tower',
    image: '/weapons/tsunami-rasetsu.png',
  },
  {
    id: 4,
    name: 'HYPER CRITICAL',
    type: 'ASSAULT RIFLE',
    manufacturer: 'Precision Arms Ltd.',
    rarity: 'EPIC',
    damage: 1100,
    fireRate: 580,
    accuracy: 82,
    price: 31500,
    damagePercent: 71,
    fireRatePercent: 100,
    accuracyPercent: 82,
    slots: 3,
    serial: 'PAL-HC-0088',
    origin: 'Dogtown',
    image: '/weapons/hyper-critical.png',
  },
  {
    id: 5,
    name: 'SOVEREIGN',
    type: 'SHOTGUN',
    manufacturer: 'Rostovic',
    rarity: 'RARE',
    damage: 1850,
    fireRate: 60,
    accuracy: 55,
    price: 18000,
    damagePercent: 77,
    fireRatePercent: 10,
    accuracyPercent: 55,
    slots: 2,
    serial: 'ROS-SOV-314',
    origin: 'Heywood',
    image: '/weapons/sovereign.png',
  },
  {
    id: 6,
    name: "O'FIVE",
    type: 'SNIPER RIFLE',
    manufacturer: 'Militech Corp.',
    rarity: 'EPIC',
    damage: 2750,
    fireRate: 35,
    accuracy: 98,
    price: 54000,
    damagePercent: 88,
    fireRatePercent: 6,
    accuracyPercent: 98,
    slots: 3,
    serial: 'MTC-OF5-119',
    origin: 'Corp Plaza',
    image: '/weapons/ofive.png',
  },
]

const FILTERS = [
  { label: 'ALL',     match: null },
  { label: 'PISTOL',  match: 'PISTOL' },
  { label: 'RIFLE',   match: 'ASSAULT RIFLE' },
  { label: 'SNIPER',  match: 'SNIPER RIFLE' },
  { label: 'SHOTGUN', match: 'SHOTGUN' },
]

const RARITY = {
  COMMON:    { color: '#00ffff' },
  RARE:      { color: '#f5ff00' },
  EPIC:      { color: '#bf00ff' },
  LEGENDARY: { color: '#ff0033' },
}

function StatBar({ label, value, percent, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(0,255,255,0.4)' }}>{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function SystemStatus() {
  const [cpu, setCpu] = useState(42)
  const [ping, setPing] = useState(14)
  const [uptime, setUptime] = useState(52327)
  const { isDesignMode } = useDesignMode()

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(v => Math.max(20, Math.min(95, v + (Math.random() - 0.48) * 8)))
      setPing(v => Math.max(8, Math.min(80, v + (Math.random() - 0.5) * 6)))
      setUptime(v => v + 1)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  const fmt = s => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0')
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  return (
    <div
      className="flex items-center gap-6 px-4 py-1.5 shrink-0 relative"
      style={{
        borderBottom: '1px solid rgba(245,255,0,0.07)',
        background: '#050505',
        ...(isDesignMode ? { outline: '1px dashed rgba(245,255,0,0.5)' } : {}),
      }}
    >
      {isDesignMode && <ComponentTag name="SystemStatus" accent="yellow" />}

      {[
        { label: 'CPU',    value: `${Math.round(cpu)}%`,   color: cpu > 80 ? '#ff0033' : '#00ffff' },
        { label: 'MEM',    value: '47%',                    color: '#00ffff' },
        { label: 'PING',   value: `${Math.round(ping)}ms`, color: ping > 50 ? '#ff0033' : '#f5ff00' },
        { label: 'UPTIME', value: fmt(uptime),              color: 'rgba(0,255,255,0.5)' },
      ].map(s => (
        <div key={s.label} className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(245,255,0,0.3)' }}>{s.label}</span>
          <motion.span
            className="text-xs font-mono font-bold"
            style={{ color: s.color }}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 + Math.random() }}
          >
            {s.value}
          </motion.span>
        </div>
      ))}

      <div className="ml-auto flex items-center gap-2">
        <motion.span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#00ffff' }}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        />
        <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(0,255,255,0.35)' }}>
          ARSENAL v2.0 // LIVE
        </span>
      </div>
    </div>
  )
}

function WeaponInspector({ weapon }) {
  const r = RARITY[weapon.rarity] ?? RARITY.COMMON
  const { isDesignMode } = useDesignMode()

  return (
    <motion.div
      key={weapon.id}
      className="flex flex-col h-full relative"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      style={isDesignMode ? { outline: '1px dashed rgba(0,255,255,0.4)' } : undefined}
    >
      {isDesignMode && <ComponentTag name="WeaponInspector" />}

      {/* Header */}
      <div className="px-8 pt-6 pb-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                className="text-xs font-mono px-2 py-0.5 tracking-widest"
                style={{ color: r.color, border: `1px solid ${r.color}40`, background: `${r.color}10` }}
              >
                {weapon.rarity}
              </span>
              <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(0,255,255,0.4)' }}>
                {weapon.type}
              </span>
            </div>
            <h1
              className="text-2xl font-mono font-bold tracking-wider"
              style={{ color: r.color, textShadow: `0 0 20px ${r.color}60` }}
            >
              {weapon.name}
            </h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(0,255,255,0.35)' }}>
              {weapon.manufacturer}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono mb-0.5" style={{ color: 'rgba(245,255,0,0.35)' }}>PRICE</p>
            <p className="text-xl font-mono font-bold" style={{ color: '#f5ff00', textShadow: '0 0 8px #f5ff00' }}>
              €$ {weapon.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Image area */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ height: '220px', background: '#040404', overflow: 'hidden' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${r.color}06 1px, transparent 1px), linear-gradient(90deg, ${r.color}06 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${r.color}10, transparent)` }}
        />
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${r.color}40, transparent)` }}
          animate={{ top: ['-5%', '105%'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', repeatDelay: 1.2 }}
        />
        {[
          'top-2 left-2 border-t border-l',
          'top-2 right-2 border-t border-r',
          'bottom-2 left-2 border-b border-l',
          'bottom-2 right-2 border-b border-r',
        ].map((cls, i) => (
          <span key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: `${r.color}40` }} />
        ))}
        <motion.img
          src={weapon.image}
          alt={weapon.name}
          className="relative z-10 max-h-44 w-auto max-w-full object-contain"
          style={{ filter: `drop-shadow(0 0 20px ${r.color}70) drop-shadow(0 0 40px ${r.color}30)` }}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Stats + actions */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-6">
        <div className="space-y-4">
          <p className="text-xs font-mono tracking-[0.25em]" style={{ color: 'rgba(245,255,0,0.3)' }}>PERFORMANCE</p>
          <StatBar label="DAMAGE"    value={weapon.damage}             percent={weapon.damagePercent}    color={r.color} />
          <StatBar label="FIRE RATE" value={`${weapon.fireRate} RPM`}  percent={weapon.fireRatePercent}  color={r.color} />
          <StatBar label="ACCURACY"  value={`${weapon.accuracy}%`}     percent={weapon.accuracyPercent}  color={r.color} />
        </div>

        <div>
          <p className="text-xs font-mono tracking-[0.25em] mb-3" style={{ color: 'rgba(245,255,0,0.3)' }}>MOD SLOTS</p>
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-6 flex items-center justify-center"
                style={{
                  border:     `1px solid ${i < weapon.slots ? r.color : 'rgba(255,255,255,0.07)'}`,
                  background: i < weapon.slots ? `${r.color}12` : 'transparent',
                  boxShadow:  i < weapon.slots ? `0 0 6px ${r.color}30` : 'none',
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.3 }}
              >
                {i < weapon.slots && (
                  <span className="text-xs font-mono" style={{ color: r.color, opacity: 0.7 }}>▪</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div
          className="grid grid-cols-3 gap-4 py-3 px-4"
          style={{ border: '1px solid rgba(255,255,255,0.05)', background: '#060606' }}
        >
          {[
            { label: 'SERIAL', value: weapon.serial },
            { label: 'CLASS',  value: weapon.type },
            { label: 'ORIGIN', value: weapon.origin },
          ].map(m => (
            <div key={m.label}>
              <p className="text-xs font-mono mb-0.5" style={{ color: 'rgba(0,255,255,0.3)' }}>{m.label}</p>
              <p className="text-xs font-mono font-bold truncate" style={{ color: 'rgba(245,255,0,0.7)' }}>{m.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pb-2">
          <GlowButton color="yellow">INSPECT</GlowButton>
          <GlowButton color="cyan">EQUIP</GlowButton>
          <GlowButton color="red">SELL</GlowButton>
        </div>
      </div>
    </motion.div>
  )
}

export default function Arsenal() {
  const [activeFilter, setActiveFilter] = useState(null)
  const [selected, setSelected] = useState(WEAPONS[0])
  const listRef = useRef(null)
  const { isDesignMode } = useDesignMode()

  const filtered = activeFilter === null
    ? WEAPONS
    : WEAPONS.filter(w => w.type === activeFilter)

  useEffect(() => {
    if (!filtered.find(w => w.id === selected.id)) {
      setSelected(filtered[0] ?? WEAPONS[0])
    }
  }, [activeFilter])

  return (
    <motion.div
      className="relative z-10 flex flex-col"
      style={{ height: '100vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* System status bar */}
      <div style={{ paddingTop: '52px' }}>
        <SystemStatus />
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — weapon list */}
        <div
          className="flex flex-col shrink-0 relative"
          style={{
            width: '288px',
            borderRight: '1px solid rgba(245,255,0,0.07)',
            background: '#050505',
            ...(isDesignMode ? { outline: '1px dashed rgba(245,255,0,0.45)' } : {}),
          }}
        >
          {isDesignMode && <ComponentTag name="WeaponList" accent="yellow" />}

          {/* Filter tabs */}
          <div
            className="flex flex-wrap gap-1.5 p-3 shrink-0"
            style={{ borderBottom: '1px solid rgba(245,255,0,0.07)' }}
          >
            {FILTERS.map(f => {
              const isActive = activeFilter === f.match
              return (
                <motion.button
                  key={f.label}
                  onClick={() => setActiveFilter(f.match)}
                  className="px-2.5 py-1 text-xs font-mono tracking-widest cursor-pointer"
                  style={{
                    border:     isActive ? '1px solid #f5ff00' : '1px solid rgba(245,255,0,0.12)',
                    color:      isActive ? '#f5ff00' : 'rgba(245,255,0,0.3)',
                    background: isActive ? 'rgba(245,255,0,0.06)' : 'transparent',
                  }}
                  whileHover={{ color: '#f5ff00', borderColor: 'rgba(245,255,0,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  {f.label}
                </motion.button>
              )
            })}
          </div>

          {/* Count */}
          <div className="px-4 py-2 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span className="text-xs font-mono" style={{ color: 'rgba(0,255,255,0.25)' }}>
              {filtered.length} WEAPON{filtered.length !== 1 ? 'S' : ''} INDEXED
            </span>
          </div>

          {/* Scrollable weapon list */}
          <div ref={listRef} className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter ?? 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {filtered.map((w, i) => (
                  <WeaponThumb
                    key={w.id}
                    weapon={w}
                    isSelected={selected.id === w.id}
                    onClick={() => setSelected(w)}
                    index={i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — inspector panel */}
        <div
          className="flex-1 overflow-hidden relative"
          style={{
            background: '#040404',
            ...(isDesignMode ? { outline: '1px dashed rgba(0,255,255,0.3)' } : {}),
          }}
        >
          {isDesignMode && <ComponentTag name="WeaponPanel" />}
          <AnimatePresence mode="wait">
            <WeaponInspector key={selected.id} weapon={selected} />
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
