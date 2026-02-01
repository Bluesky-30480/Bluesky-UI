import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../utils'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerVariant = 'default' | 'primary' | 'secondary' | 'white'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: SpinnerSize
  /** Spinner color variant */
  variant?: SpinnerVariant
  /** Custom label for screen readers */
  label?: string
  /** Show the label visually */
  showLabel?: boolean
}

const sizeStyles: Record<SpinnerSize, { spinner: string; border: string; label: string }> = {
  xs: {
    spinner: 'h-3 w-3',
    border: 'border-[1.5px]',
    label: 'text-xs',
  },
  sm: {
    spinner: 'h-4 w-4',
    border: 'border-2',
    label: 'text-xs',
  },
  md: {
    spinner: 'h-6 w-6',
    border: 'border-2',
    label: 'text-sm',
  },
  lg: {
    spinner: 'h-8 w-8',
    border: 'border-[2.5px]',
    label: 'text-sm',
  },
  xl: {
    spinner: 'h-12 w-12',
    border: 'border-[3px]',
    label: 'text-base',
  },
}

const variantStyles: Record<SpinnerVariant, string> = {
  default: 'border-muted-foreground/30 border-t-foreground',
  primary: 'border-primary/30 border-t-primary',
  secondary: 'border-secondary/30 border-t-secondary',
  white: 'border-white/30 border-t-white',
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'default',
      label = 'Loading',
      showLabel = false,
      className,
      ...props
    },
    ref
  ) => {
    const sizes = sizeStyles[size]

    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          'inline-flex items-center gap-2',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'rounded-full animate-spin',
            sizes.spinner,
            sizes.border,
            variantStyles[variant]
          )}
        />
        {showLabel ? (
          <span className={cn('text-muted-foreground', sizes.label)}>
            {label}
          </span>
        ) : (
          <span className="sr-only">{label}</span>
        )}
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'
