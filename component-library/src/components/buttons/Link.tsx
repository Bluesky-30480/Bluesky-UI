import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type LinkVariant = 'primary' | 'neutral' | 'muted' | 'success' | 'warning' | 'error'

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant
  underline?: boolean
  isExternal?: boolean
}

const variantStyles: Record<LinkVariant, string> = {
  primary: 'text-primary hover:text-primary/90',
  neutral: 'text-foreground hover:text-foreground/80',
  muted: 'text-muted-foreground hover:text-foreground',
  success: 'text-success hover:text-success/90',
  warning: 'text-warning hover:text-warning/90',
  error: 'text-error hover:text-error/90',
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      variant = 'primary',
      underline = false,
      isExternal = false,
      className,
      target,
      rel,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedTarget = isExternal ? target ?? '_blank' : target
    const resolvedRel = isExternal ? rel ?? 'noopener noreferrer' : rel

    return (
      <a
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-medium transition-colors',
          underline ? 'underline underline-offset-4' : 'hover:underline underline-offset-4',
          variantStyles[variant],
          className
        )}
        target={resolvedTarget}
        rel={resolvedRel}
        {...props}
      >
        {children}
      </a>
    )
  }
)

Link.displayName = 'Link'
