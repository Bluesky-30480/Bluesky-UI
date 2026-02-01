import React, { useState, useRef, useEffect } from 'react'
import { Folder, FolderOpen, FileText, CheckCircle, XCircle, Film, Music, Mic, Settings, X, Plus, Play, Pause, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

// ============================================================================
// Types
// ============================================================================

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'audio'
  mimeType: string
  size: number
  url: string
  thumbnail?: string
  duration?: number
  width?: number
  height?: number
  metadata?: Record<string, string>
}

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface TranscodeJob {
  id: string
  file: MediaFile
  outputFormat: string
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export interface Subtitle {
  id: string
  startTime: number
  endTime: number
  text: string
}

export interface Clip {
  id: string
  startTime: number
  endTime: number
  label?: string
}

export interface ExportPreset {
  id: string
  name: string
  format: string
  quality: 'low' | 'medium' | 'high' | 'original'
  settings?: Record<string, unknown>
}

// ============================================================================
// MediaContainer - Main wrapper
// ============================================================================

export interface MediaContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: 'horizontal' | 'vertical' | 'grid'
}

export function MediaContainer({ layout = 'vertical', className, ...props }: MediaContainerProps) {
  return (
    <div 
      className={cn(
        'rounded-lg border border-border bg-surface',
        layout === 'horizontal' && 'flex',
        layout === 'vertical' && 'flex flex-col',
        layout === 'grid' && 'grid grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )} 
      {...props} 
    />
  )
}

// ============================================================================
// Upload Components
// ============================================================================

export interface MediaUploaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onProgress'> {
  accept?: string
  multiple?: boolean
  maxSize?: number // bytes
  onUpload?: (files: File[]) => void
  onProgress?: (progress: UploadProgress[]) => void
}

export function MediaUploader({ 
  accept = 'image/*,video/*,audio/*',
  multiple = true,
  maxSize = 100 * 1024 * 1024, // 100MB
  onUpload,
  onProgress,
  className, 
  ...props 
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    const validFiles: File[] = []
    const newUploads: UploadProgress[] = []
    
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        newUploads.push({
          fileId: `upload-${Date.now()}-${file.name}`,
          fileName: file.name,
          progress: 0,
          status: 'error',
          error: `File exceeds ${formatSize(maxSize)} limit`,
        })
      } else {
        validFiles.push(file)
        newUploads.push({
          fileId: `upload-${Date.now()}-${file.name}`,
          fileName: file.name,
          progress: 0,
          status: 'pending',
        })
      }
    })
    
    setUploads(prev => [...prev, ...newUploads])
    
    if (validFiles.length > 0) {
      onUpload?.(validFiles)
      
      // Simulate upload progress
      validFiles.forEach((file, _index) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 30
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
          }
          setUploads(prev => {
            const updated = [...prev]
            const uploadIndex = prev.findIndex(u => u.fileName === file.name)
            if (uploadIndex !== -1) {
              updated[uploadIndex] = {
                ...updated[uploadIndex],
                progress,
                status: progress >= 100 ? 'completed' : 'uploading',
              }
            }
            onProgress?.(updated)
            return updated
          })
        }, 200)
      })
    }
  }
  
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  return (
    <div className={cn('space-y-4', className)} {...props}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={e => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-3 text-sm hover:bg-muted transition-colors"
      >
        <Folder className="h-4 w-4" />
        <span>Select files to upload</span>
      </button>
      
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map(upload => (
            <div key={upload.fileId} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
              <span className="text-lg">
                {upload.status === 'completed' ? <CheckCircle className="h-5 w-5 text-green-500" /> : upload.status === 'error' ? <XCircle className="h-5 w-5 text-red-500" /> : <FileText className="h-5 w-5" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{upload.fileName}</div>
                {upload.status === 'uploading' && (
                  <div className="h-1 mt-1 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}
                {upload.error && (
                  <div className="text-xs text-destructive mt-1">{upload.error}</div>
                )}
              </div>
              {upload.status === 'uploading' && (
                <span className="text-xs text-muted-foreground">{Math.round(upload.progress)}%</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export interface MediaDropZoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  accept?: string[]
  onDrop?: (files: File[]) => void
}

export function MediaDropZone({ 
  accept = ['image/*', 'video/*', 'audio/*'],
  onDrop,
  className, 
  ...props 
}: MediaDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => {
      return accept.some(pattern => {
        if (pattern.endsWith('/*')) {
          return file.type.startsWith(pattern.slice(0, -1))
        }
        return file.type === pattern
      })
    })
    
    if (files.length > 0) {
      onDrop?.(files)
    }
  }
  
  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'rounded-lg border-2 border-dashed bg-surface p-8 text-center transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-border',
        className
      )} 
      {...props}
    >
      <FolderOpen className="h-10 w-10 mx-auto mb-3" />
      <div className="text-sm font-medium">
        {isDragging ? 'Drop files here' : 'Drag and drop files here'}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Supports images, videos, and audio files
      </div>
    </div>
  )
}

export interface MediaFolderPickerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onFolderSelect?: (files: File[]) => void
}

export function MediaFolderPicker({ onFolderSelect, className, ...props }: MediaFolderPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        // @ts-ignore - webkitdirectory is not in types
        webkitdirectory=""
        directory=""
        multiple
        onChange={e => {
          if (e.target.files) {
            onFolderSelect?.(Array.from(e.target.files))
          }
        }}
        className="hidden"
      />
      <button 
        onClick={() => inputRef.current?.click()}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors',
          className
        )}
        {...props}
      >
        <Folder className="h-4 w-4" />
        <span>Pick folder</span>
      </button>
    </>
  )
}

