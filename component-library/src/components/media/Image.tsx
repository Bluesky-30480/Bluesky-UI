import React from 'react'
import { cn } from '../../utils/cn'

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  rounded?: boolean
  aspect?: 'square' | 'video' | 'wide'
}

const aspectMap = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[16/9]',
}

export function Image({ rounded = true, aspect = 'square', className, ...props }: ImageProps) {
  return (
    <img
      className={cn('w-full object-cover', aspectMap[aspect], rounded && 'rounded-lg', className)}
      {...props}
    />
  )
}
