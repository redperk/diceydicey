import { useReducer, useCallback } from 'react'
import { getRoundWinner } from '../utils/gameLogic'
import type { BestGroup } from '../utils/gameLogic'
import type { Settings } from './useSettings'

export type GamePhase = 'playing' | 'tiebreaker' | 'gameEnd'

export interface PlayerState {
  dice: number[]
  frozen: boolean[]
  rollsLeft: number
}

export interface GameResult {
  winner: 0 | 1 | 2
  p1Best: BestGroup
  p2Best: BestGroup
}

export interface GameState {
  phase: GamePhase
  diceCount: number
  totalRolls: number
  player1: PlayerState
  player2: PlayerState
  result: GameResult | null
}

type GameAction =
  | { type: 'ROLL_DICE'; player: 1 | 2 }
  | { type: 'TOGGLE_FREEZE'; player: 1 | 2; index: number }
  | { type: 'RESET_GAME'; diceCount: number; rollCount: number }

function createPlayerState(diceCount: number, rollCount: number): PlayerState {
  return {
    dice: Array(diceCount).fill(0),
    frozen: Array(diceCount).fill(false),
    rollsLeft: rollCount,
  }
}

function createInitialState(diceCount: number, rollCount: number): GameState {
  return {
    phase: 'playing',
    diceCount,
    totalRolls: rollCount,
    player1: createPlayerState(diceCount, rollCount),
    player2: createPlayerState(diceCount, rollCount),
    result: null,
  }
}

function prepareTiebreakerPlayer(player: PlayerState, best: BestGroup): PlayerState {
  return {
    dice: player.dice.map(d => d === best.value ? d : 0),
    frozen: player.dice.map(d => d === best.value),
    rollsLeft: 1,
  }
}

function resolveRolls(state: GameState): GameState {
  if (state.player1.rollsLeft > 0 || state.player2.rollsLeft > 0) return state

  const result = getRoundWinner(state.player1.dice, state.player2.dice)

  if (result.winner === 0) {
    return {
      ...state,
      phase: 'tiebreaker',
      player1: prepareTiebreakerPlayer(state.player1, result.p1Best),
      player2: prepareTiebreakerPlayer(state.player2, result.p2Best),
      result: null,
    }
  }

  return { ...state, phase: 'gameEnd', result }
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROLL_DICE': {
      const isPlayable = state.phase === 'playing' || state.phase === 'tiebreaker'
      const player = action.player === 1 ? state.player1 : state.player2
      if (player.rollsLeft <= 0 || !isPlayable) return state

      const newDice = player.dice.map((d, i) =>
        player.frozen[i] ? d : Math.floor(Math.random() * 6) + 1
      )
      const updated = { ...player, dice: newDice, rollsLeft: player.rollsLeft - 1 }

      const newState = action.player === 1
        ? { ...state, player1: updated }
        : { ...state, player2: updated }

      return resolveRolls(newState)
    }

    case 'TOGGLE_FREEZE': {
      const player = action.player === 1 ? state.player1 : state.player2
      if (player.rollsLeft >= state.totalRolls || player.rollsLeft <= 0 || state.phase !== 'playing') return state

      const newFrozen = [...player.frozen]
      newFrozen[action.index] = !newFrozen[action.index]
      const updated = { ...player, frozen: newFrozen }

      return action.player === 1
        ? { ...state, player1: updated }
        : { ...state, player2: updated }
    }

    case 'RESET_GAME':
      return createInitialState(action.diceCount, action.rollCount)

    default:
      return state
  }
}

export function useGameState(settings: Settings) {
  const [state, dispatch] = useReducer(
    gameReducer,
    { diceCount: settings.diceCount, rollCount: settings.rollCount },
    ({ diceCount, rollCount }) => createInitialState(diceCount, rollCount)
  )

  const resetGame = useCallback(() => {
    dispatch({
      type: 'RESET_GAME',
      diceCount: settings.diceCount,
      rollCount: settings.rollCount,
    })
  }, [settings.diceCount, settings.rollCount])

  return { state, dispatch, resetGame }
}
