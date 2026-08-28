import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { setSessionExpiredHandler } from "@/api/client";
import { authService } from "@/services/authService";
import type { LoginPayload, RegisterPayload, User } from "@/types/auth";

import { AuthContext, type AuthContextValue } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The tokens are httpOnly, so JS can't inspect them - asking the API who we
  // are is the session check.
  useEffect(() => {
    let cancelled = false;

    authService
      .getMe()
      .then((me) => {
        if (!cancelled) {
          setUser(me);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Clear local state when the client gives up on refreshing the session.
  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));

    return () => setSessionExpiredHandler(null);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const me = await authService.login(payload);
    setUser(me);
    return me;
  }, []);

  const signup = useCallback(async (payload: RegisterPayload) => {
    const me = await authService.register(payload);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
    }),
    [user, isLoading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
