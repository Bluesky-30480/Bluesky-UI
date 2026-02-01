import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const popoverProps = [
  { name: 'isOpen', type: 'boolean', default: '-', description: 'Controlled open state' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled open state' },
  { name: 'onOpenChange', type: '(open: boolean) => void', default: '-', description: 'Open state change handler' },
  { name: 'placement', type: 'PopoverPlacement', default: "'bottom'", description: 'Popover position relative to trigger' },
  { name: 'offset', type: 'number', default: '8', description: 'Offset in pixels from trigger' },
]

export default function PopoverPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Popover"
        description="A floating content panel anchored to a trigger element."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Popover>
            <BUI.PopoverTrigger>
              <BUI.Button variant="outline">Open Popover</BUI.Button>
            </BUI.PopoverTrigger>
            <BUI.PopoverContent className="p-4 w-64">
              <BUI.VStack spacing="sm" align="start">
                <BUI.Text weight="semibold">Popover title</BUI.Text>
                <BUI.Text size="sm" color="muted">
                  This is a simple popover with custom content.
                </BUI.Text>
                <BUI.Button size="sm" variant="soft">Action</BUI.Button>
              </BUI.VStack>
            </BUI.PopoverContent>
          </BUI.Popover>
        </ComponentPreview>
      </Section>

      <Section title="Controlled">
        <ComponentPreview>
          <BUI.HStack spacing="md">
            <BUI.Button
              variant={isOpen ? 'solid' : 'outline'}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? 'Close' : 'Open'}
            </BUI.Button>
            <BUI.Popover isOpen={isOpen} onOpenChange={setIsOpen}>
              <BUI.PopoverTrigger>
                <BUI.Button variant="outline">Anchor</BUI.Button>
              </BUI.PopoverTrigger>
              <BUI.PopoverContent className="p-4 w-56">
                <BUI.Text size="sm">Controlled popover content</BUI.Text>
              </BUI.PopoverContent>
            </BUI.Popover>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={popoverProps} />
      </Section>
    </BUI.Stack>
  )
}
