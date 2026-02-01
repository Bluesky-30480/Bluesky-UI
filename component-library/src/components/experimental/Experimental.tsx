import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Search, Mic, MicOff, Volume2, VolumeX, Video, Pause, Play, Square, Clipboard, Zap, HelpCircle, Clock, RefreshCw, Edit, Trash2, Package, ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'

// Speech Recognition types (Web Speech API)
interface SpeechRecognitionInterface extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEventInterface) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventInterface) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

interface SpeechRecognitionEventInterface {
  results: SpeechRecognitionResultListInterface
  resultIndex: number
}

interface SpeechRecognitionResultListInterface {
  length: number
  item: (index: number) => SpeechRecognitionResultInterface
  [index: number]: SpeechRecognitionResultInterface
}

interface SpeechRecognitionResultInterface {
  isFinal: boolean
  length: number
  item: (index: number) => SpeechRecognitionAlternativeInterface
  [index: number]: SpeechRecognitionAlternativeInterface
}

interface SpeechRecognitionAlternativeInterface {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEventInterface {
  error: string
  message: string
}

// Extend Window for Speech Recognition APIs
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInterface
    webkitSpeechRecognition: new () => SpeechRecognitionInterface
  }
}

// ============================================================================
// Types
// ============================================================================

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: string
  shortcut?: string[]
  action?: () => void
  category?: string
  keywords?: string[]
}

export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export interface RecordingState {
  isRecording: boolean
  duration: number
  mediaStream?: MediaStream
  mediaRecorder?: MediaRecorder
  chunks: Blob[]
}

export interface PlaybookStep {
  id: string
  type: 'action' | 'condition' | 'wait' | 'loop'
  label: string
  config?: Record<string, unknown>
}

export interface DesignToken {
  name: string
  value: string
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'border' | 'other'
  description?: string
}

// ============================================================================
// Command Bar
// ============================================================================

export interface CommandBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  commands?: CommandItem[]
  placeholder?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect?: (command: CommandItem) => void
}

