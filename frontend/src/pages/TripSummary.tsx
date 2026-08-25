import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GenerateTripResponse } from "@/types/itinerary";

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatDuration(minutes: number) {
  if (!minutes) {
    return null;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours && rest) {
    return `${hours}h ${rest}m`;
  }

  if (hours) {
    return `${hours}h`;
  }

  return `${rest}m`;
}

export default function TripSummary() {
  const location = useLocation();

  const trip = location.state as GenerateTripResponse | undefined;

  if (!trip) {
    return <Navigate to="/trips/create" replace />;
  }

  const { itinerary } = trip;
  const { budget } = itinerary;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">AI Travel Plan</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{trip.destination}</CardTitle>

          <p className="text-sm text-muted-foreground">
            {formatDate(trip.startDate)} &ndash; {formatDate(trip.endDate)}
            {" · "}
            {trip.travelers} {trip.travelers === 1 ? "traveller" : "travellers"}
            {" · "}
            {trip.tripType}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="leading-relaxed">{itinerary.tripOverview}</p>

          <div className="flex flex-wrap gap-2">
            {itinerary.highlights.map((highlight, index) => (
              <span
                key={index}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
              >
                {highlight}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {itinerary.dayWisePlan.map((day) => (
          <Card key={day.day}>
            <CardHeader>
              <CardTitle>
                Day {day.day}: {day.title}
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                {formatDate(day.date)}
              </p>

              <p className="pt-2 text-sm leading-relaxed">{day.summary}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <ol className="relative space-y-6 border-l border-border pl-6">
                {day.activities.map((activity, index) => (
                  <li key={index} className="relative">
                    <span className="absolute left-[-1.9rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />

                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-mono text-sm font-semibold">
                        {activity.time}
                      </span>

                      <span className="font-semibold">{activity.title}</span>

                      {formatDuration(activity.durationMinutes) && (
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(activity.durationMinutes)}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {activity.location}
                    </p>

                    <p className="mt-2 text-sm leading-relaxed">
                      {activity.description}
                    </p>

                    <p className="mt-2 text-sm italic text-muted-foreground">
                      {activity.whyThisPick}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {activity.estimatedCost}
                      </span>

                      {activity.bookingRequired && (
                        <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
                          Booking required
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {day.meals?.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {day.meals.map((meal, index) => (
                    <div key={index} className="rounded-lg border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {meal.slot}
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {meal.suggestion}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {meal.cuisine} · {meal.estimatedCost}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <p className="border-t pt-4 text-sm">
                <span className="text-muted-foreground">Day total: </span>
                <span className="font-semibold">{day.dayEstimatedCost}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {budget.lines.map((line, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 pr-4 align-top font-medium">
                      {line.category}

                      <p className="mt-1 text-xs font-normal text-muted-foreground">
                        {line.notes}
                      </p>
                    </td>

                    <td className="py-3 text-right align-top font-mono whitespace-nowrap">
                      {budget.currency} {line.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td className="pt-3 font-semibold">Total</td>

                  <td className="pt-3 text-right font-mono font-semibold whitespace-nowrap">
                    {budget.currency} {budget.total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p
            className={`rounded-lg border p-3 text-sm ${
              budget.fitsStatedBudget
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {budget.verdict}
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Travel Tips</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {itinerary.travelTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Packing List</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {itinerary.packingList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Around</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-relaxed">{itinerary.gettingAround}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What To Expect</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-relaxed">{itinerary.bestTimeNotes}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}