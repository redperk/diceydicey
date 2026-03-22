import { useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useTimer } from '../hooks/useTimer'
import { playSound } from '../utils/sounds'
import type { Settings } from '../hooks/useSettings'

interface WinnerOverlayProps {
  gameWinner: 0 | 1 | 2
  p1Score: number
  p2Score: number
  settings: Settings
  onReset: () => void
}

export function WinnerOverlay({
  gameWinner,
  p1Score,
  p2Score,
  settings,
  onReset,
}: WinnerOverlayProps) {
  const hasInit = useRef(false)

  const handleTimerComplete = useCallback(() => {
    playSound(settings.timerSound)
    setTimeout(() => onReset(), 1500)
  }, [settings.timerSound, onReset])

  const timer = useTimer(settings.timerDuration, handleTimerComplete)

  useEffect(() => {
    if (hasInit.current) return
    hasInit.current = true

    const colors =
      gameWinner === 1
        ? ['#8b5cf6', '#6366f1', '#a78bfa']
        : gameWinner === 2
          ? ['#f59e0b', '#ef4444', '#fbbf24']
          : ['#8b5cf6', '#f59e0b', '#6366f1', '#ef4444']

    if (gameWinner === 1 || gameWinner === 0) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.75, x: 0.5 }, colors })
    }
    if (gameWinner === 2 || gameWinner === 0) {
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.25, x: 0.5 }, colors })
      }, 200)
    }

    if (settings.timerEnabled) {
      timer.start()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="winner-overlay">
      <div className="winner-title">Game Over</div>
      <div
        className={`winner-name ${
          gameWinner === 1 ? 'p1' : gameWinner === 2 ? 'p2' : 'tie'
        }`}
      >
        {gameWinner === 0 ? "It's a Tie!" : `Player ${gameWinner} Wins`}
      </div>
      <div className="winner-score-display">{p1Score} &mdash; {p2Score}</div>

      {settings.timerEnabled && timer.isActive ? (
        <div className="timer-container">
          <div className="timer-display">{formatTime(timer.secondsLeft)}</div>
          <div className="timer-controls">
            <button
              className="timer-btn"
              onClick={() => (timer.isRunning ? timer.pause() : timer.resume())}
              aria-label={timer.isRunning ? 'Pause' : 'Resume'}
            >
              {timer.isRunning ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <rect x="5" y="3" width="3.5" height="14" rx="1" />
                  <rect x="11.5" y="3" width="3.5" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 3.5L16 10L6 16.5V3.5Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ) : !settings.timerEnabled ? (
        <button className="play-again-btn" onClick={onReset}>
          Play Again
        </button>
      ) : null}
    </div>
  )
}
