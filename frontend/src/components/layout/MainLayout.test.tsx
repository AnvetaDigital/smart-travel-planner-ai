import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MainLayout from "./MainLayout";

describe("MainLayout", () => {
  test("renders navbar text", () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    );

    expect(screen.getByText("Smart Travel Planner")).toBeInTheDocument();
  });
});
