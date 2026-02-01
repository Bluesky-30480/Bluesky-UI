import React from 'react'
import { cn } from '../../utils/cn'

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function AvatarGroup({ max = 4, size = 'md', className, children, ...props }: AvatarGroupProps) {
  const childArray = React.Children.toArray(children)
  const visible = childArray.slice(0, max)
  const hiddenCount = childArray.length - visible.length

  return (
    <div className={cn('flex items-center', className)} {...props}>
      {visible.map((child, index) => (
        <div key={index} className={cn('-ml-2 first:ml-0')}>
          {React.isValidElement(child)
            ? React.cloneElement(child, { size, className: cn(child.props.className, 'ring-2 ring-surface') })
            : child}
        </div>
      ))}
      {hiddenCount > 0 && (
        <div
          className={cn(
            '-ml-2 inline-flex items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground ring-2 ring-surface',
            size === 'xs' && 'h-6 w-6',
            size === 'sm' && 'h-8 w-8',
            size === 'md' && 'h-10 w-10',
            size === 'lg' && 'h-12 w-12',
            size === 'xl' && 'h-16 w-16'
          )}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  )
}
