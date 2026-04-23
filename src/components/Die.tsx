interface DieProps {
  value: number
  frozen: boolean
  highlighted: boolean
  rolling: boolean
  disabled: boolean
  playerNum: 1 | 2
  size: number
  index: number
  onToggleFreeze: () => void
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[72, 28], [28, 72]],
  3: [[72, 28], [50, 50], [28, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 28], [28, 50], [28, 72], [72, 28], [72, 50], [72, 72]],
}

const STAGGER_OFFSETS = [0, 40, 80, 25, 65, 100, 15, 55, 90, 35]

export function Die({ value, frozen, highlighted, rolling, disabled, playerNum, size, index, onToggleFreeze }: DieProps) {
  if (value === 0 && !rolling) {
    return <div className="die empty" style={{ width: size, height: size }} />
  }

  const dots = DOT_POSITIONS[value] || []
  const classes = [
    'die',
    (frozen || highlighted) ? `frozen-p${playerNum}` : '',
    rolling ? 'rolling' : '',
    disabled ? 'disabled' : '',
  ].filter(Boolean).join(' ')

  const stagger = STAGGER_OFFSETS[index % STAGGER_OFFSETS.length]

  return (
    <div
      className={classes}
      style={{
        width: size,
        height: size,
        animationDelay: rolling ? `${stagger}ms` : undefined,
      }}
      onClick={disabled ? undefined : onToggleFreeze}
    >
      {dots.map(([x, y], i) => (
        <div
          key={i}
          className="die-dot"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  )
}
