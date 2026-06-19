from pydantic import BaseModel
from typing import List

class TripRequest(BaseModel):
    destination: str
    budget: float
    budgetType: str
    travelers: int
    tripType: str
    startDate: str
    endDate: str
    interests: List[str]