export function CommandBar({ 
  commands = [],
  placeholder = 'Type a command or search...',
  open = false,
  onOpenChange,
  onSelect,
  className, 
  ...props 
}: CommandBarProps) {
  const [isOpen, setIsOpen] = useState(open)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    setIsOpen(open)
  }, [open])
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const newOpen = !isOpen
        setIsOpen(newOpen)
        onOpenChange?.(newOpen)
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        onOpenChange?.(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onOpenChange])
  
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])
  
  const filteredCommands = useMemo(() => {
    if (!query) return commands
    
    const lowerQuery = query.toLowerCase()
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(lowerQuery) ||
      cmd.description?.toLowerCase().includes(lowerQuery) ||
      cmd.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    )
  }, [commands, query])
  
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredCommands.forEach(cmd => {
      const category = cmd.category || 'General'
      if (!groups[category]) groups[category] = []
      groups[category].push(cmd)
    })
    return groups
  }, [filteredCommands])
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault()
      const cmd = filteredCommands[selectedIndex]
      onSelect?.(cmd)
      cmd.action?.()
      setIsOpen(false)
      onOpenChange?.(false)
      setQuery('')
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => { setIsOpen(false); onOpenChange?.(false) }}
      />
      
      {/* Command panel */}
      <div 
        className={cn(
          'relative w-full max-w-lg rounded-lg border border-border bg-surface shadow-2xl overflow-hidden',
          className
        )} 
        {...props}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-muted-foreground">
            Esc
          </kbd>
        </div>
        
        {/* Commands list */}
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category}>
              <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {category}
              </div>
              {items.map((cmd) => {
                const globalIndex = filteredCommands.indexOf(cmd)
                return (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      onSelect?.(cmd)
                      cmd.action?.()
                      setIsOpen(false)
                      onOpenChange?.(false)
                      setQuery('')
                    }}
                    className={cn(
                      'flex items-center justify-between px-4 py-2 cursor-pointer',
                      globalIndex === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {cmd.icon && <span>{cmd.icon}</span>}
                      <div>
                        <div className="text-sm font-medium">{cmd.label}</div>
                        {cmd.description && (
                          <div className="text-xs text-muted-foreground">{cmd.description}</div>
                        )}
                      </div>
                    </div>
                    {cmd.shortcut && (
                      <div className="flex items-center gap-1">
                        {cmd.shortcut.map((key, i) => (
                          <kbd key={i} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No commands found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Natural Language Form
// ============================================================================

export interface NaturalLanguageFormProps extends React.HTMLAttributes<HTMLDivElement> {
  fields?: { name: string; label: string; type: string }[]
  onParse?: (parsed: Record<string, unknown>) => void
  placeholder?: string
}

export function NaturalLanguageForm({ 
  fields = [],
  onParse,
  placeholder = 'Describe what you want in natural language...',
  className, 
  ...props 
}: NaturalLanguageFormProps) {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<Record<string, unknown>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleParse = () => {
    setIsProcessing(true)
    
    // Simple extraction - in production would use NLP/LLM
    const result: Record<string, unknown> = {}
    fields.forEach(field => {
      // Look for patterns like "field: value" or "field is value"
      const patterns = [
        new RegExp(`${field.label}[:\\s]+([\\w\\s@.]+)`, 'i'),
        new RegExp(`${field.name}[:\\s]+([\\w\\s@.]+)`, 'i'),
      ]
      
      for (const pattern of patterns) {
        const match = input.match(pattern)
        if (match) {
          result[field.name] = match[1].trim()
          break
        }
      }
    })
    
    setParsed(result)
    onParse?.(result)
    setIsProcessing(false)
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="p-4 border-b border-border">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
        />
        <button
          onClick={handleParse}
          disabled={!input || isProcessing}
          className="mt-3 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Parse'}
        </button>
      </div>
      
      {Object.keys(parsed).length > 0 && (
        <div className="p-4 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Extracted Fields</h4>
          {fields.map(field => (
            <div key={field.name} className="flex items-center justify-between">
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type={field.type}
                value={String(parsed[field.name] || '')}
                onChange={e => setParsed({ ...parsed, [field.name]: e.target.value })}
                className="w-48 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Voice Input
// ============================================================================

export interface VoiceInputHandle {
  start: () => void
  stop: () => void
  isListening: boolean
}

export interface VoiceInputProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onError'> {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onChange?: (result: VoiceRecognitionResult) => void
  onError?: (error: Error) => void
}

export const VoiceInput = forwardRef<VoiceInputHandle, VoiceInputProps>(function VoiceInput({ 
  lang = 'en-US',
  continuous = false,
  interimResults = true,
  onChange,
  onError,
  className,
  ...props 
}, ref) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI()
        recognitionRef.current.lang = lang
        recognitionRef.current.continuous = continuous
        recognitionRef.current.interimResults = interimResults
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEventInterface) => {
          const result = event.results[event.results.length - 1]
          const transcriptText = result[0].transcript
          const confidence = result[0].confidence
          const isFinal = result.isFinal
          
          setTranscript(transcriptText)
          onChange?.({ transcript: transcriptText, confidence, isFinal })
        }
        
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEventInterface) => {
          onError?.(new Error(event.error))
          setIsListening(false)
        }
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
    
    return () => {
      recognitionRef.current?.stop()
    }
  }, [lang, continuous, interimResults, onChange, onError])
  
  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
      setIsListening(true)
      setTranscript('')
    }
  }, [isListening])
  
  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])
  
  useImperativeHandle(ref, () => ({
    start,
    stop,
    isListening,
  }), [start, stop, isListening])
  
  const toggle = () => {
    if (isListening) stop()
    else start()
  }
  
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={toggle}
        className={cn(
          'flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors',
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'border border-border hover:bg-muted',
          className
        )}
        {...props}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
      </button>
      
      {transcript && (
        <span className="text-sm text-muted-foreground truncate max-w-xs">
          "{transcript}"
        </span>
      )}
    </div>
  )
})

// ============================================================================
// Voice Output (Text-to-Speech)
// ============================================================================

export interface VoiceOutputProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  text?: string
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
}

export function VoiceOutput({ 
  text,
  voice,
  rate = 1,
  pitch = 1,
  volume = 1,
  onStart,
  onEnd,
  className,
  ...props 
}: VoiceOutputProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices())
    }
    
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])
  
  const speak = () => {
    if (!text) return
    
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume
    
    if (voice) {
      const selectedVoice = voices.find(v => v.name === voice)
      if (selectedVoice) utterance.voice = selectedVoice
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true)
      onStart?.()
    }
    
    utterance.onend = () => {
      setIsSpeaking(false)
      onEnd?.()
    }
    
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }
  
  const stop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }
  
  return (
    <button 
      onClick={isSpeaking ? stop : speak}
      disabled={!text}
      className={cn(
        'flex items-center gap-2 rounded-md px-4 py-2 text-sm border transition-colors',
        isSpeaking 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'border-border hover:bg-muted',
        !text && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span>{isSpeaking ? 'Stop' : 'Speak'}</span>
    </button>
  )
}

// ============================================================================
// Screen Recorder
// ============================================================================

export interface ScreenRecorderHandle {
  start: () => Promise<void>
  stop: () => void
  pause: () => void
  resume: () => void
}

export interface ScreenRecorderProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onError'> {
  audio?: boolean
  videoCodec?: string
  audioBitsPerSecond?: number
  videoBitsPerSecond?: number
  onStart?: () => void
  onStop?: (blob: Blob) => void
  onError?: (error: Error) => void
}

