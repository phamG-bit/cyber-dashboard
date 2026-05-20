import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDesignMode, ComponentTag } from '../context/DesignModeContext'

const LINE_COLORS = {
  cmd:  '#f5ff00',
  resp: 'rgba(0,255,255,0.7)',
  err:  '#ff0033',
  sys:  'rgba(245,255,0,0.4)',
}

export default function TerminalPanel({ title = 'TERMINAL', lines = [], height = 'h-52' }) {
  const [visible, setVisible] = useState([])
  const scrollRef = useRef(null)
  const { isDesignMode } = useDesignMode()

  useEffect(() => {
    let i = 0
    const next = () => {
      if (i < lines.length) {
        const line = lines[i]
        setVisible(prev => [...prev, line])
        i++
        setTimeout(next, line.delay ?? 400)
      }
    }
    const t = setTimeout(next, 300)
    return () => clearTimeout(t)
  }, [lines])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visible])

  return (
    <motion.div
      className="relative border border-neon-cyan/30 bg-cyber-dark overflow-hidden"
      style={isDesignMode ? { outline: '1px dashed rgba(0,255,255,0.5)', outlineOffset: '2px' } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {isDesignMode && <ComponentTag name="TerminalPanel" />}

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-cyber-muted border-b border-neon-cyan/20">
        <span className="w-2.5 h-2.5 rounded-full bg-neon-red/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-neon-yellow/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan/70" />
        <span className="ml-2 text-xs font-mono text-neon-cyan/50 tracking-widest uppercase">{title}</span>
        <span className="ml-auto text-xs font-mono text-neon-cyan/30">root@cyber:~$</span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className={`${height} overflow-y-auto p-4 space-y-1 scrollbar-thin`}
        style={{ scrollbarWidth: 'none' }}
      >
        {visible.map((line, i) => (
          <motion.p
            key={i}
            className="text-sm font-mono leading-relaxed"
            style={{ color: LINE_COLORS[line.type] ?? LINE_COLORS.resp }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.12 }}
          >
            {line.type === 'cmd' ? '> ' : '  '}{line.text}
          </motion.p>
        ))}
        {visible.length < lines.length && (
          <span className="text-neon-yellow animate-blink text-sm font-mono">_</span>
        )}
      </div>
    </motion.div>
  )
}
