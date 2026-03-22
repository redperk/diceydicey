import { useState, useCallback, useEffect, useRef } from 'react'

export function useTimer(duration: number, onComplete: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const onCompleteRef = useRef(onComplete)

  onCompleteRef.current = onComplete

  const start = useCallback(() => {
    setSecondsLeft(duration)
    setIsRunning(true)
    setIsActive(true)
  }, [duration])

  const pause = useCallback(() => setIsRunning(false), [])
  const resume = useCallback(() => setIsRunning(true), [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsActive(false)
    setSecondsLeft(duration)
  }, [duration])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          onCompleteRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  return { secondsLeft, isRunning, isActive, start, pause, resume, reset }
}
