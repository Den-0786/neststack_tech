import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import { MessagesProvider } from './context/MessagesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortfolioProvider>
      <MessagesProvider>
        <App />
      </MessagesProvider>
    </PortfolioProvider>
  </StrictMode>,
)
