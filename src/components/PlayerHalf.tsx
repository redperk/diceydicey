import { useState, useCallback, useRef } from 'react'
import { Die } from './Die'
import type { PlayerState, GamePhase, RoundResult } from '../hooks/useGameState'

interface PlayerHalfProps {
  player: PlayerState
  playerNum: 1 | 2
  currentRound: number
  totalRounds: number
  phase: GamePhase
  latestResult: RoundResult | null
  onRoll: () => void
  onToggleFreeze: (index: number) => void
  onLockIn: () => void
}

export function PlayerHalf({
  player,
  playerNum,
  currentRound,
  totalRounds,
  phase,
  latestResult,
  onRoll,
  onToggleFreeze,
  onLockIn,
}: PlayerHalfProps) {
  const [isRolling, setIsRolling] = useState(false)
  const rollingTimeout = useRef<number | undefined>(undefined)

  const handleRoll = useCallback(() => {
    if (isRolling || player.rollsLeft <= 0 || phase !== 'playing') return
    setIsRolling(true)
    if (rollingTimeout.current) clearTimeout(rollingTimeout.current)
    rollingTimeout.current = window.setTimeout(() => {
      onRoll()
      setIsRolling(false)
    }, 400)
  }, [isRolling, player.rollsLeft, phase, onRoll])

  const diceCount = player.dice.length
  const dieSize = diceCount <= 5 ? 54 : diceCount <= 6 ? 48 : diceCount <= 8 ? 44 : 40

  const canFreeze = phase === 'playing' && player.rollsLeft > 0 && player.rollsLeft < 3 && !isRolling
  const canRoll = phase === 'playing' && player.rollsLeft > 0 && !isRolling
  const canLockIn = phase === 'playing' && player.rollsLeft > 0 && player.rollsLeft < 3 && !isRolling
  const isWaiting = phase === 'playing' && player.rollsLeft === 0
  const hasRolled = player.rollsLeft < 3

  return (
    <div className={`player-half p${playerNum}-half`}>
      <div className="player-info">
        <span className={`player-label p${playerNum}`}>Player {playerNum}</span>
        <span className="round-info">
          Round {currentRound}/{totalRounds}
          {hasRolled && ` \u00b7 Score: ${player.roundsWon}`}
        </span>
      </div>

      <div className="dice-grid">
        {player.dice.map((value, i) => (
          <Die
            key={i}
            value={value}
            frozen={player.frozen[i]}
            rolling={isRolling && !player.frozen[i] && value !== 0}
            disabled={!canFreeze}
            playerNum={playerNum}
            size={dieSize}
            onToggleFreeze={() => onToggleFreeze(i)}
          />
        ))}
      </div>

      <div className="player-actions">
        {hasRolled && player.rollsLeft > 0 && (
          <div className="rolls-left">
            {player.rollsLeft} roll{player.rollsLeft > 1 ? 's' : ''} left
          </div>
        )}

        {isWaiting ? (
          <div className="waiting-text">Waiting for opponent...</div>
        ) : (
          <>
            <button
              className={`roll-btn p${playerNum} ${!canRoll ? 'disabled' : ''}`}
              onClick={handleRoll}
            >
              {!hasRolled ? 'Roll' : 'Re-roll'}
            </button>
            {canLockIn && (
              <button className="lock-in-btn" onClick={onLockIn}>
                Lock In
              </button>
            )}
          </>
        )}
      </div>

      {phase === 'roundEnd' && latestResult && (
        <div className="round-end-overlay">
          <div
            className={`round-result-label ${
              latestResult.winner === playerNum
                ? 'win'
                : latestResult.winner === 0
                  ? 'draw-result'
                  : 'lose'
            }`}
          >
            {latestResult.winner === playerNum
              ? 'Round Won!'
              : latestResult.winner === 0
                ? 'Draw!'
                : 'Round Lost'}
          </div>
          <div className="round-result-detail">
            {playerNum === 1
              ? `${latestResult.p1Best.count}\u00d7 ${latestResult.p1Best.value}s`
              : `${latestResult.p2Best.count}\u00d7 ${latestResult.p2Best.value}s`}
          </div>
        </div>
      )}
    </div>
  )
}
