import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { Portal } from '../primitives'

interface ContextMenuState {
  isOpen: boolean
  position: { x: number; y: number } | null
  setOpen: (open: boolean) => void
  setPosition: (position: { x: number; y: number } | null) => void
  closeOnSelect: boolean
}

const ContextMenuContext = createContext<ContextMenuState | null>(null)

export interface ContextMenuProps {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
  closeOnSelect?: boolean
}

export function ContextMenu({ children, onOpenChange, closeOnSelect = true }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  const setOpen = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
    if (!open) setPosition(null)
  }

  const value = useMemo(
    () => ({ isOpen, position, setOpen, setPosition, closeOnSelect }),
    [isOpen, position, closeOnSelect]
  )

  return <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>
}

export interface ContextMenuTriggerProps {
  children: React.ReactElement
}

export function ContextMenuTrigger({ children }: ContextMenuTriggerProps) {
  const context = useContextMenuContext('ContextMenuTrigger')

  return React.cloneElement(children, {
    onContextMenu: (event: React.MouseEvent) => {
      children.props.onContextMenu?.(event)
      event.preventDefault()
      context.setPosition({ x: event.clientX, y: event.clientY })
      context.setOpen(true)
    },
  })
}

export interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ContextMenuContent({ className, children, style, ...props }: ContextMenuContentProps) {
  const context = useContextMenuContext('ContextMenuContent')
  const contentRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!context.isOpen || !context.position || !contentRef.current) return
    const rect = contentRef.current.getBoundingClientRect()
    const margin = 8
    const left = Math.min(
      Math.max(margin, context.position.x),
      window.innerWidth - rect.width - margin
    )
    const top = Math.min(
      Math.max(margin, context.position.y),
      window.innerHeight - rect.height - margin
    )
    setPosition({ top, left })
  }, [context.isOpen, context.position])

  useEffect(() => {
    if (!context.isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') context.setOpen(false)
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (contentRef.current?.contains(target)) return
      context.setOpen(false)
    }

    const handleScroll = () => context.setOpen(false)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [context])

  if (!context.isOpen) return null

  return (
    <Portal>
      <div
        ref={contentRef}
        className={cn(
          'z-50 min-w-[180px] rounded-md border border-border bg-surface shadow-lg',
          'py-1 text-sm',
          className
        )}
        style={{
          position: 'fixed',
          top: position?.top ?? -9999,
          left: position?.left ?? -9999,
          ...style,
        }}
        role="menu"
        {...props}
      >
        {children}
      </div>
    </Portal>
  )
}

export interface ContextMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean
}

export function ContextMenuItem({ className, inset = false, onClick, ...props }: ContextMenuItemProps) {
  const context = useContextMenuContext('ContextMenuItem')

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center rounded-sm px-3 py-1.5 text-left text-foreground',
        'hover:bg-muted focus:bg-muted focus:outline-none',
        inset && 'pl-8',
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (context.closeOnSelect) context.setOpen(false)
      }}
      role="menuitem"
      {...props}
    />
  )
}

export function ContextMenuSeparator() {
  return <div className="my-1 h-px bg-border" role="separator" />
}

const useContextMenuContext = (component: string) => {
  const context = useContext(ContextMenuContext)
  if (!context) {
    throw new Error(`${component} must be used within ContextMenu`)
  }
  return context
}
