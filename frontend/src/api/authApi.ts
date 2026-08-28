import { apiClient } from "./client";
import type { LoginPayload, RegisterPayload, User } from "@/types/auth";

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const response = await apiClient.post<User>("/auth/register", payload);

    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await apiClient.post<User>("/auth/login", payload);

    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");

    return response.data;
  },

  refresh: async () => {
    const response = await apiClient.post<User>("/auth/refresh");

    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<User>("/auth/me");

    return response.data;
  },
};
