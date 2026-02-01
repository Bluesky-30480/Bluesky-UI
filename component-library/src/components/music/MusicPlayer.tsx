import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react'
import { X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Volume1, VolumeX, Volume } from 'lucide-react'
import { cn } from '../../utils/cn'

// ============================================================================
// Types
// ============================================================================

export interface Track {
  id: string
  title: string
  artist?: string
  album?: string
  duration: number // in seconds
  src: string
  albumArt?: string
  lyrics?: LyricLine[]
}

export interface LyricLine {
  time: number // in seconds
  text: string
}

export type RepeatMode = 'none' | 'one' | 'all'

// ============================================================================
// MusicPlayerProvider - Audio context and state management
// ============================================================================

export interface MusicPlayerHandle {
  play: () => Promise<void>
  pause: () => void
  toggle: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  addToQueue: (track: Track) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void
  playTrack: (track: Track) => void
}

export interface MusicPlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  shuffle: boolean
  repeat: RepeatMode
  queue: Track[]
  playbackRate: number
}

export interface MusicPlayerProviderProps {
  children: React.ReactNode
  initialQueue?: Track[]
  initialVolume?: number
  onTrackChange?: (track: Track | null) => void
  onPlayStateChange?: (isPlaying: boolean) => void
  onError?: (error: Error) => void
}

const MusicPlayerContext = React.createContext<{
  state: MusicPlayerState
  dispatch: React.Dispatch<MusicPlayerAction>
  audioRef: React.RefObject<HTMLAudioElement | null>
  handle: MusicPlayerHandle
} | null>(null)

type MusicPlayerAction =
  | { type: 'SET_TRACK'; track: Track | null }
  | { type: 'SET_PLAYING'; isPlaying: boolean }
  | { type: 'SET_TIME'; time: number }
  | { type: 'SET_DURATION'; duration: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SET_MUTED'; isMuted: boolean }
  | { type: 'SET_SHUFFLE'; shuffle: boolean }
  | { type: 'SET_REPEAT'; repeat: RepeatMode }
  | { type: 'SET_QUEUE'; queue: Track[] }
  | { type: 'ADD_TO_QUEUE'; track: Track }
  | { type: 'REMOVE_FROM_QUEUE'; trackId: string }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'SET_PLAYBACK_RATE'; rate: number }

function musicPlayerReducer(state: MusicPlayerState, action: MusicPlayerAction): MusicPlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return { ...state, currentTrack: action.track, currentTime: 0 }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.isPlaying }
    case 'SET_TIME':
      return { ...state, currentTime: action.time }
    case 'SET_DURATION':
      return { ...state, duration: action.duration }
    case 'SET_VOLUME':
      return { ...state, volume: action.volume }
    case 'SET_MUTED':
      return { ...state, isMuted: action.isMuted }
    case 'SET_SHUFFLE':
      return { ...state, shuffle: action.shuffle }
    case 'SET_REPEAT':
      return { ...state, repeat: action.repeat }
    case 'SET_QUEUE':
      return { ...state, queue: action.queue }
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.track] }
    case 'REMOVE_FROM_QUEUE':
      return { ...state, queue: state.queue.filter(t => t.id !== action.trackId) }
    case 'CLEAR_QUEUE':
      return { ...state, queue: [] }
    case 'SET_PLAYBACK_RATE':
      return { ...state, playbackRate: action.rate }
    default:
      return state
  }
}

