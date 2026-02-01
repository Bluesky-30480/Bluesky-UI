import { useRef, useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const focusTrapProps = [
  { name: 'isEnabled', type: 'boolean', defaultValue: 'true', description: 'Enable or disable focus trapping' },
  { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Automatically focus the first focusable element' },
  { name: 'returnFocus', type: 'boolean', defaultValue: 'true', description: 'Restore focus to the previously focused element on unmount' },
  { name: 'initialFocusRef', type: 'RefObject<HTMLElement>', defaultValue: 'undefined', description: 'Element to focus first when trap activates' },
  { name: 'children', type: 'ReactNode', defaultValue: '-', description: 'Content to trap focus within' },
]

export default function FocusTrapPage() {
  const [open, setOpen] = useState(false)
  const initialFocusRef = useRef<HTMLInputElement>(null)

  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="FocusTrap"
        description="Traps keyboard focus within a container, ideal for modals and dialogs."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Stack spacing="md" align="start">
            <BUI.Button onClick={() => setOpen(true)}>Open FocusTrap</BUI.Button>

            {open && (
              <BUI.FocusTrap
                className="w-full max-w-md rounded-lg border border-border bg-surface p-4"
                initialFocusRef={initialFocusRef}
                returnFocus
              >
                <BUI.Stack spacing="md">
                  <BUI.Text weight="semibold">Trapped Panel</BUI.Text>
                  <BUI.Input
                    ref={initialFocusRef}
                    placeholder="First focus goes here"
                    fullWidth
                  />
                  <BUI.Input placeholder="Another field" fullWidth />
                  <BUI.HStack spacing="sm" justify="end">
                    <BUI.Button variant="ghost" onClick={() => setOpen(false)}>
                      Close
                    </BUI.Button>
                    <BUI.Button colorScheme="primary" onClick={() => setOpen(false)}>
                      Confirm
                    </BUI.Button>
                  </BUI.HStack>
                </BUI.Stack>
              </BUI.FocusTrap>
            )}
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={focusTrapProps} />
      </Section>
    </BUI.Stack>
  )
}
