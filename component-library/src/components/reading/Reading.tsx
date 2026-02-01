import React, { useState, useRef, useEffect, useMemo, createContext, useContext } from 'react'
import { FileText, Moon, Sun, Bookmark, BookmarkCheck, Search, BookOpen, StickyNote, Check, X, Play, Pause, Square } from 'lucide-react'
import { cn } from '../../utils/cn'

// ============================================================================
// Types
// ============================================================================

export interface Book {
  id: string
  title: string
  author?: string
  coverUrl?: string
  chapters: Chapter[]
  totalPages?: number
}

export interface Chapter {
  id: string
  title: string
  content: string
  pageStart?: number
  pageEnd?: number
}

export interface Bookmark {
  id: string
  chapterId: string
  page?: number
  position?: number // character position
  label?: string
  createdAt: Date
}

export interface Highlight {
  id: string
  chapterId: string
  startPosition: number
  endPosition: number
  text: string
  color: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
  note?: string
  createdAt: Date
}

export interface Annotation {
  id: string
  chapterId: string
  position: number
  text: string
  createdAt: Date
  updatedAt?: Date
}

export interface ReadingSettings {
  fontSize: number
  fontFamily: string
  lineHeight: number
  margins: number
  theme: 'light' | 'dark' | 'sepia'
  dyslexiaMode: boolean
  pageAnimation: 'slide' | 'flip' | 'none'
}

export interface SearchResult {
  chapterId: string
  chapterTitle: string
  position: number
  snippet: string
}

// ============================================================================
// ReadingProvider - Context for reading state
// ============================================================================

export interface ReadingHandle {
  goToPage: (page: number) => void
  goToChapter: (chapterId: string) => void
  nextPage: () => void
  previousPage: () => void
  addBookmark: (label?: string) => Bookmark
  removeBookmark: (id: string) => void
  addHighlight: (startPos: number, endPos: number, color: Highlight['color']) => Highlight
  removeHighlight: (id: string) => void
  search: (query: string) => SearchResult[]
  updateSettings: (settings: Partial<ReadingSettings>) => void
}

export interface ReadingState {
  book: Book | null
  currentChapter: Chapter | null
  currentPage: number
  totalPages: number
  bookmarks: Bookmark[]
  highlights: Highlight[]
  annotations: Annotation[]
  settings: ReadingSettings
  searchResults: SearchResult[]
  isLoading: boolean
}

const defaultSettings: ReadingSettings = {
  fontSize: 16,
  fontFamily: 'serif',
  lineHeight: 1.6,
  margins: 24,
  theme: 'light',
  dyslexiaMode: false,
  pageAnimation: 'slide',
}

const ReadingContext = createContext<{
  state: ReadingState
  dispatch: React.Dispatch<ReadingAction>
  handle: ReadingHandle
} | null>(null)

type ReadingAction =
  | { type: 'SET_BOOK'; book: Book }
  | { type: 'SET_CHAPTER'; chapter: Chapter }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'ADD_BOOKMARK'; bookmark: Bookmark }
  | { type: 'REMOVE_BOOKMARK'; id: string }
  | { type: 'ADD_HIGHLIGHT'; highlight: Highlight }
  | { type: 'REMOVE_HIGHLIGHT'; id: string }
  | { type: 'ADD_ANNOTATION'; annotation: Annotation }
  | { type: 'UPDATE_ANNOTATION'; id: string; text: string }
  | { type: 'REMOVE_ANNOTATION'; id: string }
  | { type: 'SET_SETTINGS'; settings: Partial<ReadingSettings> }
  | { type: 'SET_SEARCH_RESULTS'; results: SearchResult[] }

function readingReducer(state: ReadingState, action: ReadingAction): ReadingState {
  switch (action.type) {
    case 'SET_BOOK':
      return { 
        ...state, 
        book: action.book, 
        currentChapter: action.book.chapters[0] || null,
        totalPages: action.book.totalPages || action.book.chapters.length,
      }
    case 'SET_CHAPTER':
      return { ...state, currentChapter: action.chapter }
    case 'SET_PAGE':
      return { ...state, currentPage: action.page }
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading }
    case 'ADD_BOOKMARK':
      return { ...state, bookmarks: [...state.bookmarks, action.bookmark] }
    case 'REMOVE_BOOKMARK':
      return { ...state, bookmarks: state.bookmarks.filter(b => b.id !== action.id) }
    case 'ADD_HIGHLIGHT':
      return { ...state, highlights: [...state.highlights, action.highlight] }
    case 'REMOVE_HIGHLIGHT':
      return { ...state, highlights: state.highlights.filter(h => h.id !== action.id) }
    case 'ADD_ANNOTATION':
      return { ...state, annotations: [...state.annotations, action.annotation] }
    case 'UPDATE_ANNOTATION':
      return { 
        ...state, 
        annotations: state.annotations.map(a => 
          a.id === action.id ? { ...a, text: action.text, updatedAt: new Date() } : a
        ) 
      }
    case 'REMOVE_ANNOTATION':
      return { ...state, annotations: state.annotations.filter(a => a.id !== action.id) }
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } }
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.results }
    default:
      return state
  }
}

