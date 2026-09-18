/**
 * These types mirror the FastAPI/Pydantic schemas in
 * backend/app/schemas/prediction.py (PredictionRequest / PredictionResponse).
 * Keep in sync if the backend schema changes.
 */

export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished'

export type TransactionType = 'New Property' | 'Resale' | 'Other'

/** Shape sent to POST /predict */
export interface PredictionRequest {
  location: string
  carpet_area_sqft: number
  floor_num: number
  bathroom: number
  balcony: number
  car_parking: number
  furnishing: FurnishingStatus
  transaction: TransactionType
  /** Free text on the backend (e.g. "Ready to Move", "Under Construction") */
  status: string
}

/** Shape returned by POST /predict */
export interface PredictionResponse {
  /** Predicted price, in Lakhs (₹ Lac). e.g. 42.5 means ₹42.5 Lac */
  predicted_price: number
}

/** Normalized error shape used by the API client */
export interface ApiError {
  message: string
  status?: number
}

/** Client-side validation error keyed by form field */
export type FormErrors = Partial<Record<keyof PredictionRequest, string>>
