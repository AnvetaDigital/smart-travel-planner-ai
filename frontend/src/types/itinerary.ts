export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  durationMinutes: number;
  estimatedCost: string;
  bookingRequired: boolean;
  whyThisPick: string;
}

export interface Meal {
  slot: string;
  suggestion: string;
  cuisine: string;
  estimatedCost: string;
}

export interface DayPlan {
  day: number;
  date: string;
  title: string;
  summary: string;
  activities: Activity[];
  meals: Meal[];
  dayEstimatedCost: string;
}

export interface BudgetLine {
  category: string;
  amount: number;
  notes: string;
}

export interface BudgetBreakdown {
  currency: string;
  lines: BudgetLine[];
  total: number;
  fitsStatedBudget: boolean;
  verdict: string;
}

export interface Itinerary {
  tripOverview: string;
  highlights: string[];
  dayWisePlan: DayPlan[];
  budget: BudgetBreakdown;
  travelTips: string[];
  packingList: string[];
  gettingAround: string;
  bestTimeNotes: string;
}

export interface GenerateTripResponse {
  destination: string;
  tripType: string;
  travelers: number;
  startDate: string;
  endDate: string;
  itinerary: Itinerary;
}