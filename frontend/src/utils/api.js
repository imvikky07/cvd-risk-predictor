import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE, timeout: 15000 })

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response) {
      const msg = err.response.data?.detail || `Server error (${err.response.status})`
      return Promise.reject(new Error(msg))
    }
    if (err.code === 'ECONNABORTED')
      return Promise.reject(new Error('Request timed out. Please try again.'))
    return Promise.reject(new Error('Cannot reach the server. Is the backend running?'))
  }
)

export const predictCVD = async (data) => {
  const payload = {
    age:      Number(data.age),
    sex:      Number(data.sex),
    cp:       Number(data.cp),
    trestbps: Number(data.trestbps),
    chol:     Number(data.chol),
    fbs:      Number(data.fbs),
    restecg:  Number(data.restecg),
    thalach:  Number(data.thalach),
    exang:    Number(data.exang),
    oldpeak:  parseFloat(data.oldpeak),
    slope:    data.slope  ? Number(data.slope)  : null,
    ca:       data.ca     !== '' ? Number(data.ca)   : null,
    thal:     data.thal   ? Number(data.thal)   : null,
  }
  const res = await api.post('/api/predict', payload)
  return res.data
}

export const checkHealth = async () => (await api.get('/health')).data

export default api
