import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Gate } from './Gate.tsx'
import { Import } from './Import.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gate>
      {location.hash === '#import' ? <Import /> : <App />}
    </Gate>
  </StrictMode>,
)