export function MusicPlayerProvider({
  children,
  initialQueue = [],
  initialVolume = 1,
  onTrackChange,
  onPlayStateChange,
  onError,
}: MusicPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [state, dispatch] = React.useReducer(musicPlayerReducer, {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: initialVolume,
    isMuted: false,
    shuffle: false,
    repeat: 'none',
    queue: initialQueue,
    playbackRate: 1,
  })
  
  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const handleTimeUpdate = () => dispatch({ type: 'SET_TIME', time: audio.currentTime })
    const handleDurationChange = () => dispatch({ type: 'SET_DURATION', duration: audio.duration })
    const handleEnded = () => {
      if (state.repeat === 'one') {
        audio.currentTime = 0
        audio.play()
      } else {
        handle.next()
      }
    }
    const handleError = () => onError?.(new Error('Audio playback error'))
    
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [state.repeat])
  
  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume
    }
  }, [state.volume, state.isMuted])
  
  // Sync playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = state.playbackRate
    }
  }, [state.playbackRate])
  
  // Notify track change
  useEffect(() => {
    onTrackChange?.(state.currentTrack)
  }, [state.currentTrack, onTrackChange])
  
  // Notify play state change
  useEffect(() => {
    onPlayStateChange?.(state.isPlaying)
  }, [state.isPlaying, onPlayStateChange])
  
  const getNextTrack = useCallback(() => {
    if (state.queue.length === 0) return null
    const currentIndex = state.currentTrack 
      ? state.queue.findIndex(t => t.id === state.currentTrack!.id)
      : -1
    
    if (state.shuffle) {
      const otherTracks = state.queue.filter(t => t.id !== state.currentTrack?.id)
      return otherTracks[Math.floor(Math.random() * otherTracks.length)] || null
    }
    
    const nextIndex = currentIndex + 1
    if (nextIndex >= state.queue.length) {
      return state.repeat === 'all' ? state.queue[0] : null
    }
    return state.queue[nextIndex]
  }, [state.queue, state.currentTrack, state.shuffle, state.repeat])
  
  const getPreviousTrack = useCallback(() => {
    if (state.queue.length === 0) return null
    const currentIndex = state.currentTrack 
      ? state.queue.findIndex(t => t.id === state.currentTrack!.id)
      : 0
    
    const prevIndex = currentIndex - 1
    if (prevIndex < 0) {
      return state.repeat === 'all' ? state.queue[state.queue.length - 1] : null
    }
    return state.queue[prevIndex]
  }, [state.queue, state.currentTrack, state.repeat])
  
  const handle: MusicPlayerHandle = useMemo(() => ({
    play: async () => {
      if (audioRef.current && state.currentTrack) {
        await audioRef.current.play()
        dispatch({ type: 'SET_PLAYING', isPlaying: true })
      }
    },
    pause: () => {
      audioRef.current?.pause()
      dispatch({ type: 'SET_PLAYING', isPlaying: false })
    },
    toggle: () => {
      if (state.isPlaying) {
        handle.pause()
      } else {
        handle.play()
      }
    },
    next: () => {
      const next = getNextTrack()
      if (next) {
        dispatch({ type: 'SET_TRACK', track: next })
        if (audioRef.current) {
          audioRef.current.src = next.src
          audioRef.current.play().then(() => {
            dispatch({ type: 'SET_PLAYING', isPlaying: true })
          })
        }
      } else {
        dispatch({ type: 'SET_PLAYING', isPlaying: false })
      }
    },
    previous: () => {
      // If more than 3 seconds in, restart current track
      if (state.currentTime > 3) {
        if (audioRef.current) audioRef.current.currentTime = 0
        return
      }
      
      const prev = getPreviousTrack()
      if (prev) {
        dispatch({ type: 'SET_TRACK', track: prev })
        if (audioRef.current) {
          audioRef.current.src = prev.src
          audioRef.current.play().then(() => {
            dispatch({ type: 'SET_PLAYING', isPlaying: true })
          })
        }
      }
    },
    seek: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time
      }
    },
    setVolume: (volume: number) => {
      dispatch({ type: 'SET_VOLUME', volume: Math.max(0, Math.min(1, volume)) })
    },
    mute: () => dispatch({ type: 'SET_MUTED', isMuted: true }),
    unmute: () => dispatch({ type: 'SET_MUTED', isMuted: false }),
    addToQueue: (track: Track) => dispatch({ type: 'ADD_TO_QUEUE', track }),
    removeFromQueue: (trackId: string) => dispatch({ type: 'REMOVE_FROM_QUEUE', trackId }),
    clearQueue: () => dispatch({ type: 'CLEAR_QUEUE' }),
    playTrack: (track: Track) => {
      dispatch({ type: 'SET_TRACK', track })
      if (audioRef.current) {
        audioRef.current.src = track.src
        audioRef.current.play().then(() => {
          dispatch({ type: 'SET_PLAYING', isPlaying: true })
        })
      }
    },
  }), [state.isPlaying, state.currentTrack, state.currentTime, getNextTrack, getPreviousTrack])
  
  return (
    <MusicPlayerContext.Provider value={{ state, dispatch, audioRef, handle }}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = React.useContext(MusicPlayerContext)
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  }
  return context
}

