import { ArrowRight, Palette, Layers, Zap, Accessibility } from 'lucide-react'
import { Link } from 'react-router-dom'
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Button,
  Divider 
} from '@bluesky-ui/ui'
import { CodeBlock, Section } from '../components/docs'

export function Home() {
  return (
    <VStack spacing="xl" align="stretch" className="max-w-4xl">
      {/* Hero */}
      <Box as="section">
        <VStack spacing="md" align="start">
          <Heading as="h1" size="4xl">
            Welcome to <span className="text-primary">Bluesky UI</span>
          </Heading>
          <Text size="lg" color="muted" className="max-w-2xl">
            A desktop-first, media- and AI-capable component library built with React, 
            TypeScript, and Tailwind CSS. Designed for building beautiful, accessible, 
            and performant applications.
          </Text>
          <HStack spacing="md" className="mt-2">
            <Link to="/theming">
              <Button variant="solid" colorScheme="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                View on GitHub
              </Button>
            </a>
          </HStack>
        </VStack>
      </Box>

      <Divider />

      {/* Features */}
      <Section title="Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            icon={<Palette className="w-6 h-6" />}
            title="5 Built-in Themes"
            description="Blue, Black, Green, Orange, and Light themes with runtime switching and smooth transitions."
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6" />}
            title="230+ Components"
            description="From buttons to data grids, chat interfaces to music players — everything you need."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Performance First"
            description="Virtual scrolling, code splitting, and optimized renders for smooth 60fps UIs."
          />
          <FeatureCard
            icon={<Accessibility className="w-6 h-6" />}
            title="Fully Accessible"
            description="WCAG 2.1 compliant with keyboard navigation, screen reader support, and reduced motion."
          />
        </div>
      </Section>

      {/* Quick Start */}
      <Section title="Quick Start">
        <CodeBlock
          filename="App.tsx"
          showLineNumbers
          code={`// Install the package
pnpm add @bluesky-ui/ui

// Import styles and provider
import '@bluesky-ui/ui/styles.css'
import { BlueskyUIProvider } from '@bluesky-ui/ui'

// Wrap your app
function App() {
  return (
    <BlueskyUIProvider defaultTheme="blue">
      <YourApp />
    </BlueskyUIProvider>
  )
}`}
        />
      </Section>

      {/* Status */}
      <Box 
        className="p-4 bg-warning/10 border border-warning/20 rounded-lg"
      >
        <VStack spacing="xs" align="start">
          <Heading as="h3" size="sm" className="text-warning">
            Under Development
          </Heading>
          <Text size="sm" color="muted">
            Bluesky UI is currently in active development. Phases 0–10 are complete.
            We’re now expanding the roadmap with Phase 11+ initiatives.
          </Text>
        </VStack>
      </Box>
    </VStack>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Box 
      className="
        bg-surface rounded-lg p-6 border border-border
        transition-all duration-200
        hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5
      "
    >
      <VStack spacing="sm" align="start">
        <Box className="text-primary">{icon}</Box>
        <Heading as="h3" size="sm">{title}</Heading>
        <Text size="sm" color="muted">{description}</Text>
      </VStack>
    </Box>
  )
}
