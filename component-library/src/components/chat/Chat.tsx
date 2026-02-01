import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { ChevronDown, ChevronUp, RefreshCw, Check, X, FileText, ImageIcon, Video, Music } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ChatContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatContainer({ className, ...props }: ChatContainerProps) {
  return <div className={cn('flex h-full flex-col rounded-lg border border-border bg-surface', className)} {...props} />
}

export interface ChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatHeader({ className, ...props }: ChatHeaderProps) {
  return <div className={cn('border-b border-border px-4 py-3', className)} {...props} />
}

export interface ChatFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatFooter({ className, ...props }: ChatFooterProps) {
  return <div className={cn('border-t border-border px-4 py-3', className)} {...props} />
}

export interface ChatInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  onSubmit?: (value: string) => void
}

export function ChatInput({ className, onSubmit, onKeyDown, ...props }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault()
      const value = e.currentTarget.value.trim()
      if (value) {
        onSubmit(value)
        e.currentTarget.value = ''
      }
    }
    onKeyDown?.(e)
  }

  return (
    <textarea
      className={cn(
        'min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        'resize-none transition-colors',
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

export interface MessageListHandle {
  scrollToBottom: (behavior?: ScrollBehavior) => void
  scrollToTop: (behavior?: ScrollBehavior) => void
}

export interface MessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Auto-scroll to bottom when children change */
  autoScroll?: boolean
  /** Threshold from bottom to trigger auto-scroll (default: 100px) */
  autoScrollThreshold?: number
  /** Callback when user scrolls away from bottom */
  onScrollAwayFromBottom?: () => void
  /** Callback when user scrolls back to bottom */
  onScrollToBottom?: () => void
}

export const MessageList = forwardRef<MessageListHandle, MessageListProps>(
  ({ 
    className, 
    children, 
    autoScroll = true, 
    autoScrollThreshold = 100,
    onScrollAwayFromBottom,
    onScrollToBottom,
    ...props 
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isAtBottom, setIsAtBottom] = useState(true)
    const [showNewMessages, setShowNewMessages] = useState(false)
    const prevChildrenRef = useRef(children)
    
    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      scrollToBottom: (behavior: ScrollBehavior = 'smooth') => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior,
          })
        }
      },
      scrollToTop: (behavior: ScrollBehavior = 'smooth') => {
        containerRef.current?.scrollTo({ top: 0, behavior })
      },
    }), [])

    // Check if scrolled to bottom
    const checkIsAtBottom = useCallback(() => {
      if (!containerRef.current) return true
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      return scrollHeight - scrollTop - clientHeight < autoScrollThreshold
    }, [autoScrollThreshold])

    // Handle scroll events
    const handleScroll = useCallback(() => {
      const atBottom = checkIsAtBottom()
      if (atBottom !== isAtBottom) {
        setIsAtBottom(atBottom)
        if (atBottom) {
          setShowNewMessages(false)
          onScrollToBottom?.()
        } else {
          onScrollAwayFromBottom?.()
        }
      }
    }, [checkIsAtBottom, isAtBottom, onScrollAwayFromBottom, onScrollToBottom])

    // Auto-scroll when children change
    useEffect(() => {
      if (children !== prevChildrenRef.current) {
        prevChildrenRef.current = children
        
        if (autoScroll && isAtBottom && containerRef.current) {
          // Use requestAnimationFrame for smoother scroll
          requestAnimationFrame(() => {
            containerRef.current?.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: 'smooth',
            })
          })
        } else if (!isAtBottom) {
          setShowNewMessages(true)
        }
      }
    }, [children, autoScroll, isAtBottom])

    // Scroll to new messages indicator
    const handleNewMessagesClick = () => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }

    return (
      <div className="relative flex-1">
        <div 
          ref={containerRef}
          className={cn('h-full space-y-3 overflow-y-auto px-4 py-3 scrollbar-thin', className)} 
          onScroll={handleScroll}
          {...props}
        >
          {children}
        </div>
        
        {/* New messages indicator */}
        {showNewMessages && (
          <button
            onClick={handleNewMessagesClick}
            className={cn(
              'absolute bottom-4 left-1/2 -translate-x-1/2',
              'rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground',
              'shadow-lg transition-all hover:bg-primary/90',
              'animate-in fade-in slide-in-from-bottom-2',
              'flex items-center gap-1'
            )}
          >
            <ChevronDown className="h-3 w-3" /> New messages
          </button>
        )}
      </div>
    )
  }
)

