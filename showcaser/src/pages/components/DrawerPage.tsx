import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const drawerProps = [
  { name: 'isOpen', type: 'boolean', default: '-', description: 'Whether the drawer is open' },
  { name: 'onClose', type: '() => void', default: '-', description: 'Close handler' },
  { name: 'title', type: 'ReactNode', default: '-', description: 'Drawer title' },
  { name: 'placement', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: 'Drawer placement' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Drawer size' },
]

export default function DrawerPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLeftOpen, setIsLeftOpen] = useState(false)

  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Drawer"
        description="A sliding panel from any edge for secondary tasks and details."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Button onClick={() => setIsOpen(true)}>Open Drawer</BUI.Button>
          <BUI.Drawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Notifications"
            footer={
              <>
                <BUI.Button variant="ghost" onClick={() => setIsOpen(false)}>
                  Close
                </BUI.Button>
                <BUI.Button onClick={() => setIsOpen(false)}>Mark all read</BUI.Button>
              </>
            }
          >
            <BUI.VStack spacing="sm" align="start">
              <BUI.Text size="sm" color="muted">
                You have 3 new notifications.
              </BUI.Text>
              <BUI.Badge variant="soft">System</BUI.Badge>
            </BUI.VStack>
          </BUI.Drawer>
        </ComponentPreview>
      </Section>

      <Section title="Placement">
        <ComponentPreview>
          <BUI.HStack spacing="md">
            <BUI.Button variant="outline" onClick={() => setIsLeftOpen(true)}>
              Open Left
            </BUI.Button>
            <BUI.Drawer
              isOpen={isLeftOpen}
              onClose={() => setIsLeftOpen(false)}
              placement="left"
              title="Filters"
            >
              <BUI.Text size="sm" color="muted">
                Adjust filters and settings here.
              </BUI.Text>
            </BUI.Drawer>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={drawerProps} />
      </Section>
    </BUI.Stack>
  )
}
