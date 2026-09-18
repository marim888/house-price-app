import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPrediction } from '../api/predictionClient'
import PredictionForm from '../components/PredictionForm'
import type { ApiError, PredictionRequest } from '../types/prediction'

export default function HomePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  async function handleSubmit(payload: PredictionRequest) {
    setSubmitting(true)
    setApiError(null)

    try {
      const result = await getPrediction(payload)
      navigate('/result', { state: { request: payload, prediction: result } })
    } catch (err) {
      const error = err as ApiError
      setApiError(error.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page">
      <div className="card">
        <h1>Home Price Estimator</h1>
        <p className="subtitle">
          Enter the property details below to get an instant price estimate.
        </p>

        {apiError && (
          <div className="alert alert-error" role="alert">
            {apiError}
          </div>
        )}

        <PredictionForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </main>
  )
}
