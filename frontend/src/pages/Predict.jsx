import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { usePrediction } from '../hooks/usePrediction'
import ResultCard from '../components/ResultCard'

/* ── helpers ─────────────────────────────────────────── */
const inp = (err) => ({
  width: '100%', padding: '10px 13px', borderRadius: 10,
  border: `1.5px solid ${err ? '#fca5a5' : '#d1d5db'}`,
  fontSize: 14, color: '#111827',
  background: err ? '#fef2f2' : '#fff',
  transition: 'border-color .2s',
  appearance: 'none', WebkitAppearance: 'none',
})
const focusGreen  = e => { e.target.style.borderColor = '#22c55e'; e.target.style.outline = 'none' }
const blurDefault = (err) => e => { if (!err) e.target.style.borderColor = '#d1d5db' }

const Field = ({ label, hint, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
      {label}
      {hint && <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: 5 }}>({hint})</span>}
    </label>
    {children}
    {error && <span style={{ fontSize: 11, color: '#ef4444' }}>⚠ {error}</span>}
  </div>
)

const Toggle = ({ value, onChange, opts }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    {opts.map(o => (
      <button key={o.v} type="button" onClick={() => onChange(o.v)} style={{
        flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 13, fontWeight: 600,
        border: `2px solid ${value === o.v ? '#22c55e' : '#e5e7eb'}`,
        background: value === o.v ? '#f0fdf4' : '#fff',
        color: value === o.v ? '#16a34a' : '#6b7280',
        cursor: 'pointer', transition: 'all .2s',
      }}>{o.l}</button>
    ))}
  </div>
)

const SecHead = ({ label }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 0 6px', borderBottom: '1px solid #f0fdf4', marginBottom: 16 }}>{label}</div>
)

