import { describe, it, expect } from 'vitest'
import { SOUND_NAMES } from '../utils/sounds'
import type { SoundName } from '../utils/sounds'

describe('SOUND_NAMES', () => {
  it('has at least 6 sound options', () => {
    expect(SOUND_NAMES.length).toBeGreaterThanOrEqual(6)
  })

  it('each entry has a value and label', () => {
    for (const sound of SOUND_NAMES) {
      expect(sound.value).toBeTruthy()
      expect(sound.label).toBeTruthy()
    }
  })

  it('all values are unique', () => {
    const values = SOUND_NAMES.map(s => s.value)
    expect(new Set(values).size).toBe(values.length)
  })
})
