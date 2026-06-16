import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { render, screen } from "@testing-library/react";

describe("Navbar", () => {
  test("renders application title", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Smart Travel Planner")).toBeInTheDocument();
  });
});
