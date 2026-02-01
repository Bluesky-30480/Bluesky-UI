import React from 'react'
import { cn } from '../../utils/cn'

export interface AudioWaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  bars?: number
}

export function AudioWaveform({ bars = 24, className, ...props }: AudioWaveformProps) {
  const values = Array.from({ length: bars }, () => Math.random() * 100)
  return (
    <div className={cn('flex items-end gap-1 h-16', className)} {...props}>
      {values.map((v, i) => (
        <span key={i} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${v}%` }} />
      ))}
    </div>
  )
}
