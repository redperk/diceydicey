import { useEffect, useRef } from 'react'
import { useGameState } from '../hooks/useGameState'
import type { Settings } from '../hooks/useSettings'
import { PlayerHalf } from './PlayerHalf'
import { Scoreboard } from './Scoreboard'
import { WinnerOverlay } from './WinnerOverlay'

interface GamePageProps {
  settings: Settings
  onOpenSettings: () => void
  hidden?: boolean
}

export function GamePage({ settings, onOpenSettings, hidden }: GamePageProps) {
  const { state, dispatch, resetGame } = useGameState(settings)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (state.phase === 'roundEnd') {
      const timeout = setTimeout(() => {
        dispatch({ type: 'NEXT_ROUND' })
      }, 2500)
      return () => clearTimeout(timeout)
    }
  }, [state.phase, state.currentRound, dispatch])

  useEffect(() => {
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen')
        }
      } catch {
        /* wake lock not available */
      }
    }
    requestWakeLock()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      wakeLockRef.current?.release()
    }
  }, [])

  const latestResult =
    state.roundResults.length > 0
      ? state.roundResults[state.roundResults.length - 1]
      : null

  return (
    <div className="game-page" style={hidden ? { display: 'none' } : undefined}>
      <div className="player-half-wrapper top">
        <PlayerHalf
          player={state.player2}
          playerNum={2}
          currentRound={state.currentRound}
          totalRounds={state.totalRounds}
          phase={state.phase}
          latestResult={state.phase === 'roundEnd' ? latestResult : null}
          onRoll={() => dispatch({ type: 'ROLL_DICE', player: 2 })}
          onToggleFreeze={(i) => dispatch({ type: 'TOGGLE_FREEZE', player: 2, index: i })}
          onLockIn={() => dispatch({ type: 'LOCK_IN', player: 2 })}
        />
      </div>

      <Scoreboard
        roundResults={state.roundResults}
        totalRounds={state.totalRounds}
        p1Score={state.player1.roundsWon}
        p2Score={state.player2.roundsWon}
        onOpenSettings={onOpenSettings}
      />

      <div className="player-half-wrapper">
        <PlayerHalf
          player={state.player1}
          playerNum={1}
          currentRound={state.currentRound}
          totalRounds={state.totalRounds}
          phase={state.phase}
          latestResult={state.phase === 'roundEnd' ? latestResult : null}
          onRoll={() => dispatch({ type: 'ROLL_DICE', player: 1 })}
          onToggleFreeze={(i) => dispatch({ type: 'TOGGLE_FREEZE', player: 1, index: i })}
          onLockIn={() => dispatch({ type: 'LOCK_IN', player: 1 })}
        />
      </div>

      {state.phase === 'gameEnd' && (
        <WinnerOverlay
          gameWinner={state.gameWinner}
          p1Score={state.player1.roundsWon}
          p2Score={state.player2.roundsWon}
          settings={settings}
          onReset={resetGame}
        />
      )}
    </div>
  )
}
