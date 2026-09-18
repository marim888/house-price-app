import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { PredictionRequest, PredictionResponse } from '../types/prediction'

interface ResultLocationState {
  request: PredictionRequest
  prediction: PredictionResponse
}

/** Format a Lakh-denominated price like "₹ 42.5 Lac" or "₹ 1.35 Cr" for large values. */
function formatPrice(priceInLac: number): string {
  if (priceInLac >= 100) {
    const crore = priceInLac / 100
    return `₹ ${crore.toFixed(2)} Cr`
  }
  return `₹ ${priceInLac.toFixed(1)} Lac`
}

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as ResultLocationState | null

  if (!state) {
    return (
      <main className="page">
        <div className="card">
          <h1>No estimate to show</h1>
          <p className="subtitle">
            We couldn't find a prediction for this page. Please fill out the form again.
          </p>
          <Link className="submit-btn link-btn" to="/">
            Back to form
          </Link>
        </div>
      </main>
    )
  }

  const { request, prediction } = state

  return (
    <main className="page">
      <div className="card">
        <h1>Estimated price</h1>
        <p className="price">{formatPrice(prediction.predicted_price)}</p>

        <dl className="summary">
          <div>
            <dt>Location</dt>
            <dd>{request.location}</dd>
          </div>
          <div>
            <dt>Area</dt>
            <dd>{request.carpet_area_sqft} sqft</dd>
          </div>
          <div>
            <dt>Floor</dt>
            <dd>{request.floor_num}</dd>
          </div>
          <div>
            <dt>Bathrooms</dt>
            <dd>{request.bathroom}</dd>
          </div>
          <div>
            <dt>Balconies</dt>
            <dd>{request.balcony}</dd>
          </div>
          <div>
            <dt>Car parking</dt>
            <dd>{request.car_parking}</dd>
          </div>
          <div>
            <dt>Furnishing</dt>
            <dd>{request.furnishing}</dd>
          </div>
          <div>
            <dt>Transaction</dt>
            <dd>{request.transaction}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{request.status}</dd>
          </div>
        </dl>

        <button className="submit-btn" onClick={() => navigate('/')}>
          Estimate another property
        </button>
      </div>
    </main>
  )
}
