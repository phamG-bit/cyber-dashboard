import { motion } from 'framer-motion'

export default function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9998 }}>
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)',
        }}
      />
      {/* Moving scan band */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          height: '120px',
          background: 'linear-gradient(transparent, rgba(255,255,255,0.012), transparent)',
        }}
        animate={{ y: ['-10%', '110vh'] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
      />
    </div>
  )
}
