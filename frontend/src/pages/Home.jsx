import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkHealth } from '../utils/api'

const Stat = ({ v, l, i }) => (
  <div style={{
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
    padding: '26px 28px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,.04)', transition: 'all .3s',
  }}
  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#bbf7d0'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(34,197,94,.12)' }}
  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.04)' }}
  >
    <div style={{ fontSize: 28, marginBottom: 6 }}>{i}</div>
    <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e', letterSpacing: '-1px' }}>{v}</div>
    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{l}</div>
  </div>
)

const FeatCard = ({ icon, title, desc }) => (
  <div style={{
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '26px',
    boxShadow: '0 2px 8px rgba(0,0,0,.04)', transition: 'all .3s',
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = '#86efac'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,197,94,.1)' }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.04)' }}
  >
    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{icon}</div>
    <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{desc}</div>
  </div>
)

export default function Home() {
  const [health, setHealth] = useState(null)

  useEffect(() => { checkHealth().then(setHealth).catch(() => {}) }, [])

  return (
    <div style={{ paddingTop: 66 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg,#f0fdf4 0%,#fff 55%,#f0fdf4 100%)', padding: '80px 24px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
        {health?.model_loaded && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 99, padding: '5px 14px', fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 26 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 2px rgba(34,197,94,.3)' }}/>
            Model Online · Ensemble Ready
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(34px,5.5vw,62px)', fontWeight: 900, color: '#111827', lineHeight: 1.1, letterSpacing: '-2px', maxWidth: 680, margin: '0 auto 22px' }}>
          AI-Powered<br /><span style={{ color: '#22c55e' }}>Heart Disease</span><br />Risk Detection
        </h1>
        <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 500, margin: '0 auto 38px', lineHeight: 1.7 }}>
          Enter your clinical data and get an instant cardiovascular disease risk score — powered by a Voting Ensemble trained on the real UCI Heart Disease dataset.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/predict" style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 700, fontSize: 16, boxShadow: '0 4px 16px rgba(34,197,94,.35)', transition: 'all .25s', display: 'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,197,94,.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,.35)' }}
          >Start Assessment →</Link>
          <Link to="/about" style={{ padding: '14px 32px', borderRadius: 12, background: '#fff', color: '#374151', fontWeight: 600, fontSize: 16, border: '2px solid #e5e7eb', transition: 'all .25s', display: 'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#86efac'; e.currentTarget.style.color = '#16a34a' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151' }}
          >Learn the Methods</Link>
        </div>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 24 }}>⚕️ Educational use only — not a substitute for medical diagnosis.</p>
      </section>

      {/* Stats */}
      <section style={{ padding: '56px 24px 0', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 18 }}>
          <Stat v="0.889" l="ROC-AUC Score" i="🎯" />
          <Stat v="83.3%" l="F1-Score" i="📊" />
          <Stat v="918"   l="UCI Patients" i="🏥" />
          <Stat v="3+1"   l="Models Ensembled" i="🤖" />
          <Stat v="13+6"  l="Features Used" i="🔬" />
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '56px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111827', textAlign: 'center', letterSpacing: '-0.5px', marginBottom: 8 }}>
          Production-Grade ML Pipeline
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 40, fontSize: 15 }}>
          Every stage engineered for real-world clinical reliability
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 18 }}>
          <FeatCard icon="🏥" title="Real UCI Clinical Data" desc="4-hospital dataset: Cleveland, Hungarian, Switzerland, VA — 918 de-duplicated records with multi-centre validation." />
          <FeatCard icon="🧠" title="Voting Ensemble" desc="Random Forest + Gradient Boosting + Logistic Regression combined with soft-voting for higher, more calibrated predictions." />
          <FeatCard icon="⚗️" title="Feature Engineering" desc="6 derived features: age-sex interaction, heart rate reserve, ST severity, BP flag, age group, and asymptomatic CP flag." />
          <FeatCard icon="🔧" title="Smart Imputation" desc="Median imputation handles up to 66% missing values in ca/thal columns — preserving all 918 records." />
          <FeatCard icon="⚖️" title="Class Balancing" desc="Natural mild imbalance (0.81 ratio) handled via class_weight='balanced' — SMOTE not required." />
          <FeatCard icon="🚀" title="FastAPI + React" desc="Sub-second predictions via FastAPI backend, React 18 frontend, Docker Compose deploy, free hosting compatible." />
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '0 24px 56px', maxWidth: 740, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111827', textAlign: 'center', letterSpacing: '-0.5px', marginBottom: 36 }}>How It Works</h2>
        {[
          ['Enter Clinical Values', 'Provide up to 13 clinical measurements from your medical record, including ECG results, cholesterol, blood pressure, and chest pain type.'],
          ['Ensemble Analysis', 'Three ML models analyze your data in parallel. Their probability outputs are averaged (soft-vote, weighted 2-2-1) for a robust prediction.'],
          ['Risk Stratification', 'Receive a precise probability score bucketed into Low (<35%), Medium (35–65%), or High (>65%) risk with personalized clinical guidance.'],
        ].map(([title, desc], i) => (
          <div key={i} style={{ display: 'flex', gap: 18, marginBottom: 18, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '22px', boxShadow: '0 2px 6px rgba(0,0,0,.03)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 540, margin: '0 auto', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #bbf7d0', borderRadius: 24, padding: '48px 36px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>❤️</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: 12 }}>Ready to check your heart health?</h2>
          <p style={{ color: '#6b7280', marginBottom: 28, lineHeight: 1.6, fontSize: 15 }}>Takes under 2 minutes. Get your personalised CVD risk score now.</p>
          <Link to="/predict" style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 12, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 700, fontSize: 16, boxShadow: '0 4px 16px rgba(34,197,94,.3)', transition: 'all .25s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >Get My Risk Score →</Link>
        </div>
      </section>
    </div>
  )
}
