import BUI from '@bluesky-ui/ui'
import { Copy, Reply, Forward, ThumbsUp, Heart, Laugh, Pin } from 'lucide-react'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'

export default function ChatPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader 
        title="Chat" 
        description="Comprehensive chat UI building blocks for messaging and AI conversation experiences." 
      />

      <Section title="Full Conversation">
        <ComponentPreview>
          <BUI.ChatContainer className="h-[400px] max-w-2xl">
            <BUI.ChatHeader>
              <BUI.HStack spacing="md" align="center">
                <BUI.Avatar name="Support Agent" size="sm" />
                <BUI.Stack spacing="none">
                  <BUI.Text weight="semibold" size="sm">Support Agent</BUI.Text>
                  <BUI.Text size="xs" color="muted">Online</BUI.Text>
                </BUI.Stack>
              </BUI.HStack>
            </BUI.ChatHeader>
            <BUI.MessageList>
              <BUI.MessageItem>
                <BUI.MessageAvatar name="Agent" />
                <BUI.MessageBubble>
                  Hello! How can I help you today?
                </BUI.MessageBubble>
              </BUI.MessageItem>
              <BUI.MessageItem variant="outgoing">
                <BUI.MessageBubble variant="outgoing">
                  I need help with my order #12345
                </BUI.MessageBubble>
              </BUI.MessageItem>
              <BUI.MessageItem>
                <BUI.MessageAvatar name="Agent" />
                <BUI.MessageBubble>
                  Of course! Let me look that up for you. One moment please...
                </BUI.MessageBubble>
              </BUI.MessageItem>
              <BUI.TypingIndicator />
            </BUI.MessageList>
            <BUI.ChatFooter>
              <BUI.ChatInput placeholder="Type a message..." />
            </BUI.ChatFooter>
          </BUI.ChatContainer>
        </ComponentPreview>
      </Section>

      <Section title="Message Bubbles & Variants">
        <ComponentPreview>
          <BUI.Stack spacing="md" className="max-w-lg">
            <BUI.MessageItem>
              <BUI.MessageBubble>Incoming message</BUI.MessageBubble>
            </BUI.MessageItem>
            <BUI.MessageItem variant="outgoing">
              <BUI.MessageBubble variant="outgoing">Outgoing message</BUI.MessageBubble>
            </BUI.MessageItem>
            <BUI.MessageItem>
              <BUI.MessageBubble status="sent">With sent status</BUI.MessageBubble>
            </BUI.MessageItem>
            <BUI.MessageItem variant="outgoing">
              <BUI.MessageBubble variant="outgoing" status="delivered">Delivered</BUI.MessageBubble>
            </BUI.MessageItem>
            <BUI.MessageItem variant="outgoing">
              <BUI.MessageBubble variant="outgoing" status="read">Read</BUI.MessageBubble>
            </BUI.MessageItem>
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <Section title="Message Actions & Reactions">
        <ComponentPreview>
          <BUI.Stack spacing="lg" className="max-w-lg">
            <BUI.MessageItem>
              <BUI.MessageBubble>
                This message has actions
                <BUI.MessageActions>
                  <BUI.Button size="xs" variant="ghost" onClick={() => console.log('Copy')}><Copy className="h-3 w-3 mr-1" /> Copy</BUI.Button>
                  <BUI.Button size="xs" variant="ghost" onClick={() => console.log('Reply')}><Reply className="h-3 w-3 mr-1" /> Reply</BUI.Button>
                  <BUI.Button size="xs" variant="ghost" onClick={() => console.log('Forward')}><Forward className="h-3 w-3 mr-1" /> Forward</BUI.Button>
                </BUI.MessageActions>
              </BUI.MessageBubble>
            </BUI.MessageItem>
            <BUI.MessageItem>
              <BUI.MessageBubble>
                This message has reactions
                <BUI.MessageReactions>
                  <BUI.Button size="xs" variant="ghost" onClick={() => console.log('React thumbs up')}><ThumbsUp className="h-3 w-3 mr-1" /> 3</BUI.Button>
                  <BUI.Button size="xs" variant="ghost" onClick={() => console.log('React heart')}><Heart className="h-3 w-3 mr-1" /> 2</BUI.Button>
                  <BUI.Button size="xs" variant="ghost" onClick={() => console.log('React laugh')}><Laugh className="h-3 w-3 mr-1" /> 1</BUI.Button>
                </BUI.MessageReactions>
              </BUI.MessageBubble>
            </BUI.MessageItem>
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <Section title="Typing Indicator">
        <ComponentPreview>
          <BUI.Stack spacing="md">
            <BUI.TypingIndicator />
            <BUI.TypingIndicator users={['Alice']} />
            <BUI.TypingIndicator users={['Alice', 'Bob']} />
            <BUI.TypingIndicator users={['Alice', 'Bob', 'Charlie']} />
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <Section title="Streaming Text">
        <ComponentPreview>
          <BUI.Stack spacing="md" className="max-w-lg">
            <BUI.StreamingText 
              text="This text appears character by character, simulating AI streaming responses..."
              speed={30}
            />
          </BUI.Stack>
        </ComponentPreview>
      </Section>

      <Section title="Markdown Renderer">
        <ComponentPreview>
          <BUI.MarkdownRenderer 
            className="max-w-lg"
            content={`# Heading

This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
`}
          />
        </ComponentPreview>
      </Section>

      <Section title="Chat Code Block">
        <ComponentPreview>
          <BUI.ChatCodeBlock 
            language="typescript"
            code={`interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User) {
  return \`Hello, \${user.name}!\`;
}`}
            showLineNumbers
          />
        </ComponentPreview>
      </Section>

      <Section title="Attachment Preview">
        <ComponentPreview>
          <BUI.HStack spacing="md" wrap>
            <BUI.AttachmentPreview 
              type="image"
              name="photo.jpg"
              size={1024000}
              url="/placeholder-image.jpg"
            />
            <BUI.AttachmentPreview 
              type="document"
              name="report.pdf"
              size={2048000}
            />
            <BUI.AttachmentPreview 
              type="file"
              name="data.csv"
              size={512000}
            />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Search in Conversation">
        <ComponentPreview>
          <BUI.SearchInConversation 
            className="max-w-md"
            placeholder="Search messages..."
            onSearch={(query) => console.log('Search:', query)}
            results={5}
            currentResult={2}
            onPrevious={() => console.log('Previous')}
            onNext={() => console.log('Next')}
          />
        </ComponentPreview>
      </Section>

      <Section title="Regenerate Action">
        <ComponentPreview>
          <BUI.HStack spacing="md">
            <BUI.RegenerateAction onClick={() => console.log('Regenerate')} />
            <BUI.RegenerateAction onClick={() => console.log('Regenerate shorter')}>Regenerate shorter</BUI.RegenerateAction>
            <BUI.RegenerateAction onClick={() => console.log('Regenerate longer')}>Regenerate longer</BUI.RegenerateAction>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Token Counter">
        <ComponentPreview>
          <BUI.HStack spacing="lg">
            <BUI.TokenCounter tokens={150} maxTokens={4096} />
            <BUI.TokenCounter tokens={3200} maxTokens={4096} />
            <BUI.TokenCounter tokens={3800} maxTokens={4096} />
            <BUI.TokenCounter tokens={4000} maxTokens={4096} showCost costPerThousand={0.003} />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Transcript Export">
        <ComponentPreview>
          <BUI.HStack spacing="md">
            <BUI.TranscriptExport format="txt" onClick={() => console.log('Export txt')} />
            <BUI.TranscriptExport format="json" onClick={() => console.log('Export json')} />
            <BUI.TranscriptExport format="markdown" onClick={() => console.log('Export markdown')} />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Pinboard">
        <ComponentPreview>
          <BUI.Pinboard className="max-w-md">
            <BUI.Stack spacing="sm">
              <BUI.HStack justify="between" align="center">
                <BUI.Text size="sm">Important information to remember</BUI.Text>
                <BUI.Button size="xs" variant="ghost" onClick={() => console.log('Unpin')}><Pin className="h-3 w-3" /></BUI.Button>
              </BUI.HStack>
              <BUI.HStack justify="between" align="center">
                <BUI.Text size="sm">Key decision from earlier</BUI.Text>
                <BUI.Button size="xs" variant="ghost" onClick={() => console.log('Unpin')}><Pin className="h-3 w-3" /></BUI.Button>
              </BUI.HStack>
            </BUI.Stack>
          </BUI.Pinboard>
        </ComponentPreview>
      </Section>

      <Section title="Saved Messages">
        <ComponentPreview>
          <BUI.SavedMessages className="max-w-md">
            <BUI.Card className="cursor-pointer hover:bg-muted/50" onClick={() => console.log('Select 1')}>
              <BUI.CardContent className="p-3">
                <BUI.Text size="sm">Saved response template 1</BUI.Text>
              </BUI.CardContent>
            </BUI.Card>
            <BUI.Card className="cursor-pointer hover:bg-muted/50" onClick={() => console.log('Select 2')}>
              <BUI.CardContent className="p-3">
                <BUI.Text size="sm">Saved response template 2</BUI.Text>
              </BUI.CardContent>
            </BUI.Card>
          </BUI.SavedMessages>
        </ComponentPreview>
      </Section>

      <Section title="Conversation Meta">
        <ComponentPreview>
          <BUI.ConversationMeta className="max-w-md">
            <BUI.HStack spacing="md" wrap>
              <span>Support Chat #12345</span>
              <span>•</span>
              <span>Started 1 day ago</span>
              <span>•</span>
              <span>42 messages</span>
              <span>•</span>
              <span>2 participants</span>
            </BUI.HStack>
          </BUI.ConversationMeta>
        </ComponentPreview>
      </Section>

      <Section title="Message Thread">
        <ComponentPreview>
          <BUI.Stack spacing="md" className="max-w-lg">
            <BUI.MessageItem>
              <BUI.MessageBubble>Original message that started the thread</BUI.MessageBubble>
            </BUI.MessageItem>
            <BUI.MessageThread>
              <BUI.Stack spacing="sm">
                <BUI.Text size="xs" color="muted">Alice:</BUI.Text>
                <BUI.Text size="sm">First reply</BUI.Text>
              </BUI.Stack>
              <BUI.Stack spacing="sm">
                <BUI.Text size="xs" color="muted">Bob:</BUI.Text>
                <BUI.Text size="sm">Second reply</BUI.Text>
              </BUI.Stack>
            </BUI.MessageThread>
          </BUI.Stack>
        </ComponentPreview>
      </Section>
    </BUI.Stack>
  )
}
