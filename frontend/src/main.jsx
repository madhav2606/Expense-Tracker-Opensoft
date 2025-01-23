import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/AppLayout/App.jsx'
import Layout from './Layout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)
