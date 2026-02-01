import React from 'react'
import { cn } from '../../utils/cn'

export interface FilePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  size?: string
  status?: 'ready' | 'uploading' | 'error'
}

const statusMap = {
  ready: 'text-success',
  uploading: 'text-warning',
  error: 'text-error',
}

export function FilePreview({ name, size, status = 'ready', className, ...props }: FilePreviewProps) {
  return (
    <div className={cn('flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm', className)} {...props}>
      <div>
        <div className="font-medium text-foreground">{name}</div>
        {size && <div className="text-xs text-muted-foreground">{size}</div>}
      </div>
      <div className={cn('text-xs font-medium', statusMap[status])}>{status}</div>
    </div>
  )
}
