export type SoundName =
  | 'platinum' | 'helium' | 'argon'
  | 'copernicium' | 'curium' | 'neptunium'

export const SOUND_NAMES: { value: SoundName; label: string }[] = [
  { value: 'platinum', label: 'Platinum' },
  { value: 'helium', label: 'Helium' },
  { value: 'argon', label: 'Argon' },
  { value: 'copernicium', label: 'Copernicium' },
  { value: 'curium', label: 'Curium' },
  { value: 'neptunium', label: 'Neptunium' },
]

const BASE = import.meta.env.BASE_URL

const SOUND_FILES: Record<SoundName, string> = {
  platinum: `${BASE}sounds/platinum.ogg`,
  helium: `${BASE}sounds/helium.ogg`,
  argon: `${BASE}sounds/argon.ogg`,
  copernicium: `${BASE}sounds/alarm-Copernicium.ogg`,
  curium: `${BASE}sounds/alarm-Curium.ogg`,
  neptunium: `${BASE}sounds/alarm-Neptunium.ogg`,
}

let activeAudio: HTMLAudioElement | null = null

export function playSound(name: SoundName): void {
  stopSound()
  const audio = new Audio(SOUND_FILES[name])
  audio.loop = true
  audio.volume = 0.7
  audio.play().catch(() => {})
  activeAudio = audio
}

export function stopSound(): void {
  if (activeAudio) {
    activeAudio.pause()
    activeAudio.currentTime = 0
    activeAudio = null
  }
}

export function playSoundOnce(name: SoundName): void {
  stopSound()
  const audio = new Audio(SOUND_FILES[name])
  audio.volume = 0.7
  audio.play().catch(() => {})
  activeAudio = audio
}

let diceAudioCtx: AudioContext | null = null

function getDiceAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  if (!diceAudioCtx) diceAudioCtx = new Ctx()
  if (diceAudioCtx.state === 'suspended') diceAudioCtx.resume().catch(() => {})
  return diceAudioCtx
}

function makeNoiseBuffer(ctx: AudioContext, durationSec: number, decayRate: number): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const length = Math.floor(sampleRate * durationSec)
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    const env = Math.exp(-decayRate * t)
    data[i] = (Math.random() * 2 - 1) * env
  }
  return buffer
}

function scheduleDiceImpact(ctx: AudioContext, when: number, intensity: number): void {
  const tickBuffer = makeNoiseBuffer(ctx, 0.025, 220)
  const tickSource = ctx.createBufferSource()
  tickSource.buffer = tickBuffer

  const tickFilter = ctx.createBiquadFilter()
  tickFilter.type = 'bandpass'
  tickFilter.frequency.value = 3500 + Math.random() * 2000
  tickFilter.Q.value = 1.5

  const tickGain = ctx.createGain()
  tickGain.gain.value = 0.45 * intensity

  tickSource.connect(tickFilter)
  tickFilter.connect(tickGain)
  tickGain.connect(ctx.destination)
  tickSource.start(when)

  const bodyBuffer = makeNoiseBuffer(ctx, 0.09, 55)
  const bodySource = ctx.createBufferSource()
  bodySource.buffer = bodyBuffer

  const bodyFilter = ctx.createBiquadFilter()
  bodyFilter.type = 'bandpass'
  bodyFilter.frequency.value = 500 + Math.random() * 300
  bodyFilter.Q.value = 5

  const bodyGain = ctx.createGain()
  bodyGain.gain.value = 0.4 * intensity

  bodySource.connect(bodyFilter)
  bodyFilter.connect(bodyGain)
  bodyGain.connect(ctx.destination)
  bodySource.start(when)

  const thumpBuffer = makeNoiseBuffer(ctx, 0.12, 38)
  const thumpSource = ctx.createBufferSource()
  thumpSource.buffer = thumpBuffer

  const thumpFilter = ctx.createBiquadFilter()
  thumpFilter.type = 'lowpass'
  thumpFilter.frequency.value = 220 + Math.random() * 120
  thumpFilter.Q.value = 1.2

  const thumpGain = ctx.createGain()
  thumpGain.gain.value = 0.55 * intensity

  thumpSource.connect(thumpFilter)
  thumpFilter.connect(thumpGain)
  thumpGain.connect(ctx.destination)
  thumpSource.start(when)
}

export function playDiceRoll(): void {
  const ctx = getDiceAudioCtx()
  if (!ctx) return

  const start = ctx.currentTime
  const totalDuration = 0.75

  const initialCluster = 8 + Math.floor(Math.random() * 4)
  for (let i = 0; i < initialCluster; i++) {
    const when = start + Math.random() * 0.06
    const intensity = 0.55 + Math.random() * 0.4
    scheduleDiceImpact(ctx, when, intensity)
  }

  const tumbleCount = 30 + Math.floor(Math.random() * 8)
  for (let i = 0; i < tumbleCount; i++) {
    const progress = i / Math.max(1, tumbleCount - 1)
    const baseTime = 0.04 + progress * (totalDuration - 0.04)
    const jitter = (Math.random() - 0.5) * 0.09
    const when = start + Math.max(0, baseTime + jitter)
    const fade = 1 - Math.pow(progress, 1.4) * 0.65
    const intensity = (0.3 + Math.random() * 0.4) * fade
    scheduleDiceImpact(ctx, when, Math.max(0.16, intensity))
  }

  const settleCount = 6 + Math.floor(Math.random() * 4)
  for (let i = 0; i < settleCount; i++) {
    const when = start + totalDuration - 0.1 + Math.random() * 0.1
    const intensity = 0.3 + Math.random() * 0.25
    scheduleDiceImpact(ctx, when, intensity)
  }
}