// ============================================================================
// PlayerContainer - Main player UI container
// ============================================================================

export interface PlayerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'full' | 'mini' | 'bar'
}

export function PlayerContainer({ variant = 'full', className, ...props }: PlayerContainerProps) {
  return (
    <div 
      className={cn(
        'rounded-lg border border-border bg-surface',
        variant === 'full' && 'p-6',
        variant === 'mini' && 'p-3',
        variant === 'bar' && 'px-4 py-2 flex items-center gap-4',
        className
      )} 
      {...props} 
    />
  )
}

// ============================================================================
// Player Control Buttons
// ============================================================================

export interface PlayerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'ghost'
}

const buttonSizes = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-xl',
}

const buttonVariants = {
  default: 'border border-border bg-background hover:bg-muted',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  ghost: 'hover:bg-muted',
}

export function PlayButton({ size = 'md', variant = 'primary', className, ...props }: PlayerButtonProps) {
  const { state, handle } = useMusicPlayer()
  
  return (
    <button 
      onClick={() => state.isPlaying ? handle.pause() : handle.play()}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors',
        buttonSizes[size],
        buttonVariants[variant],
        className
      )} 
      {...props}
    >
      {state.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
    </button>
  )
}

export function PauseButton({ size = 'md', variant = 'default', className, ...props }: PlayerButtonProps) {
  const { handle } = useMusicPlayer()
  
  return (
    <button 
      onClick={handle.pause}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors',
        buttonSizes[size],
        buttonVariants[variant],
        className
      )} 
      {...props}
    >
      <Pause className="h-5 w-5" />
    </button>
  )
}

export function NextButton({ size = 'md', variant = 'ghost', className, ...props }: PlayerButtonProps) {
  const { handle } = useMusicPlayer()
  
  return (
    <button 
      onClick={handle.next}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors',
        buttonSizes[size],
        buttonVariants[variant],
        className
      )} 
      {...props}
    >
      <SkipForward className="h-4 w-4" />
    </button>
  )
}

export function PreviousButton({ size = 'md', variant = 'ghost', className, ...props }: PlayerButtonProps) {
  const { handle } = useMusicPlayer()
  
  return (
    <button 
      onClick={handle.previous}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors',
        buttonSizes[size],
        buttonVariants[variant],
        className
      )} 
      {...props}
    >
      <SkipBack className="h-4 w-4" />
    </button>
  )
}

export function ShuffleToggle({ size = 'sm', variant = 'ghost', className, ...props }: PlayerButtonProps) {
  const { state, dispatch } = useMusicPlayer()
  
  return (
    <button 
      onClick={() => dispatch({ type: 'SET_SHUFFLE', shuffle: !state.shuffle })}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors',
        buttonSizes[size],
        buttonVariants[variant],
        state.shuffle && 'text-primary',
        className
      )} 
      title={state.shuffle ? 'Shuffle on' : 'Shuffle off'}
      {...props}
    >
      <Shuffle className="h-4 w-4" />
    </button>
  )
}

export function RepeatToggle({ size = 'sm', variant = 'ghost', className, ...props }: PlayerButtonProps) {
  const { state, dispatch } = useMusicPlayer()
  
  const cycleRepeat = () => {
    const modes: RepeatMode[] = ['none', 'all', 'one']
    const currentIndex = modes.indexOf(state.repeat)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    dispatch({ type: 'SET_REPEAT', repeat: nextMode })
  }
  
  return (
    <button 
      onClick={cycleRepeat}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors relative',
        buttonSizes[size],
        buttonVariants[variant],
        state.repeat !== 'none' && 'text-primary',
        className
      )} 
      title={`Repeat: ${state.repeat}`}
      {...props}
    >
      <Repeat className="h-4 w-4" />
      {state.repeat === 'one' && (
        <span className="absolute -top-0.5 -right-0.5 text-[8px] bg-primary text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center">
          1
        </span>
      )}
    </button>
  )
}

