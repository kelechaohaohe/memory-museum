import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/memory-museum">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/memory/:memoryId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
