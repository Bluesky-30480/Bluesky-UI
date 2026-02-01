import { useRef, useState } from 'react'
import jsxToString from 'react-element-to-jsx-string'
import { Code } from 'lucide-react'
import BUI from '@bluesky-ui/ui'
import { CodeBlock } from './CodeBlock'

interface ComponentPreviewProps {
  title?: string
  description?: string
  code?: string
  children: React.ReactNode
  className?: string
}

export function ComponentPreview({ 
  title, 
  description, 
  code, 
  children,
  className = ''
}: ComponentPreviewProps) {
  const [showUsage, setShowUsage] = useState(false)
  const [showSource, setShowSource] = useState(false)
  
  // Only capture code on first render to prevent scroll jumps on state changes
  const resolvedCodeRef = useRef<string | undefined>(undefined)
  if (resolvedCodeRef.current === undefined) {
    try {
      resolvedCodeRef.current = jsxToString(<>{children}</>, {
        sortProps: false,
        showFunctions: true,
        maxInlineAttributesLineLength: 80,
        useBooleanShorthandSyntax: false,
      })
    } catch {
      resolvedCodeRef.current = ''
    }
  }
  const resolvedCode = resolvedCodeRef.current || undefined
  
  const usageCode = code ?? resolvedCode
  const sourceCode = code ? resolvedCode : undefined
  
  const usageWithBuiRef = useRef<string | undefined>(undefined)
  if (usageWithBuiRef.current === undefined && usageCode) {
    const withNamespace = usageCode
      .replace(/<(?!BUI\.)((?:[A-Z][\w]*))/g, '<BUI.$1')
      .replace(/<\/(?!BUI\.)((?:[A-Z][\w]*))>/g, '</BUI.$1>')
    usageWithBuiRef.current = `import BUI from '@bluesky-ui/ui'\n\n${withNamespace}`
  }
  const usageWithBui = usageWithBuiRef.current

  return (
    <BUI.Box className={`rounded-lg border border-border ${className}`}>
      {/* Header */}
      {(title || description) && (
        <BUI.Box className="px-6 py-4 bg-surface border-b border-border">
          <BUI.VStack spacing="xs" align="start">
            {title && (
              <BUI.Text weight="semibold">{title}</BUI.Text>
            )}
            {description && (
              <BUI.Text size="sm" color="muted">{description}</BUI.Text>
            )}
          </BUI.VStack>
        </BUI.Box>
      )}

      {/* Preview - no overflow-hidden to allow tooltips/popovers to escape */}
      <BUI.Box 
        className="
          p-8 bg-background 
          flex items-center justify-center
          min-h-[160px]
          relative
        "
      >
        {children}
      </BUI.Box>

      {/* Actions - only show if code is provided */}
      {(usageWithBui || sourceCode) && (
        <BUI.HStack
          justify="between"
          className="px-4 py-2 bg-surface border-t border-border"
        >
          <BUI.HStack spacing="xs">
            {usageWithBui && (
              <BUI.Button
                variant={showUsage ? 'solid' : 'ghost'}
                size="sm"
                colorScheme={showUsage ? 'primary' : 'neutral'}
                leftIcon={<Code className="w-4 h-4" />}
                onClick={() => setShowUsage(!showUsage)}
              >
                {showUsage ? 'Hide' : 'Show'} Usage
              </BUI.Button>
            )}
          </BUI.HStack>
          <BUI.HStack spacing="xs">
            {sourceCode && (
              <BUI.Button
                variant={showSource ? 'solid' : 'ghost'}
                size="sm"
                colorScheme={showSource ? 'primary' : 'neutral'}
                leftIcon={<Code className="w-4 h-4" />}
                onClick={() => setShowSource(!showSource)}
              >
                {showSource ? 'Hide' : 'Show'} Source
              </BUI.Button>
            )}
          </BUI.HStack>
        </BUI.HStack>
      )}

      {/* Usage Panel */}
      {usageWithBui && (
        <BUI.Box
          className={
            showUsage
              ? 'border-t border-border overflow-hidden transition-all duration-300 max-h-[1000px] opacity-100'
              : 'overflow-hidden transition-all duration-300 max-h-0 opacity-0'
          }
        >
          <CodeBlock code={usageWithBui} />
        </BUI.Box>
      )}

      {/* Source Panel */}
      {sourceCode && (
        <BUI.Box
          className={
            showSource
              ? 'border-t border-border overflow-hidden transition-all duration-300 max-h-[1000px] opacity-100'
              : 'overflow-hidden transition-all duration-300 max-h-0 opacity-0'
          }
        >
          <CodeBlock code={sourceCode} />
        </BUI.Box>
      )}
    </BUI.Box>
  )
}
