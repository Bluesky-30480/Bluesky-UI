import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils'

export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'dot'
export type BadgeColorScheme = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge size */
  size?: BadgeSize
  /** Badge style variant */
  variant?: BadgeVariant
  /** Color scheme */
  colorScheme?: BadgeColorScheme
  /** Left icon or element */
  leftIcon?: ReactNode
  /** Right icon or element */
  rightIcon?: ReactNode
  /** Make it rounded/pill shaped */
  rounded?: boolean
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
  md: 'text-xs px-2 py-0.5 gap-1',
  lg: 'text-sm px-2.5 py-1 gap-1.5',
}

const variantColorStyles: Record<BadgeVariant, Record<BadgeColorScheme, string>> = {
  solid: {
    default: 'bg-foreground text-background',
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
  },
  soft: {
    default: 'bg-muted text-foreground',
    primary: 'bg-primary/15 text-primary',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    error: 'bg-error/15 text-error',
    info: 'bg-info/15 text-info',
  },
  outline: {
    default: 'border border-border text-foreground',
    primary: 'border border-primary text-primary',
    success: 'border border-success text-success',
    warning: 'border border-warning text-warning',
    error: 'border border-error text-error',
    info: 'border border-info text-info',
  },
  dot: {
    default: 'text-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
  },
}

const dotColorStyles: Record<BadgeColorScheme, string> = {
  default: 'bg-foreground',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      size = 'md',
      variant = 'soft',
      colorScheme = 'default',
      leftIcon,
      rightIcon,
      rounded = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium',
          sizeStyles[size],
          variantColorStyles[variant][colorScheme],
          rounded ? 'rounded-full' : 'rounded-md',
          className
        )}
        {...props}
      >
        {/* Dot indicator for dot variant */}
        {variant === 'dot' && (
          <span className={cn(
            'rounded-full',
            size === 'sm' ? 'h-1.5 w-1.5' : size === 'md' ? 'h-2 w-2' : 'h-2.5 w-2.5',
            dotColorStyles[colorScheme]
          )} />
        )}
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