export interface ReadingProviderProps {
  children: React.ReactNode
  book?: Book
  initialPage?: number
  initialSettings?: Partial<ReadingSettings>
  onPageChange?: (page: number) => void
  onBookmarkAdd?: (bookmark: Bookmark) => void
  onHighlightAdd?: (highlight: Highlight) => void
}

export function ReadingProvider({
  children,
  book,
  initialPage = 1,
  initialSettings,
  onPageChange,
  onBookmarkAdd,
  onHighlightAdd,
}: ReadingProviderProps) {
  const [state, dispatch] = React.useReducer(readingReducer, {
    book: book || null,
    currentChapter: book?.chapters[0] || null,
    currentPage: initialPage,
    totalPages: book?.totalPages || book?.chapters.length || 0,
    bookmarks: [],
    highlights: [],
    annotations: [],
    settings: { ...defaultSettings, ...initialSettings },
    searchResults: [],
    isLoading: false,
  })

  useEffect(() => {
    onPageChange?.(state.currentPage)
  }, [state.currentPage, onPageChange])

  const handle: ReadingHandle = useMemo(() => ({
    goToPage: (page: number) => {
      dispatch({ type: 'SET_PAGE', page: Math.max(1, Math.min(page, state.totalPages)) })
    },
    goToChapter: (chapterId: string) => {
      const chapter = state.book?.chapters.find(c => c.id === chapterId)
      if (chapter) {
        dispatch({ type: 'SET_CHAPTER', chapter })
        if (chapter.pageStart) {
          dispatch({ type: 'SET_PAGE', page: chapter.pageStart })
        }
      }
    },
    nextPage: () => {
      if (state.currentPage < state.totalPages) {
        dispatch({ type: 'SET_PAGE', page: state.currentPage + 1 })
      }
    },
    previousPage: () => {
      if (state.currentPage > 1) {
        dispatch({ type: 'SET_PAGE', page: state.currentPage - 1 })
      }
    },
    addBookmark: (label?: string) => {
      const bookmark: Bookmark = {
        id: `bookmark-${Date.now()}`,
        chapterId: state.currentChapter?.id || '',
        page: state.currentPage,
        label,
        createdAt: new Date(),
      }
      dispatch({ type: 'ADD_BOOKMARK', bookmark })
      onBookmarkAdd?.(bookmark)
      return bookmark
    },
    removeBookmark: (id: string) => {
      dispatch({ type: 'REMOVE_BOOKMARK', id })
    },
    addHighlight: (startPos: number, endPos: number, color: Highlight['color']) => {
      const highlight: Highlight = {
        id: `highlight-${Date.now()}`,
        chapterId: state.currentChapter?.id || '',
        startPosition: startPos,
        endPosition: endPos,
        text: state.currentChapter?.content.slice(startPos, endPos) || '',
        color,
        createdAt: new Date(),
      }
      dispatch({ type: 'ADD_HIGHLIGHT', highlight })
      onHighlightAdd?.(highlight)
      return highlight
    },
    removeHighlight: (id: string) => {
      dispatch({ type: 'REMOVE_HIGHLIGHT', id })
    },
    search: (query: string) => {
      if (!state.book || !query.trim()) {
        dispatch({ type: 'SET_SEARCH_RESULTS', results: [] })
        return []
      }
      
      const results: SearchResult[] = []
      const lowerQuery = query.toLowerCase()
      
      state.book.chapters.forEach(chapter => {
        const lowerContent = chapter.content.toLowerCase()
        let position = 0
        
        while ((position = lowerContent.indexOf(lowerQuery, position)) !== -1) {
          const start = Math.max(0, position - 30)
          const end = Math.min(chapter.content.length, position + query.length + 30)
          results.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            position,
            snippet: '...' + chapter.content.slice(start, end) + '...',
          })
          position += 1
        }
      })
      
      dispatch({ type: 'SET_SEARCH_RESULTS', results })
      return results
    },
    updateSettings: (settings: Partial<ReadingSettings>) => {
      dispatch({ type: 'SET_SETTINGS', settings })
    },
  }), [state.book, state.currentChapter, state.currentPage, state.totalPages, onBookmarkAdd, onHighlightAdd])

  return (
    <ReadingContext.Provider value={{ state, dispatch, handle }}>
      {children}
    </ReadingContext.Provider>
  )
}

