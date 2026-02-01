import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { cn } from '../../utils/cn'

export interface VideoPlayerHandle {
  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleFullscreen: () => void
  togglePiP: () => Promise<void>
}

export interface VideoPlayerProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'controls' | 'onTimeUpdate'> {
  /** Show custom controls (default: true) */
  customControls?: boolean
  /** Show native controls instead */
  nativeControls?: boolean
  /** Poster image URL */
  poster?: string
  /** Rounded corners */
  rounded?: boolean
  /** Autoplay on mount */
  autoPlay?: boolean
  /** Show volume control */
  showVolume?: boolean
  /** Show playback speed control */
  showSpeed?: boolean
  /** Show fullscreen button */
  showFullscreen?: boolean
  /** Show picture-in-picture button */
  showPiP?: boolean
  /** Playback speeds */
  speeds?: number[]
  /** Callback on time update */
  onTimeUpdate?: (currentTime: number, duration: number) => void
  /** Callback on play/pause */
  onPlayStateChange?: (isPlaying: boolean) => void
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({
  customControls = true,
  nativeControls = false,
  poster,
  rounded = true,
  autoPlay = false,
  showVolume = true,
  showSpeed = true,
  showFullscreen = true,
  showPiP = true,
  speeds = [0.5, 0.75, 1, 1.25, 1.5, 2],
  onTimeUpdate,
  onPlayStateChange,
  className,
  src,
  ...props
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play() || Promise.resolve(),
    pause: () => videoRef.current?.pause(),
    seek: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time
    },
    setVolume: (vol: number) => {
      if (videoRef.current) {
        videoRef.current.volume = vol
        setVolume(vol)
      }
    },
    toggleMute: () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted
        setIsMuted(!isMuted)
      }
    },
    toggleFullscreen: () => toggleFullscreen(),
    togglePiP: async () => {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture()
      }
    },
  }), [isMuted])
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return
    
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    }
  }, [])
  
  // Play/pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }, [isPlaying])
  
  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return
    const time = videoRef.current.currentTime
    const dur = videoRef.current.duration || 0
    setCurrentTime(time)
    onTimeUpdate?.(time, dur)
  }, [onTimeUpdate])
  
  // Handle loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }, [])
  
  // Handle play/pause events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
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
    
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('playing', onPlaying)
    
    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('playing', onPlaying)
    }
  }, [onPlayStateChange])
  
  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [isPlaying])
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = vol
      setVolume(vol)
      setIsMuted(vol === 0)
    }
  }
  
  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
      setPlaybackRate(speed)
    }
  }
  
  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (nativeControls) {
    return (
      <video
        ref={videoRef}
        className={cn('w-full aspect-video bg-black', rounded && 'rounded-lg', className)}
        controls
        src={src}
        poster={poster}
        {...props}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full aspect-video bg-black group',
        rounded && 'rounded-lg overflow-hidden',
        className
      )}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        {...props}
      />
      
      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Center play button when paused */}
      {!isPlaying && !isBuffering && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-8 h-8 text-black ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
      
      {/* Custom controls */}
      {customControls && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity',
            showControls ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Progress bar */}
          <div className="relative mb-3 group/progress">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 appearance-none bg-white/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:group-hover/progress:opacity-100 [&::-webkit-slider-thumb]:transition-opacity"
            />
            <div
              className="absolute top-0 left-0 h-1 bg-primary rounded-full pointer-events-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Controls row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="hover:text-primary transition-colors">
                {isPlaying ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              
              {/* Volume */}
              {showVolume && (
                <div className="flex items-center gap-2 group/vol">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted
                        setIsMuted(!isMuted)
                      }
                    }}
                    className="hover:text-primary transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
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
                    className="w-0 group-hover/vol:w-20 transition-all h-1 appearance-none bg-white/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
              )}
              
              {/* Time display */}
              <span className="text-sm tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Playback speed */}
              {showSpeed && (
                <select
                  value={playbackRate}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="bg-transparent text-sm cursor-pointer hover:text-primary transition-colors"
                >
                  {speeds.map(speed => (
                    <option key={speed} value={speed} className="bg-surface text-foreground">
                      {speed}x
                    </option>
                  ))}
                </select>
              )}
              
              {/* Picture-in-Picture */}
              {showPiP && document.pictureInPictureEnabled && (
                <button
                  onClick={async () => {
                    if (document.pictureInPictureElement) {
                      await document.exitPictureInPicture()
                    } else if (videoRef.current) {
                      await videoRef.current.requestPictureInPicture()
                    }
                  }}
                  className="hover:text-primary transition-colors"
                  title="Picture in Picture"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                  </svg>
                </button>
              )}
              
              {/* Fullscreen */}
              {showFullscreen && (
                <button onClick={toggleFullscreen} className="hover:text-primary transition-colors">
                  {isFullscreen ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

VideoPlayer.displayName = 'VideoPlayer'
