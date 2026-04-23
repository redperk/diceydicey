import type { Settings } from '../hooks/useSettings'

interface HowToPlayPageProps {
  settings: Settings
  onBack: () => void
}

export function HowToPlayPage({ settings, onBack }: HowToPlayPageProps) {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="settings-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: 4 }}>
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <h1 className="settings-title">How to Play</h1>
        <div style={{ width: 72 }} />
      </div>

      <div className="settings-section">
        <div className="settings-section-title">The Goal</div>
        <div className="settings-card htp-card">
          <p className="htp-text">
            Get the most dice showing the same number. Highest count wins. If tied, the higher number wins.
          </p>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Setup</div>
        <div className="settings-card htp-card">
          <p className="htp-text">
            Place your phone flat on a table between two players. Each player faces their half of the screen.
          </p>
          <div className="htp-stat-row">
            <div className="htp-stat">
              <span className="htp-stat-value">{settings.diceCount}</span>
              <span className="htp-stat-label">Dice</span>
            </div>
            <div className="htp-stat">
              <span className="htp-stat-value">{settings.rollCount}</span>
              <span className="htp-stat-label">Rolls per Game</span>
            </div>
          </div>
          <p className="htp-text htp-text-muted">
            You can change the number of dice (4&ndash;10) and rolls per game (1&ndash;9) anytime from the Settings page.
          </p>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">How to Play</div>
        <div className="settings-card htp-card">
          <ol className="htp-steps">
            <li>
              <strong>Tap Roll.</strong> All your dice roll at once.
            </li>
            <li>
              <strong>Tap dice to keep.</strong> Tapped dice are frozen and won't re-roll.
            </li>
            <li>
              <strong>Tap Re-roll.</strong> The unfrozen dice roll again.
            </li>
            <li>
              <strong>Repeat</strong> until both players have used all {settings.rollCount} {settings.rollCount === 1 ? 'roll' : 'rolls'}.
            </li>
          </ol>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Winning</div>
        <div className="settings-card htp-card">
          <p className="htp-text">
            The player with the most matching dice wins. Example: four 5s beats three 6s. If both players tie, the dice not in your best group re-roll once to break the tie.
          </p>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Tips</div>
        <div className="settings-card htp-card">
          <ul className="htp-tips">
            <li>Both players play at the same time. Roll whenever you're ready.</li>
            <li>Frozen dice glow in your color so you can spot your matches.</li>
            <li>Higher numbers beat lower numbers when counts are equal.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
