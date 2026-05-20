// ── Singleton AudioContext ────────────────────────────────────────────────────
let ctx = null
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ── White noise buffer (lazy, reused) ─────────────────────────────────────────
let _noiseBuf = null
function getNoiseBuf(ac) {
  if (_noiseBuf) return _noiseBuf
  const len = Math.ceil(ac.sampleRate * 0.6)
  _noiseBuf = ac.createBuffer(1, len, ac.sampleRate)
  const d = _noiseBuf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return _noiseBuf
}

// ── FM synthesis ──────────────────────────────────────────────────────────────
// modRatio × carrierFreq = modulator pitch
// modDepth = how far (in Hz) the carrier frequency is bent by the modulator
// High modDepth / modFreq ratio → complex metallic/electric overtones
function fm({
  carrierFreq   = 440,
  carrierFreqEnd = null,   // optional pitch envelope on carrier
  modRatio      = 2,
  modDepth      = 200,
  modDepthEnd   = null,    // optional mod-depth decay → cleans up tone over time
  type          = 'sine',
  duration      = 0.05,
  volume        = 0.12,
  attack        = 0.001,
  delay         = 0,       // ms — for chaining hits
} = {}) {
  const run = () => {
    try {
      const ac  = getCtx()
      const carrier = ac.createOscillator()
      const mod     = ac.createOscillator()
      const modG    = ac.createGain()
      const outG    = ac.createGain()

      mod.frequency.value = carrierFreq * modRatio
      modG.gain.setValueAtTime(modDepth, ac.currentTime)
      if (modDepthEnd !== null) {
        modG.gain.exponentialRampToValueAtTime(
          Math.max(modDepthEnd, 0.001),
          ac.currentTime + duration
        )
      }
      mod.connect(modG)
      modG.connect(carrier.frequency)

      carrier.type = type
      carrier.frequency.setValueAtTime(carrierFreq, ac.currentTime)
      if (carrierFreqEnd !== null) {
        carrier.frequency.exponentialRampToValueAtTime(
          carrierFreqEnd,
          ac.currentTime + duration * 0.55
        )
      }
      carrier.connect(outG)
      outG.connect(ac.destination)

      outG.gain.setValueAtTime(0, ac.currentTime)
      outG.gain.linearRampToValueAtTime(volume, ac.currentTime + attack)
      outG.gain.exponentialRampToValueAtTime(0.00001, ac.currentTime + duration)

      const t = ac.currentTime
      mod.start(t);     mod.stop(t + duration + 0.02)
      carrier.start(t); carrier.stop(t + duration + 0.02)
    } catch (_) {}
  }
  delay ? setTimeout(run, delay) : run()
}

// ── Bandpass-filtered noise ───────────────────────────────────────────────────
// Noise through a bandpass filter sounds like rushing air, static bursts,
// or scanner sweeps depending on center frequency and Q
function noise({
  centerFreq    = 1000,
  centerFreqEnd = null,    // optional filter sweep
  Q             = 4,
  duration      = 0.04,
  volume        = 0.08,
  attack        = 0.001,
  delay         = 0,
} = {}) {
  const run = () => {
    try {
      const ac  = getCtx()
      const src = ac.createBufferSource()
      src.buffer = getNoiseBuf(ac)
      src.loop   = true

      const filt = ac.createBiquadFilter()
      filt.type  = 'bandpass'
      filt.frequency.setValueAtTime(centerFreq, ac.currentTime)
      if (centerFreqEnd !== null) {
        filt.frequency.exponentialRampToValueAtTime(centerFreqEnd, ac.currentTime + duration)
      }
      filt.Q.value = Q

      const gain = ac.createGain()
      src.connect(filt)
      filt.connect(gain)
      gain.connect(ac.destination)

      gain.gain.setValueAtTime(0, ac.currentTime)
      gain.gain.linearRampToValueAtTime(volume, ac.currentTime + attack)
      gain.gain.exponentialRampToValueAtTime(0.00001, ac.currentTime + duration)

      src.start(ac.currentTime)
      src.stop(ac.currentTime + duration + 0.02)
    } catch (_) {}
  }
  delay ? setTimeout(run, delay) : run()
}

