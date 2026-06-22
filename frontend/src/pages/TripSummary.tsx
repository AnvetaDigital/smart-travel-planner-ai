import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GenerateTripResponse } from "@/types/itinerary";


export default function TripSummary() {
    const location = useLocation();

  const trip = location.state as GenerateTripResponse | undefined;

    if (!trip) {
        return <Navigate to="/trips/create" replace />;
    }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        AI Travel Plan
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {trip.destination}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p>{trip.itinerary.tripOverview}</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {trip.itinerary.dayWisePlan.map((day) => (
          <Card key={day.day}>
            <CardHeader>
              <CardTitle>
                Day {day.day}: {day.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="list-disc space-y-2 pl-5">
                {day.activities.map((activity, index) => (
                  <li key={index}>
                    {activity}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            Travel Tips
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="list-disc space-y-2 pl-5">
            {trip.itinerary.travelTips.map((tip, index) => (
              <li key={index}>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            Estimated Budget
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p>{trip.itinerary.estimatedBudget}</p>
        </CardContent>
      </Card>
    </div>
  );
}