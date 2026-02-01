import React, { useState, useRef, useCallback } from 'react'
import { Image, Film, Music, FileText, Table2, Package, Folder } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Label text */
  label?: string
  /** Hint/description text */
  hint?: string
  /** Accepted file types (MIME types or extensions) */
  accept?: string
  /** Allow multiple files */
  multiple?: boolean
  /** Max file size in bytes */
  maxSize?: number
  /** Max number of files */
  maxFiles?: number
  /** Callback when files are selected/dropped */
  onFilesChange?: (files: File[]) => void
  /** Callback when files are rejected */
  onFilesRejected?: (rejections: Array<{ file: File; reason: string }>) => void
  /** Show file previews */
  showPreviews?: boolean
  /** Custom validation function */
  validate?: (file: File) => string | null
  /** Current files (controlled) */
  files?: File[]
  /** Disabled state */
  disabled?: boolean
}

export function FileUpload({ 
  label = 'Upload file', 
  hint,
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  onFilesChange,
  onFilesRejected,
  showPreviews = true,
  validate,
  files: controlledFiles,
  disabled,
  className, 
  ...props 
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [internalFiles, setInternalFiles] = useState<File[]>([])
  
  const files = controlledFiles ?? internalFiles
  const setFiles = onFilesChange ?? setInternalFiles
  
  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Custom validation
    if (validate) {
      const error = validate(file)
      if (error) return error
    }
    
    // File type validation
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim())
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1))
        }
        return file.type === type
      })
      if (!isAccepted) return `File type not accepted: ${file.type || 'unknown'}`
    }
    
    // File size validation
    if (maxSize && file.size > maxSize) {
      const sizeMB = (maxSize / 1024 / 1024).toFixed(1)
      return `File too large. Max size: ${sizeMB}MB`
    }
    
    return null
  }, [accept, maxSize, validate])
  
  // Process files
  const processFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const accepted: File[] = []
    const rejected: Array<{ file: File; reason: string }> = []
    
    // Check max files
    const availableSlots = maxFiles - files.length
    const filesToProcess = multiple ? fileArray.slice(0, availableSlots) : [fileArray[0]]
    
    filesToProcess.forEach(file => {
      const error = validateFile(file)
      if (error) {
        rejected.push({ file, reason: error })
      } else {
        accepted.push(file)
      }
    })
    
    // Files exceeding limit
    if (fileArray.length > filesToProcess.length) {
      fileArray.slice(availableSlots).forEach(file => {
        rejected.push({ file, reason: `Maximum ${maxFiles} files allowed` })
      })
    }
    
    if (accepted.length > 0) {
      const newFileList = multiple ? [...files, ...accepted] : accepted
      setFiles(newFileList)
    }
    
    if (rejected.length > 0) {
      onFilesRejected?.(rejected)
    }
  }, [files, maxFiles, multiple, validateFile, setFiles, onFilesRejected])
  
  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
    // Reset input to allow selecting same file again
    e.target.value = ''
  }
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (disabled) return
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }
  
  // Remove file
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }
  
  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  
  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />
    if (file.type.startsWith('video/')) return <Film className="h-5 w-5" />
    if (file.type.startsWith('audio/')) return <Music className="h-5 w-5" />
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5" />
    if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return <FileText className="h-5 w-5" />
    if (file.type.includes('sheet') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) return <Table2 className="h-5 w-5" />
    if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('7z')) return <Package className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }
  
  // Get image preview URL
  const getPreviewUrl = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return null
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer',
          isDragging && 'border-primary bg-primary/5',
          !isDragging && 'border-border bg-surface hover:border-muted-foreground',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="text-3xl"><Folder className="h-8 w-8" /></div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">
          {hint || (
            <>
              Drag and drop {multiple ? 'files' : 'a file'} here, or click to browse
              {accept && <div className="mt-1">Accepted: {accept}</div>}
              {maxSize && <div>Max size: {formatSize(maxSize)}</div>}
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
      </div>
      
      {/* File list */}
      {showPreviews && files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const previewUrl = getPreviewUrl(file)
            
            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-md border border-border bg-surface p-2 group"
              >
                {/* Preview/Icon */}
                <div className="w-10 h-10 shrink-0 rounded overflow-hidden bg-muted flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">{getFileIcon(file)}</span>
                  )}
                </div>
                
                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{formatSize(file.size)}</div>
                </div>
                
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-destructive transition-all"
                  title="Remove file"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
