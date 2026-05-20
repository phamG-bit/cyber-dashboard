import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesignMode } from './context/DesignModeContext'
import LoadingScreen from './components/LoadingScreen'
import ScanlineOverlay from './components/ScanlineOverlay'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Arsenal from './pages/Arsenal'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState('dashboard')
  const { isDesignMode } = useDesignMode()

  const handleComplete = useCallback(() => setIsLoading(false), [])

  return (
    <>
      <Background />
      <ScanlineOverlay />

      {/* Layout grid overlay — design mode only */}
      {isDesignMode && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 45,
            backgroundImage: [
              'linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '32px 32px',
          }}
        />
      )}

      <AnimatePresence>
        {!isLoading && (
          <Navbar key="navbar" activePage={page} onNavigate={setPage} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={handleComplete} />
        ) : page === 'dashboard' ? (
          <Dashboard key="dashboard" />
        ) : (
          <Arsenal key="arsenal" />
        )}
      </AnimatePresence>

      {/* Design mode status banner */}
      <AnimatePresence>
        {isDesignMode && (
          <motion.div
            key="design-banner"
            className="fixed bottom-0 left-0 right-0 pointer-events-none flex items-center justify-center gap-8 px-6 py-2"
            style={{
              zIndex: 9990,
              background: 'rgba(0,5,10,0.92)',
              borderTop: '1px solid rgba(0,255,255,0.18)',
            }}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs font-mono tracking-widest" style={{ color: '#00ffff', textShadow: '0 0 8px #00ffff' }}>
              ⟨/⟩ DESIGN MODE
            </span>
            <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(0,255,255,0.4)' }}>
              HOVER TO INSPECT COMPONENTS
            </span>
            <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(245,255,0,0.3)' }}>
              ESC TO EXIT
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
