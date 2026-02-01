import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const galleryProps = [
  { name: 'images', type: '{ src: string; alt?: string }[]', default: '-', description: 'Images to render' },
  { name: 'columns', type: 'number', default: '3', description: 'Column count' },
]

const images = Array.from({ length: 6 }).map((_, i) => ({
  src: `https://picsum.photos/seed/gallery-${i}/400/400`,
  alt: `Gallery ${i + 1}`,
}))

export default function ImageGalleryPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="ImageGallery" description="Responsive image grid with configurable columns." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.ImageGallery images={images} columns={3} />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={galleryProps} />
      </Section>
    </BUI.Stack>
  )
}
