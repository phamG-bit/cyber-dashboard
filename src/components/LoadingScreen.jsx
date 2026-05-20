import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const BOOT_LINES = [
  { text: '> INITIALIZING CYBER.OS v3.7.1...', type: 'cmd' },
  { text: '  [OK] NEURAL INTERFACE LOADED',    type: 'ok' },
  { text: '> ESTABLISHING ENCRYPTED TUNNEL...', type: 'cmd' },
  { text: '  [OK] QUANTUM ENCRYPTION: 2048-BIT', type: 'ok' },
  { text: '> BYPASSING SECURITY PROTOCOLS...',  type: 'cmd' },
  { text: '  [WARN] 3 FIREWALL LAYERS DETECTED', type: 'warn' },
  { text: '  [OK] PROTOCOLS BYPASSED',          type: 'ok' },
  { text: '> LOADING NEURAL ANALYTICS ENGINE...', type: 'cmd' },
  { text: '  [OK] ALL SYSTEMS NOMINAL',         type: 'ok' },
  { text: '> ACCESS GRANTED. WELCOME, OPERATIVE.', type: 'success' },
]

const lineColors = {
  cmd:     'text-neon-yellow',
  ok:      'text-neon-cyan',
  warn:    'text-neon-red',
  success: 'text-neon-yellow text-glow-yellow',
}

export default function LoadingScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    let lineIndex = 0

    const interval = setInterval(() => {
      // Guard: stop immediately if we've already finished
      if (lineIndex >= BOOT_LINES.length) {
        clearInterval(interval)
        return
      }

      // Capture the line object NOW before any mutation so the
      // state updater closes over a stable value, not the mutable index.
      const line = BOOT_LINES[lineIndex]
      lineIndex++

      // Defensive: skip if somehow undefined (StrictMode double-invoke etc.)
      if (!line) return

      setVisibleLines(prev => [...prev, line])
      setProgress(Math.round((lineIndex / BOOT_LINES.length) * 100))

      // Check completion after the increment
      if (lineIndex >= BOOT_LINES.length) {
        clearInterval(interval)
        setDone(true)
        setTimeout(onComplete, 800)
      }
    }, 320)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleLines])

  return (
    <motion.div
      className="fixed inset-0 bg-cyber-black flex flex-col items-center justify-center z-50"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="w-full max-w-2xl px-8">
        {/* Logo */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-mono font-bold text-neon-yellow text-glow-yellow tracking-widest">
            CYBER<span className="text-neon-cyan text-glow-cyan">.OS</span>
          </h1>
          <p className="text-xs text-neon-cyan/50 tracking-[0.4em] mt-2 uppercase">
            Neural Recruitment Interface
          </p>
        </motion.div>

        {/* Terminal window */}
        <div className="border border-neon-cyan/30 bg-cyber-dark rounded-none mb-6 h-64 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neon-cyan/20 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-red/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-neon-yellow/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan/70" />
            <span className="ml-2 text-xs text-neon-cyan/40 tracking-widest">BOOT_SEQUENCE.sh</span>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Filter out any falsy entries before rendering */}
            {visibleLines.filter(l => l?.text && l?.type).map((line, i) => (
              <motion.p
                key={i}
                className={`text-sm font-mono ${lineColors[line.type] ?? 'text-neon-cyan'}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
              >
                {line.text}
              </motion.p>
            ))}
            {!done && (
              <span className="text-neon-yellow animate-blink">_</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2 flex justify-between text-xs text-neon-cyan/50 font-mono">
          <span>LOADING SYSTEM</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1 bg-cyber-muted overflow-hidden">
          <motion.div
            className="h-full bg-neon-yellow"
            style={{ boxShadow: '0 0 10px #f5ff00, 0 0 20px #f5ff00' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
