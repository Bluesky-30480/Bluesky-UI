import React from 'react'
import { cn } from '../../utils/cn'

export interface NavMenuProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical'
}

export function NavMenu({ orientation = 'vertical', className, ...props }: NavMenuProps) {
  return (
    <nav
      className={cn(
        orientation === 'vertical' ? 'flex flex-col gap-1' : 'flex flex-row gap-2',
        className
      )}
      {...props}
    />
  )
}

export interface NavMenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

export function NavMenuItem({ active = false, className, ...props }: NavMenuItemProps) {
  return (
    <a
      className={cn(
        'rounded-md px-3 py-2 text-sm transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted',
        className
      )}
      {...props}
    />
  )
}
