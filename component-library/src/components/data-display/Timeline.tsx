import React from 'react'
import { cn } from '../../utils/cn'

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Timeline({ className, ...props }: TimelineProps) {
  return <div className={cn('space-y-4', className)} {...props} />
}

export interface TimelineItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  timestamp?: React.ReactNode
}

export function TimelineItem({ title, description, timestamp, className, ...props }: TimelineItemProps) {
  return (
    <div className={cn('flex gap-3', className)} {...props}>
      <div className="flex flex-col items-center">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="mt-2 h-full w-px bg-border" />
      </div>
      <div className="pb-4">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
        {timestamp && <div className="text-xs text-muted-foreground mt-1">{timestamp}</div>}
      </div>
    </div>
  )
}
