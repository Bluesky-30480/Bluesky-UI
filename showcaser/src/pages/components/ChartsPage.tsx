import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const chartProps = [
  { name: 'data', type: 'number[] | number[][]', default: '-', description: 'Chart data points' },
  { name: 'labels', type: 'string[]', default: 'undefined', description: 'Labels for data points' },
  { name: 'height', type: 'number', default: '160', description: 'Chart height in pixels' },
  { name: 'showTooltip', type: 'boolean', default: 'true', description: 'Show tooltip on hover' },
  { name: 'showGrid', type: 'boolean', default: 'true', description: 'Show grid lines (LineChart)' },
  { name: 'showDots', type: 'boolean', default: 'true', description: 'Show data point dots (LineChart)' },
  { name: 'showLegend', type: 'boolean', default: 'true', description: 'Show legend (PieChart)' },
  { name: 'formatValue', type: '(value: number) => string', default: 'v => v.toString()', description: 'Format tooltip values' },
]

export default function ChartsPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader 
        title="Charts" 
        description="Comprehensive chart primitives for dashboards, analytics, and data visualization." 
      />

      <Section title="Line Chart">
        <ComponentPreview>
          <BUI.ChartContainer title="Monthly Revenue" className="max-w-2xl">
            <BUI.LineChart 
              data={[4200, 5800, 4900, 7200, 6100, 8500, 7800, 9200, 8100, 10500, 9800, 11200]}
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
              showGrid
              showTooltip
              showDots
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Area Chart">
        <ComponentPreview>
          <BUI.ChartContainer title="User Growth" className="max-w-2xl">
            <BUI.AreaChart 
              data={[120, 180, 250, 310, 420, 580, 720, 890, 1100, 1350, 1600, 1900]}
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
              showTooltip
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Bar Chart">
        <ComponentPreview>
          <BUI.ChartContainer title="Sales by Category" className="max-w-xl">
            <BUI.BarChart 
              data={[85, 62, 48, 35, 28]}
              labels={['Electronics', 'Clothing', 'Home', 'Sports', 'Books']}
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Horizontal Bar Chart">
        <ComponentPreview>
          <BUI.ChartContainer title="Team Performance" className="max-w-lg">
            <BUI.BarChart 
              data={[92, 78, 85, 68, 95]}
              labels={['Alice', 'Bob', 'Carol', 'David', 'Eve']}
              horizontal
              showValues
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Pie Chart">
        <ComponentPreview>
          <BUI.HStack spacing="xl" align="start">
            <BUI.ChartContainer title="Traffic Sources" className="w-64">
              <BUI.PieChart 
                data={[40, 25, 20, 15]}
                labels={['Organic', 'Direct', 'Referral', 'Social']}
                showLegend
              />
            </BUI.ChartContainer>
            <BUI.ChartContainer title="Device Usage" className="w-64">
              <BUI.PieChart 
                data={[55, 30, 15]}
                labels={['Mobile', 'Desktop', 'Tablet']}
                showLegend
              />
            </BUI.ChartContainer>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Sparkline">
        <ComponentPreview>
          <BUI.HStack spacing="xl" align="center">
            <BUI.Stack spacing="xs" align="center">
              <BUI.Text size="sm" color="muted">Revenue</BUI.Text>
              <BUI.Sparkline data={[4, 6, 3, 8, 5, 9, 7, 10, 8]} />
              <BUI.Text size="lg" weight="semibold">+12%</BUI.Text>
            </BUI.Stack>
            <BUI.Stack spacing="xs" align="center">
              <BUI.Text size="sm" color="muted">Users</BUI.Text>
              <BUI.Sparkline data={[8, 7, 6, 5, 6, 7, 8, 7, 9]} />
              <BUI.Text size="lg" weight="semibold">+5%</BUI.Text>
            </BUI.Stack>
            <BUI.Stack spacing="xs" align="center">
              <BUI.Text size="sm" color="muted">Churn</BUI.Text>
              <BUI.Sparkline data={[3, 5, 4, 6, 7, 5, 8, 6, 4]} />
              <BUI.Text size="lg" weight="semibold">-2%</BUI.Text>
            </BUI.Stack>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Heatmap">
        <ComponentPreview>
          <BUI.ChartContainer title="Activity Heatmap" className="max-w-xl">
            <BUI.Heatmap 
              data={[
                [1, 3, 5, 2, 4],
                [2, 4, 6, 3, 5],
                [3, 5, 7, 4, 6],
                [4, 6, 8, 5, 7],
                [2, 4, 5, 3, 4],
                [1, 2, 3, 2, 3],
                [0, 1, 2, 1, 2],
              ]}
              rowLabels={['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm']}
              colLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Radar Chart">
        <ComponentPreview>
          <BUI.ChartContainer title="Skill Assessment" className="w-80">
            <BUI.RadarChart 
              data={[85, 70, 90, 65, 80, 75]}
              labels={['JavaScript', 'TypeScript', 'React', 'Node.js', 'CSS', 'Testing']}
              showLabels
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Stream Graph">
        <ComponentPreview>
          <BUI.ChartContainer title="Topic Trends Over Time" className="max-w-2xl">
            <BUI.StreamGraph 
              series={[
                [10, 15, 12, 18, 22, 25, 20, 18, 15],
                [8, 10, 15, 12, 10, 8, 12, 15, 18],
                [5, 8, 10, 8, 6, 10, 15, 12, 10],
              ]}
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Timeline Chart">
        <ComponentPreview>
          <BUI.ChartContainer title="Project Milestones" className="max-w-2xl">
            <BUI.TimelineChart 
              points={[
                { label: 'Planning', value: 100 },
                { label: 'Design', value: 85 },
                { label: 'Development', value: 60 },
                { label: 'Testing', value: 30 },
                { label: 'Launch', value: 10 },
              ]}
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Node Graph">
        <ComponentPreview>
          <BUI.ChartContainer title="Module Dependencies" className="max-w-lg">
            <BUI.NodeGraph 
              nodes={['App', 'Router', 'Store', 'Components', 'Utils', 'API']}
              edges={[
                { from: 'App', to: 'Router' },
                { from: 'App', to: 'Store' },
                { from: 'Router', to: 'Components' },
                { from: 'Router', to: 'Utils' },
                { from: 'Store', to: 'Utils' },
                { from: 'Store', to: 'API' },
              ]}
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Dependency Graph">
        <ComponentPreview>
          <BUI.ChartContainer title="Package Dependencies" className="max-w-lg">
            <BUI.DependencyGraph 
              dependencies={{
                'react': ['react-dom'],
                'react-dom': [],
                'typescript': [],
                'vite': ['typescript'],
                '@bluesky-ui/ui': ['react', 'tailwindcss'],
              }}
            />
          </BUI.ChartContainer>
        </ComponentPreview>
      </Section>

      <Section title="Performance Monitor">
        <ComponentPreview>
          <BUI.PerformanceMonitor 
            className="max-w-lg"
            metrics={[
              { label: 'FPS', value: '60' },
              { label: 'Memory', value: '128 MB' },
              { label: 'CPU', value: '35%' },
              { label: 'Latency', value: '42ms' },
            ]}
          />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={chartProps} />
      </Section>
    </BUI.Stack>
  )
}
