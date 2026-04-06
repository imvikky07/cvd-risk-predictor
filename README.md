# 🫀 CVD Risk Detection v2 — Voting Ensemble on UCI Heart Disease Dataset

A production-ready, end-to-end cardiovascular disease risk prediction application.
Built with **FastAPI + React (Vite)** + a **Voting Ensemble** (Random Forest + Gradient Boosting + Logistic Regression) trained on the **UCI Heart Disease dataset** from 4 clinical centres.

---

## 📊 Model Performance (5-Fold Stratified CV)

| Metric      | Score  |
|-------------|--------|
| ROC-AUC     | **0.889** |
| F1-Score    | **0.833** |
| Accuracy    | **81.4%** |
| Precision   | 83.0%  |
| Recall      | 83.7%  |

> **Why not 90% accuracy?** The UCI benchmark has a theoretical ceiling of ~85–87% due to noise and 50–66% missing values in the Switzerland/VA cohorts. Published papers (Detrano 1989) reported 77–81% with logistic regression. ROC-AUC 0.889 is the correct primary metric for clinical risk tools.

---

## 🏗 Architecture

```
React (Vite)  →  POST /api/predict  →  FastAPI
                                          │
                                    Feature Engineering
                                    (6 derived features)
                                          │
                                    Median Imputer
                                          │
                                    Voting Ensemble
                                    ├── Random Forest  (weight 2)
                                    ├── Gradient Boost (weight 2)
                                    └── Logistic Reg.  (weight 1)
                                          │
                                    probability + risk_level
```

---

## 🚀 Quick Start — Local (Windows / Mac / Linux)

### Prerequisites
- Python 3.10 or 3.11 (recommended)
- Node.js 18+

### 1 — Backend

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Mac / Linux
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API: http://localhost:8000  
Swagger: http://localhost:8000/docs

### 2 — Frontend

```bash
# New terminal
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

---

## 🐳 Docker (one command)

```bash
# From project root
docker compose up --build

# Backend:  http://localhost:8000
# Frontend: http://localhost:3000
# Docs:     http://localhost:8000/docs
```

---

## ☁️ Free Deployment

### Backend → Render.com (free tier)
1. Push `backend/` to a GitHub repo
2. New Web Service → connect repo
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment variables:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

### Frontend → Vercel (free tier)
1. Push `frontend/` to GitHub
2. Import project on vercel.com
3. Framework: Vite
4. Environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. Deploy

### Backend → Railway.app (free tier)
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
```

---

## 📡 API Reference

