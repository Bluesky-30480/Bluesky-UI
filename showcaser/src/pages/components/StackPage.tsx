import { Stack, Text, Box, Divider, HStack, VStack } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const stackProps = [
  { name: 'direction', type: "'row' | 'column'", defaultValue: "'column'", description: 'The direction of the stack' },
  { name: 'spacing', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'", defaultValue: "'md'", description: 'Space between items' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", defaultValue: "'stretch'", description: 'Alignment along the cross axis' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", defaultValue: "'start'", description: 'Alignment along the main axis' },
  { name: 'wrap', type: 'boolean', defaultValue: 'false', description: 'Whether items should wrap' },
  { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'Whether the stack should be inline' },
]

function DemoBox({ children }: { children?: React.ReactNode }) {
  return (
    <Box padding="sm" background="elevated" rounded="md" border className="min-h-[48px] min-w-[48px] flex items-center justify-center">
      <Text size="sm">{children || 'Item'}</Text>
    </Box>
  )
}

export function StackPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Stack"
        description="A layout component that arranges children in a horizontal or vertical stack with consistent spacing."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Stack spacing="md">
            <DemoBox>Item 1</DemoBox>
            <DemoBox>Item 2</DemoBox>
            <DemoBox>Item 3</DemoBox>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Direction">
        <ComponentPreview>
          <Stack spacing="lg">
            <Text weight="medium">Column (default)</Text>
            <Stack direction="column" spacing="sm">
              <DemoBox>1</DemoBox>
              <DemoBox>2</DemoBox>
              <DemoBox>3</DemoBox>
            </Stack>
            
            <Text weight="medium">Row</Text>
            <Stack direction="row" spacing="sm">
              <DemoBox>1</DemoBox>
              <DemoBox>2</DemoBox>
              <DemoBox>3</DemoBox>
            </Stack>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Spacing">
        <ComponentPreview>
          <Stack spacing="lg">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((spacing) => (
              <Stack key={spacing} spacing="sm">
                <Text size="sm" color="muted">spacing="{spacing}"</Text>
                <Stack direction="row" spacing={spacing}>
                  <DemoBox />
                  <DemoBox />
                  <DemoBox />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Alignment">
        <ComponentPreview>
          <Stack spacing="lg">
            {(['start', 'center', 'end'] as const).map((align) => (
              <Stack key={align} spacing="sm">
                <Text size="sm" color="muted">align="{align}"</Text>
                <Stack direction="row" spacing="sm" align={align} className="h-24 bg-muted/30 rounded-md p-2">
                  <DemoBox>Small</DemoBox>
                  <DemoBox>Medium Item</DemoBox>
                  <DemoBox>Tall</DemoBox>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Convenience Components">
        <ComponentPreview>
          <Stack spacing="lg">
            <Stack spacing="sm">
              <Text weight="medium">HStack (horizontal)</Text>
              <HStack spacing="sm">
                <DemoBox>1</DemoBox>
                <DemoBox>2</DemoBox>
                <DemoBox>3</DemoBox>
              </HStack>
            </Stack>
            
            <Stack spacing="sm">
              <Text weight="medium">VStack (vertical)</Text>
              <VStack spacing="sm">
                <DemoBox>1</DemoBox>
                <DemoBox>2</DemoBox>
                <DemoBox>3</DemoBox>
              </VStack>
            </Stack>
          </Stack>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={stackProps} />
      </Section>
    </Stack>
  )
}
