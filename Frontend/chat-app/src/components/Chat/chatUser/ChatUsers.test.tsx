import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import ChatContext from "../context/ChatContext";
import { ChatUsers } from "./ChatUsers";
import Cookies from "js-cookie";
import { ThemeProvider } from "styled-components";
import user from "@testing-library/user-event";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
}));

const mockContextValue = {
  chatMessages: [],
  setChatMessages: () => {},
  setChatUsers: () => {},
  onlineUsers: [],
  setOnlineUsers: () => {},
  currentChatWith: undefined,
  setCurrentChatWith: () => {},
  displayOnlineUsers: true,
  setDisplayOnlinUsers: () => {},

  chatUsers: [
    {
      user: "testUser1",
      status: "online",
      userId: "testUser1",
      unreadMsgs: 1,
      recentMsg: "test unread message",
    },
    {
      user: "testUser2",
      status: "offline",
      userId: "testUser2",
      unreadMsgs: 0,
      recentMsg: "test2 unread message",
    },
  ],
};

const customTheme = {
  palette: {
    primary: {
      light: "",
      main: "",
      dark: "",
    },
    border: {
      main: "",
    },
    bright: {
      light: "",
    },
  },
};

const renderComponent = () =>
  render(
    <ThemeProvider theme={customTheme}>
      <ChatUsers />
    </ThemeProvider>
  );

describe("ChatUser component", () => {
  test("should render loggedIn userName", () => {
    const mockUsername = "TestUser";
    (Cookies.get as jest.Mock).mockReturnValue(mockUsername);

    renderComponent();

    const loggedInUserElement = screen.getByRole("heading", { level: 5 });

    expect(loggedInUserElement).toBeInTheDocument();
  });

  test("should have a personadd icon button", () => {
    renderComponent();
    const personAddIconElement = screen.getByRole("button");

    expect(personAddIconElement).toBeInTheDocument();
  });
});
