interface DieProps {
  value: number
  frozen: boolean
  rolling: boolean
  disabled: boolean
  playerNum: 1 | 2
  size: number
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

export function Die({ value, frozen, rolling, disabled, playerNum, size, onToggleFreeze }: DieProps) {
  if (value === 0) {
    return <div className="die empty" style={{ width: size, height: size }} />
  }

  const dots = DOT_POSITIONS[value] || []
  const classes = [
    'die',
    frozen ? `frozen-p${playerNum}` : '',
    rolling ? 'rolling' : '',
    disabled ? 'disabled' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      style={{ width: size, height: size }}
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
