import { screen } from "@testing-library/react";
import { beforeEach } from "vitest";

import Navbar from "./Navbar";
import { renderWithProviders, signIn, signOut, testUser } from "@/test/utils";

describe("Navbar", () => {
  beforeEach(() => {
    signOut();
  });

  test("renders application title", () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText("Smart Travel Planner")).toBeInTheDocument();
  });

  test("shows login and signup when signed out", async () => {
    renderWithProviders(<Navbar />);

    expect(await screen.findAllByText("Login")).not.toHaveLength(0);
    expect(screen.getAllByText("Signup")).not.toHaveLength(0);
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  test("shows the user's name and logout when signed in", async () => {
    signIn();

    renderWithProviders(<Navbar />);

    expect(await screen.findAllByText(testUser.fullName)).not.toHaveLength(0);
    expect(screen.getAllByText("Logout")).not.toHaveLength(0);
    expect(screen.queryByText("Signup")).not.toBeInTheDocument();
  });
});
