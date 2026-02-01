import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../utils/cn'
import { Portal } from '../primitives'

export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end'

interface PopoverContextValue {
  isOpen: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
  placement: PopoverPlacement
  offset: number
  closeOnEscape: boolean
  closeOnOutsideClick: boolean
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

export interface PopoverProps {
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: PopoverPlacement
  offset?: number
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  children: React.ReactNode
}

export function Popover({
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  offset = 8,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  children,
}: PopoverProps) {
  const isControlled = isOpenProp !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? !!isOpenProp : internalOpen
  const triggerRef = useRef<HTMLElement>(null)

  const setOpen = (open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open)
    }
    onOpenChange?.(open)
  }

  const value = useMemo(
    () => ({
      isOpen,
      setOpen,
      triggerRef,
      placement,
      offset,
      closeOnEscape,
      closeOnOutsideClick,
    }),
    [isOpen, placement, offset, closeOnEscape, closeOnOutsideClick]
  )

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
}

export interface PopoverTriggerProps {
  children: React.ReactElement
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const context = usePopoverContext('PopoverTrigger')
  const child = children as React.ReactElement & { ref?: React.Ref<HTMLElement> }

  return React.cloneElement(child, {
    ref: mergeRefs(child.ref, context.triggerRef),
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event)
      context.setOpen(!context.isOpen)
    },
    'aria-expanded': context.isOpen,
    'aria-haspopup': 'dialog',
  })
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PopoverContent({ className, children, style, ...props }: PopoverContentProps) {
  const context = usePopoverContext('PopoverContent')
  const contentRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!context.isOpen) return
    const trigger = context.triggerRef.current
    const content = contentRef.current
    if (!trigger || !content) return

    const triggerRect = trigger.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const { top, left } = getPopoverPosition(
      context.placement,
      triggerRect,
      contentRect,
      context.offset
    )

    setPosition(clampToViewport(top, left, contentRect))
  }, [context.isOpen, context.placement, context.offset])

  useEffect(() => {
    if (!context.isOpen) return
    const updatePosition = () => {
      const trigger = context.triggerRef.current
      const content = contentRef.current
      if (!trigger || !content) return
      const triggerRect = trigger.getBoundingClientRect()
      const contentRect = content.getBoundingClientRect()
      const { top, left } = getPopoverPosition(
        context.placement,
        triggerRect,
        contentRect,
        context.offset
      )
      setPosition(clampToViewport(top, left, contentRect))
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [context.isOpen, context.placement, context.offset])

  useEffect(() => {
    if (!context.isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (context.closeOnEscape && event.key === 'Escape') {
        context.setOpen(false)
      }
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!context.closeOnOutsideClick) return
      const target = event.target as Node
      if (contentRef.current?.contains(target)) return
      if (context.triggerRef.current?.contains(target)) return
      context.setOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [context])

  if (!context.isOpen) return null

  return (
    <Portal>
      <div
        ref={contentRef}
        className={cn(
          'z-50 rounded-md border border-border bg-surface shadow-lg',
          'animate-in fade-in-0 zoom-in-95 duration-150',
          className
        )}
        style={{
          position: 'fixed',
          top: position?.top ?? -9999,
          left: position?.left ?? -9999,
          ...style,
        }}
        role="dialog"
        {...props}
      >
        {children}
      </div>
    </Portal>
  )
}

const usePopoverContext = (component: string) => {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error(`${component} must be used within Popover`)
  }
  return context
}

const mergeRefs = <T,>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref && typeof ref === 'object') {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}

const clampToViewport = (
  top: number,
  left: number,
  contentRect: DOMRect,
  margin = 8
) => {
  const maxLeft = window.innerWidth - contentRect.width - margin
  const maxTop = window.innerHeight - contentRect.height - margin
  return {
    left: Math.min(Math.max(margin, left), Math.max(margin, maxLeft)),
    top: Math.min(Math.max(margin, top), Math.max(margin, maxTop)),
  }
}

const getPopoverPosition = (
  placement: PopoverPlacement,
  triggerRect: DOMRect,
  contentRect: DOMRect,
  offset: number
) => {
  const centerX = triggerRect.left + triggerRect.width / 2
  const centerY = triggerRect.top + triggerRect.height / 2

  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top - contentRect.height - offset,
        left: centerX - contentRect.width / 2,
      }
    case 'bottom':
      return {
        top: triggerRect.bottom + offset,
        left: centerX - contentRect.width / 2,
      }
    case 'left':
      return {
        top: centerY - contentRect.height / 2,
        left: triggerRect.left - contentRect.width - offset,
      }
    case 'right':
      return {
        top: centerY - contentRect.height / 2,
        left: triggerRect.right + offset,
      }
    case 'top-start':
      return {
        top: triggerRect.top - contentRect.height - offset,
        left: triggerRect.left,
      }
    case 'top-end':
      return {
        top: triggerRect.top - contentRect.height - offset,
        left: triggerRect.right - contentRect.width,
      }
    case 'bottom-start':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left,
      }
    case 'bottom-end':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.right - contentRect.width,
      }
    case 'left-start':
      return {
        top: triggerRect.top,
        left: triggerRect.left - contentRect.width - offset,
      }
    case 'left-end':
      return {
        top: triggerRect.bottom - contentRect.height,
        left: triggerRect.left - contentRect.width - offset,
      }
    case 'right-start':
      return {
        top: triggerRect.top,
        left: triggerRect.right + offset,
      }
    case 'right-end':
      return {
        top: triggerRect.bottom - contentRect.height,
        left: triggerRect.right + offset,
      }
    default:
      return {
        top: triggerRect.bottom + offset,
        left: centerX - contentRect.width / 2,
      }
  }
}
