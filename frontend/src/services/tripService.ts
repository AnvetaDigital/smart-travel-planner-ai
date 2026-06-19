import { tripApi } from "@/api/tripApi";
import type { TripFormData } from "@/types/tripForm";

export const tripService = {
  generateTrip: async (
    payload: TripFormData
  ) => {
    return tripApi.generateTrip(payload);
  },
};