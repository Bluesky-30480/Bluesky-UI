import { useNavigate } from 'react-router-dom'
import BUI, { useTheme, type ThemeName } from '@bluesky-ui/ui'
import { 
  Sparkles, 
  Palette, 
  Zap, 
  Box as BoxIcon, 
  Layers, 
  Code2, 
  ArrowRight, 
  Github,
  BookOpen,
  Package,
  Paintbrush,
  LayoutGrid,
  MousePointer,
  Accessibility,
  Moon,
  Heart,
  ChevronDown,
  Check,
  Sun
} from 'lucide-react'

// Theme data with descriptions - organized by type
const basicThemes: { name: ThemeName; label: string; color: string; gradient?: string; description: string }[] = [
  { name: 'blue', label: 'Blue', color: 'hsl(217, 91%, 60%)', description: 'Classic professional' },
  { name: 'green', label: 'Green', color: 'hsl(142, 76%, 36%)', description: 'Fresh & natural' },
  { name: 'orange', label: 'Orange', color: 'hsl(24, 95%, 53%)', description: 'Warm & energetic' },
  { name: 'black', label: 'Black', color: 'hsl(0, 0%, 9%)', description: 'Sleek monochrome' },
  { name: 'light', label: 'Light', color: 'hsl(0, 0%, 98%)', description: 'Clean light mode' },
]

const effectThemes: { name: ThemeName; label: string; color: string; gradient?: string; description: string; hasEffects: boolean }[] = [
  { name: 'aurora', label: 'Aurora', color: '', gradient: 'linear-gradient(135deg, hsl(200, 80%, 50%), hsl(160, 75%, 45%))', description: 'Blue-green glows', hasEffects: true },
  { name: 'neon-purple', label: 'Neon Purple', color: '', gradient: 'linear-gradient(135deg, hsl(270, 90%, 60%), hsl(320, 85%, 55%))', description: 'Cyberpunk vibes', hasEffects: true },
  { name: 'sunset', label: 'Sunset', color: '', gradient: 'linear-gradient(135deg, hsl(30, 95%, 55%), hsl(340, 80%, 55%))', description: 'Warm orange-pink', hasEffects: true },
  { name: 'ocean', label: 'Ocean', color: '', gradient: 'linear-gradient(135deg, hsl(210, 90%, 55%), hsl(175, 85%, 45%))', description: 'Deep blue aqua', hasEffects: true },
  { name: 'forest', label: 'Forest', color: '', gradient: 'linear-gradient(135deg, hsl(140, 70%, 40%), hsl(45, 90%, 50%))', description: 'Green & gold', hasEffects: true },
]

// Feature data
const features = [
  {
    icon: Layers,
    title: '80+ Components',
    description: 'From primitives to complex patterns - buttons, forms, modals, charts, and more.',
  },
  {
    icon: Palette,
    title: 'Themeable',
    description: '10 built-in themes with full customization. Create your own with CSS variables.',
  },
  {
    icon: Sparkles,
    title: 'Effect System',
    description: 'Glows, gradients, shadows, and animations - all customizable per theme.',
  },
  {
    icon: Zap,
    title: 'Lightweight',
    description: 'Tree-shakeable exports. Only bundle what you use.',
  },
  {
    icon: Accessibility,
    title: 'Accessible',
    description: 'WAI-ARIA compliant with keyboard navigation and screen reader support.',
  },
  {
    icon: Code2,
    title: 'TypeScript First',
    description: 'Full type safety with comprehensive IntelliSense support.',
  },
]

// Component categories for showcase
const componentCategories = [
  { name: 'Primitives', count: 12, icon: BoxIcon },
  { name: 'Buttons', count: 6, icon: MousePointer },
  { name: 'Inputs', count: 8, icon: LayoutGrid },
  { name: 'Feedback', count: 12, icon: Sparkles },
  { name: 'Navigation', count: 8, icon: Layers },
  { name: 'Data Display', count: 10, icon: LayoutGrid },
  { name: 'Media', count: 10, icon: Paintbrush },
  { name: 'Advanced', count: 8, icon: Code2 },
]

// Code example
const codeExample = `import { Button, Card, Stack } from '@bluesky-ui/ui'

function App() {
  return (
    <Card glow shadow="lg">
      <Stack spacing="md">
        <h1>Welcome to Bluesky UI</h1>
        <Button gradient glow>
          Get Started
        </Button>
      </Stack>
    </Card>
  )
}`

