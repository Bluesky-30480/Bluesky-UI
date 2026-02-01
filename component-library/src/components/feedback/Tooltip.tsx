import { forwardRef, HTMLAttributes, ReactNode, useState, useRef, useEffect } from 'react'
import { cn } from '../../utils'
import { Portal } from '../primitives'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Tooltip content */
  content: ReactNode
  /** Placement of the tooltip */
  placement?: TooltipPlacement
  /** Delay before showing (ms) */
  delay?: number
  /** Whether tooltip is disabled */
  disabled?: boolean
  /** Arrow visibility */
  arrow?: boolean
  /** Max width of tooltip */
  maxWidth?: number | string
}

// Note: placementStyles is kept for potential CSS-only positioning fallback
const _placementStyles: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}
void _placementStyles

const arrowStyles: Record<TooltipPlacement, string> = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
  bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
  left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45',
  right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45',
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      placement = 'top',
      delay = 200,
      disabled = false,
      arrow = true,
      maxWidth = 250,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const triggerRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<number>()

    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.right + 8
          break
      }

      // Keep tooltip in viewport
      const padding = 8
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding))
      top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding))

      setPosition({ top, left })
    }

    useEffect(() => {
      if (isVisible) {
        updatePosition()
      }
    }, [isVisible, placement])

    const handleMouseEnter = () => {
      if (disabled) return
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(true)
      }, delay)
    }

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }

    const handleFocus = () => {
      if (disabled) return
      setIsVisible(true)
    }

    const handleBlur = () => {
      setIsVisible(false)
    }

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        {...props}
      >
        <div
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {children}
        </div>

        {isVisible && (
          <Portal>
            <div
              ref={tooltipRef}
              role="tooltip"
              className={cn(
                'fixed z-50 px-3 py-1.5 text-sm rounded-md shadow-md',
                'bg-foreground text-background',
                'animate-in fade-in-0 zoom-in-95 duration-150'
              )}
              style={{
                top: position.top,
                left: position.left,
                maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
              }}
            >
              {content}
              {arrow && (
                <div
                  className={cn(
                    'absolute w-2 h-2 bg-foreground',
                    arrowStyles[placement]
                  )}
                />
              )}
            </div>
          </Portal>
        )}
      </div>
    )
  }
)

Tooltip.displayName = 'Tooltip'
