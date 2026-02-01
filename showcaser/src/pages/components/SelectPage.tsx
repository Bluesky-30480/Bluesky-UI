import { useState } from 'react'
import { Select, Stack, Box } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const selectProps = [
  { name: 'options', type: 'SelectOption[]', required: true, description: 'Array of options to display' },
  { name: 'value', type: 'string', description: 'Controlled value' },
  { name: 'defaultValue', type: 'string', description: 'Default value (uncontrolled)' },
  { name: 'onChange', type: '(value: string) => void', description: 'Change handler' },
  { name: 'placeholder', type: 'string', default: "'Select...'", description: 'Placeholder text' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant' },
  { name: 'variant', type: "'default' | 'filled' | 'ghost'", default: "'default'", description: 'Style variant' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the select' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show clear button' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Full width mode' },
]

const optionType = [
  { name: 'value', type: 'string', required: true, description: 'Option value' },
  { name: 'label', type: 'string', required: true, description: 'Display label' },
  { name: 'disabled', type: 'boolean', description: 'Disable this option' },
]

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'orange', label: 'Orange' },
  { value: 'mango', label: 'Mango' },
]

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia', disabled: true },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
]

export function SelectPage() {
  const [fruit, setFruit] = useState('')
  const [country, setCountry] = useState('us')

  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Select"
        description="A custom dropdown select component with keyboard navigation and multiple style variants."
      />

      <Section title="Basic Usage">
        <ComponentPreview
          code={`const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

<Select 
  options={options} 
  value={fruit} 
  onChange={setFruit}
  placeholder="Select a fruit"
/>`}
        >
          <Select
            options={fruitOptions}
            value={fruit}
            onChange={setFruit}
            placeholder="Select a fruit"
          />
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview
          code={`<Stack gap={3}>
  <Select options={options} size="sm" placeholder="Small" />
  <Select options={options} size="md" placeholder="Medium" />
  <Select options={options} size="lg" placeholder="Large" />
</Stack>`}
        >
          <Stack gap={3}>
            <Select options={fruitOptions} size="sm" placeholder="Small" />
            <Select options={fruitOptions} size="md" placeholder="Medium (default)" />
            <Select options={fruitOptions} size="lg" placeholder="Large" />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview
          code={`<Stack gap={3}>
  <Select options={options} variant="default" placeholder="Default" />
  <Select options={options} variant="filled" placeholder="Filled" />
  <Select options={options} variant="ghost" placeholder="Ghost" />
</Stack>`}
        >
          <Stack gap={3}>
            <Select options={fruitOptions} variant="default" placeholder="Default (default)" />
            <Select options={fruitOptions} variant="filled" placeholder="Filled" />
            <Select options={fruitOptions} variant="ghost" placeholder="Ghost" />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Clearable">
        <ComponentPreview
          code={`<Select 
  options={options} 
  value={value}
  onChange={setValue}
  clearable 
  placeholder="Select (clearable)"
/>`}
        >
          <Select
            options={countryOptions}
            value={country}
            onChange={setCountry}
            clearable
            placeholder="Select country"
          />
        </ComponentPreview>
      </Section>

      <Section title="Disabled Options">
        <ComponentPreview
          code={`const options = [
  { value: 'us', label: 'United States' },
  { value: 'au', label: 'Australia', disabled: true },
]

<Select options={options} placeholder="Some options disabled" />`}
        >
          <Select
            options={countryOptions}
            placeholder="Some options disabled"
          />
        </ComponentPreview>
      </Section>

      <Section title="Error State">
        <ComponentPreview
          code={`<Select options={options} error placeholder="Error state" />`}
        >
          <Select
            options={fruitOptions}
            error
            placeholder="Error state"
          />
        </ComponentPreview>
      </Section>

      <Section title="Disabled">
        <ComponentPreview
          code={`<Select options={options} disabled placeholder="Disabled" />`}
        >
          <Select
            options={fruitOptions}
            disabled
            placeholder="Disabled"
          />
        </ComponentPreview>
      </Section>

      <Section title="Full Width">
        <ComponentPreview
          code={`<Select options={options} fullWidth placeholder="Full width" />`}
        >
          <Select
            options={fruitOptions}
            fullWidth
            placeholder="Full width"
          />
        </ComponentPreview>
      </Section>

      <Section title="Select Props">
        <PropsTable props={selectProps} />
      </Section>

      <Section title="SelectOption Type">
        <PropsTable props={optionType} />
      </Section>
    </Box>
  )
}

export default SelectPage
