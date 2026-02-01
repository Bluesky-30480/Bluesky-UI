# Bluesky UI

A modern React component library with 230+ components, built-in theming system, and effect support (glows, gradients, shadows).

[![Deploy to GitHub Pages](https://github.com/Bluesky-30480/Bluesky-UI/actions/workflows/deploy.yml/badge.svg)](https://github.com/Bluesky-30480/Bluesky-UI/actions/workflows/deploy.yml)

## 🌐 Live Demo

**[View Live Documentation →](https://bluesky-30480.github.io/Bluesky-UI/)**

## ✨ Features

- **230+ Components** - Buttons, Cards, Forms, Data Display, Navigation, and more
- **10 Built-in Themes** - 5 basic themes + 5 effect themes with glows and gradients
- **Effect System** - Built-in support for glows, gradients, and enhanced shadows
- **Runtime Theming** - Switch themes at runtime with smooth transitions
- **TypeScript** - Full TypeScript support with comprehensive type definitions
- **Accessible** - Built with accessibility in mind

## 📦 Themes

### Basic Themes
- **Blue** - Professional dark theme with blue accents
- **Black** - Minimal, high-contrast dark theme
- **Green** - Nature-inspired with emerald accents
- **Orange** - Warm, energetic dark theme
- **Light** - Clean, bright light theme

### Effect Themes (with Glows & Gradients)
- **Aurora** - Blue-green gradient with glowing effects
- **Neon Purple** - Cyberpunk-inspired with intense purple/pink glows
- **Sunset** - Warm orange to pink gradient effects
- **Ocean** - Deep blue with aqua accents
- **Forest** - Rich greens with golden accents

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Bluesky-30480/Bluesky-UI.git

# Install dependencies
pnpm install

# Start the showcaser
pnpm --filter showcaser dev
```

## 📖 Usage

```tsx
import { Button, Card, useTheme } from '@bluesky-ui/ui'
import '@bluesky-ui/ui/styles'

function App() {
  const { setTheme } = useTheme()
  
  return (
    <Card glow shadow="lg">
      <Button onClick={() => setTheme('aurora')} gradient>
        Switch to Aurora
      </Button>
    </Card>
  )
}
```

## 🎨 Effect Props

Components support effect props that work with effect themes:

```tsx
// Glowing button
<Button glow>Glowing Button</Button>

// Gradient background
<Button gradient>Gradient Button</Button>

// Enhanced shadows
<Card shadow="lg">Card with Shadow</Card>

// Combine effects
<Card glow shadow="lg" gradient>All Effects</Card>
```

## 📁 Project Structure

```
bluesky-ui/
├── component-library/     # Core component library
│   ├── src/
│   │   ├── components/    # All UI components
│   │   ├── hooks/         # Custom hooks
│   │   ├── providers/     # Theme and UI providers
│   │   ├── styles/        # CSS tokens and utilities
│   │   └── types/         # TypeScript types
├── showcaser/             # Documentation site
│   ├── src/
│   │   ├── pages/         # Documentation pages
│   │   └── components/    # Showcaser components
```

## 📄 License

MIT License with Attribution Requirement - see [LICENSE](LICENSE) file.

**Attribution Required**: You must include visible credit to "Bluesky-30480" or link to this repository in any project using this library.

## 🙏 Third-Party Licenses

See [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES) for licenses of dependencies used in this project.
