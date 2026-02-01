import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const toggleButtonProps = [
  { name: 'pressed', type: 'boolean', default: '-', description: 'Controlled pressed state' },
  { name: 'defaultPressed', type: 'boolean', default: 'false', description: 'Default pressed state (uncontrolled)' },
  { name: 'onPressedChange', type: '(pressed: boolean) => void', default: '-', description: 'Called when pressed state changes' },
]

export default function ToggleButtonPage() {
  const [isBold, setIsBold] = useState(false)

  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="ToggleButton"
        description="A button that maintains a pressed state for toggling options."
      />

      <Section title="Uncontrolled">
        <ComponentPreview>
          <BUI.ToggleButton variant="outline">Notifications</BUI.ToggleButton>
        </ComponentPreview>
      </Section>

      <Section title="Controlled">
        <ComponentPreview>
          <BUI.ToggleButton
            variant={isBold ? 'solid' : 'outline'}
            pressed={isBold}
            onPressedChange={setIsBold}
          >
            Bold Text
          </BUI.ToggleButton>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={toggleButtonProps} />
      </Section>
    </BUI.Stack>
  )
}
