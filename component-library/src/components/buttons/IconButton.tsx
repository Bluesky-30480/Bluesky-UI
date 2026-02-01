import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { VisuallyHidden } from '../primitives/VisuallyHidden'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  'aria-label': string
  variant?: 'solid' | 'outline' | 'ghost' | 'soft'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  isRounded?: boolean
  isLoading?: boolean
  isDisabled?: boolean
}

const sizeStyles = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-14 w-14 text-xl',
}

const variantStyles = {
  solid: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    success: 'bg-success text-white hover:bg-success/90',
    warning: 'bg-warning text-white hover:bg-warning/90',
    error: 'bg-error text-white hover:bg-error/90',
    neutral: 'bg-neutral-600 text-white hover:bg-neutral-700 dark:bg-neutral-400 dark:text-black',
  },
  outline: {
    primary: 'border-2 border-primary text-primary hover:bg-primary/10',
    secondary: 'border-2 border-secondary text-secondary-foreground hover:bg-secondary/10',
    success: 'border-2 border-success text-success hover:bg-success/10',
    warning: 'border-2 border-warning text-warning hover:bg-warning/10',
    error: 'border-2 border-error text-error hover:bg-error/10',
    neutral: 'border-2 border-border text-foreground hover:bg-muted',
  },
  ghost: {
    primary: 'text-primary hover:bg-primary/10',
    secondary: 'text-secondary-foreground hover:bg-secondary/50',
    success: 'text-success hover:bg-success/10',
    warning: 'text-warning hover:bg-warning/10',
    error: 'text-error hover:bg-error/10',
    neutral: 'text-foreground hover:bg-muted',
  },
  soft: {
    primary: 'bg-primary/10 text-primary hover:bg-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    success: 'bg-success/10 text-success hover:bg-success/20',
    warning: 'bg-warning/10 text-warning hover:bg-warning/20',
    error: 'bg-error/10 text-error hover:bg-error/20',
    neutral: 'bg-muted text-foreground hover:bg-muted/80',
  },
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      variant = 'ghost',
      size = 'md',
      colorScheme = 'neutral',
      isRounded = false,
      isLoading = false,
      isDisabled,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = isDisabled || disabled || isLoading

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={isButtonDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'transition-colors duration-200',
          'transition-transform active:scale-[0.98] active:translate-y-[1px] motion-reduce:transform-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Size styles
          sizeStyles[size],
          // Shape
          isRounded ? 'rounded-full' : 'rounded-md',
          // Variant + color scheme styles
          variantStyles[variant][colorScheme],
          className
        )}
        {...props}
      >
        <VisuallyHidden>{ariaLabel}</VisuallyHidden>
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
