import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'

export default function MediaHelperPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Media Helper"
        description="Media ingestion, editing, transcoding, and export primitives."
      />

      <Section title="Ingestion">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.MediaUploader className="w-48 h-24">Upload media</BUI.MediaUploader>
            <BUI.MediaDropZone className="w-48 h-24">Drop files here</BUI.MediaDropZone>
            <BUI.MediaFolderPicker />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Preview">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.MediaPreview className="w-40 h-28">Preview</BUI.MediaPreview>
            <BUI.ImageViewer className="w-40 h-28">Image</BUI.ImageViewer>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Video & Audio Players">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.MediaVideoPlayer className="w-64" />
            <BUI.MediaAudioPlayer className="w-48">Audio Player</BUI.MediaAudioPlayer>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Editing">
        <ComponentPreview>
          <BUI.Stack spacing="md" className="max-w-2xl">
            <BUI.TimelineEditor className="w-full">Timeline editor</BUI.TimelineEditor>
            <BUI.HStack spacing="lg">
              <BUI.ClipEditor className="w-48">Clip editor</BUI.ClipEditor>
              <BUI.SubtitleEditor className="w-48">Subtitle editor</BUI.SubtitleEditor>
            </BUI.HStack>
            <BUI.WaveformEditor className="w-full">Waveform editor</BUI.WaveformEditor>
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <Section title="Metadata">
        <ComponentPreview>
          <BUI.MetadataEditor className="max-w-md">
            <BUI.Text size="sm">Title: My Video</BUI.Text>
            <BUI.Text size="sm">Duration: 2:34</BUI.Text>
            <BUI.Text size="sm">Format: MP4</BUI.Text>
          </BUI.MetadataEditor>
        </ComponentPreview>
      </Section>

      <Section title="Export">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.ExportPanel className="w-48">Export settings</BUI.ExportPanel>
            <BUI.BatchExport className="w-48">Batch export</BUI.BatchExport>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Transcode">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="center">
            <BUI.FormatSelector>
              <option>MP4</option>
              <option>WebM</option>
              <option>MKV</option>
            </BUI.FormatSelector>
            <BUI.TranscodePresets className="w-48">Presets</BUI.TranscodePresets>
            <BUI.FFmpegRunner className="w-48">FFmpeg runner</BUI.FFmpegRunner>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Transcription & Subtitles">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.TranscriptionPanel className="w-48 h-24">Transcription</BUI.TranscriptionPanel>
            <BUI.SubtitleSync className="w-48 h-24">Subtitle sync</BUI.SubtitleSync>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Transcode Queue">
        <ComponentPreview>
          <BUI.TranscodeQueue className="max-w-md">
            <BUI.Card>
              <BUI.CardContent className="p-3">
                <BUI.Text size="sm">video1.mp4 → MP4 (50%)</BUI.Text>
              </BUI.CardContent>
            </BUI.Card>
            <BUI.Card>
              <BUI.CardContent className="p-3">
                <BUI.Text size="sm">audio2.wav → MP3 (pending)</BUI.Text>
              </BUI.CardContent>
            </BUI.Card>
          </BUI.TranscodeQueue>
        </ComponentPreview>
      </Section>
    </BUI.Stack>
  )
}
