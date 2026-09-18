from fastapi import APIRouter

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services import inference
from app.services.preprocessing import request_to_dataframe

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health() -> dict:
    return {"status": "ok"}


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> dict:
    df = request_to_dataframe(payload)
    predicted_price = inference.predict(df)
    return {"predicted_price": predicted_price}
