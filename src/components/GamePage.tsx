import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { useGameState } from '../hooks/useGameState'
import type { Settings } from '../hooks/useSettings'
import { getColorPreset } from '../utils/colors'
import { getBestGroup } from '../utils/gameLogic'
import { PlayerHalf } from './PlayerHalf'
import { Scoreboard } from './Scoreboard'
import { GameEndPanel } from './GameEndPanel'

interface GamePageProps {
  settings: Settings
  onOpenSettings: () => void
  hidden?: boolean
}

function fireP1Confetti(colors: string[]) {
  const c = [...colors, '#ffffff', '#fffbe6', ...colors]
  const drift = { colors: c, disableForReducedMotion: true, angle: 90, gravity: 0.35, decay: 0.94, scalar: 1.1 }

  confetti({ ...drift, particleCount: 80, spread: 160, origin: { y: 0.5, x: 0.5 }, startVelocity: 18, ticks: 500 })
  confetti({ ...drift, particleCount: 60, spread: 140, origin: { y: 0.5, x: 0.2 }, startVelocity: 14, ticks: 500 })
  confetti({ ...drift, particleCount: 60, spread: 140, origin: { y: 0.5, x: 0.8 }, startVelocity: 14, ticks: 500 })

  setTimeout(() => {
    confetti({ ...drift, particleCount: 60, spread: 120, origin: { y: 0.52, x: 0.4 }, startVelocity: 16, ticks: 500 })
    confetti({ ...drift, particleCount: 60, spread: 120, origin: { y: 0.52, x: 0.6 }, startVelocity: 16, ticks: 500 })
  }, 1500)

  setTimeout(() => {
    confetti({ ...drift, particleCount: 50, spread: 160, origin: { y: 0.5, x: 0.5 }, startVelocity: 14, ticks: 500 })
    confetti({ ...drift, particleCount: 40, spread: 130, origin: { y: 0.5, x: 0.3 }, startVelocity: 12, ticks: 500 })
    confetti({ ...drift, particleCount: 40, spread: 130, origin: { y: 0.5, x: 0.7 }, startVelocity: 12, ticks: 500 })
  }, 3500)

  setTimeout(() => {
    confetti({ ...drift, particleCount: 50, spread: 140, origin: { y: 0.52, x: 0.5 }, startVelocity: 12, ticks: 500 })
  }, 5500)
}

function fireP2Confetti(colors: string[]) {
  const c = [...colors, '#ffffff', '#fffbe6', ...colors]
  const drift = { colors: c, disableForReducedMotion: true, angle: 270, gravity: -0.35, decay: 0.94, scalar: 1.1 }

  confetti({ ...drift, particleCount: 80, spread: 160, origin: { y: 0.5, x: 0.5 }, startVelocity: 18, ticks: 500 })
  confetti({ ...drift, particleCount: 60, spread: 140, origin: { y: 0.5, x: 0.2 }, startVelocity: 14, ticks: 500 })
  confetti({ ...drift, particleCount: 60, spread: 140, origin: { y: 0.5, x: 0.8 }, startVelocity: 14, ticks: 500 })

  setTimeout(() => {
    confetti({ ...drift, particleCount: 60, spread: 120, origin: { y: 0.48, x: 0.4 }, startVelocity: 16, ticks: 500 })
    confetti({ ...drift, particleCount: 60, spread: 120, origin: { y: 0.48, x: 0.6 }, startVelocity: 16, ticks: 500 })
  }, 1500)

  setTimeout(() => {
    confetti({ ...drift, particleCount: 50, spread: 160, origin: { y: 0.5, x: 0.5 }, startVelocity: 14, ticks: 500 })
    confetti({ ...drift, particleCount: 40, spread: 130, origin: { y: 0.5, x: 0.3 }, startVelocity: 12, ticks: 500 })
    confetti({ ...drift, particleCount: 40, spread: 130, origin: { y: 0.5, x: 0.7 }, startVelocity: 12, ticks: 500 })
  }, 3500)

  setTimeout(() => {
    confetti({ ...drift, particleCount: 50, spread: 140, origin: { y: 0.48, x: 0.5 }, startVelocity: 12, ticks: 500 })
  }, 5500)
}

