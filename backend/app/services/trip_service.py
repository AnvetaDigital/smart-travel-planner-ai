from app.schemas.trip_schema import GenerateTripResponse, TripRequest
from app.services.gemini_service import GeminiService

SYSTEM_INSTRUCTION = """
You are a seasoned travel planner who has personally spent time in the
destination you are asked about. You are writing for one specific traveller,
not producing a brochure.

Hold yourself to these standards:

1. Name real places. Every activity, restaurant and stop must be an actual,
   named venue with its neighbourhood. Never write "a local restaurant",
   "a nearby beach" or "the city centre". If you are not confident a place
   exists, choose one you are confident about instead.
   This holds even when the traveller has not booked yet. For accommodation,
   name two or three specific properties that suit the budget level. For
   breakfast, never write "breakfast at your hotel" or "a local cafe" - name
   an actual cafe or bakery. There is always a real name available; find it.
2. Be concrete. Every activity carries a clock time, a realistic duration and
   a cost. Costs use the destination's own currency symbol.
3. Pace the days honestly. Account for travel time between stops, meals and
   rest. Three to five activities a day is right; nine is not. A day that ends
   with a late night out starts later the next morning.
4. Justify your choices. In whyThisPick, refer to the traveller's stated
   interests, trip type or budget level by name and say why this stop suits
   them. Generic praise is a failure.
5. Cover every date. Derive the number of days from the start and end dates
   inclusive, and give each day its real calendar date.
6. Be straight about money. Budget line amounts must add up exactly to the
   total. Compare that total against the budget the traveller stated. If the
   plan costs more, say so plainly and name what to cut. Never claim a plan
   fits when it does not.
7. Write like a person. Warm, direct, specific. No filler adjectives, no
   "immerse yourself in the vibrant culture".
"""


class TripService:

    @staticmethod
    def generate_trip(trip: TripRequest) -> GenerateTripResponse:
        prompt = f"""
Plan a trip with these details:

Destination: {trip.destination}
Travel dates: {trip.startDate} to {trip.endDate} (inclusive)
Travellers: {trip.travelers}
Trip type: {trip.tripType}
Total budget: {trip.budget} (this is the whole party's budget, not per person)
Budget level: {trip.budgetType}
Interests: {", ".join(trip.interests)}

Infer the local currency from the destination and price everything in it.
Shape the itinerary around the stated interests and the {trip.tripType} trip
type, at a {trip.budgetType} level of spending.
"""

        itinerary = GeminiService.generate_itinerary(
            prompt=prompt,
            system_instruction=SYSTEM_INSTRUCTION,
        )

        # The model is unreliable at arithmetic - it has claimed a total that
        # disagreed with its own line items, and called that a fit. Recompute
        # both from the lines so the numbers shown are always self-consistent.
        itinerary.budget.total = round(
            sum(line.amount for line in itinerary.budget.lines), 2
        )
        itinerary.budget.fitsStatedBudget = itinerary.budget.total <= trip.budget

        # The model writes the verdict prose before we correct its total, so it
        # can contradict the recomputed figure. Lead with the computed truth.
        difference = abs(itinerary.budget.total - trip.budget)

        if difference < 1:
            headline = (
                f"This plan comes to {itinerary.budget.total:,.0f}, landing right "
                f"on your stated budget of {trip.budget:,.0f}."
            )
        elif itinerary.budget.fitsStatedBudget:
            headline = (
                f"This plan comes to {itinerary.budget.total:,.0f} against your "
                f"stated budget of {trip.budget:,.0f} - "
                f"{difference:,.0f} under."
            )
        else:
            headline = (
                f"This plan comes to {itinerary.budget.total:,.0f}, which is "
                f"{difference:,.0f} over your stated budget of {trip.budget:,.0f}."
            )

        itinerary.budget.verdict = f"{headline} {itinerary.budget.verdict}"

        return GenerateTripResponse(
            destination=trip.destination,
            tripType=trip.tripType,
            travelers=trip.travelers,
            startDate=trip.startDate,
            endDate=trip.endDate,
            itinerary=itinerary,
        )
