import { useState } from 'react'
import type { FormEvent } from 'react'
import locations from '../data/locations.json'
import type {
  FormErrors,
  FurnishingStatus,
  PredictionRequest,
  TransactionType,
} from '../types/prediction'

const FURNISHING_OPTIONS: FurnishingStatus[] = ['Furnished', 'Semi-Furnished', 'Unfurnished']
const TRANSACTION_OPTIONS: TransactionType[] = ['New Property', 'Resale', 'Other']

// The backend's `status` field is a free string (not a strict enum) — these are
// the two values that turn up in the "Status" column of the dataset. If your
// export has other values, add them here or swap this for a free-text input.
const STATUS_OPTIONS: string[] = ['Ready to Move', 'Under Construction']

type FormState = {
  location: string
  furnishing: FurnishingStatus | ''
  transaction: TransactionType | ''
  status: string
  area: string // maps to carpet_area_sqft
  floor: string // maps to floor_num
  bathrooms: string // maps to bathroom
  balconies: string // maps to balcony
  carParking: string // maps to car_parking
}

const EMPTY_FORM: FormState = {
  location: '',
  furnishing: '',
  transaction: '',
  status: '',
  area: '',
  floor: '',
  bathrooms: '',
  balconies: '',
  carParking: '',
}

interface PredictionFormProps {
  onSubmit: (payload: PredictionRequest) => void
  submitting: boolean
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!form.location) errors.location = 'Please select a location.'
  if (!form.furnishing) errors.furnishing = 'Please select a furnishing status.'
  if (!form.transaction) errors.transaction = 'Please select a transaction type.'
  if (!form.status) errors.status = 'Please select a property status.'

  if (!form.area.trim()) {
    errors.carpet_area_sqft = 'Area is required.'
  } else if (!(Number(form.area) > 0)) {
    errors.carpet_area_sqft = 'Area must be a number greater than 0.'
  }

  if (!form.floor.trim()) {
    errors.floor_num = 'Floor is required.'
  } else if (!(Number(form.floor) >= -1)) {
    errors.floor_num = 'Floor must be -1 (basement) or higher.'
  }

  if (!form.bathrooms.trim()) {
    errors.bathroom = 'Number of bathrooms is required.'
  } else if (!(Number(form.bathrooms) > 0)) {
    errors.bathroom = 'Enter at least 1 bathroom.'
  }

  if (!form.balconies.trim()) {
    errors.balcony = 'Number of balconies is required.'
  } else if (!(Number(form.balconies) >= 0)) {
    errors.balcony = 'Balconies cannot be negative.'
  }

  if (!form.carParking.trim()) {
    errors.car_parking = 'Number of car parking spots is required.'
  } else if (!(Number(form.carParking) >= 0)) {
    errors.car_parking = 'Car parking cannot be negative.'
  }

  return errors
}

export default function PredictionForm({ onSubmit, submitting }: PredictionFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    onSubmit({
      location: form.location,
      furnishing: form.furnishing as FurnishingStatus,
      transaction: form.transaction as TransactionType,
      status: form.status,
      carpet_area_sqft: Number(form.area),
      floor_num: Number(form.floor),
      bathroom: Number(form.bathrooms),
      balcony: Number(form.balconies),
      car_parking: Number(form.carParking),
    })
  }

  return (
    <form className="prediction-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="location">Location</label>
        <select
          id="location"
          value={form.location}
          onChange={(e) => handleChange('location', e.target.value)}
          aria-invalid={Boolean(errors.location)}
          aria-describedby={errors.location ? 'location-error' : undefined}
        >
          <option value="">Select a location…</option>
          {(locations as string[]).map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {errors.location && (
          <p className="field-error" id="location-error">
            {errors.location}
          </p>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="furnishing">Furnishing</label>
          <select
            id="furnishing"
            value={form.furnishing}
            onChange={(e) => handleChange('furnishing', e.target.value as FurnishingStatus)}
            aria-invalid={Boolean(errors.furnishing)}
            aria-describedby={errors.furnishing ? 'furnishing-error' : undefined}
          >
            <option value="">Select…</option>
            {FURNISHING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.furnishing && (
            <p className="field-error" id="furnishing-error">
              {errors.furnishing}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="transaction">Transaction</label>
          <select
            id="transaction"
            value={form.transaction}
            onChange={(e) => handleChange('transaction', e.target.value as TransactionType)}
            aria-invalid={Boolean(errors.transaction)}
            aria-describedby={errors.transaction ? 'transaction-error' : undefined}
          >
            <option value="">Select…</option>
            {TRANSACTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.transaction && (
            <p className="field-error" id="transaction-error">
              {errors.transaction}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="status">Property status</label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => handleChange('status', e.target.value)}
          aria-invalid={Boolean(errors.status)}
          aria-describedby={errors.status ? 'status-error' : undefined}
        >
          <option value="">Select…</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="field-error" id="status-error">
            {errors.status}
          </p>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="area">Area (sqft)</label>
          <input
            id="area"
            type="number"
            min="1"
            step="any"
            inputMode="decimal"
            placeholder="e.g. 1200"
            value={form.area}
            onChange={(e) => handleChange('area', e.target.value)}
            aria-invalid={Boolean(errors.carpet_area_sqft)}
            aria-describedby={errors.carpet_area_sqft ? 'area-error' : undefined}
          />
          {errors.carpet_area_sqft && (
            <p className="field-error" id="area-error">
              {errors.carpet_area_sqft}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="floor">Floor</label>
          <input
            id="floor"
            type="number"
            min="-1"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 3 (-1 = basement, 0 = ground)"
            value={form.floor}
            onChange={(e) => handleChange('floor', e.target.value)}
            aria-invalid={Boolean(errors.floor_num)}
            aria-describedby={errors.floor_num ? 'floor-error' : undefined}
          />
          {errors.floor_num && (
            <p className="field-error" id="floor-error">
              {errors.floor_num}
            </p>
          )}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            id="bathrooms"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 2"
            value={form.bathrooms}
            onChange={(e) => handleChange('bathrooms', e.target.value)}
            aria-invalid={Boolean(errors.bathroom)}
            aria-describedby={errors.bathroom ? 'bathrooms-error' : undefined}
          />
          {errors.bathroom && (
            <p className="field-error" id="bathrooms-error">
              {errors.bathroom}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="balconies">Balconies</label>
          <input
            id="balconies"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 1"
            value={form.balconies}
            onChange={(e) => handleChange('balconies', e.target.value)}
            aria-invalid={Boolean(errors.balcony)}
            aria-describedby={errors.balcony ? 'balconies-error' : undefined}
          />
          {errors.balcony && (
            <p className="field-error" id="balconies-error">
              {errors.balcony}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="carParking">Car parking spots</label>
        <input
          id="carParking"
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          placeholder="e.g. 1"
          value={form.carParking}
          onChange={(e) => handleChange('carParking', e.target.value)}
          aria-invalid={Boolean(errors.car_parking)}
          aria-describedby={errors.car_parking ? 'car-parking-error' : undefined}
        />
        {errors.car_parking && (
          <p className="field-error" id="car-parking-error">
            {errors.car_parking}
          </p>
        )}
      </div>

      <button type="submit" className="submit-btn" disabled={submitting}>
        {submitting ? 'Estimating…' : 'Estimate price'}
      </button>
    </form>
  )
}
