import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react"
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

const PUBLISHABLE_KEY = "pk_test_aW52aXRpbmctbWFuLTIzLmNsZXJrLmFjY291bnRzLmRldiQ";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);