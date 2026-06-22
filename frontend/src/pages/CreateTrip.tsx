import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema, type TripFormData } from "@/schemas/tripSchema";
import { BUDGET_TYPES, INTEREST_OPTIONS, TRIP_TYPES } from "@/types/trip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tripService } from "@/services/tripService";

export default function CreateTrip() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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

  const onSubmit = async (data: TripFormData) => {
    try {
      const response = await tripService.generateTrip(data);
      console.log("Backend Response:", response);

      navigate("/trip-summary", {
        state: response,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Create Your Trip</h1>

        <p className="mt-2 text-muted-foreground">
          Tell us about your travel plans and let AI create a personalized
          itinerary.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Destination */}
        <div>
          <label className="mb-2 block font-medium">Destination</label>

          <Input placeholder="e.g. Bali" {...register("destination")} />

          {errors.destination && (
            <p className="mt-1 text-sm text-red-500">
              {errors.destination.message}
            </p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="mb-2 block font-medium">Budget (₹)</label>

          <Input
            type="number"
            placeholder="50000"
            {...register("budget", {
              valueAsNumber: true,
            })}
          />

          {errors.budget && (
            <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <label className="mb-4 block font-medium">Budget Category</label>

          <div className="grid gap-3 sm:grid-cols-3">
            {BUDGET_TYPES.map((type) => (
              <label
                key={type}
                className="cursor-pointer rounded-md border p-3 text-center hover:bg-slate-50"
              >
                <input
                  type="radio"
                  value={type}
                  className="mr-2"
                  {...register("budgetType")}
                />

                {type}
              </label>
            ))}
          </div>

          {errors.budgetType && (
            <p className="mt-2 text-sm text-red-500">
              {errors.budgetType.message}
            </p>
          )}
        </div>
        {/* Travelers */}
        <div>
          <label className="mb-2 block font-medium">Number of Travelers</label>

          <Input
            type="number"
            {...register("travelers", {
              valueAsNumber: true,
            })}
          />

          {errors.travelers && (
            <p className="mt-1 text-sm text-red-500">
              {errors.travelers.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-4 block font-medium">Trip Type</label>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRIP_TYPES.map((type) => (
              <label
                key={type}
                className="cursor-pointer rounded-md border p-3 text-center hover:bg-slate-50"
              >
                <input
                  type="radio"
                  value={type}
                  className="mr-2"
                  {...register("tripType")}
                />

                {type}
              </label>
            ))}
          </div>

          {errors.tripType && (
            <p className="mt-2 text-sm text-red-500">
              {errors.tripType.message}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">Start Date</label>

            <Input
              type="date"
              min={new Date().toDateString().split("T")[0]}
              {...register("startDate")}
            />

            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium">End Date</label>

            <Input
              type="date"
              min={new Date().toDateString().split("T")[0]}
              {...register("endDate")}
            />

            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.endDate.message}
              </p>
            )}
          </div>

          {tripDuration && (
            <div className="rounded-md border bg-slate-50 p-4">
              <p className="font-medium">
                Trip Duration: {tripDuration} Day
                {tripDuration > 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="mb-4 block font-medium">Interests</label>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTEREST_OPTIONS.map((interest) => (
              <label
                key={interest}
                className="flex items-center gap-2 rounded-md border p-3"
              >
                <input
                  type="checkbox"
                  value={interest}
                  {...register("interests")}
                />

                <span>{interest}</span>
              </label>
            ))}
          </div>

          {errors.interests && (
            <p className="mt-2 text-sm text-red-500">
              {errors.interests.message}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full">
          Generate AI Trip Plan
        </Button>
      </form>
    </div>
  );
}
