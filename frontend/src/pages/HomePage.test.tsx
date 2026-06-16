import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

describe("HomePage", () => {
  test("renders hero heading", () => {
    render(<HomePage />);

    expect(screen.getByText(/Plan Smarter Trips With AI/i)).toBeInTheDocument();
  });

  test("renders feature section heading", ()=>{
    render(<HomePage/>);

    expect(
      screen.getByText(/Why Choose Smart Travel Planner/i)
    ).toBeInTheDocument();
  })
});
