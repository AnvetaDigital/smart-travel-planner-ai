import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { AuthProvider } from "@/context/AuthProvider";
import { authService } from "@/services/authService";
import type { User } from "@/types/auth";

export const testUser: User = {
  id: 1,
  email: "ada@example.com",
  fullName: "Ada Lovelace",
};

/** Make the mocked session check resolve to a signed-in user. */
export function signIn(user: User = testUser) {
  vi.mocked(authService.getMe).mockResolvedValue(user);
  return user;
}

/** Make the mocked session check report a signed-out visitor. */
export function signOut() {
  vi.mocked(authService.getMe).mockRejectedValue(new Error("Not authenticated"));
}

export function renderWithProviders(
  ui: ReactNode,
  { route = "/" }: { route?: string } = {},
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
}
