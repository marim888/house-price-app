from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Path to the pipeline (.pkl) exported from the notebook.
    # NOTE: your notebook currently saves "house_price_pipeline.pkl" (not
    # "house_price.pkl" as the guide's example uses) — keep this in sync
    # with whatever filename you actually copy into models/.
    MODEL_PATH: str = "models/house_price_pipeline.pkl"

    # Path to the locations.json exported from the notebook (list of the
    # top-50 locations kept during training; anything else maps to "other").
    LOCATIONS_PATH: str = "models/locations.json"

    # Frontend origin allowed to call this API.
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
