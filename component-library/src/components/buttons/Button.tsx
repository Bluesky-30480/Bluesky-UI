import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
  loadingText?: string
  isFullWidth?: boolean
  isDisabled?: boolean
  /** Enable glow effect - uses theme's glow tokens */
  glow?: boolean | 'sm' | 'md' | 'lg'
  /** Enable gradient background - uses theme's gradient tokens */
  gradient?: boolean
}

const sizeStyles = {
  xs: 'h-6 px-2 text-xs gap-1',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-8 text-lg gap-3',
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
  link: {
    primary: 'text-primary hover:underline p-0 h-auto',
    secondary: 'text-secondary-foreground hover:underline p-0 h-auto',
    success: 'text-success hover:underline p-0 h-auto',
    warning: 'text-warning hover:underline p-0 h-auto',
    error: 'text-error hover:underline p-0 h-auto',
    neutral: 'text-foreground hover:underline p-0 h-auto',
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      colorScheme = 'primary',
      leftIcon,
      rightIcon,
      isLoading = false,
      loadingText,
      isFullWidth = false,
      isDisabled,
      glow,
      gradient,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = isDisabled || disabled || isLoading

    // Determine glow class based on prop value
    const glowClass = glow === true ? 'glow-primary' 
      : glow === 'sm' ? 'glow-sm'
      : glow === 'md' ? 'glow-md'
      : glow === 'lg' ? 'glow-lg'
      : ''

    return (
      <button
        ref={ref}
        disabled={isButtonDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-md',
          'transition-all duration-200',
          'transition-transform active:scale-[0.98] active:translate-y-[1px] motion-reduce:transform-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Size styles
          sizeStyles[size],
          // Variant + color scheme styles
          variantStyles[variant][colorScheme],
          // Full width
          isFullWidth && 'w-full',
          // Glow effect (uses theme tokens)
          glowClass,
          // Gradient background (uses theme tokens)
          gradient && variant === 'solid' && 'bg-gradient-primary',
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {isLoading && loadingText ? loadingText : children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