export function useReading() {
  const context = useContext(ReadingContext)
  if (!context) {
    throw new Error('useReading must be used within ReadingProvider')
  }
  return context
}

// ============================================================================
// ReadingContainer - Main wrapper
// ============================================================================

export interface ReadingContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ReadingContainer({ className, ...props }: ReadingContainerProps) {
  const { state } = useReading()
  const { settings } = state
  
  const themeStyles = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-gray-100',
    sepia: 'bg-amber-50 text-amber-900',
  }
  
  return (
    <div 
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        themeStyles[settings.theme],
        settings.dyslexiaMode && 'font-sans tracking-wide',
        className
      )} 
      style={{
        fontSize: settings.fontSize,
        fontFamily: settings.dyslexiaMode ? 'OpenDyslexic, sans-serif' : settings.fontFamily,
        lineHeight: settings.lineHeight,
      }}
      {...props} 
    />
  )
}

// ============================================================================
// Viewer Components
// ============================================================================

export interface ViewerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EPUBViewer({ className, ...props }: ViewerProps) {
  const { state } = useReading()
  const containerRef = useRef<HTMLDivElement>(null)
  
  if (state.isLoading) {
    return (
      <div className={cn('flex items-center justify-center min-h-[400px]', className)} {...props}>
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }
  
  if (!state.currentChapter) {
    return (
      <div className={cn('flex items-center justify-center min-h-[400px] text-muted-foreground', className)} {...props}>
        No content to display
      </div>
    )
  }
  
  return (
    <div 
      ref={containerRef}
      className={cn('min-h-[400px] overflow-y-auto', className)} 
      style={{ padding: state.settings.margins }}
      {...props}
    >
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: state.currentChapter.content }}
      />
    </div>
  )
}

export function PDFViewer({ className, ...props }: ViewerProps) {
  const { state } = useReading()
  
  return (
    <div className={cn('relative min-h-[600px] bg-gray-100', className)} {...props}>
      {/* PDF rendering would require a library like pdf.js */}
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <FileText className="h-10 w-10 mx-auto mb-2" />
          <p>PDF Viewer</p>
          <p className="text-xs">Page {state.currentPage} of {state.totalPages}</p>
        </div>
      </div>
    </div>
  )
}

export function HTMLViewer({ className, content, ...props }: ViewerProps & { content?: string }) {
  const { state } = useReading()
  const displayContent = content || state.currentChapter?.content || ''
  
  return (
    <div 
      className={cn('prose prose-sm max-w-none', className)} 
      style={{ padding: state.settings.margins }}
      dangerouslySetInnerHTML={{ __html: displayContent }}
      {...props} 
    />
  )
}

export function TextViewer({ className, content, ...props }: ViewerProps & { content?: string }) {
  const { state } = useReading()
  const displayContent = content || state.currentChapter?.content || ''
  
  return (
    <div 
      className={cn('whitespace-pre-wrap', className)} 
      style={{ padding: state.settings.margins }}
      {...props}
    >
      {displayContent}
    </div>
  )
}

// ============================================================================
// Chapter Navigation
// ============================================================================

export interface ChapterListProps extends React.HTMLAttributes<HTMLDivElement> {
  onChapterSelect?: (chapter: Chapter) => void
}

export function ChapterList({ onChapterSelect, className, ...props }: ChapterListProps) {
  const { state, handle } = useReading()
  
  if (!state.book) {
    return (
      <div className={cn('p-4 text-center text-sm text-muted-foreground', className)} {...props}>
        No book loaded
      </div>
    )
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        Table of Contents
      </div>
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {state.book.chapters.map((chapter, index) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            index={index + 1}
            isActive={chapter.id === state.currentChapter?.id}
            onClick={() => {
              handle.goToChapter(chapter.id)
              onChapterSelect?.(chapter)
            }}
          />
        ))}
      </div>
    </div>
  )
}

export interface ChapterItemProps extends React.HTMLAttributes<HTMLDivElement> {
  chapter: Chapter
  index?: number
  isActive?: boolean
}

