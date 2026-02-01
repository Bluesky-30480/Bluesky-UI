import React from 'react'
import { cn } from '../../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable glow effect - uses theme's glow tokens */
  glow?: boolean | 'sm' | 'md' | 'lg'
  /** Use theme shadow tokens */
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  /** Enable gradient background */
  gradient?: boolean
}

export function Card({ className, glow, shadow, gradient, ...props }: CardProps) {
  const glowClass = glow === true ? 'glow-md' 
    : glow === 'sm' ? 'glow-sm'
    : glow === 'md' ? 'glow-md'
    : glow === 'lg' ? 'glow-lg'
    : ''
  
  const shadowClass = shadow === 'none' ? '' 
    : shadow === 'sm' ? 'shadow-theme-sm'
    : shadow === 'md' ? 'shadow-theme-md'
    : shadow === 'lg' ? 'shadow-theme-lg'
    : shadow === 'xl' ? 'shadow-theme-xl'
    : 'shadow-sm'

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface',
        shadowClass,
        glowClass,
        gradient && 'bg-gradient-surface',
        className
      )}
      {...props}
    />
  )
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn('px-6 py-4 border-b border-border', className)} {...props} />
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cn('text-lg font-semibold text-foreground', className)} {...props} />
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('px-6 py-4', className)} {...props} />
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn('px-6 py-4 border-t border-border', className)} {...props} />
}
