from pydantic import BaseModel, Field
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


class Activity(BaseModel):
    time: str = Field(
        description="Clock time the activity starts, 24-hour format, e.g. '09:30'."
    )
    title: str = Field(
        description="Short name of the activity, e.g. 'Sunrise kayaking at Sal Backwaters'."
    )
    description: str = Field(
        description=(
            "Two or three sentences on what actually happens here and what to "
            "expect. Concrete details only - no filler adjectives."
        )
    )
    location: str = Field(
        description=(
            "The real, named venue or place, with the neighbourhood or area. "
            "Never a generic phrase like 'a local restaurant' or 'the city centre'."
        )
    )
    durationMinutes: int = Field(
        description="Realistic time spent here, in minutes, including queueing."
    )
    estimatedCost: str = Field(
        description=(
            "Cost with the destination's currency symbol and the unit, e.g. "
            "'Rs 1,200 per person' or 'Free'."
        )
    )
    bookingRequired: bool = Field(
        description="True if tickets, a table or a slot must be reserved ahead of time."
    )
    whyThisPick: str = Field(
        description=(
            "One sentence naming the traveller's specific interests, trip type or "
            "budget level and explaining why this choice suits them. Must reference "
            "their actual inputs, not generic praise."
        )
    )


class Meal(BaseModel):
    slot: str = Field(description="One of 'Breakfast', 'Lunch' or 'Dinner'.")
    suggestion: str = Field(
        description="A real, named restaurant or eatery with its area, plus the dish to order."
    )
    cuisine: str = Field(description="Cuisine or style, e.g. 'Goan seafood'.")
    estimatedCost: str = Field(
        description="Cost for the whole party with currency symbol, e.g. 'Rs 1,600 for two'."
    )


class DayPlan(BaseModel):
    day: int = Field(description="Day number of the trip, starting at 1.")
    date: str = Field(description="The real calendar date for this day, as YYYY-MM-DD.")
    title: str = Field(description="A short theme for the day, e.g. 'North Goa beaches and sunset'.")
    summary: str = Field(description="One or two sentences framing how the day flows.")
    activities: List[Activity] = Field(
        description=(
            "Three to five activities in chronological order. Leave real travel "
            "time between stops - never cram the day."
        )
    )
    meals: List[Meal] = Field(description="Breakfast, lunch and dinner suggestions for this day.")
    dayEstimatedCost: str = Field(
        description="Total spend for this day for the whole party, with currency symbol."
    )


class BudgetLine(BaseModel):
    category: str = Field(
        description="Spend category, e.g. 'Accommodation', 'Food', 'Local transport', 'Activities'."
    )
    amount: float = Field(description="Amount for this category, as a plain number, no symbol.")
    notes: str = Field(description="One short line on what this covers and the assumption behind it.")


class BudgetBreakdown(BaseModel):
    currency: str = Field(description="Currency code inferred from the destination, e.g. 'INR'.")
    lines: List[BudgetLine] = Field(
        description="Category-by-category breakdown. The amounts must add up to 'total'."
    )
    total: float = Field(description="Sum of all line amounts. Must equal the sum exactly.")
    fitsStatedBudget: bool = Field(
        description="True only if 'total' is at or under the budget the traveller stated."
    )
    verdict: str = Field(
        description=(
            "Honest one or two sentence assessment against the stated budget. If the "
            "plan costs more, say so plainly and name what to cut. Do not pretend it fits."
        )
    )


class Itinerary(BaseModel):
    tripOverview: str = Field(
        description=(
            "A warm, specific paragraph addressed to the traveller, explaining the "
            "shape of the trip and the reasoning behind how the days were arranged."
        )
    )
    highlights: List[str] = Field(
        description="Four to six short phrases naming the standout moments of this trip."
    )
    dayWisePlan: List[DayPlan] = Field(
        description="One entry per day of the trip, in order, covering every date in the range."
    )
    budget: BudgetBreakdown
    travelTips: List[str] = Field(
        description=(
            "Four to six practical, destination-specific tips - scams to avoid, local "
            "customs, timing tricks. No generic advice like 'stay hydrated'."
        )
    )
    packingList: List[str] = Field(
        description="Items worth packing for this destination, season and set of activities."
    )
    gettingAround: str = Field(
        description="How to move around locally, with real options and typical fares."
    )
    bestTimeNotes: str = Field(
        description="What the weather and crowds will actually be like on these dates."
    )


class GenerateTripResponse(BaseModel):
    destination: str
    tripType: str
    travelers: int
    startDate: str
    endDate: str
    itinerary: Itinerary