// ── Sound palette ─────────────────────────────────────────────────────────────
const sounds = {

  // Electric contact — noise fizz transient + FM pitch-snap body
  // Carrier drops 700→280 Hz over 30ms while high FM depth decays fast
  // → "zzt-tink" digital button
  click: () => {
    noise({ centerFreq: 5000, Q: 1.2, duration: 0.013, volume: 0.10 })
    fm({
      carrierFreq: 700, carrierFreqEnd: 280,
      modRatio: 3.5, modDepth: 1100, modDepthEnd: 15,
      duration: 0.048, volume: 0.15,
    })
  },

  // Ultra-subtle hover — barely-there FM shimmer
  hover: () => {
    fm({ carrierFreq: 1500, modRatio: 4, modDepth: 220, duration: 0.015, volume: 0.026, attack: 0.001 })
  },

  // Cyber scanner — noise sweeps 300→6000 Hz, FM layer adds harmonic texture,
  // brief confirmation tick at end
  scan: () => {
    noise({ centerFreq: 280, centerFreqEnd: 6000, Q: 2.5, duration: 0.36, volume: 0.11 })
    fm({
      carrierFreq: 180, carrierFreqEnd: 1800,
      modRatio: 2, modDepth: 400, modDepthEnd: 40,
      duration: 0.34, volume: 0.08, attack: 0.012,
    })
    // lock-on tick at end of sweep
    fm({ carrierFreq: 1200, modRatio: 3, modDepth: 120, duration: 0.06, volume: 0.07, delay: 310 })
  },

  // Weapon equip — 3-stage power sequence:
  //   low rumble → rising surge → FM lock chord
  equip: () => {
    // rumble
    fm({ carrierFreq: 75, modRatio: 3, modDepth: 600, type: 'sawtooth', duration: 0.2, volume: 0.09, attack: 0.012 })
    noise({ centerFreq: 180, centerFreqEnd: 1200, Q: 2, duration: 0.24, volume: 0.08, attack: 0.015 })
    // surge
    fm({
      carrierFreq: 280, carrierFreqEnd: 950,
      modRatio: 2, modDepth: 700, modDepthEnd: 40,
      duration: 0.2, volume: 0.12, attack: 0.008, delay: 160,
    })
    // lock chord
    fm({ carrierFreq: 440, modRatio: 1.5, modDepth: 90, duration: 0.3, volume: 0.16, attack: 0.005, delay: 300 })
    fm({ carrierFreq: 660, modRatio: 1.5, modDepth: 70, duration: 0.24, volume: 0.12, attack: 0.003, delay: 350 })
  },

  // System warning — harsh sawtooth FM pulse + noise slap + second alarm hit
  warning: () => {
    fm({ carrierFreq: 155, modRatio: 4.8, modDepth: 900, type: 'sawtooth', duration: 0.16, volume: 0.14, attack: 0.004 })
    noise({ centerFreq: 450, Q: 2, duration: 0.09, volume: 0.09, delay: 55 })
    fm({ carrierFreq: 140, modRatio: 5.2, modDepth: 800, type: 'sawtooth', duration: 0.13, volume: 0.12, attack: 0.002, delay: 145 })
    noise({ centerFreq: 350, Q: 3, duration: 0.07, volume: 0.07, delay: 195 })
  },

  // Confirm / inspect — FM shimmer transient + warm two-note chord
  confirm: () => {
    noise({ centerFreq: 2400, Q: 7, duration: 0.035, volume: 0.05 })
    fm({ carrierFreq: 330, modRatio: 2, modDepth: 170, duration: 0.24, volume: 0.13, attack: 0.002 })
    fm({ carrierFreq: 495, modRatio: 2, modDepth: 130, duration: 0.19, volume: 0.10, attack: 0.001, delay: 65 })
  },

  // Mode toggle — noise zap + FM sweep ascending (on) or descending (off)
  toggle: (on) => {
    noise({ centerFreq: 1000, Q: 2, duration: 0.022, volume: 0.08 })
    if (on) {
      fm({ carrierFreq: 320, carrierFreqEnd: 960, modRatio: 2.5, modDepth: 500, modDepthEnd: 50, duration: 0.13, volume: 0.13, attack: 0.003 })
      fm({ carrierFreq: 720, modRatio: 2, modDepth: 90, duration: 0.15, volume: 0.11, attack: 0.002, delay: 95 })
    } else {
      fm({ carrierFreq: 960, carrierFreqEnd: 320, modRatio: 2.5, modDepth: 500, modDepthEnd: 50, duration: 0.13, volume: 0.11, attack: 0.003 })
      fm({ carrierFreq: 320, modRatio: 2, modDepth: 80, duration: 0.15, volume: 0.09, attack: 0.002, delay: 95 })
    }
  },
}

export function useUISound() {
  return sounds
}
