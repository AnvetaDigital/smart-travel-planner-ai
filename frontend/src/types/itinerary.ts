export interface DayPlan {
  day: number;
  title: string;
  activities: string[];
}

export interface Itinerary {
  tripOverview: string;
  dayWisePlan: DayPlan[];
  travelTips: string[];
  estimatedBudget: string;
}

export interface GenerateTripResponse {
  destination: string;
  itinerary: Itinerary;
}