export function ChapterItem({ chapter, index, isActive, className, ...props }: ChapterItemProps) {
  return (
    <div 
      className={cn(
        'px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30',
        isActive && 'bg-primary/5 border-l-2 border-l-primary',
        className
      )} 
      {...props}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className="text-xs text-muted-foreground w-6">{index}.</span>
        )}
        <span className={cn('text-sm', isActive && 'font-medium text-primary')}>
          {chapter.title}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// Page Navigation
// ============================================================================

export interface PageNavigatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageNavigator({ className, ...props }: PageNavigatorProps) {
  const { state, handle } = useReading()
  const [inputValue, setInputValue] = useState(state.currentPage.toString())
  
  useEffect(() => {
    setInputValue(state.currentPage.toString())
  }, [state.currentPage])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = parseInt(inputValue)
    if (!isNaN(page)) {
      handle.goToPage(page)
    }
  }
  
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <button 
        onClick={handle.previousPage}
        disabled={state.currentPage <= 1}
        className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ←
      </button>
      
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="w-12 text-center rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
        <span className="text-sm text-muted-foreground">/ {state.totalPages}</span>
      </form>
      
      <button 
        onClick={handle.nextPage}
        disabled={state.currentPage >= state.totalPages}
        className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  )
}

export interface PageThumbnailStripProps extends React.HTMLAttributes<HTMLDivElement> {
  thumbnails?: { page: number; imageUrl?: string }[]
}

export function PageThumbnailStrip({ thumbnails = [], className, ...props }: PageThumbnailStripProps) {
  const { state, handle } = useReading()
  
  // Generate placeholder thumbnails if none provided
  const displayThumbnails: { page: number; imageUrl?: string }[] = thumbnails.length > 0 
    ? thumbnails 
    : Array.from({ length: Math.min(state.totalPages, 10) }, (_, i) => ({ page: i + 1 }))
  
  return (
    <div className={cn('flex gap-2 overflow-x-auto py-2', className)} {...props}>
      {displayThumbnails.map(thumb => (
        <button
          key={thumb.page}
          onClick={() => handle.goToPage(thumb.page)}
          className={cn(
            'flex-shrink-0 w-12 h-16 rounded border-2 transition-colors',
            thumb.page === state.currentPage 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50'
          )}
        >
          {thumb.imageUrl ? (
            <img src={thumb.imageUrl} alt={`Page ${thumb.page}`} className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
              {thumb.page}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export interface SeekBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  showPercentage?: boolean
  onChange?: (page: number) => void
}

export function SeekBar({ showPercentage, onChange, className, ...props }: SeekBarProps) {
  const { state, handle } = useReading()
  const percentage = state.totalPages > 0 ? Math.round((state.currentPage / state.totalPages) * 100) : 0
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input 
        type="range" 
        min={1}
        max={state.totalPages}
        value={state.currentPage}
        onChange={e => {
          const page = parseInt(e.target.value)
          handle.goToPage(page)
          onChange?.(page)
        }}
        className="flex-1 accent-primary"
        {...props} 
      />
      {showPercentage && (
        <span className="text-xs text-muted-foreground w-10">{percentage}%</span>
      )}
    </div>
  )
}

// ============================================================================
// Typography Controls
// ============================================================================

export interface FontSizeControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onChange?: (size: number) => void
}

export function FontSizeControl({ onChange, className, ...props }: FontSizeControlProps) {
  const { state, handle } = useReading()
  const sizes = [12, 14, 16, 18, 20, 24, 28, 32]
  
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <button 
        onClick={() => {
          const currentIndex = sizes.indexOf(state.settings.fontSize)
          if (currentIndex > 0) {
            const newSize = sizes[currentIndex - 1]
            handle.updateSettings({ fontSize: newSize })
            onChange?.(newSize)
          }
        }}
        className="p-1 rounded border border-border hover:bg-muted text-sm"
      >
        A-
      </button>
      <span className="text-xs text-muted-foreground w-8 text-center">{state.settings.fontSize}</span>
      <button 
        onClick={() => {
          const currentIndex = sizes.indexOf(state.settings.fontSize)
          if (currentIndex < sizes.length - 1) {
            const newSize = sizes[currentIndex + 1]
            handle.updateSettings({ fontSize: newSize })
            onChange?.(newSize)
          }
        }}
        className="p-1 rounded border border-border hover:bg-muted text-sm"
      >
        A+
      </button>
    </div>
  )
}

export interface LineHeightControlProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onChange?: (lineHeight: number) => void
}

export function LineHeightControl({ onChange, className, ...props }: LineHeightControlProps) {
  const { state, handle } = useReading()
  const options = [1.2, 1.4, 1.6, 1.8, 2.0, 2.2]
  
  return (
    <select 
      value={state.settings.lineHeight}
      onChange={e => {
        const value = parseFloat(e.target.value)
        handle.updateSettings({ lineHeight: value })
        onChange?.(value)
      }}
      className={cn('rounded-md border border-border bg-background px-2 py-1 text-sm', className)}
      {...props}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}x</option>
      ))}
    </select>
  )
}

