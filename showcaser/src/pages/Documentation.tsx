import { useState, useCallback } from 'react'
import BUI from '@bluesky-ui/ui'
import { Copy, Check, Download, Upload, RefreshCw, Eye } from 'lucide-react'
import { PageHeader, Section } from '../components/docs'

// Helper to copy text
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])
  
  return { copied, copy }
}

// Code snippet component with copy button
function CodeSnippet({ code, language = 'tsx', title }: { code: string; language?: string; title?: string }) {
  const { copied, copy } = useCopyToClipboard()
  
  return (
    <div className="relative group">
      {title && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border text-xs font-mono text-muted-foreground rounded-t-lg">
          {title}
        </div>
      )}
      <pre className={`bg-surface border border-border ${title ? 'rounded-b-lg' : 'rounded-lg'} p-4 overflow-x-auto text-sm`}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={() => copy(code)}
        className="absolute top-2 right-2 p-2 rounded bg-muted/80 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

// Theme token type definitions
interface ThemeTokens {
  // Colors (HSL values without hsl())
  '--primary': string
  '--primary-foreground': string
  '--secondary': string
  '--secondary-foreground': string
  '--background': string
  '--foreground': string
  '--surface': string
  '--elevated': string
  '--overlay': string
  '--muted': string
  '--muted-foreground': string
  '--accent': string
  '--accent-foreground': string
  '--border': string
  '--input': string
  '--ring': string
  '--success': string
  '--warning': string
  '--error': string
  '--info': string
  // Effects
  '--shadow-sm'?: string
  '--shadow-md'?: string
  '--shadow-lg'?: string
  '--shadow-xl'?: string
  '--glow-sm'?: string
  '--glow-md'?: string
  '--glow-lg'?: string
  '--glow-primary'?: string
  '--glow-accent'?: string
  '--gradient-primary'?: string
  '--gradient-accent'?: string
  '--gradient-surface'?: string
  '--gradient-text'?: string
}

// Default theme template
const defaultThemeTokens: ThemeTokens = {
  '--primary': '217 91% 60%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '217 33% 17%',
  '--secondary-foreground': '210 40% 98%',
  '--background': '222 47% 11%',
  '--foreground': '210 40% 98%',
  '--surface': '217 33% 15%',
  '--elevated': '217 33% 18%',
  '--overlay': '217 33% 12%',
  '--muted': '217 33% 25%',
  '--muted-foreground': '215 20% 65%',
  '--accent': '217 91% 60%',
  '--accent-foreground': '0 0% 100%',
  '--border': '217 33% 25%',
  '--input': '217 33% 25%',
  '--ring': '217 91% 60%',
  '--success': '142 76% 36%',
  '--warning': '38 92% 50%',
  '--error': '0 84% 60%',
  '--info': '199 89% 48%',
  '--shadow-sm': '',
  '--shadow-md': '',
  '--shadow-lg': '',
  '--shadow-xl': '',
  '--glow-sm': '',
  '--glow-md': '',
  '--glow-lg': '',
  '--glow-primary': '',
  '--glow-accent': '',
  '--gradient-primary': '',
  '--gradient-accent': '',
  '--gradient-surface': '',
  '--gradient-text': '',
}

// HSL to Hex converter
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// Hex to HSL converter
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// Parse HSL string "h s% l%" to values
function parseHslString(hsl: string): { h: number; s: number; l: number } | null {
  const match = hsl.match(/(\d+)\s+(\d+)%?\s+(\d+)%?/)
  if (!match) return null
  return { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) }
}

