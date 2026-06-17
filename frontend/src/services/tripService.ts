import { tripApi } from "@/api/tripApi";

export const tripService = {
  generateTrip: async (payload: unknown) => {
    return tripApi.generateTrip(payload);
  },
};