import { screen } from "@testing-library/react";
import { beforeEach } from "vitest";

import AppRoutes from "./AppRoutes";
import { ROUTES } from "@/constants/routes";
import { renderWithProviders, signIn, signOut } from "@/test/utils";

describe("App Routes", () => {
  beforeEach(() => {
    signOut();
  });

  test("renders the login page", async () => {
    renderWithProviders(<AppRoutes />, { route: ROUTES.LOGIN });

    expect(await screen.findByText("Welcome Back")).toBeInTheDocument();
  });

  test("redirects a signed-out visitor away from a protected route", async () => {
    renderWithProviders(<AppRoutes />, { route: ROUTES.CHAT });

    expect(await screen.findByText("Welcome Back")).toBeInTheDocument();
  });

  test("redirects a signed-in user away from the login page", async () => {
    signIn();

    renderWithProviders(<AppRoutes />, { route: ROUTES.LOGIN });

    expect(screen.queryByText("Welcome Back")).not.toBeInTheDocument();
  });
});
