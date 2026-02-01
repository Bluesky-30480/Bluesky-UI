import { Skeleton, SkeletonText, SkeletonAvatar, Stack, Box, Text } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const skeletonProps = [
  { name: 'width', type: 'string | number', description: 'Width of the skeleton' },
  { name: 'height', type: 'string | number', description: 'Height of the skeleton' },
  { name: 'circle', type: 'boolean', default: 'false', description: 'Make it a circle' },
  { name: 'animation', type: "'pulse' | 'shimmer' | 'none'", default: "'pulse'", description: 'Animation type' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Border radius' },
]

const skeletonTextProps = [
  { name: 'lines', type: 'number', default: '3', description: 'Number of lines' },
  { name: 'gap', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Gap between lines' },
  { name: 'lastLineWidth', type: 'string | number', default: "'70%'", description: 'Last line width' },
]

const skeletonAvatarProps = [
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar size' },
]

export function SkeletonPage() {
  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Skeleton"
        description="Skeleton loaders provide visual placeholders while content is loading, improving perceived performance."
      />

      <Section title="Basic Usage">
        <ComponentPreview
          code={`<Skeleton width={200} height={20} />`}
        >
          <Skeleton width={200} height={20} />
        </ComponentPreview>
      </Section>

      <Section title="Various Shapes">
        <ComponentPreview
          code={`<Stack gap={4}>
  <Skeleton width={200} height={16} />
  <Skeleton width={150} height={16} />
  <Skeleton width={100} height={40} rounded="lg" />
  <Skeleton width={60} height={60} circle />
</Stack>`}
        >
          <Stack gap={4}>
            <Skeleton width={200} height={16} />
            <Skeleton width={150} height={16} />
            <Skeleton width={100} height={40} rounded="lg" />
            <Skeleton width={60} height={60} circle />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Border Radius">
        <ComponentPreview
          code={`<Stack direction="row" gap={3}>
  <Skeleton width={80} height={40} rounded="none" />
  <Skeleton width={80} height={40} rounded="sm" />
  <Skeleton width={80} height={40} rounded="md" />
  <Skeleton width={80} height={40} rounded="lg" />
  <Skeleton width={80} height={40} rounded="full" />
</Stack>`}
        >
          <Stack direction="row" gap={3}>
            <Box className="text-center">
              <Skeleton width={80} height={40} rounded="none" />
              <Text className="text-xs text-muted mt-1">none</Text>
            </Box>
            <Box className="text-center">
              <Skeleton width={80} height={40} rounded="sm" />
              <Text className="text-xs text-muted mt-1">sm</Text>
            </Box>
            <Box className="text-center">
              <Skeleton width={80} height={40} rounded="md" />
              <Text className="text-xs text-muted mt-1">md</Text>
            </Box>
            <Box className="text-center">
              <Skeleton width={80} height={40} rounded="lg" />
              <Text className="text-xs text-muted mt-1">lg</Text>
            </Box>
            <Box className="text-center">
              <Skeleton width={80} height={40} rounded="full" />
              <Text className="text-xs text-muted mt-1">full</Text>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Animation Types">
        <ComponentPreview
          code={`<Stack gap={4}>
  <Skeleton width="100%" height={20} animation="pulse" />
  <Skeleton width="100%" height={20} animation="shimmer" />
  <Skeleton width="100%" height={20} animation="none" />
</Stack>`}
        >
          <Stack gap={4}>
            <Box>
              <Text className="text-sm text-muted mb-2">Pulse (default)</Text>
              <Skeleton width="100%" height={20} animation="pulse" />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">Shimmer</Text>
              <Skeleton width="100%" height={20} animation="shimmer" />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">None</Text>
              <Skeleton width="100%" height={20} animation="none" />
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="SkeletonText">
        <ComponentPreview
          code={`<Stack gap={6}>
  <SkeletonText lines={3} />
  <SkeletonText lines={2} lastLineWidth="50%" />
</Stack>`}
        >
          <Stack gap={6}>
            <Box>
              <Text className="text-sm text-muted mb-2">3 lines (default)</Text>
              <SkeletonText lines={3} />
            </Box>
            <Box>
              <Text className="text-sm text-muted mb-2">2 lines with 50% last line</Text>
              <SkeletonText lines={2} lastLineWidth="50%" />
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="SkeletonAvatar">
        <ComponentPreview
          code={`<Stack direction="row" gap={3} align="end">
  <SkeletonAvatar size="xs" />
  <SkeletonAvatar size="sm" />
  <SkeletonAvatar size="md" />
  <SkeletonAvatar size="lg" />
  <SkeletonAvatar size="xl" />
</Stack>`}
        >
          <Stack direction="row" gap={3} align="end">
            <Box className="text-center">
              <SkeletonAvatar size="xs" />
              <Text className="text-xs text-muted mt-1">xs</Text>
            </Box>
            <Box className="text-center">
              <SkeletonAvatar size="sm" />
              <Text className="text-xs text-muted mt-1">sm</Text>
            </Box>
            <Box className="text-center">
              <SkeletonAvatar size="md" />
              <Text className="text-xs text-muted mt-1">md</Text>
            </Box>
            <Box className="text-center">
              <SkeletonAvatar size="lg" />
              <Text className="text-xs text-muted mt-1">lg</Text>
            </Box>
            <Box className="text-center">
              <SkeletonAvatar size="xl" />
              <Text className="text-xs text-muted mt-1">xl</Text>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Card Example">
        <ComponentPreview
          code={`<Box className="p-4 border rounded-lg max-w-sm">
  <Stack direction="row" gap={3} align="start">
    <SkeletonAvatar size="lg" />
    <Box className="flex-1">
      <Skeleton width="60%" height={16} className="mb-2" />
      <Skeleton width="40%" height={12} />
    </Box>
  </Stack>
  <Skeleton width="100%" height={120} className="mt-4" rounded="lg" />
  <SkeletonText lines={2} className="mt-3" />
</Box>`}
        >
          <Box className="p-4 border border-border rounded-lg max-w-sm">
            <Stack direction="row" gap={3} align="start">
              <SkeletonAvatar size="lg" />
              <Box className="flex-1">
                <Skeleton width="60%" height={16} className="mb-2" />
                <Skeleton width="40%" height={12} />
              </Box>
            </Stack>
            <Skeleton width="100%" height={120} className="mt-4" rounded="lg" />
            <SkeletonText lines={2} className="mt-3" />
          </Box>
        </ComponentPreview>
      </Section>

      <Section title="Skeleton Props">
        <PropsTable props={skeletonProps} />
      </Section>

      <Section title="SkeletonText Props">
        <PropsTable props={skeletonTextProps} />
      </Section>

      <Section title="SkeletonAvatar Props">
        <PropsTable props={skeletonAvatarProps} />
      </Section>
    </Box>
  )
}

export default SkeletonPage
