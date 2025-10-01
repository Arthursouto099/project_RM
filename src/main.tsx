import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router'
import "./tailwind.css"
import { ThemeProvider } from "@/components/theme-provider"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
       <Router></Router>
    </ThemeProvider>
   
  </StrictMode>,
)
