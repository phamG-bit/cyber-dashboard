import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext({ isDesignMode: false, toggleDesignMode: () => {} })

export function DesignModeProvider({ children }) {
  const [isDesignMode, setIsDesignMode] = useState(false)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setIsDesignMode(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Ctx.Provider value={{ isDesignMode, toggleDesignMode: () => setIsDesignMode(v => !v) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useDesignMode = () => useContext(Ctx)

export function ComponentTag({ name, accent = 'cyan' }) {
  const COLORS = { cyan: '#00ffff', yellow: '#f5ff00', red: '#ff0033' }
  const c = COLORS[accent] ?? COLORS.cyan
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        background: 'rgba(5,5,5,0.88)',
        border: `1px solid ${c}55`,
        padding: '0 6px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '8px',
        color: c,
        letterSpacing: '0.15em',
        lineHeight: '1.9',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {name}
    </div>
  )
}
