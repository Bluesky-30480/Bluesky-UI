import BUI, { ReadingProvider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'

export default function ReadingModulePage() {
  return (
    <ReadingProvider>
      <BUI.Stack spacing="xl">
        <PageHeader
          title="Reading Module"
          description="eBook, PDF, and text reader primitives for immersive reading experiences."
        />

        <Section title="Viewers">
          <ComponentPreview>
            <BUI.HStack spacing="lg" align="start">
              <BUI.EPUBViewer className="w-48 h-32" />
              <BUI.PDFViewer className="w-48 h-32" />
              <BUI.TextViewer className="w-48 h-32" />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Chapter Navigation">
          <ComponentPreview>
            <BUI.HStack spacing="lg" align="start">
              <BUI.ChapterList className="w-48" />
              <BUI.PageNavigator />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Typography Controls">
          <ComponentPreview>
            <BUI.HStack spacing="md" align="center">
              <BUI.FontSizeControl />
              <BUI.LineHeightControl />
              <BUI.MarginControl />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Mode Toggles">
          <ComponentPreview>
            <BUI.HStack spacing="md" align="center">
              <BUI.ReadingMode />
              <BUI.NightModeToggle />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Bookmarks & Highlights">
          <ComponentPreview>
            <BUI.HStack spacing="lg" align="start">
              <BUI.Stack spacing="sm">
                <BUI.BookmarkButton />
                <BUI.BookmarkList className="w-40" />
              </BUI.Stack>
              <BUI.HighlightLayer className="w-48" />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Annotations">
          <ComponentPreview>
            <BUI.HStack spacing="lg" align="start">
              <BUI.AnnotationManager className="w-48 h-32" />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Search & Tools">
          <ComponentPreview>
            <BUI.Stack spacing="md" className="max-w-md">
              <BUI.SearchInBook />
              <BUI.DictionaryLookup />
              <BUI.HStack spacing="md">
                <BUI.TTSController />
              </BUI.HStack>
            </BUI.Stack>
          </ComponentPreview>
        </Section>

        <Section title="Progress">
          <ComponentPreview>
            <BUI.HStack spacing="lg" align="center">
              <BUI.ReadingProgress />
              <BUI.SeekBar className="w-48" />
            </BUI.HStack>
          </ComponentPreview>
        </Section>
      </BUI.Stack>
    </ReadingProvider>
  )
}
