import React from 'react'
import { cn } from '../../utils/cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizeMap: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
}

const statusMap = {
  online: 'bg-success',
  offline: 'bg-muted',
  busy: 'bg-error',
  away: 'bg-warning',
}

const getInitials = (name?: string) => {
  if (!name) return ''
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

export function Avatar({ src, alt, name, size = 'md', status, className, ...props }: AvatarProps) {
  const initials = getInitials(name || alt)

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-muted text-foreground font-semibold overflow-hidden',
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface',
            statusMap[status]
          )}
        />
      )}
    </div>
  )
}
