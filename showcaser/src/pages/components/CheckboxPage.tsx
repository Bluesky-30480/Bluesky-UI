import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const checkboxProps = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Checkbox size' },
  { name: 'label', type: 'ReactNode', default: '-', description: 'Label text' },
  { name: 'description', type: 'ReactNode', default: '-', description: 'Description text below label' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Show indeterminate state' },
  { name: 'checked', type: 'boolean', default: '-', description: 'Controlled checked state' },
  { name: 'defaultChecked', type: 'boolean', default: '-', description: 'Default checked state (uncontrolled)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the checkbox' },
]

// Controlled checkbox wrapper for demos
function DemoCheckbox({ 
  initialChecked = false, 
  ...props 
}: { initialChecked?: boolean } & Omit<React.ComponentProps<typeof BUI.Checkbox>, 'checked' | 'onChange'>) {
  const [checked, setChecked] = useState(initialChecked)
  return (
    <BUI.Checkbox
      {...props}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  )
}

export default function CheckboxPage() {
  // Basic usage state
  const [termsChecked, setTermsChecked] = useState(false)
  
  // Description example state
  const [marketingChecked, setMarketingChecked] = useState(false)
  const [securityChecked, setSecurityChecked] = useState(true)
  
  // Indeterminate example state
  const [items, setItems] = useState([false, true, false])
  const allChecked = items.every(Boolean)
  const someChecked = items.some(Boolean) && !allChecked

  const handleItemChange = (index: number, checked: boolean) => {
    const newItems = [...items]
    newItems[index] = checked
    setItems(newItems)
  }

  const handleSelectAll = (checked: boolean) => {
    setItems([checked, checked, checked])
  }

  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Checkbox"
        description="A customizable checkbox component with support for labels, descriptions, and indeterminate states."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Checkbox 
            label="Accept terms and conditions" 
            checked={termsChecked}
            onChange={(e) => setTermsChecked(e.target.checked)}
          />
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <BUI.HStack spacing="xl" align="start">
            <DemoCheckbox size="sm" label="Small" initialChecked />
            <DemoCheckbox size="md" label="Medium" initialChecked />
            <DemoCheckbox size="lg" label="Large" initialChecked />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="With Description">
        <ComponentPreview>
          <BUI.VStack spacing="lg" align="start">
            <BUI.Checkbox 
              label="Marketing emails"
              description="Receive emails about new products and features"
              checked={marketingChecked}
              onChange={(e) => setMarketingChecked(e.target.checked)}
            />
            <BUI.Checkbox 
              label="Security alerts"
              description="Get notified about security updates"
              checked={securityChecked}
              onChange={(e) => setSecurityChecked(e.target.checked)}
            />
          </BUI.VStack>
        </ComponentPreview>
      </Section>

      <Section title="Indeterminate State">
        <ComponentPreview>
          <BUI.VStack spacing="md" align="start">
            <BUI.Checkbox 
              label="Select all"
              checked={allChecked}
              indeterminate={someChecked}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <BUI.Box className="pl-6">
              <BUI.VStack spacing="sm" align="start">
                <BUI.Checkbox 
                  label="Option 1" 
                  checked={items[0]}
                  onChange={(e) => handleItemChange(0, e.target.checked)}
                />
                <BUI.Checkbox 
                  label="Option 2" 
                  checked={items[1]}
                  onChange={(e) => handleItemChange(1, e.target.checked)}
                />
                <BUI.Checkbox 
                  label="Option 3" 
                  checked={items[2]}
                  onChange={(e) => handleItemChange(2, e.target.checked)}
                />
              </BUI.VStack>
            </BUI.Box>
          </BUI.VStack>
        </ComponentPreview>
      </Section>

      <Section title="States">
        <ComponentPreview>
          <BUI.HStack spacing="xl" align="start">
            <DemoCheckbox label="Unchecked" />
            <DemoCheckbox label="Checked" initialChecked />
            <DemoCheckbox label="Disabled" disabled />
            <DemoCheckbox label="Disabled Checked" disabled initialChecked />
            <DemoCheckbox label="Error" error />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={checkboxProps} />
      </Section>
    </BUI.Stack>
  )
}
