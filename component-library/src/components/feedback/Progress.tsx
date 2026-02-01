import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../utils'

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg'
export type ProgressVariant = 'default' | 'gradient' | 'striped'
export type ProgressColorScheme = 'primary' | 'success' | 'warning' | 'error' | 'info'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value?: number
  /** Maximum value */
  max?: number
  /** Progress size */
  size?: ProgressSize
  /** Progress style variant */
  variant?: ProgressVariant
  /** Color scheme */
  colorScheme?: ProgressColorScheme
  /** Show percentage label */
  showLabel?: boolean
  /** Indeterminate loading state */
  isIndeterminate?: boolean
  /** Label position */
  labelPosition?: 'inside' | 'outside' | 'top'
}

const sizeStyles: Record<ProgressSize, { track: string; label: string }> = {
  xs: { track: 'h-1', label: 'text-[10px]' },
  sm: { track: 'h-2', label: 'text-xs' },
  md: { track: 'h-3', label: 'text-xs' },
  lg: { track: 'h-4', label: 'text-sm' },
}

const colorStyles: Record<ProgressColorScheme, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
}

const gradientStyles: Record<ProgressColorScheme, string> = {
  primary: 'bg-gradient-to-r from-primary/70 to-primary',
  success: 'bg-gradient-to-r from-success/70 to-success',
  warning: 'bg-gradient-to-r from-warning/70 to-warning',
  error: 'bg-gradient-to-r from-error/70 to-error',
  info: 'bg-gradient-to-r from-info/70 to-info',
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 'md',
      variant = 'default',
      colorScheme = 'primary',
      showLabel = false,
      isIndeterminate = false,
      labelPosition = 'outside',
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const sizes = sizeStyles[size]

    const getBarStyles = () => {
      if (variant === 'gradient') return gradientStyles[colorScheme]
      return colorStyles[colorScheme]
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Top label */}
        {showLabel && labelPosition === 'top' && (
          <div className={cn('flex justify-between mb-1', sizes.label)}>
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{Math.round(percentage)}%</span>
          </div>
        )}

        {/* Track container */}
        <div className="flex items-center gap-2">
          {/* Track */}
          <div
            role="progressbar"
            aria-valuenow={isIndeterminate ? undefined : value}
            aria-valuemin={0}
            aria-valuemax={max}
            className={cn(
              'relative w-full overflow-hidden rounded-full bg-muted',
              sizes.track
            )}
          >
            {/* Progress bar */}
            <div
              className={cn(
                'h-full transition-all duration-300 ease-out rounded-full',
                getBarStyles(),
                variant === 'striped' && 'bg-stripes animate-stripes',
                isIndeterminate && 'animate-indeterminate w-1/3'
              )}
              style={{
                width: isIndeterminate ? undefined : `${percentage}%`,
              }}
            >
              {/* Inside label */}
              {showLabel && labelPosition === 'inside' && size !== 'xs' && size !== 'sm' && (
                <span className={cn(
                  'absolute inset-0 flex items-center justify-center text-white font-medium',
                  sizes.label
                )}>
                  {Math.round(percentage)}%
                </span>
              )}
            </div>
          </div>

          {/* Outside label */}
          {showLabel && labelPosition === 'outside' && !isIndeterminate && (
            <span className={cn('flex-shrink-0 text-foreground font-medium', sizes.label)}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'
