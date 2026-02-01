import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils'

export type TextareaSize = 'sm' | 'md' | 'lg'
export type TextareaVariant = 'default' | 'filled' | 'ghost'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Textarea size */
  size?: TextareaSize
  /** Textarea variant style */
  variant?: TextareaVariant
  /** Whether textarea has an error state */
  error?: boolean
  /** Full width textarea */
  fullWidth?: boolean
  /** Resize behavior */
  resize?: TextareaResize
  /** Minimum number of rows */
  minRows?: number
  /** Maximum number of rows */
  maxRows?: number
  /** Additional class names */
  className?: string
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: 'text-sm px-2.5 py-2',
  md: 'text-sm px-3 py-2.5',
  lg: 'text-base px-4 py-3',
}

const variantStyles: Record<TextareaVariant, string> = {
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

const resizeStyles: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      variant = 'default',
      error = false,
      fullWidth = false,
      resize = 'vertical',
      minRows = 3,
      maxRows,
      disabled,
      className,
      rows,
      style,
      ...props
    },
    ref
  ) => {
    // Calculate height based on rows
    const effectiveRows = rows ?? minRows
    
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        rows={effectiveRows}
        style={{
          ...style,
          minHeight: minRows ? `${minRows * 1.5}em` : undefined,
          maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined,
        }}
        className={cn(
          // Base styles
          'rounded-md transition-colors duration-150',
          'placeholder:text-muted-foreground/60',
          'focus:outline-none',
          // Size
          sizeStyles[size],
          // Variant
          variantStyles[variant],
          // Resize
          resizeStyles[resize],
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

Textarea.displayName = 'Textarea'
