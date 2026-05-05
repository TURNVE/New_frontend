import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'aos/dist/aos.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Router from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)