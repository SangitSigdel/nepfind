import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import { ThemeProvider } from "styled-components";
import { UserNameView } from "./UserNameView";

const mockUser = {
  user: "test",
  status: "online",
  userId: "test",
  unreadMsgs: 0,
  recentMsg: "test message",
};

const mockTheme = {
  palette: {
    bright: {
      light: "#ffff",
    },
  },
};

const renderElement = () =>
  render(
    <ThemeProvider theme={mockTheme}>
      <UserNameView user={mockUser} />
    </ThemeProvider>
  );

describe("UserNameView component", () => {
  test("should display user name", () => {
    renderElement();

    const userNameElement = screen.getByText("test");
    expect(userNameElement).toBeInTheDocument();
  });

  test("should display status circle", () => {
    renderElement();
    const statusCircle = screen.getByTestId("statusCircle");

    expect(statusCircle).toHaveStyle("background-color:green");
  });
});
