import { ScrollArea, Stack, Text, Box, Divider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const scrollAreaProps = [
  { name: 'height', type: 'number | string', defaultValue: '-', description: 'Fixed height of the scroll area' },
  { name: 'maxHeight', type: 'number | string', defaultValue: '-', description: 'Maximum height of the scroll area' },
  { name: 'width', type: 'number | string', defaultValue: '-', description: 'Fixed width of the scroll area' },
  { name: 'maxWidth', type: 'number | string', defaultValue: '-', description: 'Maximum width of the scroll area' },
  { name: 'axis', type: "'y' | 'x' | 'both'", defaultValue: "'y'", description: 'Scroll direction' },
  { name: 'viewportClassName', type: 'string', defaultValue: '-', description: 'Additional class names for the scroll viewport' },
]

function DemoItem({ children }: { children: React.ReactNode }) {
  return (
    <Box
      padding="sm"
      background="surface"
      rounded="md"
      border
      className="flex items-center justify-between"
    >
      <Text size="sm">{children}</Text>
    </Box>
  )
}

export function ScrollAreaPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="ScrollArea"
        description="A container that provides scrollable content with consistent layout sizing."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <ScrollArea height={180} className="border border-border rounded-md">
            <Stack spacing="sm" className="p-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <DemoItem key={index}>Item {index + 1}</DemoItem>
              ))}
            </Stack>
          </ScrollArea>
        </ComponentPreview>
      </Section>

      <Section title="Horizontal Scrolling">
        <ComponentPreview>
          <ScrollArea height={140} axis="x" className="border border-border rounded-md">
            <Stack direction="row" spacing="sm" className="p-3 min-w-[720px]">
              {Array.from({ length: 8 }).map((_, index) => (
                <Box
                  key={index}
                  padding="md"
                  background="surface"
                  rounded="md"
                  border
                  className="min-w-[160px] flex items-center justify-center"
                >
                  <Text size="sm">Card {index + 1}</Text>
                </Box>
              ))}
            </Stack>
          </ScrollArea>
        </ComponentPreview>
      </Section>

      <Section title="Both Axes">
        <ComponentPreview>
          <ScrollArea height={180} axis="both" className="border border-border rounded-md">
            <Box className="p-3">
              <Box className="min-w-[720px] min-h-[220px] bg-muted/30 rounded-md border border-dashed border-border flex items-center justify-center">
                <Text size="sm" color="muted">Large content area</Text>
              </Box>
            </Box>
          </ScrollArea>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={scrollAreaProps} />
      </Section>
    </Stack>
  )
}
