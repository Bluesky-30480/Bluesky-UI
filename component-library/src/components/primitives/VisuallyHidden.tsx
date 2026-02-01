import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
          '[clip:rect(0,0,0,0)]',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

VisuallyHidden.displayName = 'VisuallyHidden'
