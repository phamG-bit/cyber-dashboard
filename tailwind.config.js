/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#000000',
        'cyber-dark':  '#0a0a0a',
        'cyber-muted': '#1a1a1a',
        'cyber-dim':   '#111111',
        'neon-yellow': '#f5ff00',
        'neon-yellow2':'#e5ff00',
        'neon-cyan':   '#00ffff',
        'neon-cyan2':  '#00e5ff',
        'neon-red':    '#ff0033',
        'neon-red2':   '#ff3366',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      keyframes: {
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%, 100%': { clipPath: 'inset(0 0 98% 0)', transform: 'translate(-4px, 0)' },
          '20%':      { clipPath: 'inset(30% 0 50% 0)', transform: 'translate(4px, 0)' },
          '40%':      { clipPath: 'inset(60% 0 20% 0)', transform: 'translate(-4px, 0)' },
          '60%':      { clipPath: 'inset(80% 0 5% 0)',  transform: 'translate(4px, 0)' },
          '80%':      { clipPath: 'inset(10% 0 80% 0)', transform: 'translate(-2px, 0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px #f5ff00, 0 0 10px #f5ff00, 0 0 20px #f5ff00' },
          '50%':      { boxShadow: '0 0 10px #f5ff00, 0 0 25px #f5ff00, 0 0 50px #f5ff00' },
        },
        'glow-pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff' },
          '50%':      { boxShadow: '0 0 10px #00ffff, 0 0 25px #00ffff, 0 0 50px #00ffff' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        flicker: {
          '0%':   { opacity: '0' },
          '10%':  { opacity: '1' },
          '11%':  { opacity: '0' },
          '12%':  { opacity: '1' },
          '50%':  { opacity: '1' },
          '51%':  { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'scanline':        'scanline 4s linear infinite',
        'glitch':          'glitch 0.4s steps(1) infinite',
        'glow-pulse':      'glow-pulse 2s ease-in-out infinite',
        'glow-pulse-cyan': 'glow-pulse-cyan 2s ease-in-out infinite',
        'blink':           'blink 1s step-end infinite',
        'flicker':         'flicker 0.3s ease-in forwards',
      },
    },
  },
  plugins: [],
}
