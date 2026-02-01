import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'

export default function DevToolsPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Dev Tools"
        description="Settings, debugging, utilities, and drag-drop primitives for app development."
      />

      <Section title="Settings Panel">
        <ComponentPreview>
          <BUI.SettingsPanel className="max-w-md">
            <BUI.SettingsGroup>
              <BUI.Text weight="semibold" size="sm">General Settings</BUI.Text>
              <BUI.Text size="xs" color="muted">Configure app preferences</BUI.Text>
            </BUI.SettingsGroup>
          </BUI.SettingsPanel>
        </ComponentPreview>
      </Section>

      <Section title="Shortcuts & Keybindings">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.ShortcutEditor className="w-48">Shortcut editor</BUI.ShortcutEditor>
            <BUI.KeybindingViewer className="w-48">
              Ctrl+S → Save<br />
              Ctrl+Z → Undo
            </BUI.KeybindingViewer>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Debug Panel">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.DebugPanel className="w-48 h-24">Debug info</BUI.DebugPanel>
            <BUI.Inspector className="w-48 h-24">Inspector</BUI.Inspector>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Log & JSON Viewers">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.LogViewer className="w-48 h-24">
              [INFO] App started<br />
              [DEBUG] Loaded config
            </BUI.LogViewer>
            <BUI.JSONViewer className="w-48 h-24">
              {`{ "key": "value" }`}
            </BUI.JSONViewer>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Environment & Toggles">
        <ComponentPreview>
          <BUI.HStack spacing="md" align="center">
            <BUI.EnvironmentSelector>
              <option>Development</option>
              <option>Staging</option>
              <option>Production</option>
            </BUI.EnvironmentSelector>
            <BUI.FeatureToggle name="Dark mode" description="Enable dark theme" />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Utilities">
        <ComponentPreview>
          <BUI.HStack spacing="md" align="center">
            <BUI.CopyToClipboard text="Copy this text!" />
            <BUI.SearchBar placeholder="Search..." className="w-48" />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="File & Folder Pickers">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.DevFilePicker />
            <BUI.DevFolderPicker />
            <BUI.FileTree className="w-48">
              <BUI.Text size="xs">src/</BUI.Text>
              <BUI.Text size="xs" className="pl-3">index.ts</BUI.Text>
              <BUI.Text size="xs" className="pl-3">utils/</BUI.Text>
            </BUI.FileTree>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Notifications & Banners">
        <ComponentPreview>
          <BUI.Stack spacing="md" className="max-w-md">
            <BUI.UpdateNotifier>New version available!</BUI.UpdateNotifier>
            <BUI.RestartRequiredBanner>Restart required to apply changes.</BUI.RestartRequiredBanner>
            <BUI.PermissionPrompt>Grant camera access?</BUI.PermissionPrompt>
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <Section title="Badge Counter">
        <ComponentPreview>
          <BUI.HStack spacing="md" align="center">
            <BUI.BadgeCounter>3</BUI.BadgeCounter>
            <BUI.BadgeCounter>12</BUI.BadgeCounter>
            <BUI.BadgeCounter>99+</BUI.BadgeCounter>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Drag & Drop">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.Draggable className="w-32">Draggable item</BUI.Draggable>
            <BUI.DragPreview className="w-32">Drag preview</BUI.DragPreview>
            <BUI.DevDropZone className="w-32 h-20">Drop zone</BUI.DevDropZone>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Sortable & Snap">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.Sortable className="w-40">
              <BUI.Card><BUI.CardContent className="p-2">Item 1</BUI.CardContent></BUI.Card>
              <BUI.Card><BUI.CardContent className="p-2">Item 2</BUI.CardContent></BUI.Card>
            </BUI.Sortable>
            <BUI.SnapArea className="w-40 h-20">Snap area</BUI.SnapArea>
            <BUI.GestureLayer className="w-40 h-20">Gesture layer</BUI.GestureLayer>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Drag Handle">
        <ComponentPreview>
          <BUI.HStack spacing="md" align="center">
            <BUI.DragHandle />
            <BUI.Text size="sm">Grab to reorder</BUI.Text>
          </BUI.HStack>
        </ComponentPreview>
      </Section>
    </BUI.Stack>
  )
}
