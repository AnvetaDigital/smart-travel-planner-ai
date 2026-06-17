import { apiClient } from "./client";

export const tripApi = {
  generateTrip: async (payload: unknown) => {
    const response = await apiClient.post(
      "/trips/generate",
      payload
    );

    return response.data;
  },
};