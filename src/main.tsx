import "./tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        expand
        duration={4000}
      />
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
);
