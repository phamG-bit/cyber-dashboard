import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import ScanlineOverlay from './components/ScanlineOverlay'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Arsenal from './pages/Arsenal'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState('dashboard')

  // Stable reference — prevents LoadingScreen's useEffect from restarting
  // during the AnimatePresence exit animation when App re-renders.
  const handleComplete = useCallback(() => setIsLoading(false), [])

  return (
    <>
      <ScanlineOverlay />

      {/* Navbar mounts once after loading and persists across page changes */}
      <AnimatePresence>
        {!isLoading && (
          <Navbar key="navbar" activePage={page} onNavigate={setPage} />
        )}
      </AnimatePresence>

      {/* Page switching — LoadingScreen, then whichever page is active */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={handleComplete} />
        ) : page === 'dashboard' ? (
          <Dashboard key="dashboard" />
        ) : (
          <Arsenal key="arsenal" />
        )}
      </AnimatePresence>
    </>
  )
}
