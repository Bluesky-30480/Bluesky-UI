import { Stack, Text, Box, Divider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const boxProps = [
  { name: 'as', type: "'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav'", defaultValue: "'div'", description: 'The HTML element to render' },
  { name: 'padding', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", defaultValue: "'none'", description: 'Padding around the content' },
  { name: 'margin', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", defaultValue: "'none'", description: 'Margin around the box' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultValue: "'none'", description: 'Border radius' },
  { name: 'shadow', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'none'", description: 'Box shadow' },
  { name: 'border', type: 'boolean', defaultValue: 'false', description: 'Whether to show a border' },
  { name: 'background', type: "'none' | 'surface' | 'elevated' | 'overlay'", defaultValue: "'none'", description: 'Background style' },
]

export function BoxPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Box"
        description="A fundamental layout component that provides padding, margin, borders, and backgrounds."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Box padding="md" background="surface" rounded="md" border>
            <Text>Content inside a Box</Text>
          </Box>
        </ComponentPreview>
      </Section>

      <Section title="Padding Sizes">
        <ComponentPreview>
          <Stack spacing="md">
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
              <Box key={size} padding={size} background="surface" rounded="md" border>
                <Text size="sm">Padding: {size}</Text>
              </Box>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Border Radius">
        <ComponentPreview>
          <Stack direction="row" spacing="md" wrap>
            {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((radius) => (
              <Box key={radius} padding="md" background="surface" rounded={radius} border className="w-24 h-24 flex items-center justify-center">
                <Text size="xs">{radius}</Text>
              </Box>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Shadows">
        <ComponentPreview>
          <Stack direction="row" spacing="lg" wrap>
            {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((shadow) => (
              <Box key={shadow} padding="md" background="surface" rounded="md" shadow={shadow} className="w-24 h-24 flex items-center justify-center">
                <Text size="xs">{shadow}</Text>
              </Box>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Background Variants">
        <ComponentPreview>
          <Stack spacing="md">
            {(['none', 'surface', 'elevated', 'overlay'] as const).map((bg) => (
              <Box key={bg} padding="md" background={bg} rounded="md" border>
                <Text size="sm">Background: {bg}</Text>
              </Box>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={boxProps} />
      </Section>
    </Stack>
  )
}
