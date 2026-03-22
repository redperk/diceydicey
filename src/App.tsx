import { useState } from 'react'
import { useSettings } from './hooks/useSettings'
import { GamePage } from './components/GamePage'
import { SettingsPage } from './components/SettingsPage'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const { settings, updateSettings } = useSettings()

  return (
    <>
      <GamePage
        settings={settings}
        onOpenSettings={() => setShowSettings(true)}
        hidden={showSettings}
      />
      {showSettings && (
        <SettingsPage
          settings={settings}
          onUpdate={updateSettings}
          onBack={() => setShowSettings(false)}
        />
      )}
    </>
  )
}

export default App
