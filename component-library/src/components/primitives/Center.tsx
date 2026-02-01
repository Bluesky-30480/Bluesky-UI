import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  inline?: boolean
  centerText?: boolean
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ inline = false, centerText = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          inline ? 'inline-flex' : 'flex',
          'items-center justify-center',
          centerText && 'text-center',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Center.displayName = 'Center'
