import { Mail, Search, Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { Input, Stack, Text, Divider, Box, VStack } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const inputProps = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size' },
  { name: 'variant', type: "'default' | 'filled' | 'ghost'", default: "'default'", description: 'Visual style variant' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
  { name: 'leftElement', type: 'ReactNode', default: '-', description: 'Element to show at the start' },
  { name: 'rightElement', type: 'ReactNode', default: '-', description: 'Element to show at the end' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Take full width of container' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
  { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text' },
]

export default function InputPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Stack spacing="xl">
      <PageHeader
        title="Input"
        description="A versatile text input component with support for icons, validation states, and multiple variants."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Input placeholder="Enter your text..." />
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <VStack spacing="md" align="stretch" className="w-64">
            <Input size="sm" placeholder="Small input" />
            <Input size="md" placeholder="Medium input" />
            <Input size="lg" placeholder="Large input" />
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview>
          <VStack spacing="md" align="stretch" className="w-64">
            <Input variant="default" placeholder="Default variant" />
            <Input variant="filled" placeholder="Filled variant" />
            <Input variant="ghost" placeholder="Ghost variant" />
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="With Icons">
        <ComponentPreview>
          <VStack spacing="md" align="stretch" className="w-64">
            <Input 
              leftElement={<Mail className="h-4 w-4" />} 
              placeholder="Email address" 
            />
            <Input 
              leftElement={<Search className="h-4 w-4" />} 
              placeholder="Search..." 
            />
            <Input 
              leftElement={<Lock className="h-4 w-4" />}
              rightElement={
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              type={showPassword ? 'text' : 'password'}
              placeholder="Password" 
            />
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="States">
        <ComponentPreview>
          <VStack spacing="md" align="stretch" className="w-64">
            <Box>
              <Text size="xs" color="muted" className="mb-1">Normal</Text>
              <Input placeholder="Normal input" />
            </Box>
            <Box>
              <Text size="xs" color="muted" className="mb-1">Disabled</Text>
              <Input placeholder="Disabled input" disabled />
            </Box>
            <Box>
              <Text size="xs" color="muted" className="mb-1">Error</Text>
              <Input placeholder="Error input" error />
            </Box>
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="Full Width">
        <ComponentPreview>
          <Input fullWidth placeholder="Full width input..." />
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={inputProps} />
      </Section>
    </Stack>
  )
}
