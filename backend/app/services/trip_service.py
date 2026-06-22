import json

from app.schemas.trip_schema import TripRequest
from app.services.gemini_service import GeminiService


class TripService:

    @staticmethod
    def generate_trip(trip: TripRequest):
        prompt = f"""
Generate a travel itinerary in STRICT JSON format.

Destination: {trip.destination}
Budget: {trip.budget}
Budget Type: {trip.budgetType}
Travelers: {trip.travelers}
Trip Type: {trip.tripType}
Start Date: {trip.startDate}
End Date: {trip.endDate}

Interests:
{", ".join(trip.interests)}

Return ONLY valid JSON.

Expected format:

{{
  "tripOverview": "string",
  "dayWisePlan": [
    {{
      "day": 1,
      "title": "string",
      "activities": [
        "activity 1",
        "activity 2"
      ]
    }}
  ],
  "travelTips": [
    "tip 1",
    "tip 2"
  ],
  "estimatedBudget": "string"
}}

Rules:
1. Return ONLY JSON.
2. Do not return markdown.
3. Do not wrap response in ```json.
4. Do not add explanations before or after JSON.
5. Generate a complete itinerary based on the provided trip details.
"""

        itinerary = GeminiService.generate_itinerary(prompt)

        try:
            cleaned_response = (
                itinerary.replace("```json", "")
                .replace("```", "")
                .strip()
            )

            itinerary_json = json.loads(cleaned_response)

            return {
                "destination": trip.destination,
                "itinerary": itinerary_json,
            }

        except Exception as e:
            print("JSON Parse Error:", e)

            return {
                "destination": trip.destination,
                "itinerary": itinerary,
                "parseError": str(e),
            }