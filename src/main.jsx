import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NonPrebuild from './NonPrebuild.jsx'
import Prebuild from './Prebuild.jsx'

const urlParams = new URLSearchParams(window.location.search);
const isPrebuild = urlParams.get("prebuild") ?? false;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPrebuild ? (
      <Prebuild />
    ) : (
      <NonPrebuild />
    )}
  </StrictMode>,
)
