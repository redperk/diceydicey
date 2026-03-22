import { useReducer, useCallback } from 'react'
import { getRoundWinner, getGameWinner } from '../utils/gameLogic'
import type { RoundResult } from '../utils/gameLogic'
import type { Settings } from './useSettings'

export type GamePhase = 'playing' | 'roundEnd' | 'gameEnd'

export interface PlayerState {
  dice: number[]
  frozen: boolean[]
  rollsLeft: number
  roundsWon: number
}

export type { RoundResult }

export interface GameState {
  phase: GamePhase
  currentRound: number
  totalRounds: number
  diceCount: number
  player1: PlayerState
  player2: PlayerState
  roundResults: RoundResult[]
  gameWinner: 0 | 1 | 2
}

type GameAction =
  | { type: 'ROLL_DICE'; player: 1 | 2 }
  | { type: 'TOGGLE_FREEZE'; player: 1 | 2; index: number }
  | { type: 'LOCK_IN'; player: 1 | 2 }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_GAME'; diceCount: number; roundCount: number }

function createPlayerState(diceCount: number): PlayerState {
  return {
    dice: Array(diceCount).fill(0),
    frozen: Array(diceCount).fill(false),
    rollsLeft: 3,
    roundsWon: 0,
  }
}

function createInitialState(diceCount: number, roundCount: number): GameState {
  return {
    phase: 'playing',
    currentRound: 1,
    totalRounds: roundCount,
    diceCount,
    player1: createPlayerState(diceCount),
    player2: createPlayerState(diceCount),
    roundResults: [],
    gameWinner: 0,
  }
}

function resolveRoundEnd(state: GameState): GameState {
  if (
    state.player1.rollsLeft === 0 &&
    state.player2.rollsLeft === 0 &&
    state.phase === 'playing'
  ) {
    const result = getRoundWinner(state.player1.dice, state.player2.dice)
    return {
      ...state,
      phase: 'roundEnd',
      player1: {
        ...state.player1,
        roundsWon: state.player1.roundsWon + (result.winner === 1 ? 1 : 0),
      },
      player2: {
        ...state.player2,
        roundsWon: state.player2.roundsWon + (result.winner === 2 ? 1 : 0),
      },
      roundResults: [...state.roundResults, result],
    }
  }
  return state
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROLL_DICE': {
      const player = action.player === 1 ? state.player1 : state.player2
      if (player.rollsLeft <= 0 || state.phase !== 'playing') return state

      const newDice = player.dice.map((d, i) =>
        player.frozen[i] ? d : Math.floor(Math.random() * 6) + 1
      )
      const updated = { ...player, dice: newDice, rollsLeft: player.rollsLeft - 1 }

      const newState = action.player === 1
        ? { ...state, player1: updated }
        : { ...state, player2: updated }

      return resolveRoundEnd(newState)
    }

    case 'TOGGLE_FREEZE': {
      const player = action.player === 1 ? state.player1 : state.player2
      if (player.rollsLeft >= 3 || player.rollsLeft <= 0 || state.phase !== 'playing') return state

      const newFrozen = [...player.frozen]
      newFrozen[action.index] = !newFrozen[action.index]
      const updated = { ...player, frozen: newFrozen }

      return action.player === 1
        ? { ...state, player1: updated }
        : { ...state, player2: updated }
    }

    case 'LOCK_IN': {
      const player = action.player === 1 ? state.player1 : state.player2
      if (player.rollsLeft >= 3 || player.rollsLeft <= 0 || state.phase !== 'playing') return state

      const updated = { ...player, rollsLeft: 0 }
      const newState = action.player === 1
        ? { ...state, player1: updated }
        : { ...state, player2: updated }

      return resolveRoundEnd(newState)
    }

    case 'NEXT_ROUND': {
      if (state.currentRound >= state.totalRounds) {
        return {
          ...state,
          phase: 'gameEnd',
          gameWinner: getGameWinner(state.player1.roundsWon, state.player2.roundsWon),
        }
      }

      return {
        ...state,
        phase: 'playing',
        currentRound: state.currentRound + 1,
        player1: {
          ...createPlayerState(state.diceCount),
          roundsWon: state.player1.roundsWon,
        },
        player2: {
          ...createPlayerState(state.diceCount),
          roundsWon: state.player2.roundsWon,
        },
      }
    }

    case 'RESET_GAME':
      return createInitialState(action.diceCount, action.roundCount)

    default:
      return state
  }
}

export function useGameState(settings: Settings) {
  const [state, dispatch] = useReducer(
    gameReducer,
    { diceCount: settings.diceCount, roundCount: settings.roundCount },
    ({ diceCount, roundCount }) => createInitialState(diceCount, roundCount)
  )

  const resetGame = useCallback(() => {
    dispatch({
      type: 'RESET_GAME',
      diceCount: settings.diceCount,
      roundCount: settings.roundCount,
    })
  }, [settings.diceCount, settings.roundCount])

  return { state, dispatch, resetGame }
}
