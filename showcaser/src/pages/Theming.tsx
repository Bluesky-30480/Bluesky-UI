import { useRef } from 'react'
import BUI, { useTheme, useThemeStore, type ThemeName, type ThemeObject } from '@bluesky-ui/ui'
import { Check, Sun, Moon, Sparkles, Upload, Download, FileJson, FileCode } from 'lucide-react'
import { PageHeader, Section, CodeBlock } from '../components/docs'

// Basic themes (dark themes without glows)
const basicThemes: { name: ThemeName | string; label: string; description: string; color: string }[] = [
  { name: 'blue', label: 'Blue', description: 'A calm, professional dark theme with blue accents', color: '#3b82f6' },
  { name: 'black', label: 'Black', description: 'A minimal, high-contrast dark theme', color: '#171717' },
  { name: 'green', label: 'Green', description: 'A nature-inspired dark theme with emerald accents', color: '#10b981' },
  { name: 'orange', label: 'Orange', description: 'A warm, energetic dark theme', color: '#f97316' },
  { name: 'light', label: 'Light', description: 'A clean, bright light theme', color: '#f5f5f5' },
]

// Effect themes (with glows, gradients, shadows)
const effectThemes: { name: ThemeName | string; label: string; description: string; gradient: string }[] = [
  { name: 'aurora', label: 'Aurora', description: 'Blue-green gradient with glowing effects', gradient: 'linear-gradient(135deg, #0ea5e9, #10b981)' },
  { name: 'neon-purple', label: 'Neon Purple', description: 'Cyberpunk-inspired with intense purple/pink glows', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)' },
  { name: 'sunset', label: 'Sunset', description: 'Warm orange to pink gradient effects', gradient: 'linear-gradient(135deg, #f97316, #ec4899)' },
  { name: 'ocean', label: 'Ocean', description: 'Deep blue with aqua accents', gradient: 'linear-gradient(135deg, #0ea5e9, #14b8a6)' },
  { name: 'forest', label: 'Forest', description: 'Rich greens with golden accents', gradient: 'linear-gradient(135deg, #22c55e, #eab308)' },
]

