import { useEffect, useRef, useCallback, useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import { playSound, stopSound } from '../utils/sounds'
import type { Settings } from '../hooks/useSettings'
import type { BestGroup } from '../utils/gameLogic'

interface GameEndPanelProps {
  winner: 0 | 1 | 2
  p1Best: BestGroup
  p2Best: BestGroup
  settings: Settings
  onReset: () => void
}

export function GameEndPanel({
  winner,
  p1Best,
  p2Best,
  settings,
  onReset,
}: GameEndPanelProps) {
  const hasInit = useRef(false)
  const [timerDone, setTimerDone] = useState(false)

  const handleTimerComplete = useCallback(() => {
    playSound(settings.timerSound)
    setTimerDone(true)
  }, [settings.timerSound])

  const timer = useTimer(settings.timerDuration, handleTimerComplete)

  useEffect(() => {
    if (hasInit.current) return
    hasInit.current = true
    if (settings.timerEnabled) {
      timer.start()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = useCallback(() => {
    stopSound()
    onReset()
  }, [onReset])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const showTimer = settings.timerEnabled && timer.isActive && !timerDone

  return (
    <div className="game-end-panel">
      <div
        className={`game-end-winner ${
          winner === 1 ? 'p1' : winner === 2 ? 'p2' : 'tie'
        }`}
      >
        {winner === 0 ? "It's a Tie!" : `Player ${winner} Wins`}
      </div>

      <div className="game-end-details">
        <span className="game-end-detail p1">P1: {p1Best.count}{'×'}{p1Best.value}s</span>
        <span className="game-end-divider">&mdash;</span>
        <span className="game-end-detail p2">P2: {p2Best.count}{'×'}{p2Best.value}s</span>
      </div>

      {showTimer && (
        <div className="game-end-timer">
          <span className="game-end-time">{formatTime(timer.secondsLeft)}</span>
          <button
            className="timer-btn-small"
            onClick={() => (timer.isRunning ? timer.pause() : timer.resume())}
            aria-label={timer.isRunning ? 'Pause' : 'Resume'}
          >
            {timer.isRunning ? (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <rect x="5" y="3" width="3.5" height="14" rx="1" />
                <rect x="11.5" y="3" width="3.5" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 3.5L16 10L6 16.5V3.5Z" />
              </svg>
            )}
          </button>
        </div>
      )}

      <button className="game-end-btn" onClick={handleReset}>
        Next Game
      </button>
    </div>
  )
}
