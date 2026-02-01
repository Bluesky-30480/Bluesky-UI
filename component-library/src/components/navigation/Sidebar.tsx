import React from 'react'
import { cn } from '../../utils/cn'

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <aside
      className={cn('flex h-full w-full flex-col gap-4 bg-surface p-4', className)}
      {...props}
    />
  )
}

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return <div className={cn('flex items-center justify-between', className)} {...props} />
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

export function SidebarSection({ title, className, children, ...props }: SidebarSectionProps) {
  return (
    <section className={cn('space-y-2', className)} {...props}>
      {title && <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>}
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  )
}

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

export function SidebarItem({ active = false, className, ...props }: SidebarItemProps) {
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

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return <div className={cn('mt-auto', className)} {...props} />
}