// Aurora theme - Blue to Green gradient with glow effects
export function ThemingPage() {
  const { theme: currentTheme, setTheme, fontSizeScale, setFontSizeScale } = useTheme()
  const { transitionEnabled, setTransitionEnabled, radius, setRadius, setCustomTheme } = useThemeStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Apply aurora theme when selected - now all effect themes work via CSS
  const handleThemeSelect = (themeName: string) => {
    setCustomTheme(null) // Clear any custom theme
    setTheme(themeName as ThemeName)
  }

  // Get theme tokens from CSS for a specific theme
  const getThemeTokensFromCSS = (themeName: string): Record<string, string> => {
    // Create a temporary element to get computed styles for a specific theme
    const tempDiv = document.createElement('div')
    tempDiv.setAttribute('data-theme', themeName)
    tempDiv.style.display = 'none'
    document.body.appendChild(tempDiv)
    
    const computed = getComputedStyle(tempDiv)
    const tokens: Record<string, string> = {}
    const tokenNames = [
      '--primary', '--primary-foreground', '--secondary', '--secondary-foreground',
      '--background', '--foreground', '--surface', '--elevated', '--overlay',
      '--muted', '--muted-foreground', '--accent', '--accent-foreground',
      '--border', '--input', '--ring', '--success', '--warning', '--error', '--info',
      '--glow-sm', '--glow-md', '--glow-lg', '--glow-primary', '--glow-accent',
      '--glow-success', '--glow-error', '--glow-warning',
      '--gradient-primary', '--gradient-accent', '--gradient-surface', '--gradient-text',
      '--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl',
      '--bg-blob-1', '--bg-blob-2', '--bg-blob-3'
    ]
    tokenNames.forEach(name => {
      const value = computed.getPropertyValue(name).trim()
      if (value && value !== 'none') {
        tokens[name] = value
      }
    })
    
    document.body.removeChild(tempDiv)
    return tokens
  }

  // Download theme as JSON
  const downloadThemeJSON = (themeName: string, _label?: string) => {
    const tokens = getThemeTokensFromCSS(themeName)
    const themeData: ThemeObject = { name: themeName, tokens }
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${themeName}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Download theme as CSS
  const downloadThemeCSS = (themeName: string, label: string) => {
    const tokens = getThemeTokensFromCSS(themeName)
    const lines = [`/* ${label} Theme - Bluesky UI */`, `[data-theme="${themeName}"] {`]
    Object.entries(tokens).forEach(([key, value]) => {
      lines.push(`  ${key}: ${value};`)
    })
    lines.push('}')
    const blob = new Blob([lines.join('\n')], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${themeName}-theme.css`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import theme from JSON file
  const handleImportTheme = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const themeData = JSON.parse(event.target?.result as string) as ThemeObject
        if (themeData.name && themeData.tokens) {
          setCustomTheme(themeData)
          setTheme(themeData.name)
        }
      } catch {
        console.error('Invalid theme file')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  // Export current theme
  const handleExportTheme = () => {
    downloadThemeJSON(currentTheme as string, currentTheme as string)
  }

  return (
    <BUI.VStack spacing="xl" align="stretch" className="max-w-4xl">
      <PageHeader
        title="Theming"
        description="Bluesky UI supports runtime theme switching with smooth transitions. Choose from 10 built-in themes including 5 effect themes with glows and gradients."
      />

      {/* Theme Selection */}
      <Section title="Basic Themes">
        <BUI.HStack spacing="sm" className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <BUI.Button
            variant="outline"
            size="sm"
            onClick={handleImportTheme}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Theme
          </BUI.Button>
          <BUI.Button
            variant="outline"
            size="sm"
            onClick={handleExportTheme}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Current
          </BUI.Button>
        </BUI.HStack>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicThemes.map((theme) => {
            const isSelected = theme.name === currentTheme
            return (
              <div
                key={theme.name}
                className={`
                  relative p-4 rounded-lg border 
                  transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                {isSelected && (
                  <BUI.Box className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-primary" />
                  </BUI.Box>
                )}
                <button
                  onClick={() => handleThemeSelect(theme.name)}
                  className="w-full text-left"
                >
                  <BUI.HStack spacing="sm" align="center" className="mb-2">
                    <div 
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ backgroundColor: theme.color }}
                    />
                    {theme.name === 'light' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <BUI.Text weight="medium">{theme.label}</BUI.Text>
                  </BUI.HStack>
                  <BUI.Text size="sm" color="muted" className="mb-3">{theme.description}</BUI.Text>
                </button>
                <BUI.HStack spacing="xs">
                  <BUI.Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); downloadThemeJSON(theme.name, theme.label); }}
                    title="Download JSON"
                  >
                    <FileJson className="w-4 h-4" />
                  </BUI.Button>
                  <BUI.Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); downloadThemeCSS(theme.name, theme.label); }}
                    title="Download CSS"
                  >
                    <FileCode className="w-4 h-4" />
                  </BUI.Button>
                </BUI.HStack>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Effect Themes */}
      <Section title="Effect Themes">
        <BUI.Text size="sm" color="muted" className="mb-4">
          These themes include glows, gradients, and enhanced shadows. Components with <code className="bg-muted px-1 rounded">glow</code> or <code className="bg-muted px-1 rounded">gradient</code> props will show visual effects.
        </BUI.Text>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {effectThemes.map((theme) => {
            const isSelected = theme.name === currentTheme
            return (
              <div
                key={theme.name}
                className={`
                  relative p-4 rounded-lg border 
                  transition-all duration-200
                  ${isSelected
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary/50'
                  }
                `}
                style={{
                  background: isSelected ? undefined : `linear-gradient(180deg, hsl(var(--surface)), hsl(var(--background)))`,
                  boxShadow: isSelected ? `0 0 30px hsl(var(--primary) / 0.3)` : undefined
                }}
              >
                {isSelected && (
                  <BUI.Box className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-primary" />
                  </BUI.Box>
                )}
                <button
                  onClick={() => handleThemeSelect(theme.name)}
                  className="w-full text-left"
                >
                  <BUI.HStack spacing="sm" align="center" className="mb-2">
                    <div 
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ background: theme.gradient }}
                    />
                    <Sparkles className="w-4 h-4 text-primary" />
                    <BUI.Text weight="medium">{theme.label}</BUI.Text>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded text-white"
                      style={{ background: theme.gradient }}>
                      GLOW
                    </span>
                  </BUI.HStack>
                  <BUI.Text size="sm" color="muted" className="mb-3">{theme.description}</BUI.Text>
                </button>
                <BUI.HStack spacing="xs">
                  <BUI.Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); downloadThemeJSON(theme.name, theme.label); }}
                    title="Download JSON"
                  >
                    <FileJson className="w-4 h-4" />
                  </BUI.Button>
                  <BUI.Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); downloadThemeCSS(theme.name, theme.label); }}
                    title="Download CSS"
                  >
                    <FileCode className="w-4 h-4" />
                  </BUI.Button>
                </BUI.HStack>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Settings */}
      <Section title="Settings">
        <BUI.Box className="bg-surface p-6 rounded-lg border border-border">
          <BUI.VStack spacing="lg">
            {/* Font Size Scale */}
            <BUI.Box className="w-full">
              <label className="block mb-2">
                <BUI.Text size="sm" weight="medium">
                  Font Size Scale: {fontSizeScale.toFixed(2)}x
                </BUI.Text>
              </label>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.01"
                value={fontSizeScale}
                onChange={(e) => setFontSizeScale(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <BUI.HStack justify="between" className="mt-1">
                <BUI.Text size="xs" color="muted">Smaller</BUI.Text>
                <BUI.Text size="xs" color="muted">Default</BUI.Text>
                <BUI.Text size="xs" color="muted">Larger</BUI.Text>
              </BUI.HStack>
            </BUI.Box>

            <BUI.Divider />

            {/* Transitions Toggle */}
            <BUI.HStack justify="between" align="center" className="w-full">
              <BUI.VStack spacing="none" align="start">
                <BUI.Text size="sm" weight="medium">Theme Transitions</BUI.Text>
                <BUI.Text size="sm" color="muted">
                  Smooth animations when switching themes
                </BUI.Text>
              </BUI.VStack>
              <BUI.Switch
                checked={transitionEnabled}
                onChange={(e) => setTransitionEnabled(e.target.checked)}
              />
            </BUI.HStack>

            <BUI.Divider />

            {/* Border Radius */}
            <BUI.Box className="w-full">
              <BUI.Text size="sm" weight="medium" className="mb-3">Border Radius</BUI.Text>
              <BUI.HStack spacing="sm">
                {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
                  <BUI.Button
                    key={r}
                    size="sm"
                    variant={radius === r ? 'solid' : 'outline'}
                    colorScheme={radius === r ? 'primary' : 'neutral'}
                    onClick={() => setRadius(r)}
                  >
                    {r.toUpperCase()}
                  </BUI.Button>
                ))}
              </BUI.HStack>
            </BUI.Box>
          </BUI.VStack>
        </BUI.Box>
      </Section>

      {/* Preview */}
      <Section title="Preview">
        <BUI.Box 
          className="
            p-8 bg-[var(--ui-bg)] rounded-lg border border-border
            flex flex-col items-center justify-center gap-6
          "
        >
          <BUI.HStack spacing="md">
            <BUI.Button variant="solid" colorScheme="primary">Primary Button</BUI.Button>
            <BUI.Button variant="solid" colorScheme="primary" glow>With Glow</BUI.Button>
            <BUI.Button variant="solid" colorScheme="primary" gradient>Gradient</BUI.Button>
          </BUI.HStack>
          <BUI.HStack spacing="md">
            <BUI.Card className="p-4 w-32 text-center">
              <BUI.Text size="sm">Default</BUI.Text>
            </BUI.Card>
            <BUI.Card className="p-4 w-32 text-center" glow>
              <BUI.Text size="sm">With Glow</BUI.Text>
            </BUI.Card>
            <BUI.Card className="p-4 w-32 text-center" shadow="lg">
              <BUI.Text size="sm">Shadow LG</BUI.Text>
            </BUI.Card>
          </BUI.HStack>
          <BUI.HStack spacing="md">
            <span className="px-2 py-1 bg-success/20 text-success rounded text-sm glow-success">Success</span>
            <span className="px-2 py-1 bg-warning/20 text-warning rounded text-sm glow-warning">Warning</span>
            <span className="px-2 py-1 bg-error/20 text-error rounded text-sm glow-error">Error</span>
            <span className="text-gradient text-lg font-bold">Gradient Text</span>
          </BUI.HStack>
        </BUI.Box>
      </Section>

      {/* Effect Tokens Reference */}
      <Section title="Effect Tokens">
        <BUI.Box className="bg-surface p-6 rounded-lg border border-border">
          <BUI.Text size="sm" color="muted" className="mb-4">
            Themes can define these effect tokens. Components with <code className="bg-muted px-1 rounded">glow</code> or <code className="bg-muted px-1 rounded">gradient</code> props will use them.
          </BUI.Text>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <BUI.Text weight="semibold" size="xs" className="mb-2">Glows</BUI.Text>
              <ul className="space-y-1 text-muted-foreground">
                <li>--glow-sm</li>
                <li>--glow-md</li>
                <li>--glow-lg</li>
                <li>--glow-primary</li>
                <li>--glow-accent</li>
              </ul>
            </div>
            <div>
              <BUI.Text weight="semibold" size="xs" className="mb-2">Gradients</BUI.Text>
              <ul className="space-y-1 text-muted-foreground">
                <li>--gradient-primary</li>
                <li>--gradient-accent</li>
                <li>--gradient-surface</li>
                <li>--gradient-text</li>
              </ul>
            </div>
            <div>
              <BUI.Text weight="semibold" size="xs" className="mb-2">Shadows</BUI.Text>
              <ul className="space-y-1 text-muted-foreground">
                <li>--shadow-sm</li>
                <li>--shadow-md</li>
                <li>--shadow-lg</li>
                <li>--shadow-xl</li>
              </ul>
            </div>
          </div>
        </BUI.Box>
      </Section>

      {/* Code Example */}
      <Section title="Usage">
        <CodeBlock
          filename="ThemeSwitcher.tsx"
          code={`import { useTheme } from '@bluesky-ui/ui'

function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme()

  return (
    <select 
      value={themeName} 
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="blue">Blue</option>
      <option value="black">Black</option>
      <option value="green">Green</option>
      <option value="orange">Orange</option>
      <option value="light">Light</option>
      <option value="aurora">Aurora (with effects)</option>
    </select>
  )
}

// Using effect props on components
<Button glow>Glowing Button</Button>
<Button gradient>Gradient Button</Button>
<Card glow shadow="lg">Glowing Card</Card>

// Or use utility classes directly
<div className="glow-primary">Custom glow</div>
<span className="text-gradient">Gradient text</span>`}
        />
      </Section>
    </BUI.VStack>
  )
}
