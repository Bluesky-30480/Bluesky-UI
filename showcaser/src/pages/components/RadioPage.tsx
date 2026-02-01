import { useState } from 'react'
import { Radio, RadioGroup, Stack, Text, Box } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const radioProps = [
  { name: 'value', type: 'string', required: true, description: 'Value of the radio option' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the radio' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the radio' },
  { name: 'children', type: 'ReactNode', description: 'Label content' },
]

const radioGroupProps = [
  { name: 'value', type: 'string', description: 'Controlled value' },
  { name: 'defaultValue', type: 'string', description: 'Default value (uncontrolled)' },
  { name: 'onChange', type: '(value: string) => void', description: 'Change handler' },
  { name: 'name', type: 'string', description: 'Form field name' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all radios' },
  { name: 'direction', type: "'row' | 'column'", default: "'column'", description: 'Layout direction' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size for all radios' },
]

export function RadioPage() {
  const [value, setValue] = useState('option1')
  const [size, setSize] = useState('medium')

  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Radio"
        description="Radio buttons allow users to select one option from a set of mutually exclusive options."
      />

      <Section title="Basic Usage">
        <ComponentPreview
          code={`<RadioGroup value={value} onChange={setValue}>
  <Radio value="option1">Option 1</Radio>
  <Radio value="option2">Option 2</Radio>
  <Radio value="option3">Option 3</Radio>
</RadioGroup>`}
        >
          <RadioGroup value={value} onChange={setValue}>
            <Radio value="option1">Option 1</Radio>
            <Radio value="option2">Option 2</Radio>
            <Radio value="option3">Option 3</Radio>
          </RadioGroup>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview
          code={`<Stack gap={4}>
  <RadioGroup value={size} onChange={setSize} size="sm">
    <Radio value="small">Small</Radio>
    <Radio value="medium">Medium</Radio>
  </RadioGroup>
  
  <RadioGroup value={size} onChange={setSize} size="md">
    <Radio value="small">Small</Radio>
    <Radio value="medium">Medium</Radio>
  </RadioGroup>
  
  <RadioGroup value={size} onChange={setSize} size="lg">
    <Radio value="small">Small</Radio>
    <Radio value="medium">Medium</Radio>
  </RadioGroup>
</Stack>`}
        >
          <Stack gap={6}>
            <Box>
              <Text className="text-sm text-muted mb-2">Small</Text>
              <RadioGroup value={size} onChange={setSize} size="sm" direction="row">
                <Radio value="small">Small</Radio>
                <Radio value="medium">Medium</Radio>
              </RadioGroup>
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Medium (default)</Text>
              <RadioGroup value={size} onChange={setSize} size="md" direction="row">
                <Radio value="small">Small</Radio>
                <Radio value="medium">Medium</Radio>
              </RadioGroup>
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Large</Text>
              <RadioGroup value={size} onChange={setSize} size="lg" direction="row">
                <Radio value="small">Small</Radio>
                <Radio value="medium">Medium</Radio>
              </RadioGroup>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Horizontal Layout">
        <ComponentPreview
          code={`<RadioGroup direction="row">
  <Radio value="left">Left</Radio>
  <Radio value="center">Center</Radio>
  <Radio value="right">Right</Radio>
</RadioGroup>`}
        >
          <RadioGroup defaultValue="center" direction="row">
            <Radio value="left">Left</Radio>
            <Radio value="center">Center</Radio>
            <Radio value="right">Right</Radio>
          </RadioGroup>
        </ComponentPreview>
      </Section>

      <Section title="Disabled State">
        <ComponentPreview
          code={`<RadioGroup defaultValue="option1" disabled>
  <Radio value="option1">Option 1</Radio>
  <Radio value="option2">Option 2</Radio>
</RadioGroup>

<RadioGroup defaultValue="option1">
  <Radio value="option1">Enabled</Radio>
  <Radio value="option2" disabled>Disabled option</Radio>
</RadioGroup>`}
        >
          <Stack gap={6}>
            <Box>
              <Text className="text-sm text-muted mb-2">All disabled</Text>
              <RadioGroup defaultValue="option1" disabled>
                <Radio value="option1">Option 1</Radio>
                <Radio value="option2">Option 2</Radio>
              </RadioGroup>
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Single disabled</Text>
              <RadioGroup defaultValue="option1">
                <Radio value="option1">Enabled</Radio>
                <Radio value="option2" disabled>Disabled option</Radio>
              </RadioGroup>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Radio Props">
        <PropsTable props={radioProps} />
      </Section>

      <Section title="RadioGroup Props">
        <PropsTable props={radioGroupProps} />
      </Section>
    </Box>
  )
}

export default RadioPage
