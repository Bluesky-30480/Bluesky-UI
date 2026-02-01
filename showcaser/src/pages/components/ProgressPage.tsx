import { useState, useEffect } from 'react'
import { Progress, Stack, Text, Box, Button } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const progressProps = [
  { name: 'value', type: 'number', default: '0', description: 'Current progress value (0-100)' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant' },
  { name: 'variant', type: "'default' | 'gradient' | 'striped'", default: "'default'", description: 'Visual style variant' },
  { name: 'colorScheme', type: "'primary' | 'success' | 'warning' | 'error'", default: "'primary'", description: 'Color scheme' },
  { name: 'showLabel', type: 'boolean', default: 'false', description: 'Show percentage label' },
  { name: 'labelPosition', type: "'inside' | 'outside' | 'top'", default: "'outside'", description: 'Label position' },
  { name: 'isIndeterminate', type: 'boolean', default: 'false', description: 'Indeterminate loading state' },
]

export function ProgressPage() {
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsRunning(false)
          return 0
        }
        return prev + 10
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isRunning])

  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Progress"
        description="A progress bar component to indicate the completion status of a task or operation."
      />

      <Section title="Basic Usage">
        <ComponentPreview code={`<Progress value={60} />`}>
          <Progress value={60} />
        </ComponentPreview>
      </Section>

      <Section title="Animated Example">
        <ComponentPreview
          code={`const [progress, setProgress] = useState(0)

<Progress value={progress} showLabel />
<Button onClick={() => setIsRunning(true)}>Start</Button>`}
        >
          <Stack gap={4}>
            <Progress value={progress} showLabel />
            <Box>
              <Button 
                size="sm" 
                onClick={() => {
                  setProgress(0)
                  setIsRunning(true)
                }}
                disabled={isRunning}
              >
                {isRunning ? 'Running...' : 'Start Animation'}
              </Button>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview
          code={`<Stack gap={4}>
  <Progress size="xs" value={60} />
  <Progress size="sm" value={60} />
  <Progress size="md" value={60} />
  <Progress size="lg" value={60} />
</Stack>`}
        >
          <Stack gap={4}>
            <Box>
              <Text className="text-sm text-muted mb-2">Extra Small (xs)</Text>
              <Progress size="xs" value={60} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Small (sm)</Text>
              <Progress size="sm" value={60} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Medium (md) - default</Text>
              <Progress size="md" value={60} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Large (lg)</Text>
              <Progress size="lg" value={60} />
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Color Schemes">
        <ComponentPreview
          code={`<Stack gap={3}>
  <Progress colorScheme="primary" value={70} />
  <Progress colorScheme="success" value={70} />
  <Progress colorScheme="warning" value={70} />
  <Progress colorScheme="error" value={70} />
</Stack>`}
        >
          <Stack gap={4}>
            <Box>
              <Text className="text-sm text-muted mb-2">Primary</Text>
              <Progress colorScheme="primary" value={70} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Success</Text>
              <Progress colorScheme="success" value={70} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Warning</Text>
              <Progress colorScheme="warning" value={70} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Error</Text>
              <Progress colorScheme="error" value={70} />
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview
          code={`<Stack gap={3}>
  <Progress variant="default" value={60} />
  <Progress variant="gradient" value={60} />
  <Progress variant="striped" value={60} />
</Stack>`}
        >
          <Stack gap={4}>
            <Box>
              <Text className="text-sm text-muted mb-2">Default</Text>
              <Progress variant="default" value={60} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Gradient</Text>
              <Progress variant="gradient" value={60} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Striped</Text>
              <Progress variant="striped" value={60} />
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="With Value Display">
        <ComponentPreview
          code={`<Stack gap={3}>
  <Progress value={25} showLabel />
  <Progress value={50} showLabel />
  <Progress value={75} showLabel />
  <Progress value={100} showLabel colorScheme="success" />
</Stack>`}
        >
          <Stack gap={3}>
            <Progress value={25} showLabel />
            <Progress value={50} showLabel />
            <Progress value={75} showLabel />
            <Progress value={100} showLabel colorScheme="success" />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Indeterminate">
        <ComponentPreview
          code={`<Progress isIndeterminate />`}
        >
          <Stack gap={4}>
            <Box>
              <Text className="text-sm text-muted mb-2">Primary</Text>
              <Progress isIndeterminate colorScheme="primary" />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Success (gradient)</Text>
              <Progress isIndeterminate colorScheme="success" variant="gradient" />
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Props">
        <PropsTable props={progressProps} />
      </Section>
    </Box>
  )
}

export default ProgressPage
