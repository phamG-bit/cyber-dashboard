// Singleton AudioContext — created on first user interaction, never recreated
let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq = 440, type = 'sine', duration = 0.05, volume = 0.12, attack = 0.002, detune = 0 } = {}) {
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ac.currentTime)
    if (detune) osc.detune.setValueAtTime(detune, ac.currentTime)
    gain.gain.setValueAtTime(0, ac.currentTime)
    gain.gain.linearRampToValueAtTime(volume, ac.currentTime + attack)
    gain.gain.exponentialRampToValueAtTime(0.00001, ac.currentTime + duration)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + duration + 0.02)
  } catch (_) {}
}

function sweep({ freqStart = 200, freqEnd = 1000, type = 'sine', duration = 0.3, volume = 0.13 } = {}) {
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freqStart, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freqEnd, ac.currentTime + duration)
    gain.gain.setValueAtTime(0, ac.currentTime)
    gain.gain.linearRampToValueAtTime(volume, ac.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.00001, ac.currentTime + duration + 0.02)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + duration + 0.04)
  } catch (_) {}
}

// All sounds defined once at module level — stable references, no useCallback needed
const sounds = {
  // Short digital tick — button press confirmation
  click: () => tone({ freq: 900, duration: 0.032, volume: 0.11, attack: 0.001 }),

  // Ultra-subtle high blip — hover acknowledgment
  hover: () => tone({ freq: 1600, duration: 0.016, volume: 0.032, attack: 0.001 }),

  // Two-note chord — positive confirmation / inspect
  confirm: () => {
    tone({ freq: 330, duration: 0.18, volume: 0.13, attack: 0.002 })
    setTimeout(() => tone({ freq: 495, duration: 0.14, volume: 0.10, attack: 0.001 }), 70)
  },

  // Sawtooth burst — warning / sell
  warning: () => {
    tone({ freq: 220, type: 'sawtooth', duration: 0.13, volume: 0.13, attack: 0.005 })
    setTimeout(() => tone({ freq: 205, type: 'sawtooth', duration: 0.11, volume: 0.09, attack: 0.001, detune: 28 }), 70)
  },

  // Rising frequency sweep — scan / inspect
  scan: () => sweep({ freqStart: 180, freqEnd: 1400, duration: 0.32, volume: 0.12 }),

  // Power-up sweep + chord hit — equip
  equip: () => {
    sweep({ freqStart: 280, freqEnd: 880, duration: 0.2, volume: 0.12 })
    setTimeout(() => tone({ freq: 660, duration: 0.22, volume: 0.15, attack: 0.003 }), 170)
  },

  // Two-tone switch — mode toggle
  toggle: (on) => {
    if (on) {
      tone({ freq: 440, duration: 0.055, volume: 0.11, attack: 0.001 })
      setTimeout(() => tone({ freq: 660, duration: 0.08, volume: 0.10, attack: 0.001 }), 52)
    } else {
      tone({ freq: 660, duration: 0.055, volume: 0.10, attack: 0.001 })
      setTimeout(() => tone({ freq: 440, duration: 0.08, volume: 0.09, attack: 0.001 }), 52)
    }
  },
}

export function useUISound() {
  return sounds
}