export const ScreenRecorder = forwardRef<ScreenRecorderHandle, ScreenRecorderProps>(function ScreenRecorder({ 
  audio = true,
  videoCodec = 'video/webm;codecs=vp9',
  audioBitsPerSecond = 128000,
  videoBitsPerSecond = 2500000,
  onStart,
  onStop,
  onError,
  className,
  ...props 
}, ref) {
  const [state, setState] = useState<'idle' | 'recording' | 'paused'>('idle')
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      mediaRecorderRef.current?.stop()
    }
  }, [])
  
  const start = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: audio,
      })
      
      const options: MediaRecorderOptions = {
        mimeType: videoCodec,
        audioBitsPerSecond,
        videoBitsPerSecond,
      }
      
      const mediaRecorder = new MediaRecorder(displayStream, options)
      chunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: videoCodec })
        onStop?.(blob)
        displayStream.getTracks().forEach(track => track.stop())
        setState('idle')
        setDuration(0)
        if (timerRef.current) clearInterval(timerRef.current)
      }
      
      displayStream.getVideoTracks()[0].onended = () => {
        mediaRecorder.stop()
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000)
      
      setState('recording')
      onStart?.()
      
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)
      
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Failed to start recording'))
    }
  }
  
  const stop = () => {
    mediaRecorderRef.current?.stop()
  }
  
  const pause = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause()
      setState('paused')
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }
  
  const resume = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume()
      setState('recording')
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)
    }
  }
  
  useImperativeHandle(ref, () => ({
    start,
    stop,
    pause,
    resume,
  }), [])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="flex items-center gap-2">
      {state === 'idle' ? (
        <button 
          onClick={start}
          className={cn(
            'flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted',
            className
          )}
          {...props}
        >
          <Video className="h-4 w-4" />
          <span>Record Screen</span>
        </button>
      ) : (
        <>
          <button 
            onClick={state === 'recording' ? pause : resume}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            {state === 'recording' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button 
            onClick={stop}
            className="flex items-center gap-2 rounded-md bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600"
          >
            <Square className="h-4 w-4" />
            <span>Stop</span>
          </button>
          <span className={cn(
            'font-mono text-sm',
            state === 'recording' && 'text-red-500'
          )}>
            {formatTime(duration)}
          </span>
        </>
      )}
    </div>
  )
})

// ============================================================================
// Smart Tooltip
// ============================================================================

export interface SmartTooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content?: React.ReactNode
  trigger?: 'hover' | 'click' | 'focus'
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  interactive?: boolean
}

