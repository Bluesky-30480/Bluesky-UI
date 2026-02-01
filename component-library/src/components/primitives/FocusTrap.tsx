import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type RefObject,
} from 'react'
import { cn } from '../../utils'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export interface FocusTrapProps extends HTMLAttributes<HTMLDivElement> {
  /** Enables or disables focus trapping */
  isEnabled?: boolean
  /** Automatically focus the first focusable element on mount */
  autoFocus?: boolean
  /** Restore focus to previously focused element on unmount */
  returnFocus?: boolean
  /** Optional ref to focus first when trap activates */
  initialFocusRef?: RefObject<HTMLElement>
}

export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>(
  (
    {
      isEnabled = true,
      autoFocus = true,
      returnFocus = true,
      initialFocusRef,
      className,
      onKeyDown,
      tabIndex,
      children,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [ref]
    )

    const getFocusableElements = useCallback(() => {
      const container = containerRef.current
      if (!container) return []
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      return nodes.filter((node) => !node.hasAttribute('disabled') && !node.getAttribute('aria-hidden'))
    }, [])

    const focusFirst = useCallback(() => {
      if (!isEnabled) return
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
        return
      }
      const focusables = getFocusableElements()
      if (focusables.length > 0) {
        focusables[0].focus()
      } else if (containerRef.current) {
        containerRef.current.focus()
      }
    }, [getFocusableElements, initialFocusRef, isEnabled])

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
        if (!isEnabled || event.defaultPrevented) return

        if (event.key !== 'Tab') return

        const container = containerRef.current
        if (!container) return

        const focusables = getFocusableElements()
        if (focusables.length === 0) {
          event.preventDefault()
          container.focus()
          return
        }

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null

        if (event.shiftKey) {
          if (!active || active === first || !container.contains(active)) {
            event.preventDefault()
            last.focus()
          }
        } else if (active === last) {
          event.preventDefault()
          first.focus()
        }
      },
      [getFocusableElements, isEnabled, onKeyDown]
    )

    useEffect(() => {
      if (!isEnabled) return
      previousFocusRef.current = document.activeElement as HTMLElement | null

      if (autoFocus) {
        requestAnimationFrame(() => focusFirst())
      }

      return () => {
        if (returnFocus) {
          previousFocusRef.current?.focus?.()
        }
      }
    }, [autoFocus, focusFirst, isEnabled, returnFocus])

    useEffect(() => {
      if (!isEnabled) return

      const handleFocusIn = (event: FocusEvent) => {
        const container = containerRef.current
        if (!container) return
        if (event.target instanceof HTMLElement && !container.contains(event.target)) {
          focusFirst()
        }
      }

      document.addEventListener('focusin', handleFocusIn)
      return () => document.removeEventListener('focusin', handleFocusIn)
    }, [focusFirst, isEnabled])

    return (
      <div
        ref={setRef}
        className={cn('outline-none', className)}
        onKeyDown={handleKeyDown}
        tabIndex={tabIndex ?? -1}
        {...props}
      >
        {children}
      </div>
    )
  }
)

FocusTrap.displayName = 'FocusTrap'
