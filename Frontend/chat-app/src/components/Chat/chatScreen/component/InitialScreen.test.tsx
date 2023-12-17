import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import { InitialScreen } from "./InitialScreen";

test("should render initial screen", () => {
  render(<InitialScreen />);
  const initialScrenHeading = screen.getByRole("heading", { level: 3 });
  expect(initialScrenHeading).toBeInTheDocument();
});
