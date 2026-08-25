import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema, type TripFormData } from "@/schemas/tripSchema";
import { BUDGET_TYPES, INTEREST_OPTIONS, TRIP_TYPES } from "@/types/trip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tripService } from "@/services/tripService";
import createTripImage from "@/assets/images/CreateTrip.jpeg";

const optionTile =
  "flex cursor-pointer items-center gap-2 rounded-lg border bg-white p-3 text-sm transition-colors hover:bg-muted/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:font-medium";

const cardClass = "border-white/40 bg-white/90 shadow-xl backdrop-blur";

export default function CreateTrip() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      destination: "",
      travelers: 1,
      interests: [],
      tripType: "",
      budgetType: "",
    },
  });

  const navigate = useNavigate();

  const startDate = useWatch({
    control,
    name: "startDate",
  });

  const endDate = useWatch({
    control,
    name: "endDate",
  });

  const today = new Date().toISOString().split("T")[0];

  const tripDuration = (() => {
    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end.getTime() - start.getTime();

    if (diffTime < 0) {
      return null;
    }

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  })();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: TripFormData) => {
    setSubmitError(null);

    try {
      const response = await tripService.generateTrip(data);

      navigate("/trip-summary", {
        state: response,
      });
    } catch (error) {
      console.error(error);

      setSubmitError(
        "We couldn't generate your itinerary. Please try again in a moment."
      );
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-fixed bg-center"
      style={{
        backgroundImage: `url(${createTripImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16">
        <div className="mb-10 text-white">
          <h1 className="text-3xl font-bold tracking-tight">Create Your Trip</h1>

          <p className="mt-2 text-slate-200">
            Tell us about your travel plans and let AI create a personalized
            itinerary.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>Where and when</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Destination
                </label>

                <Input placeholder="e.g. Bali" {...register("destination")} />

                {errors.destination && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.destination.message}
                  </p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Start Date
                  </label>

                  <Input type="date" min={today} {...register("startDate")} />

                  {errors.startDate && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    End Date
                  </label>

                  <Input
                    type="date"
                    min={startDate || today}
                    {...register("endDate")}
                  />

                  {errors.endDate && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {tripDuration && (
                <p className="rounded-lg border bg-muted/50 p-3 text-sm">
                  <span className="text-muted-foreground">Trip duration: </span>

                  <span className="font-semibold">
                    {tripDuration} day{tripDuration > 1 ? "s" : ""}
                  </span>
                </p>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Number of Travelers
                </label>

                <Input
                  type="number"
                  min={1}
                  className="md:max-w-40"
                  {...register("travelers", {
                    valueAsNumber: true,
                  })}
                />

                {errors.travelers && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.travelers.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Total budget (₹)
                </label>

                <Input
                  type="number"
                  min={0}
                  placeholder="50000"
                  {...register("budget", {
                    valueAsNumber: true,
                  })}
                />

                {errors.budget && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.budget.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium">
                  Budget Category
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  {BUDGET_TYPES.map((type) => (
                    <label key={type} className={optionTile}>
                      <input
                        type="radio"
                        value={type}
                        className="accent-primary"
                        {...register("budgetType")}
                      />

                      <span>{type}</span>
                    </label>
                  ))}
                </div>

                {errors.budgetType && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.budgetType.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>Trip Type</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TRIP_TYPES.map((type) => (
                  <label key={type} className={optionTile}>
                    <input
                      type="radio"
                      value={type}
                      className="accent-primary"
                      {...register("tripType")}
                    />

                    <span>{type}</span>
                  </label>
                ))}
              </div>

              {errors.tripType && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.tripType.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>Interests</CardTitle>

              <p className="text-sm text-muted-foreground">
                Pick everything you'd like the itinerary to lean towards.
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {INTEREST_OPTIONS.map((interest) => (
                  <label key={interest} className={optionTile}>
                    <input
                      type="checkbox"
                      value={interest}
                      className="accent-primary"
                      {...register("interests")}
                    />

                    <span>{interest}</span>
                  </label>
                ))}
              </div>

              {errors.interests && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.interests.message}
                </p>
              )}
            </CardContent>
          </Card>

          {submitError && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {submitError}
            </p>
          )}

          <div className="space-y-2">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating your itinerary...
                </span>
              ) : (
                "Generate AI Trip Plan"
              )}
            </Button>

            {isSubmitting && (
              <p className="text-center text-xs text-muted-foreground">
                This usually takes up to a minute. Please keep this page open.
              </p>
            )}
            </div>
        </form>
      </div>
    </div>
  );
}
