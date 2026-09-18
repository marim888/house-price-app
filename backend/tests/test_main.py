from fastapi.testclient import TestClient
from app.main import app

def test_health():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


def test_predict_happy_path():
    valid_payload = {
        "Carpet_Area_clean": 1000.0,
        "clean_floor": 2,
        "Bathrooms_clean": 2,
        "Balcony_clean": 1,
        "clean_Car_Parking": 1,
        "location_grouped": "thane",
        "Furnishing": "Semi-Furnished",
        "Transaction": "Resale",
        "Status": "Ready to Move"
    }
    with TestClient(app) as client:
        response = client.post("/predict", json=valid_payload)
        assert response.status_code == 200
        assert "predicted_price" in response.json()
        assert isinstance(response.json()["predicted_price"], float)


def test_predict_invalid_input():
    invalid_payload = {
        "Carpet_Area_clean": "not_a_number", 
        "clean_floor": 2
    }
    with TestClient(app) as client:
        response = client.post("/predict", json=invalid_payload)
        assert response.status_code == 422