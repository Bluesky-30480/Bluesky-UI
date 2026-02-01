import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../utils'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton */
  width?: string | number
  /** Height of the skeleton */
  height?: string | number
  /** Make it a circle */
  circle?: boolean
  /** Animation type */
  animation?: 'pulse' | 'shimmer' | 'none'
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      width,
      height,
      circle = false,
      animation = 'pulse',
      rounded = 'md',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const dimensions: React.CSSProperties = {
      width: circle ? height || width : width,
      height: height,
      ...style,
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted',
          circle ? 'rounded-full' : roundedStyles[rounded],
          animation === 'pulse' && 'animate-pulse',
          animation === 'shimmer' && 'skeleton-shimmer',
          className
        )}
        style={dimensions}
        aria-hidden="true"
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Pre-built skeleton patterns
export interface SkeletonTextProps extends Omit<SkeletonProps, 'height'> {
  /** Number of lines */
  lines?: number
  /** Gap between lines */
  gap?: 'sm' | 'md' | 'lg'
  /** Last line width percentage */
  lastLineWidth?: string | number
}

const gapStyles = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    {
      lines = 3,
      gap = 'md',
      lastLineWidth = '70%',
      width = '100%',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('flex flex-col', gapStyles[gap], className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            width={index === lines - 1 ? lastLineWidth : width}
            height="1em"
            {...props}
          />
        ))}
      </div>
    )
  }
)

SkeletonText.displayName = 'SkeletonText'

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'circle' | 'width' | 'height'> {
  /** Size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const avatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
}

export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = 'md', ...props }, ref) => {
    const dimension = avatarSizes[size]
    return (
      <Skeleton
        ref={ref}
        width={dimension}
        height={dimension}
        circle
        {...props}
      />
    )
  }
)

SkeletonAvatar.displayName = 'SkeletonAvatar'
