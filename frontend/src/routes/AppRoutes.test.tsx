import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

describe("App Routes", () => {
  test("renders login page route", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText("LoginPage")).toBeInTheDocument();
  });
});
