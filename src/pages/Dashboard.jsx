import { motion } from 'framer-motion'
import AnalyticsCard from '../components/AnalyticsCard'
import TerminalPanel from '../components/TerminalPanel'
import HUDPanel from '../components/HUDPanel'
import GlowButton from '../components/GlowButton'

const ANALYTICS = [
  { title: 'NEURAL CONNECTIONS', value: 847293, unit: 'nodes', delta: 12.4, color: 'yellow', progress: 84, index: 0 },
  { title: 'DATA THROUGHPUT',    value: 2048,   unit: 'GB/s',  delta: -3.1, color: 'cyan',   progress: 67, index: 1 },
  { title: 'THREAT VECTORS',     value: 31,     unit: 'active',delta: 8.9,  color: 'red',    progress: 31, index: 2 },
]

const TERMINAL_LINES = [
  { text: 'ssh operative@cyber.os -p 2077', type: 'cmd',  delay: 0 },
  { text: 'Connection established via quantum tunnel', type: 'resp', delay: 500 },
  { text: 'scan --deep --network 192.168.0.0/24', type: 'cmd',  delay: 600 },
  { text: 'Scanning 256 hosts...', type: 'sys',  delay: 400 },
  { text: '43 hosts up, 12 vulnerabilities detected', type: 'resp', delay: 700 },
  { text: '[WARN] Critical: CVE-2077-0042 on 192.168.0.17', type: 'err',  delay: 400 },
  { text: 'exploit --target 192.168.0.17 --payload ghost_v3', type: 'cmd',  delay: 800 },
  { text: 'Payload deployed. Awaiting response...', type: 'sys',  delay: 500 },
  { text: 'Root shell obtained. Access level: ADMIN', type: 'resp', delay: 600 },
  { text: 'exfil --dir /classified --compress --encrypt', type: 'cmd',  delay: 700 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Dashboard() {
  return (
    // Root fade-in is explicit — variant-only transitions don't animate the
    // container's own opacity when the transition only has staggerChildren.
    <motion.div
      className="relative z-10 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <main className="pt-20 px-4 md:px-8 pb-8 max-w-7xl mx-auto">

        {/* Stagger wrapper */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

        {/* Page title */}
        <motion.div className="mb-8 mt-4" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-1 h-6 bg-neon-yellow" style={{ boxShadow: '0 0 8px #f5ff00' }} />
            <h2 className="text-lg font-mono font-bold text-neon-yellow text-glow-yellow tracking-widest uppercase">
              Operative Dashboard
            </h2>
          </div>
          <p className="text-xs font-mono text-neon-cyan/40 tracking-widest ml-4">
            CLEARANCE LEVEL: ALPHA // SESSION: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </motion.div>

        {/* Analytics row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          variants={itemVariants}
        >
          {ANALYTICS.map(card => (
            <AnalyticsCard key={card.title} {...card} />
          ))}
        </motion.div>

        {/* Main content row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Terminal */}
          <motion.div variants={itemVariants}>
            <HUDPanel title="SYSTEM TERMINAL" accentColor="cyan">
              <TerminalPanel
                title="CYBER_SHELL v3.7"
                lines={TERMINAL_LINES}
                height="h-56"
              />
            </HUDPanel>
          </motion.div>

          {/* Status panel */}
          <motion.div variants={itemVariants}>
            <HUDPanel title="NETWORK STATUS" accentColor="yellow">
              <div className="space-y-3">
                {[
                  { label: 'FIREWALL INTEGRITY', value: '94%',  color: '#00ffff', w: '94%' },
                  { label: 'ENCRYPTION STRENGTH', value: '100%', color: '#f5ff00', w: '100%' },
                  { label: 'PROXY CHAIN',         value: '7 HOP', color: '#00ffff', w: '70%' },
                  { label: 'THREAT LEVEL',        value: 'MEDIUM', color: '#ff0033', w: '45%' },
                  { label: 'BANDWIDTH USAGE',     value: '2.1 TB',  color: '#f5ff00', w: '62%' },
                ].map((row, i) => (
                  <div key={row.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-mono text-neon-yellow/50 tracking-widest">{row.label}</span>
                      <span className="text-xs font-mono" style={{ color: row.color }}>{row.value}</span>
                    </div>
                    <div className="h-0.5 bg-cyber-muted overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ background: row.color, boxShadow: `0 0 4px ${row.color}` }}
                        initial={{ width: '0%' }}
                        animate={{ width: row.w }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert */}
              <motion.div
                className="mt-4 p-3 border border-neon-red/40 bg-neon-red/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                <p className="text-xs font-mono text-neon-red text-glow-red tracking-wide">
                  [ALERT] ANOMALOUS TRAFFIC DETECTED — NODE 0x4F2A
                </p>
              </motion.div>
            </HUDPanel>
          </motion.div>
        </div>

        {/* Bottom row — additional HUD + actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <HUDPanel title="OPERATIVE LOG" accentColor="cyan">
              <div className="space-y-2">
                {[
                  { time: '03:42:11', msg: 'Exfil complete — 14.2 GB transferred', color: '#00ffff' },
                  { time: '03:39:04', msg: 'Ghost payload v3 deployed on target', color: '#f5ff00' },
                  { time: '03:31:58', msg: '[WARN] Intrusion detection triggered — evaded', color: '#ff0033' },
                  { time: '03:28:22', msg: 'Tunnel established via relay node EU-7', color: '#00ffff' },
                  { time: '03:15:00', msg: 'Session initiated — Operative authenticated', color: '#f5ff00' },
                ].map((log, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-4 py-1.5 border-b border-neon-yellow/5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <span className="text-xs font-mono text-neon-cyan/30 shrink-0">{log.time}</span>
                    <span className="text-xs font-mono" style={{ color: log.color, opacity: 0.8 }}>{log.msg}</span>
                  </motion.div>
                ))}
              </div>
            </HUDPanel>
          </motion.div>

          <motion.div variants={itemVariants}>
            <HUDPanel title="QUICK ACTIONS" accentColor="yellow">
              <div className="flex flex-col gap-3">
                <GlowButton color="yellow">DEPLOY PAYLOAD</GlowButton>
                <GlowButton color="cyan">SCAN NETWORK</GlowButton>
                <GlowButton color="cyan">OPEN TUNNEL</GlowButton>
                <GlowButton color="red">ABORT MISSION</GlowButton>
              </div>
            </HUDPanel>
          </motion.div>
        </div>

        {/* Footer status bar */}
        <motion.div
          className="flex items-center justify-between px-4 py-2 border border-neon-yellow/10 bg-cyber-dark"
          variants={itemVariants}
        >
          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-neon-yellow/30 tracking-widest">SYS v3.7.1</span>
            <span className="text-xs font-mono text-neon-cyan/30 tracking-widest">UPTIME: 14:22:07</span>
            <span className="text-xs font-mono text-neon-cyan/30 tracking-widest">MEM: 47%</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            <span className="text-xs font-mono text-neon-cyan/40 tracking-widest">ALL SYSTEMS NOMINAL</span>
          </div>
        </motion.div>

        </motion.div> {/* end stagger wrapper */}
      </main>
    </motion.div>
  )
}
