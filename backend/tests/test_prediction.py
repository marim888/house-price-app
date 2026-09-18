from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _valid_payload() -> dict:
    return {
        "location": "Mumbai",
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "car_parking": 1,
        "furnishing": "Furnished",
        "transaction": "Resale",
        "status": "Ready to Move",
    }


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_happy_path():
    response = client.post("/predict", json=_valid_payload())
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert isinstance(body["predicted_price"], float)
    assert body["predicted_price"] > 0


def test_predict_invalid_input():
    payload = _valid_payload()
    payload["carpet_area_sqft"] = -100  # must be > 0
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