MessageList.displayName = 'MessageList'

export interface MessageItemProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'incoming' | 'outgoing'
}

export function MessageItem({ variant = 'incoming', className, ...props }: MessageItemProps) {
  return <div className={cn('flex', variant === 'outgoing' ? 'justify-end' : 'justify-start', className)} {...props} />
}

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'incoming' | 'outgoing'
  status?: 'sent' | 'delivered' | 'read'
}

export function MessageBubble({ variant = 'incoming', status, className, children, ...props }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'max-w-[70%] rounded-lg px-3 py-2 text-sm',
        'transition-colors duration-200 break-words overflow-hidden',
        variant === 'outgoing'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-foreground',
        className
      )}
      {...props}
    >
      {children}
      {status && (
        <div className="flex justify-end mt-1 opacity-70">
          {status === 'sent' && <Check className="h-3 w-3" />}
          {status === 'delivered' && <><Check className="h-3 w-3" /><Check className="h-3 w-3 -ml-1.5" /></>}
          {status === 'read' && <span className="text-blue-400 flex"><Check className="h-3 w-3" /><Check className="h-3 w-3 -ml-1.5" /></span>}
        </div>
      )}
    </div>
  )
}

export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
}

const getInitials = (name?: string) => {
  if (!name) return ''
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

export function MessageAvatar({ src, alt, name, className, ...props }: MessageAvatarProps) {
  const initials = getInitials(name || alt)
  
  return (
    <div className={cn('h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center text-xs font-medium', className)} {...props}>
      {src ? (
        <img src={src} alt={alt || name || ''} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

export interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MessageActions({ className, children, ...props }: MessageActionsProps) {
  return (
    <div className={cn('flex items-center gap-2 text-xs text-muted-foreground flex-wrap mt-2', className)} {...props}>
      {children}
    </div>
  )
}

export interface MessageReactionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MessageReactions({ className, children, ...props }: MessageReactionsProps) {
  return (
    <div className={cn('flex items-center gap-1 text-xs text-muted-foreground flex-wrap mt-2', className)} {...props}>
      {children}
    </div>
  )
}

export interface TypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of dots (default: 3) */
  dots?: number
  /** Optional avatar image */
  avatar?: string
  /** Avatar alt text */
  avatarAlt?: string
  /** Users currently typing */
  users?: string[]
}

export function TypingIndicator({ dots = 3, avatar, avatarAlt, users, className, ...props }: TypingIndicatorProps) {
  const typingText = users && users.length > 0 ? (
    users.length === 1 
      ? `${users[0]} is typing` 
      : users.length === 2 
        ? `${users[0]} and ${users[1]} are typing`
        : `${users[0]} and ${users.length - 1} others are typing`
  ) : null
  
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {avatar && (
        <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
          <img src={avatar} alt={avatarAlt || ''} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-1">
        {Array.from({ length: dots }).map((_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      {typingText && <span className="text-xs text-muted-foreground ml-1">{typingText}</span>}
    </div>
  )
}

export interface StreamingTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  /** Characters per second (default: 30) */
  speed?: number
  /** Called when streaming completes */
  onComplete?: () => void
}

export function StreamingText({ text, speed = 30, onComplete, className, ...props }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    if (!text) return
    
    setDisplayedText('')
    setIsComplete(false)
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, 1000 / speed)
    
    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <div className={cn('text-sm', className)} {...props}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 ml-0.5 bg-foreground animate-pulse" />
      )}
    </div>
  )
}

export interface MarkdownRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  /** Allow safe HTML tags (default: false) */
  allowHtml?: boolean
}

// Simple HTML sanitizer - allows only safe tags and attributes
const sanitizeHtml = (html: string): string => {
  // Allowed tags and their allowed attributes
  const allowedTags: Record<string, string[]> = {
    'p': [],
    'br': [],
    'b': [],
    'strong': [],
    'i': [],
    'em': [],
    'u': [],
    's': [],
    'strike': [],
    'code': ['class'],
    'pre': ['class'],
    'ul': [],
    'ol': ['start'],
    'li': [],
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'h1': [],
    'h2': [],
    'h3': [],
    'h4': [],
    'h5': [],
    'h6': [],
    'blockquote': [],
    'span': ['class'],
    'div': ['class'],
    'table': [],
    'thead': [],
    'tbody': [],
    'tr': [],
    'th': ['colspan', 'rowspan'],
    'td': ['colspan', 'rowspan'],
    'hr': [],
  }
  
  // Dangerous patterns to remove
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /on\w+\s*=/gi,
  ]
  
  let sanitized = html
  
  // Remove dangerous patterns
  for (const pattern of dangerousPatterns) {
    sanitized = sanitized.replace(pattern, '')
  }
  
  // Process tags
  sanitized = sanitized.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tagName) => {
    const tag = tagName.toLowerCase()
    
    // Check if tag is allowed
    if (!allowedTags[tag]) {
      return '' // Remove disallowed tags entirely
    }
    
    // For closing tags, just return the clean closing tag
    if (match.startsWith('</')) {
      return `</${tag}>`
    }
    
    // For opening tags, filter attributes
    const allowedAttrs = allowedTags[tag]
    if (allowedAttrs.length === 0) {
      // Self-closing tags
      if (['br', 'hr', 'img'].includes(tag)) {
        return `<${tag} />`
      }
      return `<${tag}>`
    }
    
    // Extract and filter attributes
    const attrMatches = match.match(/(\w+)=["']([^"']*)["']/g) || []
    const filteredAttrs = attrMatches
      .map(attr => {
        const [name, value] = attr.split('=')
        const attrName = name.toLowerCase()
        
        // Check if attribute is allowed
        if (!allowedAttrs.includes(attrName)) {
          return null
        }
        
        // Additional validation for href/src
        if (attrName === 'href' || attrName === 'src') {
          const cleanValue = value.replace(/["']/g, '')
          // Only allow http, https, mailto, and relative URLs
          if (!/^(https?:|mailto:|\/|#)/.test(cleanValue) && !cleanValue.startsWith('.')) {
            return null
          }
        }
        
        return attr
      })
      .filter(Boolean)
      .join(' ')
    
    const isSelfClosing = ['br', 'hr', 'img'].includes(tag)
    return filteredAttrs 
      ? `<${tag} ${filteredAttrs}${isSelfClosing ? ' /' : ''}>` 
      : `<${tag}${isSelfClosing ? ' /' : ''}>`
  })
  
  return sanitized
}

export function MarkdownRenderer({ content, allowHtml = false, className, ...props }: MarkdownRendererProps) {
  // Basic markdown rendering - headers, bold, italic, code, links, lists
  const renderMarkdown = (md: string): React.ReactNode => {
    const lines = md.split('\n')
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeContent = ''
    let codeLanguage = ''
    
    lines.forEach((line, i) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim()
          codeContent = ''
        } else {
          inCodeBlock = false
          elements.push(
            <ChatCodeBlock key={i} code={codeContent.trim()} language={codeLanguage} />
          )
        }
        return
      }
      
      if (inCodeBlock) {
        codeContent += line + '\n'
        return
      }
      
      // Headers
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>)
        return
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h2>)
        return
      }
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>)
        return
      }
      
      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(<li key={i} className="ml-4">{renderInlineMarkdown(line.slice(2))}</li>)
        return
      }
      
      // Numbered lists
      const numberedMatch = line.match(/^\d+\.\s/)
      if (numberedMatch) {
        elements.push(<li key={i} className="ml-4 list-decimal">{renderInlineMarkdown(line.slice(numberedMatch[0].length))}</li>)
        return
      }
      
      // Empty lines
      if (!line.trim()) {
        elements.push(<br key={i} />)
        return
      }
      
      // Regular paragraph
      elements.push(<p key={i} className="my-1">{renderInlineMarkdown(line)}</p>)
    })
    
    return elements
  }
  
  // Inline markdown: bold, italic, code, links
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let remaining = text
    let key = 0
    
    while (remaining) {
      // Inline code
      const codeMatch = remaining.match(/`([^`]+)`/)
      // Bold
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
      // Italic
      const italicMatch = remaining.match(/\*([^*]+)\*/)
      // Links
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
      
      // Find earliest match
      const matches = [
        { match: codeMatch, type: 'code' },
        { match: boldMatch, type: 'bold' },
        { match: italicMatch, type: 'italic' },
        { match: linkMatch, type: 'link' },
      ].filter(m => m.match)
      
      if (matches.length === 0) {
        parts.push(remaining)
        break
      }
      
      const earliest = matches.reduce((min, curr) => 
        (curr.match!.index ?? Infinity) < (min.match!.index ?? Infinity) ? curr : min
      )
      
      const idx = earliest.match!.index!
      
      // Add text before match
      if (idx > 0) {
        parts.push(remaining.slice(0, idx))
      }
      
      // Add formatted text
      if (earliest.type === 'code') {
        parts.push(<code key={key++} className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{earliest.match![1]}</code>)
      } else if (earliest.type === 'bold') {
        parts.push(<strong key={key++}>{earliest.match![1]}</strong>)
      } else if (earliest.type === 'italic') {
        parts.push(<em key={key++}>{earliest.match![1]}</em>)
      } else if (earliest.type === 'link') {
        parts.push(
          <a key={key++} href={earliest.match![2]} className="text-primary underline" target="_blank" rel="noopener noreferrer">
            {earliest.match![1]}
          </a>
        )
      }
      
      remaining = remaining.slice(idx + earliest.match![0].length)
    }
    
    return parts
  }
  
  // Apply sanitization if allowHtml is enabled
  const processedContent = allowHtml ? sanitizeHtml(content) : content

  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)} {...props}>
      {renderMarkdown(processedContent)}
    </div>
  )
}

export interface ChatCodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string
  language?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Max lines before collapsible (0 = never collapse) */
  collapsibleThreshold?: number
  /** Initially expanded if collapsible */
  defaultExpanded?: boolean
}

export function ChatCodeBlock({ 
  code, 
  language, 
  showLineNumbers = false,
  collapsibleThreshold = 15,
  defaultExpanded = false,
  className, 
  ...props 
}: ChatCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(defaultExpanded)
  
  const lines = code.split('\n')
  const isLong = collapsibleThreshold > 0 && lines.length > collapsibleThreshold
  const displayLines = isLong && !expanded ? lines.slice(0, collapsibleThreshold) : lines
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative group rounded-md bg-muted my-2', className)}>
      {language && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 text-xs text-muted-foreground">
          <span>{language}</span>
          <div className="flex items-center gap-2">
            {isLong && (
              <span className="text-muted-foreground/60">{lines.length} lines</span>
            )}
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground flex items-center gap-1"
            >
              {copied ? <><Check className="h-3 w-3" /> Copied</> : 'Copy'}
            </button>
          </div>
        </div>
      )}
      <pre className={cn('overflow-x-auto px-3 py-2 text-xs', !language && 'rounded-md')} {...props}>
        <code className={cn('block', showLineNumbers && 'pl-10')}>
          {displayLines.map((line, i) => (
            <div key={i} className="relative">
              {showLineNumbers && (
                <span className="absolute left-0 w-8 pr-2 text-right text-muted-foreground/50 select-none">
                  {i + 1}
                </span>
              )}
              {line || ' '}
            </div>
          ))}
        </code>
      </pre>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-1.5 text-xs text-center text-muted-foreground hover:text-foreground border-t border-border/50 transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? <><ChevronUp className="h-3 w-3" /> Show less ({collapsibleThreshold} lines)</> : <><ChevronDown className="h-3 w-3" /> Show more ({lines.length - collapsibleThreshold} more lines)</>}
        </button>
      )}
    </div>
  )
}

export interface AttachmentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  size?: string | number
  type?: 'file' | 'image' | 'video' | 'audio' | 'document'
  url?: string
  onRemove?: () => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function AttachmentPreview({ name, size, type = 'file', url, onRemove, className, ...props }: AttachmentPreviewProps) {
  const icons = {
    file: <FileText className="h-4 w-4" />,
    image: <ImageIcon className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    audio: <Music className="h-4 w-4" />,
    document: <FileText className="h-4 w-4" />,
  }
  
  const displaySize = typeof size === 'number' ? formatFileSize(size) : size
  
  return (
    <div className={cn('flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-xs group', className)} {...props}>
      <div className="flex items-center gap-2">
        <span>{icons[type]}</span>
        <span className="truncate max-w-[150px]">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {displaySize && <span className="text-muted-foreground">{displaySize}</span>}
        {onRemove && (
          <button 
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

export interface SearchInConversationProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (query: string) => void
  results?: number
  currentResult?: number
  onPrevious?: () => void
  onNext?: () => void
}

export function SearchInConversation({ 
  className, 
  onSearch, 
  results, 
  currentResult,
  onPrevious,
  onNext,
  onChange,
  ...props 
}: SearchInConversationProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    onSearch?.(e.target.value)
  }

  return (
    <div className="flex items-center gap-2">
      <input 
        className={cn('flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm', className)} 
        onChange={handleChange}
        {...props} 
      />
      {results !== undefined && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{currentResult ?? 0}/{results}</span>
          <button onClick={onPrevious} className="p-1 hover:text-foreground" disabled={!results}><ChevronUp className="h-3 w-3" /></button>
          <button onClick={onNext} className="p-1 hover:text-foreground" disabled={!results}><ChevronDown className="h-3 w-3" /></button>
        </div>
      )}
    </div>
  )
}

export interface RegenerateActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RegenerateAction({ className, children, ...props }: RegenerateActionProps) {
  return (
    <button 
      className={cn(
        'inline-flex items-center gap-1 text-xs text-primary hover:underline transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      , className)} 
      {...props}
    >
      <RefreshCw className="h-3 w-3" />
      {children || 'Regenerate'}
    </button>
  )
}

export interface TokenCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  tokens: number
  maxTokens?: number
  showCost?: boolean
  costPerThousand?: number
}

export function TokenCounter({ tokens, maxTokens, showCost, costPerThousand = 0.002, className, ...props }: TokenCounterProps) {
  const percentage = maxTokens ? (tokens / maxTokens) * 100 : 0
  const cost = showCost ? (tokens / 1000) * costPerThousand : 0
  
  return (
    <div className={cn('flex items-center gap-2 text-xs text-muted-foreground', className)} {...props}>
      <span className={cn(
        percentage > 90 && 'text-destructive',
        percentage > 75 && percentage <= 90 && 'text-warning'
      )}>
        {tokens.toLocaleString()} tokens
        {maxTokens && ` / ${maxTokens.toLocaleString()}`}
      </span>
      {showCost && <span>(~${cost.toFixed(4)})</span>}
    </div>
  )
}

export interface TranscriptExportProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  format?: 'json' | 'markdown' | 'txt'
}

export function TranscriptExport({ format = 'markdown', className, children, ...props }: TranscriptExportProps) {
  return (
    <button 
      className={cn('inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors', className)} 
      {...props}
    >
      <span>[Export]</span>
      {children || `Export as .${format}`}
    </button>
  )
}

export interface PinboardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Pinboard({ className, ...props }: PinboardProps) {
  return <div className={cn('rounded-md border border-border bg-surface p-3 text-sm', className)} {...props} />
}

export interface SavedMessagesProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SavedMessages({ className, ...props }: SavedMessagesProps) {
  return <div className={cn('space-y-2', className)} {...props} />
}

export interface ConversationMetaProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ConversationMeta({ className, ...props }: ConversationMetaProps) {
  return <div className={cn('text-xs text-muted-foreground', className)} {...props} />
}

export interface MessageThreadProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MessageThread({ className, ...props }: MessageThreadProps) {
  return <div className={cn('space-y-2 border-l-2 border-muted pl-3 ml-4', className)} {...props} />
}

