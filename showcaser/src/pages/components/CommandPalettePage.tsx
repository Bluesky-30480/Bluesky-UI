import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const commandPaletteProps = [
  { name: 'isOpen', type: 'boolean', default: '-', description: 'Whether the palette is open' },
  { name: 'onClose', type: '() => void', default: '-', description: 'Close handler' },
  { name: 'commands', type: 'CommandItem[]', default: '-', description: 'Command list' },
]

export default function CommandPalettePage() {
  const [isOpen, setIsOpen] = useState(false)

  const commands = [
    { id: 'new', label: 'New Project', description: 'Create a new project', shortcut: 'N', onSelect: () => null },
    { id: 'open', label: 'Open File', description: 'Open an existing file', shortcut: 'O', onSelect: () => null },
    { id: 'settings', label: 'Settings', description: 'Open settings', shortcut: 'S', onSelect: () => null },
  ]

  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="CommandPalette" description="Quick command launcher with search." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Button onClick={() => setIsOpen(true)}>Open Command Palette</BUI.Button>
          <BUI.CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} commands={commands} />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={commandPaletteProps} />
      </Section>
    </BUI.Stack>
  )
}
