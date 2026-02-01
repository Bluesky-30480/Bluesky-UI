import { useState } from 'react'
import { HoldToProceedButton, Stack, Box, Text, Button } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const props = [
  { name: 'holdDuration', type: 'number', default: '1200', description: 'Time to hold before completion (ms)' },
  { name: 'onComplete', type: '() => void', required: true, description: 'Called when hold completes' },
  { name: 'onCancel', type: '() => void', description: 'Called when hold is cancelled' },
  { name: 'resetOnComplete', type: 'boolean', default: 'true', description: 'Reset progress after completion' },
  { name: 'showProgress', type: 'boolean', default: 'true', description: 'Show progress percentage' },
  { name: 'variant', type: "'solid' | 'outline' | 'ghost' | 'soft' | 'link'", description: 'Button variant' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: 'Button size' },
  { name: 'colorScheme', type: "'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'", description: 'Color scheme' },
]

export function HoldToProceedButtonPage() {
  const [status, setStatus] = useState('Hold to confirm')

  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Hold To Proceed"
        description="Hold-to-proceed buttons reduce accidental actions by requiring a press-and-hold gesture."
      />

      <Section title="Basic Usage">
        <ComponentPreview
          code={`<HoldToProceedButton onComplete={() => alert('Confirmed')}>
  Hold to confirm
</HoldToProceedButton>`}
        >
          <HoldToProceedButton onComplete={() => setStatus('Confirmed')}>
            Hold to confirm
          </HoldToProceedButton>
          <Text className="text-sm text-muted mt-3">Status: {status}</Text>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview
          code={`<Stack direction="row" gap={3} wrap>
  <HoldToProceedButton variant="solid" colorScheme="primary" onComplete={...}>
    Solid
  </HoldToProceedButton>
  <HoldToProceedButton variant="outline" colorScheme="primary" onComplete={...}>
    Outline
  </HoldToProceedButton>
  <HoldToProceedButton variant="soft" colorScheme="primary" onComplete={...}>
    Soft
  </HoldToProceedButton>
</Stack>`}
        >
          <Stack direction="row" gap={3} wrap>
            <HoldToProceedButton variant="solid" colorScheme="primary" onComplete={() => setStatus('Solid confirmed')}>
              Solid
            </HoldToProceedButton>
            <HoldToProceedButton variant="outline" colorScheme="primary" onComplete={() => setStatus('Outline confirmed')}>
              Outline
            </HoldToProceedButton>
            <HoldToProceedButton variant="soft" colorScheme="primary" onComplete={() => setStatus('Soft confirmed')}>
              Soft
            </HoldToProceedButton>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Longer Hold">
        <ComponentPreview
          code={`<HoldToProceedButton holdDuration={2000} onComplete={...}>
  Hold 2 seconds
</HoldToProceedButton>`}
        >
          <HoldToProceedButton holdDuration={2000} onComplete={() => setStatus('Long hold confirmed')}>
            Hold 2 seconds
          </HoldToProceedButton>
        </ComponentPreview>
      </Section>

      <Section title="Custom Controls">
        <ComponentPreview
          code={`<HoldToProceedButton showProgress={false} onComplete={...}>
  Hold to proceed
</HoldToProceedButton>
<Button variant="outline" onClick={() => reset()}>Reset</Button>`}
        >
          <Stack gap={3}>
            <HoldToProceedButton showProgress={false} onComplete={() => setStatus('No progress confirmed')}>
              Hold to proceed
            </HoldToProceedButton>
            <Button variant="outline" colorScheme="neutral" onClick={() => setStatus('Hold to confirm')}>
              Reset status
            </Button>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Props">
        <PropsTable props={props} />
      </Section>
    </Box>
  )
}

export default HoldToProceedButtonPage