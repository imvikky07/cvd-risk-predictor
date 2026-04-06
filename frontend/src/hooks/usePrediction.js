import { useState, useCallback } from 'react'
import { predictCVD } from '../utils/api'

export const usePrediction = () => {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const predict = useCallback(async (formData) => {
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await predictCVD(formData)
      setResult(data)
      return data
    } catch (err) {
      setError(err.message || 'Prediction failed.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => { setResult(null); setError(null) }, [])

  return { result, loading, error, predict, reset }
}
