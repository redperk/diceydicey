import { describe, it, expect } from 'vitest'
import { COLOR_PRESETS, getColorPreset } from '../utils/colors'

describe('COLOR_PRESETS', () => {
  it('has at least 8 color options', () => {
    expect(COLOR_PRESETS.length).toBeGreaterThanOrEqual(8)
  })

  it('each preset has required fields', () => {
    for (const color of COLOR_PRESETS) {
      expect(color.name).toBeTruthy()
      expect(color.accent).toMatch(/^#[0-9a-f]{6}$/i)
      expect(color.accent2).toMatch(/^#[0-9a-f]{6}$/i)
      expect(color.glow).toMatch(/^rgba\(/)
      expect(color.bg).toMatch(/^rgba\(/)
    }
  })

  it('all names are unique', () => {
    const names = COLOR_PRESETS.map(c => c.name)
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('getColorPreset', () => {
  it('returns the correct preset by name', () => {
    const purple = getColorPreset('Purple')
    expect(purple.name).toBe('Purple')
    expect(purple.accent).toBe('#8b5cf6')
  })

  it('returns first preset for unknown name', () => {
    const fallback = getColorPreset('NonExistent')
    expect(fallback).toEqual(COLOR_PRESETS[0])
  })

  it('finds each preset by name', () => {
    for (const preset of COLOR_PRESETS) {
      expect(getColorPreset(preset.name)).toEqual(preset)
    }
  })
})
