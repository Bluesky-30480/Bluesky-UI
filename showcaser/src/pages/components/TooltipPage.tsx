import { Tooltip, Stack, Box, Text, Button } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const tooltipProps = [
  { name: 'content', type: 'ReactNode', required: true, description: 'Tooltip content' },
  { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Placement of the tooltip' },
  { name: 'delay', type: 'number', default: '200', description: 'Delay before showing (ms)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether tooltip is disabled' },
  { name: 'arrow', type: 'boolean', default: 'true', description: 'Show arrow' },
  { name: 'maxWidth', type: 'number | string', default: '250', description: 'Max width of tooltip' },
]

export function TooltipPage() {
  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Tooltip"
        description="Tooltips display informative text when users hover over or focus on an element."
      />

      <Section title="Basic Usage">
        <ComponentPreview
          code={`<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`}
        >
          <Tooltip content="This is a tooltip">
            <Button>Hover me</Button>
          </Tooltip>
        </ComponentPreview>
      </Section>

      <Section title="Placements">
        <ComponentPreview
          code={`<Stack direction="row" gap={4}>
  <Tooltip content="Top tooltip" placement="top">
    <Button variant="outline">Top</Button>
  </Tooltip>
  <Tooltip content="Bottom tooltip" placement="bottom">
    <Button variant="outline">Bottom</Button>
  </Tooltip>
  <Tooltip content="Left tooltip" placement="left">
    <Button variant="outline">Left</Button>
  </Tooltip>
  <Tooltip content="Right tooltip" placement="right">
    <Button variant="outline">Right</Button>
  </Tooltip>
</Stack>`}
        >
          <Stack direction="row" gap={4} className="flex-wrap py-8">
            <Tooltip content="Top tooltip" placement="top">
              <Button variant="outline">Top</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" placement="bottom">
              <Button variant="outline">Bottom</Button>
            </Tooltip>
            <Tooltip content="Left tooltip" placement="left">
              <Button variant="outline">Left</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" placement="right">
              <Button variant="outline">Right</Button>
            </Tooltip>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="With Arrow">
        <ComponentPreview
          code={`<Stack direction="row" gap={4}>
  <Tooltip content="With arrow" arrow={true}>
    <Button variant="outline">Arrow</Button>
  </Tooltip>
  <Tooltip content="Without arrow" arrow={false}>
    <Button variant="outline">No Arrow</Button>
  </Tooltip>
</Stack>`}
        >
          <Stack direction="row" gap={4}>
            <Tooltip content="With arrow" arrow={true}>
              <Button variant="outline">Arrow</Button>
            </Tooltip>
            <Tooltip content="Without arrow" arrow={false}>
              <Button variant="outline">No Arrow</Button>
            </Tooltip>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Delay">
        <ComponentPreview
          code={`<Stack direction="row" gap={4}>
  <Tooltip content="No delay" delay={0}>
    <Button variant="outline">Instant</Button>
  </Tooltip>
  <Tooltip content="200ms delay" delay={200}>
    <Button variant="outline">200ms</Button>
  </Tooltip>
  <Tooltip content="500ms delay" delay={500}>
    <Button variant="outline">500ms</Button>
  </Tooltip>
</Stack>`}
        >
          <Stack direction="row" gap={4}>
            <Tooltip content="No delay" delay={0}>
              <Button variant="outline">Instant</Button>
            </Tooltip>
            <Tooltip content="200ms delay" delay={200}>
              <Button variant="outline">200ms</Button>
            </Tooltip>
            <Tooltip content="500ms delay" delay={500}>
              <Button variant="outline">500ms</Button>
            </Tooltip>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Long Content">
        <ComponentPreview
          code={`<Tooltip 
  content="This is a longer tooltip with more content. It will wrap automatically when it reaches the max width."
  maxWidth={200}
>
  <Button variant="outline">Long tooltip</Button>
</Tooltip>`}
        >
          <Tooltip
            content="This is a longer tooltip with more content. It will wrap automatically when it reaches the max width."
            maxWidth={200}
          >
            <Button variant="outline">Long tooltip</Button>
          </Tooltip>
        </ComponentPreview>
      </Section>

      <Section title="Rich Content">
        <ComponentPreview
          code={`<Tooltip 
  content={
    <Stack gap={1}>
      <Text className="font-semibold">Keyboard Shortcut</Text>
      <Text className="text-xs opacity-80">Ctrl + K</Text>
    </Stack>
  }
>
  <Button variant="outline">Rich tooltip</Button>
</Tooltip>`}
        >
          <Tooltip
            content={
              <Stack gap={1}>
                <Text className="font-semibold">Keyboard Shortcut</Text>
                <Text className="text-xs opacity-80">Ctrl + K</Text>
              </Stack>
            }
          >
            <Button variant="outline">Rich tooltip</Button>
          </Tooltip>
        </ComponentPreview>
      </Section>

      <Section title="Disabled">
        <ComponentPreview
          code={`<Tooltip content="You won't see this" disabled>
  <Button variant="outline">Disabled tooltip</Button>
</Tooltip>`}
        >
          <Tooltip content="You won't see this" disabled>
            <Button variant="outline">Disabled tooltip</Button>
          </Tooltip>
        </ComponentPreview>
      </Section>

      <Section title="On Various Elements">
        <ComponentPreview
          code={`<Stack direction="row" gap={4} align="center">
  <Tooltip content="Button tooltip">
    <Button size="sm">Button</Button>
  </Tooltip>
  
  <Tooltip content="Text tooltip">
    <Text className="cursor-help underline decoration-dotted">
      Hover this text
    </Text>
  </Tooltip>
  
  <Tooltip content="Icon tooltip">
    <Box className="w-8 h-8 rounded bg-muted flex items-center justify-center cursor-help">
      ?
    </Box>
  </Tooltip>
</Stack>`}
        >
          <Stack direction="row" gap={4} align="center">
            <Tooltip content="Button tooltip">
              <Button size="sm">Button</Button>
            </Tooltip>
            
            <Tooltip content="Text tooltip">
              <Text className="cursor-help underline decoration-dotted">
                Hover this text
              </Text>
            </Tooltip>
            
            <Tooltip content="Icon tooltip">
              <Box className="w-8 h-8 rounded bg-muted flex items-center justify-center cursor-help">
                ?
              </Box>
            </Tooltip>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Props">
        <PropsTable props={tooltipProps} />
      </Section>
    </Box>
  )
}

export default TooltipPage
