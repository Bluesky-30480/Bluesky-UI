import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const previewProps = [
  { name: 'name', type: 'string', default: '-', description: 'File name' },
  { name: 'size', type: 'string', default: '-', description: 'File size label' },
  { name: 'status', type: "'ready' | 'uploading' | 'error'", default: "'ready'", description: 'Status label' },
]

export default function FilePreviewPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="FilePreview" description="File card with status indicator." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Stack spacing="sm">
            <BUI.FilePreview name="design-specs.pdf" size="2.4 MB" status="ready" />
            <BUI.FilePreview name="assets.zip" size="120 MB" status="uploading" />
            <BUI.FilePreview name="broken.mov" size="1.2 GB" status="error" />
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={previewProps} />
      </Section>
    </BUI.Stack>
  )
}
