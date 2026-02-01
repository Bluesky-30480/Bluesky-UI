import { Grid, Stack, Text, Box, Divider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const gridProps = [
  { name: 'columns', type: 'number | string', defaultValue: '-', description: 'Grid template columns (number or CSS string)' },
  { name: 'rows', type: 'number | string', defaultValue: '-', description: 'Grid template rows (number or CSS string)' },
  { name: 'minColumnWidth', type: 'string', defaultValue: '-', description: 'Minimum column width for auto-fit layout' },
  { name: 'autoFit', type: 'boolean', defaultValue: 'true', description: 'Use auto-fit when minColumnWidth is provided' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | number", defaultValue: "'md'", description: 'Gap between rows and columns' },
  { name: 'rowGap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | number", defaultValue: '-', description: 'Row gap override' },
  { name: 'columnGap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | number", defaultValue: '-', description: 'Column gap override' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", defaultValue: "'stretch'", description: 'Align items along the block axis' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'stretch'", defaultValue: "'stretch'", description: 'Justify items along the inline axis' },
  { name: 'autoFlow', type: "'row' | 'column' | 'dense' | 'row dense' | 'column dense'", defaultValue: "'row'", description: 'Auto placement flow' },
  { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'Use inline-grid layout' },
]

function DemoBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      padding="sm"
      background="surface"
      rounded="md"
      border
      className="min-h-[64px] flex items-center justify-center"
    >
      <Text size="sm">{children}</Text>
    </Box>
  )
}

export function GridPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Grid"
        description="A flexible CSS Grid layout component for building structured layouts."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Grid columns={3} gap="md">
            <DemoBox>1</DemoBox>
            <DemoBox>2</DemoBox>
            <DemoBox>3</DemoBox>
            <DemoBox>4</DemoBox>
            <DemoBox>5</DemoBox>
            <DemoBox>6</DemoBox>
          </Grid>
        </ComponentPreview>
      </Section>

      <Section title="Column Counts">
        <ComponentPreview>
          <Stack spacing="lg">
            {[2, 3, 4].map((count) => (
              <Stack key={count} spacing="sm">
                <Text size="sm" color="muted">columns={count}</Text>
                <Grid columns={count} gap="sm">
                  {Array.from({ length: count * 2 }).map((_, index) => (
                    <DemoBox key={index}>{index + 1}</DemoBox>
                  ))}
                </Grid>
              </Stack>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Auto-fit Columns">
        <ComponentPreview>
          <Stack spacing="sm">
            <Text size="sm" color="muted">minColumnWidth="160px"</Text>
            <Grid minColumnWidth="160px" gap="md">
              {Array.from({ length: 8 }).map((_, index) => (
                <DemoBox key={index}>Item {index + 1}</DemoBox>
              ))}
            </Grid>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Row and Column Gaps">
        <ComponentPreview>
          <Stack spacing="sm">
            <Text size="sm" color="muted">rowGap="lg" columnGap="sm"</Text>
            <Grid columns={3} rowGap="lg" columnGap="sm">
              {Array.from({ length: 6 }).map((_, index) => (
                <DemoBox key={index}>Item {index + 1}</DemoBox>
              ))}
            </Grid>
          </Stack>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={gridProps} />
      </Section>
    </Stack>
  )
}
