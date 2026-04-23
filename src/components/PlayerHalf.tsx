import { useState, useCallback, useRef, useEffect } from 'react'
import { Die } from './Die'
import { playDiceRoll } from '../utils/sounds'
import type { PlayerState, GamePhase } from '../hooks/useGameState'

interface PlayerHalfProps {
  player: PlayerState
  playerNum: 1 | 2
  totalRolls: number
  phase: GamePhase
  highlightValue?: number
  onRoll: () => void
  onToggleFreeze: (index: number) => void
}

export function PlayerHalf({
  player,
  playerNum,
  totalRolls,
  phase,
  highlightValue,
  onRoll,
  onToggleFreeze,
}: PlayerHalfProps) {
  const [isRolling, setIsRolling] = useState(false)
  const [displayValues, setDisplayValues] = useState<number[]>([])
  const rollingTimeout = useRef<number | undefined>(undefined)

  const diceCount = player.dice.length
  const isTiebreaker = phase === 'tiebreaker'
  const isPlayable = phase === 'playing' || isTiebreaker

  const handleRoll = useCallback(() => {
    if (isRolling || player.rollsLeft <= 0 || !isPlayable) return
    playDiceRoll()
    setIsRolling(true)
    if (rollingTimeout.current) clearTimeout(rollingTimeout.current)
    rollingTimeout.current = window.setTimeout(() => {
      onRoll()
      setIsRolling(false)
    }, 1000)
  }, [isRolling, player.rollsLeft, isPlayable, onRoll])

  useEffect(() => {
    if (!isRolling) {
      setDisplayValues([])
      return
    }

    const randomize = () =>
      Array.from({ length: diceCount }, (_, i) =>
        player.frozen[i] ? player.dice[i] : Math.floor(Math.random() * 6) + 1
      )

    setDisplayValues(randomize())
    const interval = setInterval(() => setDisplayValues(randomize()), 80)
    return () => clearInterval(interval)
  }, [isRolling, diceCount, player.frozen, player.dice])

  const dieSize = diceCount <= 5 ? 54 : diceCount <= 6 ? 48 : diceCount <= 8 ? 44 : 40

  const rollsUsed = totalRolls - player.rollsLeft
  const hasRolled = rollsUsed > 0
  const canFreeze = phase === 'playing' && player.rollsLeft > 0 && hasRolled && !isRolling
  const canRoll = isPlayable && player.rollsLeft > 0 && !isRolling
  const isWaiting = isPlayable && player.rollsLeft === 0

  return (
    <div className={`player-half p${playerNum}-half`}>
      <div className="player-info">
        <span className={`player-label p${playerNum}`}>Player {playerNum}</span>
        {isTiebreaker ? (
          <span className="tiebreaker-label">Tiebreaker!</span>
        ) : hasRolled ? (
          <span className="roll-counter">Roll {rollsUsed} / {totalRolls}</span>
        ) : null}
      </div>

      <div className="dice-grid">
        {(() => {
          const topRowCount = Math.ceil(diceCount / 2)
          const isGameEnd = highlightValue !== undefined
          const renderDie = (i: number) => {
            const value = player.dice[i]
            const showRolling = isRolling && !player.frozen[i]
            const dieValue = showRolling ? (displayValues[i] || 1) : value
            return (
              <Die
                key={i}
                value={dieValue}
                frozen={isGameEnd ? false : player.frozen[i]}
                highlighted={isGameEnd && value === highlightValue}
                rolling={showRolling}
                disabled={!canFreeze}
                playerNum={playerNum}
                size={dieSize}
                index={i}
                onToggleFreeze={() => onToggleFreeze(i)}
              />
            )
          }
          return (
            <>
              <div className="dice-row">
                {Array.from({ length: topRowCount }, (_, i) => renderDie(i))}
              </div>
              {diceCount > topRowCount && (
                <div className="dice-row">
                  {Array.from({ length: diceCount - topRowCount }, (_, i) => renderDie(topRowCount + i))}
                </div>
              )}
            </>
          )
        })()}
      </div>

      <div className="player-actions">
        {isWaiting ? (
          <div className="waiting-text">Waiting for opponent...</div>
        ) : (
          <button
            className={`roll-btn p${playerNum} ${!canRoll ? 'disabled' : ''}`}
            onClick={handleRoll}
          >
            {isTiebreaker ? 'Tiebreaker Roll' : !hasRolled ? 'Roll' : 'Re-roll'}
          </button>
        )}
      </div>
    </div>
  )
}
