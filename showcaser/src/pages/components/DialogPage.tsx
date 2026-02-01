import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const dialogProps = [
  { name: 'isOpen', type: 'boolean', default: '-', description: 'Whether the dialog is open' },
  { name: 'onClose', type: '() => void', default: '-', description: 'Called when dialog should close' },
  { name: 'title', type: 'ReactNode', default: '-', description: 'Dialog title' },
  { name: 'description', type: 'ReactNode', default: '-', description: 'Dialog description' },
  { name: 'confirmLabel', type: 'string', default: "'Confirm'", description: 'Confirm button label' },
  { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Cancel button label' },
]

export default function DialogPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Dialog"
        description="A confirmation dialog built on the Modal component."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Button onClick={() => setIsOpen(true)}>Open Dialog</BUI.Button>
          <BUI.Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Confirm deletion"
            description="This action cannot be undone. Are you sure you want to proceed?"
            confirmLabel="Delete"
            confirmColorScheme="error"
            confirmVariant="solid"
          />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={dialogProps} />
      </Section>
    </BUI.Stack>
  )
}
