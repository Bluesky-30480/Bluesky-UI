import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'

// Sample data for Agent components
const sampleAgentTasks = [
  { id: '1', title: 'Initialize environment', status: 'completed' as const, startedAt: new Date(), completedAt: new Date() },
  { id: '2', title: 'Load configuration', status: 'completed' as const, startedAt: new Date(), completedAt: new Date() },
  { id: '3', title: 'Process data batch', status: 'running' as const, progress: 65, startedAt: new Date() },
  { id: '4', title: 'Generate report', status: 'pending' as const },
  { id: '5', title: 'Send notifications', status: 'pending' as const },
]

const sampleMemoryEntries = [
  { id: '1', key: 'user_context', value: { name: 'John', preferences: ['dark mode'] }, type: 'object' as const, timestamp: new Date() },
  { id: '2', key: 'session_data', value: { id: 'sess_123', active: true }, type: 'object' as const, timestamp: new Date() },
  { id: '3', key: 'last_action', value: 'query_database', type: 'string' as const, timestamp: new Date() },
]

const sampleLogs = [
  { id: '1', level: 'info' as const, message: 'Agent started successfully', timestamp: new Date(Date.now() - 5000) },
  { id: '2', level: 'debug' as const, message: 'Loading model weights...', timestamp: new Date(Date.now() - 4000) },
  { id: '3', level: 'info' as const, message: 'Model loaded in 2.3s', timestamp: new Date(Date.now() - 3000) },
  { id: '4', level: 'warn' as const, message: 'Memory usage above 80%', timestamp: new Date(Date.now() - 2000) },
  { id: '5', level: 'error' as const, message: 'Connection timeout to external API', timestamp: new Date(Date.now() - 1000) },
  { id: '6', level: 'info' as const, message: 'Retry successful', timestamp: new Date() },
]

const sampleChainNodes = [
  { id: '1', label: 'Input', type: 'agent' as const, status: 'completed' as const },
  { id: '2', label: 'LLM Call', type: 'llm' as const, status: 'completed' as const },
  { id: '3', label: 'Tool: Search', type: 'tool' as const, status: 'running' as const },
  { id: '4', label: 'LLM Call', type: 'llm' as const },
  { id: '5', label: 'Output', type: 'output' as const },
]

const sampleChainEdges = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '3', to: '4' },
  { from: '4', to: '5' },
]

const sampleToolInvocation = {
  id: '1',
  name: 'web_search',
  input: { query: 'latest AI news', limit: 5 },
  output: { results: ['Result 1', 'Result 2', 'Result 3'] },
  status: 'success' as const,
  duration: 1250,
}

const sampleReasoningSteps = [
  { id: '1', type: 'thought' as const, content: 'The user is asking about weather. I should use the weather API.' },
  { id: '2', type: 'action' as const, content: 'Calling weather_api with location="New York"' },
  { id: '3', type: 'observation' as const, content: 'Temperature: 72°F, Conditions: Partly cloudy' },
  { id: '4', type: 'thought' as const, content: 'I have the weather data. I can now respond to the user.' },
  { id: '5', type: 'conclusion' as const, content: 'The weather in New York is 72°F and partly cloudy.' },
]

const samplePermissions = [
  { id: 'read_files', name: 'Read Files', granted: true, description: 'Allow reading local files' },
  { id: 'write_files', name: 'Write Files', granted: false, description: 'Allow writing local files' },
  { id: 'network', name: 'Network Access', granted: true, description: 'Allow internet access' },
  { id: 'execute', name: 'Execute Code', granted: false, description: 'Allow code execution' },
]

const samplePersona = {
  name: 'Assistant',
  description: 'A helpful AI assistant for various tasks',
  systemPrompt: 'You are a helpful assistant that provides accurate and concise information.',
  personality: 'friendly and professional',
  tone: 'friendly' as const,
  tags: ['helpful', 'professional', 'accurate'],
}

