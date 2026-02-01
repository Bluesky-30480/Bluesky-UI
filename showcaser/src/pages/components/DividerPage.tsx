import { Stack, Text, Divider, Box } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const dividerProps = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Direction of the divider' },
  { name: 'variant', type: "'solid' | 'dashed' | 'dotted'", defaultValue: "'solid'", description: 'Line style' },
  { name: 'thickness', type: "'thin' | 'medium' | 'thick'", defaultValue: "'thin'", description: 'Line thickness' },
  { name: 'spacing', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Margin around the divider' },
  { name: 'color', type: "'default' | 'muted' | 'primary'", defaultValue: "'default'", description: 'Line color' },
]

export function DividerPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Divider"
        description="A visual separator to create clear boundaries between content sections."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Stack spacing="md">
            <Text>Content above the divider</Text>
            <Divider />
            <Text>Content below the divider</Text>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Orientation">
        <ComponentPreview>
          <Stack spacing="lg">
            <Stack spacing="sm">
              <Text size="sm" color="muted">Horizontal (default)</Text>
              <Box padding="md" background="surface" rounded="md">
                <Stack spacing="md">
                  <Text>Section 1</Text>
                  <Divider orientation="horizontal" />
                  <Text>Section 2</Text>
                </Stack>
              </Box>
            </Stack>
            
            <Stack spacing="sm">
              <Text size="sm" color="muted">Vertical</Text>
              <Box padding="md" background="surface" rounded="md">
                <Stack direction="row" spacing="md" align="stretch" className="h-24">
                  <Text>Left</Text>
                  <Divider orientation="vertical" />
                  <Text>Right</Text>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview>
          <Stack spacing="lg">
            {(['solid', 'dashed', 'dotted'] as const).map((variant) => (
              <Stack key={variant} spacing="sm">
                <Text size="sm" color="muted">variant="{variant}"</Text>
                <Divider variant={variant} spacing="xs" />
              </Stack>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Thickness">
        <ComponentPreview>
          <Stack spacing="lg">
            {(['thin', 'medium', 'thick'] as const).map((thickness) => (
              <Stack key={thickness} spacing="sm">
                <Text size="sm" color="muted">thickness="{thickness}"</Text>
                <Divider thickness={thickness} spacing="xs" />
              </Stack>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Colors">
        <ComponentPreview>
          <Stack spacing="lg">
            {(['default', 'muted', 'primary'] as const).map((color) => (
              <Stack key={color} spacing="sm">
                <Text size="sm" color="muted">color="{color}"</Text>
                <Divider color={color} thickness="medium" spacing="xs" />
              </Stack>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Spacing">
        <ComponentPreview>
          <Stack spacing="none">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((spacing) => (
              <Box key={spacing} padding="sm" background="surface">
                <Text size="sm">spacing="{spacing}"</Text>
                <Divider spacing={spacing} />
                <Text size="sm" color="muted">Content after divider</Text>
              </Box>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={dividerProps} />
      </Section>
    </Stack>
  )
}