// ============================================================================
// Volume Controls
// ============================================================================

export interface VolumeSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  showValue?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function VolumeSlider({ showValue, orientation = 'horizontal', className, ...props }: VolumeSliderProps) {
  const { state, handle } = useMusicPlayer()
  
  return (
    <div className={cn('flex items-center gap-2', orientation === 'vertical' && 'flex-col', className)}>
      <input 
        type="range" 
        min={0}
        max={1}
        step={0.01}
        value={state.isMuted ? 0 : state.volume}
        onChange={e => handle.setVolume(parseFloat(e.target.value))}
        className={cn(
          'accent-primary',
          orientation === 'horizontal' ? 'w-24' : 'h-24 -rotate-90'
        )}
        {...props} 
      />
      {showValue && (
        <span className="text-xs text-muted-foreground w-8 text-center">
          {Math.round((state.isMuted ? 0 : state.volume) * 100)}%
        </span>
      )}
    </div>
  )
}

export function MuteButton({ size = 'sm', variant = 'ghost', className, ...props }: PlayerButtonProps) {
  const { state, handle } = useMusicPlayer()
  
  const getVolumeIcon = () => {
    if (state.isMuted || state.volume === 0) return <VolumeX className="h-4 w-4" />
    if (state.volume < 0.3) return <Volume className="h-4 w-4" />
    if (state.volume < 0.7) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }
  
  return (
    <button 
      onClick={() => state.isMuted ? handle.unmute() : handle.mute()}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors',
        buttonSizes[size],
        buttonVariants[variant],
        className
      )} 
      {...props}
    >
      {getVolumeIcon()}
    </button>
  )
}

// ============================================================================
// Track Progress
// ============================================================================

export interface TrackProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  showTime?: boolean
  interactive?: boolean
}

