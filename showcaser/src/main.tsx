import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { BlueskyUIProvider } from '@bluesky-ui/ui'
import App from './App'
import './styles/index.css'

const showFatalError = (error: unknown) => {
  const root = document.getElementById('root')
  if (!root) return
  const message = error instanceof Error ? error.message : String(error)
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b1220;color:#e5e7eb;padding:24px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:720px;">
        <div style="font-size:20px;font-weight:700;margin-bottom:8px;">App failed to load</div>
        <div style="font-size:14px;opacity:0.9;white-space:pre-wrap;">${message}</div>
        <div style="font-size:12px;opacity:0.7;margin-top:12px;">Check the browser console for details.</div>
      </div>
    </div>
  `
}

window.addEventListener('error', (event) => {
  if (event.error) showFatalError(event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  showFatalError(event.reason)
})

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HashRouter>
        <BlueskyUIProvider defaultTheme="blue">
          <App />
        </BlueskyUIProvider>
      </HashRouter>
    </React.StrictMode>
  )
} catch (error) {
  showFatalError(error)
}
