import "./tailwind.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router'
import { ThemeProvider } from "@/components/theme-provider"
import { ToastContainer } from 'react-toastify'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router></Router>
    </ThemeProvider>

  </StrictMode>,
)
