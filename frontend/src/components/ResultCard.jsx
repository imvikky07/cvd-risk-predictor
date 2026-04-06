import React from 'react'
import { Link } from 'react-router-dom'

const RISK_THEME = {
  Low:    { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', bar: 'linear-gradient(90deg,#86efac,#22c55e)', icon: '🟢', badge: { bg: '#dcfce7', text: '#15803d' } },
  Medium: { bg: '#fefce8', border: '#fde68a', text: '#a16207', bar: 'linear-gradient(90deg,#fde047,#f59e0b)', icon: '🟡', badge: { bg: '#fef9c3', text: '#854d0e' } },
  High:   { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', bar: 'linear-gradient(90deg,#fca5a5,#ef4444)', icon: '🔴', badge: { bg: '#fee2e2', text: '#b91c1c' } },
}

const TIPS = {
  Low:    ['Keep up regular physical exercise', 'Continue balanced, heart-healthy diet', 'Annual cholesterol + BP screening', 'Avoid smoking and excess alcohol', 'Manage stress and sleep quality'],
  Medium: ['Consult your doctor within 4–8 weeks', 'Reduce saturated fat and sodium intake', 'Target 150 min/week moderate exercise', 'Monitor blood pressure at home', 'Quit smoking — risk halves within 1 year'],
  High:   ['Seek cardiology evaluation promptly', 'Request ECG and stress test referral', 'Strictly limit alcohol and smoking', 'Daily blood pressure monitoring', 'Discuss statin or aspirin therapy with doctor'],
}

const DonutGauge = ({ pct, level }) => {
  const theme  = RISK_THEME[level]
  const r      = 52
  const stroke = 10
  const norm   = r - stroke / 2
  const circ   = norm * 2 * Math.PI
  const offset = circ - (Math.min(pct, 100) / 100) * circ
  const color  = level === 'Low' ? '#22c55e' : level === 'Medium' ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r*2} ${r*2}`}>
        <circle cx={r} cy={r} r={norm} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={r} cy={r} r={norm} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${r} ${r})`}
          style={{ transition: 'stroke-dashoffset 1.4s ease-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 19, fontWeight: 900, color, letterSpacing: '-1px' }}>{pct.toFixed(1)}%</div>
        <div style={{ fontSize: 9, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Risk</div>
      </div>
    </div>
  )
}

const DataTag = ({ label, value, warn }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: 2,
    background: warn ? '#fef2f2' : '#f9fafb',
    border: `1px solid ${warn ? '#fecaca' : '#e5e7eb'}`,
    borderRadius: 10, padding: '10px 14px',
  }}>
    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 700, color: warn ? '#dc2626' : '#111827' }}>{value}</span>
  </div>
)

const CP_LABELS = { 1: 'Typical Angina', 2: 'Atypical Angina', 3: 'Non-Anginal', 4: 'Asymptomatic' }
const RESTECG_LABELS = { 0: 'Normal', 1: 'ST-T Abnormal', 2: 'LV Hypertrophy' }
const THAL_LABELS = { 3: 'Normal', 6: 'Fixed Defect', 7: 'Reversable Defect' }
const SLOPE_LABELS = { 1: 'Upsloping', 2: 'Flat', 3: 'Downsloping' }

export default function ResultCard({ result, onReset }) {
  const theme = RISK_THEME[result.risk_level]
  const pct   = result.risk_percentage
  const s     = result.input_summary

  return (
    <div className="fade-up">
      {/* ── Main banner ───────────────────────────── */}
      <div style={{
        background: `linear-gradient(160deg,${theme.bg},#fff)`,
        border: `2px solid ${theme.border}`,
        borderRadius: 20, padding: '32px',
        boxShadow: `0 8px 32px ${result.risk_level === 'High' ? 'rgba(239,68,68,.08)' : result.risk_level === 'Medium' ? 'rgba(245,158,11,.08)' : 'rgba(34,197,94,.08)'}`,
        marginBottom: 20,
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.text, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
              {theme.icon} Assessment Complete
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: theme.text, letterSpacing: '-1px', marginBottom: 10 }}>
              {result.risk_label}
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: theme.badge.bg, color: theme.badge.text, border: `1px solid ${theme.border}` }}>
                {result.risk_level} Risk
              </span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Voting Ensemble · UCI Data</span>
            </div>
          </div>
          <DonutGauge pct={pct} level={result.risk_level} />
        </div>

        {/* Probability bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Disease Probability</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: theme.text }}>{pct.toFixed(2)}%</span>
          </div>
          <div style={{ height: 12, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: theme.bar, borderRadius: 99,
              transition: 'width 1.4s ease-out',
            }}/>
          </div>
          {/* Risk zones legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '35fr 30fr 35fr', marginTop: 4, gap: 2 }}>
            {[['0–35%','Low','#22c55e'], ['35–65%','Medium','#f59e0b'], ['65–100%','High','#ef4444']].map(([range, label, color]) => (
              <div key={label} style={{ textAlign: 'center', fontSize: 10, color }}>
                <div style={{ height: 3, background: color, borderRadius: 99, marginBottom: 3 }}/>
                {label} ({range})
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        <div style={{
          background: '#fff', border: `1px solid ${theme.border}`,
          borderRadius: 12, padding: '14px 18px',
          fontSize: 14, color: '#374151', lineHeight: 1.7,
        }}>
          {result.message}
        </div>
      </div>

      {/* ── Input summary + Tips ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Input data */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>
            📋 Your Clinical Data
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <DataTag label="Age"         value={`${s.age} yrs`} />
            <DataTag label="Sex"         value={s.sex ? '♂ Male' : '♀ Female'} />
            <DataTag label="Chest Pain"  value={CP_LABELS[s.cp] || s.cp} warn={s.cp === 4} />
            <DataTag label="Blood Press" value={`${s.trestbps} mmHg`} warn={s.trestbps > 140} />
            <DataTag label="Cholesterol" value={`${s.chol} mg/dl`} warn={s.chol > 240} />
            <DataTag label="Fasting BS"  value={s.fbs ? 'High (>120)' : 'Normal'} warn={s.fbs === 1} />
            <DataTag label="Rest ECG"    value={RESTECG_LABELS[s.restecg] || s.restecg} />
            <DataTag label="Max HR"      value={`${s.thalach} bpm`} warn={s.thalach < 100} />
            <DataTag label="Exer. Angina" value={s.exang ? 'Yes' : 'No'} warn={s.exang === 1} />
            <DataTag label="ST Depress." value={s.oldpeak.toFixed(1)} warn={s.oldpeak > 2} />
            {s.slope != null && <DataTag label="ST Slope" value={SLOPE_LABELS[s.slope] || s.slope} />}
            {s.ca    != null && <DataTag label="Vessels" value={`${s.ca} colored`} warn={s.ca > 0} />}
            {s.thal  != null && <DataTag label="Thal" value={THAL_LABELS[s.thal] || s.thal} warn={s.thal === 7} />}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>
            {result.risk_level === 'Low' ? '✅ Keep It Up' : result.risk_level === 'Medium' ? '⚠️ Action Plan' : '🚨 Urgent Steps'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TIPS[result.risk_level].map((tip, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '10px 12px',
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
              }}>
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1, color: theme.text }}>
                  {result.risk_level === 'Low' ? '✓' : result.risk_level === 'Medium' ? '→' : '!'}
                </span>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────── */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <button onClick={onReset} style={{
          flex: 1, padding: '14px',
          borderRadius: 12,
          background: 'linear-gradient(135deg,#22c55e,#16a34a)',
          color: '#fff', fontWeight: 700, fontSize: 15,
          boxShadow: '0 4px 14px rgba(34,197,94,.3)',
          transition: 'all .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >↩ New Assessment</button>
        <Link to="/" style={{
          flex: 1, padding: '14px', borderRadius: 12,
          background: '#fff', color: '#374151', fontWeight: 600, fontSize: 15,
          border: '2px solid #e5e7eb', textAlign: 'center',
          transition: 'all .2s', display: 'block',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#86efac'; e.currentTarget.style.color = '#16a34a' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151' }}
        >← Back to Home</Link>
      </div>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#9ca3af' }}>
        ⚕️ For educational purposes only. Not a medical diagnosis. Always consult a qualified physician.
      </p>
    </div>
  )
}
