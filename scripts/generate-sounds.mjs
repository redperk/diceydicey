import { writeFileSync, mkdirSync } from 'fs'

const SAMPLE_RATE = 44100
const DURATION = 12 // seconds

function makeWav(samples) {
  const numSamples = samples.length
  const dataSize = numSamples * 2
  const buffer = Buffer.alloc(44 + dataSize)

  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20) // PCM
  buffer.writeUInt16LE(1, 22) // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24)
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2)
  }
  return buffer
}

function envelope(t, attack, sustain, release, total) {
  if (t < attack) return t / attack
  if (t < attack + sustain) return 1
  const releaseStart = attack + sustain
  if (t < releaseStart + release) return 1 - (t - releaseStart) / release
  return 0
}

function simpleReverb(samples, decay = 0.3, delayMs = 80) {
  const delaySamples = Math.floor(SAMPLE_RATE * delayMs / 1000)
  const out = new Float32Array(samples.length)
  for (let i = 0; i < samples.length; i++) {
    out[i] = samples[i]
    if (i >= delaySamples) out[i] += out[i - delaySamples] * decay
  }
  // Normalize
  let max = 0
  for (let i = 0; i < out.length; i++) max = Math.max(max, Math.abs(out[i]))
  if (max > 0.95) {
    const scale = 0.9 / max
    for (let i = 0; i < out.length; i++) out[i] *= scale
  }
  return out
}

// --- Singing Bowl ---
// Rich, resonant bowl with beating frequencies and slow decay
function generateSingingBowl() {
  const len = SAMPLE_RATE * DURATION
  const samples = new Float32Array(len)
  const tones = [
    { freq: 174, amp: 0.20, decay: 10 },
    { freq: 176, amp: 0.18, decay: 10 },  // slight detune for beating
    { freq: 348, amp: 0.08, decay: 7 },
    { freq: 523, amp: 0.04, decay: 5 },
    { freq: 697, amp: 0.02, decay: 4 },
  ]
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE
    let val = 0
    for (const tone of tones) {
      const env = Math.exp(-t / tone.decay)
      val += Math.sin(2 * Math.PI * tone.freq * t) * tone.amp * env
    }
    // Soft fade in
    const fadeIn = Math.min(1, t / 0.3)
    samples[i] = val * fadeIn
  }
  return simpleReverb(samples, 0.35, 100)
}

// --- Wind Chime ---
// Multiple high, bright tones that ring at staggered intervals
function generateWindChime() {
  const len = SAMPLE_RATE * DURATION
  const samples = new Float32Array(len)
  const chimes = [
    { freq: 1047, start: 0.0, decay: 2.5 },
    { freq: 1319, start: 0.8, decay: 2.2 },
    { freq: 1568, start: 1.5, decay: 2.0 },
    { freq: 1760, start: 2.3, decay: 1.8 },
    { freq: 1397, start: 3.2, decay: 2.3 },
    { freq: 1175, start: 4.5, decay: 2.5 },
    { freq: 1568, start: 5.5, decay: 2.0 },
    { freq: 1047, start: 6.8, decay: 2.5 },
    { freq: 1760, start: 7.5, decay: 1.8 },
    { freq: 1319, start: 8.8, decay: 2.2 },
    { freq: 1397, start: 9.8, decay: 2.0 },
    { freq: 1175, start: 10.5, decay: 2.3 },
  ]
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE
    let val = 0
    for (const c of chimes) {
      const ct = t - c.start
      if (ct < 0) continue
      const env = Math.exp(-ct / c.decay) * Math.min(1, ct / 0.003)
      // Main tone + slight harmonic for metallic quality
      val += Math.sin(2 * Math.PI * c.freq * ct) * env * 0.10
      val += Math.sin(2 * Math.PI * c.freq * 2.76 * ct) * env * 0.03
      val += Math.sin(2 * Math.PI * c.freq * 5.4 * ct) * env * 0.01
    }
    samples[i] = val
  }
  return simpleReverb(samples, 0.3, 60)
}

// --- Soft Bell ---
// Repeating bell strikes with rich harmonics, like a meditation timer
function generateSoftBell() {
  const len = SAMPLE_RATE * DURATION
  const samples = new Float32Array(len)
  const strikes = [0, 3.0, 6.0, 9.0]
  const harmonics = [
    { ratio: 1.0, amp: 0.18, decay: 3.0 },
    { ratio: 2.0, amp: 0.07, decay: 2.0 },
    { ratio: 3.0, amp: 0.04, decay: 1.5 },
    { ratio: 4.76, amp: 0.02, decay: 1.0 },
  ]
  const baseFreq = 440
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE
    let val = 0
    for (const strike of strikes) {
      const st = t - strike
      if (st < 0) continue
      const attack = Math.min(1, st / 0.005)
      for (const h of harmonics) {
        const env = Math.exp(-st / h.decay) * attack
        val += Math.sin(2 * Math.PI * baseFreq * h.ratio * st) * h.amp * env
      }
    }
    samples[i] = val
  }
  return simpleReverb(samples, 0.3, 90)
}

// --- Warm Pad ---
// Slow-breathing major chord with triangle-ish waves
function generateWarmPad() {
  const len = SAMPLE_RATE * DURATION
  const samples = new Float32Array(len)
  const chord = [261.6, 329.6, 392.0, 523.2]
  const breathCycle = 6 // seconds per breath

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE
    // Breathing envelope: smooth swell up and down
    const breathPhase = (t % breathCycle) / breathCycle
    const breathEnv = Math.sin(breathPhase * Math.PI) * 0.12
    // Gentle fade in/out at edges
    const fadeIn = Math.min(1, t / 1.0)
    const fadeOut = Math.min(1, (DURATION - t) / 1.5)

    let val = 0
    for (const freq of chord) {
      // Triangle-ish wave (sine + slight odd harmonics)
      val += Math.sin(2 * Math.PI * freq * t)
      val += Math.sin(2 * Math.PI * freq * 3 * t) * 0.1
      val += Math.sin(2 * Math.PI * freq * 5 * t) * 0.03
    }
    samples[i] = val / chord.length * breathEnv * fadeIn * fadeOut
  }
  return simpleReverb(samples, 0.25, 70)
}

// Generate all sounds
mkdirSync('public/sounds', { recursive: true })

console.log('Generating singing bowl...')
writeFileSync('public/sounds/singing-bowl.wav', makeWav(generateSingingBowl()))

console.log('Generating wind chime...')
writeFileSync('public/sounds/wind-chime.wav', makeWav(generateWindChime()))

console.log('Generating soft bell...')
writeFileSync('public/sounds/soft-bell.wav', makeWav(generateSoftBell()))

console.log('Generating warm pad...')
writeFileSync('public/sounds/warm-pad.wav', makeWav(generateWarmPad()))

console.log('Done! Files in public/sounds/')
