import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import ScanlineOverlay from './components/ScanlineOverlay'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <ScanlineOverlay />
      <AnimatePresence mode="wait">
        {isLoading
          ? <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
          : <Dashboard key="dashboard" />
        }
      </AnimatePresence>
    </>
  )
}
