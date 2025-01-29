import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/AppLayout/App.jsx'
import Layout from './Layout.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUpPage from './components/Authentication/SignUpPage.jsx'
import SignInPage from './components/Authentication/SignInPage.jsx'
import { AuthProvider } from './components/Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>

        <Routes>
          {<Route path="*" element={<Layout />} />}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          {/* route path for forgot password */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>,
)
