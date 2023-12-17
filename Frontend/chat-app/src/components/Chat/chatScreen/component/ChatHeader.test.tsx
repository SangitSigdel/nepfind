import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import { ChatHeader } from "./ChatHeader";
import { ThemeProvider } from "styled-components";
import theme from "../../../../utils/theme";

const customTheme = {
  palette: {
    primary: {
      light: "#202c33",
    },
    bright: {
      main: "#ffff",
    },
  },
};

describe("ChatHeader component", () => {
  const mockCurrentChatWith = "testUser";
  test("renders correct user name heading", () => {
    render(
      <ThemeProvider theme={customTheme}>
        <ChatHeader currentChatWith={mockCurrentChatWith} />
      </ThemeProvider>
    );
    const currentChatWithHeading = screen.getByText(mockCurrentChatWith);
    expect(currentChatWithHeading).toBeInTheDocument();
  });
  test("applies the correct heading size", () => {
    render(
      <ThemeProvider theme={customTheme}>
        <ChatHeader currentChatWith={mockCurrentChatWith} />
      </ThemeProvider>
    );
    const headerElement = screen.getByRole("heading", { level: 6 });
    expect(headerElement).toBeInTheDocument();
  });
});