export interface MarginControlProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onChange?: (margin: number) => void
}

export function MarginControl({ onChange, className, ...props }: MarginControlProps) {
  const { state, handle } = useReading()
  const options = [
    { value: 8, label: 'Narrow' },
    { value: 16, label: 'Normal' },
    { value: 24, label: 'Wide' },
    { value: 48, label: 'Extra Wide' },
  ]
  
  return (
    <select 
      value={state.settings.margins}
      onChange={e => {
        const value = parseInt(e.target.value)
        handle.updateSettings({ margins: value })
        onChange?.(value)
      }}
      className={cn('rounded-md border border-border bg-background px-2 py-1 text-sm', className)}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

export interface PageTurnAnimationProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onChange?: (animation: ReadingSettings['pageAnimation']) => void
}

export function PageTurnAnimation({ onChange, className, ...props }: PageTurnAnimationProps) {
  const { state, handle } = useReading()
  
  return (
    <select 
      value={state.settings.pageAnimation}
      onChange={e => {
        const value = e.target.value as ReadingSettings['pageAnimation']
        handle.updateSettings({ pageAnimation: value })
        onChange?.(value)
      }}
      className={cn('rounded-md border border-border bg-background px-2 py-1 text-sm', className)}
      {...props}
    >
      <option value="none">None</option>
      <option value="slide">Slide</option>
      <option value="flip">Flip</option>
    </select>
  )
}

// ============================================================================
// Theme Controls
// ============================================================================

export interface ReadingModeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onChange?: (theme: ReadingSettings['theme']) => void
}

export function ReadingMode({ onChange, className, ...props }: ReadingModeProps) {
  const { state, handle } = useReading()
  const themes: { value: ReadingSettings['theme']; label: string; preview: string }[] = [
    { value: 'light', label: 'Light', preview: 'bg-white text-gray-900 border-gray-200' },
    { value: 'dark', label: 'Dark', preview: 'bg-gray-900 text-gray-100 border-gray-700' },
    { value: 'sepia', label: 'Sepia', preview: 'bg-amber-50 text-amber-900 border-amber-200' },
  ]
  
  return (
    <div className={cn('flex gap-2', className)} {...props}>
      {themes.map(theme => (
        <button
          key={theme.value}
          onClick={() => {
            handle.updateSettings({ theme: theme.value })
            onChange?.(theme.value)
          }}
          className={cn(
            'px-3 py-2 rounded-md border text-xs transition-all',
            theme.preview,
            state.settings.theme === theme.value && 'ring-2 ring-primary ring-offset-2'
          )}
        >
          {theme.label}
        </button>
      ))}
    </div>
  )
}

export interface NightModeToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  onChange?: (enabled: boolean) => void
}

export function NightModeToggle({ onChange, className, ...props }: NightModeToggleProps) {
  const { state, handle } = useReading()
  const isNight = state.settings.theme === 'dark'
  
  return (
    <button 
      onClick={() => {
        const newTheme = isNight ? 'light' : 'dark'
        handle.updateSettings({ theme: newTheme })
        onChange?.(!isNight)
      }}
      className={cn(
        'flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors',
        isNight && 'bg-gray-800 text-white',
        className
      )}
      {...props}
    >
      {isNight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} {isNight ? 'Night On' : 'Night Off'}
    </button>
  )
}

export interface DyslexiaFriendlyToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  onChange?: (enabled: boolean) => void
}

export function DyslexiaFriendlyToggle({ onChange, className, ...props }: DyslexiaFriendlyToggleProps) {
  const { state, handle } = useReading()
  
  return (
    <button 
      onClick={() => {
        handle.updateSettings({ dyslexiaMode: !state.settings.dyslexiaMode })
        onChange?.(!state.settings.dyslexiaMode)
      }}
      className={cn(
        'flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors',
        state.settings.dyslexiaMode && 'bg-primary text-primary-foreground',
        className
      )}
      {...props}
    >
      Dyslexia Mode {state.settings.dyslexiaMode && <Check className="h-4 w-4" />}
    </button>
  )
}

