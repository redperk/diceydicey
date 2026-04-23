import { useState } from 'react'
import { useSettings } from './hooks/useSettings'
import { getColorPreset } from './utils/colors'
import { GamePage } from './components/GamePage'
import { SettingsPage } from './components/SettingsPage'
import { HowToPlayPage } from './components/HowToPlayPage'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const { settings, updateSettings } = useSettings()

  const p1 = getColorPreset(settings.p1Color)
  const p2 = getColorPreset(settings.p2Color)

  const colorVars = {
    '--p1-accent': p1.accent,
    '--p1-accent-2': p1.accent2,
    '--p1-gradient': `linear-gradient(135deg, ${p1.accent}, ${p1.accent2})`,
    '--p1-bg': p1.bg,
    '--p1-glow': p1.glow,
    '--p2-accent': p2.accent,
    '--p2-accent-2': p2.accent2,
    '--p2-gradient': `linear-gradient(135deg, ${p2.accent}, ${p2.accent2})`,
    '--p2-bg': p2.bg,
    '--p2-glow': p2.glow,
  } as React.CSSProperties

  return (
    <div style={colorVars}>
      <GamePage
        settings={settings}
        onOpenSettings={() => setShowSettings(true)}
        hidden={showSettings || showHowToPlay}
      />
      {showSettings && !showHowToPlay && (
        <SettingsPage
          settings={settings}
          onUpdate={updateSettings}
          onBack={() => setShowSettings(false)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
        />
      )}
      {showHowToPlay && (
        <HowToPlayPage
          settings={settings}
          onBack={() => setShowHowToPlay(false)}
        />
      )}
    </div>
  )
}

export default App
