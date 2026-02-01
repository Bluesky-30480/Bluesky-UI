import { useTheme, type ThemeName, HStack, Text, VStack } from '@bluesky-ui/ui'

const basicThemes: { name: ThemeName; label: string; color: string; gradient?: string }[] = [
  { name: 'blue', label: 'Blue', color: '#3b82f6' },
  { name: 'black', label: 'Black', color: '#171717' },
  { name: 'green', label: 'Green', color: '#10b981' },
  { name: 'orange', label: 'Orange', color: '#f97316' },
  { name: 'light', label: 'Light', color: '#f5f5f5' },
]

const effectThemes: { name: ThemeName; label: string; color: string; gradient?: string }[] = [
  { name: 'aurora', label: 'Aurora', color: '', gradient: 'linear-gradient(135deg, #0ea5e9, #10b981)' },
  { name: 'neon-purple', label: 'Neon', color: '', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)' },
  { name: 'sunset', label: 'Sunset', color: '', gradient: 'linear-gradient(135deg, #f97316, #ec4899)' },
  { name: 'ocean', label: 'Ocean', color: '', gradient: 'linear-gradient(135deg, #0ea5e9, #14b8a6)' },
  { name: 'forest', label: 'Forest', color: '', gradient: 'linear-gradient(135deg, #22c55e, #eab308)' },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <VStack spacing="xs" align="start">
      <HStack spacing="xs" align="center" className="flex-wrap">
        <Text size="xs" color="muted" className="mr-1">
          Basic:
        </Text>
        {basicThemes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`
              w-5 h-5 rounded-full border-2 
              transition-all duration-200 ease-out
              hover:scale-110 active:scale-95
              ${theme === t.name
                ? 'border-primary scale-110 ring-2 ring-primary/30'
                : 'border-transparent'
              }
            `}
            style={{ backgroundColor: t.gradient || t.color, background: t.gradient || t.color }}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
          />
        ))}
      </HStack>
      <HStack spacing="xs" align="center" className="flex-wrap">
        <Text size="xs" color="muted" className="mr-1">
          Effects:
        </Text>
        {effectThemes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`
              w-5 h-5 rounded-full border-2 
              transition-all duration-200 ease-out
              hover:scale-110 active:scale-95
              ${theme === t.name
                ? 'border-primary scale-110 ring-2 ring-primary/30'
                : 'border-transparent'
              }
            `}
            style={{ background: t.gradient || t.color }}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
          />
        ))}
      </HStack>
    </VStack>
  )
}
