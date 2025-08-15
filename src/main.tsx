import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './app'
import "./tailwind.css"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router></Router>
  </StrictMode>,
)
