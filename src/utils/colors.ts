export interface PlayerColor {
  name: string
  accent: string
  accent2: string
  glow: string
  bg: string
}

export const COLOR_PRESETS: PlayerColor[] = [
  { name: 'Red', accent: '#ef4444', accent2: '#dc2626', glow: 'rgba(239, 68, 68, 0.4)', bg: 'rgba(239, 68, 68, 0.06)' },
  { name: 'Rose', accent: '#f43f5e', accent2: '#e11d48', glow: 'rgba(244, 63, 94, 0.4)', bg: 'rgba(244, 63, 94, 0.06)' },
  { name: 'Pink', accent: '#ec4899', accent2: '#db2777', glow: 'rgba(236, 72, 153, 0.4)', bg: 'rgba(236, 72, 153, 0.06)' },
  { name: 'Orange', accent: '#f97316', accent2: '#ea580c', glow: 'rgba(249, 115, 22, 0.4)', bg: 'rgba(249, 115, 22, 0.06)' },
  { name: 'Amber', accent: '#f59e0b', accent2: '#d97706', glow: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.06)' },
  { name: 'Green', accent: '#10b981', accent2: '#059669', glow: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.06)' },
  { name: 'Teal', accent: '#14b8a6', accent2: '#0d9488', glow: 'rgba(20, 184, 166, 0.4)', bg: 'rgba(20, 184, 166, 0.06)' },
  { name: 'Cyan', accent: '#06b6d4', accent2: '#0891b2', glow: 'rgba(6, 182, 212, 0.4)', bg: 'rgba(6, 182, 212, 0.06)' },
  { name: 'Blue', accent: '#3b82f6', accent2: '#2563eb', glow: 'rgba(59, 130, 246, 0.4)', bg: 'rgba(59, 130, 246, 0.06)' },
  { name: 'Indigo', accent: '#6366f1', accent2: '#4f46e5', glow: 'rgba(99, 102, 241, 0.4)', bg: 'rgba(99, 102, 241, 0.06)' },
  { name: 'Purple', accent: '#8b5cf6', accent2: '#6366f1', glow: 'rgba(139, 92, 246, 0.4)', bg: 'rgba(139, 92, 246, 0.06)' },
]

export function getColorPreset(name: string): PlayerColor {
  return COLOR_PRESETS.find(c => c.name === name) || COLOR_PRESETS[0]
}