const sampleTemplates = [
  { id: '1', name: 'Customer Support', description: 'Handle support tickets', category: 'Support', persona: { name: 'Support Agent', description: 'Friendly support agent', systemPrompt: 'You are a helpful support agent.', tags: ['support', 'chat'] } },
  { id: '2', name: 'Code Review', description: 'Review pull requests', category: 'Development', persona: { name: 'Code Reviewer', description: 'Expert code reviewer', systemPrompt: 'You review code carefully.', tags: ['development', 'review'] } },
  { id: '3', name: 'Data Analysis', description: 'Analyze datasets', category: 'Analytics', persona: { name: 'Data Analyst', description: 'Data analysis expert', systemPrompt: 'You analyze data.', tags: ['analytics', 'data'] } },
]

export default function AgentSystemPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader 
        title="Agent System" 
        description="Comprehensive components for building agent dashboards, monitoring, and tooling." 
      />

      <Section title="Agent Panel & Card">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.AgentPanel className="w-72 p-4">
              <BUI.HStack spacing="md" align="center">
                <BUI.AgentAvatar status="running" />
                <BUI.Stack spacing="xs">
                  <BUI.Text weight="semibold">Atlas Agent</BUI.Text>
                  <BUI.AgentStatus status="running" />
                </BUI.Stack>
              </BUI.HStack>
            </BUI.AgentPanel>
            <BUI.AgentCard
              name="Nova"
              description="Data processing agent"
              status="idle"
              className="w-64"
            />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Agent Avatar & Status">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="center">
            <BUI.AgentAvatar status="running" />
            <BUI.AgentAvatar status="idle" />
            <BUI.AgentAvatar status="error" />
            <BUI.Divider orientation="vertical" className="h-10" />
            <BUI.AgentStatus status="running" />
            <BUI.AgentStatus status="idle" />
            <BUI.AgentStatus status="error" />
            <BUI.AgentStatus status="success" />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Agent Task List">
        <ComponentPreview>
          <BUI.AgentTaskList 
            tasks={sampleAgentTasks}
            className="max-w-md"
          />
        </ComponentPreview>
      </Section>

      <Section title="Memory Viewer">
        <ComponentPreview>
          <BUI.AgentMemoryViewer 
            entries={sampleMemoryEntries}
            className="max-w-lg"
          />
        </ComponentPreview>
      </Section>

      <Section title="Log Viewer">
        <ComponentPreview>
          <BUI.AgentLogViewer 
            logs={sampleLogs}
            className="max-w-2xl"
            maxHeight={200}
          />
        </ComponentPreview>
      </Section>

      <Section title="Chain Graph">
        <ComponentPreview>
          <BUI.AgentChainGraph 
            nodes={sampleChainNodes}
            edges={sampleChainEdges}
            activeNode="3"
            className="w-full"
          />
        </ComponentPreview>
      </Section>

      <Section title="Tool Invocation View">
        <ComponentPreview>
          <BUI.ToolInvocationView 
            invocation={sampleToolInvocation}
            defaultExpanded
            className="max-w-lg"
          />
        </ComponentPreview>
      </Section>

      <Section title="Reasoning Trace View">
        <ComponentPreview>
          <BUI.ReasoningTraceView 
            steps={sampleReasoningSteps}
            className="max-w-2xl"
          />
        </ComponentPreview>
      </Section>

      <Section title="Permission Editor">
        <ComponentPreview>
          <BUI.AgentPermissionEditor 
            permissions={samplePermissions}
            className="max-w-md"
          />
        </ComponentPreview>
      </Section>

      <Section title="Persona Editor">
        <ComponentPreview>
          <BUI.AgentPersonaEditor 
            persona={samplePersona}
            className="max-w-md"
          />
        </ComponentPreview>
      </Section>

      <Section title="Template Store">
        <ComponentPreview>
          <BUI.AgentTemplateStore 
            templates={sampleTemplates}
            className="max-w-2xl"
          />
        </ComponentPreview>
      </Section>

      <Section title="Testing Console">
        <ComponentPreview>
          <BUI.AgentTestingConsole className="max-w-2xl" />
        </ComponentPreview>
      </Section>
    </BUI.Stack>
  )
}
