# Home Price Estimator — Frontend

React + TypeScript + Vite frontend for the price-prediction backend.

## Structure

```
frontend/src/
├── api/predictionClient.ts   # fetch wrapper, base URL from VITE_API_BASE_URL
├── components/PredictionForm.tsx
├── pages/HomePage.tsx | ResultPage.tsx | NotFoundPage.tsx
├── types/prediction.ts       # TS types mirroring the backend schema
├── data/locations.json       # dropdown options — replace with your exported file
└── App.tsx                   # routes: / , /result , * (404)
```

## Setup

```bash
npm install
cp .env.example .env   # already present; edit VITE_API_BASE_URL if your backend isn't on :8000
npm run dev
```

The app runs at `http://localhost:5173`.

## Backend contract this frontend expects

Matches `backend/app/schemas/prediction.py` exactly.

`POST {VITE_API_BASE_URL}/predict`

Request body:
```json
{
  "location": "Whitefield",
  "carpet_area_sqft": 1200,
  "floor_num": 3,
  "bathroom": 2,
  "balcony": 1,
  "car_parking": 1,
  "furnishing": "Semi-Furnished",
  "transaction": "Resale",
  "status": "Ready to Move"
}
```

Success response (`200`):
```json
{ "predicted_price": 42.5 }
```
`predicted_price` is interpreted as **Lakhs (₹)**. Values `>= 100` are shown as Crore (e.g. `135` → `₹ 1.35 Cr`), otherwise as Lac (e.g. `42.5` → `₹ 42.5 Lac`).

Error responses should return a JSON body with a `detail` or `message` string (FastAPI's default `{"detail": "..."}` shape works out of the box); the client falls back to a generic message otherwise.

**Note on `status`:** the backend treats it as a free string (not a strict enum), so the dropdown in `PredictionForm.tsx` ships with `["Ready to Move", "Under Construction"]` — the two values called out in the dataset guide. If your actual exported data has other status values, check them (`df["Status"].unique()` in the notebook) and update `STATUS_OPTIONS` in that file.

If your backend schema changes again, update:
- `src/types/prediction.ts` — the `PredictionRequest`/`PredictionResponse` types
- `src/components/PredictionForm.tsx` — the form fields/validation/`STATUS_OPTIONS`
- `src/pages/ResultPage.tsx` — `formatPrice()` and the summary fields
- `src/data/locations.json` — swap in your real exported location list

## Verifying the full flow

1. Start the backend: `uvicorn main:app --reload --port 8000` (or however Phase 2/3 runs it) — confirm `http://localhost:8000/predict` accepts POSTs matching the schema above.
2. In this folder: `npm install && npm run dev` — confirm it's on `http://localhost:5173`.
3. Open the app, fill in the form (location, furnishing, transaction, area, floor, bathrooms, balconies) and submit.
4. You should see a brief "Estimating…" loading state, then land on `/result` with the price formatted as `₹ 42.5 Lac` (or `₹ x.xx Cr` for larger values).
5. To check the error path: stop the backend and submit again — you should see a red inline error on the home page instead of a crash.
6. Visit any unknown path (e.g. `/foo`) to confirm the 404 page renders.

> Note: I built and wired up all the code above, but couldn't run `npm install` / `npm run dev` or hit a live backend from this environment (no network access here), so step 1–6 above still need to be run on your machine to confirm end-to-end. Everything type-checks against the schema documented here — if your real backend's shape differs, adjust the four files listed above and re-run the checklist.