// Theme Creator Component
function ThemeCreator() {
  const [themeName, setThemeName] = useState('my-custom-theme')
  const [tokens, setTokens] = useState<ThemeTokens>(defaultThemeTokens)
  const [previewActive, setPreviewActive] = useState(false)
  const { copied, copy } = useCopyToClipboard()
  
  // Update a token
  const updateToken = (key: keyof ThemeTokens, value: string) => {
    setTokens(prev => ({ ...prev, [key]: value }))
  }
  
  // Update token from hex color picker
  const updateTokenFromHex = (key: keyof ThemeTokens, hex: string) => {
    const { h, s, l } = hexToHsl(hex)
    updateToken(key, `${h} ${s}% ${l}%`)
  }
  
  // Get hex value for color picker
  const getHexValue = (hslString: string): string => {
    const parsed = parseHslString(hslString)
    if (!parsed) return '#3b82f6'
    return hslToHex(parsed.h, parsed.s, parsed.l)
  }
  
  // Generate JSON output
  const generateJSON = () => {
    const cleanTokens: Record<string, string> = {}
    Object.entries(tokens).forEach(([key, value]) => {
      if (value && value.trim()) {
        cleanTokens[key] = value
      }
    })
    return JSON.stringify({ name: themeName, tokens: cleanTokens }, null, 2)
  }
  
  // Generate CSS output
  const generateCSS = () => {
    const lines = [`[data-theme="${themeName}"] {`]
    Object.entries(tokens).forEach(([key, value]) => {
      if (value && value.trim()) {
        lines.push(`  ${key}: ${value};`)
      }
    })
    lines.push('}')
    return lines.join('\n')
  }
  
  // Download theme as JSON
  const downloadJSON = () => {
    const blob = new Blob([generateJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${themeName}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // Download theme as CSS
  const downloadCSS = () => {
    const blob = new Blob([generateCSS()], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${themeName}.css`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // Import theme from JSON
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.name) setThemeName(data.name)
        if (data.tokens) setTokens({ ...defaultThemeTokens, ...data.tokens })
      } catch {
        console.error('Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }
  
  // Apply preview to document
  const togglePreview = () => {
    const root = document.documentElement
    if (previewActive) {
      // Remove preview
      Object.keys(tokens).forEach(key => {
        root.style.removeProperty(key)
      })
      root.removeAttribute('data-theme-preview')
    } else {
      // Apply preview
      Object.entries(tokens).forEach(([key, value]) => {
        if (value && value.trim()) {
          root.style.setProperty(key, value)
        }
      })
      root.setAttribute('data-theme-preview', 'true')
    }
    setPreviewActive(!previewActive)
  }
  
  // Reset to defaults
  const resetToDefaults = () => {
    setTokens(defaultThemeTokens)
    setThemeName('my-custom-theme')
  }
  
  // Color token editor
  const ColorTokenEditor = ({ label, tokenKey, description }: { label: string; tokenKey: keyof ThemeTokens; description?: string }) => {
    const value = tokens[tokenKey] || ''
    const isColorToken = !tokenKey.includes('shadow') && !tokenKey.includes('glow') && !tokenKey.includes('gradient')
    
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-48 shrink-0">
          <BUI.Text size="sm" weight="medium">{label}</BUI.Text>
          {description && <BUI.Text size="xs" color="muted">{description}</BUI.Text>}
        </div>
        {isColorToken ? (
          <>
            <input
              type="color"
              value={getHexValue(value)}
              onChange={(e) => updateTokenFromHex(tokenKey, e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer shrink-0"
              style={{ appearance: 'none', WebkitAppearance: 'none', padding: 0, background: 'transparent' }}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateToken(tokenKey, e.target.value)}
              placeholder="h s% l%"
              className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded text-foreground"
            />
          </>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => updateToken(tokenKey, e.target.value)}
            placeholder={tokenKey.includes('gradient') ? 'linear-gradient(...)' : '0 0 10px rgba(...)'}
            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded font-mono"
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Theme Name & Actions */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-surface rounded-lg border border-border">
        <div className="flex-1 min-w-[200px]">
          <BUI.Text size="xs" color="muted" className="mb-1">Theme Name</BUI.Text>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded"
          />
        </div>
        <div className="flex gap-2">
          <label className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>
          <BUI.Button size="sm" variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </BUI.Button>
          <BUI.Button 
            size="sm" 
            variant={previewActive ? 'solid' : 'outline'}
            colorScheme={previewActive ? 'success' : 'primary'}
            onClick={togglePreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewActive ? 'Preview On' : 'Preview'}
          </BUI.Button>
        </div>
      </div>

      {/* Token Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Colors */}
        <BUI.Card className="p-4">
          <BUI.Text weight="semibold" className="mb-4">Primary Colors</BUI.Text>
          <ColorTokenEditor label="Primary" tokenKey="--primary" description="Main brand color" />
          <ColorTokenEditor label="Primary Foreground" tokenKey="--primary-foreground" description="Text on primary" />
          <ColorTokenEditor label="Secondary" tokenKey="--secondary" />
          <ColorTokenEditor label="Secondary Foreground" tokenKey="--secondary-foreground" />
          <ColorTokenEditor label="Accent" tokenKey="--accent" />
          <ColorTokenEditor label="Accent Foreground" tokenKey="--accent-foreground" />
        </BUI.Card>

        {/* Background Colors */}
        <BUI.Card className="p-4">
          <BUI.Text weight="semibold" className="mb-4">Backgrounds</BUI.Text>
          <ColorTokenEditor label="Background" tokenKey="--background" description="Main background" />
          <ColorTokenEditor label="Foreground" tokenKey="--foreground" description="Main text color" />
          <ColorTokenEditor label="Surface" tokenKey="--surface" description="Card backgrounds" />
          <ColorTokenEditor label="Elevated" tokenKey="--elevated" description="Raised elements" />
          <ColorTokenEditor label="Overlay" tokenKey="--overlay" description="Modal overlays" />
        </BUI.Card>

        {/* Muted & Borders */}
        <BUI.Card className="p-4">
          <BUI.Text weight="semibold" className="mb-4">Muted & Borders</BUI.Text>
          <ColorTokenEditor label="Muted" tokenKey="--muted" description="Subtle backgrounds" />
          <ColorTokenEditor label="Muted Foreground" tokenKey="--muted-foreground" description="Secondary text" />
          <ColorTokenEditor label="Border" tokenKey="--border" />
          <ColorTokenEditor label="Input" tokenKey="--input" description="Input borders" />
          <ColorTokenEditor label="Ring" tokenKey="--ring" description="Focus rings" />
        </BUI.Card>

        {/* Semantic Colors */}
        <BUI.Card className="p-4">
          <BUI.Text weight="semibold" className="mb-4">Semantic Colors</BUI.Text>
          <ColorTokenEditor label="Success" tokenKey="--success" />
          <ColorTokenEditor label="Warning" tokenKey="--warning" />
          <ColorTokenEditor label="Error" tokenKey="--error" />
          <ColorTokenEditor label="Info" tokenKey="--info" />
        </BUI.Card>

        {/* Effects - Shadows */}
        <BUI.Card className="p-4">
          <BUI.Text weight="semibold" className="mb-4">Shadows</BUI.Text>
          <BUI.Text size="xs" color="muted" className="mb-3">CSS box-shadow values</BUI.Text>
          <ColorTokenEditor label="Shadow SM" tokenKey="--shadow-sm" />
          <ColorTokenEditor label="Shadow MD" tokenKey="--shadow-md" />
          <ColorTokenEditor label="Shadow LG" tokenKey="--shadow-lg" />
          <ColorTokenEditor label="Shadow XL" tokenKey="--shadow-xl" />
        </BUI.Card>

        {/* Effects - Glows */}
        <BUI.Card className="p-4">
          <BUI.Text weight="semibold" className="mb-4">Glows</BUI.Text>
          <BUI.Text size="xs" color="muted" className="mb-3">Box-shadow glow effects</BUI.Text>
          <ColorTokenEditor label="Glow SM" tokenKey="--glow-sm" />
          <ColorTokenEditor label="Glow MD" tokenKey="--glow-md" />
          <ColorTokenEditor label="Glow LG" tokenKey="--glow-lg" />
          <ColorTokenEditor label="Glow Primary" tokenKey="--glow-primary" />
          <ColorTokenEditor label="Glow Accent" tokenKey="--glow-accent" />
        </BUI.Card>

        {/* Effects - Gradients */}
        <BUI.Card className="p-4 lg:col-span-2">
          <BUI.Text weight="semibold" className="mb-4">Gradients</BUI.Text>
          <BUI.Text size="xs" color="muted" className="mb-3">CSS gradient values (e.g., linear-gradient(135deg, #color1, #color2))</BUI.Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorTokenEditor label="Gradient Primary" tokenKey="--gradient-primary" />
            <ColorTokenEditor label="Gradient Accent" tokenKey="--gradient-accent" />
            <ColorTokenEditor label="Gradient Surface" tokenKey="--gradient-surface" />
            <ColorTokenEditor label="Gradient Text" tokenKey="--gradient-text" />
          </div>
        </BUI.Card>
      </div>

      {/* Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BUI.Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <BUI.Text weight="semibold">JSON Output</BUI.Text>
            <div className="flex gap-2">
              <BUI.Button size="sm" variant="ghost" onClick={() => copy(generateJSON())}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </BUI.Button>
              <BUI.Button size="sm" variant="outline" onClick={downloadJSON}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </BUI.Button>
            </div>
          </div>
          <pre className="bg-background p-4 rounded text-xs overflow-auto max-h-64 font-mono">
            {generateJSON()}
          </pre>
        </BUI.Card>

        <BUI.Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <BUI.Text weight="semibold">CSS Output</BUI.Text>
            <div className="flex gap-2">
              <BUI.Button size="sm" variant="ghost" onClick={() => copy(generateCSS())}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </BUI.Button>
              <BUI.Button size="sm" variant="outline" onClick={downloadCSS}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </BUI.Button>
            </div>
          </div>
          <pre className="bg-background p-4 rounded text-xs overflow-auto max-h-64 font-mono">
            {generateCSS()}
          </pre>
        </BUI.Card>
      </div>

      {/* Preview Card */}
      <BUI.Card className="p-6" style={previewActive ? {
        backgroundColor: `hsl(${tokens['--surface']})`,
        borderColor: `hsl(${tokens['--border']})`,
        color: `hsl(${tokens['--foreground']})`,
      } : {}}>
        <BUI.Text weight="semibold" className="mb-4">Live Preview</BUI.Text>
        <div className="flex flex-wrap gap-4">
          <button 
            className="px-4 py-2 rounded text-sm font-medium transition-colors"
            style={previewActive ? {
              backgroundColor: `hsl(${tokens['--primary']})`,
              color: `hsl(${tokens['--primary-foreground']})`,
              boxShadow: tokens['--glow-primary'] || 'none',
            } : {}}
          >
            Primary Button
          </button>
          <button 
            className="px-4 py-2 rounded text-sm font-medium border-2 transition-colors"
            style={previewActive ? {
              borderColor: `hsl(${tokens['--primary']})`,
              color: `hsl(${tokens['--primary']})`,
            } : {}}
          >
            Outline Button
          </button>
          <span 
            className="px-2 py-1 rounded text-sm"
            style={previewActive ? {
              backgroundColor: `hsl(${tokens['--success']} / 0.2)`,
              color: `hsl(${tokens['--success']})`,
            } : {}}
          >
            Success Badge
          </span>
          <span 
            className="px-2 py-1 rounded text-sm"
            style={previewActive ? {
              backgroundColor: `hsl(${tokens['--error']} / 0.2)`,
              color: `hsl(${tokens['--error']})`,
            } : {}}
          >
            Error Badge
          </span>
        </div>
      </BUI.Card>
    </div>
  )
}

export function DocumentationPage() {
  return (
    <BUI.VStack spacing="xl" align="stretch" className="max-w-4xl">
      <PageHeader
        title="Documentation"
        description="Complete guide to using Bluesky UI component library - installation, usage, theming, and customization."
      />

      {/* Table of Contents */}
      <BUI.Card className="p-6">
        <BUI.Text weight="semibold" className="mb-4">Table of Contents</BUI.Text>
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <a href="#installation" className="text-primary hover:underline">1. Installation</a>
          <a href="#quick-start" className="text-primary hover:underline">2. Quick Start</a>
          <a href="#provider-setup" className="text-primary hover:underline">3. Provider Setup</a>
          <a href="#using-components" className="text-primary hover:underline">4. Using Components</a>
          <a href="#theming-basics" className="text-primary hover:underline">5. Theming Basics</a>
          <a href="#custom-themes" className="text-primary hover:underline">6. Custom Themes</a>
          <a href="#effect-system" className="text-primary hover:underline">7. Effect System (Glows, Gradients)</a>
          <a href="#theme-creator" className="text-primary hover:underline">8. Theme Creator Tool</a>
        </nav>
      </BUI.Card>

      {/* Installation */}
      <Section title="1. Installation" id="installation">
        <BUI.VStack spacing="md" align="stretch">
          <BUI.Text>Install Bluesky UI and its peer dependencies:</BUI.Text>
          
          <CodeSnippet 
            title="npm" 
            code="npm install @bluesky-ui/ui" 
            language="bash" 
          />
          
          <CodeSnippet 
            title="pnpm" 
            code="pnpm add @bluesky-ui/ui" 
            language="bash" 
          />
          
          <CodeSnippet 
            title="yarn" 
            code="yarn add @bluesky-ui/ui" 
            language="bash" 
          />

          <BUI.Text size="sm" color="muted">
            Bluesky UI requires React 18+ and includes Tailwind CSS utilities.
          </BUI.Text>
        </BUI.VStack>
      </Section>

      {/* Quick Start */}
      <Section title="2. Quick Start" id="quick-start">
        <BUI.VStack spacing="md" align="stretch">
          <BUI.Text>
            After installation, import the CSS and wrap your app with the provider:
          </BUI.Text>

          <CodeSnippet
            title="main.tsx"
            code={`import React from 'react'
import ReactDOM from 'react-dom/client'
import { BlueskyUIProvider } from '@bluesky-ui/ui'
import '@bluesky-ui/ui/styles.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlueskyUIProvider>
      <App />
    </BlueskyUIProvider>
  </React.StrictMode>
)`}
          />

          <BUI.Text>Now you can use components anywhere in your app:</BUI.Text>

          <CodeSnippet
            title="App.tsx"
            code={`import { Button, Card, CardContent, Text, Stack } from '@bluesky-ui/ui'

function App() {
  return (
    <Card>
      <CardContent>
        <Stack spacing="md">
          <Text size="lg" weight="bold">Welcome to Bluesky UI</Text>
          <Text color="muted">A beautiful component library</Text>
          <Button variant="solid" colorScheme="primary">
            Get Started
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}`}
          />
        </BUI.VStack>
      </Section>

      {/* Provider Setup */}
      <Section title="3. Provider Setup" id="provider-setup">
        <BUI.VStack spacing="md" align="stretch">
          <BUI.Text>
            The <code className="bg-muted px-1 rounded">BlueskyUIProvider</code> handles theming, 
            font scaling, and global settings. It accepts these props:
          </BUI.Text>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3">Prop</th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-left py-2 px-3">Default</th>
                  <th className="text-left py-2 px-3">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono text-xs">defaultTheme</td>
                  <td className="py-2 px-3 font-mono text-xs">string</td>
                  <td className="py-2 px-3 font-mono text-xs">'blue'</td>
                  <td className="py-2 px-3">Initial theme name</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono text-xs">children</td>
                  <td className="py-2 px-3 font-mono text-xs">ReactNode</td>
                  <td className="py-2 px-3 font-mono text-xs">required</td>
                  <td className="py-2 px-3">Your app content</td>
                </tr>
              </tbody>
            </table>
          </div>

          <CodeSnippet
            title="Provider with options"
            code={`<BlueskyUIProvider defaultTheme="green">
  <App />
</BlueskyUIProvider>`}
          />
        </BUI.VStack>
      </Section>

      {/* Using Components */}
      <Section title="4. Using Components" id="using-components">
        <BUI.VStack spacing="md" align="stretch">
          <BUI.Text>Components can be imported individually or as a namespace:</BUI.Text>

          <CodeSnippet
            title="Named imports (tree-shakeable)"
            code={`import { Button, Card, Input, Stack, Text } from '@bluesky-ui/ui'

function MyComponent() {
  return (
    <Stack spacing="md">
      <Input placeholder="Enter text..." />
      <Button>Submit</Button>
    </Stack>
  )
}`}
          />

          <CodeSnippet
            title="Namespace import"
            code={`import BUI from '@bluesky-ui/ui'

function MyComponent() {
  return (
    <BUI.Stack spacing="md">
      <BUI.Input placeholder="Enter text..." />
      <BUI.Button>Submit</BUI.Button>
    </BUI.Stack>
  )
}`}
          />

          <BUI.Card className="p-4 bg-info/10 border-info/30">
            <BUI.Text size="sm">
              <strong>Tip:</strong> Named imports are recommended for better tree-shaking and smaller bundle sizes.
            </BUI.Text>
          </BUI.Card>

          <BUI.Text weight="semibold" className="mt-4">Common Component Patterns</BUI.Text>

          <CodeSnippet
            title="Layout with Stack"
            code={`// Vertical stack (default)
<Stack spacing="lg">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>

// Horizontal stack
<HStack spacing="md" align="center">
  <Avatar src="..." />
  <Text>Username</Text>
</HStack>

// Centered content
<Center className="h-64">
  <Spinner size="lg" />
</Center>`}
          />

          <CodeSnippet
            title="Form inputs"
            code={`// Controlled input
const [value, setValue] = useState('')
<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Type here..."
  size="md"
  variant="default"
/>

// Checkbox
<Checkbox 
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
>
  I agree to the terms
</Checkbox>

// Select
<Select
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Choose..."
/>`}
          />

          <CodeSnippet
            title="Feedback components"
            code={`// Toast notifications (use the hook)
const { toast } = useToast()
toast({ title: 'Success!', variant: 'success' })

// Modal dialog
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>Confirm Action</ModalHeader>
  <ModalBody>Are you sure?</ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>

// Tooltip
<Tooltip content="Helpful information">
  <Button>Hover me</Button>
</Tooltip>`}
          />
        </BUI.VStack>
      </Section>

      {/* Theming Basics */}
      <Section title="5. Theming Basics" id="theming-basics">
        <BUI.VStack spacing="md" align="stretch">
          <BUI.Text>
            Bluesky UI includes 6 built-in themes. Use the <code className="bg-muted px-1 rounded">useTheme</code> hook to switch themes:
          </BUI.Text>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['blue', 'black', 'green', 'orange', 'light', 'aurora'].map(theme => (
              <div key={theme} className="p-3 rounded border border-border text-center">
                <BUI.Text size="sm" weight="medium">{theme}</BUI.Text>
              </div>
            ))}
          </div>

          <CodeSnippet
            title="Switching themes"
            code={`import { useTheme } from '@bluesky-ui/ui'

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="blue">Blue</option>
      <option value="black">Black</option>
      <option value="green">Green</option>
      <option value="orange">Orange</option>
      <option value="light">Light</option>
      <option value="aurora">Aurora</option>
    </select>
  )
}`}
          />

          <CodeSnippet
            title="useTheme hook API"
            code={`const {
  theme,              // Current theme name
  setTheme,           // Set theme by name
  fontSizeScale,      // Current font scale (0.5-2)
  setFontSizeScale,   // Adjust font size
  transitionEnabled,  // Theme transition animations
  setTransitionEnabled,
  customTheme,        // Current custom theme object
  setCustomTheme,     // Apply custom theme
} = useTheme()`}
          />
        </BUI.VStack>
      </Section>

      {/* Custom Themes */}
      <Section title="6. Custom Themes" id="custom-themes">
        <BUI.VStack spacing="md" align="stretch">
          <BUI.Text>
            Create custom themes by defining CSS variables. Themes can be applied via CSS or JavaScript.
          </BUI.Text>

          <BUI.Text weight="semibold">Method 1: CSS File</BUI.Text>
          <CodeSnippet
            title="custom-theme.css"
            code={`[data-theme="my-theme"] {
  /* Primary colors (HSL values without hsl()) */
  --primary: 280 80% 60%;
  --primary-foreground: 0 0% 100%;
  
  /* Backgrounds */
  --background: 280 30% 8%;
  --foreground: 280 20% 95%;
  --surface: 280 25% 12%;
  
  /* ... other tokens */
}`}
          />

          <BUI.Text weight="semibold">Method 2: JavaScript Object</BUI.Text>
          <CodeSnippet
            title="Apply via setCustomTheme"
            code={`import { useThemeStore } from '@bluesky-ui/ui'

const myTheme = {
  name: 'neon-purple',
  tokens: {
    '--primary': '280 80% 60%',
    '--primary-foreground': '0 0% 100%',
    '--background': '280 30% 8%',
    '--foreground': '280 20% 95%',
    '--surface': '280 25% 12%',
    // ... all required tokens
  }
}

// Apply the theme
const { setCustomTheme, setTheme } = useThemeStore()
setCustomTheme(myTheme)
setTheme('neon-purple')`}
          />

          <BUI.Text weight="semibold">Method 3: Import JSON File</BUI.Text>
          <CodeSnippet
            title="Load theme from JSON"
            code={`// theme.json
{
  "name": "custom-dark",
  "tokens": {
    "--primary": "200 80% 50%",
    "--background": "220 30% 8%",
    ...
  }
}

// In your app
const response = await fetch('/theme.json')
const theme = await response.json()
setCustomTheme(theme)
setTheme(theme.name)`}
          />

          <BUI.Card className="p-4 bg-warning/10 border-warning/30">
            <BUI.Text size="sm">
              <strong>Required Tokens:</strong> All color tokens must be defined for a complete theme. 
              Missing tokens will fall back to the default theme.
            </BUI.Text>
          </BUI.Card>

          <BUI.Text weight="semibold">Complete Token Reference</BUI.Text>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
            <div>
              <BUI.Text size="xs" weight="semibold" className="mb-2">Colors</BUI.Text>
              <ul className="space-y-1 text-muted-foreground">
                <li>--primary</li>
                <li>--primary-foreground</li>
                <li>--secondary</li>
                <li>--secondary-foreground</li>
                <li>--accent</li>
                <li>--accent-foreground</li>
              </ul>
            </div>
            <div>
              <BUI.Text size="xs" weight="semibold" className="mb-2">Backgrounds</BUI.Text>
              <ul className="space-y-1 text-muted-foreground">
                <li>--background</li>
                <li>--foreground</li>
                <li>--surface</li>
                <li>--elevated</li>
                <li>--overlay</li>
              </ul>
            </div>
            <div>
              <BUI.Text size="xs" weight="semibold" className="mb-2">Muted & Borders</BUI.Text>
              <ul className="space-y-1 text-muted-foreground">
                <li>--muted</li>
                <li>--muted-foreground</li>
                <li>--border</li>
                <li>--input</li>
                <li>--ring</li>
              </ul>
            </div>
            <div>
              <BUI.Text size="xs" weight="semibold" className="mb-2">Semantic</BUI.Text>
              <ul className="space-y-1 text-muted-foreground">
                <li>--success</li>
                <li>--warning</li>
                <li>--error</li>
                <li>--info</li>
              </ul>
            </div>
          </div>
        </BUI.VStack>
      </Section>

      {/* Effect System */}
      <Section title="7. Effect System (Glows, Gradients, Shadows)" id="effect-system">
        <BUI.VStack spacing="md" align="stretch">
          <BUI.Text>
            Bluesky UI supports advanced visual effects through CSS variables. 
            Define effect tokens in your theme, then use them via component props or utility classes.
          </BUI.Text>

          <BUI.Text weight="semibold">Effect Tokens</BUI.Text>
          <CodeSnippet
            title="Define effects in your theme"
            code={`{
  "name": "glowing-theme",
  "tokens": {
    // ... color tokens ...
    
    // Shadows (CSS box-shadow values)
    "--shadow-sm": "0 1px 2px rgba(0,0,0,0.1)",
    "--shadow-md": "0 4px 12px rgba(0,0,0,0.15)",
    "--shadow-lg": "0 8px 24px rgba(0,0,0,0.2)",
    "--shadow-xl": "0 16px 48px rgba(0,0,0,0.25)",
    
    // Glows (colored box-shadows)
    "--glow-sm": "0 0 8px hsl(200 80% 50% / 0.3)",
    "--glow-md": "0 0 15px hsl(200 80% 50% / 0.4)",
    "--glow-lg": "0 0 25px hsl(200 80% 50% / 0.5)",
    "--glow-primary": "0 0 20px hsl(200 80% 50% / 0.5)",
    "--glow-accent": "0 0 15px hsl(160 75% 50% / 0.5)",
    
    // Gradients (CSS gradient values)
    "--gradient-primary": "linear-gradient(135deg, #3b82f6, #06b6d4)",
    "--gradient-accent": "linear-gradient(135deg, #06b6d4, #10b981)",
    "--gradient-surface": "linear-gradient(180deg, #1a1a2e, #16213e)",
    "--gradient-text": "linear-gradient(90deg, #3b82f6, #10b981)"
  }
}`}
          />

          <BUI.Text weight="semibold">Using Effects on Components</BUI.Text>
          <CodeSnippet
            title="Component props"
            code={`// Button with glow
<Button glow>Glowing Button</Button>
<Button glow="lg">Large Glow</Button>

// Button with gradient background
<Button gradient>Gradient Button</Button>

// Card with effects
<Card glow shadow="lg">
  Glowing card with large shadow
</Card>

// Combine effects
<Card glow="md" shadow="xl" gradient>
  Maximum effects!
</Card>`}
          />

          <BUI.Text weight="semibold">Using Utility Classes</BUI.Text>
          <CodeSnippet
            title="CSS utility classes"
            code={`// Glow classes
<div className="glow-sm">Small glow</div>
<div className="glow-md">Medium glow</div>
<div className="glow-lg">Large glow</div>
<div className="glow-primary">Primary color glow</div>
<div className="glow-accent">Accent color glow</div>

// Shadow classes
<div className="shadow-theme-sm">Small shadow</div>
<div className="shadow-theme-lg">Large shadow</div>

// Gradient classes
<div className="bg-gradient-primary">Gradient background</div>
<span className="text-gradient">Gradient text</span>

// Interactive effects
<button className="effect-glow-on-hover">Glow on hover</button>
<input className="effect-glow-on-focus" />`}
          />

          <BUI.Card className="p-4 bg-info/10 border-info/30">
            <BUI.Text size="sm">
              <strong>Note:</strong> Effects only appear if the theme defines the corresponding tokens. 
              Built-in themes have <code className="bg-muted px-1 rounded">--glow-*: none</code> by default.
              The Aurora theme includes all glow and gradient effects.
            </BUI.Text>
          </BUI.Card>
        </BUI.VStack>
      </Section>

      {/* Theme Creator */}
      <Section title="8. Theme Creator Tool" id="theme-creator">
        <BUI.VStack spacing="md" align="stretch">
          <BUI.Text>
            Use this interactive tool to create custom themes. Adjust colors and effects, 
            preview in real-time, then export as JSON or CSS.
          </BUI.Text>
          
          <ThemeCreator />
        </BUI.VStack>
      </Section>
    </BUI.VStack>
  )
}
