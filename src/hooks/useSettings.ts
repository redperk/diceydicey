import { useState, useCallback } from 'react'
import type { SoundName } from '../utils/sounds'

export interface Settings {
  diceCount: number
  roundCount: number
  timerEnabled: boolean
  timerDuration: number
  timerSound: SoundName
}

const STORAGE_KEY = 'dicey-dicey-settings'

const DEFAULT_SETTINGS: Settings = {
  diceCount: 6,
  roundCount: 3,
  timerEnabled: true,
  timerDuration: 90,
  timerSound: 'gong',
}

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
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
