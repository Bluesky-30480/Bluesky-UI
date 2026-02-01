import React from 'react'
import { cn } from '../../utils/cn'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {}

export function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('w-full', className)}
      {...props}
    />
  )
}

export interface PaginationContentProps extends React.HTMLAttributes<HTMLUListElement> {}

export function PaginationContent({ className, ...props }: PaginationContentProps) {
  return (
    <ul className={cn('flex items-center gap-2 text-sm', className)} {...props} />
  )
}

export interface PaginationItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export function PaginationItem({ className, ...props }: PaginationItemProps) {
  return <li className={cn('inline-flex', className)} {...props} />
}

export interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean
}

export function PaginationLink({ isActive = false, className, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'px-3 py-1.5 rounded-md border border-border transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-surface text-foreground hover:bg-muted',
        className
      )}
      {...props}
    />
  )
}

export interface PaginationPreviousProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export function PaginationPrevious({ className, ...props }: PaginationPreviousProps) {
  return (
    <a
      aria-label="Go to previous page"
      className={cn('px-3 py-1.5 rounded-md border border-border bg-surface hover:bg-muted', className)}
      {...props}
    >
      Previous
    </a>
  )
}

export interface PaginationNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export function PaginationNext({ className, ...props }: PaginationNextProps) {
  return (
    <a
      aria-label="Go to next page"
      className={cn('px-3 py-1.5 rounded-md border border-border bg-surface hover:bg-muted', className)}
      {...props}
    >
      Next
    </a>
  )
}

export function PaginationEllipsis() {
  return <span className="px-2 text-muted-foreground">…</span>
}
