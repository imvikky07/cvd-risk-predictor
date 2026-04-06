import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ paddingTop: 66, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🫀</div>
        <h1 style={{ fontSize: 72, fontWeight: 900, color: '#e5e7eb', letterSpacing: '-4px', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '14px 0 10px', letterSpacing: '-0.5px' }}>Page Not Found</h2>
        <p style={{ color: '#6b7280', marginBottom: 28, fontSize: 15 }}>This page doesn't exist or has moved.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/" style={{ padding: '11px 26px', borderRadius: 10, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 600, fontSize: 14 }}>Go Home</Link>
          <Link to="/predict" style={{ padding: '11px 26px', borderRadius: 10, background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, border: '2px solid #e5e7eb' }}>Risk Check</Link>
        </div>
      </div>
    </div>
  )
}