export function LandingPage() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Background Effects - Using component library's bg-blobs */}
      <div className="bg-blobs">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <BUI.HStack justify="between" align="center" className="max-w-7xl mx-auto px-6 py-4">
          <BUI.HStack spacing="sm" align="center">
            <BUI.Box className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </BUI.Box>
            <BUI.Text size="xl" weight="bold">Bluesky UI</BUI.Text>
          </BUI.HStack>
          
          <BUI.HStack spacing="sm">
            <BUI.Button
              variant="ghost"
              size="sm"
              leftIcon={<Github className="w-4 h-4" />}
              onClick={() => window.open('https://github.com/bluesky-30480/Bluesky-UI', '_blank')}
            >
              GitHub
            </BUI.Button>
            <BUI.Button
              variant="solid"
              size="sm"
              colorScheme="primary"
              onClick={() => navigate('/docs')}
            >
              Documentation
            </BUI.Button>
          </BUI.HStack>
        </BUI.HStack>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <BUI.Center className="max-w-5xl mx-auto">
          <BUI.VStack spacing="xl" align="center" className="text-center">
            {/* Badge */}
            <BUI.Box className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-sm animate-float">
              <BUI.HStack spacing="sm" align="center">
                <Package className="w-4 h-4 text-primary" />
                <BUI.Text size="sm" weight="medium" className="text-primary">
                  v1.0.0 — Now Available
                </BUI.Text>
              </BUI.HStack>
            </BUI.Box>

            {/* Heading */}
            <BUI.VStack spacing="md" align="center">
              <BUI.Heading size="4xl" weight="bold" className="max-w-4xl leading-tight">
                Build Beautiful UIs with
                <br />
                <span className="text-gradient">Bluesky UI</span>
              </BUI.Heading>
              <BUI.Text size="xl" color="muted" className="max-w-2xl">
                A comprehensive, themeable component library with 80+ components,
                advanced effects, and full TypeScript support.
              </BUI.Text>
            </BUI.VStack>

            {/* CTA Buttons */}
            <BUI.HStack spacing="md" className="flex-wrap justify-center">
              <BUI.Button
                size="lg"
                variant="solid"
                colorScheme="primary"
                glow
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/docs')}
              >
                Get Started
              </BUI.Button>
              <BUI.Button
                size="lg"
                variant="outline"
                leftIcon={<BookOpen className="w-4 h-4" />}
                onClick={() => navigate('/home')}
              >
                View Components
              </BUI.Button>
            </BUI.HStack>

            {/* Stats */}
            <BUI.HStack spacing="xl" className="pt-8 flex-wrap justify-center">
              <BUI.VStack spacing="none" align="center">
                <BUI.Text size="2xl" weight="bold" className="text-gradient">80+</BUI.Text>
                <BUI.Text size="sm" color="muted">Components</BUI.Text>
              </BUI.VStack>
              <BUI.Divider orientation="vertical" className="h-12 hidden sm:block" />
              <BUI.VStack spacing="none" align="center">
                <BUI.Text size="2xl" weight="bold" className="text-gradient">6</BUI.Text>
                <BUI.Text size="sm" color="muted">Themes</BUI.Text>
              </BUI.VStack>
              <BUI.Divider orientation="vertical" className="h-12 hidden sm:block" />
              <BUI.VStack spacing="none" align="center">
                <BUI.Text size="2xl" weight="bold" className="text-gradient">100%</BUI.Text>
                <BUI.Text size="sm" color="muted">TypeScript</BUI.Text>
              </BUI.VStack>
            </BUI.HStack>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-6 h-6 text-muted-foreground" />
            </div>
          </BUI.VStack>
        </BUI.Center>
      </section>

      {/* Code Preview Section */}
      <section className="relative py-20 px-6">
        <BUI.Center className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
            {/* Left: Text */}
            <BUI.VStack spacing="lg" align="start">
              <BUI.Heading size="2xl" weight="bold">
                Simple, Intuitive API
              </BUI.Heading>
              <BUI.Text color="muted" size="lg">
                Import what you need, use it right away. Every component is designed
                with developer experience in mind.
              </BUI.Text>
              <BUI.VStack spacing="sm" align="start">
                <BUI.HStack spacing="sm" align="center">
                  <BUI.Box className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-success" />
                  </BUI.Box>
                  <BUI.Text size="sm">Tree-shakeable exports</BUI.Text>
                </BUI.HStack>
                <BUI.HStack spacing="sm" align="center">
                  <BUI.Box className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-success" />
                  </BUI.Box>
                  <BUI.Text size="sm">Consistent prop naming</BUI.Text>
                </BUI.HStack>
                <BUI.HStack spacing="sm" align="center">
                  <BUI.Box className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-success" />
                  </BUI.Box>
                  <BUI.Text size="sm">Full IntelliSense support</BUI.Text>
                </BUI.HStack>
              </BUI.VStack>
            </BUI.VStack>

            {/* Right: Code Preview */}
            <BUI.Card className="relative overflow-hidden" glow shadow="lg">
              {/* Window controls */}
              <BUI.HStack spacing="sm" className="px-4 py-3 border-b border-border bg-muted/30">
                <BUI.Box className="w-3 h-3 rounded-full bg-error" />
                <BUI.Box className="w-3 h-3 rounded-full bg-warning" />
                <BUI.Box className="w-3 h-3 rounded-full bg-success" />
                <BUI.Text size="xs" color="muted" className="ml-2 font-mono">App.tsx</BUI.Text>
              </BUI.HStack>
              <pre className="p-4 text-sm overflow-x-auto font-mono">
                <code className="text-muted-foreground">
                  {codeExample.split('\n').map((line, i) => (
                    <div key={i} className="leading-6">
                      <span className="text-muted-foreground/50 select-none mr-4">
                        {String(i + 1).padStart(2, ' ')}
                      </span>
                      <span className={
                        line.includes('import') ? 'text-purple-400' :
                        line.includes('function') ? 'text-blue-400' :
                        line.includes('return') ? 'text-pink-400' :
                        line.includes('<') ? 'text-cyan-400' :
                        'text-foreground'
                      }>
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </BUI.Card>
          </div>
        </BUI.Center>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-6">
        <BUI.Center className="max-w-6xl mx-auto">
          <BUI.VStack spacing="xl" align="center" className="w-full">
            <BUI.VStack spacing="md" align="center" className="text-center">
              <BUI.Heading size="2xl" weight="bold">
                Everything You Need
              </BUI.Heading>
              <BUI.Text color="muted" size="lg" className="max-w-2xl">
                Bluesky UI provides all the building blocks for modern React applications.
              </BUI.Text>
            </BUI.VStack>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {features.map((feature) => (
                <BUI.Card 
                  key={feature.title} 
                  className="p-6 group hover:border-primary/50 transition-all duration-300"
                  shadow="md"
                >
                  <BUI.VStack spacing="md" align="start">
                    <BUI.Box className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:glow-primary transition-all">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </BUI.Box>
                    <BUI.Text size="lg" weight="semibold">{feature.title}</BUI.Text>
                    <BUI.Text size="sm" color="muted">{feature.description}</BUI.Text>
                  </BUI.VStack>
                </BUI.Card>
              ))}
            </div>
          </BUI.VStack>
        </BUI.Center>
      </section>

      {/* Component Categories */}
      <section className="relative py-20 px-6">
        <BUI.Center className="max-w-6xl mx-auto">
          <BUI.VStack spacing="xl" align="center" className="w-full">
            <BUI.VStack spacing="md" align="center" className="text-center">
              <BUI.Heading size="2xl" weight="bold">
                Component Library
              </BUI.Heading>
              <BUI.Text color="muted" size="lg" className="max-w-2xl">
                Explore our comprehensive collection of ready-to-use components.
              </BUI.Text>
            </BUI.VStack>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {componentCategories.map((category, i) => (
                <BUI.Card
                  key={category.name}
                  className="p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                  onClick={() => navigate('/home')}
                >
                  <BUI.HStack spacing="md" align="center">
                    <BUI.Box 
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <category.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </BUI.Box>
                    <BUI.VStack spacing="none" align="start">
                      <BUI.Text size="sm" weight="medium">{category.name}</BUI.Text>
                      <BUI.Text size="xs" color="muted">{category.count} components</BUI.Text>
                    </BUI.VStack>
                  </BUI.HStack>
                </BUI.Card>
              ))}
            </div>

            <BUI.Button
              size="lg"
              variant="outline"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/home')}
              className="mt-4"
            >
              View All Components
            </BUI.Button>
          </BUI.VStack>
        </BUI.Center>
      </section>

      {/* Theme Switcher Section */}
      <section className="relative py-20 px-6 bg-surface/50">
        <BUI.Center className="max-w-6xl mx-auto">
          <BUI.VStack spacing="xl" align="center" className="w-full">
            <BUI.VStack spacing="md" align="center" className="text-center">
              <BUI.Heading size="2xl" weight="bold">
                Try Different Themes
              </BUI.Heading>
              <BUI.Text color="muted" size="lg" className="max-w-2xl">
                Click on any theme to instantly transform the entire page. 
                10 themes included — 5 basic + 5 with glow/gradient effects.
              </BUI.Text>
            </BUI.VStack>

            {/* Basic Themes */}
            <BUI.VStack spacing="sm" align="start" className="w-full">
              <BUI.Text size="sm" weight="semibold" color="muted">Basic Themes</BUI.Text>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
                {basicThemes.map((t) => (
                  <BUI.Card
                    key={t.name}
                    className={`p-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      theme === t.name ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                    }`}
                    onClick={() => setTheme(t.name)}
                  >
                    <BUI.HStack spacing="sm" align="center">
                      <BUI.Box 
                        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center shrink-0"
                        style={{ background: t.gradient || t.color }}
                      >
                        {theme === t.name && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                        {t.name === 'light' && theme !== t.name && <Sun className="w-4 h-4 text-gray-600" />}
                      </BUI.Box>
                      <BUI.VStack spacing="none" align="start">
                        <BUI.Text size="sm" weight="semibold">{t.label}</BUI.Text>
                        <BUI.Text size="xs" color="muted">{t.description}</BUI.Text>
                      </BUI.VStack>
                    </BUI.HStack>
                  </BUI.Card>
                ))}
              </div>
            </BUI.VStack>

            {/* Effect Themes */}
            <BUI.VStack spacing="sm" align="start" className="w-full">
              <BUI.HStack spacing="sm" align="center">
                <BUI.Text size="sm" weight="semibold" color="muted">Effect Themes</BUI.Text>
                <BUI.Badge colorScheme="primary" size="sm">✨ Glow + Gradient + Shadow</BUI.Badge>
              </BUI.HStack>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
                {effectThemes.map((t) => (
                  <BUI.Card
                    key={t.name}
                    className={`p-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      theme === t.name ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                    }`}
                    onClick={() => setTheme(t.name)}
                    glow={theme === t.name ? 'sm' : undefined}
                  >
                    <BUI.HStack spacing="sm" align="center">
                      <BUI.Box 
                        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center shrink-0"
                        style={{ background: t.gradient || t.color }}
                      >
                        {theme === t.name && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                      </BUI.Box>
                      <BUI.VStack spacing="none" align="start">
                        <BUI.Text size="sm" weight="semibold">{t.label}</BUI.Text>
                        <BUI.Text size="xs" color="muted">{t.description}</BUI.Text>
                      </BUI.VStack>
                    </BUI.HStack>
                  </BUI.Card>
                ))}
              </div>
            </BUI.VStack>

            {/* Live Preview */}
            <BUI.Card className="p-6 w-full max-w-3xl" glow shadow="lg">
              <BUI.VStack spacing="md" align="center">
                <BUI.HStack spacing="sm" align="center">
                  <BUI.Text size="sm" color="muted">Live Preview — Current Theme:</BUI.Text>
                  <BUI.Badge colorScheme="primary">{theme}</BUI.Badge>
                  {effectThemes.some(t => t.name === theme) && (
                    <BUI.Badge colorScheme="success" size="sm">✨ Effects Active</BUI.Badge>
                  )}
                </BUI.HStack>
                <BUI.HStack spacing="md" className="flex-wrap justify-center">
                  <BUI.Button variant="solid" colorScheme="primary" glow>Primary</BUI.Button>
                  <BUI.Button variant="outline">Outline</BUI.Button>
                  <BUI.Button variant="ghost">Ghost</BUI.Button>
                  <BUI.Button variant="solid" colorScheme="primary" gradient>Gradient</BUI.Button>
                </BUI.HStack>
                <BUI.HStack spacing="md" className="flex-wrap justify-center">
                  <BUI.Badge colorScheme="success">Success</BUI.Badge>
                  <BUI.Badge colorScheme="warning">Warning</BUI.Badge>
                  <BUI.Badge colorScheme="error">Error</BUI.Badge>
                  <BUI.Badge colorScheme="info">Info</BUI.Badge>
                </BUI.HStack>
                <BUI.HStack spacing="md" className="flex-wrap justify-center">
                  <BUI.Spinner size="sm" />
                  <BUI.Progress value={65} className="w-32" />
                </BUI.HStack>
              </BUI.VStack>
            </BUI.Card>

            {/* Theme Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <BUI.VStack spacing="sm" align="center" className="text-center">
                <BUI.Box className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Paintbrush className="w-5 h-5 text-primary" />
                </BUI.Box>
                <BUI.Text weight="semibold">Custom Colors</BUI.Text>
                <BUI.Text size="sm" color="muted">20+ color tokens per theme</BUI.Text>
              </BUI.VStack>
              <BUI.VStack spacing="sm" align="center" className="text-center">
                <BUI.Box className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </BUI.Box>
                <BUI.Text weight="semibold">Effect Tokens</BUI.Text>
                <BUI.Text size="sm" color="muted">Glows, gradients & shadows</BUI.Text>
              </BUI.VStack>
              <BUI.VStack spacing="sm" align="center" className="text-center">
                <BUI.Box className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-primary" />
                </BUI.Box>
                <BUI.Text weight="semibold">Dark & Light</BUI.Text>
                <BUI.Text size="sm" color="muted">Both modes supported</BUI.Text>
              </BUI.VStack>
            </div>

            <BUI.Button
              variant="outline"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/theming')}
            >
              Customize Themes
            </BUI.Button>
          </BUI.VStack>
        </BUI.Center>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <BUI.Center className="max-w-4xl mx-auto">
          <BUI.Card className="p-12 text-center w-full bg-gradient-surface" glow="lg" shadow="xl">
            <BUI.VStack spacing="lg" align="center">
              <BUI.Heading size="3xl" weight="bold" className="text-gradient">
                Ready to Build?
              </BUI.Heading>
              <BUI.Text color="muted" size="lg" className="max-w-xl">
                Start creating beautiful React applications with Bluesky UI today.
              </BUI.Text>
              <BUI.HStack spacing="md" className="flex-wrap justify-center">
                <BUI.Button
                  size="lg"
                  variant="solid"
                  colorScheme="primary"
                  glow
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate('/docs')}
                >
                  Get Started
                </BUI.Button>
                <BUI.Button
                  size="lg"
                  variant="outline"
                  leftIcon={<Github className="w-4 h-4" />}
                  onClick={() => window.open('https://github.com/bluesky-30480/Bluesky-UI', '_blank')}
                >
                  View on GitHub
                </BUI.Button>
              </BUI.HStack>
            </BUI.VStack>
          </BUI.Card>
        </BUI.Center>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border">
        <BUI.Center className="max-w-6xl mx-auto">
          <BUI.VStack spacing="lg" align="center" className="w-full">
            <BUI.HStack spacing="xl" className="flex-wrap justify-center">
              <BUI.Link onClick={() => navigate('/docs')} className="text-muted-foreground hover:text-foreground cursor-pointer">
                Documentation
              </BUI.Link>
              <BUI.Link onClick={() => navigate('/home')} className="text-muted-foreground hover:text-foreground cursor-pointer">
                Components
              </BUI.Link>
              <BUI.Link onClick={() => navigate('/theming')} className="text-muted-foreground hover:text-foreground cursor-pointer">
                Theming
              </BUI.Link>
              <BUI.Link 
                onClick={() => window.open('https://github.com/bluesky-30480/Bluesky-UI', '_blank')}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                GitHub
              </BUI.Link>
            </BUI.HStack>
            
            <BUI.Divider className="w-full max-w-md" />
            
            <BUI.VStack spacing="sm" align="center">
              <BUI.HStack spacing="sm" align="center">
                <BUI.Text size="sm" color="muted">
                  Fully coded using
                </BUI.Text>
                <BUI.HStack spacing="xs" align="center">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <BUI.Text size="sm" weight="semibold" className="text-gradient">
                    Bluesky UI
                  </BUI.Text>
                </BUI.HStack>
              </BUI.HStack>
              <BUI.HStack spacing="xs" align="center">
                <BUI.Text size="xs" color="muted">Created by</BUI.Text>
                <BUI.Text size="xs" weight="semibold">Bluesky-30480</BUI.Text>
              </BUI.HStack>
              <BUI.HStack spacing="xs" align="center">
                <BUI.Text size="xs" color="muted">MIT License with Attribution •</BUI.Text>
                <BUI.Link 
                  onClick={() => window.open('https://github.com/bluesky-30480/Bluesky-UI/blob/main/LICENSE', '_blank')}
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  View License
                </BUI.Link>
              </BUI.HStack>
              <BUI.HStack spacing="xs" align="center" className="pt-2">
                <BUI.Text size="xs" color="muted">Made with</BUI.Text>
                <Heart className="w-3 h-3 text-error fill-error" />
                <BUI.Text size="xs" color="muted">© 2026</BUI.Text>
              </BUI.HStack>
            </BUI.VStack>
          </BUI.VStack>
        </BUI.Center>
      </footer>
    </div>
  )
}