export function GamePage({ settings, onOpenSettings, hidden }: GamePageProps) {
  const { state, dispatch, resetGame } = useGameState(settings)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const [gamesWon, setGamesWon] = useState({ p1: 0, p2: 0 })
  const countedForPhase = useRef(false)
  const confettiFired = useRef(false)

  const prevDiceCount = useRef(settings.diceCount)
  const prevRollCount = useRef(settings.rollCount)

  useEffect(() => {
    if (
      settings.diceCount !== prevDiceCount.current ||
      settings.rollCount !== prevRollCount.current
    ) {
      prevDiceCount.current = settings.diceCount
      prevRollCount.current = settings.rollCount
      resetGame()
    }
  }, [settings.diceCount, settings.rollCount, resetGame])

  useEffect(() => {
    if (state.phase === 'gameEnd' && state.result && !countedForPhase.current) {
      countedForPhase.current = true
      if (state.result.winner === 1) {
        setGamesWon(prev => ({ ...prev, p1: prev.p1 + 1 }))
      } else if (state.result.winner === 2) {
        setGamesWon(prev => ({ ...prev, p2: prev.p2 + 1 }))
      }
    } else if (state.phase === 'playing') {
      countedForPhase.current = false
    }
  }, [state.phase, state.result])

  useEffect(() => {
    if (state.phase === 'gameEnd' && state.result && !confettiFired.current) {
      confettiFired.current = true
      const winner = state.result.winner
      const p1c = getColorPreset(settings.p1Color)
      const p2c = getColorPreset(settings.p2Color)

      if (winner === 1 || winner === 0) {
        fireP1Confetti([p1c.accent, p1c.accent2])
      }
      if (winner === 2 || winner === 0) {
        fireP2Confetti([p2c.accent, p2c.accent2])
      }
    } else if (state.phase === 'playing') {
      confettiFired.current = false
    }
  }, [state.phase, state.result, settings.p1Color, settings.p2Color])

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

  return (
    <div className="game-page" style={hidden ? { display: 'none' } : undefined}>
      <div className="player-half-wrapper top">
        <PlayerHalf
          player={state.player2}
          playerNum={2}
          totalRolls={state.totalRolls}
          phase={state.phase}
          highlightValue={
            state.phase === 'gameEnd' && state.result
              ? state.result.p2Best.value
              : state.player2.rollsLeft === 0 && state.player2.dice[0] !== 0
                ? getBestGroup(state.player2.dice).value
                : undefined
          }
          onRoll={() => dispatch({ type: 'ROLL_DICE', player: 2 })}
          onToggleFreeze={(i) => dispatch({ type: 'TOGGLE_FREEZE', player: 2, index: i })}
        />
      </div>

      <Scoreboard
        p1GamesWon={gamesWon.p1}
        p2GamesWon={gamesWon.p2}
        onOpenSettings={onOpenSettings}
      />

      <div className="player-half-wrapper">
        <PlayerHalf
          player={state.player1}
          playerNum={1}
          totalRolls={state.totalRolls}
          phase={state.phase}
          highlightValue={
            state.phase === 'gameEnd' && state.result
              ? state.result.p1Best.value
              : state.player1.rollsLeft === 0 && state.player1.dice[0] !== 0
                ? getBestGroup(state.player1.dice).value
                : undefined
          }
          onRoll={() => dispatch({ type: 'ROLL_DICE', player: 1 })}
          onToggleFreeze={(i) => dispatch({ type: 'TOGGLE_FREEZE', player: 1, index: i })}
        />
      </div>

      {state.phase === 'gameEnd' && state.result && (
        <GameEndPanel
          winner={state.result.winner}
          p1Best={state.result.p1Best}
          p2Best={state.result.p2Best}
          settings={settings}
          onReset={resetGame}
        />
      )}
    </div>
  )
}
