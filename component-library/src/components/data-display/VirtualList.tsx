import React, { useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface VirtualListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Array of items to render */
  items: T[]
  /** Fixed height of each item in pixels */
  itemHeight: number
  /** Total height of the list container */
  height: number
  /** Function to render each item */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Number of items to render outside visible area (default: 3) */
  overscan?: number
  /** Key extractor for items (default: index) */
  getItemKey?: (item: T, index: number) => string | number
}

export interface VirtualListHandle {
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void
  scrollToTop: (behavior?: ScrollBehavior) => void
  scrollToBottom: (behavior?: ScrollBehavior) => void
  getScrollTop: () => number
}

function VirtualListInner<T>(
  { 
    items, 
    itemHeight, 
    height, 
    renderItem, 
    overscan = 3,
    getItemKey,
    className, 
    style, 
    onScroll,
    ...props 
  }: VirtualListProps<T>,
  ref: React.Ref<VirtualListHandle>
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  
  const totalHeight = items.length * itemHeight
  
  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(height / itemHeight) + 2 * overscan
  const endIndex = Math.min(items.length, startIndex + visibleCount)
  
  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex)
  
  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollTop(target.scrollTop)
    onScroll?.(e)
  }, [onScroll])
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number, behavior: ScrollBehavior = 'smooth') => {
      if (containerRef.current) {
        const top = index * itemHeight
        containerRef.current.scrollTo({ top, behavior })
      }
    },
    scrollToTop: (behavior: ScrollBehavior = 'smooth') => {
      containerRef.current?.scrollTo({ top: 0, behavior })
    },
    scrollToBottom: (behavior: ScrollBehavior = 'smooth') => {
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: totalHeight, behavior })
      }
    },
    getScrollTop: () => containerRef.current?.scrollTop ?? 0,
  }), [itemHeight, totalHeight])

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-y-auto scrollbar-thin', className)}
      style={{ height, ...style }}
      onScroll={handleScroll}
      {...props}
    >
      {/* Spacer for total scroll height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Rendered items positioned absolutely */}
        {visibleItems.map((item, i) => {
          const actualIndex = startIndex + i
          const key = getItemKey ? getItemKey(item, actualIndex) : actualIndex
          
          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
              className="flex items-center"
            >
              {renderItem(item, actualIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Forward ref with generic support
export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<VirtualListHandle> }
) => React.ReactElement

export type { VirtualListHandle as VirtualListRef }
