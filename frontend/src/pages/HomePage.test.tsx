import { screen } from "@testing-library/react";

import HomePage from "./HomePage";
import { renderWithProviders } from "@/test/utils";

describe("HomePage", () => {
  test("renders hero heading", () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText(/Plan Smarter Trips With AI/i)).toBeInTheDocument();
  });

  test("renders feature section heading", () => {
    renderWithProviders(<HomePage />);

    expect(
      screen.getByText(/Why Choose Smart Travel Planner/i),
    ).toBeInTheDocument();
  });
});
