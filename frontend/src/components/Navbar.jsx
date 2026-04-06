import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="18" fill="#22c55e"/>
    <path d="M50 76C50 76 18 56 18 34C18 20 28 13 39 17C43 18 47 22 50 27C53 22 57 18 61 17C72 13 82 20 82 34C82 56 50 76 50 76Z" fill="white"/>
    <polyline points="22,50 33,39 42,54 53,26 63,46 72,38 81,46" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = [{ to: '/', label: 'Home' }, { to: '/predict', label: 'Risk Check' }, { to: '/about', label: 'About' }]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(14px)',
      borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
      boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
      transition: 'all .3s ease',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', letterSpacing: '-0.3px' }}>
              CVD<span style={{ color: '#22c55e' }}>Risk</span>
            </div>
            <div style={{ fontSize: 9, color: '#9ca3af', letterSpacing: '1px', marginTop: -2 }}>UCI · ENSEMBLE MODEL</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {links.map(({ to, label }) => {
            const active = pathname === to
            return (
              <Link key={to} to={to} style={{
                padding: '7px 15px', borderRadius: 8, fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? '#16a34a' : '#374151',
                background: active ? '#f0fdf4' : 'transparent',
                transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f9fafb' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >{label}</Link>
            )
          })}
          <Link to="/predict" style={{
            marginLeft: 10, padding: '9px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            boxShadow: '0 2px 10px rgba(34,197,94,.35)',
            transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 16px rgba(34,197,94,.45)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(34,197,94,.35)' }}
          >Check Risk →</Link>
        </div>
      </div>
    </nav>
  )
}
