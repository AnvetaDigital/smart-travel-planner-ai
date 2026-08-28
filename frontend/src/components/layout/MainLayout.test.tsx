import { screen } from "@testing-library/react";

import MainLayout from "./MainLayout";
import { renderWithProviders } from "@/test/utils";

describe("MainLayout", () => {
  test("renders navbar text", () => {
    renderWithProviders(<MainLayout />);

    expect(screen.getByText("Smart Travel Planner")).toBeInTheDocument();
  });
});
