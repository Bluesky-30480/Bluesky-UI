import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const buttonGroupProps = [
  { name: 'spacing', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'sm'", description: 'Space between buttons when not attached' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction for the group' },
  { name: 'isAttached', type: 'boolean', default: 'false', description: 'Attach buttons with shared borders' },
]

export default function ButtonGroupPage() {
  const [pressed, setPressed] = useState('left')

  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="ButtonGroup"
        description="Group buttons together with consistent spacing and optional attached styling."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.ButtonGroup>
            <BUI.Button variant="outline">First</BUI.Button>
            <BUI.Button variant="outline">Second</BUI.Button>
            <BUI.Button variant="outline">Third</BUI.Button>
          </BUI.ButtonGroup>
        </ComponentPreview>
      </Section>

      <Section title="Attached">
        <ComponentPreview>
          <BUI.ButtonGroup isAttached>
            <BUI.Button variant="outline">Left</BUI.Button>
            <BUI.Button variant="outline">Middle</BUI.Button>
            <BUI.Button variant="outline">Right</BUI.Button>
          </BUI.ButtonGroup>
        </ComponentPreview>
      </Section>

      <Section title="Vertical Group">
        <ComponentPreview>
          <BUI.ButtonGroup orientation="vertical" spacing="xs">
            <BUI.Button variant="soft">Option A</BUI.Button>
            <BUI.Button variant="soft">Option B</BUI.Button>
            <BUI.Button variant="soft">Option C</BUI.Button>
          </BUI.ButtonGroup>
        </ComponentPreview>
      </Section>

      <Section title="With Toggle Buttons">
        <ComponentPreview>
          <BUI.ButtonGroup isAttached>
            <BUI.ToggleButton
              variant={pressed === 'left' ? 'solid' : 'outline'}
              onPressedChange={() => setPressed('left')}
              pressed={pressed === 'left'}
            >
              Left
            </BUI.ToggleButton>
            <BUI.ToggleButton
              variant={pressed === 'center' ? 'solid' : 'outline'}
              onPressedChange={() => setPressed('center')}
              pressed={pressed === 'center'}
            >
              Center
            </BUI.ToggleButton>
            <BUI.ToggleButton
              variant={pressed === 'right' ? 'solid' : 'outline'}
              onPressedChange={() => setPressed('right')}
              pressed={pressed === 'right'}
            >
              Right
            </BUI.ToggleButton>
          </BUI.ButtonGroup>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={buttonGroupProps} />
      </Section>
    </BUI.Stack>
  )
}
