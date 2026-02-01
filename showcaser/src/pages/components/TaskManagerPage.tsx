import BUI from '@bluesky-ui/ui'
import type { Task, TimeEntry, TaskDependency } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'

const sampleTasks: Task[] = [
  { id: '1', title: 'Design system review', description: 'Review all components', status: 'todo', priority: 'high', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'API integration', description: 'Connect to backend', status: 'in-progress', priority: 'high', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: 'Write documentation', description: 'Document all props', status: 'review', priority: 'medium', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', title: 'Setup CI/CD', description: 'Configure pipelines', status: 'done', priority: 'low', createdAt: new Date(), updatedAt: new Date() },
]

const sampleSubtasks = [
  { id: '1', title: 'Research requirements', completed: true },
  { id: '2', title: 'Create wireframes', completed: true },
  { id: '3', title: 'Implement UI', completed: false },
  { id: '4', title: 'Write tests', completed: false },
  { id: '5', title: 'Update documentation', completed: false },
]

const sampleTimeEntries: TimeEntry[] = [
  { id: '1', taskId: '1', startTime: new Date(Date.now() - 3600000), endTime: new Date(Date.now() - 1800000) },
  { id: '2', taskId: '2', startTime: new Date(Date.now() - 7200000), endTime: new Date(Date.now() - 5400000) },
]

const sampleDependencies: TaskDependency[] = [
  { id: 'dep1', from: '1', to: '2' },
  { id: 'dep2', from: '2', to: '3' },
  { id: 'dep3', from: '3', to: '4' },
]

export default function TaskManagerPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader 
        title="Task Manager" 
        description="Comprehensive Kanban board and task management components for productivity apps." 
      />

      <Section title="Task Board">
        <ComponentPreview>
          <BUI.TaskBoard tasks={sampleTasks} className="min-h-[400px]" />
        </ComponentPreview>
      </Section>

      <Section title="Task Card Variants">
        <ComponentPreview>
          <BUI.HStack spacing="md" align="start" wrap>
            <BUI.TaskCard 
              task={{ id: '1', title: 'Urgent Task', status: 'todo', priority: 'urgent', createdAt: new Date(), updatedAt: new Date() }}
              className="w-64"
            />
            <BUI.TaskCard 
              task={{ id: '2', title: 'High Priority', status: 'todo', priority: 'high', createdAt: new Date(), updatedAt: new Date() }}
              className="w-64"
            />
            <BUI.TaskCard 
              task={{ id: '3', title: 'Medium Priority', status: 'todo', priority: 'medium', createdAt: new Date(), updatedAt: new Date() }}
              className="w-64"
            />
            <BUI.TaskCard 
              task={{ id: '4', title: 'Low Priority', status: 'todo', priority: 'low', createdAt: new Date(), updatedAt: new Date() }}
              className="w-64"
            />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Task Detail View">
        <ComponentPreview>
          <BUI.TaskDetail 
            task={{
              id: '1',
              title: 'Implement feature X',
              description: 'Add the new feature with all required functionality including tests and documentation.',
              status: 'in-progress',
              priority: 'high',
              assignee: 'John Doe',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              tags: ['feature', 'frontend', 'urgent'],
              createdAt: new Date(),
              updatedAt: new Date(),
              timeSpent: 240,
              estimatedTime: 480,
            }}
            className="max-w-lg"
          />
        </ComponentPreview>
      </Section>

      <Section title="Task Editor">
        <ComponentPreview>
          <BUI.TaskEditor 
            className="max-w-lg"
            onSubmit={(task) => console.log('Submit task:', task)}
          />
        </ComponentPreview>
      </Section>

      <Section title="Priority Badge & Status Selector">
        <ComponentPreview>
          <BUI.Stack spacing="md">
            <BUI.HStack spacing="sm" align="center">
              <BUI.TaskPriorityBadge priority="urgent" />
              <BUI.TaskPriorityBadge priority="high" />
              <BUI.TaskPriorityBadge priority="medium" />
              <BUI.TaskPriorityBadge priority="low" />
            </BUI.HStack>
            <BUI.TaskStatusSelector 
              value="in-progress"
              onChange={(status) => console.log('Status:', status)}
            />
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <Section title="Task Timeline">
        <ComponentPreview>
          <BUI.TaskTimeline 
            className="max-w-2xl"
            tasks={[
              { id: '1', title: 'Sprint Planning', status: 'done', priority: 'high', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
              { id: '2', title: 'Feature Development', status: 'in-progress', priority: 'high', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
              { id: '3', title: 'Code Review', status: 'todo', priority: 'medium', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
              { id: '4', title: 'Release', status: 'todo', priority: 'urgent', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
            ]}
            days={14}
          />
        </ComponentPreview>
      </Section>

      <Section title="Task Calendar">
        <ComponentPreview>
          <BUI.TaskCalendar 
            tasks={[
              { id: '1', title: 'Meeting', status: 'todo', priority: 'high', dueDate: new Date(), createdAt: new Date(), updatedAt: new Date() },
              { id: '2', title: 'Deadline', status: 'in-progress', priority: 'urgent', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
            ]}
            className="max-w-2xl"
          />
        </ComponentPreview>
      </Section>

      <Section title="Task Dependency Graph">
        <ComponentPreview>
          <BUI.TaskDependencyGraph 
            className="w-full h-64"
            tasks={sampleTasks}
            dependencies={sampleDependencies}
          />
        </ComponentPreview>
      </Section>

      <Section title="Task Filter & Search">
        <ComponentPreview>
          <BUI.Stack spacing="md" className="max-w-lg">
            <BUI.TaskSearch 
              placeholder="Search tasks..."
              onChange={(e) => console.log('Search:', e.target.value)}
            />
            <BUI.TaskFilter 
              value={{
                status: ['todo', 'in-progress'],
                priority: ['high', 'urgent'],
              }}
              onChange={(value) => console.log('Filter value:', value)}
              assignees={['Alice', 'Bob', 'Charlie']}
            />
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <Section title="Recurring Task Picker">
        <ComponentPreview>
          <BUI.RecurringTaskPicker 
            className="max-w-sm"
            onChange={(schedule) => console.log('Schedule:', schedule)}
          />
        </ComponentPreview>
      </Section>

      <Section title="Task Stats & Burndown">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="start">
            <BUI.TaskStats 
              tasks={sampleTasks}
              className="w-64"
            />
            <BUI.BurndownChart 
              data={[
                { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), remaining: 20, ideal: 20 },
                { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), remaining: 18, ideal: 17 },
                { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), remaining: 15, ideal: 14 },
                { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), remaining: 14, ideal: 11 },
                { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), remaining: 10, ideal: 8 },
                { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), remaining: 6, ideal: 5 },
                { date: new Date(), remaining: 4, ideal: 2 },
              ]}
              className="w-80 h-48"
            />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Time Tracking">
        <ComponentPreview>
          <BUI.TimeTracking 
            className="max-w-sm"
            entries={sampleTimeEntries}
            onStart={(taskId) => console.log('Start:', taskId)}
            onStop={(entryId) => console.log('Stop:', entryId)}
            getTaskTitle={(taskId) => sampleTasks.find(t => t.id === taskId)?.title || 'Unknown'}
          />
        </ComponentPreview>
      </Section>

      <Section title="Subtask List">
        <ComponentPreview>
          <BUI.SubtaskList 
            className="max-w-md"
            subtasks={sampleSubtasks}
            onChange={(subtasks) => console.log('Subtasks changed:', subtasks)}
          />
        </ComponentPreview>
      </Section>
    </BUI.Stack>
  )
}
