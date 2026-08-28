import { authApi } from "@/api/authApi";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

export const authService = {
  register: async (payload: RegisterPayload) => {
    return authApi.register(payload);
  },

  login: async (payload: LoginPayload) => {
    return authApi.login(payload);
  },

  logout: async () => {
    return authApi.logout();
  },

  refresh: async () => {
    return authApi.refresh();
  },

  getMe: async () => {
    return authApi.getMe();
  },
};
