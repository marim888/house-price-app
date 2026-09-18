import logging
from pathlib import Path

import joblib
import pandas as pd

from app.core.config import settings

logger = logging.getLogger(__name__)

_model = None


def load_model() -> None:
    """Called once from the FastAPI lifespan on startup — never per-request."""
    global _model
    path = Path(settings.MODEL_PATH)
    if not path.exists():
        raise FileNotFoundError(
            f"Model file not found at {path}. Copy the .pkl exported from "
            f"the notebook into models/ (see MODEL_PATH in .env)."
        )
    _model = joblib.load(path)
    logger.info("Model loaded from %s", path)


def get_model():
    if _model is None:
        raise RuntimeError("Model is not loaded. Did the app startup lifespan run?")
    return _model


def predict(df: pd.DataFrame) -> float:
    model = get_model()
    prediction = model.predict(df)
    return float(prediction[0])
