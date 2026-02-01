import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const uploadProps = [
  { name: 'label', type: 'string', default: "'Upload file'", description: 'Label text' },
  { name: 'hint', type: 'string', default: '-', description: 'Helper text' },
]

export default function FileUploadPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="FileUpload" description="Simple file upload dropzone style." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.FileUpload label="Upload assets" hint="PDF, PNG, or MP4" />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={uploadProps} />
      </Section>
    </BUI.Stack>
  )
}