// ============================================================================
// Bookmark Components
// ============================================================================

export interface BookmarkButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick?: (bookmark: Bookmark) => void
}

export function BookmarkButton({ onClick, className, ...props }: BookmarkButtonProps) {
  const { state, handle } = useReading()
  const isBookmarked = state.bookmarks.some(
    b => b.chapterId === state.currentChapter?.id && b.page === state.currentPage
  )
  
  const handleClick = () => {
    if (isBookmarked) {
      const bookmark = state.bookmarks.find(
        b => b.chapterId === state.currentChapter?.id && b.page === state.currentPage
      )
      if (bookmark) handle.removeBookmark(bookmark.id)
    } else {
      const bookmark = handle.addBookmark()
      onClick?.(bookmark)
    }
  }
  
  return (
    <button 
      onClick={handleClick}
      className={cn(
        'p-2 rounded-md border border-border transition-colors',
        isBookmarked ? 'bg-warning text-warning-foreground' : 'hover:bg-muted',
        className
      )}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      {...props}
    >
      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </button>
  )
}

export interface BookmarkListProps extends React.HTMLAttributes<HTMLDivElement> {
  onBookmarkClick?: (bookmark: Bookmark) => void
}

export function BookmarkList({ onBookmarkClick, className, ...props }: BookmarkListProps) {
  const { state, handle } = useReading()
  
  if (state.bookmarks.length === 0) {
    return (
      <div className={cn('p-4 text-center text-sm text-muted-foreground', className)} {...props}>
        No bookmarks yet
      </div>
    )
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        Bookmarks ({state.bookmarks.length})
      </div>
      <div className="divide-y divide-border max-h-64 overflow-y-auto">
        {state.bookmarks.map(bookmark => {
          const chapter = state.book?.chapters.find(c => c.id === bookmark.chapterId)
          return (
            <div 
              key={bookmark.id} 
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 cursor-pointer group"
              onClick={() => {
                handle.goToChapter(bookmark.chapterId)
                if (bookmark.page) handle.goToPage(bookmark.page)
                onBookmarkClick?.(bookmark)
              }}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {bookmark.label || `Page ${bookmark.page}`}
                </div>
                {chapter && (
                  <div className="text-xs text-muted-foreground truncate">{chapter.title}</div>
                )}
              </div>
              <button
                onClick={e => { e.stopPropagation(); handle.removeBookmark(bookmark.id) }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Highlight & Annotation Components
// ============================================================================

export interface HighlightLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  highlights?: Highlight[]
  onHighlightClick?: (highlight: Highlight) => void
}

export function HighlightLayer({ highlights, onHighlightClick, className, ...props }: HighlightLayerProps) {
  const { state } = useReading()
  const displayHighlights = highlights || state.highlights.filter(h => h.chapterId === state.currentChapter?.id)
  
  const colorClasses: Record<Highlight['color'], string> = {
    yellow: 'bg-yellow-200/50',
    green: 'bg-green-200/50',
    blue: 'bg-blue-200/50',
    pink: 'bg-pink-200/50',
    purple: 'bg-purple-200/50',
  }
  
  return (
    <div className={cn('space-y-1', className)} {...props}>
      {displayHighlights.map(highlight => (
        <div 
          key={highlight.id}
          onClick={() => onHighlightClick?.(highlight)}
          className={cn(
            'px-2 py-1 rounded cursor-pointer transition-opacity hover:opacity-80',
            colorClasses[highlight.color]
          )}
        >
          <span className="text-sm">{highlight.text}</span>
          {highlight.note && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><StickyNote className="h-3 w-3" /> {highlight.note}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export interface NoteEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  highlight?: Highlight
  onSave?: (note: string) => void
  onClose?: () => void
}

export function NoteEditor({ highlight, onSave, onClose, className, ...props }: NoteEditorProps) {
  const [note, setNote] = useState(highlight?.note || '')
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Add Note</span>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {highlight && (
        <div className="mb-3 p-2 rounded bg-yellow-100/50 text-sm">
          "{highlight.text}"
        </div>
      )}
      
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add your note..."
        className="w-full h-24 rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
      />
      
      <div className="flex justify-end gap-2 mt-3">
        {onClose && (
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted">
            Cancel
          </button>
        )}
        <button 
          onClick={() => onSave?.(note)}
          className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export interface AnnotationManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  onAnnotationClick?: (annotation: Annotation) => void
}

export function AnnotationManager({ onAnnotationClick, className, ...props }: AnnotationManagerProps) {
  const { state, dispatch } = useReading()
  const annotations = state.annotations.filter(a => a.chapterId === state.currentChapter?.id)
  
  if (annotations.length === 0) {
    return (
      <div className={cn('p-4 text-center text-sm text-muted-foreground', className)} {...props}>
        No annotations in this chapter
      </div>
    )
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        Annotations ({annotations.length})
      </div>
      <div className="divide-y divide-border max-h-64 overflow-y-auto">
        {annotations.map(annotation => (
          <div 
            key={annotation.id}
            onClick={() => onAnnotationClick?.(annotation)}
            className="px-4 py-3 hover:bg-muted/30 cursor-pointer group"
          >
            <p className="text-sm">{annotation.text}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {annotation.createdAt.toLocaleDateString()}
              </span>
              <button
                onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_ANNOTATION', id: annotation.id }) }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Search Components
// ============================================================================

export interface SearchInBookProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onResultClick?: (result: SearchResult) => void
}

export function SearchInBook({ onResultClick, className, ...props }: SearchInBookProps) {
  const { state, handle } = useReading()
  const [query, setQuery] = useState('')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    handle.search(query)
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <form onSubmit={handleSearch} className="p-3 border-b border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search in book..."
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button 
            type="submit"
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>
      
      {state.searchResults.length > 0 && (
        <div className="max-h-64 overflow-y-auto divide-y divide-border">
          {state.searchResults.map((result, i) => (
            <div 
              key={`${result.chapterId}-${result.position}-${i}`}
              onClick={() => {
                handle.goToChapter(result.chapterId)
                onResultClick?.(result)
              }}
              className="px-4 py-3 hover:bg-muted/30 cursor-pointer"
            >
              <div className="text-xs text-primary font-medium">{result.chapterTitle}</div>
              <p className="text-sm mt-1 text-muted-foreground">{result.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export interface DictionaryLookupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  word?: string
  onDefine?: (word: string) => void
}

export function DictionaryLookup({ word: initialWord, onDefine, className, ...props }: DictionaryLookupProps) {
  const [word, setWord] = useState(initialWord || '')
  const [definition, setDefinition] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const lookupWord = async () => {
    if (!word.trim()) return
    setIsLoading(true)
    // Placeholder - would call a dictionary API
    setTimeout(() => {
      setDefinition(`Definition of "${word}" would appear here from a dictionary API.`)
      setIsLoading(false)
      onDefine?.(word)
    }, 500)
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          placeholder="Enter word..."
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          onKeyDown={e => e.key === 'Enter' && lookupWord()}
        />
        <button 
          onClick={lookupWord}
          disabled={isLoading}
          className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? '...' : <BookOpen className="h-4 w-4" />}
        </button>
      </div>
      
      {definition && (
        <div className="p-3 rounded-md bg-muted/30 text-sm">
          {definition}
        </div>
      )}
    </div>
  )
}

export interface TranslateSelectionProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  targetLanguage?: string
  onTranslate?: (translation: string) => void
}

export function TranslateSelection({ text, targetLanguage = 'en', onTranslate, className, ...props }: TranslateSelectionProps) {
  const [translation, setTranslation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const translate = async () => {
    if (!text) return
    setIsLoading(true)
    // Placeholder - would call translation API
    setTimeout(() => {
      const result = `[Translation of "${text}" to ${targetLanguage}]`
      setTranslation(result)
      setIsLoading(false)
      onTranslate?.(result)
    }, 500)
  }
  
  useEffect(() => {
    if (text) translate()
  }, [text])
  
  if (!text) return null
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <div className="text-xs text-muted-foreground mb-2">Selected text:</div>
      <div className="p-2 rounded bg-muted/30 text-sm mb-3">{text}</div>
      
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Translating...</div>
      ) : translation ? (
        <>
          <div className="text-xs text-muted-foreground mb-2">Translation:</div>
          <div className="p-2 rounded bg-primary/10 text-sm">{translation}</div>
        </>
      ) : null}
    </div>
  )
}

// ============================================================================
// Text-to-Speech Controller
// ============================================================================

export interface TTSControllerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
}

export function TTSController({ onPlay, onPause, onStop, className, ...props }: TTSControllerProps) {
  const { state } = useReading()
  const [isPlaying, setIsPlaying] = useState(false)
  const [rate, setRate] = useState(1)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  
  useEffect(() => {
    const loadVoices = () => {
      setVoices(speechSynthesis.getVoices())
    }
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
    
    return () => {
      speechSynthesis.cancel()
    }
  }, [])
  
  const play = () => {
    if (!state.currentChapter?.content) return
    
    const utterance = new SpeechSynthesisUtterance(state.currentChapter.content.replace(/<[^>]*>/g, ''))
    utterance.rate = rate
    if (voice) utterance.voice = voice
    
    utterance.onend = () => setIsPlaying(false)
    
    speechSynthesis.speak(utterance)
    setIsPlaying(true)
    onPlay?.()
  }
  
  const pause = () => {
    speechSynthesis.pause()
    setIsPlaying(false)
    onPause?.()
  }
  
  const resume = () => {
    speechSynthesis.resume()
    setIsPlaying(true)
    onPlay?.()
  }
  
  const stop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    onStop?.()
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => isPlaying ? pause() : (speechSynthesis.paused ? resume() : play())}
          className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button
          onClick={stop}
          className="p-2 rounded-md border border-border hover:bg-muted"
        >
          <Square className="h-5 w-5" />
        </button>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          <select
            value={rate}
            onChange={e => setRate(parseFloat(e.target.value))}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
      
      {voices.length > 0 && (
        <select
          value={voice?.name || ''}
          onChange={e => {
            const selected = voices.find(v => v.name === e.target.value)
            setVoice(selected || null)
          }}
          className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
        >
          <option value="">Default voice</option>
          {voices.map(v => (
            <option key={v.name} value={v.name}>{v.name}</option>
          ))}
        </select>
      )}
    </div>
  )
}

// ============================================================================
// Reading Progress & Stats
// ============================================================================

export interface ReadingProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  showBar?: boolean
  showPercentage?: boolean
  showTimeLeft?: boolean
  wordsPerMinute?: number
}

export function ReadingProgress({ 
  showBar = true, 
  showPercentage = true,
  showTimeLeft = true,
  wordsPerMinute = 200,
  className, 
  ...props 
}: ReadingProgressProps) {
  const { state } = useReading()
  
  const percentage = state.totalPages > 0 
    ? Math.round((state.currentPage / state.totalPages) * 100) 
    : 0
  
  // Estimate remaining time based on remaining content
  const estimateTimeLeft = useMemo(() => {
    if (!state.book) return null
    
    const currentChapterIndex = state.book.chapters.findIndex(c => c.id === state.currentChapter?.id)
    if (currentChapterIndex === -1) return null
    
    const remainingChapters = state.book.chapters.slice(currentChapterIndex)
    const remainingWords = remainingChapters.reduce((sum, ch) => {
      const wordCount = ch.content.replace(/<[^>]*>/g, '').split(/\s+/).length
      return sum + wordCount
    }, 0)
    
    const minutes = Math.ceil(remainingWords / wordsPerMinute)
    if (minutes < 60) return `${minutes} min left`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m left`
  }, [state.book, state.currentChapter, wordsPerMinute])
  
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {showBar && (
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {showPercentage && <span>{percentage}% complete</span>}
        {showTimeLeft && estimateTimeLeft && <span>{estimateTimeLeft}</span>}
      </div>
    </div>
  )
}

export interface ReadingScheduleProps extends React.HTMLAttributes<HTMLDivElement> {
  dailyGoal?: number // pages per day
  onGoalChange?: (goal: number) => void
}

export function ReadingSchedule({ dailyGoal = 20, onGoalChange, className, ...props }: ReadingScheduleProps) {
  const { state } = useReading()
  const [goal, setGoal] = useState(dailyGoal)
  
  const pagesRemaining = state.totalPages - state.currentPage
  const daysToFinish = Math.ceil(pagesRemaining / goal)
  const finishDate = new Date()
  finishDate.setDate(finishDate.getDate() + daysToFinish)
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <h3 className="text-sm font-semibold mb-3">Reading Schedule</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Daily goal:</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const newGoal = Math.max(1, goal - 5)
                setGoal(newGoal)
                onGoalChange?.(newGoal)
              }}
              className="p-1 rounded border border-border hover:bg-muted text-xs"
            >
              -
            </button>
            <span className="text-sm font-medium w-16 text-center">{goal} pages</span>
            <button 
              onClick={() => {
                const newGoal = goal + 5
                setGoal(newGoal)
                onGoalChange?.(newGoal)
              }}
              className="p-1 rounded border border-border hover:bg-muted text-xs"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Pages remaining:</span>
          <span className="font-medium">{pagesRemaining}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated finish:</span>
          <span className="font-medium">{finishDate.toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Days to finish:</span>
          <span className="font-medium">{daysToFinish} days</span>
        </div>
      </div>
    </div>
  )
}
