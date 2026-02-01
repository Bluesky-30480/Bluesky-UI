import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BlueskyUIProvider } from '@bluesky-ui/ui'
import App from './App'
import './styles/index.css'

// Use basename for GitHub Pages deployment (strip trailing slash)
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename || '/'}>
      <BlueskyUIProvider defaultTheme="blue">
        <App />
      </BlueskyUIProvider>
    </BrowserRouter>
  </React.StrictMode>
)