/* ── component ─────────────────────────────────────────── */
export default function Predict() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { sex: 1, fbs: 0, exang: 0 },
  })
  const { result, loading, error, predict, reset } = usePrediction()
  const [submitted, setSubmitted] = useState(false)

  const sex   = watch('sex')
  const fbs   = watch('fbs')
  const exang = watch('exang')

  const onSubmit = async (data) => {
    setSubmitted(true)
    try {
      await predict(data)
      setTimeout(() => document.getElementById('result-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    } catch (_) {}
  }

  const handleReset = () => { reset(); setSubmitted(false) }

  return (
    <div style={{ paddingTop: 66, minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 99, padding: '5px 14px', fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 14 }}>
            🩺 UCI Heart Disease Assessment
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#111827', letterSpacing: '-1px', marginBottom: 10 }}>Cardiovascular Risk Assessment</h1>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
            Fields match the UCI Heart Disease dataset exactly. Optional fields (slope, ca, thal) will be intelligently imputed if left blank.
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,.06)', padding: '36px', marginBottom: 24 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* ── Demographics ─────────────────────── */}
            <SecHead label="Demographics" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <Field label="Age" hint="18–100 yrs" error={errors.age?.message}>
                <input type="number" placeholder="e.g. 57" style={inp(errors.age)}
                  {...register('age', { required: 'Required', min: { value: 18, message: 'Min 18' }, max: { value: 100, message: 'Max 100' } })}
                  onFocus={focusGreen} onBlur={blurDefault(errors.age)} />
              </Field>
              <Field label="Sex">
                <Toggle value={sex} onChange={v => setValue('sex', v)} opts={[{ v: 1, l: '♂ Male' }, { v: 0, l: '♀ Female' }]} />
                <input type="hidden" {...register('sex')} />
              </Field>
            </div>

            {/* ── Symptoms ─────────────────────────── */}
            <SecHead label="Symptoms" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <Field label="Chest Pain Type" error={errors.cp?.message}>
                <select style={inp(errors.cp)} {...register('cp', { required: 'Required' })} onFocus={focusGreen} onBlur={blurDefault(errors.cp)}>
                  <option value="">Select type…</option>
                  <option value="1">1 — Typical Angina</option>
                  <option value="2">2 — Atypical Angina</option>
                  <option value="3">3 — Non-Anginal Pain</option>
                  <option value="4">4 — Asymptomatic ⚠️</option>
                </select>
              </Field>
              <Field label="Exercise-Induced Angina">
                <Toggle value={exang} onChange={v => setValue('exang', v)} opts={[{ v: 0, l: 'No' }, { v: 1, l: 'Yes ⚠️' }]} />
                <input type="hidden" {...register('exang')} />
              </Field>
            </div>

            {/* ── Vitals ───────────────────────────── */}
            <SecHead label="Vital Signs & Lab Results" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
              <Field label="Resting BP" hint="mmHg" error={errors.trestbps?.message}>
                <input type="number" placeholder="120" style={inp(errors.trestbps)}
                  {...register('trestbps', { required: 'Required', min: { value: 80, message: 'Min 80' }, max: { value: 220, message: 'Max 220' } })}
                  onFocus={focusGreen} onBlur={blurDefault(errors.trestbps)} />
              </Field>
              <Field label="Cholesterol" hint="mg/dl" error={errors.chol?.message}>
                <input type="number" placeholder="240" style={inp(errors.chol)}
                  {...register('chol', { required: 'Required', min: { value: 100, message: 'Min 100' }, max: { value: 600, message: 'Max 600' } })}
                  onFocus={focusGreen} onBlur={blurDefault(errors.chol)} />
              </Field>
              <Field label="Max Heart Rate" hint="bpm" error={errors.thalach?.message}>
                <input type="number" placeholder="150" style={inp(errors.thalach)}
                  {...register('thalach', { required: 'Required', min: { value: 60, message: 'Min 60' }, max: { value: 220, message: 'Max 220' } })}
                  onFocus={focusGreen} onBlur={blurDefault(errors.thalach)} />
              </Field>
              <Field label="Fasting Blood Sugar > 120" hint="mg/dl">
                <Toggle value={fbs} onChange={v => setValue('fbs', v)} opts={[{ v: 0, l: 'Normal' }, { v: 1, l: 'High' }]} />
                <input type="hidden" {...register('fbs')} />
              </Field>
              <Field label="ST Depression" hint="0.0–10.0" error={errors.oldpeak?.message}>
                <input type="number" step="0.1" placeholder="0.0" style={inp(errors.oldpeak)}
                  {...register('oldpeak', { required: 'Required', min: { value: 0, message: 'Min 0' }, max: { value: 10, message: 'Max 10' } })}
                  onFocus={focusGreen} onBlur={blurDefault(errors.oldpeak)} />
              </Field>
              <Field label="Resting ECG" error={errors.restecg?.message}>
                <select style={inp(errors.restecg)} {...register('restecg', { required: 'Required' })} onFocus={focusGreen} onBlur={blurDefault(errors.restecg)}>
                  <option value="">Select…</option>
                  <option value="0">0 — Normal</option>
                  <option value="1">1 — ST-T Abnormality</option>
                  <option value="2">2 — LV Hypertrophy</option>
                </select>
              </Field>
            </div>

            {/* ── Optional (imputed if blank) ────── */}
            <SecHead label="Optional — Imputed if Left Blank" />
            <div style={{
              background: '#f9fafb', border: '1px dashed #d1d5db',
              borderRadius: 12, padding: '18px', marginBottom: 28,
            }}>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>
                These fields have high missing rates in the source dataset. Leave blank to let the model impute the median. Filling them in will improve accuracy.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Field label="ST Slope">
                  <select style={inp(false)} {...register('slope')} onFocus={focusGreen} onBlur={blurDefault(false)}>
                    <option value="">Unknown</option>
                    <option value="1">1 — Upsloping</option>
                    <option value="2">2 — Flat</option>
                    <option value="3">3 — Downsloping</option>
                  </select>
                </Field>
                <Field label="Vessels Colored" hint="0–3">
                  <select style={inp(false)} {...register('ca')} onFocus={focusGreen} onBlur={blurDefault(false)}>
                    <option value="">Unknown</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </Field>
                <Field label="Thalassemia (Thal)">
                  <select style={inp(false)} {...register('thal')} onFocus={focusGreen} onBlur={blurDefault(false)}>
                    <option value="">Unknown</option>
                    <option value="3">3 — Normal</option>
                    <option value="6">6 — Fixed Defect</option>
                    <option value="7">7 — Reversable ⚠️</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '13px 16px', color: '#dc2626', fontSize: 14, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>⚠️</span> {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px',
              borderRadius: 12,
              background: loading ? '#d1fae5' : 'linear-gradient(135deg,#22c55e,#16a34a)',
              color: loading ? '#86efac' : '#fff',
              fontWeight: 700, fontSize: 16,
              boxShadow: loading ? 'none' : '0 4px 14px rgba(34,197,94,.35)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all .25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              {loading ? (
                <>
                  <span style={{ width: 18, height: 18, border: '2.5px solid #86efac', borderTopColor: '#16a34a', borderRadius: '50%', display: 'inline-block', animation: 'spin .9s linear infinite' }}/>
                  Running ensemble analysis…
                </>
              ) : '🔍 Analyse Cardiovascular Risk'}
            </button>
          </form>
        </div>

        {/* Disclaimer */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '13px 18px', fontSize: 12, color: '#92400e', display: 'flex', gap: 10, marginBottom: 28 }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <span><strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. It does not constitute medical advice. Always consult a qualified healthcare provider.</span>
        </div>

        {/* Result */}
        {submitted && result && (
          <div id="result-anchor">
            <ResultCard result={result} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}
