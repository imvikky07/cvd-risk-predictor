import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar   from './components/Navbar'
import Footer   from './components/Footer'
import Home     from './pages/Home'
import Predict  from './pages/Predict'
import About    from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: 10, fontSize: 14 }, success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } } }} />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/about"   element={<About />} />
            <Route path="*"        element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
