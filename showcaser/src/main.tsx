import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BlueskyUIProvider } from '@bluesky-ui/ui'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <BlueskyUIProvider defaultTheme="blue">
        <App />
      </BlueskyUIProvider>
    </BrowserRouter>
  </React.StrictMode>
)
