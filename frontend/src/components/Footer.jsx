import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '40px 24px 24px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 28 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#111827', marginBottom: 8 }}>CVD<span style={{ color: '#22c55e' }}>Risk</span></div>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>
              Heart disease risk prediction using a Voting Ensemble (Random Forest + Gradient Boosting + Logistic Regression) trained on the UCI Heart Disease dataset — 4 hospital cohorts, 918 patients.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>Navigation</div>
              {[['/', 'Home'], ['/predict', 'Risk Assessment'], ['/about', 'About & Methods']].map(([to, l]) => (
                <div key={to} style={{ marginBottom: 8 }}>
                  <Link to={to} style={{ fontSize: 13, color: '#6b7280' }}
                    onMouseEnter={e => e.target.style.color = '#22c55e'}
                    onMouseLeave={e => e.target.style.color = '#6b7280'}
                  >{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>Model Stats</div>
              {[['ROC-AUC', '0.889'], ['F1-Score', '0.833'], ['Accuracy', '81.4%'], ['Training Set', '918 patients']].map(([k, v]) => (
                <div key={k} style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
                  <span style={{ color: '#374151', fontWeight: 600 }}>{k}: </span>{v}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 18, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>© 2025 CVDRisk. Educational use only — not a substitute for medical advice.</span>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>UCI Heart Disease Dataset · Detrano et al. (1989)</span>
        </div>
      </div>
    </footer>
  )
}
