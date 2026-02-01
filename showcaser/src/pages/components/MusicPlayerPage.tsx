import BUI, { MusicPlayerProvider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'

export default function MusicPlayerPage() {
  return (
    <MusicPlayerProvider>
      <BUI.Stack spacing="xl">
        <PageHeader
          title="Music Player"
          description="Full-featured music player primitives for streaming and playback."
        />

        <Section title="Player Controls">
          <ComponentPreview>
            <BUI.PlayerContainer>
              <BUI.HStack spacing="md" align="center" justify="center">
                <BUI.PreviousButton />
                <BUI.PlayButton />
                <BUI.PauseButton />
                <BUI.NextButton />
              </BUI.HStack>
            </BUI.PlayerContainer>
          </ComponentPreview>
        </Section>

        <Section title="Shuffle / Repeat / Volume">
          <ComponentPreview>
            <BUI.HStack spacing="md" align="center">
              <BUI.ShuffleToggle />
              <BUI.RepeatToggle />
              <BUI.MuteButton />
              <BUI.VolumeSlider defaultValue={50} />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Track Progress">
          <ComponentPreview>
            <BUI.Stack spacing="md" className="w-full">
              <BUI.TrackProgress />
              <BUI.Waveform />
            </BUI.Stack>
          </ComponentPreview>
        </Section>

        <Section title="Visualization">
          <ComponentPreview>
            <BUI.HStack spacing="lg">
              <BUI.SpectrumVisualizer className="w-40 h-20" />
              <BUI.Equalizer className="w-40" />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Track Info & Album Art">
          <ComponentPreview>
            <BUI.HStack spacing="lg" align="center">
              <BUI.AlbumArt size="lg" />
              <BUI.TrackInfo />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Playlist & Queue">
          <ComponentPreview>
            <BUI.HStack spacing="lg" align="start">
              <BUI.Playlist 
                className="w-48" 
                tracks={[
                  { id: '1', title: 'Song 1', artist: 'Artist A', duration: 180, src: '/audio/song1.mp3' },
                  { id: '2', title: 'Song 2', artist: 'Artist B', duration: 210, src: '/audio/song2.mp3' },
                  { id: '3', title: 'Song 3', artist: 'Artist C', duration: 195, src: '/audio/song3.mp3' },
                ]}
              />
              <BUI.QueueView className="w-48" />
            </BUI.HStack>
          </ComponentPreview>
        </Section>

        <Section title="Extras">
          <ComponentPreview>
            <BUI.HStack spacing="lg" align="center">
              <BUI.PlaybackSpeedControl />
              <BUI.LyricsViewer className="max-w-xs" />
            </BUI.HStack>
          </ComponentPreview>
        </Section>
      </BUI.Stack>
    </MusicPlayerProvider>
  )
}
