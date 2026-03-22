import type { Settings } from '../hooks/useSettings'
import { playSound, SOUND_NAMES } from '../utils/sounds'
import type { SoundName } from '../utils/sounds'

interface SettingsPageProps {
  settings: Settings
  onUpdate: (updates: Partial<Settings>) => void
  onBack: () => void
}

export function SettingsPage({ settings, onUpdate, onBack }: SettingsPageProps) {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    if (s === 0) return `${m}:00`
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="settings-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: 4 }}>
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <h1 className="settings-title">Settings</h1>
        <div style={{ width: 72 }} />
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Game</div>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-row-label">Dice</span>
            <div className="stepper">
              <button
                className={`stepper-btn ${settings.diceCount <= 4 ? 'disabled' : ''}`}
                onClick={() => onUpdate({ diceCount: Math.max(4, settings.diceCount - 1) })}
              >
                &minus;
              </button>
              <span className="stepper-value">{settings.diceCount}</span>
              <button
                className={`stepper-btn ${settings.diceCount >= 10 ? 'disabled' : ''}`}
                onClick={() => onUpdate({ diceCount: Math.min(10, settings.diceCount + 1) })}
              >
                +
              </button>
            </div>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">Rounds</span>
            <div className="stepper">
              <button
                className={`stepper-btn ${settings.roundCount <= 1 ? 'disabled' : ''}`}
                onClick={() => onUpdate({ roundCount: Math.max(1, settings.roundCount - 1) })}
              >
                &minus;
              </button>
              <span className="stepper-value">{settings.roundCount}</span>
              <button
                className={`stepper-btn ${settings.roundCount >= 9 ? 'disabled' : ''}`}
                onClick={() => onUpdate({ roundCount: Math.min(9, settings.roundCount + 1) })}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Timer</div>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-row-label">Enable Timer</span>
            <div
              className={`toggle ${settings.timerEnabled ? 'active' : ''}`}
              onClick={() => onUpdate({ timerEnabled: !settings.timerEnabled })}
            >
              <div className="toggle-knob" />
            </div>
          </div>
          {settings.timerEnabled && (
            <>
              <div className="settings-row">
                <span className="settings-row-label">Duration</span>
                <div className="stepper">
                  <button
                    className={`stepper-btn ${settings.timerDuration <= 30 ? 'disabled' : ''}`}
                    onClick={() => onUpdate({ timerDuration: Math.max(30, settings.timerDuration - 15) })}
                  >
                    &minus;
                  </button>
                  <span className="stepper-value">{formatDuration(settings.timerDuration)}</span>
                  <button
                    className={`stepper-btn ${settings.timerDuration >= 300 ? 'disabled' : ''}`}
                    onClick={() => onUpdate({ timerDuration: Math.min(300, settings.timerDuration + 15) })}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="settings-row settings-row-vertical">
                <span className="settings-row-label">Sound</span>
                <div className="sound-options">
                  {SOUND_NAMES.map(({ value, label }) => (
                    <button
                      key={value}
                      className={`sound-option ${settings.timerSound === value ? 'active' : ''}`}
                      onClick={() => {
                        onUpdate({ timerSound: value as SoundName })
                        playSound(value)
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
