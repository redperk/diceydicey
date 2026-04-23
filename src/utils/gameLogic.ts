export interface BestGroup {
  value: number
  count: number
}

export function getBestGroup(dice: number[]): BestGroup {
  const counts = new Map<number, number>()
  for (const d of dice) {
    counts.set(d, (counts.get(d) || 0) + 1)
  }

  let bestValue = 0
  let bestCount = 0

  for (const [value, count] of counts) {
    if (count > bestCount || (count === bestCount && value > bestValue)) {
      bestValue = value
      bestCount = count
    }
  }

  return { value: bestValue, count: bestCount }
}

export interface RoundResult {
  winner: 0 | 1 | 2
  p1Best: BestGroup
  p2Best: BestGroup
}

export function getRoundWinner(p1Dice: number[], p2Dice: number[]): RoundResult {
  const p1Best = getBestGroup(p1Dice)
  const p2Best = getBestGroup(p2Dice)

  let winner: 0 | 1 | 2
  if (p1Best.count > p2Best.count) {
    winner = 1
  } else if (p2Best.count > p1Best.count) {
    winner = 2
  } else if (p1Best.value > p2Best.value) {
    winner = 1
  } else if (p2Best.value > p1Best.value) {
    winner = 2
  } else {
    winner = 0
  }

  return { winner, p1Best, p2Best }
}

