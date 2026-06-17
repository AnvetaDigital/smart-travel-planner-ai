import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const tripSchema = z
  .object({
    destination: z.string().min(2, "Destination is required"),

    budget: z.number().min(1000, "Budget must be at least 1000"),

    travelers: z.number().min(1, "At least one traveler is required"),

    startDate: z.string().min(1, "Start date is required"),

    endDate: z.string().min(1, "End date is required"),

    interests: z.array(z.string()).min(1, "Select at least one interest"),

    tripType: z.string().min(1, "Please select trip type"),

    budgetType: z.string().min(1, "Please select budget type"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      return startDate >= today;
    },
    {
      message: "Start date cannot be in the past",
      path: ["startDate"],
    },
  )
  .refine(
    (data) => {
      const endDate = new Date(data.endDate);
      return endDate >= today;
    },
    {
      message: "End date cannot be in the past",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      return endDate >= startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type TripFormData = z.infer<typeof tripSchema>;
