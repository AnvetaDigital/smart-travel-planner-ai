import { createContext } from "react";

import type { LoginPayload, RegisterPayload, User } from "@/types/auth";

export interface AuthContextValue {
  user: User | null;
  /** True until the initial session check finishes, so routes don't flash. */
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  signup: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