export function TrackProgress({ showTime = true, interactive = true, className, ...props }: TrackProgressProps) {
  const { state, handle } = useMusicPlayer()
  const progressRef = useRef<HTMLDivElement>(null)
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    handle.seek(percent * state.duration)
  }
  
  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0
  
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      {showTime && (
        <span className="text-xs text-muted-foreground w-10 text-right">
          {formatTime(state.currentTime)}
        </span>
      )}
      <div 
        ref={progressRef}
        onClick={handleClick}
        className={cn(
          'flex-1 h-1.5 rounded-full bg-muted overflow-hidden',
          interactive && 'cursor-pointer group'
        )}
      >
        <div 
          className={cn(
            'h-full bg-primary transition-all',
            interactive && 'group-hover:bg-primary/80'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showTime && (
        <span className="text-xs text-muted-foreground w-10">
          {formatTime(state.duration)}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// Waveform Visualization
// ============================================================================

export interface WaveformProps extends React.HTMLAttributes<HTMLCanvasElement> {
  audioData?: number[]
  barWidth?: number
  barGap?: number
  color?: string
  backgroundColor?: string
}

export const Waveform = forwardRef<HTMLCanvasElement, WaveformProps>(({ 
  audioData = [], 
  barWidth = 3,
  barGap = 1,
  color,
  backgroundColor,
  className, 
  ...props 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const combinedRef = (node: HTMLCanvasElement) => {
    (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
    
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
    }
    
    if (audioData.length === 0) {
      // Draw placeholder bars
      ctx.fillStyle = color || 'hsl(var(--muted))'
      const numBars = Math.floor(width / (barWidth + barGap))
      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.random() * height * 0.5 + height * 0.1
        const x = i * (barWidth + barGap)
        const y = (height - barHeight) / 2
        ctx.fillRect(x, y, barWidth, barHeight)
      }
      return
    }
    
    ctx.fillStyle = color || 'hsl(var(--primary))'
    const numBars = Math.min(audioData.length, Math.floor(width / (barWidth + barGap)))
    const step = Math.floor(audioData.length / numBars)
    
    for (let i = 0; i < numBars; i++) {
      const dataIndex = i * step
      const amplitude = audioData[dataIndex] || 0
      const barHeight = amplitude * height * 0.8 + height * 0.05
      const x = i * (barWidth + barGap)
      const y = (height - barHeight) / 2
      ctx.fillRect(x, y, barWidth, barHeight)
    }
  }, [audioData, barWidth, barGap, color, backgroundColor])
  
  return (
    <canvas 
      ref={combinedRef}
      className={cn('h-16 w-full rounded-md', className)} 
      {...props}
    />
  )
})

Waveform.displayName = 'Waveform'

// ============================================================================
// Spectrum Visualizer - Real-time frequency analysis
// ============================================================================

export interface SpectrumVisualizerProps extends React.HTMLAttributes<HTMLCanvasElement> {
  barCount?: number
  color?: string
  smoothing?: number
}

export function SpectrumVisualizer({ 
  barCount = 32,
  color,
  smoothing = 0.8,
  className, 
  ...props 
}: SpectrumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frequencies, setFrequencies] = useState<number[]>([])
  
  // Simulate frequency data (in real implementation, would use Web Audio API AnalyserNode)
  useEffect(() => {
    const interval = setInterval(() => {
      const newFreqs = Array.from({ length: barCount }, () => 
        Math.random() * 0.7 + 0.1
      )
      setFrequencies(prev => 
        prev.length === 0 
          ? newFreqs 
          : prev.map((v, i) => v * smoothing + newFreqs[i] * (1 - smoothing))
      )
    }, 50)
    
    return () => clearInterval(interval)
  }, [barCount, smoothing])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
    
    const barWidth = width / barCount - 2
    
    frequencies.forEach((freq, i) => {
      const barHeight = freq * height
      const x = i * (barWidth + 2)
      const y = height - barHeight
      
      // Gradient color based on frequency
      const hue = (i / barCount) * 60 + 200 // Blue to cyan
      ctx.fillStyle = color || `hsl(${hue}, 70%, 50%)`
      ctx.fillRect(x, y, barWidth, barHeight)
    })
  }, [frequencies, barCount, color])
  
  return (
    <canvas 
      ref={canvasRef}
      width={300}
      height={100}
      className={cn('h-20 w-full rounded-md bg-muted/30', className)} 
      {...props}
    />
  )
}

// ============================================================================
// Equalizer - Band controls
// ============================================================================

export interface EqualizerBand {
  frequency: number // Hz
  gain: number // -12 to 12 dB
}

export interface EqualizerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  bands?: EqualizerBand[]
  onChange?: (bands: EqualizerBand[]) => void
  presets?: Record<string, EqualizerBand[]>
}

const defaultBands: EqualizerBand[] = [
  { frequency: 60, gain: 0 },
  { frequency: 170, gain: 0 },
  { frequency: 310, gain: 0 },
  { frequency: 600, gain: 0 },
  { frequency: 1000, gain: 0 },
  { frequency: 3000, gain: 0 },
  { frequency: 6000, gain: 0 },
  { frequency: 12000, gain: 0 },
  { frequency: 16000, gain: 0 },
]

