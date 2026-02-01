import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from './theme-store'

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: string
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const { themeName, customTheme, fontSizeScale, transitionEnabled, reducedMotion, radius, setTheme } = useThemeStore()

  // Set default theme on first mount if provided
  useEffect(() => {
    if (defaultTheme && !localStorage.getItem('bluesky-ui-theme')) {
      setTheme(defaultTheme)
    }
  }, [defaultTheme, setTheme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement

    // Set theme attribute
    root.setAttribute('data-theme', themeName)

    // Apply custom theme tokens if present
    if (customTheme && customTheme.tokens) {
      Object.entries(customTheme.tokens).forEach(([key, value]) => {
        if (value !== undefined) {
          root.style.setProperty(key, value)
        }
      })
    } else {
      // Clear any previously set custom tokens when switching to built-in theme
      const customTokenKeys = [
        '--primary', '--primary-foreground', '--secondary', '--secondary-foreground',
        '--background', '--foreground', '--surface', '--elevated', '--overlay',
        '--muted', '--muted-foreground', '--accent', '--accent-foreground',
        '--border', '--input', '--ring', '--success', '--warning', '--error', '--info',
        '--glow-primary', '--glow-accent', '--glow-surface'
      ]
      customTokenKeys.forEach(key => {
        root.style.removeProperty(key)
      })
    }

    // Set font size scale
    root.style.setProperty('--font-scale', fontSizeScale.toString())
    root.style.fontSize = `${fontSizeScale * 100}%`

    // Set transition preference
    if (!transitionEnabled) {
      root.style.setProperty('--transition-duration', '0ms')
    } else {
      root.style.removeProperty('--transition-duration')
    }

    // Set reduced motion preference
    if (reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Set radius
    root.setAttribute('data-radius', radius)
  }, [themeName, customTheme, fontSizeScale, transitionEnabled, reducedMotion, radius])

  return <>{children}</>
}
