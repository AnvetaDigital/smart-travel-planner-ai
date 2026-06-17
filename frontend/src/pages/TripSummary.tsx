import { useLocation, Navigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TripFormData } from "@/types/tripForm";

export default function TripSummary() {
    const location = useLocation();

    const trip = location.state as TripFormData | undefined;

    if (!trip) {
        return <Navigate to="/trips/create" replace />;
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="mb-8 text-3xl font-bold">
                Trip Summary
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {trip.destination}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <strong>Budget:</strong> ₹{trip.budget}
                    </div>

                    <div>
                        <strong>Budget Type:</strong> {trip.budgetType}
                    </div>

                    <div>
                        <strong>Travelers:</strong> {trip.travelers}
                    </div>

                    <div>
                        <strong>Trip Type:</strong> {trip.tripType}
                    </div>

                    <div>
                        <strong>Start Date:</strong> {trip.startDate}
                    </div>

                    <div>
                        <strong>End Date:</strong> {trip.endDate}
                    </div>

                    <div>
                        <strong>Interests:</strong>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {trip.interests.map((interest) => (
                                <span
                                    key={interest}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>

                    <Button className="mt-6">
                        Generate AI Itinerary
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}