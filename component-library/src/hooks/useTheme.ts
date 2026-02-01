import { useThemeStore } from '../providers/theme-store'
import type { ThemeName, RadiusOption } from '../types'

export function useTheme() {
  const {
    themeName,
    customTheme,
    fontSizeScale,
    transitionEnabled,
    reducedMotion,
    radius,
    setTheme,
    setCustomTheme,
    setFontSizeScale,
    setTransitionEnabled,
    setReducedMotion,
    setRadius,
  } = useThemeStore()

  return {
    // Current values
    theme: themeName as ThemeName,
    customTheme,
    fontSizeScale,
    transitionEnabled,
    reducedMotion,
    radius,

    // Setters
    setTheme,
    setCustomTheme,
    setFontSizeScale,
    setTransitionEnabled,
    setReducedMotion,
    setRadius,

    // Helpers
    isDark: themeName === 'black',
    isLight: themeName === 'light',
    toggleDarkMode: () => {
      setTheme(themeName === 'black' ? 'light' : 'black')
    },
    increaseFontSize: () => {
      setFontSizeScale(Math.min(2, fontSizeScale + 0.1))
    },
    decreaseFontSize: () => {
      setFontSizeScale(Math.max(0.5, fontSizeScale - 0.1))
    },
    resetFontSize: () => {
      setFontSizeScale(1)
    },
    cycleRadius: () => {
      const radiusOptions: RadiusOption[] = ['none', 'sm', 'md', 'lg', 'full']
      const currentIndex = radiusOptions.indexOf(radius)
      const nextIndex = (currentIndex + 1) % radiusOptions.length
      setRadius(radiusOptions[nextIndex])
    },
  }
}
