import App from "./App";
import { renderWithProviders } from "@/test/utils";

describe("App", () => {
  test("renders without crashing", () => {
    renderWithProviders(<App />);
  });
});
