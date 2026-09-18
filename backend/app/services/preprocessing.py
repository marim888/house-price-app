import json
from functools import lru_cache
from pathlib import Path

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest


@lru_cache(maxsize=1)
def _known_locations() -> set[str]:
    """Loads locations.json once and caches it (avoids re-reading disk per request)."""
    path = Path(settings.LOCATIONS_PATH)
    if not path.exists():
        # Fail open rather than crash every request: everything just maps to "other".
        return set()
    with open(path) as f:
        return set(json.load(f))


def request_to_dataframe(payload: PredictionRequest) -> pd.DataFrame:
    """
    Turns a validated request into a single-row DataFrame whose column
    names/order match exactly what the pipeline's ColumnTransformer expects.
    The pipeline itself handles imputing/scaling/one-hot-encoding — we only
    need to replicate the same *column names* used in training.
    """
    known = _known_locations()
    location_grouped = payload.location if payload.location in known else "other"

    row = {
        "Carpet_Area_clean": payload.carpet_area_sqft,
        "clean_floor": payload.floor_num,
        "Bathrooms_clean": payload.bathroom,
        "Balcony_clean": payload.balcony,
        "clean_Car_Parking": payload.car_parking,
        "location_grouped": location_grouped,
        "Furnishing": payload.furnishing,
        "Transaction": payload.transaction,
        "Status": payload.status,
    }
    return pd.DataFrame([row])
