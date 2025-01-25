import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/AppLayout/App.jsx'
import Layout from './Layout.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUpPage from './components/Authentication/SignUpPage.jsx'
import SignInPage from './components/Authentication/SignInPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Layout />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signIn" element={<SignInPage />} />
        {/* route path for forgot password */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
