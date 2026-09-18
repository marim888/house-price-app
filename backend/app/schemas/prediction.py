from typing import Literal

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """
    Mirrors the features the pipeline was actually trained on:
    numeric_features = ["Carpet_Area_clean", "clean_floor", "Bathrooms_clean",
                         "Balcony_clean", "clean_Car_Parking"]
    categorical_features = ["location_grouped", "Furnishing", "Transaction", "Status"]

    (This is NOT the generic schema shown in the guide — that one used
    ownership/facing, which your model was never trained on. Sending those
    fields would just be ignored/misaligned, so the schema here matches your
    notebook's real ColumnTransformer instead.)
    """

    location: str = Field(..., min_length=1, description="Raw location name; unknown values are grouped into 'other'")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet area in square feet, must be > 0")
    floor_num: int = Field(..., ge=-1, description="Floor number; use -1 for basement, 0 for ground")
    bathroom: int = Field(..., ge=0)
    balcony: int = Field(..., ge=0)
    car_parking: int = Field(..., ge=0)
    furnishing: Literal["Furnished", "Semi-Furnished", "Unfurnished"]
    transaction: Literal["New Property", "Resale", "Other"]
    status: str = Field(..., min_length=1, description='e.g. "Ready to Move" or "Under Construction"')


class PredictionResponse(BaseModel):
    predicted_price: float


class HealthResponse(BaseModel):
    status: str
