import { describe, it, expect } from 'vitest'
import { getBestGroup, getRoundWinner } from '../utils/gameLogic'

describe('getBestGroup', () => {
  it('returns the number with the highest count', () => {
    const result = getBestGroup([3, 3, 3, 1, 2, 4])
    expect(result).toEqual({ value: 3, count: 3 })
  })

  it('breaks ties by higher value', () => {
    const result = getBestGroup([2, 2, 5, 5, 1, 4])
    expect(result).toEqual({ value: 5, count: 2 })
  })

  it('handles all same dice', () => {
    const result = getBestGroup([6, 6, 6, 6, 6, 6])
    expect(result).toEqual({ value: 6, count: 6 })
  })

  it('handles all unique dice', () => {
    const result = getBestGroup([1, 2, 3, 4, 5, 6])
    expect(result).toEqual({ value: 6, count: 1 })
  })

  it('works with fewer dice', () => {
    const result = getBestGroup([4, 4, 4, 4])
    expect(result).toEqual({ value: 4, count: 4 })
  })

  it('works with more dice', () => {
    const result = getBestGroup([1, 1, 1, 2, 2, 2, 2, 3, 3, 3])
    expect(result).toEqual({ value: 2, count: 4 })
  })
})

describe('getRoundWinner', () => {
  it('player with more of a kind wins', () => {
    const result = getRoundWinner(
      [3, 3, 3, 1, 2, 4],
      [5, 5, 1, 2, 3, 4]
    )
    expect(result.winner).toBe(1)
    expect(result.p1Best).toEqual({ value: 3, count: 3 })
    expect(result.p2Best).toEqual({ value: 5, count: 2 })
  })

  it('player 2 wins with higher count', () => {
    const result = getRoundWinner(
      [1, 2, 3, 4, 5, 6],
      [4, 4, 4, 1, 2, 3]
    )
    expect(result.winner).toBe(2)
  })

  it('same count, higher value wins', () => {
    const result = getRoundWinner(
      [2, 2, 2, 1, 3, 4],
      [5, 5, 5, 1, 3, 4]
    )
    expect(result.winner).toBe(2)
    expect(result.p1Best.count).toBe(3)
    expect(result.p2Best.count).toBe(3)
  })

  it('exact tie returns winner 0', () => {
    const result = getRoundWinner(
      [3, 3, 3, 1, 2, 4],
      [3, 3, 3, 5, 6, 1]
    )
    expect(result.winner).toBe(0)
  })

  it('tie on count, p1 higher value wins', () => {
    const result = getRoundWinner(
      [6, 6, 1, 2, 3, 4],
      [1, 1, 2, 3, 4, 5]
    )
    expect(result.winner).toBe(1)
  })
})
