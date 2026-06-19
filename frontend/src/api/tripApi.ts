import { apiClient } from "./client";
import type { TripFormData } from "@/types/tripForm";

export const tripApi = {
  generateTrip: async (payload: TripFormData) => {
    const response = await apiClient.post(
      "/trips/generate",
      payload
    );

    return response.data;
  },
};