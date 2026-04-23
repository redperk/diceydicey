import { useState, useCallback } from 'react'
import { SOUND_NAMES } from '../utils/sounds'
import type { SoundName } from '../utils/sounds'

export interface Settings {
  diceCount: number
  rollCount: number
  timerEnabled: boolean
  timerDuration: number
  timerSound: SoundName
  p1Color: string
  p2Color: string
}

const STORAGE_KEY = 'dicey-dicey-settings'

const DEFAULT_SETTINGS: Settings = {
  diceCount: 6,
  rollCount: 3,
  timerEnabled: true,
  timerDuration: 90,
  timerSound: 'platinum',
  p1Color: 'Purple',
  p2Color: 'Amber',
}

const VALID_SOUNDS = new Set(SOUND_NAMES.map(s => s.value))

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      if (!VALID_SOUNDS.has(parsed.timerSound)) {
        parsed.timerSound = DEFAULT_SETTINGS.timerSound
      }
      return parsed
    }
  } catch {
    /* ignore parse errors */
  }
  return DEFAULT_SETTINGS
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { settings, updateSettings }
}
