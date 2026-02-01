/**
 * Theme names supported by Bluesky UI
 * - Basic themes: blue, black, green, orange, light
 * - Effect themes (with glows, gradients, shadows): aurora, neon-purple, sunset, ocean, forest
 */
export type ThemeName = 
  | 'blue' 
  | 'black' 
  | 'green' 
  | 'orange' 
  | 'light' 
  | 'aurora' 
  | 'neon-purple' 
  | 'sunset' 
  | 'ocean' 
  | 'forest'

/**
 * Effect tokens that themes can customize
 */
export interface ThemeEffectTokens {
  // Shadows
  '--shadow-sm'?: string
  '--shadow-md'?: string
  '--shadow-lg'?: string
  '--shadow-xl'?: string
  
  // Glows
  '--glow-sm'?: string
  '--glow-md'?: string
  '--glow-lg'?: string
  '--glow-primary'?: string
  '--glow-accent'?: string
  '--glow-success'?: string
  '--glow-error'?: string
  '--glow-warning'?: string
  
  // Gradients
  '--gradient-primary'?: string
  '--gradient-accent'?: string
  '--gradient-surface'?: string
  '--gradient-text'?: string
}

/**
 * All available theme tokens
 */
export interface ThemeTokens extends ThemeEffectTokens {
  '--primary'?: string
  '--primary-foreground'?: string
  '--secondary'?: string
  '--secondary-foreground'?: string
  '--background'?: string
  '--foreground'?: string
  '--surface'?: string
  '--elevated'?: string
  '--overlay'?: string
  '--muted'?: string
  '--muted-foreground'?: string
  '--accent'?: string
  '--accent-foreground'?: string
  '--border'?: string
  '--input'?: string
  '--ring'?: string
  '--success'?: string
  '--warning'?: string
  '--error'?: string
  '--info'?: string
  [key: string]: string | undefined
}

/**
 * Custom theme object for user-defined themes
 */
export interface ThemeObject {
  name: string
  tokens: ThemeTokens
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  themeName: ThemeName | string
  setTheme: (theme: ThemeName | string) => void
  fontSizeScale: number
  setFontSizeScale: (scale: number) => void
  transitionEnabled: boolean
  setTransitionEnabled: (enabled: boolean) => void
  customTheme?: ThemeObject
  applyCustomTheme: (theme: ThemeObject) => void
  getTokens: () => ThemeTokens
}

/**
 * Radius options
 */
export type RadiusOption = 'none' | 'sm' | 'md' | 'lg' | 'full'
