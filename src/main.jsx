// Tokens générés depuis tokens/ : importés en premier, avant toutes les feuilles qui les lisent
import './styles/tokens.generes.css'
import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ParcoursProvider } from './pages/parcours/ParcoursContext'
import './index.css'

// Extrait du Design System : route /design-system, sans connexion et hors navigation
const DesignSystem = lazy(() => import('./pages/DesignSystem.jsx'))
const estDesignSystem = window.location.pathname.replace(/\/+$/, '') === '/design-system'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {estDesignSystem ? (
      <Suspense fallback={null}>
        <DesignSystem />
      </Suspense>
    ) : (
      <ParcoursProvider>
        <App />
      </ParcoursProvider>
    )}
  </React.StrictMode>,
)
