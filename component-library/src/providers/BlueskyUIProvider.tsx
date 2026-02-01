import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'

interface BlueskyUIProviderProps {
  children: ReactNode
  defaultTheme?: string
}

export function BlueskyUIProvider({ children, defaultTheme = 'blue' }: BlueskyUIProviderProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      {children}
    </ThemeProvider>
  )
}
