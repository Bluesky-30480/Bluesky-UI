import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const contextMenuProps = [
  { name: 'onOpenChange', type: '(open: boolean) => void', default: '-', description: 'Called when menu opens or closes' },
  { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close the menu when an item is selected' },
]

export default function ContextMenuPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="ContextMenu"
        description="A right-click menu for quick actions."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.ContextMenu>
            <BUI.ContextMenuTrigger>
              <BUI.Box
                padding="md"
                background="surface"
                rounded="md"
                border
                className="min-h-[120px] flex items-center justify-center"
              >
                <BUI.Text size="sm" color="muted">
                  Right-click here
                </BUI.Text>
              </BUI.Box>
            </BUI.ContextMenuTrigger>
            <BUI.ContextMenuContent>
              <BUI.ContextMenuItem>New File</BUI.ContextMenuItem>
              <BUI.ContextMenuItem>Duplicate</BUI.ContextMenuItem>
              <BUI.ContextMenuSeparator />
              <BUI.ContextMenuItem inset>Rename</BUI.ContextMenuItem>
              <BUI.ContextMenuItem inset>Delete</BUI.ContextMenuItem>
            </BUI.ContextMenuContent>
          </BUI.ContextMenu>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={contextMenuProps} />
      </Section>
    </BUI.Stack>
  )
}
