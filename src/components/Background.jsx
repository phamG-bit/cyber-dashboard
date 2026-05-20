import { motion, useReducedMotion } from 'framer-motion'

const PARTICLE_COUNT = 26
const PARTICLE_COLORS = ['#f5ff00', '#00ffff', '#ff0033']

// Generated once at module load (not during render) so the field is stable and
// the call site stays free of impure-call-during-render lint violations.
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length]
  return {
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    color,
    dx: `${(Math.random() * 2 - 1) * 24}px`,
    dy: `${10 + Math.random() * 26}px`,
    min: (0.05 + Math.random() * 0.1).toFixed(2),
    max: (0.25 + Math.random() * 0.35).toFixed(2),
    duration: 14 + Math.random() * 20,
    delay: -Math.random() * 30,
  }
})

// Ambient layer that lives behind every page: a faint drifting grid, slow
// floating particles, and occasional scan/glitch light sweeps. Kept very low
// opacity so it never competes with foreground HUD content for readability.
export default function Background() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Primary drifting grid */}
      <div
        className={reduceMotion ? undefined : 'bg-grid-anim'}
        style={{
          position: 'absolute',
          top: '-44px',
          left: 0,
          right: 0,
          height: 'calc(100% + 44px)',
          backgroundImage:
            'linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Coarser static grid in a second accent tone for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(245,255,0,0.03) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(245,255,0,0.03) 1px, transparent 1px)',
          backgroundSize: '176px 176px',
        }}
      />

      {/* Ambient drifting glow pools — sells the "living system" depth */}
      {!reduceMotion && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              width: 520,
              height: 520,
              borderRadius: '50%',
              filter: 'blur(80px)',
              background: 'radial-gradient(circle, rgba(0,255,255,0.06), transparent 70%)',
              left: '5%',
              top: '10%',
            }}
            animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            style={{
              position: 'absolute',
              width: 460,
              height: 460,
              borderRadius: '50%',
              filter: 'blur(80px)',
              background: 'radial-gradient(circle, rgba(245,255,0,0.05), transparent 70%)',
              right: '8%',
              bottom: '12%',
            }}
            animate={{ x: [0, -70, 30, 0], y: [0, 50, -30, 0] }}
            transition={{ duration: 48, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <span
          key={p.id}
          className={reduceMotion ? undefined : 'bg-particle-anim'}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: reduceMotion ? Number(p.min) : undefined,
            '--dx': p.dx,
            '--dy': p.dy,
            '--p-min': p.min,
            '--p-max': p.max,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Horizontal scan beam — sweeps across, then pauses */}
      {!reduceMotion && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '28%',
            background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.045), transparent)',
          }}
          initial={{ x: '-30%' }}
          animate={{ x: ['-30%', '380%'] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
        />
      )}

      {/* Occasional glitch flash */}
      {!reduceMotion && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,255,255,0.04)',
            mixBlendMode: 'screen',
          }}
          animate={{ opacity: [0, 0, 0.7, 0, 0.35, 0] }}
          transition={{
            duration: 0.45,
            repeat: Infinity,
            repeatDelay: 8.5,
            times: [0, 0.2, 0.35, 0.55, 0.7, 1],
          }}
        />
      )}
    </div>
  )
}
