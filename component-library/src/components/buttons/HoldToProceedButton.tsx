import { forwardRef, useEffect, useRef, useState } from 'react'
import { cn } from '../../utils'
import { Button, type ButtonProps } from './Button'

export interface HoldToProceedButtonProps extends Omit<ButtonProps, 'onClick' | 'isLoading'> {
  /** Time to hold in milliseconds */
  holdDuration?: number
  /** Called when the hold completes */
  onComplete: () => void
  /** Called when the hold is cancelled before completion */
  onCancel?: () => void
  /** Reset progress after completion */
  resetOnComplete?: boolean
  /** Show progress label */
  showProgress?: boolean
}

export const HoldToProceedButton = forwardRef<HTMLButtonElement, HoldToProceedButtonProps>(
  (
    {
      holdDuration = 1200,
      onComplete,
      onCancel,
      resetOnComplete = true,
      showProgress = true,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isHolding, setIsHolding] = useState(false)
    const [progress, setProgress] = useState(0)
    const frameRef = useRef<number | null>(null)
    const startRef = useRef<number | null>(null)
    const completedRef = useRef(false)

    const reset = () => {
      setIsHolding(false)
      setProgress(0)
      startRef.current = null
      completedRef.current = false
    }

    const tick = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const nextProgress = Math.min(elapsed / holdDuration, 1)
      setProgress(nextProgress)

      if (nextProgress >= 1 && !completedRef.current) {
        completedRef.current = true
        setIsHolding(false)
        onComplete()
        if (resetOnComplete) {
          setTimeout(() => reset(), 150)
        }
        return
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      if (disabled || completedRef.current) return
      setIsHolding(true)
      frameRef.current = requestAnimationFrame(tick)
    }

    const stop = (wasCancelled: boolean) => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      if (!completedRef.current) {
        setIsHolding(false)
        setProgress(0)
        startRef.current = null
        if (wasCancelled) onCancel?.()
      }
    }

    useEffect(() => {
      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current)
      }
    }, [])

    return (
      <Button
        ref={ref}
        className={cn('relative overflow-hidden select-none', className)}
        disabled={disabled}
        onPointerDown={(e) => {
          e.preventDefault()
          start()
        }}
        onPointerUp={() => stop(true)}
        onPointerLeave={() => stop(true)}
        onPointerCancel={() => stop(true)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            start()
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            stop(true)
          }
        }}
        {...props}
      >
        <span
          className={cn(
            'absolute inset-0 transition-[width] duration-75',
            'bg-foreground/10'
          )}
          style={{ width: `${Math.round(progress * 100)}%` }}
          aria-hidden="true"
        />
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
          {showProgress && (
            <span className="text-xs text-muted-foreground">
              {Math.round(progress * 100)}%
            </span>
          )}
        </span>
        {isHolding && (
          <span className="sr-only">Holding to confirm</span>
        )}
      </Button>
    )
  }
)

HoldToProceedButton.displayName = 'HoldToProceedButton'