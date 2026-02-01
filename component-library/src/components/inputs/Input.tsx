import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'default' | 'filled' | 'ghost'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size */
  size?: InputSize
  /** Input variant style */
  variant?: InputVariant
  /** Whether input has an error state */
  error?: boolean
  /** Icon or element to show at the start of input */
  leftElement?: ReactNode
  /** Icon or element to show at the end of input */
  rightElement?: ReactNode
  /** Full width input */
  fullWidth?: boolean
  /** Additional class names */
  className?: string
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4',
}

const variantStyles: Record<InputVariant, string> = {
  default: `
    bg-background border border-border
    hover:border-muted-foreground/50
    focus:border-primary focus:ring-2 focus:ring-primary/20
  `,
  filled: `
    bg-muted border border-transparent
    hover:bg-muted/80
    focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20
  `,
  ghost: `
    bg-transparent border border-transparent
    hover:bg-muted/50
    focus:bg-muted/30 focus:border-border
  `,
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      error = false,
      leftElement,
      rightElement,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const hasLeftElement = Boolean(leftElement)
    const hasRightElement = Boolean(rightElement)

    // Wrapper is needed when we have icons/elements
    if (hasLeftElement || hasRightElement) {
      return (
        <div
          className={cn(
            'relative inline-flex items-center',
            fullWidth && 'w-full',
            className
          )}
        >
          {/* Left element */}
          {leftElement && (
            <div className="absolute left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full rounded-md transition-colors duration-150',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none',
              // Size
              sizeStyles[size],
              // Variant
              variantStyles[variant],
              // Error state
              error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              // Disabled state
              disabled && 'opacity-50 cursor-not-allowed',
              // Padding adjustments for elements
              hasLeftElement && 'pl-10',
              hasRightElement && 'pr-10',
            )}
            {...props}
          />

          {/* Right element */}
          {rightElement && (
            <div className="absolute right-0 pr-3 flex items-center text-muted-foreground">
              {rightElement}
            </div>
          )}
        </div>
      )
    }

    // Simple input without wrapper
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'rounded-md transition-colors duration-150',
          'placeholder:text-muted-foreground/60',
          'focus:outline-none',
          // Size
          sizeStyles[size],
          // Variant
          variantStyles[variant],
          // Width
          fullWidth ? 'w-full' : 'w-auto',
          // Error state
          error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
