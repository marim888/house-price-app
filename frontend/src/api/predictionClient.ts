import type { ApiError, PredictionRequest, PredictionResponse } from '../types/prediction'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

/**
 * POST the form payload to the backend's /predict endpoint and return
 * the predicted price. Throws an ApiError (normalized message + status)
 * on any network failure, non-2xx response, or malformed payload.
 */
export async function getPrediction(payload: PredictionRequest): Promise<PredictionResponse> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    const error: ApiError = {
      message:
        'Could not reach the prediction server. Make sure the backend is running and reachable at ' +
        BASE_URL,
    }
    throw error
  }

  if (!response.ok) {
    let detail: string | undefined
    try {
      const body = await response.json()
      detail = body?.detail ?? body?.message
    } catch {
      // response body wasn't JSON; fall through to generic message
    }

    const error: ApiError = {
      message: detail ?? `Prediction request failed (HTTP ${response.status}).`,
      status: response.status,
    }
    throw error
  }

  try {
    const data = (await response.json()) as PredictionResponse
    if (typeof data.predicted_price !== 'number' || Number.isNaN(data.predicted_price)) {
      const error: ApiError = { message: 'The server returned an unexpected response.' }
      throw error
    }
    return data
  } catch (err) {
    if ((err as ApiError).message) throw err
    const error: ApiError = { message: 'Could not parse the server response.' }
    throw error
  }
}
