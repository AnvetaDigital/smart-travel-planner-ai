import "@testing-library/jest-dom"
import { vi } from "vitest"

// AuthProvider checks the session on mount. Stub the service so tests never hit
// the network; individual tests override getMe to simulate a signed-in user.
vi.mock("@/services/authService", () => ({
  authService: {
    getMe: vi.fn().mockRejectedValue(new Error("Not authenticated")),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn().mockResolvedValue({ message: "Logged out" }),
    refresh: vi.fn(),
  },
}))
