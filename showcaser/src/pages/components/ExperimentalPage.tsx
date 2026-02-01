import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'

export default function ExperimentalPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Experimental"
        description="Experimental features and export artifacts for advanced use cases."
      />

      <Section title="Command Bar">
        <ComponentPreview>
          <BUI.CommandBar className="max-w-md">
            <BUI.Text size="sm">Type a command or search...</BUI.Text>
          </BUI.CommandBar>
        </ComponentPreview>
      </Section>

      <Section title="Natural Language Form">
        <ComponentPreview>
          <BUI.NaturalLanguageForm className="max-w-md">
            <BUI.Text size="sm">"Create a new project called My App"</BUI.Text>
          </BUI.NaturalLanguageForm>
        </ComponentPreview>
      </Section>

      <Section title="Voice Input / Output">
        <ComponentPreview>
          <BUI.HStack spacing="md">
            <BUI.VoiceInput />
            <BUI.VoiceOutput />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Screen Recorder">
        <ComponentPreview>
          <BUI.ScreenRecorder />
        </ComponentPreview>
      </Section>

      <Section title="Smart Tooltip">
        <ComponentPreview>
          <BUI.SmartTooltip>
            AI-powered contextual hint
          </BUI.SmartTooltip>
        </ComponentPreview>
      </Section>

      <Section title="Form Autofill">
        <ComponentPreview>
          <BUI.HStack spacing="md" align="center">
            <BUI.Input placeholder="Name..." className="w-40" />
            <BUI.FormAutofill />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Agent Playbook">
        <ComponentPreview>
          <BUI.AgentPlaybook className="max-w-md">
            <BUI.Text weight="semibold" size="sm">Agent Playbook</BUI.Text>
            <BUI.Text size="xs" color="muted">Define multi-step workflows for AI agents.</BUI.Text>
          </BUI.AgentPlaybook>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <PageHeader
        title="Export Artifacts"
        description="Schema and asset helpers for publishing the component library."
      />

      <Section title="Components Schema">
        <ComponentPreview>
          <BUI.ComponentsSchema className="max-w-md">
            <BUI.Text size="xs" className="font-mono">
              {`{
  "Button": { "props": ["variant", "size", "disabled"] },
  "Card": { "props": ["header", "footer"] }
}`}
            </BUI.Text>
          </BUI.ComponentsSchema>
        </ComponentPreview>
      </Section>

      <Section title="Tokens JSON">
        <ComponentPreview>
          <BUI.TokensJson className="max-w-md">
            <BUI.Text size="xs" className="font-mono">
              {`{
  "colors": { "primary": "#3b82f6" },
  "spacing": { "md": "1rem" }
}`}
            </BUI.Text>
          </BUI.TokensJson>
        </ComponentPreview>
      </Section>

      <Section title="Theme Loader">
        <ComponentPreview>
          <BUI.ThemeLoader className="max-w-md">
            <BUI.Text size="sm">Load custom theme JSON</BUI.Text>
          </BUI.ThemeLoader>
        </ComponentPreview>
      </Section>

      <Section title="NPM Package Prep">
        <ComponentPreview>
          <BUI.NpmPackagePrep className="max-w-md">
            <BUI.Text size="sm">Prepare package for NPM publishing</BUI.Text>
          </BUI.NpmPackagePrep>
        </ComponentPreview>
      </Section>
    </BUI.Stack>
  )
}