export function SmartTooltip({ 
  content,
  trigger = 'hover',
  position = 'top',
  delay = 200,
  interactive = false,
  children,
  className, 
  ...props 
}: SmartTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  
  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }
  
  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!interactive) {
      setIsVisible(false)
    } else {
      timeoutRef.current = setTimeout(() => setIsVisible(false), 100)
    }
  }
  
  const getTriggerProps = () => {
    switch (trigger) {
      case 'hover':
        return { onMouseEnter: showTooltip, onMouseLeave: hideTooltip }
      case 'click':
        return { onClick: () => setIsVisible(!isVisible) }
      case 'focus':
        return { onFocus: showTooltip, onBlur: hideTooltip }
    }
  }
  
  const positionStyles: Record<typeof position, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }
  
  return (
    <div className="relative inline-block" ref={triggerRef} {...getTriggerProps()}>
      {children}
      {isVisible && content && (
        <div 
          ref={tooltipRef}
          className={cn(
            'absolute z-50 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-lg',
            positionStyles[position],
            interactive && 'pointer-events-auto',
            className
          )}
          onMouseEnter={() => interactive && clearTimeout(timeoutRef.current!)}
          onMouseLeave={() => interactive && setIsVisible(false)}
          {...props}
        >
          {content}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Form Autofill
// ============================================================================

export interface FormAutofillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  profiles?: { id: string; name: string; data: Record<string, string> }[]
  onFill?: (data: Record<string, string>) => void
}

export function FormAutofill({ profiles = [], onFill, className, ...props }: FormAutofillProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted',
          className
        )}
        {...props}
      >
        <span>✨</span>
        <span>Autofill</span>
      </button>
      
      {isOpen && profiles.length > 0 && (
        <div className="absolute top-full mt-1 left-0 z-10 rounded-md border border-border bg-surface shadow-lg min-w-40">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => {
                onFill?.(profile.data)
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
            >
              {profile.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Agent Playbook
// ============================================================================

export interface AgentPlaybookProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  steps?: PlaybookStep[]
  onRun?: () => void
  onEdit?: (step: PlaybookStep) => void
  onDelete?: (stepId: string) => void
  onAdd?: () => void
}

export function AgentPlaybook({ 
  name = 'Untitled Playbook',
  steps = [],
  onRun,
  onEdit,
  onDelete,
  onAdd,
  className, 
  ...props 
}: AgentPlaybookProps) {
  const stepIcons: Record<PlaybookStep['type'], React.ReactNode> = {
    action: <Zap className="h-4 w-4" />,
    condition: <HelpCircle className="h-4 w-4" />,
    wait: <Clock className="h-4 w-4" />,
    loop: <RefreshCw className="h-4 w-4" />,
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Clipboard className="h-5 w-5" />
          <h3 className="font-semibold text-sm">{name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onRun && (
            <button
              onClick={onRun}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90"
            >
              <Play className="h-3 w-3" /> Run
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        {steps.map((step, i) => (
          <div 
            key={step.id}
            className="flex items-center gap-3 p-3 rounded-md border border-border bg-background group"
          >
            <span className="text-muted-foreground text-xs w-5">{i + 1}</span>
            <span>{stepIcons[step.type]}</span>
            <span className="flex-1 text-sm">{step.label}</span>
            
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(step)}
                  className="p-1 rounded hover:bg-muted text-xs"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(step.id)}
                  className="p-1 rounded hover:bg-muted text-xs"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {onAdd && (
          <button
            onClick={onAdd}
            className="w-full py-2 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Step
          </button>
        )}
        
        {steps.length === 0 && !onAdd && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No steps in playbook
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Components Schema
// ============================================================================

export interface ComponentsSchemaProps extends React.HTMLAttributes<HTMLDivElement> {
  schema?: {
    name: string
    props: { name: string; type: string; required?: boolean; description?: string }[]
  }[]
}

export function ComponentsSchema({ schema = [], className, ...props }: ComponentsSchemaProps) {
  const [expandedComponents, setExpandedComponents] = useState<string[]>([])
  
  const toggleComponent = (name: string) => {
    if (expandedComponents.includes(name)) {
      setExpandedComponents(expandedComponents.filter(n => n !== name))
    } else {
      setExpandedComponents([...expandedComponents, name])
    }
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-[#1a1a1a] overflow-hidden', className)} {...props}>
      <div className="px-4 py-3 border-b border-border bg-[#252525]">
        <h3 className="text-sm font-mono text-gray-300">components.schema</h3>
      </div>
      
      <div className="p-2 max-h-80 overflow-y-auto font-mono text-xs">
        {schema.map(component => (
          <div key={component.name} className="mb-1">
            <div 
              onClick={() => toggleComponent(component.name)}
              className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-[#2a2a2a]"
            >
              <span className="text-gray-500">
                {expandedComponents.includes(component.name) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </span>
              <span className="text-blue-400">{component.name}</span>
              <span className="text-gray-500">({component.props.length} props)</span>
            </div>
            
            {expandedComponents.includes(component.name) && (
              <div className="ml-6 mt-1 space-y-1">
                {component.props.map(prop => (
                  <div key={prop.name} className="flex items-center gap-2 px-2 py-0.5">
                    <span className="text-purple-400">{prop.name}</span>
                    {prop.required && <span className="text-red-400">*</span>}
                    <span className="text-gray-500">:</span>
                    <span className="text-green-400">{prop.type}</span>
                    {prop.description && (
                      <span className="text-gray-600 truncate max-w-xs">// {prop.description}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Tokens JSON
// ============================================================================

export interface TokensJsonProps extends React.HTMLAttributes<HTMLDivElement> {
  tokens?: DesignToken[]
  editable?: boolean
  onTokenChange?: (token: DesignToken, newValue: string) => void
}

export function TokensJson({ 
  tokens = [],
  editable = false,
  onTokenChange,
  className, 
  ...props 
}: TokensJsonProps) {
  const groupedTokens = useMemo(() => {
    const groups: Record<string, DesignToken[]> = {}
    tokens.forEach(token => {
      if (!groups[token.type]) groups[token.type] = []
      groups[token.type].push(token)
    })
    return groups
  }, [tokens])
  
  return (
    <div className={cn('rounded-lg border border-border bg-[#1a1a1a] overflow-hidden', className)} {...props}>
      <div className="px-4 py-3 border-b border-border bg-[#252525]">
        <h3 className="text-sm font-mono text-gray-300">tokens.json</h3>
      </div>
      
      <div className="p-4 max-h-80 overflow-y-auto font-mono text-xs space-y-4">
        {Object.entries(groupedTokens).map(([type, groupTokens]) => (
          <div key={type}>
            <div className="text-blue-400 mb-2">"{type}": {'{'}</div>
            <div className="ml-4 space-y-1">
              {groupTokens.map(token => (
                <div key={token.name} className="flex items-center gap-2">
                  <span className="text-purple-400">"{token.name}"</span>
                  <span className="text-gray-500">:</span>
                  {token.type === 'color' && (
                    <span 
                      className="inline-block w-3 h-3 rounded border border-gray-600"
                      style={{ backgroundColor: token.value }}
                    />
                  )}
                  {editable ? (
                    <input
                      type={token.type === 'color' ? 'color' : 'text'}
                      value={token.value}
                      onChange={e => onTokenChange?.(token, e.target.value)}
                      className="bg-transparent text-green-400 border-b border-gray-600 focus:border-green-400 outline-none px-1"
                    />
                  ) : (
                    <span className="text-green-400">"{token.value}"</span>
                  )}
                  {token.description && (
                    <span className="text-gray-600">// {token.description}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-blue-400">{'}'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Theme Loader
// ============================================================================

export interface ThemeLoaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onLoad'> {
  themes?: { id: string; name: string; preview?: string }[]
  currentTheme?: string
  onLoad?: (themeId: string) => void
  onImport?: (file: File) => void
}

export function ThemeLoader({ 
  themes = [],
  currentTheme,
  onLoad,
  onImport,
  className, 
  ...props 
}: ThemeLoaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Theme Loader</h3>
        {onImport && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".json,.css"
              onChange={e => {
                if (e.target.files?.[0]) onImport(e.target.files[0])
              }}
              className="hidden"
            />
            <button
              onClick={() => inputRef.current?.click()}
              className="text-xs text-primary hover:underline"
            >
              Import theme
            </button>
          </>
        )}
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-3">
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => onLoad?.(theme.id)}
            className={cn(
              'p-3 rounded-lg border text-left transition-colors',
              theme.id === currentTheme 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            )}
          >
            {theme.preview && (
              <div 
                className="h-8 rounded mb-2"
                style={{ background: theme.preview }}
              />
            )}
            <div className="text-sm font-medium">{theme.name}</div>
          </button>
        ))}
        
        {themes.length === 0 && (
          <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
            No themes available
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// NPM Package Prep
// ============================================================================

export interface NpmPackagePrepProps extends React.HTMLAttributes<HTMLDivElement> {
  packageName?: string
  version?: string
  description?: string
  files?: string[]
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  onExport?: () => void
  onPublish?: () => void
}

export function NpmPackagePrep({ 
  packageName = 'my-package',
  version = '1.0.0',
  description = '',
  files = [],
  dependencies = {},
  peerDependencies = {},
  onExport,
  onPublish,
  className, 
  ...props 
}: NpmPackagePrepProps) {
  const packageJson = useMemo(() => ({
    name: packageName,
    version,
    description,
    main: 'dist/index.js',
    module: 'dist/index.esm.js',
    types: 'dist/index.d.ts',
    files: ['dist', ...files],
    dependencies,
    peerDependencies,
    scripts: {
      build: 'tsup src/index.ts --format cjs,esm --dts',
      prepublishOnly: 'npm run build',
    },
  }), [packageName, version, description, files, dependencies, peerDependencies])
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h3 className="text-sm font-semibold">NPM Package Prep</h3>
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-1.5 rounded-md border border-border text-xs hover:bg-muted"
            >
              Export
            </button>
          )}
          {onPublish && (
            <button
              onClick={onPublish}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90"
            >
              Publish
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Package info */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Package Name</label>
            <div className="font-mono text-sm">{packageName}</div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Version</label>
            <div className="font-mono text-sm">{version}</div>
          </div>
        </div>
        
        {/* Preview */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">package.json preview</label>
          <pre className="p-3 rounded-md bg-[#1a1a1a] font-mono text-xs text-gray-300 overflow-x-auto">
            {JSON.stringify(packageJson, null, 2)}
          </pre>
        </div>
        
        {/* Files */}
        {files.length > 0 && (
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Included Files</label>
            <div className="flex flex-wrap gap-2">
              {files.map(file => (
                <span key={file} className="px-2 py-1 rounded bg-muted text-xs font-mono">
                  {file}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