export function Equalizer({ 
  bands = defaultBands, 
  onChange,
  presets,
  className, 
  ...props 
}: EqualizerProps) {
  const [localBands, setLocalBands] = useState(bands)
  
  const handleBandChange = (index: number, gain: number) => {
    const newBands = localBands.map((b, i) => i === index ? { ...b, gain } : b)
    setLocalBands(newBands)
    onChange?.(newBands)
  }
  
  const resetBands = () => {
    const reset = localBands.map(b => ({ ...b, gain: 0 }))
    setLocalBands(reset)
    onChange?.(reset)
  }
  
  const applyPreset = (preset: EqualizerBand[]) => {
    setLocalBands(preset)
    onChange?.(preset)
  }
  
  const formatFreq = (freq: number) => {
    if (freq >= 1000) return `${freq / 1000}k`
    return `${freq}`
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Equalizer</h3>
        <div className="flex items-center gap-2">
          {presets && (
            <select 
              onChange={e => {
                const preset = presets[e.target.value]
                if (preset) applyPreset(preset)
              }}
              className="text-xs px-2 py-1 rounded border border-border bg-background"
            >
              <option value="">Presets</option>
              {Object.keys(presets).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          )}
          <button 
            onClick={resetBands}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Bands */}
      <div className="flex items-end justify-between gap-1 h-32">
        {localBands.map((band, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <input
              type="range"
              min={-12}
              max={12}
              step={0.5}
              value={band.gain}
              onChange={e => handleBandChange(i, parseFloat(e.target.value))}
              className="w-full h-24 accent-primary"
              style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
            />
            <span className="text-[10px] text-muted-foreground">{formatFreq(band.frequency)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Track Info Display
// ============================================================================

export interface TrackInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  showAlbum?: boolean
  showArtist?: boolean
  marquee?: boolean
}

export function TrackInfo({ showAlbum = true, showArtist = true, marquee = false, className, ...props }: TrackInfoProps) {
  const { state } = useMusicPlayer()
  const track = state.currentTrack
  
  if (!track) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)} {...props}>
        No track playing
      </div>
    )
  }
  
  return (
    <div className={cn('min-w-0', className)} {...props}>
      <div className={cn('font-medium text-foreground truncate', marquee && 'animate-marquee')}>
        {track.title}
      </div>
      {showArtist && track.artist && (
        <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
      )}
      {showAlbum && track.album && (
        <div className="text-xs text-muted-foreground/60 truncate">{track.album}</div>
      )}
    </div>
  )
}

// ============================================================================
// Album Art
// ============================================================================

export interface AlbumArtProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  spinning?: boolean
  fallback?: React.ReactNode
}

const artSizes = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-48 w-48',
}

export function AlbumArt({ size = 'md', spinning = false, fallback, className, ...props }: AlbumArtProps) {
  const { state } = useMusicPlayer()
  const track = state.currentTrack
  
  return (
    <div 
      className={cn(
        'rounded-lg overflow-hidden bg-muted flex items-center justify-center',
        artSizes[size],
        spinning && state.isPlaying && 'animate-spin-slow',
        className
      )} 
      {...props}
    >
      {track?.albumArt ? (
        <img 
          src={track.albumArt} 
          alt={`${track.album || track.title} cover`}
          className="h-full w-full object-cover"
        />
      ) : (
        fallback || <span className="text-2xl font-bold">[M]</span>
      )}
    </div>
  )
}

// ============================================================================
// Lyrics Viewer
// ============================================================================

export interface LyricsViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sync lyrics with playback */
  synced?: boolean
  /** Font size */
  fontSize?: 'sm' | 'md' | 'lg'
}

export function LyricsViewer({ synced = true, fontSize = 'md', className, ...props }: LyricsViewerProps) {
  const { state } = useMusicPlayer()
  const track = state.currentTrack
  const containerRef = useRef<HTMLDivElement>(null)
  
  const currentLineIndex = useMemo(() => {
    if (!track?.lyrics || !synced) return -1
    return track.lyrics.findIndex((line, i) => {
      const nextLine = track.lyrics![i + 1]
      return state.currentTime >= line.time && (!nextLine || state.currentTime < nextLine.time)
    })
  }, [track?.lyrics, state.currentTime, synced])
  
  // Auto-scroll to current line
  useEffect(() => {
    if (currentLineIndex >= 0 && containerRef.current) {
      const lines = containerRef.current.children
      const currentLine = lines[currentLineIndex] as HTMLElement
      if (currentLine) {
        currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentLineIndex])
  
  if (!track?.lyrics || track.lyrics.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-6 text-center', className)} {...props}>
        <span className="text-muted-foreground">No lyrics available</span>
      </div>
    )
  }
  
  const fontSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        'rounded-lg border border-border bg-surface p-4 max-h-64 overflow-y-auto',
        fontSizes[fontSize],
        className
      )} 
      {...props}
    >
      {track.lyrics.map((line, i) => (
        <p 
          key={i}
          className={cn(
            'py-1 transition-all duration-300',
            synced && i === currentLineIndex 
              ? 'text-primary font-medium scale-105' 
              : 'text-muted-foreground'
          )}
        >
          {line.text}
        </p>
      ))}
    </div>
  )
}