### GET /health
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_type": "Voting Ensemble (RF + GradientBoosting + LR)",
  "version": "2.0.0",
  "service": "CVD Risk Detection API"
}
```

### POST /api/predict

**Required fields:**

| Field    | Type  | Range     | Description                          |
|----------|-------|-----------|--------------------------------------|
| age      | int   | 18–100    | Age in years                         |
| sex      | int   | 0 or 1    | 1=Male, 0=Female                     |
| cp       | int   | 1–4       | Chest pain type (4=asymptomatic=worst)|
| trestbps | float | 80–220    | Resting blood pressure (mmHg)        |
| chol     | float | 100–600   | Serum cholesterol (mg/dl)            |
| fbs      | int   | 0 or 1    | Fasting blood sugar > 120 mg/dl      |
| restecg  | int   | 0–2       | Resting ECG results                  |
| thalach  | float | 60–220    | Maximum heart rate achieved          |
| exang    | int   | 0 or 1    | Exercise-induced angina              |
| oldpeak  | float | 0.0–10.0  | ST depression induced by exercise    |

**Optional (median-imputed if omitted):**

| Field | Type  | Description                               |
|-------|-------|-------------------------------------------|
| slope | int   | 1=Upsloping, 2=Flat, 3=Downsloping        |
| ca    | int   | Major vessels colored (0–3)               |
| thal  | int   | 3=Normal, 6=Fixed defect, 7=Reversable    |

**Response:**
```json
{
  "prediction": 1,
  "probability": 0.7821,
  "risk_percentage": 78.21,
  "risk_level": "High",
  "risk_label": "Heart Disease Detected",
  "message": "Your results indicate a high probability...",
  "input_summary": { ...echoed input... }
}
```

**Risk levels:**
- `Low`    — probability < 35%
- `Medium` — probability 35–65%
- `High`   — probability > 65%

---

## 🧪 Example Inputs & Expected Outputs

### High Risk — Older male, asymptomatic CP, abnormal ECG
```json
{
  "age": 63, "sex": 1, "cp": 4, "trestbps": 145,
  "chol": 233, "fbs": 1, "restecg": 2, "thalach": 150,
  "exang": 0, "oldpeak": 2.3, "slope": 3, "ca": 0, "thal": 6
}
```
Expected: `prediction=1, risk_level="High", probability ~0.75–0.90`

### Low Risk — Younger female, typical angina, normal values
```json
{
  "age": 41, "sex": 0, "cp": 2, "trestbps": 130,
  "chol": 204, "fbs": 0, "restecg": 0, "thalach": 172,
  "exang": 0, "oldpeak": 1.4, "slope": 1, "ca": 0, "thal": 3
}
```
Expected: `prediction=0, risk_level="Low", probability ~0.10–0.30`

### Medium Risk — Middle-aged male, borderline values
```json
{
  "age": 52, "sex": 1, "cp": 3, "trestbps": 138,
  "chol": 223, "fbs": 0, "restecg": 1, "thalach": 169,
  "exang": 0, "oldpeak": 0.0
}
```
Expected: `prediction=0 or 1, risk_level="Medium", probability ~0.40–0.60`

---

## 🔁 Retrain the Model

If you want to retrain from the raw UCI files:

1. Place the 4 raw files in `backend/raw_data/`:
   - `processed.cleveland.data`
   - `processed.hungarian.data`
   - `processed.switzerland.data`
   - `processed.va.data`

2. Run:
```bash
cd backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
python scripts/train_model.py
```

New artifacts will be saved to `backend/app/ml/`.

---

## 📁 Project Structure

```
cvd-risk-v2/
├── backend/
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── prediction.py     # POST /api/predict
│   │   │   └── health.py         # GET /health
│   │   ├── core/
│   │   │   └── config.py         # Settings + env vars
│   │   ├── ml/
│   │   │   ├── model_loader.py   # Feature engineering + inference
│   │   │   ├── model.pkl         # Trained Voting Ensemble
│   │   │   ├── imputer.pkl       # Fitted SimpleImputer
│   │   │   └── feature_cols.pkl  # Ordered feature list
│   │   └── schemas/
│   │       └── prediction.py     # Pydantic v2 request/response
│   ├── scripts/
│   │   └── train_model.py        # Full retrain pipeline
│   ├── heart_disease_processed.csv  # Cleaned dataset (918 rows)
│   ├── main.py                   # FastAPI app entry point
│   ├── requirements.txt          # Python deps (version ranges)
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ResultCard.jsx    # Risk display with gauge + tips
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Predict.jsx       # Full UCI-aligned clinical form
│   │   │   ├── About.jsx         # Methodology + feature importance
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   └── usePrediction.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/favicon.svg
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md
```

---

## 🔧 Connecting Frontend to a Deployed Backend

Edit `frontend/.env` before running `npm run dev`:
```env
VITE_API_URL=https://your-backend.onrender.com
```

For Docker builds, pass as build arg:
```bash
docker build --build-arg VITE_API_URL=https://your-api.com -t cvd-frontend .
```

For Vercel, set `VITE_API_URL` in Project → Settings → Environment Variables.

---

## ⚕️ Medical Disclaimer

This application is for **educational and research purposes only**.
It is not a medical device and does not constitute a clinical diagnosis.
Always consult a qualified cardiologist or physician.

---

*UCI Heart Disease Dataset — Detrano R. et al., American Journal of Cardiology, 1989*
*Built with FastAPI · React · scikit-learn · Docker*
