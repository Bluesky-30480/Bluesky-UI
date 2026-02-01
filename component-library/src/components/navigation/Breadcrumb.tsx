import React from 'react'
import { cn } from '../../utils/cn'

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {}

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)} {...props} />
  )
}

export interface BreadcrumbListProps extends React.HTMLAttributes<HTMLOListElement> {}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-2 text-sm', className)} {...props} />
  )
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return <li className={cn('inline-flex items-center', className)} {...props} />
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isCurrent?: boolean
}

export function BreadcrumbLink({
  isCurrent = false,
  className,
  ...props
}: BreadcrumbLinkProps) {
  return (
    <a
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(
        'transition-colors',
        isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground',
        className
      )}
      {...props}
    />
  )
}

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLLIElement> {}

export function BreadcrumbSeparator({ className, ...props }: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  )
}
