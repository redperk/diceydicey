import type { RoundResult } from '../hooks/useGameState'

interface ScoreboardProps {
  roundResults: RoundResult[]
  totalRounds: number
  p1Score: number
  p2Score: number
  onOpenSettings: () => void
}

export function Scoreboard({
  roundResults,
  totalRounds,
  p1Score,
  p2Score,
  onOpenSettings,
}: ScoreboardProps) {
  return (
    <div className="scoreboard">
      <span className="scoreboard-score p2">{p2Score}</span>

      <div className="scoreboard-dots">
        {Array.from({ length: totalRounds }, (_, i) => {
          const result = roundResults[i]
          const cls = result
            ? result.winner === 1
              ? 'p1-win'
              : result.winner === 2
                ? 'p2-win'
                : 'draw'
            : ''
          return <div key={i} className={`scoreboard-dot ${cls}`} />
        })}
      </div>

      <span className="scoreboard-score p1">{p1Score}</span>

      <button className="settings-btn" onClick={onOpenSettings} aria-label="Settings">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
