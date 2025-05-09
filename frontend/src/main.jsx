import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/AppLayout/App.jsx'
import Layout from './Layout.jsx'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import SignUpPage from './components/Authentication/SignUpPage.jsx'
import SignInPage from './components/Authentication/SignInPage.jsx'
import { AuthProvider, useAuth } from './components/Context/AuthContext.jsx'

import React from 'react'
import ProfileSetting2 from './components/profilepage/ProfileSetting2.jsx'
import InactiveAccount from './components/AuthRestrict/InactiveAccount.jsx'
import OauthSuccess from './components/Authentication/OauthSuccess.jsx'

const Main = () => {
  const {isAuthenticated}=useAuth();
  const navigate=useNavigate();
  return (
    <Routes>
      <Route path="*" element={isAuthenticated?<Layout />:<SignInPage/>} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/profile2" element={<ProfileSetting2 />} />
      <Route path='/inactive' element={<InactiveAccount/>} />
      <Route path="/oauth-success" element={<OauthSuccess />} />
      {/* route path for forgot password */}
    </Routes>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>,
)
