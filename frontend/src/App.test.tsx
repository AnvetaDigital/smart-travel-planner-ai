import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  test("renderes plan my trip button", () => {
    render(<App />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
