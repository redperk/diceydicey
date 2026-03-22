export type SoundName = 'gong' | 'chime' | 'bell' | 'synth'

export const SOUND_NAMES: { value: SoundName; label: string }[] = [
  { value: 'gong', label: 'Gong' },
  { value: 'chime', label: 'Chime' },
  { value: 'bell', label: 'Bell' },
  { value: 'synth', label: 'Synth Pad' },
]

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playGong(ctx: AudioContext, now: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, now)
  osc.frequency.exponentialRampToValueAtTime(80, now + 3)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.4, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 4)
  osc.start(now)
  osc.stop(now + 4)

  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(300, now)
  osc2.frequency.exponentialRampToValueAtTime(160, now + 2.5)
  gain2.gain.setValueAtTime(0, now)
  gain2.gain.linearRampToValueAtTime(0.15, now + 0.02)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 2.5)
  osc2.start(now)
  osc2.stop(now + 2.5)
}

function playChime(ctx: AudioContext, now: number) {
  const frequencies = [523, 659, 784]
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)
    const offset = i * 0.15
    gain.gain.setValueAtTime(0, now + offset)
    gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 2)
    osc.start(now + offset)
    osc.stop(now + offset + 2)
  })
}

function playBell(ctx: AudioContext, now: number) {
  const harmonics = [1, 2.76, 5.4, 8.93]
  const amplitudes = [0.3, 0.15, 0.08, 0.04]
  const decays = [3, 2, 1.5, 1]

  harmonics.forEach((h, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440 * h, now)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(amplitudes[i], now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, now + decays[i])
    osc.start(now)
    osc.stop(now + decays[i])
  })
}

function playSynth(ctx: AudioContext, now: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(261.6, now)
  osc.frequency.linearRampToValueAtTime(392, now + 0.5)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.25, now + 0.3)
  gain.gain.setValueAtTime(0.25, now + 1.5)
  gain.gain.linearRampToValueAtTime(0, now + 3)
  osc.start(now)
  osc.stop(now + 3)

  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(523.25, now)
  osc2.frequency.linearRampToValueAtTime(783.99, now + 0.5)
  gain2.gain.setValueAtTime(0, now)
  gain2.gain.linearRampToValueAtTime(0.1, now + 0.4)
  gain2.gain.setValueAtTime(0.1, now + 1.5)
  gain2.gain.linearRampToValueAtTime(0, now + 3)
  osc2.start(now)
  osc2.stop(now + 3)
}

export function playSound(name: SoundName): void {
  const ctx = getAudioContext()
  const now = ctx.currentTime

  switch (name) {
    case 'gong':
      playGong(ctx, now)
      break
    case 'chime':
      playChime(ctx, now)
      break
    case 'bell':
      playBell(ctx, now)
      break
    case 'synth':
      playSynth(ctx, now)
      break
  }
}
