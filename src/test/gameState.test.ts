import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../hooks/useGameState'
import type { Settings } from '../hooks/useSettings'

const defaultSettings: Settings = {
  diceCount: 6,
  rollCount: 3,
  timerEnabled: true,
  timerDuration: 90,
  timerSound: 'platinum',
  p1Color: 'Purple',
  p2Color: 'Amber',
}

describe('useGameState', () => {
  it('initializes with correct state', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))
    const { state } = result.current

    expect(state.phase).toBe('playing')
    expect(state.diceCount).toBe(6)
    expect(state.totalRolls).toBe(3)
    expect(state.player1.dice).toHaveLength(6)
    expect(state.player1.dice.every(d => d === 0)).toBe(true)
    expect(state.player1.rollsLeft).toBe(3)
    expect(state.player2.rollsLeft).toBe(3)
    expect(state.result).toBeNull()
  })

  it('rolling dice decrements rollsLeft and sets dice values', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))

    act(() => {
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
    })

    expect(result.current.state.player1.rollsLeft).toBe(2)
    expect(result.current.state.player1.dice.every(d => d >= 1 && d <= 6)).toBe(true)
    expect(result.current.state.player2.rollsLeft).toBe(3)
  })

  it('frozen dice are preserved during roll', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))

    act(() => {
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
    })

    const firstRollDice = [...result.current.state.player1.dice]

    act(() => {
      result.current.dispatch({ type: 'TOGGLE_FREEZE', player: 1, index: 0 })
      result.current.dispatch({ type: 'TOGGLE_FREEZE', player: 1, index: 1 })
    })

    expect(result.current.state.player1.frozen[0]).toBe(true)
    expect(result.current.state.player1.frozen[1]).toBe(true)

    act(() => {
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
    })

    expect(result.current.state.player1.dice[0]).toBe(firstRollDice[0])
    expect(result.current.state.player1.dice[1]).toBe(firstRollDice[1])
    expect(result.current.state.player1.rollsLeft).toBe(1)
  })

  it('cannot freeze before first roll', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))

    act(() => {
      result.current.dispatch({ type: 'TOGGLE_FREEZE', player: 1, index: 0 })
    })

    expect(result.current.state.player1.frozen[0]).toBe(false)
  })

  it('cannot freeze when no rolls left', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))

    act(() => {
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
    })

    act(() => {
      result.current.dispatch({ type: 'TOGGLE_FREEZE', player: 1, index: 0 })
    })

    expect(result.current.state.player1.frozen[0]).toBe(false)
  })

  it('cannot roll more than totalRolls times', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
      }
    })

    expect(result.current.state.player1.rollsLeft).toBe(0)
  })

  it('game ends when both players use all rolls', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))

    act(() => {
      for (let i = 0; i < 3; i++) {
        result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
        result.current.dispatch({ type: 'ROLL_DICE', player: 2 })
      }
    })

    const phase = result.current.state.phase
    expect(phase === 'gameEnd' || phase === 'tiebreaker').toBe(true)
  })

  it('reset restores initial state', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))

    act(() => {
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
    })

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.state.phase).toBe('playing')
    expect(result.current.state.player1.rollsLeft).toBe(3)
    expect(result.current.state.player1.dice.every(d => d === 0)).toBe(true)
  })

  it('reset uses new settings values', () => {
    let settings = { ...defaultSettings }
    const { result, rerender } = renderHook(() => useGameState(settings))

    settings = { ...settings, diceCount: 8, rollCount: 5 }
    rerender()

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.state.diceCount).toBe(8)
    expect(result.current.state.totalRolls).toBe(5)
    expect(result.current.state.player1.dice).toHaveLength(8)
    expect(result.current.state.player1.rollsLeft).toBe(5)
  })

  it('rolling does not affect the other player', () => {
    const { result } = renderHook(() => useGameState(defaultSettings))

    act(() => {
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
    })

    expect(result.current.state.player2.dice.every(d => d === 0)).toBe(true)
    expect(result.current.state.player2.rollsLeft).toBe(3)
  })

  it('cannot roll during gameEnd', () => {
    const settings: Settings = { ...defaultSettings, rollCount: 1 }
    const { result } = renderHook(() => useGameState(settings))

    act(() => {
      result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
      result.current.dispatch({ type: 'ROLL_DICE', player: 2 })
    })

    const phase = result.current.state.phase
    if (phase === 'gameEnd') {
      const p1RollsBefore = result.current.state.player1.rollsLeft

      act(() => {
        result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
      })

      expect(result.current.state.player1.rollsLeft).toBe(p1RollsBefore)
    }
  })
})

describe('useGameState - tiebreaker', () => {
  it('tiebreaker preserves best-group dice and resets others', () => {
    const settings: Settings = { ...defaultSettings, rollCount: 1 }
    const { result } = renderHook(() => useGameState(settings))

    // Keep rolling until we get a tiebreaker (same count + same value)
    let attempts = 0
    while (attempts < 200) {
      act(() => result.current.resetGame())
      act(() => {
        result.current.dispatch({ type: 'ROLL_DICE', player: 1 })
        result.current.dispatch({ type: 'ROLL_DICE', player: 2 })
      })
      if (result.current.state.phase === 'tiebreaker') break
      attempts++
    }

    if (result.current.state.phase === 'tiebreaker') {
      expect(result.current.state.player1.rollsLeft).toBe(1)
      expect(result.current.state.player2.rollsLeft).toBe(1)

      const p1Frozen = result.current.state.player1.frozen
      const p1Dice = result.current.state.player1.dice
      for (let i = 0; i < p1Dice.length; i++) {
        if (p1Frozen[i]) {
          expect(p1Dice[i]).toBeGreaterThan(0)
        } else {
          expect(p1Dice[i]).toBe(0)
        }
      }
    }
  })
})
