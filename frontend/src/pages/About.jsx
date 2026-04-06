import React from 'react'
import { Link } from 'react-router-dom'

const Card = ({ icon, title, children }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,.04)', marginBottom: 20 }}>
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ fontSize: 20, width: 44, height: 44, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{title}</h3>
        {children}
      </div>
    </div>
  </div>
)

const KV = ({ k, v, hi }) => (
  <div style={{ background: hi ? '#f0fdf4' : '#f9fafb', border: `1px solid ${hi ? '#bbf7d0' : '#e5e7eb'}`, borderRadius: 8, padding: '10px 14px' }}>
    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>{k}</div>
    <div style={{ fontSize: 14, fontWeight: 700, color: hi ? '#22c55e' : '#111827' }}>{v}</div>
  </div>
)

export default function About() {
  return (
    <div style={{ paddingTop: 66, minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>

        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 99, padding: '5px 14px', fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 16 }}>
            🔬 Methodology & Data
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: '#111827', letterSpacing: '-1px', marginBottom: 12 }}>About This Application</h1>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            A production-quality ML application using the real UCI Heart Disease dataset — four clinical cohorts combined into a single model pipeline.
          </p>
        </div>

        {/* Dataset */}
        <Card icon="🏥" title="Dataset: UCI Heart Disease (4 Centres)">
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 14 }}>
            This application uses all four processed UCI Heart Disease files — the most widely studied cardiovascular dataset in machine learning, published by Detrano et al. (1989).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
            {[['Cleveland Clinic, Ohio', '303 patients'], ['Hungarian Cardiology', '294 patients'], ['Zurich, Switzerland', '123 patients'], ['VA Long Beach, CA', '200 patients']].map(([c, n]) => (
              <div key={c} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 2 }}>{c}</div>
                <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>{n}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <KV k="Total (after dedup)" v="918 records" hi />
            <KV k="Positive (disease)" v="508 (55.3%)" />
            <KV k="Class imbalance" v="0.81 ratio — mild" />
          </div>
        </Card>

        {/* Preprocessing */}
        <Card icon="⚗️" title="Preprocessing & Feature Engineering">
          <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 14 }}>
            <strong style={{ color: '#374151' }}>Missing value handling:</strong> Median imputation preserves all 918 records despite up to 66% missing in <code>ca</code> and 53% in <code>thal</code>.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              ['ca (vessels)', '66% missing → median impute'],
              ['thal', '53% missing → median impute'],
              ['slope', '34% missing → median impute'],
              ['fbs / chol / etc.', '< 10% → median impute'],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '9px 13px' }}>
                <code style={{ fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>{k}</code>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 14, color: '#374151', fontWeight: 600, marginBottom: 10 }}>6 Engineered Features:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['age_group', 'Bucketed age: <40, 40–50, 50–60, 60–70, 70+'],
              ['hr_reserve', 'thalach ÷ (220 − age) — cardio fitness proxy'],
              ['bp_high', 'Binary flag: trestbps > 140 mmHg'],
              ['cp_asymptomatic', 'Binary flag: cp == 4 (highest risk type)'],
              ['age_sex', 'age × sex — older males highest risk'],
              ['oldpeak_severity', 'ST depression bucketed 0→1→2→3'],
            ].map(([feat, desc]) => (
              <div key={feat} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '9px 13px' }}>
                <code style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{feat}</code>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Model */}
        <Card icon="🤖" title="Voting Ensemble Model">
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 14 }}>
            Three models are trained with tuned hyperparameters and combined via soft-voting (probability averaging) weighted 2:2:1.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              ['Random Forest', 'Weight: 2', 'n=500, depth=8, log2 features, balanced'],
              ['Gradient Boosting', 'Weight: 2', 'lr=0.05, depth=3, subsample=0.8'],
              ['Logistic Regression', 'Weight: 1', 'C=0.05, LBFGS, balanced, scaled'],
            ].map(([name, w, cfg]) => (
              <div key={name} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', marginBottom: 6 }}>{w}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>{cfg}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Results */}
        <Card icon="📊" title="Model Evaluation (5-Fold Cross-Validation)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 16 }}>
            <KV k="ROC-AUC"    v="0.889"  hi />
            <KV k="F1-Score"   v="0.833"  hi />
            <KV k="Accuracy"   v="81.4%"  hi />
            <KV k="Precision"  v="83.0%" />
            <KV k="Recall"     v="83.7%" />
            <KV k="CV Folds"   v="5-Fold Stratified" />
          </div>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>
            <strong style={{ color: '#374151' }}>Why not 90% accuracy?</strong> The UCI Heart Disease benchmark has a theoretical ceiling of ~85–87% accuracy due to measurement noise, especially from the Switzerland and VA datasets (50–66% missing in key columns). Published papers from 1989 reported 77–81% accuracy with logistic regression. Our ensemble achieves a <strong>ROC-AUC of 0.889</strong>, which is the clinically appropriate metric for risk stratification tools.
          </div>
        </Card>

        {/* Top features */}
        <Card icon="🏆" title="Top Feature Importances (Random Forest)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['cp (chest pain type)',       13.9],
              ['cp_asymptomatic (engineered)', 12.6],
              ['chol (cholesterol)',          10.2],
              ['age_sex (engineered)',         9.6],
              ['oldpeak (ST depression)',      8.2],
              ['exang (exercise angina)',      8.0],
              ['thalach (max heart rate)',     7.0],
              ['hr_reserve (engineered)',      5.9],
              ['age',                          5.4],
              ['thal',                         3.9],
            ].map(([feat, pct]) => (
              <div key={feat} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ minWidth: 220, fontSize: 13, color: '#374151', fontWeight: 500 }}>
                  <code style={{ fontSize: 12 }}>{feat}</code>
                </div>
                <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct * 5}%`, background: 'linear-gradient(90deg,#86efac,#22c55e)', borderRadius: 99 }}/>
                </div>
                <div style={{ minWidth: 40, fontSize: 12, fontWeight: 700, color: '#22c55e', textAlign: 'right' }}>{pct}%</div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: '18px 22px', marginBottom: 28 }}>
          <div style={{ fontWeight: 700, color: '#92400e', fontSize: 14, marginBottom: 6 }}>⚠️ Medical Disclaimer</div>
          <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>
            This application is for <strong>educational and research purposes only</strong>. It is not a medical device and does not constitute a clinical diagnosis. Predictions are generated by a statistical model trained on historical data. Always consult a qualified cardiologist or physician for cardiovascular health decisions.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/predict" style={{ display: 'inline-block', padding: '13px 34px', borderRadius: 12, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 14px rgba(34,197,94,.3)', transition: 'all .25s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >Try the Assessment →</Link>
        </div>
      </div>
    </div>
  )
}