// ============================================================================
// Playlist Components
// ============================================================================

export interface PlaylistProps extends React.HTMLAttributes<HTMLDivElement> {
  tracks: Track[]
  currentTrackId?: string
  onTrackSelect?: (track: Track) => void
  onTrackRemove?: (trackId: string) => void
  reorderable?: boolean
}

export function Playlist({ 
  tracks, 
  currentTrackId,
  onTrackSelect,
  onTrackRemove,
  reorderable = false,
  className, 
  ...props 
}: PlaylistProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      {tracks.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No tracks in playlist
        </div>
      ) : (
        <div className="divide-y divide-border">
          {tracks.map((track, index) => (
            <PlaylistItem
              key={track.id}
              track={track}
              index={index + 1}
              isPlaying={track.id === currentTrackId}
              onClick={() => onTrackSelect?.(track)}
              onRemove={onTrackRemove ? () => onTrackRemove(track.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export interface PlaylistItemProps extends React.HTMLAttributes<HTMLDivElement> {
  track: Track
  index?: number
  isPlaying?: boolean
  onRemove?: () => void
}

export function PlaylistItem({ 
  track, 
  index,
  isPlaying,
  onRemove,
  className, 
  ...props 
}: PlaylistItemProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div 
      className={cn(
        'flex items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer group transition-colors',
        isPlaying && 'bg-primary/5',
        className
      )} 
      {...props}
    >
      {/* Index or playing indicator */}
      <div className="w-6 text-center text-sm text-muted-foreground">
        {isPlaying ? (
          <span className="text-primary animate-pulse"><Play className="h-4 w-4" /></span>
        ) : (
          index
        )}
      </div>
      
      {/* Album art */}
      {track.albumArt && (
        <img 
          src={track.albumArt} 
          alt="" 
          className="h-10 w-10 rounded object-cover"
        />
      )}
      
      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div className={cn('font-medium truncate', isPlaying && 'text-primary')}>
          {track.title}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {track.artist}
        </div>
      </div>
      
      {/* Duration */}
      <div className="text-sm text-muted-foreground">
        {formatDuration(track.duration)}
      </div>
      
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ============================================================================
// Queue View
// ============================================================================

export interface QueueViewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function QueueView({ className, ...props }: QueueViewProps) {
  const { state, handle } = useMusicPlayer()
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Queue ({state.queue.length})</h3>
        {state.queue.length > 0 && (
          <button 
            onClick={handle.clearQueue}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
      <Playlist
        tracks={state.queue}
        currentTrackId={state.currentTrack?.id}
        onTrackSelect={handle.playTrack}
        onTrackRemove={handle.removeFromQueue}
        className="border-0 rounded-none"
      />
    </div>
  )
}

// ============================================================================
// Playback Speed Control
// ============================================================================

export interface PlaybackSpeedControlProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  speeds?: number[]
}

export function PlaybackSpeedControl({ 
  speeds = [0.5, 0.75, 1, 1.25, 1.5, 2],
  className,
  ...props 
}: PlaybackSpeedControlProps) {
  const { state, dispatch } = useMusicPlayer()
  
  return (
    <select 
      value={state.playbackRate}
      onChange={e => dispatch({ type: 'SET_PLAYBACK_RATE', rate: parseFloat(e.target.value) })}
      className={cn('rounded-md border border-border bg-background px-2 py-1 text-sm', className)}
      {...props}
    >
      {speeds.map(speed => (
        <option key={speed} value={speed}>{speed}x</option>
      ))}
    </select>
  )
}

// ============================================================================
// Audio Device Selector (placeholder - requires user permission)
// ============================================================================

export interface AudioDeviceSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function AudioDeviceSelector({ className, ...props }: AudioDeviceSelectorProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then(allDevices => {
      setDevices(allDevices.filter(d => d.kind === 'audiooutput'))
    }).catch(() => {
      // Permission denied or not supported
    })
  }, [])
  
  if (devices.length === 0) {
    return null
  }
  
  return (
    <select className={cn('rounded-md border border-border bg-background px-2 py-1 text-sm', className)} {...props}>
      {devices.map(device => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label || 'Unknown device'}
        </option>
      ))}
    </select>
  )
}

// ============================================================================
// Now Playing Toast
// ============================================================================

export interface NowPlayingToastProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean
  onClose?: () => void
}

export function NowPlayingToast({ visible = true, onClose, className, ...props }: NowPlayingToastProps) {
  const { state } = useMusicPlayer()
  
  if (!visible || !state.currentTrack) return null
  
  return (
    <div 
      className={cn(
        'fixed bottom-4 right-4 flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-lg',
        'animate-in slide-in-from-bottom-4 fade-in',
        className
      )} 
      {...props}
    >
      {state.currentTrack.albumArt && (
        <img 
          src={state.currentTrack.albumArt} 
          alt="" 
          className="h-12 w-12 rounded object-cover"
        />
      )}
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">Now playing</div>
        <div className="font-medium truncate max-w-[200px]">{state.currentTrack.title}</div>
        {state.currentTrack.artist && (
          <div className="text-sm text-muted-foreground truncate">{state.currentTrack.artist}</div>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ============================================================================
// Audio Metadata Editor (placeholder)
// ============================================================================

export interface AudioMetadataEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  track?: Track
  onChange?: (updates: Partial<Track>) => void
}

export function AudioMetadataEditor({ track, onChange, className, ...props }: AudioMetadataEditorProps) {
  if (!track) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted-foreground', className)} {...props}>
        No track selected
      </div>
    )
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4 space-y-3', className)} {...props}>
      <div>
        <label className="text-xs text-muted-foreground">Title</label>
        <input
          type="text"
          value={track.title}
          onChange={e => onChange?.({ title: e.target.value })}
          className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Artist</label>
        <input
          type="text"
          value={track.artist || ''}
          onChange={e => onChange?.({ artist: e.target.value })}
          className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Album</label>
        <input
          type="text"
          value={track.album || ''}
          onChange={e => onChange?.({ album: e.target.value })}
          className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
    </div>
  )
}

// ============================================================================
// Offline Cache Manager (placeholder)
// ============================================================================

export interface CachedTrack {
  id: string
  track: Track
  cachedAt: Date
  size: number // bytes
}

export interface OfflineCacheManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  cachedTracks?: CachedTrack[]
  onRemove?: (trackId: string) => void
  onClearAll?: () => void
}

export function OfflineCacheManager({ 
  cachedTracks = [], 
  onRemove,
  onClearAll,
  className, 
  ...props 
}: OfflineCacheManagerProps) {
  const totalSize = cachedTracks.reduce((sum, ct) => sum + ct.size, 0)
  
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold">Offline Cache</h3>
          <p className="text-xs text-muted-foreground">
            {cachedTracks.length} tracks • {formatSize(totalSize)}
          </p>
        </div>
        {onClearAll && cachedTracks.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-xs text-destructive hover:text-destructive/80"
          >
            Clear all
          </button>
        )}
      </div>
      
      {cachedTracks.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No cached tracks
        </div>
      ) : (
        <div className="divide-y divide-border max-h-64 overflow-y-auto">
          {cachedTracks.map(ct => (
            <div key={ct.id} className="flex items-center justify-between px-4 py-2 group">
              <div className="min-w-0">
                <div className="text-sm truncate">{ct.track.title}</div>
                <div className="text-xs text-muted-foreground">
                  {formatSize(ct.size)} • {ct.cachedAt.toLocaleDateString()}
                </div>
              </div>
              {onRemove && (
                <button
                  onClick={() => onRemove(ct.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
