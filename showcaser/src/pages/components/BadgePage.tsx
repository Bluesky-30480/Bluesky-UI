import { Badge, Stack, Text, Box } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const badgeProps = [
  { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'dot'", default: "'soft'", description: 'Style variant' },
  { name: 'colorScheme', type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'", default: "'default'", description: 'Color scheme' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant' },
  { name: 'rounded', type: 'boolean', default: 'false', description: 'Make the badge pill shaped' },
]

export function BadgePage() {
  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Badge"
        description="Badges are used to highlight status, labels, or counts. They can be used standalone or attached to other elements."
      />

      <Section title="Basic Usage">
        <ComponentPreview code={`<Badge>Default</Badge>`}>
          <Badge>Default</Badge>
        </ComponentPreview>
      </Section>

      <Section title="Color Schemes">
        <ComponentPreview
          code={`<Stack direction="row" gap={2} wrap>
  <Badge colorScheme="default">Default</Badge>
  <Badge colorScheme="primary">Primary</Badge>
  <Badge colorScheme="success">Success</Badge>
  <Badge colorScheme="warning">Warning</Badge>
  <Badge colorScheme="error">Error</Badge>
  <Badge colorScheme="info">Info</Badge>
</Stack>`}
        >
          <Stack direction="row" gap={2} wrap>
            <Badge colorScheme="default">Default</Badge>
            <Badge colorScheme="primary">Primary</Badge>
            <Badge colorScheme="success">Success</Badge>
            <Badge colorScheme="warning">Warning</Badge>
            <Badge colorScheme="error">Error</Badge>
            <Badge colorScheme="info">Info</Badge>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview
          code={`<Stack gap={4}>
  <Stack direction="row" gap={2}>
    <Badge variant="solid" colorScheme="primary">Solid</Badge>
    <Badge variant="soft" colorScheme="primary">Soft</Badge>
    <Badge variant="outline" colorScheme="primary">Outline</Badge>
    <Badge variant="dot" colorScheme="primary">Dot</Badge>
  </Stack>
</Stack>`}
        >
          <Stack gap={6}>
            {(['primary', 'success', 'warning', 'error'] as const).map((color) => (
              <Box key={color}>
                <Text className="text-sm text-muted mb-2 capitalize">{color}</Text>
                <Stack direction="row" gap={2}>
                  <Badge variant="solid" colorScheme={color}>Solid</Badge>
                  <Badge variant="soft" colorScheme={color}>Soft</Badge>
                  <Badge variant="outline" colorScheme={color}>Outline</Badge>
                  <Badge variant="dot" colorScheme={color}>Dot</Badge>
                </Stack>
              </Box>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview
          code={`<Stack direction="row" gap={2} align="center">
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
  <Badge size="lg">Large</Badge>
</Stack>`}
        >
          <Stack direction="row" gap={2} align="center">
            <Badge size="sm" colorScheme="primary">Small</Badge>
            <Badge size="md" colorScheme="primary">Medium</Badge>
            <Badge size="lg" colorScheme="primary">Large</Badge>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Rounded">
        <ComponentPreview
          code={`<Stack direction="row" gap={2}>
  <Badge>Default</Badge>
  <Badge rounded>Pill</Badge>
</Stack>`}
        >
          <Stack direction="row" gap={2}>
            <Badge colorScheme="primary">Default radius</Badge>
            <Badge colorScheme="primary" rounded>Pill shape</Badge>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Use Cases">
        <ComponentPreview
          code={`<Stack gap={4}>
  {/* Status indicators */}
  <Stack direction="row" gap={2}>
    <Badge variant="dot" colorScheme="success">Online</Badge>
    <Badge variant="dot" colorScheme="warning">Away</Badge>
    <Badge variant="dot" colorScheme="error">Offline</Badge>
  </Stack>
  
  {/* Counts */}
  <Stack direction="row" gap={2}>
    <Badge colorScheme="primary" rounded>3</Badge>
    <Badge colorScheme="error" rounded>99+</Badge>
  </Stack>
  
  {/* Labels */}
  <Stack direction="row" gap={2}>
    <Badge variant="soft" colorScheme="info">New</Badge>
    <Badge variant="soft" colorScheme="warning">Beta</Badge>
    <Badge variant="soft" colorScheme="success">Verified</Badge>
  </Stack>
</Stack>`}
        >
          <Stack gap={6}>
            <Box>
              <Text className="text-sm text-muted mb-2">Status indicators</Text>
              <Stack direction="row" gap={2}>
                <Badge variant="dot" colorScheme="success">Online</Badge>
                <Badge variant="dot" colorScheme="warning">Away</Badge>
                <Badge variant="dot" colorScheme="error">Offline</Badge>
              </Stack>
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Notification counts</Text>
              <Stack direction="row" gap={2}>
                <Badge colorScheme="primary" rounded>3</Badge>
                <Badge colorScheme="error" rounded>99+</Badge>
              </Stack>
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Feature labels</Text>
              <Stack direction="row" gap={2}>
                <Badge variant="soft" colorScheme="info">New</Badge>
                <Badge variant="soft" colorScheme="warning">Beta</Badge>
                <Badge variant="soft" colorScheme="success">Verified</Badge>
              </Stack>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Props">
        <PropsTable props={badgeProps} />
      </Section>
    </Box>
  )
}

export default BadgePage
