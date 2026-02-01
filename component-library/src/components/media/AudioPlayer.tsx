import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { cn } from '../../utils/cn'

export interface AudioPlayerHandle {
  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
}

export interface AudioPlayerProps extends Omit<React.AudioHTMLAttributes<HTMLAudioElement>, 'controls' | 'onTimeUpdate'> {
  /** Show custom controls (default: true) */
  customControls?: boolean
  /** Show native controls instead */
  nativeControls?: boolean
  /** Rounded corners */
  rounded?: boolean
  /** Show volume control */
  showVolume?: boolean
  /** Show playback speed control */
  showSpeed?: boolean
  /** Show waveform visualization */
  showWaveform?: boolean
  /** Playback speeds */
  speeds?: number[]
  /** Track title */
  title?: string
  /** Artist name */
  artist?: string
  /** Album art URL */
  artwork?: string
  /** Callback on time update */
  onTimeUpdate?: (currentTime: number, duration: number) => void
  /** Callback on play/pause */
  onPlayStateChange?: (isPlaying: boolean) => void
}

export const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(({
  customControls = true,
  nativeControls = false,
  rounded = true,
  showVolume = true,
  showSpeed = true,
  showWaveform = false,
  speeds = [0.5, 0.75, 1, 1.25, 1.5, 2],
  title,
  artist,
  artwork,
  onTimeUpdate,
  onPlayStateChange,
  className,
  src,
  ...props
}, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isBuffering, setIsBuffering] = useState(false)
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    play: () => audioRef.current?.play() || Promise.resolve(),
    pause: () => audioRef.current?.pause(),
    seek: (time: number) => {
      if (audioRef.current) audioRef.current.currentTime = time
    },
    setVolume: (vol: number) => {
      if (audioRef.current) {
        audioRef.current.volume = vol
        setVolume(vol)
      }
    },
    toggleMute: () => {
      if (audioRef.current) {
        audioRef.current.muted = !audioRef.current.muted
        setIsMuted(!isMuted)
      }
    },
  }), [isMuted])
  
  // Format time display
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Play/pause toggle
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }, [isPlaying])
  
  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return
    const time = audioRef.current.currentTime
    const dur = audioRef.current.duration || 0
    setCurrentTime(time)
    onTimeUpdate?.(time, dur)
  }, [onTimeUpdate])
  
  // Handle loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }, [])
  
  // Handle play/pause events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const onPlay = () => {
      setIsPlaying(true)
      onPlayStateChange?.(true)
    }
    const onPause = () => {
      setIsPlaying(false)
      onPlayStateChange?.(false)
    }
    const onWaiting = () => setIsBuffering(true)
    const onPlaying = () => setIsBuffering(false)
    const onEnded = () => setIsPlaying(false)
    
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('ended', onEnded)
    
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('ended', onEnded)
    }
  }, [onPlayStateChange])
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = vol
      setVolume(vol)
      setIsMuted(vol === 0)
    }
  }
  
  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
      setPlaybackRate(speed)
    }
  }
  
  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (nativeControls) {
    return (
      <audio
        ref={audioRef}
        className={cn('w-full', rounded && 'rounded-lg', className)}
        controls
        src={src}
        {...props}
      />
    )
  }

  return (
    <div className={cn(
      'border border-border bg-surface p-4',
      rounded && 'rounded-lg',
      className
    )}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        {...props}
      />
      
      <div className="flex items-center gap-4">
        {/* Album art */}
        {artwork && (
          <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted">
            <img src={artwork} alt={title || 'Album art'} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {/* Track info */}
          {(title || artist) && (
            <div className="mb-2">
              {title && <div className="text-sm font-medium truncate">{title}</div>}
              {artist && <div className="text-xs text-muted-foreground truncate">{artist}</div>}
            </div>
          )}
          
          {/* Progress bar */}
          <div className="relative group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 appearance-none bg-muted rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:group-hover:opacity-100 [&::-webkit-slider-thumb]:transition-opacity"
            />
            <div
              className="absolute top-0 left-0 h-1.5 bg-primary rounded-full pointer-events-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Time display */}
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      {/* Controls row */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={isBuffering}
            className={cn(
              'w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors',
              isBuffering && 'opacity-50'
            )}
          >
            {isBuffering ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : isPlaying ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          {/* Volume */}
          {showVolume && (
            <div className="flex items-center gap-2 group">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted
                    setIsMuted(!isMuted)
                  }
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 appearance-none bg-muted rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
              />
            </div>
          )}
        </div>
        
        {/* Playback speed */}
        {showSpeed && (
          <select
            value={playbackRate}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="bg-transparent text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors border-none outline-none"
          >
            {speeds.map(speed => (
              <option key={speed} value={speed} className="bg-surface text-foreground">
                {speed}x
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
})

AudioPlayer.displayName = 'AudioPlayer'
