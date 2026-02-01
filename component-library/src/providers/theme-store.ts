import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeName, ThemeObject, RadiusOption } from '../types'

interface ThemeState {
  themeName: ThemeName | string
  customTheme: ThemeObject | null
  fontSizeScale: number
  transitionEnabled: boolean
  reducedMotion: boolean
  radius: RadiusOption
  setTheme: (theme: ThemeName | string) => void
  setCustomTheme: (theme: ThemeObject | null) => void
  setFontSizeScale: (scale: number) => void
  setTransitionEnabled: (enabled: boolean) => void
  setReducedMotion: (reduced: boolean) => void
  setRadius: (radius: RadiusOption) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeName: 'blue',
      customTheme: null,
      fontSizeScale: 1,
      transitionEnabled: true,
      reducedMotion: false,
      radius: 'md',
      setTheme: (theme) => set({ themeName: theme }),
      setCustomTheme: (theme) => set({ customTheme: theme }),
      setFontSizeScale: (scale) => set({ fontSizeScale: Math.max(0.5, Math.min(2, scale)) }),
      setTransitionEnabled: (enabled) => set({ transitionEnabled: enabled }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setRadius: (radius) => set({ radius }),
    }),
    {
      name: 'bluesky-ui-theme',
    }
  )
)
