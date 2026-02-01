import { forwardRef, useRef, useState, useEffect, useCallback, useImperativeHandle, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type ScrollAxis = 'y' | 'x' | 'both'

export interface ScrollAreaHandle {
  /** Scroll to a specific position */
  scrollTo: (options: { x?: number; y?: number; behavior?: ScrollBehavior }) => void
  /** Scroll to top */
  scrollToTop: (behavior?: ScrollBehavior) => void
  /** Scroll to bottom */
  scrollToBottom: (behavior?: ScrollBehavior) => void
  /** Scroll to left */
  scrollToLeft: (behavior?: ScrollBehavior) => void
  /** Scroll to right */
  scrollToRight: (behavior?: ScrollBehavior) => void
  /** Get current scroll position */
  getScrollPosition: () => { x: number; y: number }
  /** Get the viewport element */
  getViewport: () => HTMLDivElement | null
}

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onScroll'> {
  height?: number | string
  maxHeight?: number | string
  width?: number | string
  maxWidth?: number | string
  axis?: ScrollAxis
  viewportClassName?: string
  /** Show custom styled scrollbar */
  customScrollbar?: boolean
  /** Show shadow at edges when scrolled */
  showShadows?: boolean
  /** Scrollbar size (thin, normal, thick) */
  scrollbarSize?: 'thin' | 'normal' | 'thick'
  /** Hide scrollbar until hover */
  hideScrollbarUntilHover?: boolean
  /** Callback when scroll position changes */
  onScroll?: (position: { x: number; y: number }) => void
}

const resolveSize = (value?: number | string) => {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

const scrollbarSizeMap = {
  thin: 'scrollbar-thin',
  normal: 'scrollbar-normal',
  thick: 'scrollbar-thick',
}

export const ScrollArea = forwardRef<ScrollAreaHandle, ScrollAreaProps>(
  (
    {
      height,
      maxHeight,
      width,
      maxWidth,
      axis = 'y',
      viewportClassName,
      customScrollbar = true,
      showShadows = false,
      scrollbarSize = 'thin',
      hideScrollbarUntilHover = false,
      onScroll,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const viewportRef = useRef<HTMLDivElement>(null)
    const [shadows, setShadows] = useState({ top: false, bottom: false, left: false, right: false })
    
    // Expose scroll methods via ref
    useImperativeHandle(ref, () => ({
      scrollTo: ({ x, y, behavior = 'smooth' }) => {
        viewportRef.current?.scrollTo({ left: x, top: y, behavior })
      },
      scrollToTop: (behavior = 'smooth') => {
        viewportRef.current?.scrollTo({ top: 0, behavior })
      },
      scrollToBottom: (behavior = 'smooth') => {
        if (viewportRef.current) {
          viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior })
        }
      },
      scrollToLeft: (behavior = 'smooth') => {
        viewportRef.current?.scrollTo({ left: 0, behavior })
      },
      scrollToRight: (behavior = 'smooth') => {
        if (viewportRef.current) {
          viewportRef.current.scrollTo({ left: viewportRef.current.scrollWidth, behavior })
        }
      },
      getScrollPosition: () => ({
        x: viewportRef.current?.scrollLeft ?? 0,
        y: viewportRef.current?.scrollTop ?? 0,
      }),
      getViewport: () => viewportRef.current,
    }), [])
    
    // Update shadows based on scroll position
    const updateShadows = useCallback(() => {
      if (!showShadows || !viewportRef.current) return
      
      const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = viewportRef.current
      
      setShadows({
        top: scrollTop > 0,
        bottom: scrollTop < scrollHeight - clientHeight - 1,
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1,
      })
    }, [showShadows])
    
    // Handle scroll events
    const handleScroll = useCallback(() => {
      updateShadows()
      if (onScroll && viewportRef.current) {
        onScroll({
          x: viewportRef.current.scrollLeft,
          y: viewportRef.current.scrollTop,
        })
      }
    }, [updateShadows, onScroll])
    
    // Initial shadow update
    useEffect(() => {
      updateShadows()
    }, [updateShadows, children])

    const overflowClass =
      axis === 'x'
        ? 'overflow-x-auto overflow-y-hidden'
        : axis === 'both'
          ? 'overflow-auto'
          : 'overflow-y-auto overflow-x-hidden'

    const sizeStyle = {
      height: resolveSize(height),
      maxHeight: resolveSize(maxHeight),
      width: resolveSize(width),
      maxWidth: resolveSize(maxWidth),
    }

    return (
      <div 
        className={cn('relative group', className)} 
        style={{ ...sizeStyle, ...style }} 
        {...props}
      >
        {/* Scroll shadows */}
        {showShadows && (
          <>
            {(axis === 'y' || axis === 'both') && (
              <>
                <div className={cn(
                  'absolute top-0 left-0 right-0 h-4 pointer-events-none z-10 transition-opacity',
                  'bg-gradient-to-b from-background/80 to-transparent',
                  shadows.top ? 'opacity-100' : 'opacity-0'
                )} />
                <div className={cn(
                  'absolute bottom-0 left-0 right-0 h-4 pointer-events-none z-10 transition-opacity',
                  'bg-gradient-to-t from-background/80 to-transparent',
                  shadows.bottom ? 'opacity-100' : 'opacity-0'
                )} />
              </>
            )}
            {(axis === 'x' || axis === 'both') && (
              <>
                <div className={cn(
                  'absolute top-0 bottom-0 left-0 w-4 pointer-events-none z-10 transition-opacity',
                  'bg-gradient-to-r from-background/80 to-transparent',
                  shadows.left ? 'opacity-100' : 'opacity-0'
                )} />
                <div className={cn(
                  'absolute top-0 bottom-0 right-0 w-4 pointer-events-none z-10 transition-opacity',
                  'bg-gradient-to-l from-background/80 to-transparent',
                  shadows.right ? 'opacity-100' : 'opacity-0'
                )} />
              </>
            )}
          </>
        )}
        
        {/* Scrollable viewport */}
        <div 
          ref={viewportRef}
          onScroll={handleScroll}
          className={cn(
            'h-full w-full',
            overflowClass,
            customScrollbar && [
              scrollbarSizeMap[scrollbarSize],
              'scrollbar scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/50',
              'scrollbar-thumb-rounded-full',
            ],
            hideScrollbarUntilHover && 'scrollbar-opacity-0 group-hover:scrollbar-opacity-100',
            viewportClassName
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'
