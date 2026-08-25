from fastapi import APIRouter

from app.schemas.trip_schema import GenerateTripResponse, TripRequest
from app.services.trip_service import TripService

router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)

@router.post("/generate", response_model=GenerateTripResponse)
def generate_trip(trip: TripRequest):
    return TripService.generate_trip(trip)