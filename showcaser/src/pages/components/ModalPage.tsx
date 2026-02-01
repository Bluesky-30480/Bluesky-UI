import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const modalProps = [
  { name: 'isOpen', type: 'boolean', default: '-', description: 'Whether the modal is open' },
  { name: 'onClose', type: '() => void', default: '-', description: 'Close handler' },
  { name: 'title', type: 'ReactNode', default: '-', description: 'Modal title' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Modal size' },
  { name: 'footer', type: 'ReactNode', default: '-', description: 'Footer actions' },
]

export default function ModalPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLargeOpen, setIsLargeOpen] = useState(false)

  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Modal"
        description="A centered overlay dialog for focused tasks and confirmations."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Button onClick={() => setIsOpen(true)}>Open Modal</BUI.Button>
          <BUI.Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Invite collaborators"
            footer={
              <>
                <BUI.Button variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </BUI.Button>
                <BUI.Button onClick={() => setIsOpen(false)}>Send Invite</BUI.Button>
              </>
            }
          >
            <BUI.VStack spacing="md" align="start">
              <BUI.Text size="sm" color="muted">
                Invite teammates to collaborate on this project.
              </BUI.Text>
              <BUI.Input placeholder="Enter email" />
            </BUI.VStack>
          </BUI.Modal>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <BUI.HStack spacing="md">
            <BUI.Button variant="outline" onClick={() => setIsLargeOpen(true)}>
              Open Large
            </BUI.Button>
            <BUI.Modal
              isOpen={isLargeOpen}
              onClose={() => setIsLargeOpen(false)}
              title="Large modal"
              size="lg"
            >
              <BUI.Text size="sm" color="muted">
                Use larger sizes for complex layouts or longer content.
              </BUI.Text>
            </BUI.Modal>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={modalProps} />
      </Section>
    </BUI.Stack>
  )
}