// ============================================================================
// Transcode Components
// ============================================================================

export interface TranscodeQueueProps extends React.HTMLAttributes<HTMLDivElement> {
  jobs?: TranscodeJob[]
  onCancel?: (jobId: string) => void
  onRetry?: (jobId: string) => void
}

export function TranscodeQueue({ jobs = [], onCancel, onRetry, className, ...props }: TranscodeQueueProps) {
  if (jobs.length === 0) {
    return (
      <div className={cn('p-4 text-center text-sm text-muted-foreground', className)} {...props}>
        No transcode jobs in queue
      </div>
    )
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        Transcode Queue ({jobs.length})
      </div>
      <div className="divide-y divide-border">
        {jobs.map(job => (
          <div key={job.id} className="flex items-center gap-3 p-4">
            <div className="text-2xl">
              {job.status === 'completed' ? <CheckCircle className="h-6 w-6 text-success" /> : job.status === 'error' ? <XCircle className="h-6 w-6 text-destructive" /> : <Loader2 className="h-6 w-6 animate-spin" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{job.file.name}</div>
              <div className="text-xs text-muted-foreground">
                → {job.outputFormat.toUpperCase()}
              </div>
              {job.status === 'processing' && (
                <div className="h-1 mt-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              )}
              {job.error && (
                <div className="text-xs text-destructive mt-1">{job.error}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {job.status === 'processing' && (
                <span className="text-xs text-muted-foreground">{Math.round(job.progress)}%</span>
              )}
              {(job.status === 'pending' || job.status === 'processing') && onCancel && (
                <button
                  onClick={() => onCancel(job.id)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Cancel
                </button>
              )}
              {job.status === 'error' && onRetry && (
                <button
                  onClick={() => onRetry(job.id)}
                  className="text-xs text-primary hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Preview Components
// ============================================================================

export interface MediaPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  file?: MediaFile
  showMetadata?: boolean
}

export function MediaPreview({ file, showMetadata, className, ...props }: MediaPreviewProps) {
  if (!file) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-8 text-center', className)} {...props}>
        <Film className="h-10 w-10 mx-auto mb-2" />
        <div className="text-sm text-muted-foreground">No file selected</div>
      </div>
    )
  }
  
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      {/* Preview area */}
      <div className="aspect-video bg-black flex items-center justify-center">
        {file.type === 'image' ? (
          <img src={file.url} alt={file.name} className="max-w-full max-h-full object-contain" />
        ) : file.type === 'video' ? (
          <video src={file.url} controls className="max-w-full max-h-full" />
        ) : file.type === 'audio' ? (
          <div className="p-6 w-full">
            <Music className="h-10 w-10 mx-auto mb-4" />
            <audio src={file.url} controls className="w-full" />
          </div>
        ) : null}
      </div>
      
      {/* Info */}
      <div className="p-4 border-t border-border">
        <h3 className="font-medium truncate">{file.name}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
          <span>{file.mimeType}</span>
          <span>{formatSize(file.size)}</span>
          {file.width && file.height && <span>{file.width}×{file.height}</span>}
          {file.duration && <span>{formatDuration(file.duration)}</span>}
        </div>
        
        {showMetadata && file.metadata && Object.keys(file.metadata).length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs font-medium mb-2">Metadata</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(file.metadata).map(([key, value]) => (
                <div key={key}>
                  <span className="text-muted-foreground">{key}: </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export interface ImageViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  zoom?: number
  onZoomChange?: (zoom: number) => void
}

export function ImageViewer({ src, alt, zoom = 1, onZoomChange, className, ...props }: ImageViewerProps) {
  const [localZoom, setLocalZoom] = useState(zoom)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.max(0.25, Math.min(4, localZoom + delta))
    setLocalZoom(newZoom)
    onZoomChange?.(newZoom)
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
        <button
          onClick={() => { setLocalZoom(z => Math.max(0.25, z - 0.25)); onZoomChange?.(localZoom) }}
          className="p-1 rounded hover:bg-muted text-sm"
        >
          ➖
        </button>
        <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(localZoom * 100)}%</span>
        <button
          onClick={() => { setLocalZoom(z => Math.min(4, z + 0.25)); onZoomChange?.(localZoom) }}
          className="p-1 rounded hover:bg-muted text-sm"
        >
          ➕
        </button>
        <div className="flex-1" />
        <button
          onClick={() => { setLocalZoom(1); onZoomChange?.(1) }}
          className="px-2 py-1 rounded text-xs hover:bg-muted"
        >
          Reset
        </button>
      </div>
      
      {/* Image area */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        className="overflow-auto bg-[#1a1a1a] aspect-video"
      >
        {src ? (
          <img 
            src={src} 
            alt={alt || ''} 
            style={{ transform: `scale(${localZoom})`, transformOrigin: 'center' }}
            className="max-w-none transition-transform"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
    </div>
  )
}

export interface MediaVideoPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onTimeUpdate'> {
  src?: string
  poster?: string
  autoPlay?: boolean
  onTimeUpdate?: (time: number) => void
}

export function MediaVideoPlayer({ src, poster, autoPlay, onTimeUpdate, className, ...props }: MediaVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)
    }
  }
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  
  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-black overflow-hidden', className)} {...props}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full aspect-video"
      />
      
      {/* Custom controls */}
      <div className="bg-gray-900 px-4 py-2 flex items-center gap-3">
        <button onClick={togglePlay} className="text-white hover:text-primary">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        
        <span className="text-xs text-gray-400 w-12">{formatTime(currentTime)}</span>
        
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={e => seek(parseFloat(e.target.value))}
          className="flex-1 accent-primary"
        />
        
        <span className="text-xs text-gray-400 w-12">{formatTime(duration)}</span>
      </div>
    </div>
  )
}

export interface MediaAudioPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onTimeUpdate'> {
  src?: string
  title?: string
  onTimeUpdate?: (time: number) => void
}

export function MediaAudioPlayer({ src, title, onTimeUpdate, className, ...props }: MediaAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => {
          const time = audioRef.current?.currentTime || 0
          setCurrentTime(time)
          onTimeUpdate?.(time)
        }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center gap-3">
        <button 
          onClick={togglePlay}
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        
        <div className="flex-1">
          {title && <div className="text-sm font-medium mb-1">{title}</div>}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={e => {
                if (audioRef.current) {
                  audioRef.current.currentTime = parseFloat(e.target.value)
                }
              }}
              className="flex-1 accent-primary"
            />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Editor Components
// ============================================================================

export interface TimelineEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number
  clips?: Clip[]
  currentTime?: number
  onSeek?: (time: number) => void
  onClipAdd?: (clip: Clip) => void
  onClipRemove?: (clipId: string) => void
}

export function TimelineEditor({ 
  duration = 60,
  clips = [],
  currentTime = 0,
  onSeek,
  onClipAdd,
  onClipRemove,
  className, 
  ...props 
}: TimelineEditorProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    onSeek?.(percent * duration)
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      {/* Time markers */}
      <div className="flex justify-between px-4 py-2 text-xs text-muted-foreground border-b border-border">
        <span>{formatTime(0)}</span>
        <span>{formatTime(duration / 4)}</span>
        <span>{formatTime(duration / 2)}</span>
        <span>{formatTime((duration * 3) / 4)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      {/* Timeline track */}
      <div 
        ref={timelineRef}
        onClick={handleClick}
        className="relative h-16 mx-4 my-3 bg-muted/30 rounded cursor-pointer"
      >
        {/* Clips */}
        {clips.map(clip => (
          <div
            key={clip.id}
            className="absolute top-1 bottom-1 bg-primary/50 rounded border border-primary/70 group"
            style={{
              left: `${(clip.startTime / duration) * 100}%`,
              width: `${((clip.endTime - clip.startTime) / duration) * 100}%`,
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white truncate px-1">
              {clip.label}
            </span>
            {onClipRemove && (
              <button
                onClick={e => { e.stopPropagation(); onClipRemove(clip.id) }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-destructive"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-destructive rounded-full" />
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-border">
        <span className="text-sm font-medium">{formatTime(currentTime)}</span>
        <div className="flex-1" />
        {onClipAdd && (
          <button
            onClick={() => onClipAdd({
              id: `clip-${Date.now()}`,
              startTime: currentTime,
              endTime: Math.min(currentTime + 5, duration),
              label: 'New clip',
            })}
            className="px-2 py-1 text-xs rounded border border-border hover:bg-muted flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Add clip
          </button>
        )}
      </div>
    </div>
  )
}

export interface ClipEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  clip?: Clip
  onChange?: (clip: Clip) => void
  onDelete?: () => void
}

export function ClipEditor({ clip, onChange, onDelete, className, ...props }: ClipEditorProps) {
  if (!clip) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted-foreground', className)} {...props}>
        Select a clip to edit
      </div>
    )
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4 space-y-4', className)} {...props}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Edit Clip</h3>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-xs text-destructive hover:underline"
          >
            Delete
          </button>
        )}
      </div>
      
      <div>
        <label className="text-xs text-muted-foreground">Label</label>
        <input
          type="text"
          value={clip.label || ''}
          onChange={e => onChange?.({ ...clip, label: e.target.value })}
          className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground">Start Time</label>
          <input
            type="number"
            value={clip.startTime}
            onChange={e => onChange?.({ ...clip, startTime: parseFloat(e.target.value) })}
            className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">End Time</label>
          <input
            type="number"
            value={clip.endTime}
            onChange={e => onChange?.({ ...clip, endTime: parseFloat(e.target.value) })}
            className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Duration: {formatTime(clip.endTime - clip.startTime)}
      </div>
    </div>
  )
}

// ============================================================================
// Subtitle Editor
// ============================================================================

export interface SubtitleEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  subtitles?: Subtitle[]
  currentTime?: number
  onSubtitleAdd?: (subtitle: Subtitle) => void
  onSubtitleUpdate?: (subtitle: Subtitle) => void
  onSubtitleRemove?: (id: string) => void
  onExport?: (format: 'srt' | 'vtt') => void
}

export function SubtitleEditor({ 
  subtitles = [],
  currentTime = 0,
  onSubtitleAdd,
  onSubtitleUpdate,
  onSubtitleRemove,
  onExport,
  className, 
  ...props 
}: SubtitleEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
  }
  
  const currentSubtitle = subtitles.find(s => 
    currentTime >= s.startTime && currentTime <= s.endTime
  )
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Subtitles ({subtitles.length})</h3>
        <div className="flex items-center gap-2">
          {onSubtitleAdd && (
            <button
              onClick={() => onSubtitleAdd({
                id: `sub-${Date.now()}`,
                startTime: currentTime,
                endTime: currentTime + 3,
                text: '',
              })}
              className="px-2 py-1 text-xs rounded border border-border hover:bg-muted flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          )}
          {onExport && (
            <select
              onChange={e => onExport(e.target.value as 'srt' | 'vtt')}
              className="text-xs rounded border border-border bg-background px-2 py-1"
              defaultValue=""
            >
              <option value="" disabled>Export</option>
              <option value="srt">SRT</option>
              <option value="vtt">VTT</option>
            </select>
          )}
        </div>
      </div>
      
      {/* Current subtitle preview */}
      {currentSubtitle && (
        <div className="px-4 py-2 bg-primary/5 border-b border-border">
          <span className="text-sm">{currentSubtitle.text}</span>
        </div>
      )}
      
      {/* Subtitle list */}
      <div className="max-h-64 overflow-y-auto divide-y divide-border">
        {subtitles.map((subtitle, index) => (
          <div 
            key={subtitle.id}
            className={cn(
              'px-4 py-3 hover:bg-muted/30',
              subtitle.id === currentSubtitle?.id && 'bg-primary/5'
            )}
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>#{index + 1}</span>
              <span>{formatTime(subtitle.startTime)} → {formatTime(subtitle.endTime)}</span>
              {onSubtitleRemove && (
                <button
                  onClick={() => onSubtitleRemove(subtitle.id)}
                  className="ml-auto text-destructive hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
            
            {editingId === subtitle.id ? (
              <textarea
                value={subtitle.text}
                onChange={e => onSubtitleUpdate?.({ ...subtitle, text: e.target.value })}
                onBlur={() => setEditingId(null)}
                autoFocus
                className="w-full rounded border border-border bg-background px-2 py-1 text-sm resize-none"
                rows={2}
              />
            ) : (
              <div 
                onClick={() => setEditingId(subtitle.id)}
                className="text-sm cursor-text"
              >
                {subtitle.text || <span className="text-muted-foreground italic">Click to add text...</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export interface WaveformEditorProps extends React.HTMLAttributes<HTMLCanvasElement> {
  audioData?: number[]
  duration?: number
  currentTime?: number
  selections?: { start: number; end: number }[]
  onSeek?: (time: number) => void
}

export function WaveformEditor({ 
  audioData = [],
  duration = 60,
  currentTime = 0,
  selections = [],
  onSeek,
  className, 
  ...props 
}: WaveformEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
    
    // Draw background
    ctx.fillStyle = 'hsl(var(--muted) / 0.3)'
    ctx.fillRect(0, 0, width, height)
    
    // Draw selections
    selections.forEach(sel => {
      const startX = (sel.start / duration) * width
      const endX = (sel.end / duration) * width
      ctx.fillStyle = 'hsl(var(--primary) / 0.2)'
      ctx.fillRect(startX, 0, endX - startX, height)
    })
    
    // Draw waveform
    const data = audioData.length > 0 ? audioData : Array.from({ length: 200 }, () => Math.random())
    const barWidth = width / data.length
    
    ctx.fillStyle = 'hsl(var(--primary))'
    data.forEach((value, i) => {
      const barHeight = value * height * 0.8
      const x = i * barWidth
      const y = (height - barHeight) / 2
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight)
    })
    
    // Draw playhead
    const playheadX = (currentTime / duration) * width
    ctx.fillStyle = 'hsl(var(--destructive))'
    ctx.fillRect(playheadX - 1, 0, 2, height)
  }, [audioData, duration, currentTime, selections])
  
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    onSeek?.(percent * duration)
  }
  
  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={80}
      onClick={handleClick}
      className={cn('w-full h-20 rounded-md cursor-pointer', className)}
      {...props}
    />
  )
}

// ============================================================================
// Metadata Editor
// ============================================================================

export interface MetadataEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  metadata?: Record<string, string>
  onChange?: (metadata: Record<string, string>) => void
  editable?: boolean
}

export function MetadataEditor({ 
  metadata = {},
  onChange,
  editable = true,
  className, 
  ...props 
}: MetadataEditorProps) {
  const [localMetadata, setLocalMetadata] = useState(metadata)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  
  const handleChange = (key: string, value: string) => {
    const updated = { ...localMetadata, [key]: value }
    setLocalMetadata(updated)
    onChange?.(updated)
  }
  
  const handleRemove = (key: string) => {
    const { [key]: _, ...rest } = localMetadata
    setLocalMetadata(rest)
    onChange?.(rest)
  }
  
  const handleAdd = () => {
    if (newKey.trim() && newValue.trim()) {
      const updated = { ...localMetadata, [newKey]: newValue }
      setLocalMetadata(updated)
      onChange?.(updated)
      setNewKey('')
      setNewValue('')
    }
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        Metadata
      </div>
      
      <div className="p-4 space-y-3">
        {Object.entries(localMetadata).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-24 truncate">{key}</span>
            {editable ? (
              <>
                <input
                  type="text"
                  value={value}
                  onChange={e => handleChange(key, e.target.value)}
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
                />
                <button
                  onClick={() => handleRemove(key)}
                  className="text-muted-foreground hover:text-destructive text-xs"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <span className="text-sm">{value}</span>
            )}
          </div>
        ))}
        
        {editable && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <input
              type="text"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="Key"
              className="w-24 rounded border border-border bg-background px-2 py-1 text-sm"
            />
            <input
              type="text"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              placeholder="Value"
              className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
            />
            <button
              onClick={handleAdd}
              className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs hover:bg-primary/90"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Export Components
// ============================================================================

export interface ExportPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  file?: MediaFile
  presets?: ExportPreset[]
  onExport?: (preset: ExportPreset) => void
}

export function ExportPanel({ file, presets = [], onExport, className, ...props }: ExportPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset | null>(null)
  const [customFormat, setCustomFormat] = useState('mp4')
  const [customQuality, setCustomQuality] = useState<'low' | 'medium' | 'high' | 'original'>('high')
  
  const defaultPresets: ExportPreset[] = presets.length > 0 ? presets : [
    { id: 'web-video', name: 'Web Video', format: 'mp4', quality: 'medium' },
    { id: 'hd-video', name: 'HD Video', format: 'mp4', quality: 'high' },
    { id: 'audio-only', name: 'Audio Only', format: 'mp3', quality: 'high' },
    { id: 'gif', name: 'GIF', format: 'gif', quality: 'medium' },
  ]
  
  const handleExport = () => {
    const preset = selectedPreset || {
      id: 'custom',
      name: 'Custom',
      format: customFormat,
      quality: customQuality,
    }
    onExport?.(preset)
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        Export
      </div>
      
      <div className="p-4 space-y-4">
        {/* File info */}
        {file && (
          <div className="p-3 rounded-md bg-muted/30">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-muted-foreground">{file.mimeType}</div>
          </div>
        )}
        
        {/* Presets */}
        <div>
          <label className="text-xs text-muted-foreground">Preset</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {defaultPresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={cn(
                  'px-3 py-2 rounded-md border text-xs text-left transition-colors',
                  selectedPreset?.id === preset.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:bg-muted'
                )}
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-muted-foreground">{preset.format.toUpperCase()} • {preset.quality}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Custom options */}
        {!selectedPreset && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Format</label>
              <select
                value={customFormat}
                onChange={e => setCustomFormat(e.target.value)}
                className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="mp4">MP4</option>
                <option value="webm">WebM</option>
                <option value="mov">MOV</option>
                <option value="mp3">MP3</option>
                <option value="wav">WAV</option>
                <option value="gif">GIF</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Quality</label>
              <select
                value={customQuality}
                onChange={e => setCustomQuality(e.target.value as typeof customQuality)}
                className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="original">Original</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={!file}
          className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export
        </button>
      </div>
    </div>
  )
}

export interface BatchExportProps extends React.HTMLAttributes<HTMLDivElement> {
  files?: MediaFile[]
  preset?: ExportPreset
  onExport?: (files: MediaFile[], preset: ExportPreset) => void
}

export function BatchExport({ files = [], preset, onExport, className, ...props }: BatchExportProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(files.map(f => f.id)))
  const [selectedPreset, _setSelectedPreset] = useState<ExportPreset>(
    preset || { id: 'default', name: 'Default', format: 'mp4', quality: 'high' }
  )
  
  const toggleFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedFiles(newSelected)
  }
  
  const toggleAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)))
    }
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Batch Export</h3>
        <span className="text-xs text-muted-foreground">{selectedFiles.size} selected</span>
      </div>
      
      {/* File list */}
      <div className="max-h-48 overflow-y-auto divide-y divide-border">
        <div 
          onClick={toggleAll}
          className="flex items-center gap-3 px-4 py-2 hover:bg-muted/30 cursor-pointer"
        >
          <input 
            type="checkbox" 
            checked={selectedFiles.size === files.length}
            onChange={() => {}}
            className="accent-primary"
          />
          <span className="text-sm font-medium">Select all</span>
        </div>
        {files.map(file => (
          <div 
            key={file.id}
            onClick={() => toggleFile(file.id)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-muted/30 cursor-pointer"
          >
            <input 
              type="checkbox" 
              checked={selectedFiles.has(file.id)}
              onChange={() => {}}
              className="accent-primary"
            />
            <span className="text-sm truncate">{file.name}</span>
          </div>
        ))}
      </div>
      
      {/* Export */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            const filesToExport = files.filter(f => selectedFiles.has(f.id))
            onExport?.(filesToExport, selectedPreset)
          }}
          disabled={selectedFiles.size === 0}
          className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export {selectedFiles.size} files
        </button>
      </div>
    </div>
  )
}

export interface FormatSelectorProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  formats?: string[]
  onChange?: (format: string) => void
}

export function FormatSelector({ 
  formats = ['mp4', 'webm', 'mov', 'avi', 'mp3', 'wav', 'ogg', 'flac', 'gif', 'png', 'jpg'],
  onChange,
  className,
  ...props 
}: FormatSelectorProps) {
  return (
    <select 
      onChange={e => onChange?.(e.target.value)}
      className={cn('rounded-md border border-border bg-background px-2 py-1 text-sm', className)} 
      {...props}
    >
      {formats.map(format => (
        <option key={format} value={format}>{format.toUpperCase()}</option>
      ))}
    </select>
  )
}

export interface TranscodePresetsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  presets?: ExportPreset[]
  selectedId?: string
  onSelect?: (preset: ExportPreset) => void
}

export function TranscodePresets({ presets = [], selectedId, onSelect, className, ...props }: TranscodePresetsProps) {
  const defaultPresets: ExportPreset[] = presets.length > 0 ? presets : [
    { id: 'h264-fast', name: 'H.264 Fast', format: 'mp4', quality: 'medium' },
    { id: 'h264-quality', name: 'H.264 Quality', format: 'mp4', quality: 'high' },
    { id: 'webm-vp9', name: 'WebM VP9', format: 'webm', quality: 'high' },
    { id: 'prores', name: 'ProRes', format: 'mov', quality: 'original' },
  ]
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        Transcode Presets
      </div>
      <div className="p-2 space-y-1">
        {defaultPresets.map(preset => (
          <button
            key={preset.id}
            onClick={() => onSelect?.(preset)}
            className={cn(
              'w-full px-3 py-2 rounded-md text-left text-sm transition-colors',
              selectedId === preset.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
            )}
          >
            <div className="font-medium">{preset.name}</div>
            <div className="text-xs text-muted-foreground">
              {preset.format.toUpperCase()} • {preset.quality}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Transcription & Subtitle Sync
// ============================================================================

export interface FFmpegRunnerProps extends React.HTMLAttributes<HTMLDivElement> {
  command?: string
  output?: string
  isRunning?: boolean
  progress?: number
  onRun?: (command: string) => void
  onCancel?: () => void
}

export function FFmpegRunner({ 
  command = '',
  output = '',
  isRunning = false,
  progress,
  onRun,
  onCancel,
  className, 
  ...props 
}: FFmpegRunnerProps) {
  const [localCommand, setLocalCommand] = useState(command)
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm flex items-center gap-2">
        <Settings className="h-5 w-5" />
        FFmpeg Runner
      </div>
      
      <div className="p-4 space-y-4">
        {/* Command input */}
        <div>
          <label className="text-xs text-muted-foreground">Command</label>
          <textarea
            value={localCommand}
            onChange={e => setLocalCommand(e.target.value)}
            placeholder="ffmpeg -i input.mp4 output.webm"
            className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono resize-none"
            rows={3}
          />
        </div>
        
        {/* Progress */}
        {isRunning && progress !== undefined && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Output */}
        {output && (
          <div>
            <label className="text-xs text-muted-foreground">Output</label>
            <pre className="mt-1 p-3 rounded-md bg-[#1a1a1a] text-green-400 text-xs font-mono overflow-x-auto max-h-32">
              {output}
            </pre>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={() => onRun?.(localCommand)}
              disabled={!localCommand.trim()}
              className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Run
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export interface TranscriptionPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  transcript?: string
  isTranscribing?: boolean
  progress?: number
  onTranscribe?: () => void
  onExport?: (format: 'txt' | 'srt' | 'vtt') => void
}

export function TranscriptionPanel({ 
  transcript = '',
  isTranscribing = false,
  progress,
  onTranscribe,
  onExport,
  className, 
  ...props 
}: TranscriptionPanelProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Transcription</h3>
        {transcript && onExport && (
          <select
            onChange={e => onExport(e.target.value as 'txt' | 'srt' | 'vtt')}
            className="text-xs rounded border border-border bg-background px-2 py-1"
            defaultValue=""
          >
            <option value="" disabled>Export</option>
            <option value="txt">TXT</option>
            <option value="srt">SRT</option>
            <option value="vtt">VTT</option>
          </select>
        )}
      </div>
      
      <div className="p-4">
        {isTranscribing ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <div className="text-sm text-muted-foreground">Transcribing audio...</div>
            {progress !== undefined && (
              <div className="mt-2 text-xs text-muted-foreground">{Math.round(progress)}%</div>
            )}
          </div>
        ) : transcript ? (
          <div className="prose prose-sm max-w-none text-sm">
            {transcript}
          </div>
        ) : (
          <div className="text-center py-8">
            <Mic className="h-10 w-10 mx-auto mb-3" />
            <div className="text-sm text-muted-foreground mb-4">No transcription available</div>
            {onTranscribe && (
              <button
                onClick={onTranscribe}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start Transcription
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export interface SubtitleSyncProps extends React.HTMLAttributes<HTMLDivElement> {
  subtitles?: Subtitle[]
  offset?: number
  onOffsetChange?: (offset: number) => void
  onApply?: () => void
}

export function SubtitleSync({ 
  subtitles = [],
  offset = 0,
  onOffsetChange,
  onApply,
  className, 
  ...props 
}: SubtitleSyncProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <h3 className="text-sm font-semibold mb-4">Subtitle Sync</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Time Offset (seconds)</label>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => onOffsetChange?.(offset - 0.5)}
              className="p-2 rounded border border-border hover:bg-muted"
            >
              -0.5s
            </button>
            <input
              type="number"
              value={offset}
              onChange={e => onOffsetChange?.(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-center"
            />
            <button
              onClick={() => onOffsetChange?.(offset + 0.5)}
              className="p-2 rounded border border-border hover:bg-muted"
            >
              +0.5s
            </button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {subtitles.length} subtitles will be adjusted by {offset > 0 ? '+' : ''}{offset}s
        </div>
        
        {onApply && (
          <button
            onClick={onApply}
            disabled={offset === 0}
            className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Offset
          </button>
        )}
      </div>
    </div>
  )
}
