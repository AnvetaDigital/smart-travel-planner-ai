import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { ROUTES } from "@/constants/routes";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 120000,
  // Auth tokens live in httpOnly cookies, so the browser must be told to send
  // them on cross-origin requests.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean };

/** Endpoints whose own 401 means "bad credentials", not "expired session". */
const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

/** Lets subscribers (AuthContext) react when the session is definitively gone. */
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

// A single in-flight refresh shared by every request that got a 401, so N
// parallel failures trigger one refresh rather than N.
let refreshPromise: Promise<void> | null = null;

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriableRequest | undefined;

    const shouldRefresh =
      error.response?.status === 401 &&
      request &&
      !request._retried &&
      !NO_REFRESH_PATHS.some((path) => request.url?.startsWith(path));

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    request._retried = true;

    try {
      await refreshSession();
      return await apiClient(request);
    } catch (refreshError) {
      onSessionExpired?.();

      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.assign(ROUTES.LOGIN);
      }

      return Promise.reject(refreshError);
    }
  },
);
