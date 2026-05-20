import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import ScanlineOverlay from './components/ScanlineOverlay'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Stable reference — prevents LoadingScreen's useEffect from restarting
  // during the AnimatePresence exit animation when App re-renders.
  const handleComplete = useCallback(() => setIsLoading(false), [])

  return (
    <>
      <ScanlineOverlay />
      <AnimatePresence mode="wait">
        {isLoading
          ? <LoadingScreen key="loading" onComplete={handleComplete} />
          : <Dashboard key="dashboard" />
        }
      </AnimatePresence>
    </>
  )
}
