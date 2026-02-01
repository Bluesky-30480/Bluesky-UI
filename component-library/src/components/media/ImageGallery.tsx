import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '../../utils/cn'
import { Image } from './Image'

export interface GalleryImage {
  src: string
  alt?: string
  thumbnail?: string
  caption?: string
}

export interface ImageGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of images */
  images: GalleryImage[]
  /** Number of columns */
  columns?: number
  /** Gap between images */
  gap?: 'none' | 'sm' | 'md' | 'lg'
  /** Enable lightbox on click */
  lightbox?: boolean
  /** Show thumbnails strip in lightbox */
  showThumbnails?: boolean
  /** Enable zoom in lightbox */
  enableZoom?: boolean
  /** Initial selected index */
  initialIndex?: number
  /** Callback when image changes */
  onImageChange?: (index: number) => void
}

// Lightbox component
function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
  showThumbnails,
  enableZoom,
}: {
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
  showThumbnails: boolean
  enableZoom: boolean
}) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const currentImage = images[currentIndex]
  
  // Reset zoom when image changes
  useEffect(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (currentIndex > 0) onNavigate(currentIndex - 1)
          break
        case 'ArrowRight':
          if (currentIndex < images.length - 1) onNavigate(currentIndex + 1)
          break
        case '+':
        case '=':
          if (enableZoom && zoom < 3) setZoom(z => Math.min(z + 0.5, 3))
          break
        case '-':
          if (enableZoom && zoom > 1) {
            setZoom(z => Math.max(z - 0.5, 1))
            if (zoom <= 1.5) setPosition({ x: 0, y: 0 })
          }
          break
        case '0':
          setZoom(1)
          setPosition({ x: 0, y: 0 })
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, images.length, onClose, onNavigate, enableZoom, zoom])
  
  // Handle mouse drag for panning when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  // Handle zoom with double click
  const handleDoubleClick = () => {
    if (!enableZoom) return
    if (zoom === 1) {
      setZoom(2)
    } else {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
  }
  
  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!enableZoom) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.25 : 0.25
    const newZoom = Math.max(1, Math.min(zoom + delta, 3))
    setZoom(newZoom)
    if (newZoom === 1) setPosition({ x: 0, y: 0 })
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        <div className="flex items-center gap-2">
          {enableZoom && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setZoom(z => Math.max(z - 0.5, 1))
                  if (zoom <= 1.5) setPosition({ x: 0, y: 0 })
                }}
                disabled={zoom <= 1}
                className="p-2 rounded hover:bg-white/10 disabled:opacity-50"
                title="Zoom out (-)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35M8 11h6" />
                </svg>
              </button>
              <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setZoom(z => Math.min(z + 0.5, 3))
                }}
                disabled={zoom >= 3}
                className="p-2 rounded hover:bg-white/10 disabled:opacity-50"
                title="Zoom in (+)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="p-2 rounded hover:bg-white/10"
            title="Close (Esc)"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main image area */}
      <div 
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        {/* Previous button */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(currentIndex - 1)
            }}
            className="absolute left-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            title="Previous (←)"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        
        {/* Image */}
        <img
          src={currentImage.src}
          alt={currentImage.alt || ''}
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : (enableZoom ? 'zoom-in' : 'default'),
            transition: isDragging ? 'none' : 'transform 0.2s',
          }}
          className="max-h-[calc(100vh-200px)] max-w-[90vw] object-contain select-none"
          draggable={false}
        />
        
        {/* Next button */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(currentIndex + 1)
            }}
            className="absolute right-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            title="Next (→)"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Caption */}
      {currentImage.caption && (
        <div className="text-center text-white text-sm py-2 px-4">
          {currentImage.caption}
        </div>
      )}
      
      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex justify-center gap-2 p-4 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(index)
              }}
              className={cn(
                'w-16 h-16 rounded overflow-hidden border-2 transition-all flex-shrink-0',
                index === currentIndex 
                  ? 'border-white opacity-100' 
                  : 'border-transparent opacity-50 hover:opacity-80'
              )}
            >
              <img
                src={img.thumbnail || img.src}
                alt={img.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

export function ImageGallery({ 
  images, 
  columns = 3, 
  gap = 'md',
  lightbox = true,
  showThumbnails = true,
  enableZoom = true,
  initialIndex,
  onImageChange,
  className, 
  ...props 
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0)
  
  const handleImageClick = (index: number) => {
    if (lightbox) {
      setCurrentIndex(index)
      setLightboxOpen(true)
    }
  }
  
  const handleNavigate = useCallback((index: number) => {
    setCurrentIndex(index)
    onImageChange?.(index)
  }, [onImageChange])
  
  const handleClose = useCallback(() => {
    setLightboxOpen(false)
  }, [])
  
  return (
    <>
      <div
        className={cn('grid', gapClasses[gap], className)}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        {...props}
      >
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={cn(
              'overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary',
              lightbox && 'cursor-pointer hover:opacity-90 transition-opacity'
            )}
          >
            <Image 
              src={img.thumbnail || img.src} 
              alt={img.alt || `Image ${index + 1}`}
              className="w-full h-full object-cover aspect-square"
            />
          </button>
        ))}
      </div>
      
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
          showThumbnails={showThumbnails}
          enableZoom={enableZoom}
        />
      )}
    </>
  )
}
