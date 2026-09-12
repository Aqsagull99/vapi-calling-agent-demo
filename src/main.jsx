import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LANG, IS_RTL } from './config.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './styles.css'

document.documentElement.lang = LANG
document.documentElement.dir = IS_RTL ? 'rtl' : 'ltr'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
