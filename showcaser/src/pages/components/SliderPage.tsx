import { useState } from 'react'
import { Slider, Stack, Text, Box } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const sliderProps = [
  { name: 'value', type: 'number', description: 'Controlled value' },
  { name: 'defaultValue', type: 'number', default: '0', description: 'Default value (uncontrolled)' },
  { name: 'onChange', type: '(value: number) => void', description: 'Change handler' },
  { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
  { name: 'step', type: 'number', default: '1', description: 'Step increment' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the slider' },
  { name: 'showValue', type: 'boolean', default: 'false', description: 'Show current value label' },
  { name: 'formatValue', type: '(value: number) => string', description: 'Custom value formatter' },
]

export function SliderPage() {
  const [volume, setVolume] = useState(50)
  const [price, setPrice] = useState(250)
  const [percentage, setPercentage] = useState(75)

  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Slider"
        description="A range slider component for selecting numeric values within a specified range."
      />

      <Section title="Basic Usage">
        <ComponentPreview
          code={`<Slider 
  value={volume} 
  onChange={setVolume}
/>

<Text>Current value: {volume}</Text>`}
        >
          <Stack gap={3}>
            <Slider value={volume} onChange={setVolume} />
            <Text className="text-sm text-muted">Current value: {volume}</Text>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview
          code={`<Stack gap={6}>
  <Slider size="sm" defaultValue={30} />
  <Slider size="md" defaultValue={50} />
  <Slider size="lg" defaultValue={70} />
</Stack>`}
        >
          <Stack gap={8}>
            <Box>
              <Text className="text-sm text-muted mb-2">Small</Text>
              <Slider size="sm" defaultValue={30} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Medium (default)</Text>
              <Slider size="md" defaultValue={50} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Large</Text>
              <Slider size="lg" defaultValue={70} />
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Show Value">
        <ComponentPreview
          code={`<Slider 
  value={percentage}
  onChange={setPercentage}
  showValue
/>`}
        >
          <Slider
            value={percentage}
            onChange={setPercentage}
            showValue
          />
        </ComponentPreview>
      </Section>

      <Section title="Custom Range">
        <ComponentPreview
          code={`<Slider 
  value={price}
  onChange={setPrice}
  min={0}
  max={1000}
  step={50}
  showValue
  formatValue={(v) => \`$\${v}\`}
/>`}
        >
          <Stack gap={2}>
            <Text className="text-sm text-muted">Price: ${price}</Text>
            <Slider
              value={price}
              onChange={setPrice}
              min={0}
              max={1000}
              step={50}
              showValue
              formatValue={(v: number) => `$${v}`}
            />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="With Steps">
        <ComponentPreview
          code={`<Slider 
  defaultValue={5}
  min={0}
  max={10}
  step={1}
  showValue
/>`}
        >
          <Slider
            defaultValue={5}
            min={0}
            max={10}
            step={1}
            showValue
          />
        </ComponentPreview>
      </Section>

      <Section title="Disabled">
        <ComponentPreview
          code={`<Slider defaultValue={60} disabled showValue />`}
        >
          <Slider defaultValue={60} disabled showValue />
        </ComponentPreview>
      </Section>

      <Section title="Props">
        <PropsTable props={sliderProps} />
      </Section>
    </Box>
  )
}

export default SliderPage
